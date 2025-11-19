import { defaultCoverImg } from "./get-default-cover-img";
import { File } from "../entities/file.entity";
import { supabase } from "../services/supabase-client";

export async function getBookCoverImage(imgId: string | null): Promise<string> {
  if (!imgId) return defaultCoverImg;

  const file = await File.findOne({ where: { id: imgId } });
  if (!file?.path) return defaultCoverImg;

  const { data } = await supabase.storage.from("files").download(file.path);
  if (!data) return defaultCoverImg;

  const arrayBuffer = await data.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");
  const mimeType = file.path.endsWith(".png") ? "image/png" : "image/jpeg";

  return `data:${mimeType};base64,${base64}`;
}
