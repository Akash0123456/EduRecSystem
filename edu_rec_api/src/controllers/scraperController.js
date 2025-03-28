const { scrapeWebsite } = require('../utils/scraper');

exports.scrapeUrl = async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.status(400).json({
      error: "Missing 'url' query parameter"
    });
  }

  try {
    const content = await scrapeWebsite(url);

    if (!content) {
      return res.status(500).json({
        error: "Scraping failed or returned no usable content"
      });
    }

    res.status(200).json({
      url,
      scrapedContent: content
    });
  } catch (err) {
    console.error(`Error scraping ${url}:`, err.message);
    res.status(500).json({
      error: "An error occurred while scraping the URL"
    });
  }
};
