import { MessageSquareIcon, SearchIcon, SendIcon } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { ChatMessage } from "../../components/ChatMessage";
import { Message, ChatSource, AssistantResponse } from "../../models/chat";
import { generateId } from "../../utils/helpers";
import { sendMessage, generateChatName } from "../../services/openaiService";

// Define the type for recent chats
interface RecentChat {
  id: string;
  title: string;
  time: string;
  active: boolean;
  icon: string;
  messages: Message[];
}

// Empty initial state - no sample chats
const sampleRecentChats: RecentChat[] = [];

export const Frame = (): JSX.Element => {
  // State for chats and current active chat
  const [recentChats, setRecentChats] = useState<RecentChat[]>(sampleRecentChats);
  const [activeChat, setActiveChat] = useState<string>("");
  const [assistantResponses, setAssistantResponses] = useState<Record<string, AssistantResponse>>({});
  const [inputValue, setInputValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [retryingMessageId, setRetryingMessageId] = useState<string | null>(null);
  const [showFeedbackPrompt, setShowFeedbackPrompt] = useState<boolean>(false);
  const [lastRetryMessageId, setLastRetryMessageId] = useState<string | null>(null);
  
  // Get current messages from active chat
  const currentChat = recentChats.find(chat => chat.id === activeChat);
  const messages = currentChat ? currentChat.messages : [];
  
  // Ref for chat container to auto-scroll
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, assistantResponses]);

  // Handle starting a new chat
  const handleStartNewChat = () => {
    const newChatId = generateId();
    
    const newChat: RecentChat = {
      id: newChatId,
      title: "New Chat",
      time: "Just now",
      active: true,
      icon: "https://c.animaapp.com/m8rnoiwsmZEcq2/img/frame-10.svg",
      messages: [],
    };
    
    setRecentChats(prev => {
      const updated = prev.map(chat => ({...chat, active: false}));
      return [newChat, ...updated];
    });
    
    setActiveChat(newChatId);
  };
  
  // Handle selecting a chat
  const handleSelectChat = (chatId: string) => {
    setRecentChats(prev => 
      prev.map(chat => ({
        ...chat,
        active: chat.id === chatId
      }))
    );
    setActiveChat(chatId);
  };

  // Handle sending a new message
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading || !currentChat) return;
    
    // Create new user message
    const newUserMessage: Message = {
      id: generateId(),
      content: inputValue,
      role: "user",
      timestamp: new Date(),
    };
    
    // Update chat with new message
    setRecentChats(prev => 
      prev.map(chat => {
        if (chat.id === activeChat) {
          // For now, use a simple title - we'll update it after the API call if this is the first message
          const isFirstMessage = chat.messages.length === 0;
          const initialTitle = isFirstMessage 
            ? (inputValue.length > 30 ? `${inputValue.substring(0, 30)}...` : inputValue)
            : chat.title;
            
          return {
            ...chat,
            title: initialTitle,
            messages: [...chat.messages, newUserMessage],
            time: "Just now"
          };
        }
        return chat;
      })
    );
    
    setInputValue("");
    setIsLoading(true);
    
    try {
      // Call OpenAI API
      const response = await sendMessage(newUserMessage.content);
      
      // Create assistant message
      const assistantMessage: Message = {
        id: generateId(),
        content: response.answer,
        role: "assistant",
        timestamp: new Date(),
      };
      
      // Create assistant response
      const assistantResponse: AssistantResponse = {
        message: assistantMessage,
        sources: response.sources,
        analysisMethodology: response.analysisMethodology,
      };
      
      // Check if this is the first message to generate a chat name
      const isFirstMessage = currentChat.messages.length === 1; // Only the user message
      
      if (isFirstMessage) {
        // Generate a better chat name using OpenAI
        try {
          const chatName = await generateChatName(newUserMessage.content);
          
          // Update chat with the new name and the assistant message
          setRecentChats(prev => 
            prev.map(chat => {
              if (chat.id === activeChat) {
                return {
                  ...chat,
                  title: chatName,
                  messages: [...chat.messages, assistantMessage]
                };
              }
              return chat;
            })
          );
        } catch (error) {
          console.error("Error generating chat name:", error);
          // Fall back to updating without changing the name
          setRecentChats(prev => 
            prev.map(chat => {
              if (chat.id === activeChat) {
                return {
                  ...chat,
                  messages: [...chat.messages, assistantMessage]
                };
              }
              return chat;
            })
          );
        }
      } else {
        // Just update with the new message
        setRecentChats(prev => 
          prev.map(chat => {
            if (chat.id === activeChat) {
              return {
                ...chat,
                messages: [...chat.messages, assistantMessage]
              };
            }
            return chat;
          })
        );
      }
      
      setAssistantResponses(prev => ({
        ...prev,
        [assistantMessage.id]: assistantResponse,
      }));
      
    } catch (error) {
      console.error("Error sending message:", error);
      // Handle error - could add an error message to the chat
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // Handle key press (Enter to send)
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  // Handle retry for an assistant message
  const handleRetry = async (messageId: string) => {
    if (isLoading || !currentChat) return;
    
    // Find the user message that preceded this assistant message
    const messageIndex = currentChat.messages.findIndex(m => m.id === messageId);
    if (messageIndex <= 0) return; // No preceding user message found
    
    const userMessage = currentChat.messages[messageIndex - 1];
    if (userMessage.role !== 'user') return; // Safety check
    
    setRetryingMessageId(messageId);
    setIsLoading(true);
    setShowFeedbackPrompt(false);
    
    try {
      // Call OpenAI API with the same user message
      const response = await sendMessage(userMessage.content);
      
      // Create new assistant message
      const newAssistantMessage: Message = {
        id: generateId(),
        content: response.answer,
        role: "assistant",
        timestamp: new Date(),
      };
      
      // Create assistant response
      const assistantResponse: AssistantResponse = {
        message: newAssistantMessage,
        sources: response.sources,
        analysisMethodology: response.analysisMethodology,
      };
      
      // Update states - replace the old assistant message with the new one
      setRecentChats(prev => 
        prev.map(chat => {
          if (chat.id === activeChat) {
            const newMessages = [...chat.messages];
            newMessages[messageIndex] = newAssistantMessage;
            return {
              ...chat,
              messages: newMessages
            };
          }
          return chat;
        })
      );
      
      // Update assistant responses
      setAssistantResponses(prev => ({
        ...prev,
        [newAssistantMessage.id]: assistantResponse,
      }));
      
      // Set last retry message ID for feedback prompt
      setLastRetryMessageId(newAssistantMessage.id);
      setShowFeedbackPrompt(true);
      
    } catch (error) {
      console.error("Error retrying response:", error);
    } finally {
      setIsLoading(false);
      setRetryingMessageId(null);
    }
  };
  
  // Handle feedback response
  const handleFeedback = (liked: boolean) => {
    // Here you could send the feedback to your analytics or logging system
    console.log(`User ${liked ? 'liked' : 'disliked'} the new response`);
    setShowFeedbackPrompt(false);
  };
  return (
    <div className="flex flex-col bg-gray-900 min-h-screen">
      {/* Header */}
      <header className="w-full h-[69px] bg-[#111827f2] border-b border-gray-800 fixed top-0 z-10">
        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="font-bold text-2xl">
              <span className="text-gray-100">EduRec</span>
              <span className="text-cyan-400">.</span>
            </div>
            <nav className="flex space-x-6">
              <div className="text-gray-400">Home</div>
              <div className="text-gray-400">About</div>
              <div className="text-gray-400">Settings</div>
            </nav>
          </div>
          {/* Removed search icon as requested */}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex pt-[69px] h-screen">
        {/* Sidebar */}
        <aside className="w-80 border-r border-gray-800 flex flex-col h-full">
          {/* User Profile */}
          <div className="p-6">
            <div className="flex items-center">
              <div className="relative">
                <Avatar className="h-12 w-12 bg-gray-700">
                  <AvatarFallback className="text-gray-300">TU</AvatarFallback>
                </Avatar>
                <div className="absolute bottom-0 right-0 bg-cyan-500 rounded-full w-5 h-5 flex items-center justify-center">
                  <img
                    className="w-3 h-3"
                    alt="Frame"
                    src="https://c.animaapp.com/m8rnoiwsmZEcq2/img/frame.svg"
                  />
                </div>
              </div>
              <div className="ml-4">
                <div className="text-gray-100 text-base">Test User</div>
                <div className="text-gray-400 text-sm">Premium Member</div>
              </div>
            </div>
          </div>

          {/* New Chat Button */}
          <Button 
            className="mx-6 bg-cyan-500 hover:bg-cyan-600 text-white flex items-center justify-center gap-2"
            onClick={handleStartNewChat}
          >
            <MessageSquareIcon className="h-3.5 w-3.5" />
            <span>Start New Chat</span>
          </Button>

          {/* Recent Chats */}
          <div className="p-6 flex-1 overflow-auto">
            <div className="text-gray-400 text-sm mb-2">Recent Chats</div>
            <div className="space-y-2">
              {recentChats.map((chat) => (
                <Card
                  key={chat.id}
                  className={`${chat.active ? "bg-[#1f293780]" : "bg-transparent"} rounded-lg hover:bg-[#1f293780] transition-colors cursor-pointer`}
                  onClick={() => handleSelectChat(chat.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start">
                      <div className="flex items-center justify-center mt-2.5">
                        <img
                          className="w-3.5 h-4"
                          alt="Chat icon"
                          src={chat.icon}
                        />
                      </div>
                      <div className="ml-[26px]">
                        <div className="text-gray-100 text-sm font-medium">
                          {chat.title}
                        </div>
                        <div className="text-gray-400 text-xs">{chat.time}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col h-full">
          {/* Chat History */}
          <div ref={chatContainerRef} className="flex-1 p-6 overflow-auto">
            {!activeChat ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="bg-[#1a2235] rounded-full p-6 mb-6">
                  <MessageSquareIcon className="h-12 w-12 text-cyan-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-100 mb-3">Welcome to EduRec</h2>
                <p className="text-gray-400 max-w-md mb-8">
                  Your AI-powered educational assistant. Ask any academic question to get started.
                </p>
                <Button 
                  className="bg-cyan-500 hover:bg-cyan-600 text-white"
                  onClick={handleStartNewChat}
                >
                  Start New Chat
                </Button>
              </div>
            ) : (
              <>
                {messages.map((message) => {
                  const assistantResponse = message.role === 'assistant' 
                    ? assistantResponses[message.id] 
                    : undefined;
                  
                  return (
                    <ChatMessage
                      key={message.id}
                      message={message}
                      sources={assistantResponse?.sources}
                      analysisMethodology={assistantResponse?.analysisMethodology}
                      onRetry={message.role === 'assistant' ? () => handleRetry(message.id) : undefined}
                    />
                  );
                })}
                
                {isLoading && (
                  <div className="flex items-center justify-center p-4">
                    <div className="animate-pulse text-cyan-400">
                      {retryingMessageId ? "Generating new response..." : "Generating educational response..."}
                    </div>
                  </div>
                )}
                
                {showFeedbackPrompt && lastRetryMessageId && (
                  <div className="bg-[#1f293780] border border-gray-700 rounded-lg p-4 mb-4 max-w-md mx-auto">
                    <p className="text-gray-100 text-center mb-3">Do you like the new response better?</p>
                    <div className="flex justify-center space-x-4">
                      <Button 
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleFeedback(true)}
                      >
                        Yes
                      </Button>
                      <Button 
                        className="bg-red-600 hover:bg-red-700 text-white"
                        onClick={() => handleFeedback(false)}
                      >
                        No
                      </Button>
                    </div>
                  </div>
                )}
                
                {messages.length === 0 && !isLoading && (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-gray-400 text-center">
                      <p className="mb-2">Type a question to get started</p>
                      <p className="text-sm">Example: "What is photosynthesis?"</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Chat Input */}
          <div className="border-t border-gray-800 p-4">
            <div className="max-w-3xl mx-auto relative">
              <div className="bg-[#1f293780] rounded-xl flex items-center">
                <Input
                  className="bg-transparent border-0 h-14 px-4 text-gray-100 focus-visible:ring-0 focus-visible:ring-offset-0"
                  placeholder="Ask an educational question..."
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading || !activeChat}
                />
                {/* Removed voice message icon as requested */}
                <Button 
                  className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg h-10 px-4 mr-2 flex items-center gap-2"
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputValue.trim() || !activeChat}
                >
                  <SendIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
