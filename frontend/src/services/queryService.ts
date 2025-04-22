import { ChatResponse } from './openaiService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

/**
 * Send a message to the query API and get a response formatted for educational purposes
 * @param message The user's message
 * @returns A formatted response with answer, sources, and analysis methodology
 */
export async function sendMessage(message: string): Promise<ChatResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: message
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Raw API Response:', data);

    // Check if the answer is a string containing JSON
    if (typeof data.answer === 'object' && data.answer.content) {
      try {
        // Extract the JSON string from the content, removing the markdown code block
        const jsonStr = data.answer.content.replace(/```json\n|\n```/g, '');
        const parsedContent = JSON.parse(jsonStr);
        console.log('Parsed content:', parsedContent);
        
        // Return the properly structured response with original sources
        return {
          answer: parsedContent.answer,
          sources: data.sources, // Use the original sources from the API response
          analysisMethodology: parsedContent.analysisMethodology
        };
      } catch (parseError) {
        console.error('Error parsing content JSON:', parseError);
        throw parseError;
      }
    }

    return data as ChatResponse;
  } catch (error) {
    console.error('Error calling query API:', error);
    return {
      answer: {
        sections: [
          {
            type: 'paragraph',
            content: "I'm sorry, I encountered an error while processing your request. Please try again later."
          }
        ]
      },
      sources: [],
      analysisMethodology: "Error in processing request."
    };
  }
}

/**
 * Generate a descriptive chat name based on the user's message
 * @param message The user's message
 * @returns A short, descriptive name for the chat
 */
export async function generateChatName(message: string): Promise<string> {
  // For now, we'll use a simple truncation since we don't have a dedicated endpoint for this
  return message.length > 30 ? `${message.substring(0, 30)}...` : message;
} 