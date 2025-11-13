export type Block = {
  data?: {
    text?: string;
    level?: number;
    file?: {
      url: string;
      sectionId?: string;
      caption?: string;
      is_external?: boolean;
    };
  };
  type: string;
  id: string;
};

export type HeadingBlock = {
  type: "heading";
  text: string;
  question_id: string;
};
