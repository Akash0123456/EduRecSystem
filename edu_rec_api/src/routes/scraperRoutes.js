const express = require("express");
const router = express.Router();
const scraperController = require("../controllers/scraperController");

router.get("/", scraperController.scrapeUrl);

module.exports = router;
