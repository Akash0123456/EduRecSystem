const { OpenAI } = require("openai");

const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY
});

async function getChatCompletion(messages) {
    const response = await openai.chat.completions.create({
        model: 'deepseek/deepseek-r1:free',
        messages
    });

    let responseObject = {
        role: response.choices[0].message.role,
        content: response.choices[0].message.content
    }

    return responseObject;
}

module.exports = { getChatCompletion };