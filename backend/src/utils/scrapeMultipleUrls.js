const { scrapeWebsite, closeBrowserPool } = require('./scraper');

async function scrapeMultipleUrls(urls, maxResults = 3, maxCharsPerPage = 4000) {
  try {
    const urlsToScrape = urls.slice(0, maxResults);
    const results = [];
    
    // Process URLs sequentially with a delay
    for (const url of urlsToScrape) {
      try {
        console.log(`Starting to scrape: ${url}`);
        const content = await scrapeWebsite(url);
        if (content) {
          results.push({
            url,
            content: content.substring(0, maxCharsPerPage)
          });
        }
        // Add a small delay between requests to prevent overwhelming the system
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (err) {
        console.warn(`Skipping ${url} due to scrape failure:`, err.message);
      }
    }

    return results;
  } catch (err) {
    console.error('Error in sequential scraping:', err);
    return [];
  }
}

// Export the closeBrowserPool function for cleanup
module.exports = { 
  scrapeMultipleUrls,
  closeBrowserPool
};
