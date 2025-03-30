export interface Message {
  id: string;
  content: string;
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
