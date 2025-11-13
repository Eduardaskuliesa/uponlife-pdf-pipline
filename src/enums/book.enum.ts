export enum BookState {
  ONBOARDING = "onboarding",
  DRAFT = "draft",
}

export enum BookFileType {
  PDF_COVER = "pdf_cover",
  PDF_FULL = "pdf_full",
  PDF_FULL_PROTECTED = "pdf_full_protected",
}

export enum BookFileState {
  PENDING = "pending",
  GENERATING = "generating",
  READY = "ready",
  ERROR = "error",
}
