require("dotenv").config({ path: "./.env" });
const express = require("express");
const app = express();

app.use(express.json());

// Define routes
const googleSearchRoutes = require("./routes/googleSearchRoutes");
const openaiRoutes = require("./routes/openaiRoutes");
const scraperRoutes = require("./routes/scraperRoutes");

// Create routes
app.use("/search", googleSearchRoutes);
app.use("/chat", openaiRoutes);
app.use("/scrape", scraperRoutes);

app.get("/", (req, res) => {
    res.send("Hello, World!");
});

module.exports = app;
