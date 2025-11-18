import { CoverTemplateOptions } from "../../../types/template";

export function buildCoverTemplate6(options: CoverTemplateOptions): string {
  const { textColor, bookTitle, authorName } = options;

  const titleText = bookTitle.slice(0, 40).toUpperCase();
  const authorNameText = `WRITTEN BY:<br>${authorName
    .slice(0, 25)
    .toUpperCase()}`;

  return `
    <div class="book-cover-6-wrapper">
      <div class="book-cover-image-6"></div>
      <div class="top-left-text-6">${titleText}</div>
      <div class="bottom-right-text-6">${authorNameText}</div>
    </div>
  `;
}

export function getCoverTemplate6Styles(textColor: string): string {
  return `
    .book-cover-6-wrapper {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      position: relative;
    }

    .book-cover-image-6 {
      width: 100%;
      height: 100%;
      object-fit: cover;
      background: #cccccc;
    }

    .top-left-text-6 {
      position: absolute;
      top: 38mm;
      left: 12mm;
      font-size: 13pt;
      color: ${textColor};
      font-family: 'Arial';
      width: 60mm;
      letter-spacing: 1mm;
    }

    .bottom-right-text-6 {
      position: absolute;
      bottom: 34mm;
      right: 28mm;
      font-size: 11pt;
      color: ${textColor};
      font-family: 'Arial';
      text-align: right;
    }
  `;
}
