import { MessageSquareIcon, SendIcon, Trash2Icon, Loader2Icon } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { Header } from "../../components/Header";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { ChatMessage } from "../../components/ChatMessage";
import { Message, AssistantResponse, isStringContent } from "../../models/chat";
import { sendMessage } from "../../services/queryService";
import { createChat, addMessage, getUserChats, updateChatTitle, deleteChat } from "../../services/chatService";
import { generateChatName } from "../../services/openaiService";
import { auth } from "../../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { QueryDocumentSnapshot } from "firebase/firestore";

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
  const navigate = useNavigate();
  // State for chats and current active chat
  const [recentChats, setRecentChats] = useState<RecentChat[]>(sampleRecentChats);
  const [activeChat, setActiveChat] = useState<string>("");
  const [assistantResponses, setAssistantResponses] = useState<Record<string, AssistantResponse>>({});
  const [inputValue, setInputValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const [retryingMessageId, setRetryingMessageId] = useState<string | null>(null);
  const [showFeedbackPrompt, setShowFeedbackPrompt] = useState<boolean>(false);
  const [lastRetryMessageId, setLastRetryMessageId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userData, setUserData] = useState<{
    displayName: string | null;
    email: string | null;
  }>({
    displayName: null,
    email: null
  });
  const [hasMoreChats, setHasMoreChats] = useState<boolean>(true);
  const [lastLoadedChat, setLastLoadedChat] = useState<QueryDocumentSnapshot | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const chatListRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  
  // Get current messages from active chat
  const currentChat = recentChats.find(chat => chat.id === activeChat);
  const messages = currentChat ? currentChat.messages : [];
  
  // Ref for chat container to auto-scroll
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Setup intersection observer for infinite scroll
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '100px', // Load more when user is 100px from bottom
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMoreChats && !isLoadingMore && !isInitialLoading) {
        console.log('Intersection observer triggered - loading more chats');
        loadMoreChats();
      }
    }, options);

    if (chatListRef.current) {
      observer.observe(chatListRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [hasMoreChats, isLoadingMore, isInitialLoading]);

  // Load more chats
  const loadMoreChats = async () => {
    if (!hasMoreChats || isLoadingMore || isInitialLoading) {
      console.log('Skipping load more:', { hasMoreChats, isLoadingMore, isInitialLoading });
      return;
    }

    console.log('Starting to load more chats');
    setIsLoadingMore(true);
    try {
      const { chats: newChats, lastDoc } = await getUserChats(lastLoadedChat || undefined);
      
      console.log('Loading more chats. Current chats:', recentChats.map(c => c.id));
      console.log('New chats to add:', newChats.map(c => c.id));
      
      if (newChats.length === 0) {
        console.log('No more chats to load');
        setHasMoreChats(false);
      } else {
        // Filter out any chats that might already exist in the list
        const existingChatIds = new Set(recentChats.map(chat => chat.id));
        const uniqueNewChats = newChats.filter(chat => !existingChatIds.has(chat.id));
        
        console.log('Filtered unique new chats:', uniqueNewChats.map(c => c.id));
        
        if (uniqueNewChats.length > 0) {
          setRecentChats(prev => {
            const updated = [...prev, ...uniqueNewChats];
            console.log('Updated chat list:', updated.map(c => c.id));
            return updated;
          });
          setLastLoadedChat(lastDoc);
          setHasMoreChats(newChats.length === 10); // If we got 10 chats, there might be more
        } else {
          console.log('No unique new chats to add');
          setHasMoreChats(false);
        }
      }
    } catch (error) {
      console.error("Error loading more chats:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Update initial chat loading
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      if (user) {
        setUserData({
          displayName: user.displayName,
          email: user.email
        });
        const loadInitialChats = async () => {
          if (isInitialLoading) {
            setIsInitialLoading(true);
            try {
              const { chats, lastDoc } = await getUserChats();
              console.log('Initial chats loaded:', chats.map(c => c.id));
              
              // Ensure no duplicate chats in initial load
              const uniqueChats = Array.from(new Map(chats.map(chat => [chat.id, chat])).values());
              console.log('Unique initial chats:', uniqueChats.map(c => c.id));
              
              setRecentChats(uniqueChats);
              setLastLoadedChat(lastDoc);
              setHasMoreChats(chats.length === 10);
              
              // Set assistant responses for all assistant messages
              const responses: Record<string, AssistantResponse> = {};
              uniqueChats.forEach(chat => {
                chat.messages.forEach(message => {
                  if (message.role === 'assistant' && message.sources) {
                    responses[message.id] = {
                      message,
                      sources: message.sources,
                      analysisMethodology: message.analysisMethodology || '',
                    };
                  }
                });
              });
              setAssistantResponses(responses);
            } catch (error) {
              console.error("Error loading chats:", error);
            } finally {
              setIsInitialLoading(false);
            }
          }
        };
        loadInitialChats();
      } else {
        setUserData({
          displayName: null,
          email: null
        });
        setRecentChats([]);
        setActiveChat("");
        setLastLoadedChat(null);
        setHasMoreChats(true);
        setIsInitialLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, assistantResponses]);

  // Add a debug effect to monitor chat changes
  useEffect(() => {
    console.log('Current chat list:', recentChats.map(c => c.id));
  }, [recentChats]);

  // Handle starting a new chat
  const handleStartNewChat = async () => {
    try {
      const newChatId = await createChat("New Chat");
      
      const newChat: RecentChat = {
        id: newChatId,
        title: "New Chat",
        time: "Just now",
        active: true,
        icon: "https://c.animaapp.com/m8rnoiwsmZEcq2/img/frame-10.svg",
        messages: [],
      };
      
      setRecentChats(prev => {
        const updated = [newChat, ...prev];
        console.log('Updated chat list after new chat:', updated.map(c => c.id));
        return updated;
      });
      
      setActiveChat(newChatId);
    } catch (error) {
      console.error("Error creating new chat:", error);
    }
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
    
    try {
      // Create new user message
      const newUserMessage: Omit<Message, 'id' | 'timestamp'> = {
        content: inputValue,
        role: "user",
      };
      
      // Add message to Firestore
      const messageId = await addMessage(activeChat, newUserMessage);
      
      // Update local state
      const userMessage: Message = {
        ...newUserMessage,
        id: messageId,
        timestamp: new Date(),
      };
      
      setRecentChats(prev => 
        prev.map(chat => {
          if (chat.id === activeChat) {
            const isFirstMessage = chat.messages.length === 0;
            const initialTitle = isFirstMessage 
              ? (inputValue.length > 30 ? `${inputValue.substring(0, 30)}...` : inputValue)
              : chat.title;
            
            // Update the chat title in Firestore if this is the first message
            if (isFirstMessage) {
              updateChatTitle(activeChat, initialTitle).catch(error => {
                console.error("Error updating chat title:", error);
              });
            }
            
            return {
              ...chat,
              title: initialTitle,
              messages: [...chat.messages, userMessage],
              time: "Just now"
            };
          }
          return chat;
        })
      );
      
      setInputValue("");
      setIsLoading(true);
      
      // Call OpenAI API with conversation history
      const response = await sendMessage(
        isStringContent(newUserMessage.content) ? newUserMessage.content : JSON.stringify(newUserMessage.content),
        currentChat.messages
      );
      
      // Create assistant message
      const assistantMessage: Omit<Message, 'id' | 'timestamp'> = {
        content: response.answer,
        role: "assistant",
      };
      
      // Add assistant message to Firestore
      const assistantMessageId = await addMessage(
        activeChat, 
        assistantMessage,
        response.sources,
        response.analysisMethodology
      );
      
      // Update local state
      const fullAssistantMessage: Message = {
        ...assistantMessage,
        id: assistantMessageId,
        timestamp: new Date(),
      };
      
      // Check if this is the first message to generate a chat name
      const isFirstMessage = currentChat.messages.length === 0;
      
      if (isFirstMessage) {
        try {
          const chatName = await generateChatName(
            isStringContent(newUserMessage.content) ? newUserMessage.content : JSON.stringify(newUserMessage.content)
          );
          // Update the chat title in Firestore with the generated name
          await updateChatTitle(activeChat, chatName);
          
          setRecentChats(prev => 
            prev.map(chat => {
              if (chat.id === activeChat) {
                return {
                  ...chat,
                  title: chatName,
                  messages: [...chat.messages, fullAssistantMessage]
                };
              }
              return chat;
            })
          );
        } catch (error) {
          console.error("Error generating chat name:", error);
          setRecentChats(prev => 
            prev.map(chat => {
              if (chat.id === activeChat) {
                return {
                  ...chat,
                  messages: [...chat.messages, fullAssistantMessage]
                };
              }
              return chat;
            })
          );
        }
      } else {
        setRecentChats(prev => 
          prev.map(chat => {
            if (chat.id === activeChat) {
              return {
                ...chat,
                messages: [...chat.messages, fullAssistantMessage]
              };
            }
            return chat;
          })
        );
      }
      
      setAssistantResponses(prev => ({
        ...prev,
        [assistantMessageId]: {
          message: fullAssistantMessage,
          sources: response.sources,
          analysisMethodology: response.analysisMethodology,
        },
      }));
      
    } catch (error) {
      console.error("Error sending message:", error);
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
    const userContent = typeof userMessage.content === 'string' 
      ? userMessage.content 
      : 'Could not retrieve user message';
    
    setRetryingMessageId(messageId);
    setIsLoading(true);
    setShowFeedbackPrompt(false);
    
    try {
      // Call OpenAI API with the same user message and conversation history
      const response = await sendMessage(
        userContent,
        currentChat.messages.slice(0, messageIndex)
      );
      
      // Create new assistant message
      const newAssistantMessage: Omit<Message, 'id' | 'timestamp'> = {
        content: response.answer,
        role: "assistant",
      };
      
      // Add new assistant message to Firestore
      const newAssistantMessageId = await addMessage(
        activeChat, 
        newAssistantMessage,
        response.sources,
        response.analysisMethodology
      );
      
      // Update local state
      const fullAssistantMessage: Message = {
        ...newAssistantMessage,
        id: newAssistantMessageId,
        timestamp: new Date(),
      };
      
      // Create assistant response
      const assistantResponse: AssistantResponse = {
        message: fullAssistantMessage,
        sources: response.sources,
        analysisMethodology: response.analysisMethodology,
      };
      
      // Update states - replace the old assistant message with the new one
      setRecentChats(prev => 
        prev.map(chat => {
          if (chat.id === activeChat) {
            const newMessages = [...chat.messages];
            newMessages[messageIndex] = fullAssistantMessage;
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
        [newAssistantMessageId]: assistantResponse,
      }));
      
      // Set last retry message ID for feedback prompt
      setLastRetryMessageId(newAssistantMessageId);
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

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Handle deleting a chat
  const handleDeleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent chat selection when clicking delete
    try {
      await deleteChat(chatId);
      
      // Update the chats list by filtering out the deleted chat
      setRecentChats(prev => prev.filter(chat => chat.id !== chatId));
      
      // If the deleted chat was active, clear the active chat
      if (activeChat === chatId) {
        setActiveChat("");
      }
      
      // If we've deleted all visible chats and there might be more, load more
      if (recentChats.length <= 1 && hasMoreChats) {
        setLastLoadedChat(null);
        loadMoreChats();
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  return (
    <div className="flex flex-col bg-gray-900 min-h-screen">
      <Header />

      {/* Main Content */}
      <div className="flex pt-[69px] h-screen">
        {/* Sidebar */}
        <aside className="w-80 border-r border-gray-800 flex flex-col h-full">
          {/* User Profile */}
          <div className="p-6">
            <div className="flex items-center">
              <div className="text-gray-100 text-base">
                Welcome, {userData.displayName || userData.email || "user"}
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
              {isInitialLoading ? (
                <div className="flex justify-center py-4">
                  <Loader2Icon className="h-6 w-6 text-cyan-500 animate-spin" />
                </div>
              ) : (
                <>
                  {recentChats.map((chat) => (
                    <Card
                      key={chat.id}
                      className={`${chat.active ? "bg-[#1f293780]" : "bg-transparent"} rounded-lg hover:bg-[#1f293780] transition-colors cursor-pointer`}
                      onClick={() => handleSelectChat(chat.id)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between">
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
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 p-0 hover:bg-red-500/20 hover:text-red-500"
                            onClick={(e) => handleDeleteChat(chat.id, e)}
                            title="Delete chat"
                          >
                            <Trash2Icon className="h-4 w-4 text-gray-100" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {/* Loading indicator */}
                  {isLoadingMore && (
                    <div className="flex justify-center py-4">
                      <Loader2Icon className="h-6 w-6 text-cyan-500 animate-spin" />
                    </div>
                  )}
                  
                  {/* Intersection observer target */}
                  {hasMoreChats && !isLoadingMore && (
                    <div ref={chatListRef} className="h-4" />
                  )}
                </>
              )}
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

          {/* Chat Input - Only show when there's an active chat */}
          {activeChat && (
            <div className="border-t border-gray-800 p-4">
              <div className="max-w-3xl mx-auto relative">
                <div className="bg-[#1f293780] rounded-xl flex items-center">
                  <Input
                    className="bg-transparent border-0 h-14 px-4 text-gray-100 focus-visible:ring-0 focus-visible:ring-offset-0"
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
