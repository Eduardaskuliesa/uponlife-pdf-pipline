import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import config from "../config";

export const s3Client = new S3Client({
  region: config.s3Bucket.region,
  credentials: {
    accessKeyId: config.s3Bucket.accessKeyId!,
    secretAccessKey: config.s3Bucket.secretAccessKey!,
  },
});

export const bucketName = config.s3Bucket.name!;

export async function uploadToS3(
  buffer: ArrayBuffer,
  key: string
): Promise<string> {
  console.log(`Uploading to S3 with key: ${key}`);
  console.log(`Buffer size: ${buffer.byteLength} bytes`);
  
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: Buffer.from(buffer),
    ContentType: "application/pdf",
  });

  await s3Client.send(command);

  return `https://${bucketName}.s3.amazonaws.com/${key}`;
}
