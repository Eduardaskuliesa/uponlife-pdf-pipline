import { readFileSync } from "fs";
import path from "path";
import pixelWidth from "string-pixel-width";
import { CoverTemplateOptions } from "../../../types/template";



const fontMediumPath = path.resolve(
  process.cwd(),
  "src/fonts/cormorant/Cormorant-Medium.ttf"
);

const fontMediumBase64 = `data:font/ttf;base64,${readFileSync(
  fontMediumPath
).toString("base64")}`;

function capitalizeString(str: string) {
  const parts = str.split(" ");
  const capitalizedParts = parts.map(
    (part) => part.charAt(0).toUpperCase() + part.slice(1)
  );
  return capitalizedParts.join(" ");
}

export function buildCoverTemplate4(options: CoverTemplateOptions): string {
  const { textColor, bookTitle, authorName } = options;

  const authorNameText = authorName.slice(0, 25);
  const titleText = capitalizeString(bookTitle.slice(0, 40));

  let fontSize = 42;

  while (pixelWidth(titleText, { font: "arial", size: fontSize }) > 525) {
    fontSize--;
    console.log(fontSize);
    if (fontSize < 26) {
      break;
    }
  }

  return `
    <div class="book-cover-4-wrapper">
      <div class="book-cover-4-top">
        <div class="book-cover-4-top-left">Written by:<br>${authorNameText}</div>
      </div>
      <div class="book-cover-4-bottom">
        <div class="book-cover-4-bottom-left">
          <div class="text-4" style="font-size: ${fontSize}pt;">${titleText}</div>
        </div>
        <div class="book-cover-image-4"></div>
      </div>
    </div>
  `;
}

export function getCoverTemplate4Styles(textColor: string): string {
  return `
      @font-face {
            font-family: 'Cormorant-Template-4';
            src: url('${fontMediumBase64}');
            font-weight: medium;
            font-style: normal;
    }
   
    .book-cover-4-wrapper {
      width: 100%;
      height: 100%;
      display: flex;
      box-sizing: border-box;
      flex-direction: column;
      justify-content: space-between;
      padding-left: 12mm;
      padding-right: 24mm;
      padding-top: 42mm;
      padding-bottom: 36mm;
    }

    .book-cover-4-top {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      margin-bottom: 4mm;
    }

    .book-cover-4-top-left {
      font-size: 11pt;
      font-family: 'Arial';
      color: ${textColor};
      text-align: left;
      letter-spacing: 0.5mm;
    }

    .book-cover-4-bottom {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: row;
    }

    .book-cover-4-bottom-left {
      width: 18%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .text-4 {
      width: 50px;
      height: 100%;
      font-family: 'Cormorant-Template-4;
      font-weight: medium;
      letter-spacing: 0.05mm;
      color: ${textColor};
      writing-mode: vertical-rl;
      text-align: left;
    }

    .book-cover-image-4 {
      width: 82%;
      height: 100%;
      object-fit: cover;
      background: #cccccc;
    }
  `;
}
