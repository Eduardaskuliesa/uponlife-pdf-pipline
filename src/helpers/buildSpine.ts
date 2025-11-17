import { readFileSync } from "fs";
import { narratoneLogo } from "./getNarratoneLogo";
import { getUponLifeLogo } from "./getUponlifeLogo";

type SpineOptions = {
  textColor: string;
  authorName: string;
  spineWidth: number;
  backgroundColor: string;
};

export function buildSpineContent(options: SpineOptions): string {
  const { textColor, authorName } = options;

  let svgContent = readFileSync(narratoneLogo.narratoneLogoSvgPath, "utf-8");
  svgContent = svgContent
    .replace(/width="[^"]*"/g, 'width="34mm"')
    .replace(/height="[^"]*"/g, 'height="34mm"')
    .replace(/fill="[^"]*"/g, `fill="${textColor}"`)
    .replace(/stroke="[^"]*"/g, "stroke='none'")
    .replace(/<svg/, `<svg style="transform: rotate(270deg); display: block;"`);

  const additionalLogoSrc = getUponLifeLogo(textColor);

  return `
    <div class="spine-content">
      <div class="spine-author">${authorName}</div>
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
    .cover-panel.spine {
      width: ${spineWidth}mm;
      background: ${backgroundColor};
      color: ${textColor};
      flex-direction: column;
      box-sizing: border-box;
      padding-top: 1mm;
      padding-bottom: 14mm;
    }

    .spine-content {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      height: 100%;
      box-sizing: border-box;
    }

    .spine-author {
      font-family: Arial, sans-serif; 
      font-size: 10pt;
      writing-mode: sideways-lr;
      font-weight: normal;
    }

    .spine-logo {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .spine-additional-logo {
      width: 8mm;
      height: 8mm;
    }

    .spine-logos-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6mm;
    }
  `;
}