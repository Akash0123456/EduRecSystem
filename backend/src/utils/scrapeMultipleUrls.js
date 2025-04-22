const { scrapeWebsite } = require('./scraper');

async function scrapeMultipleUrls(urls, maxResults = 3, maxCharsPerPage = 4000) {
  const results = [];

  for (const url of urls) {
    if (results.length >= maxResults) break;

    try {
      const content = await scrapeWebsite(url);
      if (content) {
        results.push({
          url,
          content: content.substring(0, maxCharsPerPage)
        });
      }
    } catch (err) {
      console.warn(`Skipping ${url} due to scrape failure.`);
    }
  }

  return results;
}

module.exports = { scrapeMultipleUrls };
