const { chromium } = require('playwright');
const BrowserPool = require('./browserPool');

// Create a singleton instance of the browser pool
const browserPool = new BrowserPool(3);

// Initialize the browser pool when the module is loaded
browserPool.initialize().catch(err => {
  console.error('Failed to initialize browser pool:', err);
});

async function scrapeWebsite(url) {
  let browser;
  try {
    // Acquire a browser from the pool
    browser = await browserPool.acquire();
    const page = await browser.newPage();
    
    // Set a reasonable timeout and wait for content
    await page.goto(url, { 
      waitUntil: 'domcontentloaded', 
      timeout: 15000 
    });

    // Extract the content
    const content = await page.evaluate(() => {
      // Remove script and style elements
      const elements = document.querySelectorAll('script, style, noscript, iframe');
      elements.forEach(el => el.remove());
      
      // Get the main content
      const mainContent = document.body.innerText;
      return mainContent;
    });

    const cleanText = content?.replace(/\s+/g, ' ').trim();
    return cleanText || null;
  } catch (err) {
    console.error(`Playwright failed to scrape ${url}:`, err.message);
    return null;
  } finally {
    if (browser) {
      // Release the browser back to the pool
      browserPool.release(browser);
    }
  }
}

// Export a function to close the browser pool when needed
const closeBrowserPool = async () => {
  await browserPool.close();
};

module.exports = { 
  scrapeWebsite,
  closeBrowserPool
};
