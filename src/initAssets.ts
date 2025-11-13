import { readFileSync } from "fs";
import path from "path";
export function initAssets() {
  const curvePath = path.resolve(process.cwd(), "src/assets/curve-hd.png");
  const logoPath = path.resolve(process.cwd(), "src/assets/logo_black.png");
  const fontRegularPath = path.resolve(
    process.cwd(),
    "src/fonts/cormorant/Cormorant-Regular.ttf"
  );
  const fontBoldPath = path.resolve(
    process.cwd(),
    "src/fonts/cormorant/Cormorant-SemiBold.ttf"
  );
  const fontItalicPath = path.resolve(
    process.cwd(),
    "src/fonts/cormorant/Cormorant-Italic.ttf"
  );
  const fontBoldItalicPath = path.resolve(
    process.cwd(),
    "src/fonts/cormorant/Cormorant-SemiBoldItalic.ttf"
  );

  const curveBase64 = `data:image/png;base64,${readFileSync(curvePath).toString(
    "base64"
  )}`;
  const logoBase64 = `data:image/png;base64,${readFileSync(logoPath).toString(
    "base64"
  )}`;
  const fontRegularBase64 = `data:font/ttf;base64,${readFileSync(
    fontRegularPath
  ).toString("base64")}`;
  const fontBoldBase64 = `data:font/ttf;base64,${readFileSync(
    fontBoldPath
  ).toString("base64")}`;
  const fontItalicBase64 = `data:font/ttf;base64,${readFileSync(
    fontItalicPath
  ).toString("base64")}`;
  const fontBoldItalicBase64 = `data:font/ttf;base64,${readFileSync(
    fontBoldItalicPath
  ).toString("base64")}`;

  console.log("Assets initialized");
  return {
    curveBase64,
    logoBase64,
    fontRegularBase64,
    fontBoldBase64,
    fontItalicBase64,
    fontBoldItalicBase64,
  };
}
