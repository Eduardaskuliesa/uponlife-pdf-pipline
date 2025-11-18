import { readFileSync } from "fs";
import path from "path";
import { CoverTemplateOptions } from "../../../types/template";

const fontBoldPath = path.resolve(
  process.cwd(),
  "src/fonts/cormorant/Cormorant-SemiBold.ttf"
);

const fontBoldBase64 = `data:font/ttf;base64,${readFileSync(
  fontBoldPath
).toString("base64")}`;

export function buildCoverTemplate8(options: CoverTemplateOptions): string {
  const { textColor, bookTitle, authorName, bookCoverImageUrl } = options;

  const bookTitleText = bookTitle.slice(0, 40);
  const authorNameText = `Written by:<br>${authorName.slice(0, 25)}`;

  return `
    <div class="book-cover-8-wrapper">
      <div class="book-cover-8-top-left-text">${bookTitleText}</div>
      <div class="bottom-text-right-8">${authorNameText}</div>
      <img class="book-cover-image-8" src="${bookCoverImageUrl}" alt="Book Cover" />
    </div>
  `;
}

export function getCoverTemplate8Styles(textColor: string): string {
  return `
   @font-face {
            font-family: 'Cormorant-Template-8';
            src: url('${fontBoldBase64}');
            font-weight: bold;
            font-style: normal;
        }
    .book-cover-8-wrapper {
      width: 100%;
      height: 100%;
      display: flex;
      box-sizing: border-box;
      flex-direction: column;
      padding-top: 36mm;
      padding-right: 17mm;
      
    }

    .book-cover-8-top-left-text {
      font-family: 'Cormorant-Template-8', serif;
      font-weight: bold;
      font-size: 43pt;
      color: ${textColor};
      line-height: 1;
      text-transform: capitalize;
      margin-bottom: 12mm;
      padding-left: 5mm;
      margin-right: 10mm;
    }

    .bottom-text-right-8 {
      font-family: 'Arial';
      font-size: 13pt;
      color: ${textColor};
      margin-bottom: 12mm;
      align-self: flex-end;
      margin-right: 24mm;
      letter-spacing: 0.3mm;
      line-height: 1.2;
    }

    .book-cover-image-8 {
      width: 100%;
      object-fit: cover;
      flex: 1;
    }
  `;
}
