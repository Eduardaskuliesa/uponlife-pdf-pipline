import { cormorant } from "../helpers/get-cormorant-fonts";

function getTocStyles(): string {
  return `
    @page {
      size: 152mm 228mm;
      margin: 14mm 14mm 28mm 14mm;
    }
    @font-face {
      font-family: 'Cormorant';
      src: url('${cormorant.regular}');
      font-weight: normal;
      font-style: normal;
    }
    body {
      font-family: 'Cormorant', serif;
      margin: 0;
      padding: 0;
      counter-reset: page 2;
    }

    .toc-heading {
      font-family: 'Cormorant', serif;
      font-size: 18pt;
      font-weight: normal;
      fonst-style: normal;
      text-align: center;
      text-transform: uppercase;
      margin-bottom: 14mm;
    }

    .toc-item {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 4mm;
      line-height: 1.2;
    }

    .toc-title {
      font-family: 'Cormorant', serif;
      font-size: 10pt;
      text-transform: uppercase;
      flex: 1;
      max-width: calc(100% - 25mm);
    }

    .toc-page {
      font-family: 'Arial', sans-serif;
      font-size: 10pt;
      text-align: right;
      min-width: 20mm;
    }
  `;
}

export function buildDummyToc(chapterTitles: string[]): string {
  const tocItems = chapterTitles
    .map((title, index) => {
      return `
      <div class="toc-item">
        <span class="toc-title">${title}</span>
        <span class="toc-page">99</span>
      </div>
    `;
    })
    .join("");

  const styles = getTocStyles();

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          ${styles}
        </style>
      </head>
      <body>
        <h1 class="toc-heading">Table of Contents</h1>
        ${tocItems}
      </body>
    </html>
  `;
}

export function buildRealToc(
  chapters: Array<{ title: string; page: number }>,
  tocPageCount: number
): string {
  const tocItems = chapters
    .map((chapter) => {
      return `
      <div class="toc-item">
        <span class="toc-title">${chapter.title}</span>
        <span class="toc-page">${chapter.page}</span>
      </div>
    `;
    })
    .join("");

  const needsBlankPage = tocPageCount % 2 === 1;
  const styles = getTocStyles();

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          ${styles}
        </style>
      </head>
      <body>
        <h1 class="toc-heading">Table of Contents</h1>
        ${tocItems}
        ${
          needsBlankPage
            ? '<div style="page-break-before: always; height: 100%;"></div>'
            : ""
        }
      </body>
    </html>
  `;
}
