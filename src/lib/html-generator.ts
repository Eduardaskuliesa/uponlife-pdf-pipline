import { Block } from "../types";
import { cormorant } from "../helpers/get-cormorant-fonts";
import { arial } from "../helpers/get-arial-font";
import { readFileSync } from "fs";
import path from "path";

const headingDecor = path.resolve(
  process.cwd(),
  "src/assets/signal-2025-11-13-180533.svg"
);
const logoPath = path.resolve(process.cwd(), "src/assets/logo_black.png");

const headingDecorBase64 = `data:image/svg+xml;base64,${readFileSync(
  headingDecor
).toString("base64")}`;
const logoBase64 = `data:image/png;base64,${readFileSync(logoPath).toString(
  "base64"
)}`;

export function buildChapterHtml(blocks: Block[], withWatermark: boolean): string {
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
            margin: 18mm 14mm 24mm 14mm;
          }
          @font-face {
            font-family: 'Cormorant';
            src: url('${cormorant.regular}');
            font-weight: normal;
            font-style: normal;
          }
          @font-face {
            font-family: 'Cormorant';
            src: url('${cormorant.bold}');
            font-weight: bold;
            font-style: normal;
          }
          @font-face {
            font-family: 'Cormorant';
            src: url('${cormorant.italic}');
            font-weight: normal;
            font-style: italic;
          }
          @font-face {
            font-family: 'Cormorant';
            src: url('${cormorant.boldItalic}');
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
            font-size: 22pt;
            font-weight: normal;
            text-align: center;
            line-height: 1.4;
            text-transform: uppercase;
            margin-bottom: 3mm;
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
            margin: 2mm;
            text-align: center;
            page-break-inside: avoid;
          }
          
          .block-image {
            max-width: 80%;
            height: auto;
            margin: 0 auto;
            object-fit: contain;
          }
          
          .image-caption {
            font-family: 'Arial', serif;
            font-size: 10pt;
            margin-top: 2mm;
            padding-left: 12mm;
            color: #333;
            align-self: stretch;
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

export function buildTitlePageHtml(author: string, title?: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          @page {
            size: 152mm 228mm;
            margin: 14mm 14mm 42mm 14mm;
          }
          @font-face {
            font-family: 'Cormorant';
            src: url('${cormorant.regular}');
            font-weight: normal;
            font-style: normal;
          }

          @font-face {
            font-family: 'Arial';
            src: url('${arial}');
            font-weight: normal;
            font-style: normal;
          }
          @font-face {
            font-family: 'Cormorant';
            src: url('${cormorant.medium}');
            font-weight: medium;
            font-style: normal;
          }
          body {
            font-family: 'Cormorant', serif;
            margin: 0;
            padding: 0;
          }

         .title-page {
            position: relative;
            height: 100vh;
            text-align: center;
            page-break-after: always;
          }

          .author {
            font-family: 'Arial', sans-serif;
            font-size: 12pt;
            margin-top: 6mm;
            font-weight: normal;
            text-align: center;
            text-transform: uppercase;
          }

          .title {
            font-size: 48pt;
            text-align: center;
            text-transform: uppercase;
            line-height: 1;
            font-weight: medium;
            margin-top: 30mm;
          }
        </style>
      </head>
     <body>
        <div class="title-page">
          <div class="author">${author}</div>
          ${title ? `<div class="title">${title}</div>` : ""}
        </div>
      </body>
    </html>
  `;
}

export function buildBlankPageHtml(): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          @page { 
            size: 152mm 228mm;
            margin: 14mm 14mm 42mm 14mm;
          }
          body { 
            margin: 0; 
            padding: 0; 
          }
        </style>
      </head>
      <body></body>
    </html>
  `;
}
