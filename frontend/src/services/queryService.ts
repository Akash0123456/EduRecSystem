import { ChatResponse } from './openaiService';
import { Message } from '../models/chat';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
const MAX_CONTEXT_LENGTH = 2000;

/**
 * Get the context from previous user questions, limited by character count
 * @param messages Array of previous messages
 * @returns A string containing the concatenated user questions
 */
function getQuestionContext(messages: Message[]): string {
  // Filter only user messages and get their content
  const userQuestions = messages
    .filter(msg => msg.role === 'user')
    .map(msg => msg.content as string); // We know these are strings since they're user messages
  
  // Start with the most recent questions
  let context = userQuestions.join(' and ');
  
  // If we're over the limit, remove oldest questions until we're under
  while (context.length > MAX_CONTEXT_LENGTH && userQuestions.length > 1) {
    userQuestions.shift(); // Remove oldest question
    context = userQuestions.join(' and ');
  }
  
  return context;
}

/**
 * Send a message to the query API and get a response formatted for educational purposes
 * @param message The user's message
 * @param conversationHistory Optional array of previous messages in the conversation
 * @returns A formatted response with answer, sources, and analysis methodology
 */
export async function sendMessage(message: string, conversationHistory: Message[] = []): Promise<ChatResponse> {
  
  try {
    // Get the question context from previous messages
    const questionContext = getQuestionContext(conversationHistory);
    
    // If we have previous questions, prepend them to the current message
    const fullMessage = questionContext 
      ? `${questionContext} and ${message}`
      : message;
    console.log('Full message:', fullMessage);
    const response = await fetch(`${API_BASE_URL}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: fullMessage
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
  return message.length > 30 ? `${message.substring(0, 30)}...` : message;
} 