const { scrapeWebsite, closeBrowserPool } = require('./scraper');

async function scrapeMultipleUrls(urls, maxResults = 3, maxCharsPerPage = 4000) {
  try {
    // Take only the first maxResults URLs
    const urlsToScrape = urls.slice(0, maxResults);

    // Create an array of promises for parallel scraping
    const scrapePromises = urlsToScrape.map(async (url) => {
      try {
        const content = await scrapeWebsite(url);
        if (content) {
          return {
            url,
            content: content.substring(0, maxCharsPerPage)
          };
        }
        return null;
      } catch (err) {
        console.warn(`Skipping ${url} due to scrape failure:`, err.message);
        return null;
      }
    });

    // Wait for all scraping operations to complete
    const results = await Promise.all(scrapePromises);

    // Filter out null results and return
    return results.filter(result => result !== null);
  } catch (err) {
    console.error('Error in parallel scraping:', err);
    return [];
  }
}

// Export the closeBrowserPool function for cleanup
module.exports = { 
  scrapeMultipleUrls,
  closeBrowserPool
};
