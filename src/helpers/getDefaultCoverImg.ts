import { readFileSync } from "fs";
import path from "path";

const defaultImgPath = path.resolve(
  process.cwd(),
  "src/assets/cover_design_1_base_image.jpg"
);

export const defaultCoverImg = `data:image/png;base64,${readFileSync(
  defaultImgPath
).toString("base64")}`;
