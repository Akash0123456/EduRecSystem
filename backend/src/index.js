require("dotenv").config({ path: "./.env" });
const express = require("express");
const cors = require("cors");
const app = express();

// Enable CORS for specific origins
app.use(cors({
  origin: [
    'https://edurecsystem.onrender.com',
    'https://edu-rec-system-frontend.onrender.com',
    'http://localhost:3000',
    'http://localhost:5173'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

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
