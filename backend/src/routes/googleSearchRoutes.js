const express = require("express");
const router = express.Router();
const searchController = require("../controllers/googleSearchController");

router.get("/", searchController.getSearchResults);

module.exports = router;
