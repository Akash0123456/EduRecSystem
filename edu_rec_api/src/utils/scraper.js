const { chromium } = require('playwright');

async function scrapeWebsite(url) {
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });

    const content = await page.evaluate(() => document.body.innerText);
    const cleanText = content?.replace(/\s+/g, ' ').trim();

    return cleanText?.substring(0, 4000) || null;
  } catch (err) {
    console.error(`Playwright failed to scrape ${url}:`, err.message);
    return null;
  } finally {
    if (browser) await browser.close();
  }
}

module.exports = { scrapeWebsite };
