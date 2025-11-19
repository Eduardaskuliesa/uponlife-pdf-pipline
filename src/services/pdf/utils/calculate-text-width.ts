import pixelWidth from "string-pixel-width";

export const calculateTextWidth = (
  text: string,
  fontSize: number,
  letterSpacingPx: number
): number => {
  const baseWidth = pixelWidth(text, { font: "arial", size: fontSize });
  const letterSpacingWidth = (text.length - 1) * letterSpacingPx;
  return baseWidth + letterSpacingWidth;
};
