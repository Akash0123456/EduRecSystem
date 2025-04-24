require("dotenv").config({ path: "./.env" });
const express = require("express");
const cors = require("cors");
const app = express();

// Enable CORS for all routes
app.use(cors());

app.options('*', (req, res) => {
    res.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
    res.sendStatus(204);
});

app.use(express.json());

// Define routes
const googleSearchRoutes = require("./routes/googleSearchRoutes");
const openaiRoutes = require("./routes/openaiRoutes");
const scraperRoutes = require("./routes/scraperRoutes");
const queryRoutes = require("./routes/queryRoutes")

// Create routes
app.use("/search", googleSearchRoutes);
app.use("/chat", openaiRoutes);
app.use("/scrape", scraperRoutes);
app.use("/query", queryRoutes);

app.get("/", (req, res) => {
    res.send("Hello, World!");
});

module.exports = app;
