require("dotenv").config({ path: "./.env" });
const express = require("express");
const app = express();

// Define routes
const googleSearchRoutes = require("./routes/googleSearchRoutes");

// Create routes
app.use("/search", googleSearchRoutes);

app.get("/", (req, res) => {
    res.send("Hello, World!");
});

module.exports = app;
