import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { pdfRoutes } from "./routes/pdf";
import { htmlRoutes } from "./routes/html";
import config from "./config";
import { AppDataSource } from "./data-source";
import { initBrowser } from "./lib/pdf";

async function start() {
  console.log("=== NODE.JS APP STARTING ===");
  console.log("Current time:", new Date().toISOString());
  console.log("Environment variables loaded:");
  console.log("AWS_REGION:", config.s3Bucket.region);
  console.log("AWS_S3_BUCKET_NAME:", config.s3Bucket.name);
  console.log(
    "AWS_ACCESS_KEY_ID:",
    config.s3Bucket.accessKeyId ? "SET" : "NOT SET"
  );
  // initAssets();
  await AppDataSource.initialize();
  await initBrowser();
  console.log("Database connected");

  const app = new Hono();

  app.get("/", (c) => c.text("PDF Generation Service is running."));
  app.get("/health", (c) => c.text("OK"));

  app.route("/", pdfRoutes);
  app.route("/", htmlRoutes);

  const port = 8080;

  console.log(`Server is running on port ${port}`);

  serve({ fetch: app.fetch, port: port });
}

start();
