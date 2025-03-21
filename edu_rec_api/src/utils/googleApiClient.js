const axios = require("axios");

const googleApiClient = axios.create({
    baseURL: "https://www.googleapis.com/customsearch/v1",
    timeout: 5000
});

module.exports = googleApiClient;