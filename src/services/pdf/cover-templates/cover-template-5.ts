import { CoverTemplateOptions } from "../../../types/template";


export function buildCoverTemplate5(options: CoverTemplateOptions): string {
  const { textColor, bookTitle, authorName } = options;

  return `
    <div class="side-2-wrapper">
      <div class="side-2-top">
        <div class="side-2-top-left">
          <div class="book-title">${bookTitle}</div>
        </div>
        <div class="side-2-top-right">
          <div class="author-name-right">Written by:<br>${authorName}</div>
        </div>
      </div>
      <div class="book-cover-image"></div>
    </div>
  `;
}

export function getCoverTemplate5Styles(textColor: string): string {
  return `
    .side-2 {
      padding-left: 14mm;
      padding-bottom: 24mm;
      padding-right: 24mm;
    }

    .side-2-wrapper {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .side-2-top {
      width: 100%;
      display: flex;
      flex-direction: row;
    }

    .side-2-top-left {
      width: 78mm;
      border-right: 2px solid ${textColor};
      display: flex;
      align-items: center;
    }

    .book-title {
      font-family: 'Arial';
      font-size: 14pt;
      font-weight: 500;
      color: ${textColor};
      padding-right: 3mm;
      padding-top: 38mm;
      padding-bottom: 8mm;
      letter-spacing: 0.3mm;
      line-height: 1.2;
    }

    .side-2-top-right {
      width: 56mm;
      display: flex;
      align-items: center;
    }

    .author-name-right {
      font-family: 'Arial';
      padding-left: 6mm;
      width: 100%;
      font-size: 11pt;
      color: ${textColor};
      padding-top: 38mm;
      padding-bottom: 8mm;
      letter-spacing: 0.3mm;
      line-height: 1.2;
    }

    .book-cover-image {
      width: 134mm;
      height: 192mm;
      background: #cccccc;
    }
  `;
}