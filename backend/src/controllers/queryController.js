const googleApiClient = require("../utils/googleApiClient");
const googleConfig = require("../config/googleConfig");
const { scrapeMultipleUrls } = require("../utils/scrapeMultipleUrls");
const { getChatCompletion } = require("../utils/openaiApiService");
const { generateSearchQuery } = require("../utils/searchQueryGenerator");

// List of banned domains that should not be scraped
const bannedDomains = [
  'facebook.com', 'reddit.com', 'quora.com', 'pinterest.com', 'twitter.com',
  'x.com', 'tiktok.com', 'linkedin.com', 'instagram.com', 'medium.com',
  'stackexchange.com', 'stackoverflow.com', 'chegg.com', 'brainly.com',
  'coursehero.com', 'youtube.com', 'wikihow.com', 'fandom.com', 'slideshare.net',
  'amazon.com', 'ebay.com', 'tripadvisor.com', 'yelp.com', 'imdb.com'
];

/**
 * Check if a URL belongs to a banned domain
 * @param {string} url The URL to check
 * @returns {boolean} True if the URL is from a banned domain
 */
function isBannedDomain(url) {
  try {
    const domain = new URL(url).hostname;
    return bannedDomains.some(bannedDomain => domain.includes(bannedDomain));
  } catch (err) {
    console.warn(`Invalid URL format: ${url}`);
    return true; // Consider invalid URLs as banned to be safe
  }
}

/**
 * Parse the message to separate previous questions from the current question
 * @param {Object} message The message object containing content and previousQuestions
 * @returns {Object} Object containing previous questions and current question
 */
function parseMessage(message) {
  return {
    previousQuestions: message.previousQuestions || [],
    currentQuestion: message.content
  };
}

async function getAnswerWithSources(req, res) {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({
          error: "Request must include at least one user message."
        });
    }

    const firstUserMessage = messages[0];
  
    if (firstUserMessage.role !== "user") {
      return res.status(400).json({
        error: "First message must be a user query."
      });
    }
    
    try {
        // Parse the message to separate previous questions from current question
        const { previousQuestions, currentQuestion } = parseMessage(firstUserMessage);
        
        // Generate an effective search query using ChatGPT
        const searchQuery = await generateSearchQuery(previousQuestions, currentQuestion);
        console.log("searchQuery", searchQuery);
        
        // Format the message for the AI
        const formattedMessage = previousQuestions.length > 0
          ? `Previously asked questions: ${previousQuestions.join(' and ')} Current question: ${currentQuestion}`
          : `Previously asked questions: None Current question: ${currentQuestion}`;
        
        // Step 1: Search Google using the generated search query
        const params = {
          key: googleConfig.GOOGLE_API_KEY,
          cx: googleConfig.GOOGLE_CSE_ID,
          q: searchQuery, // Use the generated search query
          num: 10 // Increased to account for potential filtering
        };
    
        const response = await googleApiClient.get("/", { params });
        const searchResults = response.data.items || [];
        
        // Filter out banned domains from search results
        const filteredResults = searchResults.filter(result => !isBannedDomain(result.link));
        const links = filteredResults.map(item => item.link);
    
        // Step 2: Scrape up to 3 successful pages
        const scrapedResults = await scrapeMultipleUrls(links, 3, 4000);
    
        // Step 3: Inject scraped content as user messages
        const scrapedMessages = scrapedResults.map(site => ({
          role: "user",
          content: `Content from ${site.url}: ${site.content}`
        }));
    
        // Step 4: Build final messages array with system message
        const systemMessage = {
          role: "system",
          content: `You are EduRec, an educational AI assistant designed exclusively for academic purposes.

          Your responses must be:
          
          1. Strictly educational and factual
          2. Based on the content provided
          3. Neutral and objective
          4. Appropriate for educational settings
          
          For each response, you must:
          1. Provide a clear, concise answer to the question, structured in a way that's easy to read
          2. Include 2-4 specific, credible sources with titles and URLs
          3. Include an "Analysis Methodology" section that explains your approach to answering the question
          
          If no scraped content is provided or if the provided sources do not contain relevant information:
          1. Provide your best answer based on your knowledge
          2. At the end of your response, add a section with type "paragraph" and content: "Note: This answer was provided without using the scraped sources as they did not contain relevant information for this question."
          3. In the "Analysis Methodology" section, mention that you relied on your general knowledge rather than the provided sources
          
          Format your response as a JSON object with the following structure:
          {
            "answer": {
              "sections": [
                {
                  "type": "heading",
                  "content": "Optional heading if needed"
                },
                {
                  "type": "paragraph",
                  "content": "A paragraph of text explaining a concept"
                },
                {
                  "type": "numbered_list",
                  "content": "List title or context",
                  "items": [
                    "First numbered item",
                    "Second numbered item",
                    "Third numbered item"
                  ]
                },
                {
                  "type": "bullet_list",
                  "content": "List title or context",
                  "items": [
                    "First bullet point",
                    "Second bullet point",
                    "Third bullet point"
                  ]
                },
                {
                  "type": "equation",
                  "content": "E = mc²"
                }
              ]
            },
            "sources": [
              {
                "title": "Source Title 1",
                "url": "https://example.edu/source1"
              },
              {
                "title": "Source Title 2",
                "url": "https://example.edu/source2"
              }
            ],
            "analysisMethodology": "Explanation of how you approached answering this question, including the types of sources consulted and the analytical framework used."
          }
          
          Important formatting guidelines:
          1. Break your answer into logical sections using the appropriate types
          2. Use "heading" for main section titles
          3. Use "paragraph" for explanatory text
          4. Use "numbered_list" for sequential or prioritized items
          5. Use "bullet_list" for unordered collections of items
          6. Use "equation" for mathematical formulas or scientific equations
          
          For mathematical equations:
          1. Use proper LaTeX syntax in the "equation" sections
          2. Do not include the LaTeX delimiters ($ or $$) in the equation content
          3. For inline equations like variables, use the paragraph type and mention the variable name
          4. For display equations, use the equation type with proper LaTeX syntax
          5. Always use proper LaTeX subscript notation for variables like v_f and v_i, writing them as v_{f} and v_{i}
          6. Example: For the quadratic formula, use "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}" (without quotes)
          
          Refuse to answer any questions that are not educational in nature or that request inappropriate content.`
        };

        const finalMessages = [
          systemMessage,
          ...scrapedMessages,
          {
            role: "user",
            content: currentQuestion
          }
        ];
        
        // Step 5: Send to OpenAI
        const answer = await getChatCompletion(finalMessages);
    
        // Step 6: Format the response to match frontend expectations
        const formattedResponse = {
          answer: typeof answer === 'string' 
            ? {
                sections: [
                  {
                    type: 'paragraph',
                    content: answer
                  }
                ]
              }
            : answer,
          sources: searchResults.slice(0, scrapedResults.length).map((result, index) => ({
            title: result.title,
            url: scrapedResults[index].url
          })),
          analysisMethodology: "This response was generated by analyzing relevant web content and academic sources. The information was gathered through a combination of web search and content scraping, then processed through an AI model to provide a structured, educational response."
        };
    
        res.status(200).json(formattedResponse);
    
      } catch (err) {
        console.error("Error in /query with scraping:", err.message);
        res.status(500).json({ error: "Something went wrong during search or scraping." });
      }
}

module.exports = {
  getAnswerWithSources,
  isBannedDomain,
  parseMessage
};