const express = require("express");
const router = express.Router();
const chatController = require("../controllers/openaiController.js");

router.post("/", chatController.chatWithGpt);

module.exports = router;
