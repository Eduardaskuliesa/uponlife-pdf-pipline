import { readFileSync } from "fs";
import path from "path";

const fontArialPath = path.resolve(process.cwd(), "src/fonts/arial.ttf");

export const arial = `data:font/ttf;base64,${readFileSync(
  fontArialPath
).toString("base64")}`;
