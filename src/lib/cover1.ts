import { buildSpineContent, getSpineStyles } from "../helpers/buildSpine";
import { getLeftCoverStyles, buildLeftCover } from "../helpers/buildLeftCover";

type CoverLayoutOptions = {
  backgroundColor?: string;
  textColor?: string;
  authorName?: string;
  logoText?: string;
};

export function buildCoverLayout(
  spineWidht: number,
  options: CoverLayoutOptions = {}
): string {
  const coverFlatWidth = 346 + spineWidht;
  const coverHeight = 272;
  const stageWidth = 450;
  const stageHeight = 320;

  const {
    backgroundColor = "#f4d35e",
    textColor = "#1b1b1b",
    authorName = "",
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

          body {
            margin: 0;
            padding: 0;
            background: #e5e5e5;
            width: 100vw;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
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
            padding: 20mm;
            box-sizing: border-box;
            background: #0066cc;
          }

          .cover-panel {
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: Arial, sans-serif;
            font-size: 14pt;
            letter-spacing: 1px;
          }

          .cover-panel.side {
            width: 173mm;
            box-sizing: border-box;
          }

          ${spineStyles}
          ${leftPanelStyles}

          .side-1 {
            background: #d62828;
            padding-right: 8mm;
          }

          .side-2 {
            padding-left: 8mm;
            background: #2a9d8f;
          }
        </style>
      </head>
      <body>
        <div class="cover-container">
          <div class="cover-flat">
            <div class="cover-panel side side-1">${leftPanelContent}</div>
            <div class="cover-panel spine">${spineContent}</div>
            <div class="cover-panel side side-2"></div>
          </div>
        </div>
      </body>
    </html>
  `;
}
