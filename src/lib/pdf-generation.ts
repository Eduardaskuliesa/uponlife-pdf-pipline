import { Book } from "../entities/book.entity";
import { Question } from "../entities/questions.entity";
import { Section } from "../entities/section.entity";
import { File } from "../entities/file.entity";
import { In } from "typeorm";
import { supabase } from "../services/supabase-client";
import { Heading } from "./create-heading-block";
import { HeadingBlock } from "../types/block";
import { Block } from "../types";
import { PDFDocument } from "pdf-lib";
import { buildTitlePageHtml, buildChapterHtml, buildBlankPageHtml } from "./html-generator";
import { buildDummyToc, buildRealToc } from "./toc";
import {
  addPageNumbers,
  addFooterLogo,
  mergePdfs,
  addWatermark,
  generatePdf,
} from "../services/pdf-manipulation";
import { buildCoverLayout } from "../services/pdf/build-cover-layout";
import { getBookCoverImage } from "../helpers/get-book-cover-image";

export async function fetchBookData(bookId: string) {
  const book = await Book.findOne({ where: { id: bookId } });
  if (!book) {
    throw new Error("Book not found");
  }

  const questions = await Question.find({
    where: { book_id: bookId, answered: true },
    order: { sequence: "ASC" },
  });

  if (questions.length === 0) {
    throw new Error("No questions found");
  }

  const sections = await Section.find({
    where: { question_id: In(questions.map((q) => q.id)) },
  });

  return { book, questions, sections };
}

export async function generateTitlePage(book: Book) {
  const titlePageHtml = buildTitlePageHtml(book.author_name || "", book.title);
  const titlePdfBuffer = (await generatePdf(titlePageHtml)) as ArrayBuffer;
  const titlePageWithNumbers = await addPageNumbers(titlePdfBuffer, 1, true);
  const titlePagePdf = await addFooterLogo(titlePageWithNumbers);
  const titlePagePageCount = (
    await PDFDocument.load(titlePagePdf)
  ).getPageCount();

  return { titlePagePdf, titlePagePageCount };
}

async function normalizeBlock(item: Section | HeadingBlock): Promise<Block | null> {
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

export async function normalizeChapters(
  questions: Question[],
  sections: Section[]
) {
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
      const headingBlock = new (Heading as any)(question.id, question.question);
      sectionsByQuestion[questionId].unshift(headingBlock);
    }
  });

  const normalizedChapters = await Promise.all(
    questions.map(async (question) => {
      const questionSections = sectionsByQuestion[String(question.id)] || [];
      const blocks = (
        await Promise.all(questionSections.map(normalizeBlock))
      ).filter((block): block is Block => block !== null);
      return { question, blocks };
    })
  );

  return normalizedChapters;
}

export async function calculateTocPages(questions: Question[]) {
  const chapterTitles = questions
    .map((q) => q.question)
    .filter((title): title is string => title !== undefined);

  const dummyTocHtml = buildDummyToc(chapterTitles);
  const dummyTocBuffer = (await generatePdf(dummyTocHtml)) as ArrayBuffer;
  const tocPageCount = (await PDFDocument.load(dummyTocBuffer)).getPageCount();

  return tocPageCount;
}

export async function generateChapterPdfs(
  normalizedChapters: Array<{ question: Question; blocks: Block[] }>,
  startPage: number
) {
  const chapterData = await Promise.all(
    normalizedChapters.map(async ({ question, blocks }) => {
      const chapterHtml = buildChapterHtml(blocks, false);
      const chapterPdf = (await generatePdf(chapterHtml)) as ArrayBuffer;
      const pageCount = (await PDFDocument.load(chapterPdf)).getPageCount();

      return {
        title: question.question || "",
        pdf: chapterPdf,
        pageCount,
      };
    })
  );

  let page = startPage;
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

  return { chapterPdfs, chapterPages, totalPages, needsBlankPageAtEnd };
}

export async function generateRealTocPdf(
  chapterPages: Array<{ title: string; page: number }>,
  tocPageCount: number,
  titlePagePageCount: number
) {
  const realTocHtml = buildRealToc(chapterPages, tocPageCount);
  const realTocBuffer = (await generatePdf(realTocHtml)) as ArrayBuffer;
  const realTocWithNumbers = await addPageNumbers(
    realTocBuffer,
    titlePagePageCount + 1
  );
  return realTocWithNumbers;
}

export async function generateBlankPagePdf(totalPages: number) {
  const blankHtml = buildBlankPageHtml();
  const blankPdf = (await generatePdf(blankHtml)) as ArrayBuffer;
  return await addPageNumbers(blankPdf, totalPages);
}

export async function assembleFinalPdf(
  titlePagePdf: ArrayBuffer,
  realTocWithNumbers: ArrayBuffer,
  chapterPdfs: ArrayBuffer[],
  blankPagePdf: ArrayBuffer | null
) {
  const pdfParts = [titlePagePdf, realTocWithNumbers, ...chapterPdfs];

  if (blankPagePdf) {
    pdfParts.push(blankPagePdf);
  }

  return await mergePdfs(pdfParts);
}

export async function generateCoverPdf(book: Book, totalPages: number) {
  const spineWidth = Math.max(10, 0.1025 * totalPages);
  const bookCoverImageUrl = await getBookCoverImage(
    book.cover_image_id ?? null
  );

  if (!book.title || !book.author_name) {
    const missingFields = [];
    if (!book.title) missingFields.push("title");
    if (!book.author_name) missingFields.push("author name");
    console.warn(
      `Warning: Missing book ${missingFields.join(
        " and "
      )}. Using default values for cover generation.`
    );
  }

  const coverHtml = buildCoverLayout(spineWidth, {
    backgroundColor: book.background_color,
    textColor: book.text_color,
    spineText: book.spine || "",
    bookTitle: book.title || "Missing Title",
    backgroundImageUrl: bookCoverImageUrl,
    authorName: book.author_name || "Author Name",
    templateId: book.cover_style,
  });

  const coverPdf = await generatePdf(coverHtml);
  return { coverPdf: Buffer.from(coverPdf), spineWidth };
}

export async function generateWatermarkedPdf(finalPdf: ArrayBuffer) {
  return await addWatermark(finalPdf);
}
