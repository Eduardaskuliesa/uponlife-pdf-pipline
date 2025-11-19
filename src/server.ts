import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { pdfRoutes } from "./routes/html";
import config from "./config";
import { AppDataSource } from "./data-source";
import { initBrowser } from "./lib/pdf";

async function start() {
  console.log("=== NODE.JS APP STARTING ===");
  console.log("Current time:", new Date().toISOString());
  await AppDataSource.initialize();
  await initBrowser();
  console.log("Database connected");

  const app = new Hono();

  app.get("/", (c) => c.text("PDF Generation Service is running."));
  app.get("/health", (c) => c.text("OK"));
  app.route("/", pdfRoutes);

  const port = Number(process.env.PORT) || 8080;

  console.log(`Server is running on port ${port}`);

  serve({ fetch: app.fetch, port: port });
}

start();
