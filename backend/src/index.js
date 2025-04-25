require("dotenv").config({ path: "./.env" });
const express = require("express");
const cors = require("cors");
const app = express();

const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };
  
  app.use(cors(corsOptions));
  app.options('*', cors(corsOptions));

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
