import { build } from "pdfjs-dist";
import {
  buildCoverTemplate1,
  getCoverTemplate1Styles,
} from "../cover-templates/cover-template-1";
import {
  buildCoverTemplate2,
  getCoverTemplate2Styles,
} from "../cover-templates/cover-template-2";
import {
  buildCoverTemplate3,
  getCoverTemplate3Styles,
} from "../cover-templates/cover-template-3";
import {
  buildCoverTemplate4,
  getCoverTemplate4Styles,
} from "../cover-templates/cover-template-4";
import {
  buildCoverTemplate5,
  getCoverTemplate5Styles,
} from "../cover-templates/cover-template-5";
import {
  buildCoverTemplate6,
  getCoverTemplate6Styles,
} from "../cover-templates/cover-template-6";
import {
  buildCoverTemplate7,
  getCoverTemplate7Styles,
} from "../cover-templates/cover-template-7";
import {
  buildCoverTemplate8,
  getCoverTemplate8Styles,
} from "../cover-templates/cover-template-8";
import { CoverTemplateOptions } from "../../../types/template";

type TemplateResult = {
  content: string;
  styles: string;
};

export function getCoverTemplate(
  templateId: number,
  options: CoverTemplateOptions
): TemplateResult {
  const id = Number(templateId);
  switch (id) {
    case 1:
      console.log("Using cover template 1");
      return {
        content: buildCoverTemplate1(options),
        styles: getCoverTemplate1Styles(options.textColor),
      };
    case 2:
      console.log("Using cover template 2");
      return {
        content: buildCoverTemplate2(options),
        styles: getCoverTemplate2Styles(options.textColor),
      };
    case 3: {
      console.log("Using cover template 3");
      return {
        content: buildCoverTemplate3(options),
        styles: getCoverTemplate3Styles(options.textColor),
      };
    }
    case 4: {
      console.log("Using cover template 4");
      return {
        content: buildCoverTemplate4(options),
        styles: getCoverTemplate4Styles(options.textColor),
      };
    }
    case 5:
      console.log("Using cover template 5");
      return {
        content: buildCoverTemplate5(options),
        styles: getCoverTemplate5Styles(options.textColor),
      };
    case 6: {
      console.log("Using cover template 6");
      return {
        content: buildCoverTemplate6(options),
        styles: getCoverTemplate6Styles(options.textColor),
      };
    }
    case 7: {
      console.log("Using cover template 7");
      return {
        content: buildCoverTemplate7(options),
        styles: getCoverTemplate7Styles(options.textColor),
      };
    }
    case 8: {
      console.log("Using cover template 8");
      return {
        content: buildCoverTemplate8(options),
        styles: getCoverTemplate8Styles(options.textColor),
      };
    }
    default:
      console.log("Template not found using default one");
      return {
        content: buildCoverTemplate1(options),
        styles: getCoverTemplate1Styles(options.textColor),
      };
  }
}
