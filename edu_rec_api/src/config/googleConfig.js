require("dotenv").config({ path: "../.env" });

module.exports = {
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    GOOGLE_CSE_ID: process.env.GOOGLE_CSE_ID
};