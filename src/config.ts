import * as dotenv from "dotenv";
dotenv.config();

const config = {
  s3Bucket: {
    name: process.env.AWS_S3_BUCKET_NAME,
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
} as const;

export default config;
