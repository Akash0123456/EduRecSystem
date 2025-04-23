const express = require("express");
const router = express.Router();
const queryController = require("../controllers/queryController.js");

router.post("/", queryController.getAnswerWithSources);

module.exports = router;