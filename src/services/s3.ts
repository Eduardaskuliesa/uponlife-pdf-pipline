import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import config from "../config";
import { Upload } from "@aws-sdk/lib-storage";

export const s3Client = new S3Client({
  region: config.s3Bucket.region,
  credentials: {
    accessKeyId: config.s3Bucket.accessKeyId!,
    secretAccessKey: config.s3Bucket.secretAccessKey!,
  },
});

export const bucketName = config.s3Bucket.name!;

export async function uploadToS3(buffer: Buffer, key: string): Promise<string> {
  const params = {
    Bucket: config.s3Bucket.name,
    Key: key,
    Body: buffer,
    ContentType: "application/pdf",
  };

  if (buffer.length > 5 * 1024 * 1024) {
    const upload = new Upload({
      client: s3Client,
      params,
      partSize: 5 * 1024 * 1024,
      queueSize: 4,
    });

    const result = await upload.done();
    return result.Location!;
  } else {
    const result = await s3Client.send(new PutObjectCommand(params));
    return `https://${config.s3Bucket.name}.s3.${config.s3Bucket.region}.amazonaws.com/${key}`;
  }
}

export async function uploadHtmlToS3(
  html: string,
  key: string
): Promise<string> {
  console.log(`Uploading HTML to S3 with key: ${key}`);

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: Buffer.from(html, "utf-8"),
    ContentType: "text/html",
  });

  await s3Client.send(command);

  return `https://${bucketName}.s3.amazonaws.com/${key}`;
}

export async function uploadImageToS3(
  buffer: ArrayBuffer,
  key: string
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: Buffer.from(buffer),
    ContentType: "image/jpeg",
  });

  await s3Client.send(command);
  return `https://${bucketName}.s3.amazonaws.com/${key}`;
}
