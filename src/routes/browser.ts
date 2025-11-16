import puppeteer, { Browser } from "puppeteer-core";

let browser: Browser | null = null;

async function getBrowser() {
  if (!browser) {
    browser = await puppeteer.launch({
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
      ],
      headless: true,
    });
  }
  return browser;
}
