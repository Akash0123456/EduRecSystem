import OpenAI from 'openai';
import { Settings } from '../contexts/SettingsContext';

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
  answer: {
    sections: {
      type: 'paragraph' | 'numbered_list' | 'bullet_list' | 'equation' | 'heading';
      content: string;
      items?: string[]; // For lists
    }[];
  };
  sources: {
    title: string;
    url: string;
  }[];
  analysisMethodology: string;
}

// Mock responses for when API key is not available
const mockResponses: Record<string, ChatResponse> = {
  default: {
    answer: {
      sections: [
        {
          type: 'paragraph',
          content: "This is a simulated response as no valid OpenAI API key was provided. To get real AI-powered responses, please add your OpenAI API key to the .env file."
        }
      ]
    },
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
    answer: {
      sections: [
        {
          type: 'paragraph',
          content: "Photosynthesis is the process by which green plants, algae, and some bacteria convert light energy, usually from the sun, into chemical energy in the form of glucose or other sugars. This process occurs in the chloroplasts of plant cells, specifically using the green pigment chlorophyll to capture light energy."
        },
        {
          type: 'equation',
          content: "6\\text{CO}_2 + 6\\text{H}_2\\text{O} + \\text{light energy} \\rightarrow \\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2"
        },
        {
          type: 'paragraph',
          content: "In this equation, carbon dioxide and water, using light energy, produce glucose and oxygen."
        }
      ]
    },
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
  },
  "calculate uniform acceleration": {
    answer: {
      sections: [
        {
          type: 'heading',
          content: "Calculating Uniform Acceleration"
        },
        {
          type: 'paragraph',
          content: "Uniform acceleration occurs when an object's velocity changes at a constant rate. In this scenario, the car starts from rest and reaches a speed of 20 m/s in 5 seconds. To find the car's acceleration, we can use the formula for acceleration:"
        },
        {
          type: 'equation',
          content: "a = \\frac{v_{f} - v_{i}}{t}"
        },
        {
          type: 'paragraph',
          content: "Where 'a' is acceleration, 'v_{f}' is the final velocity, 'v_{i}' is the initial velocity, and 't' is the time taken. Given that the car starts from rest, the initial velocity 'v_{i}' is 0 m/s."
        },
        {
          type: 'equation',
          content: "a = \\frac{20 \\text{ m/s} - 0 \\text{ m/s}}{5 \\text{ s}} = 4 \\text{ m/s}^2"
        },
        {
          type: 'paragraph',
          content: "Thus, the car's acceleration is 4 meters per second squared (m/s²)."
        }
      ]
    },
    sources: [
      {
        title: "Physics for Scientists and Engineers",
        url: "https://example.edu/physics_intro"
      },
      {
        title: "The Physics Classroom: Acceleration",
        url: "https://www.physicsclassroom.com/class/1DKin/Lesson-1/Acceleration"
      }
    ],
    analysisMethodology: "To solve this physics problem, I identified the relevant physical quantities: initial velocity, final velocity, and time. I then applied the formula for uniform acceleration, which relates these quantities. I referenced standard physics textbooks and educational resources to confirm the formula and calculation method to ensure accuracy and adherence to commonly accepted scientific approaches."
  },
  "what are newton's three laws": {
    answer: {
      sections: [
        {
          type: 'heading',
          content: "Newton's Three Laws of Motion"
        },
        {
          type: 'paragraph',
          content: "Newton's Three Laws of Motion are fundamental principles that describe the relationship between the motion of an object and the forces acting upon it."
        },
        {
          type: 'numbered_list',
          content: "Newton's Laws of Motion",
          items: [
            "First Law (Law of Inertia): An object at rest stays at rest, and an object in motion stays in motion at a constant velocity unless acted upon by a net external force. This law introduces the concept of inertia, which is the resistance of any physical object to a change in its state of motion.",
            "Second Law (Law of Acceleration): The acceleration of an object is directly proportional to the net force acting upon it and inversely proportional to its mass. Mathematically, it is expressed as F = ma, where F is the net force applied, m is the mass of the object, and a is the acceleration.",
            "Third Law (Action and Reaction): For every action, there is an equal and opposite reaction. This means that forces always occur in pairs, and when one object exerts a force on another, the second object exerts a force of equal magnitude and in the opposite direction on the first object."
          ]
        },
        {
          type: 'equation',
          content: "F = ma"
        },
        {
          type: 'paragraph',
          content: "These laws form the foundation of classical mechanics and have been used to explain and predict a wide range of physical phenomena, from the motion of planets to the behavior of objects in everyday life."
        }
      ]
    },
    sources: [
      {
        title: "MIT OpenCourseWare: Classical Mechanics",
        url: "https://ocw.mit.edu/courses/physics/8-01sc-classical-mechanics-fall-2016/"
      },
      {
        title: "Khan Academy: Newton's Laws of Motion",
        url: "https://www.khanacademy.org/science/physics/forces-newtons-laws"
      },
      {
        title: "NASA: Newton's Laws of Motion",
        url: "https://www.grc.nasa.gov/www/k-12/airplane/newton.html"
      }
    ],
    analysisMethodology: "To explain Newton's Three Laws of Motion, I consulted authoritative physics resources including university-level textbooks and educational platforms. I focused on presenting each law in clear, concise language while maintaining scientific accuracy. For the Second Law, I included the mathematical formula to provide a complete understanding. The explanation is structured to show how these laws are interconnected and fundamental to our understanding of physical motion."
  }
};

/**
 * Send a message to the OpenAI API and get a response formatted for educational purposes
 * @param message The user's message
 * @param settings User settings for customizing the response
 * @returns A formatted response with answer, sources, and analysis methodology
 */
export async function sendMessage(message: string, settings?: Settings): Promise<ChatResponse> {
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
    // Apply user settings to customize the response
    const responseLength = settings?.responseLength || 'balanced';
    const citationStyle = settings?.citationStyle || 'MLA';
    
    // Customize the system prompt based on settings
    let detailLevel = '';
    switch (responseLength) {
      case 'concise':
        detailLevel = 'Keep your responses brief and focused on key points. Prioritize clarity and conciseness over comprehensive detail.';
        break;
      case 'detailed':
        detailLevel = 'Provide comprehensive, in-depth explanations with thorough coverage of the topic. Include nuanced details and explore related concepts when relevant.';
        break;
      default: // balanced
        detailLevel = 'Provide a balanced level of detail that covers the main points thoroughly without being overly verbose.';
    }
    
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
          
          Response style preferences:
          - Detail level: ${detailLevel}
          - Citation style: Use ${citationStyle} citation format when referencing sources
          
          For each response, you must:
          1. Provide a clear answer to the question, structured in a way that's easy to read, with the detail level specified above
          2. Include 2-4 specific, credible sources with titles and URLs
          3. Include an "Analysis Methodology" section that explains your approach to answering the question
          
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

    try {
      const parsedResponse = JSON.parse(responseContent);
      
      // Handle legacy format (string answer) if needed
      if (typeof parsedResponse.answer === 'string') {
        // Convert string answer to structured format
        parsedResponse.answer = {
          sections: [
            {
              type: 'paragraph',
              content: parsedResponse.answer
            }
          ]
        };
      }
      
      return parsedResponse as ChatResponse;
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError);
      throw new Error("Invalid response format from OpenAI API");
    }
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
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
