import config from "../config";
import { supabase } from "./supabase-client";

export async function uploadToSupabase(
  buffer: Buffer,
  key: string
): Promise<string> {
  const bucket = supabase.storage.from(config.supabase.bucket);

  if (buffer.length > 5 * 1024 * 1024) {
    const { data, error } = await bucket.upload(key, buffer, {
      contentType: "application/pdf",
      upsert: true,
    });

    if (error) throw error;

    const { data: urlData } = bucket.getPublicUrl(data.path);
    return urlData.publicUrl;
  } else {
    const { data, error } = await bucket.upload(key, buffer, {
      contentType: "application/pdf",
      upsert: true,
    });

    if (error) throw error;

    const { data: urlData } = bucket.getPublicUrl(data.path);
    return urlData.publicUrl;
  }
}
