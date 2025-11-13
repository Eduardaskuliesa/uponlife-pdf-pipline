import { Hono } from "hono";
import type { GeneratePdfRequest, GenerateBothPdfsRequest } from "../types";
import { generateLargeBookContent } from "../lib/content";
import { buildHtml } from "../lib/html";
import { generatePdf } from "../lib/pdf";
import { uploadToS3 } from "../services/s3";
import config from "../config";

export const pdfRoutes = new Hono();

pdfRoutes.post("/generate-pdf", async (c) => {
  const { blocks, withWatermark, testMode, testPages } =
    await c.req.json<GeneratePdfRequest>();

  const contentBlocks = testMode
    ? generateLargeBookContent(testPages || 1000)
    : blocks || [];

  const html = buildHtml(contentBlocks, !!withWatermark);
  const pdf = await generatePdf(html);

  return c.body(pdf, 200, { "Content-Type": "application/pdf" });
});

pdfRoutes.post("/generate-both-pdfs", async (c) => {
  try {
    const { blocks, testMode, testPages } =
      await c.req.json<GenerateBothPdfsRequest>();

    const contentBlocks = testMode
      ? generateLargeBookContent(testPages || 1000)
      : blocks || [];

    const [previewPdf, finalPdf] = await Promise.all([
      generatePdf(buildHtml(contentBlocks, true)),
      generatePdf(buildHtml(contentBlocks, false)),
    ]);

    console.log("Uploading PDFs to S3...");
    console.log("AWS Config:", {
      region: config.s3Bucket.region,
      bucket: config.s3Bucket.name,
      hasAccessKey: !!config.s3Bucket.accessKeyId,
      hasSecretKey: !!config.s3Bucket.secretAccessKey,
    });

    const timestamp = Date.now();
    const s3Key = Math.random().toString(36).substring(2, 15);

    const [previewUrl, finalUrl] = await Promise.all([
      uploadToS3(previewPdf, `${s3Key}/preview-${timestamp}.pdf`),
      uploadToS3(finalPdf, `${s3Key}/final-${timestamp}.pdf`),
    ]);

    if (!previewUrl || !finalUrl) {
      return c.json({ message: "Failed to upload PDFs to S3" }, 500);
    }

    return c.json({
      message: "PDFs generated and uploaded successfully",
      previewUrl,
      finalUrl,
      previewSize: `${(previewPdf.byteLength / 1024 / 1024).toFixed(2)} MB`,
      finalSize: `${(finalPdf.byteLength / 1024 / 1024).toFixed(2)} MB`,
    });
  } catch (error) {
    console.error("Error in generate-both-pdfs:", error);
    return c.json(
      {
        message: "Failed to generate PDFs",
        error: error instanceof Error ? error.message : String(error),
      },
      500
    );
  }
});
