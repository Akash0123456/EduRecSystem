import { MessageSquareIcon, SendIcon, SearchIcon } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { Header } from "../../components/Header";
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
import { Message, ChatSource, AssistantResponse, isStringContent } from "../../models/chat";
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
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<{
    chatId: string;
    messageId: string;
    content: string;
    context: string;
  }[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [highlightedMessageId, setHighlightedMessageId] = useState<string | null>(null);
  
  // Get current messages from active chat
  const currentChat = recentChats.find(chat => chat.id === activeChat);
  const messages = currentChat ? currentChat.messages : [];

  // Search through all chats and messages
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const query = searchQuery.toLowerCase();
    const results: {
      chatId: string;
      messageId: string;
      content: string;
      context: string;
    }[] = [];

    // Search through all chats and their messages
    recentChats.forEach(chat => {
      chat.messages.forEach(message => {
        let messageContent = "";
        
        // Extract content based on message type
        if (isStringContent(message.content)) {
          messageContent = message.content.toLowerCase();
        } else {
          // For structured content, search through all sections
          message.content.sections.forEach(section => {
            if (section.content) {
              messageContent += section.content.toLowerCase() + " ";
            }
            if (section.items) {
              messageContent += section.items.join(" ").toLowerCase() + " ";
            }
          });
        }
        
        // Check if message content contains the search query
        if (messageContent.includes(query)) {
          // Create a context snippet
          let context = messageContent;
          if (context.length > 100) {
            // Find the position of the query in the content
            const queryIndex = context.indexOf(query);
            // Create a snippet around the query
            const startIndex = Math.max(0, queryIndex - 40);
            const endIndex = Math.min(context.length, queryIndex + query.length + 40);
            context = (startIndex > 0 ? "..." : "") + 
                     context.substring(startIndex, endIndex) + 
                     (endIndex < context.length ? "..." : "");
          }
          
          results.push({
            chatId: chat.id,
            messageId: message.id,
            content: messageContent,
            context: context
          });
        }
      });
    });

    setSearchResults(results);
  };

  // Handle search input change
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (!e.target.value.trim()) {
      setSearchResults([]);
      setIsSearching(false);
    }
  };

  // Handle search key press (Enter to search)
  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Navigate to a specific message from search results
  const navigateToMessage = (chatId: string, messageId: string) => {
    // Set the active chat
    handleSelectChat(chatId);
    // Highlight the message
    setHighlightedMessageId(messageId);
    // Clear search results
    setIsSearching(false);
    
    // Scroll to the message after a short delay to ensure the chat is loaded
    setTimeout(() => {
      const messageElement = document.getElementById(`message-${messageId}`);
      if (messageElement) {
        messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Add a temporary highlight class
        messageElement.classList.add('bg-cyan-500/10');
        // Remove the highlight after a few seconds
        setTimeout(() => {
          messageElement.classList.remove('bg-cyan-500/10');
          setHighlightedMessageId(null);
        }, 3000);
      }
    }, 100);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setIsSearching(false);
    setHighlightedMessageId(null);
  };
  
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
        content: inputValue, // User messages are always strings
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
      // Call OpenAI API - ensure we have a string
      const messageContent = isStringContent(newUserMessage.content) 
        ? newUserMessage.content 
        : JSON.stringify(newUserMessage.content);
      const response = await sendMessage(messageContent);
      
      // Create assistant message
      const assistantMessage: Message = {
        id: generateId(),
        content: response.answer, // This is now a structured content object
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
          // Generate a better chat name using OpenAI (user messages are always strings)
          try {
            // Use the isStringContent helper to check if content is a string
            const userMessageContent = isStringContent(newUserMessage.content) 
              ? newUserMessage.content 
              : 'New Chat';
            const chatName = await generateChatName(userMessageContent);
          
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
    
    // Ensure we have a string content for the API call
    const userContent = isStringContent(userMessage.content)
      ? userMessage.content 
      : 'Could not retrieve user message';
    
    setRetryingMessageId(messageId);
    setIsLoading(true);
    setShowFeedbackPrompt(false);
    
    try {
      // Call OpenAI API with the same user message
      const response = await sendMessage(userContent);
      
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
    <div className="flex flex-col bg-background min-h-screen">
      <Header />

      {/* Main Content */}
      <div className="flex pt-[69px] h-screen">
        {/* Sidebar */}
        <aside className="w-80 border-r border-border flex flex-col h-full">
          {/* User Profile */}
          <div className="p-6">
            <div className="flex items-center">
              <div className="relative">
                <Avatar className="h-12 w-12 bg-secondary">
                  <AvatarFallback className="text-secondary-foreground">TU</AvatarFallback>
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
                  <div className="text-foreground text-base">Test User</div>
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

          {/* Search Input */}
          <div className="px-6 pt-4">
            <div className="relative">
              <Input
                className="bg-card border-border pl-9 pr-9 h-10 text-sm"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={handleSearchInputChange}
                onKeyPress={handleSearchKeyPress}
              />
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              {searchQuery && (
                <button 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground"
                  onClick={clearSearch}
                >
                  ✕
                </button>
              )}
            </div>
            <Button 
              className="w-full mt-2 bg-secondary hover:bg-secondary/80 text-foreground text-sm h-8"
              onClick={handleSearch}
              disabled={!searchQuery.trim()}
            >
              Search
            </Button>
          </div>

          {/* Search Results or Recent Chats */}
          <div className="p-6 flex-1 overflow-auto">
            {isSearching && searchResults.length > 0 ? (
              <>
                <div className="flex justify-between items-center mb-2">
                  <div className="text-muted-foreground text-sm">Search Results ({searchResults.length})</div>
                  <button 
                    className="text-cyan-500 hover:text-cyan-400 text-xs"
                    onClick={clearSearch}
                  >
                    Clear
                  </button>
                </div>
                <div className="space-y-2">
                  {searchResults.map((result, index) => {
                    const chat = recentChats.find(c => c.id === result.chatId);
                    return (
                      <Card
                        key={`${result.chatId}-${result.messageId}-${index}`}
                        className="bg-card rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
                        onClick={() => navigateToMessage(result.chatId, result.messageId)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-start">
                            <div className="flex items-center justify-center mt-2.5">
                              <img
                                className="w-3.5 h-4"
                                alt="Chat icon"
                                src={chat?.icon || "https://c.animaapp.com/m8rnoiwsmZEcq2/img/frame-9.svg"}
                              />
                            </div>
                            <div className="ml-[26px]">
                              <div className="text-foreground text-sm font-medium">
                                {chat?.title || "Chat"}
                              </div>
                              <div className="text-muted-foreground text-xs mt-1 line-clamp-2">
                                {result.context}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </>
            ) : (
              <>
                <div className="text-muted-foreground text-sm mb-2">
                  {isSearching && searchResults.length === 0 
                    ? "No results found" 
                    : "Recent Chats"}
                </div>
                <div className="space-y-2">
                  {recentChats.map((chat) => (
                    <Card
                      key={chat.id}
                      className={`${chat.active ? "bg-secondary/50" : "bg-transparent"} rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer`}
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
                            <div className="text-foreground text-sm font-medium">
                              {chat.title}
                            </div>
                            <div className="text-muted-foreground text-xs">{chat.time}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col h-full">
          {/* Chat History */}
          <div ref={chatContainerRef} className="flex-1 p-6 overflow-auto">
            {!activeChat ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="bg-secondary rounded-full p-6 mb-6">
                  <MessageSquareIcon className="h-12 w-12 text-cyan-500" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-3">Welcome to EduRec</h2>
                <p className="text-muted-foreground max-w-md mb-8">
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
                    <div 
                      id={`message-${message.id}`} 
                      key={message.id}
                      className={`transition-colors duration-500 ${highlightedMessageId === message.id ? 'bg-cyan-500/10 rounded-lg' : ''}`}
                    >
                      <ChatMessage
                        message={message}
                        sources={assistantResponse?.sources}
                        analysisMethodology={assistantResponse?.analysisMethodology}
                        onRetry={message.role === 'assistant' ? () => handleRetry(message.id) : undefined}
                      />
                    </div>
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
                  <div className="bg-card border border-border rounded-lg p-4 mb-4 max-w-md mx-auto">
                    <p className="text-foreground text-center mb-3">Do you like the new response better?</p>
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
                    <div className="text-muted-foreground text-center">
                      <p className="mb-2">Type a question to get started</p>
                      <p className="text-sm">Example: "What is photosynthesis?"</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Chat Input - Only show when there's an active chat */}
          {activeChat && (
            <div className="border-t border-border p-4">
              <div className="max-w-3xl mx-auto relative">
                <div className="bg-card rounded-xl flex items-center">
                  <Input
                    className="bg-transparent border-0 h-14 px-4 text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                    placeholder="Ask an educational question..."
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                  />
                  {/* Removed voice message icon as requested */}
                  <Button 
                    className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg h-10 px-4 mr-2 flex items-center gap-2"
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputValue.trim()}
                  >
                    <SendIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
