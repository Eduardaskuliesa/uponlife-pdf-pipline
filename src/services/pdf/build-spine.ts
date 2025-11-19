import { readFileSync } from "fs";
import { narratoneLogo } from "../../helpers/getNarratoneLogo";
import { getUponLifeLogo } from "../../helpers/getUponlifeLogo";

type SpineOptions = {
  textColor: string;
  authorName: string;
  spineWidth: number;
  spineText: string;
  backgroundColor: string;
};

export function buildSpineContent(options: SpineOptions): string {
  const { textColor, authorName, spineText } = options;

  let svgContent = readFileSync(narratoneLogo.narratoneLogoSvgPath, "utf-8");
  svgContent = svgContent
    .replace(/width="[^"]*"/g, 'width="36mm"')
    .replace(/height="[^"]*"/g, 'height="36mm"')
    .replace(/fill="[^"]*"/g, `fill="${textColor}"`)
    .replace(/stroke="[^"]*"/g, "stroke='none'")
    .replace(/<svg/, `<svg style="transform: rotate(270deg); display: block;"`);

  const additionalLogoSrc = getUponLifeLogo(textColor);

  let displaySpineText = spineText;
  if (!spineText) {
    displaySpineText = authorName;
  }

  return `
    <div class="spine-content">
      <div class="spine-text">${displaySpineText}</div>
      <div class="spine-logos-wrapper">
        <div class="spine-logo">${svgContent}</div>
        <img class="spine-additional-logo" src="${additionalLogoSrc}" alt="Logo" />
      </div>
    </div>
  `;
}

export function getSpineStyles(options: SpineOptions): string {
  const { spineWidth, backgroundColor, textColor } = options;

  return `
   .spine{
   box-sizing: border-box;
   padding-top: 21mm;
   padding-bottom: 33mm;
   }

    .cover-panel.spine {
      width: ${spineWidth}mm;
      background: ${backgroundColor};
      color: ${textColor};
      flex-direction: column;
    }

    .spine-content {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      height: 100%;
    }

    .spine-text {
      font-family: Arial, sans-serif; 
      font-size: 11pt;
      letter-spacing: 1px;
      writing-mode: sideways-lr;
      font-weight: normal;
    }

    .spine-logo {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .spine-additional-logo {
      width: 10mm;
      height: 10mm;
    }

    .spine-logos-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 7mm;
    }
  `;
}
