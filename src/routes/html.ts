import { Hono } from "hono";
import { Book } from "../entities/book.entity";
import { Question } from "../entities/questions.entity";
import { Section } from "../entities/section.entity";
import { In } from "typeorm";
import { buildHtml } from "../lib/html";
import { uploadToS3 } from "../services/s3";
import type { Block } from "../types";
import { File } from "../entities/file.entity";
import { supabase } from "../services/supabase-client";
import { Heading } from "../lib/create-heading-block";
import { HeadingBlock } from "../types/block";
import { generatePdf } from "../lib/pdf";

async function getImageFromBucket(
  bookId: string,
  imageId: string
): Promise<ArrayBuffer> {
  // Get the file path from database
  const image = await File.findOne({ where: { id: imageId } });

  if (!image?.path) {
    throw new Error(`Image not found: ${imageId}`);
  }

  console.log(`Downloading image from path: ${image.path}`);

  const { data, error } = await supabase.storage
    .from("files")
    .download(image.path);

  if (error) {
    console.error("Supabase storage error:", error);
    throw new Error(`Failed to download image: ${JSON.stringify(error)}`);
  }

  if (!data) {
    throw new Error("No data returned from storage");
  }

  return await data.arrayBuffer();
}

export const htmlRoutes = new Hono();

htmlRoutes.post("/generate-html/:bookId", async (c) => {
  console.time("Total PDF Generation Time");
  const bookId = c.req.param("bookId");

  try {
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
    console.time("Sections Grouping Time");
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
    console.timeEnd("Sections Grouping Time");
    console.time("HTML Blocks Normalization Time");
    async function normalizeBlock(item: Section | HeadingBlock) {
      switch (item.type) {
        case "heading":
          return {
            type: "heading",
            content: "text" in item ? item.text : "",
          };

        case "image":
          const parsedContent =
            typeof item.content === "string"
              ? JSON.parse(item.content)
              : item.content;

          const imageUrl = parsedContent?.data?.file?.url;
          const imageId = imageUrl.split("/").pop();

          const file = await File.findOne({ where: { id: imageId } });
          if (!file?.path) {
            throw new Error(`File not found: ${imageId}`);
          }

          const { data } = await supabase.storage
            .from("files")
            .download(file.path);

          if (!data) {
            throw new Error("Failed to download image");
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

        case "paragraph":
          return {
            type: "paragraph",
            content: item.content?.data?.text || "",
          };

        default:
          throw new Error(`Unknown block type: ${item.type}`);
      }
    }

    const contentBlocks: Block[] = await Promise.all(
      questions.flatMap((question) => {
        const sections = sectionsByQuestion[question.id] || [];
        return sections.map((section) => normalizeBlock(section));
      })
    );
    console.timeEnd("HTML Blocks Normalization Time");
    console.time("HTML Generation Time");
    const [normalHtml, withWatermark] = await Promise.all([
      buildHtml(contentBlocks, false),
      buildHtml(contentBlocks, true),
    ]);

    console.timeEnd("HTML Generation Time");
    console.time("PDF Generation Time");

    const [pdfBufferNormal, pdfBufferWithWatermark] = await Promise.all([
      generatePdf(normalHtml),
      generatePdf(withWatermark),
    ]);
    console.timeEnd("PDF Generation Time");
    const s3KeyW = `books/${bookId}/${Date.now()}.pdf`;
    const s3KeyN = `books/${bookId}/${Date.now()}-watermark.pdf`;
    console.time("Upload PDF to S3 Time");
    const [pdfUrlNormal, pdfUrlWithWatermark] = await Promise.all([
      uploadToS3(pdfBufferNormal, s3KeyN),
      uploadToS3(pdfBufferWithWatermark, s3KeyW),
    ]);
    console.timeEnd("Upload PDF to S3 Time");
    console.timeEnd("Total PDF Generation Time");
    return c.json({
      success: true,
      bookId,
      chaptersCount: questions.length,
    });
  } catch (error) {
    console.error("Error generating HTML:", error);
    return c.json({ error: "Failed to generate HTML" }, 500);
  }
});
