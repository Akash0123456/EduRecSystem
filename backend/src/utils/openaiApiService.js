const { OpenAI } = require("openai");

function getOpenAIClient() {
    return new OpenAI({
        apiKey: process.env.OPEN_AI_API_KEY
    });
}


async function getChatCompletion(messages) {
    const openai = getOpenAIClient();
    const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages
    });

    let responseObject = {
        role: response.choices[0].message.role,
        content: response.choices[0].message.content
    }

    return responseObject;
}

module.exports = { getChatCompletion };