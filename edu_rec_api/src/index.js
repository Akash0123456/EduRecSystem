require("dotenv").config({ path: "./.env" });
const express = require("express");
const app = express();

app.use(express.json());

// Define routes
const googleSearchRoutes = require("./routes/googleSearchRoutes");
const openaiRoutes = require("./routes/openaiRoutes");

// Create routes
app.use("/search", googleSearchRoutes);
app.use("/chat", openaiRoutes);

app.get("/", (req, res) => {
    res.send("Hello, World!");
});

module.exports = app;
