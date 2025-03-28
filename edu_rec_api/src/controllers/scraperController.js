const { scrapeMultipleUrls } = require("../utils/scrapeMultipleUrls");

exports.scrapeUrl = async (req, res) => {
  const urlsParam = req.query.urls;

  if (!urlsParam) {
    return res.status(400).json({
      error: "Missing 'urls' query parameter"
    });
  }

  const urls = urlsParam.split(',').map(url => url.trim());

  if (urls.length === 0) {
    return res.status(400).json({
      error: "No valid URLs provided"
    });
  }

  try {
    const scrapedResults = await scrapeMultipleUrls(urls, 3);
    if (scrapedResults.length === 0) {
      return res.status(500).json({
        error: "Failed to scrape any of the provided URLs"
      });
    }

    res.status(200).json({ scrapedResults });
  } catch (err) {
    console.error("Scraping error:", err.message);
    res.status(500).json({
      error: "An error occurred during multi-site scraping"
    });
  }
};
