const { OpenAI } = require("openai");

function getOpenAIClient() {
    return new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: process.env.OPENROUTER_API_KEY
    });
}


async function getChatCompletion(messages) {
    const openai = getOpenAIClient();
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