import path from "path";
import { getUponLifeLogo } from "../../../helpers/get-uponlife-logo";
import { readFileSync } from "fs";
import { CoverTemplateOptions } from "../../../types/template";

const fontBoldPath = path.resolve(
  process.cwd(),
  "src/fonts/cormorant/Cormorant-SemiBold.ttf"
);

const fontBoldBase64 = `data:font/ttf;base64,${readFileSync(
  fontBoldPath
).toString("base64")}`;

export function buildCoverTemplate2(options: CoverTemplateOptions): string {
  const { textColor, bookTitle, authorName, bookCoverImageUrl } = options;

  const authorNameText = authorName.slice(0, 25).replace(" ", "\n");
  const bookTitleText = bookTitle.slice(0, 40);

  const logoSrc = getUponLifeLogo(textColor);

  return `
    <div class="book-cover-2-wrapper">
      <div class="top-2">
        <div class="image-wrapper-2">
        <img class="image-2" src="${bookCoverImageUrl}" alt="Book Cover" />
          <div class="book-title-2">${bookTitleText}</div>
        </div>
        <img class="logo-top-2" src="${logoSrc}" alt="Logo" />
      </div>
      <div class="author-name-2">${authorNameText}</div>
    </div>
  `;
}

export function getCoverTemplate2Styles(textColor: string): string {
  return `
     @font-face {
            font-family: 'Cormorant-Template-2';
            src: url('${fontBoldBase64}');
            font-weight: bold;
            font-style: normal;
        }

    .book-cover-2-wrapper {
      width: 100%;
      height: 100%;
      display: flex;
      box-sizing: border-box;
      flex-direction: column;
      justify-content: space-between;
      padding-left: 16mm;
      padding-right: 27mm;
      padding-top: 34mm;
      padding-bottom: 38mm;
    }

    .top-2 {
      width: 100%;
      height: 150mm;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }

    .image-wrapper-2 {
      display: flex;
      flex-direction: column;
    }

    .image-2 {
      width: 70mm;
      height: 87mm;
      object-fit: cover;
      margin-bottom: 4mm;
    }

    .book-title-2 {
      width: 110mm;
      font-size: 42pt;
      font-family: 'Cormorant-Template-2', serif;
      font-weight: bold;
      color: ${textColor};
      text-transform: capitalize;
    }

    .logo-top-2 {
      width: 16mm;
      height: 16mm;
    }

    .author-name-2 {
      height: 85px;
      width: 100%;
      font-size: 42pt;
      font-family: 'Cormorant-Template-2', serif;
      font-weight: bold;
      color: ${textColor};
      text-transform: capitalize;
      text-align: right;
      line-height: 1;
      white-space: pre-line;
    }
  `;
}
