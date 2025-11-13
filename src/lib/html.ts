import type { Block } from "../types";

export function buildHtml(
  contentBlocks: Block[],
  withWatermark: boolean
): string {
  return `<!DOCTYPE html>
    <html>
      <head>
        <style>
          @page { size: A4; margin: 20mm; }
          body {
            font-family: 'Georgia', 'Times New Roman', serif;
            font-size: 11pt;
            line-height: 1.6;
            color: #000;
            text-align: justify;
            hyphens: auto;
          }
          h1 { font-size: 24pt; margin-bottom: 20pt; page-break-after: avoid; }
          h2 { font-size: 18pt; margin-bottom: 12pt; page-break-after: avoid; }
          h3 { font-size: 14pt; margin-top: 18pt; margin-bottom: 10pt; page-break-after: avoid; }
          p { margin-bottom: 12pt; text-indent: 2em; orphans: 2; widows: 2; }
          p:first-of-type { text-indent: 0; }
          figure { page-break-inside: avoid; }
          img { display: block; max-width: 100%; height: auto; }
          .page-break { page-break-after: always; }
          .blank-page { height: 100vh; }
          ${
            withWatermark
              ? `
          body::before {
            content: "PREVIEW";
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 100px;
            font-weight: bold;
            color: rgba(0, 0, 0, 0.08);
            z-index: 9999;
            pointer-events: none;
            letter-spacing: 20px;
          }
          `
              : ""
          }
        </style>
      </head>
      <body>
        ${contentBlocks
          .map((block) => {
            if (block.type === "blank") {
              return `<div class="blank-page ${
                block.pageBreak !== false ? "page-break" : ""
              }"></div>`;
            }
            return `<div class="${block.pageBreak ? "page-break" : ""}">${
              block.content
            }</div>`;
          })
          .join("")}
      </body>
    </html>`;
}
