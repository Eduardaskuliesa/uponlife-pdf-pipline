export interface Block {
  type: string;
  content: string;
  pageBreak?: boolean;
}

export interface GeneratePdfRequest {
  blocks: Block[];
  withWatermark?: boolean;
  testMode?: boolean;
  testPages?: number;
}

export interface GenerateBothPdfsRequest {
  blocks?: Block[];
  withWatermark?: boolean;
  testMode?: boolean;
  testPages?: number;
  s3Key?: string;
}
