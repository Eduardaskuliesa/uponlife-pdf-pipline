import { readFileSync } from "fs";
import pixelWidth from "string-pixel-width";
import { getUponLifeLogo } from "../../../helpers/getUponlifeLogo";
import { CoverTemplateOptions } from "../../../types/template";

export function buildCoverTemplate1(options: CoverTemplateOptions): string {
  const { textColor, bookTitle, authorName, bookCoverImageUrl } = options;

  const titleText = bookTitle.toUpperCase().slice(0, 40);
  const titleTextWidth = pixelWidth(titleText, { font: "arial", size: 14 });

  const authorNameText = authorName.slice(0, 25);
  const authorNameTextWidth = pixelWidth(authorNameText, {
    font: "arial",
    size: 11,
  });

  let titleOffset = 12;
  if (titleTextWidth > 370 && titleTextWidth <= 740) {
    titleOffset = 4;
  }
  if (titleTextWidth > 740) {
    titleOffset = 0;
  }

  let authorOffset = 13;
  if (authorNameTextWidth > 100) {
    authorOffset = 7;
  }

  const logoSrc = getUponLifeLogo(textColor);

  return `
    <div class="template-1-left">
      <div class="template-1-text-wrapper">
        <div class="book-title-vertical" padding-left: ${titleOffset}px;">${titleText}</div>
        <div class="author-name-vertical" style="padding-left: ${authorOffset}px;">${authorNameText}</div>
      </div>
      <img class="template-1-logo" src="${logoSrc}" alt="Logo" />
    </div>
   <img class="book-cover-image" src="${bookCoverImageUrl}" alt="Book Cover" />

  `;
}

export function getCoverTemplate1Styles(textColor: string): string {
  return `
    .template-1-left {
      width: 18%;
      height: 100%;
      display: flex;
      box-sizing: border-box;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      padding-top: 34mm;
      padding-bottom: 33mm;
    }

    .template-1-text-wrapper {
      width: 40px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5mm;
    }

    .book-title-vertical {
      font-family: 'Arial';
      font-size: 14pt;
      color: ${textColor};
      writing-mode: sideways-lr;
      text-align: left;
      letter-spacing: 0.1mm;
    }

    .author-name-vertical {
      font-family: 'Arial';
      font-size: 11pt;
      color: ${textColor};
      writing-mode: sideways-lr;
      word-spacing: 0.1mm;
      text-align: left;
      letter-spacing: 0.1mm;
      max-height: 150px;
    }

    .template-1-logo {
      width: 10mm;
      height: 10mm;
    }

    .book-cover-image {
      width: 82%;
      height: 100%;
      object-fit: cover;
    }
  `;
}
