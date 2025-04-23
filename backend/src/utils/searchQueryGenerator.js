const { getChatCompletion } = require("./openaiApiService");

/**
 * Generate an effective search query using ChatGPT
 * @param {string[]} previousQuestions Array of previous questions
 * @param {string} currentQuestion The current question
 * @returns {Promise<string>} The generated search query
 */
async function generateSearchQuery(previousQuestions, currentQuestion) {
  const messages = [
    {
      role: "system",
      content: `You are a helpful assistant that generates effective Google search queries.
      Given a list of previous questions and a current question, generate a single, focused search query that:
      1. Captures the essence of the current question
      2. Takes into account relevant context from previous questions
      3. Is well-formatted for Google search
      
      Return ONLY the search query, nothing else.`
    },
    {
      role: "user",
      content: `Previous questions: ${previousQuestions.join(' and ')}
      Current question: ${currentQuestion}
      
      Generate an effective Google search query that will help answer the current question while considering relevant context from previous questions.`
    }
  ];

  const response = await getChatCompletion(messages);
  return response.content.trim();
}

module.exports = { generateSearchQuery }; 