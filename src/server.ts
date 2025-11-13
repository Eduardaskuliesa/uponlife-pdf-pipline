import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { pdfRoutes } from "./routes/pdf";
import config from "./config";

process.stdout.setDefaultEncoding("utf8");
process.stderr.setDefaultEncoding("utf8");

console.log("=== NODE.JS APP STARTING ===");
console.log("Current time:", new Date().toISOString());
console.log("Environment variables loaded:");
console.log("AWS_REGION:", config.s3Bucket.region);
console.log("AWS_S3_BUCKET_NAME:", config.s3Bucket.name);
console.log(
  "AWS_ACCESS_KEY_ID:",
  config.s3Bucket.accessKeyId ? "SET" : "NOT SET"
);

const app = new Hono();

app.get("/", (c) => c.text("PDF Generation Service is running."));
app.get("/health", (c) => c.text("OK"));

app.route("/", pdfRoutes);

serve({ fetch: app.fetch, port: 8080 });
