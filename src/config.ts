import * as dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const config = {
  supabase: {
    url: process.env.SUPABASE_URL!,
    key: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    bucket: process.env.SUPABASE_BUCKET_NAME!,
  },
  db: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
  },
} as const;

export default config;
