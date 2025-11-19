import { Hono } from "hono";
import { uploadToSupabase } from "../services/supabase-upload";
import { v4 as uuidv4 } from "uuid";
import {
  fetchBookData,
  generateTitlePage,
  normalizeChapters,
  calculateTocPages,
  generateChapterPdfs,
  generateRealTocPdf,
  generateBlankPagePdf,
  assembleFinalPdf,
  generateCoverPdf,
  generateWatermarkedPdf,
} from "../lib/pdf-generation";

export const pdfRoutes = new Hono();

pdfRoutes.post("/generate-pdf/:bookId", async (c) => {
  console.time("Total PDF Generation Time");
  const bookId = c.req.param("bookId");

  try {
    // ========== PHASE 1: DATA FETCHING ==========
    console.time("Phase 1: Data Fetching");
    const { book, questions, sections } = await fetchBookData(bookId);
    console.timeEnd("Phase 1: Data Fetching");

    // ========== PHASE 2: TITLE PAGE GENERATION ==========
    console.time("Phase 2: Title Page Generation");
    const { titlePagePdf, titlePagePageCount } = await generateTitlePage(book);
    console.timeEnd("Phase 2: Title Page Generation");

    // ========== PHASE 3: DATA NORMALIZATION ==========
    console.time("Phase 3: Data Normalization");
    const normalizedChapters = await normalizeChapters(questions, sections);
    console.timeEnd("Phase 3: Data Normalization");

    // ========== PHASE 4: TOC PAGE CALCULATION ==========
    console.time("Phase 4: TOC Calculation");
    const tocPageCount = await calculateTocPages(questions);
    const totalFrontPages = titlePagePageCount + tocPageCount;
    const needsBlankPageAfterToc = totalFrontPages % 2 === 1;
    const startPage = needsBlankPageAfterToc
      ? totalFrontPages + 2
      : totalFrontPages + 1;

    console.log(
      `TOC pages: ${tocPageCount}, Front pages: ${totalFrontPages}, Content starts: ${startPage}`
    );
    console.timeEnd("Phase 4: TOC Calculation");

    // ========== PHASE 5: CHAPTER GENERATION ==========
    console.time("Phase 5: Chapter Generation");
    const { chapterPdfs, chapterPages, totalPages, needsBlankPageAtEnd } =
      await generateChapterPdfs(normalizedChapters, startPage);

    console.log(
      `Needs blank at end: ${needsBlankPageAtEnd}, Final total: ${totalPages}`
    );
    console.timeEnd("Phase 5: Chapter Generation");

    // ========== PHASE 6: TOC GENERATION ==========
    console.time("Phase 6: TOC Generation");
    const realTocWithNumbers = await generateRealTocPdf(
      chapterPages,
      tocPageCount,
      titlePagePageCount
    );
    console.timeEnd("Phase 6: TOC Generation");

    // ========== PHASE 7: BLANK PAGE AT END ==========
    console.time("Phase 7: Blank Page Generation");
    const blankPagePdf = needsBlankPageAtEnd
      ? await generateBlankPagePdf(totalPages)
      : null;
    console.timeEnd("Phase 7: Blank Page Generation");

    // ========== PHASE 8: PDF ASSEMBLY ==========
    console.time("Phase 8: PDF Assembly");
    const finalPdf = await assembleFinalPdf(
      titlePagePdf,
      realTocWithNumbers,
      chapterPdfs,
      blankPagePdf
    );
    console.timeEnd("Phase 8: PDF Assembly");

    // ========== PHASE 9: COVER GENERATION ==========
    console.time("Phase 9: Cover Generation");
    const { coverPdf, spineWidth } = await generateCoverPdf(book, totalPages);
    console.log(`Final spine width: ${spineWidth}mm for ${totalPages} pages`);
    console.timeEnd("Phase 9: Cover Generation");

    // ========== PHASE 10: WATERMARK GENERATION ==========
    console.time("Phase 10: Watermark Generation");
    const watermarkPdf = await generateWatermarkedPdf(finalPdf);
    console.timeEnd("Phase 10: Watermark Generation");

    // ========== PHASE 11: UPLOAD ==========
    console.time("Phase 11: Upload");
    const pdfId = uuidv4();
    const [coverUrl, pdfUrlNormal, pdfUrlWatermark] = await Promise.all([
      uploadToSupabase(coverPdf, `${bookId}/pdf/cover-${pdfId}.pdf`),
      uploadToSupabase(
        Buffer.from(finalPdf),
        `${bookId}/pdf/original-${pdfId}.pdf`
      ),
      uploadToSupabase(
        Buffer.from(watermarkPdf),
        `${bookId}/pdf/watermark-${pdfId}.pdf`
      ),
    ]);
    console.timeEnd("Phase 11: Upload");

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
    const errorMessage =
      error instanceof Error ? error.message : "Failed to generate PDF";
    return c.json({ error: errorMessage }, 500);
  }
});
