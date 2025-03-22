const { getChatCompletion } = require("../utils/openaiApiService");

exports.chatWithGpt = async (req, res) => {
    const messages  = req.body.messages;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({
            error: "Messages array is required"
        });
    }

    try {
        const response = await getChatCompletion(messages);
        res.json({ response });
    } catch (error) {
        console.error("OpenAI error: ", error.message);
        res.status(500).json({
            error: "Something went wrong " + error.message
        });
    }
}