import puppeteer, { Browser } from "puppeteer-core";
import pLimit from "p-limit";

let browser: Browser | null = null;


export async function initBrowser() {
  console.log("Initializing browser...");
  browser = await puppeteer.launch({
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
    ],
    headless: true,
  });
}

export async function getBrowser() {
  if (!browser) {
    await initBrowser();
  }
  return browser!;
}

process.on("SIGTERM", async () => {
  if (browser) {
    await browser.close();
    browser = null;
  }
});
