import { readFileSync } from "fs";
import { narratoneLogo } from "../../helpers/get-narratone-logo";
import { getUponLifeLogo } from "../../helpers/getUponlifeLogo";


export function buildLeftCover(options: { textColor: string }): string {
  const { textColor } = options;

  const topLogoSrc = getUponLifeLogo(textColor);

  let bottomLogoSvg = readFileSync(narratoneLogo.narratoneLogoSvgPath, "utf-8");
  bottomLogoSvg = bottomLogoSvg
    .replace(/width="[^"]*"/g, 'width="36mm"')
    .replace(/height="[^"]*"/g, 'height="36mm"')
    .replace(/fill="[^"]*"/g, `fill="${textColor}"`)
    .replace(/stroke="[^"]*"/g, "stroke='none'")
    .replace(/<svg/, `<svg style="display: block;"`);

  return `
    <div class="left-panel-content">
      <img class="left-top-logo" src="${topLogoSrc}" alt="Logo" />
      <div class="left-bottom-section">
        <div class="left-narratone-logo">${bottomLogoSvg}</div>
        <div class="narratone-url">www.narratone.com</div>
      </div>
    </div>
  `;
}

export function getLeftCoverStyles(textColor: string): string {
  return `
    .left-panel-content {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      height: 100%;
      width: 100%;
    }

    .left-top-logo {
      width: 15mm;
      height: 15mm;
    }

    .left-bottom-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
    }

    .left-narratone-logo {
      margin-bottom: -10.5mm;
      display: flex;
      justify-content: center;
      width: 100%;
    }

    .narratone-url {
      font-family: Arial, sans-serif;
      font-size: 8pt;
      font-weight: normal;
      color: ${textColor};
      text-align: center;
      width: 100%;
    }
  `;
}