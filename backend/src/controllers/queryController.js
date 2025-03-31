const googleApiClient = require("../utils/googleApiClient");
const googleConfig = require("../config/googleConfig");
const { scrapeMultipleUrls } = require("../utils/scrapeMultipleUrls");
const { getChatCompletion } = require("../utils/openaiApiService");

exports.getAnswerWithSources = async (req, res) => {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length < 2) {
        return res.status(400).json({
          error: "Request must include at least a system message and an initial user query."
        });
    }

    const systemMessage = messages[0];
    const firstUserMessage = messages[1];
  
    if (systemMessage.role !== "system" || firstUserMessage.role !== "user") {
      return res.status(400).json({
        error: "First message must be 'system', second must be initial 'user' query."
      });
    }
    
    try {
        // Step 1: Search Google
        const params = {
          key: googleConfig.GOOGLE_API_KEY,
          cx: googleConfig.GOOGLE_CSE_ID,
          q: firstUserMessage.content,
          num: 5
        };
    
        const response = await googleApiClient.get("/", { params });
        const links = (response.data.items || []).map(item => item.link);
    
        // Step 2: Scrape up to 3 successful pages
        const scrapedResults = await scrapeMultipleUrls(links, 3, 4000);
    
        // Step 3: Inject scraped content as user messages
        const scrapedMessages = scrapedResults.map(site => ({
          role: "user",
          content: `Content from ${site.url}: ${site.content}`
        }));
    
        // Step 4: Build final messages array
        const finalMessages = [
          systemMessage,
          ...scrapedMessages,
          ...messages.slice(1) // original user + follow-ups
        ];
        
        console.log(finalMessages);

        // Step 5: Send to OpenAI
        const answer = await getChatCompletion(finalMessages);
    
        res.status(200).json({
          answer,
          sources: scrapedResults.map(r => r.url)
        });
    
      } catch (err) {
        console.error("Error in /query with scraping:", err.message);
        res.status(500).json({ error: "Something went wrong during search or scraping." });
      }
}