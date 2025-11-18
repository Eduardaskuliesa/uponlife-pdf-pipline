import path from "path";
import { readFileSync } from "fs";
import { buildSpineContent, getSpineStyles } from "./buildSpine";
import { buildLeftCover, getLeftCoverStyles } from "./buildLeftCover";
import { getCoverTemplate } from "../../helpers/getCoverTemplate";

type CoverLayoutOptions = {
  backgroundColor?: string;
  textColor?: string;
  authorName?: string;
  bookTitle?: string;
  templateId?: number;
  backgroundImageUrl?: string;
};

const fontArialPath = path.resolve(process.cwd(), "src/fonts/arial.ttf");
const fontArialBase64 = `data:font/ttf;base64,${readFileSync(
  fontArialPath
).toString("base64")}`;

export function buildCoverLayout(
  spineWidht: number,
  options: CoverLayoutOptions = {}
): string {
  const coverFlatWidth = 346 + spineWidht;
  const coverHeight = 272;
  const stageWidth = 450;
  const stageHeight = 320;

  const {
    backgroundColor = "",
    textColor = "",
    backgroundImageUrl = "",
    authorName = "",
    bookTitle = "",
    templateId = 1,
  } = options;

  const spineContent = buildSpineContent({
    textColor,
    authorName,
    spineWidth: spineWidht,
    backgroundColor,
  });

  const spineStyles = getSpineStyles({
    textColor,
    authorName,
    spineWidth: spineWidht,
    backgroundColor,
  });

  const leftPanelContent = buildLeftCover({ textColor });
  const leftPanelStyles = getLeftCoverStyles(textColor);

  const { content: rightContent, styles: rightStyles } = getCoverTemplate(
    templateId,
    {
      textColor,
      authorName,
      bookTitle,
      bookCoverImageUrl: backgroundImageUrl,
    }
  );

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <style>
          @page {
            size: ${stageWidth}mm ${stageHeight}mm;
            margin: 0;
          }
          
          @font-face {
            font-family: 'Arial';
            src: url('${fontArialBase64}');
            font-weight: normal;
            font-style: normal;
          }

          body {
            margin: 0;
            padding: 0;
            background: #e5e5e5;
            width: 100vw;
            height: 100vh;
            display: flex;
            letter-spacing: normal;
            justify-content: center;
            align-items: center;
          } 

          .side-1 {
            background: ${backgroundColor};
            padding-bottom: 33mm;
            padding-top: 21mm;
          }
          
          .side-2 {
            display: flex;
            overflow: hidden;
          }

          .cover-container {
            width: ${stageWidth}mm;
            height: ${stageHeight}mm;
            background: #ffffff;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .cover-flat {
            width: ${coverFlatWidth}mm;
            height: ${coverHeight}mm;
            display: flex;
            box-sizing: border-box;
            overflow: hidden;
            background: ${backgroundColor};
          }

          .cover-panel {
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .cover-panel.side {
            width: 173mm;
            overflow: hidden;
            box-sizing: border-box;
          }

          ${spineStyles}
          ${leftPanelStyles}
          ${rightStyles}
        </style>
      </head>
      <body>
        <div class="cover-container">
          <div class="cover-flat">
            <div class="cover-panel side side-1">${leftPanelContent}</div>
            <div class="cover-panel spine">${spineContent}</div>
            <div class="cover-panel side side-2">${rightContent}</div>
          </div>
        </div>
      </body>
    </html>
  `;
}
