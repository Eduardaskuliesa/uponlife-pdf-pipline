import { Hono } from "hono";
import { Book } from "../entities/book.entity";
import { Question } from "../entities/questions.entity";
import { Section } from "../entities/section.entity";
import { In } from "typeorm";
import { buildDummyToc, buildHtml, buildRealToc } from "../lib/html";
import { uploadToS3 } from "../services/s3";
import { File } from "../entities/file.entity";
import { supabase } from "../services/supabase-client";
import { Heading } from "../lib/create-heading-block";
import { HeadingBlock } from "../types/block";
import {
  addPageNumbers,
  addWatermark,
  generatePdf,
  mergePdfs,
} from "../lib/pdf";
import { PDFDocument } from "pdf-lib";

export const htmlRoutes = new Hono();

htmlRoutes.post("/generate-html/:bookId", async (c) => {
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

    // ========== PHASE 2: DATA NORMALIZATION ==========
    console.time("Phase 2: Data Normalization");

    const sectionsByQuestion = sections.reduce((acc, section) => {
      if (!acc[section.question_id]) {
        acc[section.question_id] = [];
      }
      acc[section.question_id].push(section);
      return acc;
    }, {} as Record<string, typeof sections>);

    Object.keys(sectionsByQuestion).forEach((questionId) => {
      sectionsByQuestion[questionId].sort(
        (a, b) => Number(a.sequence) - Number(b.sequence)
      );

      const question = questions.find((q) => q.id === questionId);
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

        case "image":
          const parsedContent =
            typeof item.content === "string"
              ? JSON.parse(item.content)
              : item.content;
          const imageUrl = parsedContent?.data?.file?.url;
          const imageId = imageUrl.split("/").pop();
          const file = await File.findOne({ where: { id: imageId } });
          if (!file?.path) throw new Error(`File not found: ${imageId}`);

          const { data } = await supabase.storage
            .from("files")
            .download(file.path);
          if (!data) throw new Error("Failed to download image");

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

        case "paragraph":
          return { type: "paragraph", content: item.content?.data?.text || "" };

        default:
          throw new Error(`Unknown block type: ${item.type}`);
      }
    }

    const normalizedChapters = await Promise.all(
      questions.map(async (question) => {
        const sections = sectionsByQuestion[question.id] || [];
        const blocks = await Promise.all(sections.map(normalizeBlock));
        return { question, blocks };
      })
    );
    console.timeEnd("Phase 2: Data Normalization");

    // ========== PHASE 3: TOC PAGE CALCULATION ==========
    console.time("Phase 3: TOC Calculation");
    const chapterTitles = questions
      .map((q) => q.question)
      .filter((title): title is string => title !== undefined);

    const dummyTocHtml = buildDummyToc(chapterTitles);
    const dummyTocBuffer = await generatePdf(dummyTocHtml);
    const tocPageCount = (
      await PDFDocument.load(dummyTocBuffer)
    ).getPageCount();

    const reservedPages = 2;
    const totalFrontPages = reservedPages + tocPageCount;
    const needsBlankPage = totalFrontPages % 2 === 1;
    let currentPage = needsBlankPage
      ? totalFrontPages + 2
      : totalFrontPages + 1;

    console.log(
      `TOC pages: ${tocPageCount}, Needs blank: ${needsBlankPage}, Content starts: ${currentPage}`
    );
    console.timeEnd("Phase 3: TOC Calculation");

    // ========== PHASE 4: CHAPTER GENERATION ==========
    console.time("Phase 4: Chapter Generation");

    const chapterData: Array<{
      title: string;
      pdf: ArrayBuffer;
      page: number;
    }> = [];

    let page = currentPage;
    for (const { question, blocks } of normalizedChapters) {
      const chapterHtml = buildHtml(blocks, false);
      const chapterPdf = await generatePdf(chapterHtml);
      const pageCount = (await PDFDocument.load(chapterPdf)).getPageCount();

      chapterData.push({
        title: question.question || "",
        pdf: chapterPdf,
        page,
      });
      page += pageCount;
    }

    const chapterPages: Array<{ title: string; page: number }> = [];
    const chapterPdfs = await Promise.all(
      chapterData.map(async (chapter) => {
        chapterPages.push({ title: chapter.title, page: chapter.page });
        return await addPageNumbers(chapter.pdf, chapter.page);
      })
    );

    console.timeEnd("Phase 4: Chapter Generation");

    // ========== PHASE 5: TOC GENERATION ==========
    console.time("Phase 5: TOC Generation");
    const realTocHtml = buildRealToc(chapterPages, tocPageCount);
    const realTocBuffer = await generatePdf(realTocHtml);
    const realTocWithNumbers = await addPageNumbers(realTocBuffer, 3);
    console.timeEnd("Phase 5: TOC Generation");

    // ========== PHASE 6: PDF ASSEMBLY ==========
    console.time("Phase 6: PDF Assembly");
    const finalPdf = await mergePdfs([realTocWithNumbers, ...chapterPdfs]);
    console.timeEnd("Phase 6: PDF Assembly");

    // ========== PHASE 7: WATERMARK GENERATION ==========
    console.time("Phase 7: Watermark Generation");
    const watermarkPdf = await addWatermark(finalPdf);
    console.timeEnd("Phase 7: Watermark Generation");

    // ========== PHASE 8: S3 UPLOAD ==========
    console.time("Phase 8: S3 Upload");
    const s3KeyNormal = `books/${bookId}/${Date.now()}.pdf`;
    const s3KeyWatermark = `books/${bookId}/${Date.now()}-watermark.pdf`;

    const [pdfUrlNormal, pdfUrlWatermark] = await Promise.all([
      uploadToS3(finalPdf, s3KeyNormal),
      uploadToS3(watermarkPdf, s3KeyWatermark),
    ]);
    console.timeEnd("Phase 8: S3 Upload");

    console.timeEnd("Total PDF Generation Time");

    return c.json({
      success: true,
      bookId,
      chaptersCount: questions.length,
      pdfUrls: { normal: pdfUrlNormal, watermark: pdfUrlWatermark },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return c.json({ error: "Failed to generate PDF" }, 500);
  }
});
