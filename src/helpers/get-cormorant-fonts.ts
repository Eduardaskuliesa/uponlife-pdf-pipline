import { readFileSync } from "fs";
import path from "path";

const fontRegularPath = path.resolve(
  process.cwd(),
  "src/fonts/cormorant/Cormorant-Regular.ttf"
);

const fontMediumPath = path.resolve(
  process.cwd(),
  "src/fonts/cormorant/Cormorant-Medium.ttf"
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

export const cormorant = {
  regular: `data:font/ttf;base64,${readFileSync(fontRegularPath).toString(
    "base64"
  )}`,
  medium: `data:font/ttf;base64,${readFileSync(fontMediumPath).toString(
    "base64"
  )}`,
  bold: `data:font/ttf;base64,${readFileSync(fontBoldPath).toString("base64")}`,
  italic: `data:font/ttf;base64,${readFileSync(fontItalicPath).toString(
    "base64"
  )}`,
  boldItalic: `data:font/ttf;base64,${readFileSync(fontBoldItalicPath).toString(
    "base64"
  )}`,
};
