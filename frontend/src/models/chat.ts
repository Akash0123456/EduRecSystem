export interface Section {
  type: 'paragraph' | 'numbered_list' | 'bullet_list' | 'equation' | 'heading';
  content: string;
  items?: string[]; // For lists
}

export interface StructuredContent {
  sections: Section[];
}

export interface Message {
  id: string;
  content: string | StructuredContent;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export interface ChatSource {
  title: string;
  url: string;
}

export interface AssistantResponse {
  message: Message;
  sources: ChatSource[];
  analysisMethodology: string;
}

// Helper function to check if content is a string
export function isStringContent(content: string | StructuredContent): content is string {
  return typeof content === 'string';
}

// Helper function to check if content is structured
export function isStructuredContent(content: string | StructuredContent): content is StructuredContent {
  return typeof content !== 'string' && 'sections' in content;
}
