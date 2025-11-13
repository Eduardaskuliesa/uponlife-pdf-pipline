import { Block } from "../types";
import { readFileSync } from "fs";
import path from "path";

const headingDecor = path.resolve(
  process.cwd(),
  "src/assets/signal-2025-11-13-180533.svg"
);
const logoPath = path.resolve(process.cwd(), "src/assets/logo_black.png");
const fontRegularPath = path.resolve(
  process.cwd(),
  "src/fonts/cormorant/Cormorant-Regular.ttf"
);
const fontBoldPath = path.resolve(
  process.cwd(),
  "src/fonts/cormorant/Cormorant-SemiBold.ttf"
);
const fontItalicPath = path.resolve(
  process.cwd(),
  "src/fonts/cormorant/Cormorant-Italic.ttf"
);
const fontBoldItalicPath = path.resolve(
  process.cwd(),
  "src/fonts/cormorant/Cormorant-SemiBoldItalic.ttf"
);

const headingDecorBase64 = `data:image/svg+xml;base64,${readFileSync(
  headingDecor
).toString("base64")}`;
const logoBase64 = `data:image/png;base64,${readFileSync(logoPath).toString(
  "base64"
)}`;
const fontRegularBase64 = `data:font/ttf;base64,${readFileSync(
  fontRegularPath
).toString("base64")}`;
const fontBoldBase64 = `data:font/ttf;base64,${readFileSync(
  fontBoldPath
).toString("base64")}`;
const fontItalicBase64 = `data:font/ttf;base64,${readFileSync(
  fontItalicPath
).toString("base64")}`;
const fontBoldItalicBase64 = `data:font/ttf;base64,${readFileSync(
  fontBoldItalicPath
).toString("base64")}`;

export function buildHtml(blocks: Block[], withWatermark: boolean): string {
  let content = "";
  let currentChapter = "";

  for (const block of blocks) {
    switch (block.type) {
      case "heading":
        if (currentChapter) {
          content += `</div>`;
        }
        content += `<div class="chapter">`;
        content += `<h1 class="chapter-heading">${block.content}</h1>`;
        content += `<img src="${headingDecorBase64}" class="header-curve" />`;
        currentChapter = "open";
        break;

      case "paragraph":
        content += `<p class="paragraph">${block.content || ""}</p>`;
        break;

      case "image":
        content += `<figure class="image-figure">
          <img src="${block.imgUrl}" class="block-image" />
          <figcaption class="image-caption">${block.content}</figcaption>
        </figure>`;
        break;
    }
  }

  if (currentChapter) {
    content += `</div>`;
  }

  return `
    <!DOCTYPE html>
    <html>
      <head>
      <meta charset="UTF-8">
        <style>
          @page {
            size: 152mm 228mm;
            margin: 18mm 14mm 42mm 14mm;
          }
          @font-face {
            font-family: 'Cormorant';
            src: url('${fontRegularBase64}');
            font-weight: normal;
            font-style: normal;
          }
          @font-face {
            font-family: 'Cormorant';
            src: url('${fontBoldBase64}');
            font-weight: bold;
            font-style: normal;
          }
          @font-face {
            font-family: 'Cormorant';
            src: url('${fontItalicBase64}');
            font-weight: normal;
            font-style: italic;
          }
          @font-face {
            font-family: 'Cormorant';
            src: url('${fontBoldItalicBase64}');
            font-weight: bold;
            font-style: italic;
          }

          body {
            font-family: 'Cormorant', serif;
            margin: 0;
            padding: 0;
            line-height: 1.4;
          }

          .chapter {
            page-break-before: always;
          }
          
          .chapter:first-child {
            page-break-before: avoid;
          }
          
          .chapter-heading {
            font-family: 'Cormorant', serif;
            font-size: 28pt;
            font-weight: normal;
            text-align: center;
            line-height: 1;
            text-transform: uppercase;
            margin-bottom: 4mm;
          }
          
          .header-curve {
            width: 12mm;
            height: 9mm;
            margin: 0 auto 4mm auto;
            object-fit: contain;
            display: block;
          }
          
          .paragraph {
            text-indent: 14pt;
            font-family: 'Cormorant', serif;
            font-size: 14pt;
            text-align: justify;
            padding-bottom: 1mm;
            line-height: 1.2;
            margin: 0 0 12pt 0;
          }
          
          .paragraph b {
            font-family: 'Cormorant', serif;
            font-weight: bold;
          }
          
          .paragraph i {
            font-family: 'Cormorant', serif;
            font-style: italic;
          }
          
          .image-figure {
            margin: 2mm 5mm ;
            text-align: center;
            page-break-inside: avoid;
          }
          
          .block-image {
            max-width: 100%;
            height: auto;
            margin: 0;
            object-fit: contain;
          }
          
          .image-caption {
            font-family: 'Arial', serif;
            font-size: 10pt;
            padding: 8pt 0 0;
            color: #333;
            text-align: left;
          }
          ${
            withWatermark
              ? `
          body::before {
            content: "";
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            width: 400px;
            height: 400px;
            background-image: url('${logoBase64}');
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            opacity: 0.08;
            z-index: 9999;
            pointer-events: none;
          }
          `
              : ""
          }
        </style>
      </head>
      <body>${content}</body>
    </html>
  `;
}
