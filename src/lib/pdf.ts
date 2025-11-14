import { degrees, PDFDocument } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { readFileSync } from "fs";
import path from "path";

const fontRegularPath = path.resolve(
  process.cwd(),
  "src/fonts/cormorant/Cormorant-Regular.ttf"
);

export async function generatePdf(html: string): Promise<ArrayBuffer> {
  const formData = new FormData();

  formData.append(
    "files",
    new Blob([html], { type: "text/html; charset=utf-8" }),
    "index.html"
  );

  formData.append("printBackground", "true");
  formData.append("preferCssPageSize", "true");
  formData.append("scale", "1");

  const response = await fetch(
    "http://localhost:3000/forms/chromium/convert/html",
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.arrayBuffer();
}

export async function mergePdfs(
  pdfBuffers: ArrayBuffer[]
): Promise<ArrayBuffer> {
  const formData = new FormData();

  pdfBuffers.forEach((buffer, index) => {
    formData.append(
      "files",
      new Blob([buffer], { type: "application/pdf" }),
      `${index + 1}.pdf`
    );
  });

  const response = await fetch("http://localhost:3000/forms/pdfengines/merge", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.arrayBuffer();
}

export async function addPageNumbers(
  pdfBuffer: ArrayBuffer,
  startPage: number
): Promise<ArrayBuffer> {
  const pdfDoc = await PDFDocument.load(pdfBuffer);

  pdfDoc.registerFontkit(fontkit);

  const pages = pdfDoc.getPages();

  const fontBytes = readFileSync(fontRegularPath);
  const font = await pdfDoc.embedFont(fontBytes);

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const { width } = page.getSize();
    const pageNumber = startPage + i;
    const text = `${pageNumber}`;

    const textWidth = font.widthOfTextAtSize(text, 8);

    page.drawText(text, {
      x: width / 2 - textWidth / 2,
      y: 58,
      size: 12,
      font: font,
    });
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
      x: width / 2 - offset,
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
