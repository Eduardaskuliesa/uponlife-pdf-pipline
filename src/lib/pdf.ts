import { degrees, PDFDocument } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { readFileSync } from "fs";
import path from "path";
import puppeteer, { Browser } from "puppeteer-core";
import pLimit from "p-limit";

const fontRegularPath = path.resolve(
  process.cwd(),
  "src/fonts/cormorant/Cormorant-Regular.ttf"
);

let browser: Browser | null = null;

export async function initBrowser() {
  console.log("Initializing browser...");
  browser = await puppeteer.launch({
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
    ],
    headless: true,
  });
  console.log("Browser ready!");
}

async function getBrowser() {
  if (!browser) {
    await initBrowser();
  }
  return browser!;
}

const limit = pLimit(4);

export async function generatePdf(html: string) {
  return limit(async () => {
    const browser = await getBrowser();
    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      scale: 1,
    });

    await page.close();
    return pdfBuffer.buffer;
  });
}

process.on("SIGTERM", async () => {
  if (browser) {
    await browser.close();
    browser = null;
  }
});

export async function mergePdfs(
  pdfBuffers: ArrayBuffer[]
): Promise<ArrayBuffer> {
  const mergedPdf = await PDFDocument.create();

  for (const buffer of pdfBuffers) {
    const pdf = await PDFDocument.load(buffer);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  const pdfBytes = await mergedPdf.save();
  return pdfBytes.buffer as ArrayBuffer;
}

export async function addPageNumbers(
  pdfBuffer: ArrayBuffer,
  startPage: number,
  skipFirstPage = false
): Promise<ArrayBuffer> {
  const pdfDoc = await PDFDocument.load(pdfBuffer);
  pdfDoc.registerFontkit(fontkit);

  const pages = pdfDoc.getPages();
  const fontBytes = readFileSync(fontRegularPath);
  const font = await pdfDoc.embedFont(fontBytes);

  for (let i = 0; i < pages.length; i++) {
    if (skipFirstPage && i === 0) continue;

    const page = pages[i];
    const { width } = page.getSize();
    const pageNumber = startPage + i;
    const text = `${pageNumber}`;
    const textWidth = font.widthOfTextAtSize(text, 8);

    page.drawText(text, {
      x: width / 2 - textWidth / 2,
      y: 38,
      size: 12,
      font,
    });
  }

  const pdfBytes = await pdfDoc.save();
  return pdfBytes.buffer as ArrayBuffer;
}

const narrtoneLogoPath = path.resolve(
  process.cwd(),
  "src/assets/Narratone-logo-header.png"
);

export async function addFooterLogo(
  pdfBuffer: ArrayBuffer,
  widthMm = 45,
  onlyFirstPage = true
): Promise<ArrayBuffer> {
  const pdfDoc = await PDFDocument.load(pdfBuffer);
  const logoBytes = readFileSync(narrtoneLogoPath);
  const logo = await pdfDoc.embedPng(logoBytes);

  const pages = pdfDoc.getPages();
  const widthPt = (widthMm / 25.4) * 72;
  const aspect = logo.width / logo.height;
  const heightPt = widthPt / aspect;

  const targetPages = onlyFirstPage ? [pages[0]] : pages;

  for (const page of targetPages) {
    const { width } = page.getSize();
    const x = width / 2 - widthPt / 2;
    const y = 58 - heightPt / 2;

    page.drawImage(logo, { x, y, width: widthPt, height: heightPt });
  }

  const pdfBytes = await pdfDoc.save();
  return pdfBytes.buffer as ArrayBuffer;
}

const logoPath = path.resolve(process.cwd(), "src/assets/logo_black.png");

export async function addWatermark(
  pdfBuffer: ArrayBuffer
): Promise<ArrayBuffer> {
  const pdfDoc = await PDFDocument.load(pdfBuffer);

  const logoBytes = readFileSync(logoPath);
  const logoImage = await pdfDoc.embedPng(logoBytes);

  const pages = pdfDoc.getPages();

  for (const page of pages) {
    const { width, height } = page.getSize();
    const watermarkSize = 280;

    const offset = (watermarkSize * Math.sqrt(2)) / 2;

    page.drawImage(logoImage, {
      x: width / 2 - offset + 20,
      y: height / 2,
      width: watermarkSize,
      height: watermarkSize,
      opacity: 0.08,
      rotate: degrees(-45),
    });
  }

  const pdfBytes = await pdfDoc.save();
  return pdfBytes.buffer as ArrayBuffer;
}
