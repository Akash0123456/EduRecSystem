const googleApiClient = require("../utils/googleApiClient");
const config = require("../config/googleConfig");

exports.getSearchResults = async (req, res) => {
    try {
        const query = req.query.query;

        if (!query) {
            return res.status(400).json({
                    error: "Query parameter (query) is required"
                });
        }

        const params = {
            key: config.GOOGLE_API_KEY,
            cx: config.GOOGLE_CSE_ID,
            q: query,
            num: 10
        };
        
        const response = await googleApiClient.get("/", { params });

        searchResults = response.data.items.map(item => ({
            title: item.title,
            link: item.link
        }));

        
        if (response.status != 200) {
            console.log("Failed to successfully retrieve data");
        }

        res.json({ searchResults });

    } catch (error) {
        console.error("Error fetching results for query from Google Custom Search JSON API");
        res.status(500).json({
            error: "Failed to fetch search results"
        });
    }
}