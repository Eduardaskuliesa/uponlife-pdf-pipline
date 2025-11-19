import { Hono } from "hono";
import { Book } from "../entities/book.entity";
import { Question } from "../entities/questions.entity";
import { Section } from "../entities/section.entity";
import { In } from "typeorm";
import { buildBlankPage, buildHtml, buildTitlePage } from "../lib/html";
import { buildDummyToc, buildRealToc } from "../lib/toc";
import { File } from "../entities/file.entity";
import { supabase } from "../services/supabase-client";
import { Heading } from "../lib/create-heading-block";
import { HeadingBlock } from "../types/block";
import {
  addFooterLogo,
  addPageNumbers,
  addWatermark,
  generatePdf,
  mergePdfs,
} from "../lib/pdf";
import { PDFDocument } from "pdf-lib";
import { buildCoverLayout } from "../services/pdf/build-cover-layout";
import { getBookCoverImage } from "../helpers/get-book-cover-image";
import { uploadToSupabase } from "../services/s3";

export const pdfRoutes = new Hono();

pdfRoutes.post("/generate-pdf/:bookId", async (c) => {
  console.time("Total PDF Generation Time");
  const bookId = c.req.param("bookId");

  try {
    // ========== PHASE 1: DATA FETCHING ==========
    console.time("Phase 1: Data Fetching");
    const book = await Book.findOne({ where: { id: bookId } });
    if (!book) {
      return c.json({ error: "Book not found" }, 404);
    }

    const questions = await Question.find({
      where: { book_id: bookId, answered: true },
      order: { sequence: "ASC" },
    });

    if (questions.length === 0) {
      return c.json({ error: "No questions found" }, 404);
    }

    const sections = await Section.find({
      where: { question_id: In(questions.map((q) => q.id)) },
    });
    console.timeEnd("Phase 1: Data Fetching");

    // ========== PHASE 2: TITLE PAGE GENERATION ==========
    console.time("Phase 2: Title Page Generation");
    const titlePageHtml = buildTitlePage(book.author_name || "", book.title);
    const titlePdfBuffer = (await generatePdf(titlePageHtml)) as ArrayBuffer;
    const titlePageWithNumbers = await addPageNumbers(titlePdfBuffer, 1, true);
    const titlePagePdf = await addFooterLogo(titlePageWithNumbers);
    const titlePagePageCount = (
      await PDFDocument.load(titlePagePdf)
    ).getPageCount();
    console.timeEnd("Phase 2: Title Page Generation");

    // ========== PHASE 3: DATA NORMALIZATION ==========
    console.time("Phase 3: Data Normalization");
    const sectionsByQuestion = sections.reduce((acc, section) => {
      const key = String(section.question_id);
      if (!acc[key]) acc[key] = [];
      acc[key].push(section);
      return acc;
    }, {} as Record<string, typeof sections>);

    Object.keys(sectionsByQuestion).forEach((questionId) => {
      sectionsByQuestion[questionId].sort(
        (a, b) => Number(a.sequence) - Number(b.sequence)
      );

      const question = questions.find((q) => String(q.id) === questionId);
      if (question) {
        const headingBlock = new (Heading as any)(
          question.id,
          question.question
        );
        sectionsByQuestion[questionId].unshift(headingBlock);
      }
    });

    async function normalizeBlock(item: Section | HeadingBlock) {
      switch (item.type) {
        case "heading":
          return { type: "heading", content: "text" in item ? item.text : "" };

        case "image": {
          try {
            const parsedContent =
              typeof item.content === "string"
                ? JSON.parse(item.content)
                : item.content;
            const imageUrl = parsedContent?.data?.file?.url;
            const imageId = imageUrl?.split("/").pop();
            
            if (!imageId) {
              console.warn("Image block missing URL, skipping");
              return null;
            }

            const file = await File.findOne({ where: { id: imageId } });
            if (!file?.path) {
              console.warn(`File not found: ${imageId}, skipping`);
              return null;
            }

            const { data } = await supabase.storage
              .from("files")
              .download(file.path);
            if (!data) {
              console.warn(`Failed to download image: ${file.path}, skipping`);
              return null;
            }

            const arrayBuffer = await data.arrayBuffer();
            const base64 = Buffer.from(arrayBuffer).toString("base64");
            const mimeType = file.path.endsWith(".png")
              ? "image/png"
              : "image/jpeg";

            return {
              type: "image",
              content: item.content?.data?.file?.caption || "",
              imgUrl: `data:${mimeType};base64,${base64}`,
            };
          } catch (error) {
            console.warn("Error processing image block, skipping:", error);
            return null;
          }
        }

        case "paragraph":
          return { type: "paragraph", content: item.content?.data?.text || "" };

        default:
          console.warn(`Unknown block type: ${item.type}, skipping`);
          return null;
      }
    }

    const normalizedChapters = await Promise.all(
      questions.map(async (question) => {
        const questionSections = sectionsByQuestion[String(question.id)] || [];
        const blocks = (await Promise.all(questionSections.map(normalizeBlock)))
          .filter((block): block is Exclude<typeof block, null> => block !== null);
        return { question, blocks };
      })
    );
    console.timeEnd("Phase 3: Data Normalization");

    // ========== PHASE 4: TOC PAGE CALCULATION ==========
    console.time("Phase 4: TOC Calculation");
    const chapterTitles = questions
      .map((q) => q.question)
      .filter((title): title is string => title !== undefined);

    const dummyTocHtml = buildDummyToc(chapterTitles);
    const dummyTocBuffer = (await generatePdf(dummyTocHtml)) as ArrayBuffer;
    const tocPageCount = (
      await PDFDocument.load(dummyTocBuffer)
    ).getPageCount();

    const totalFrontPages = titlePagePageCount + tocPageCount;
    const needsBlankPageAfterToc = totalFrontPages % 2 === 1;
    let currentPage = needsBlankPageAfterToc
      ? totalFrontPages + 2
      : totalFrontPages + 1;

    console.log(
      `TOC pages: ${tocPageCount}, Front pages: ${totalFrontPages}, Content starts: ${currentPage}`
    );
    console.timeEnd("Phase 4: TOC Calculation");

    // ========== PHASE 5: CHAPTER GENERATION ==========
    console.time("Phase 5: Chapter Generation");
    const chapterData = await Promise.all(
      normalizedChapters.map(async ({ question, blocks }) => {
        const chapterHtml = buildHtml(blocks, false);
        const chapterPdf = (await generatePdf(chapterHtml)) as ArrayBuffer;
        const pageCount = (await PDFDocument.load(chapterPdf)).getPageCount();

        return {
          title: question.question || "",
          pdf: chapterPdf,
          pageCount,
        };
      })
    );

    let page = currentPage;
    const chapterPages: Array<{ title: string; page: number }> = [];
    const chapterPdfs = await Promise.all(
      chapterData.map(async (chapter) => {
        const currentPageForChapter = page;
        page += chapter.pageCount;
        chapterPages.push({
          title: chapter.title,
          page: currentPageForChapter,
        });
        return await addPageNumbers(chapter.pdf, currentPageForChapter);
      })
    );

    const totalPagesBeforeBlank = page - 1;
    const needsBlankPageAtEnd = totalPagesBeforeBlank % 2 === 1;
    const totalPages = needsBlankPageAtEnd
      ? totalPagesBeforeBlank + 1
      : totalPagesBeforeBlank;

    console.log(
      `Total pages before blank: ${totalPagesBeforeBlank}, Needs blank at end: ${needsBlankPageAtEnd}, Final total: ${totalPages}`
    );
    console.timeEnd("Phase 5: Chapter Generation");

    // ========== PHASE 6: TOC GENERATION ==========
    console.time("Phase 6: TOC Generation");
    const realTocHtml = buildRealToc(chapterPages, tocPageCount);
    const realTocBuffer = (await generatePdf(realTocHtml)) as ArrayBuffer;
    const realTocWithNumbers = await addPageNumbers(
      realTocBuffer,
      titlePagePageCount + 1
    );
    console.timeEnd("Phase 6: TOC Generation");

    // ========== PHASE 7: BLANK PAGE AT END ==========
    console.time("Phase 7: Blank Page Generation");
    let blankPagePdf: ArrayBuffer | null = null;

    if (needsBlankPageAtEnd) {
      const blankHtml = buildBlankPage();
      const blankPdf = (await generatePdf(blankHtml)) as ArrayBuffer;
      blankPagePdf = await addPageNumbers(blankPdf, totalPages);
    }
    console.timeEnd("Phase 7: Blank Page Generation");

    // ========== PHASE 8: PDF ASSEMBLY ==========
    console.time("Phase 8: PDF Assembly");
    const pdfParts = [titlePagePdf, realTocWithNumbers, ...chapterPdfs];

    if (blankPagePdf) {
      pdfParts.push(blankPagePdf);
    }

    const finalPdf = await mergePdfs(pdfParts);
    console.timeEnd("Phase 8: PDF Assembly");

    // ========== PHASE 9: COVER GENERATION ==========
    console.time("Phase 9: Cover Generation");
    const spineWidth = Math.max(10, 0.1025 * totalPages);
    console.log(`Final spine width: ${spineWidth}mm for ${totalPages} pages`);

    const bookCoverImageUrl = await getBookCoverImage(
      book.cover_image_id ?? null
    );
    console.log(`Book cover style: ${book.cover_style}`);
    const coverHtml = buildCoverLayout(spineWidth, {
      backgroundColor: book.background_color,
      textColor: book.text_color,
      spineText: book.spine || "",
      bookTitle: book.title,
      backgroundImageUrl: bookCoverImageUrl,
      authorName: book.author_name || "",
      templateId: book.cover_style,
    });

    const coverPdf = await generatePdf(coverHtml);
    const coverPdfBuffer = Buffer.from(coverPdf);
    console.timeEnd("Phase 9: Cover Generation");

    // ========== PHASE 10: WATERMARK GENERATION ==========
    console.time("Phase 10: Watermark Generation");
    const watermarkPdf = await addWatermark(finalPdf);
    console.timeEnd("Phase 10: Watermark Generation");

    // ========== PHASE 11: S3 UPLOAD ==========
    console.time("Phase 11: S3 Upload");
    const timestamp = Date.now();
    const [coverUrl, pdfUrlNormal, pdfUrlWatermark] = await Promise.all([
      uploadToSupabase(coverPdfBuffer, `books/${bookId}/cover-${timestamp}.pdf`),
      uploadToSupabase(Buffer.from(finalPdf), `books/${bookId}/${timestamp}.pdf`),
      uploadToSupabase(
        Buffer.from(watermarkPdf),
        `books/${bookId}/${timestamp}-watermark.pdf`
      ),
    ]);
    console.timeEnd("Phase 11: S3 Upload");

    console.timeEnd("Total PDF Generation Time");

    return c.json({
      success: true,
      bookId,
      totalPages,
      chaptersCount: questions.length,
      spineWidth,
      pdfUrls: {
        cover: coverUrl,
        normal: pdfUrlNormal,
        watermark: pdfUrlWatermark,
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return c.json({ error: "Failed to generate PDF" }, 500);
  }
});
