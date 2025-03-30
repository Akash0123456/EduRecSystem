import OpenAI from 'openai';

// Initialize the OpenAI client if API key is available
// Note: You'll need to set the VITE_OPENAI_API_KEY environment variable
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
const hasValidApiKey = apiKey && apiKey !== 'your_openai_api_key_here';

let openai: OpenAI | null = null;
if (hasValidApiKey) {
  openai = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true // For client-side usage (in production, API calls should be made from the backend)
  });
}

// Define the response structure
export interface ChatResponse {
  answer: string;
  sources: {
    title: string;
    url: string;
  }[];
  analysisMethodology: string;
}

// Mock responses for when API key is not available
const mockResponses: Record<string, ChatResponse> = {
  default: {
    answer: "This is a simulated response as no valid OpenAI API key was provided. To get real AI-powered responses, please add your OpenAI API key to the .env file.",
    sources: [
      {
        title: "OpenAI API Documentation",
        url: "https://platform.openai.com/docs/api-reference"
      },
      {
        title: "React Documentation",
        url: "https://react.dev/learn"
      }
    ],
    analysisMethodology: "This is a mock response generated locally without using the OpenAI API. In a real implementation, the analysis would be generated based on credible academic sources and educational content."
  },
  "what is photosynthesis": {
    answer: "Photosynthesis is the process by which green plants, algae, and some bacteria convert light energy, usually from the sun, into chemical energy in the form of glucose or other sugars. This process occurs in the chloroplasts of plant cells, specifically using the green pigment chlorophyll to capture light energy. The overall chemical equation for photosynthesis is: 6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂, where carbon dioxide and water, using light energy, produce glucose and oxygen.",
    sources: [
      {
        title: "Khan Academy: Photosynthesis",
        url: "https://www.khanacademy.org/science/biology/photosynthesis-in-plants"
      },
      {
        title: "National Geographic: Photosynthesis",
        url: "https://education.nationalgeographic.org/resource/photosynthesis/"
      },
      {
        title: "Biology LibreTexts: Photosynthesis",
        url: "https://bio.libretexts.org/Bookshelves/Introductory_and_General_Biology/Book%3A_General_Biology_(Boundless)/8%3A_Photosynthesis/8.2%3A_The_Light-Dependent_Reactions_of_Photosynthesis"
      }
    ],
    analysisMethodology: "This explanation of photosynthesis is based on fundamental biological principles established in plant physiology. The analysis draws from primary textbook sources in biology and biochemistry, focusing on the core chemical reaction and cellular mechanisms. The explanation is structured to provide a clear overview of the process, including the location (chloroplasts), key components (chlorophyll), and the balanced chemical equation showing inputs and outputs."
  }
};

/**
 * Send a message to the OpenAI API and get a response formatted for educational purposes
 * @param message The user's message
 * @returns A formatted response with answer, sources, and analysis methodology
 */
export async function sendMessage(message: string): Promise<ChatResponse> {
  // If no valid API key, return mock response
  if (!hasValidApiKey || !openai) {
    console.log("Using mock response as no valid API key was provided");
    
    // Check if we have a specific mock response for this query
    const normalizedMessage = message.toLowerCase().trim();
    const mockResponse = mockResponses[normalizedMessage] || mockResponses.default;
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return mockResponse;
  }
  
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are EduRec, an educational AI assistant designed exclusively for academic purposes. 
          Your responses must be:
          
          1. Strictly educational and factual
          2. Based on credible academic sources
          3. Neutral and objective
          4. Appropriate for educational settings
          
          For each response, you must:
          1. Provide a clear, concise answer to the question
          2. Include 2-4 specific, credible sources with titles and URLs
          3. Include an "Analysis Methodology" section that explains your approach to answering the question
          
          Format your response as a JSON object with the following structure:
          {
            "answer": "Your educational answer here",
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
          
          Refuse to answer any questions that are not educational in nature or that request inappropriate content.`
        },
        {
          role: "user",
          content: message
        }
      ],
      response_format: { type: "json_object" }
    });

    // Parse the JSON response
    const responseContent = completion.choices[0].message.content;
    if (!responseContent) {
      throw new Error("Empty response from OpenAI API");
    }

    return JSON.parse(responseContent) as ChatResponse;
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return {
      answer: "I'm sorry, I encountered an error while processing your request. Please try again later.",
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
  // If no valid API key, generate a simple name
  if (!hasValidApiKey || !openai) {
    console.log("Using simple chat name as no valid API key was provided");
    
    // Return a truncated version of the message
    return message.length > 30 ? `${message.substring(0, 30)}...` : message;
  }
  
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant that generates concise, descriptive titles for chat conversations.
          Given a user's message, create a short (3-5 words), descriptive title that captures the main topic or question.
          The title should be clear, specific, and relevant to the educational topic being discussed.
          Do not use quotes or any special formatting. Just return the plain text title.`
        },
        {
          role: "user",
          content: `Generate a short, descriptive title for a chat that starts with this message: "${message}"`
        }
      ]
    });

    const chatName = completion.choices[0].message.content?.trim() || message;
    return chatName;
  } catch (error) {
    console.error("Error generating chat name:", error);
    // Fallback to using the message itself
    return message.length > 30 ? `${message.substring(0, 30)}...` : message;
  }
}
