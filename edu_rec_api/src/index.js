const express = require("express");

const app = express();

// Define a basic route
app.get("/", (req, res) => {
    res.send("Hello, World!");
});

module.exports = app;
