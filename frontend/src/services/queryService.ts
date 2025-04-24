import { ChatResponse, sendMessage as sendOpenAIMessage } from './openaiService';
import { Message } from '../models/chat';
import { Settings } from '../contexts/SettingsContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
const MAX_CONTEXT_LENGTH = 2000;

/**
 * Get the context from previous user questions, limited by character count
 * @param messages Array of previous messages
 * @returns An array containing the most recent user questions
 */
function getQuestionContext(messages: Message[]): string[] {
  // Filter only user messages and get their content
  const userQuestions = messages
    .filter(msg => msg.role === 'user')
    .map(msg => msg.content as string); // We know these are strings since they're user messages
  
  // Return the most recent questions, up to 10
  return userQuestions.slice(-10);
}

/**
 * Send a message to the query API and get a response formatted for educational purposes
 * @param message The user's message
 * @param conversationHistory Optional array of previous messages in the conversation
 * @param settings Optional user settings for customizing the response
 * @returns A formatted response with answer, sources, and analysis methodology
 */
export async function sendMessage(
  message: string, 
  conversationHistory: Message[] = [],
  settings?: Settings
): Promise<ChatResponse> {
  
  try {
    // Check if we should use the direct OpenAI service instead of the backend API
    // This is useful for development or when the backend is not available
    const useDirectOpenAI = import.meta.env.VITE_USE_DIRECT_OPENAI === 'true';
    
    if (useDirectOpenAI) {
      // Use the OpenAI service directly with the user settings
      return await sendOpenAIMessage(message, settings);
    }
    
    // Get the question context from previous messages
    const previousQuestions = getQuestionContext(conversationHistory);
    
    // Include settings in the API request if available
    const requestBody: any = {
      messages: [
        {
          role: 'user',
          content: message,
          previousQuestions: previousQuestions
        }
      ]
    };
    
    // Add settings to the request if available
    if (settings) {
      requestBody.settings = {
        responseLength: settings.responseLength,
        citationStyle: settings.citationStyle
      };
    }
    
    const response = await fetch(`${API_BASE_URL}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
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
