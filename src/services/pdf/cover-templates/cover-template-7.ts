import { CoverTemplateOptions } from "../../../types/template";
import { calculateTextWidth } from "../utils/calculateTextWidth";
import { getLongestWord } from "../utils/getLongestWord";



export function buildCoverTemplate7(options: CoverTemplateOptions): string {
  const { textColor, bookTitle, authorName } = options;

  const authorNameText = `WRITTEN BY:<br>${authorName
    .slice(0, 25)
    .toUpperCase()}`;
  const bookTitleText = bookTitle.slice(0, 40).toUpperCase();
  const longestAuthorNameWord = getLongestWord(authorNameText);

  const letterSpacingPx = 3;

  let fontSize = 13;
  while (
    calculateTextWidth(longestAuthorNameWord, fontSize, letterSpacingPx) > 142
  ) {
    fontSize--;
    if (fontSize < 8) {
      break;
    }
  }

  return `
    <div class="book-cover-7-wrapper">
      <div class="text-7">${bookTitleText}</div>
      <div class="bottom-7">
        <div class="image-7"></div>
        <div class="author-text-7" style="font-size: ${fontSize}pt;">${authorNameText}</div>
      </div>
    </div>
  `;
}

export function getCoverTemplate7Styles(textColor: string): string {
  return `
    .book-cover-7-wrapper {
      width: 100%;
      height: 100%;
      display: flex;
      box-sizing: border-box;
      flex-direction: column;
      justify-content: space-between;
      padding-left: 16mm;
      padding-right: 27mm;
      padding-top: 34mm;
      padding-bottom: 32mm;
    }

    .text-7 {
      width: 60mm;
      font-size: 13pt;
      font-family: 'Arial';
      color: ${textColor};
      letter-spacing: 1mm;
    }

    .bottom-7 {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: flex-end;
      gap: 8mm;
    }

    .image-7 {
      width: 70mm;
      height: 87mm;
      object-fit: cover;
      background: #cccccc;
    }

    .author-text-7 {
      width: 50mm;
      font-family: 'Arial';
      color: ${textColor};
      line-height: 1.14;
      letter-spacing: 4px;
    }
  `;
}
