import { readFileSync } from "fs";
import path from "path";

const narrtoneLogoPath = path.resolve(
  process.cwd(),
  "src/assets/Narratone-logo-header.png"
);

const narratoneLogoSvgPath = path.resolve(
  process.cwd(),
  "src/assets/Narratone-logo-header.svg"
);

const narrtoneLogoBase64 = `data:image/svg+xml;base64,${readFileSync(
  narrtoneLogoPath
).toString("base64")}`;

export const narratoneLogo = {
  narrtoneLogoPath,
  narrtoneLogoBase64,
  narratoneLogoSvgPath,
};
