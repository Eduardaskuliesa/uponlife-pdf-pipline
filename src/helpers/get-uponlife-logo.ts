import { readFileSync } from "fs";
import path from "path";

const black = path.resolve(process.cwd(), "src/assets/logo_#000000.png");
const red = path.resolve(process.cwd(), "src/assets/logo_#7E1D11.png");
const lightBlue = path.resolve(process.cwd(), "src/assets/logo_#8BB7C2.png");
const blue = path.resolve(process.cwd(), "src/assets/logo_#010729.png");
const cream = path.resolve(process.cwd(), "src/assets/logo_#F1E8CC.png");

export function getUponLifeLogo(color: string): string {
  const upperColor = color.toUpperCase();

  switch (upperColor) {
    case "#000000":
      console.log("Matched black color");
      return `data:image/png;base64,${readFileSync(black).toString("base64")}`;
    case "#7E1D11":
      console.log("Matched red color");
      return `data:image/png;base64,${readFileSync(red).toString("base64")}`;
    case "#8BB7C2":
      console.log("Matched light blue color");
      return `data:image/png;base64,${readFileSync(lightBlue).toString(
        "base64"
      )}`;
    case "#010729":
      console.log("Matched blue color");
      return `data:image/png;base64,${readFileSync(blue).toString("base64")}`;
    case "#F1E8CC":
      console.log("Matched cream color");
      return `data:image/png;base64,${readFileSync(cream).toString("base64")}`;
    default:
      console.log("No matching color found, defaulting to black");
      return `data:image/png;base64,${readFileSync(black).toString("base64")}`;
  }
}
