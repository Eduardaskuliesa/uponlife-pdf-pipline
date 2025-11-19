import pixelWidth from "string-pixel-width";
import { getLongestWord } from "../utils/get-longest-word";
import { CoverTemplateOptions } from "../../../types/template";

export function buildCoverTemplate3(options: CoverTemplateOptions): string {
  const { textColor, bookTitle, authorName, bookCoverImageUrl } = options;

  const titleText = bookTitle.slice(0, 40).toUpperCase();
  const longestWord = getLongestWord(titleText);

  let fontSize = 38;

  while (pixelWidth(longestWord, { font: "arial", size: fontSize }) > 300) {
    fontSize--;
    if (fontSize < 26) {
      break;
    }
  }

  return `
    <div class="book-cover-3-wrapper">
      <div class="top-3">
        <div class="text-3" style="font-size: ${fontSize}pt;">${titleText}</div>
        <img class="image-3" src="${bookCoverImageUrl}" alt="Book Cover" />
      </div>
      <div class="author-text-3">Written by:<br>${authorName.slice(0, 25)}</div>
    </div>
  `;
}

export function getCoverTemplate3Styles(textColor: string): string {
  return `
    .book-cover-3-wrapper {
      width: 100%;
      height: 100%;
      display: flex;
      box-sizing: border-box;
      flex-direction: column;
      justify-content: space-between;
      padding-left: 18mm;
      padding-right: 36mm;
      padding-top: 43mm;
      padding-bottom: 32mm;
    }

    .top-3 {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 19mm;
    }

    .text-3 {
      font-family: 'Arial';
      color: ${textColor};
      text-align: center;
      letter-spacing: 0.1mm;
    }

    .image-3 {
      width: 70mm;
      height: 87mm;
      object-fit: cover;
    }

    .author-text-3 {
      font-size: 11pt;
      font-family: 'Arial';
      text-align: center;
      color: ${textColor};
      letter-spacing: 0.5mm;
    }
  `;
}
