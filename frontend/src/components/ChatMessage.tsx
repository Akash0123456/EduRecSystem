import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Button } from './ui/button';
import { Message, ChatSource } from '../models/chat';
import { HybridMathRenderer } from './HybridMathRenderer';

interface ChatMessageProps {
  message: Message;
  sources?: ChatSource[];
  analysisMethodology?: string;
  onRetry?: () => void;
}

// Interface for sentence-source mapping
interface SentenceSourceMapping {
  text: string;
  sourceIndex: number;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  sources,
  analysisMethodology,
  onRetry,
}) => {
  // State to track which sentence is being hovered (and its corresponding source)
  const [hoveredSourceIndex, setHoveredSourceIndex] = useState<number | null>(null);
  
  // State to track which specific sentence is being hovered
  const [hoveredSentenceId, setHoveredSentenceId] = useState<string | null>(null);
  
  // Ref for the sources section to scroll to when a sentence is hovered
  const sourcesRef = useRef<HTMLDivElement>(null);
  
  // Use useMemo to create sentence-source mappings only when content or sources change
  // This prevents unnecessary recalculations on every render
  const sentenceSourceMappings = useMemo(() => {
    const mappings: SentenceSourceMapping[] = [];
    
    if (!sources || sources.length === 0) {
      return mappings;
    }
    
    if (typeof message.content === 'string') {
      // Simple sentence splitting (this is a basic implementation)
      const sentences = message.content.match(/[^.!?]+[.!?]+/g) || [];
      
      // Create mappings (in a real app, this would come from the backend)
      return sentences.map((sentence, index) => ({
        text: sentence.trim(),
        sourceIndex: index % sources.length // Distribute sentences across available sources
      }));
    } else if (message.content && typeof message.content !== 'string') {
      // Handle structured content
      message.content.sections.forEach(section => {
        if (section.type === 'paragraph' && section.content) {
          // Split paragraph into sentences
          const sentences = section.content.match(/[^.!?]+[.!?]+/g) || [];
          
          // Create mappings for each sentence
          sentences.forEach((sentence, idx) => {
            mappings.push({
              text: sentence.trim(),
              sourceIndex: idx % sources.length // Distribute sentences across available sources
            });
          });
        } else if ((section.type === 'numbered_list' || section.type === 'bullet_list') && section.items) {
          // Create mappings for each list item
          section.items.forEach((item, idx) => {
            mappings.push({
              text: item.trim(),
              sourceIndex: idx % sources.length
            });
          });
        }
      });
    }
    
    return mappings;
  }, [message.content, sources]);
  
  // No auto-scrolling functionality
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div className="flex justify-end mb-6">
        <div className="bg-[#06b6d433] rounded-[16px_2px_16px_16px] p-4 max-w-[338px]">
          <div className="text-cyan-50 text-base">
            {typeof message.content === 'string' ? (
              <HybridMathRenderer content={message.content} />
            ) : (
              'User message'
            )}
          </div>
        </div>
      </div>
    );
  }
  
  // Custom renderer for content with source highlighting
  // Memoize this function to prevent unnecessary re-renders
  const renderContentWithSourceHighlighting = useMemo(() => {
    return (content: string) => {
      if (!sources || sources.length === 0 || sentenceSourceMappings.length === 0) {
        return <HybridMathRenderer content={content} />;
      }
      
      // Split content into sentences
      const sentences = content.match(/[^.!?]+[.!?]+/g) || [content];
      
      return (
        <div>
          {sentences.map((sentence, index) => {
            const mapping = sentenceSourceMappings.find(m => m.text === sentence.trim());
            const sourceIndex = mapping?.sourceIndex ?? null;
            
            // Create a unique ID for this sentence
            const sentenceId = `sentence-${index}-${sourceIndex}`;
            
            // Track which sentence is being hovered, but don't highlight based on source index
            return (
              <span 
                key={index}
                className="sentence transition-all duration-300 ease-in-out"
                onMouseEnter={() => {
                  if (sourceIndex !== null) {
                    setHoveredSourceIndex(sourceIndex);
                    setHoveredSentenceId(sentenceId);
                  }
                }}
                onMouseLeave={() => {
                  setHoveredSourceIndex(null);
                  setHoveredSentenceId(null);
                }}
                style={{ 
                  position: 'relative', 
                  cursor: sourceIndex !== null ? 'pointer' : 'default',
                  display: 'inline-block'
                }}
              >
                <HybridMathRenderer content={sentence} />
                {sourceIndex !== null && hoveredSentenceId === sentenceId && sources && (
                  <div className="absolute bottom-full left-0 bg-gray-800 text-white text-xs rounded py-1 px-2 mb-1 z-10 whitespace-nowrap">
                    Source: {sources[sourceIndex]?.title}
                  </div>
                )}
              </span>
            );
          })}
        </div>
      );
    };
  }, [hoveredSourceIndex, sentenceSourceMappings, sources]);

  return (
    <Card className="bg-[#1f293780] border-gray-700 rounded-[2px_16px_16px_16px] mb-6 max-w-[768px]">
      <CardContent className="p-6">
        <div className="flex">
          <div className="bg-[#06b6d433] rounded-lg p-1.5 h-8 w-9 flex items-center justify-center">
            <img
              className="w-5 h-4"
              alt="AI icon"
              src="https://c.animaapp.com/m8rnoiwsmZEcq2/img/frame-9.svg"
            />
          </div>
          <div className="ml-[52px] space-y-4 flex-1">
            <div className="text-gray-100 text-base space-y-4">
              {typeof message.content === 'string' ? (
                <div>
                  {renderContentWithSourceHighlighting(message.content)}
                </div>
              ) : (
                message.content.sections?.map((section, idx) => {
                  switch (section.type) {
                    case 'heading':
                      return (
                        <h3 key={idx} className="text-lg font-semibold text-cyan-400 mt-2">
                          <HybridMathRenderer content={section.content} />
                        </h3>
                      );
                    case 'paragraph':
                      return (
                        <div key={idx} className="leading-6">
                          {renderContentWithSourceHighlighting(section.content)}
                        </div>
                      );
                    case 'numbered_list':
                      return (
                        <div key={idx} className="space-y-2">
                          {section.content && (
                            <div className="font-medium">
                              <HybridMathRenderer content={section.content} />
                            </div>
                          )}
                          <ol className="list-decimal pl-5 space-y-1">
                            {section.items?.map((item, itemIdx) => {
                              const mapping = sentenceSourceMappings.find(m => m.text === item.trim());
                              const sourceIndex = mapping?.sourceIndex ?? null;
                              
                              // Create a unique ID for this list item
                              const itemId = `item-${idx}-${itemIdx}-${sourceIndex}`;
                              
                              return (
                                <li 
                                  key={itemIdx} 
                                  className="pl-1 transition-all duration-300 ease-in-out"
                                  onMouseEnter={() => {
                                    if (sourceIndex !== null) {
                                      setHoveredSourceIndex(sourceIndex);
                                      setHoveredSentenceId(itemId);
                                    }
                                  }}
                                  onMouseLeave={() => {
                                    setHoveredSourceIndex(null);
                                    setHoveredSentenceId(null);
                                  }}
                                  style={{ 
                                    position: 'relative', 
                                    cursor: sourceIndex !== null ? 'pointer' : 'default'
                                  }}
                                >
                                  <HybridMathRenderer content={item} />
                                  {sourceIndex !== null && hoveredSentenceId === itemId && sources && (
                                    <div className="absolute bottom-full left-0 bg-gray-800 text-white text-xs rounded py-1 px-2 mb-1 z-10 whitespace-nowrap">
                                      Source: {sources[sourceIndex]?.title}
                                    </div>
                                  )}
                                </li>
                              );
                            })}
                          </ol>
                        </div>
                      );
                    case 'bullet_list':
                      return (
                        <div key={idx} className="space-y-2">
                          {section.content && (
                            <div className="font-medium">
                              <HybridMathRenderer content={section.content} />
                            </div>
                          )}
                          <ul className="list-disc pl-5 space-y-1">
                            {section.items?.map((item, itemIdx) => {
                              const mapping = sentenceSourceMappings.find(m => m.text === item.trim());
                              const sourceIndex = mapping?.sourceIndex ?? null;
                              
                              // Create a unique ID for this list item
                              const itemId = `bullet-${idx}-${itemIdx}-${sourceIndex}`;
                              
                              return (
                                <li 
                                  key={itemIdx} 
                                  className="pl-1 transition-all duration-300 ease-in-out"
                                  onMouseEnter={() => {
                                    if (sourceIndex !== null) {
                                      setHoveredSourceIndex(sourceIndex);
                                      setHoveredSentenceId(itemId);
                                    }
                                  }}
                                  onMouseLeave={() => {
                                    setHoveredSourceIndex(null);
                                    setHoveredSentenceId(null);
                                  }}
                                  style={{ 
                                    position: 'relative', 
                                    cursor: sourceIndex !== null ? 'pointer' : 'default'
                                  }}
                                >
                                  <HybridMathRenderer content={item} />
                                  {sourceIndex !== null && hoveredSentenceId === itemId && sources && (
                                    <div className="absolute bottom-full left-0 bg-gray-800 text-white text-xs rounded py-1 px-2 mb-1 z-10 whitespace-nowrap">
                                      Source: {sources[sourceIndex]?.title}
                                    </div>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      );
                    case 'equation':
                      return (
                        <div key={idx} className="py-2 px-4 bg-[#111827] rounded my-2 overflow-x-auto">
                          <HybridMathRenderer content={`$$${section.content}$$`} />
                        </div>
                      );
                    default:
                      return <p key={idx}>{section.content}</p>;
                  }
                })
              )}
            </div>

            {sources && sources.length > 0 && (
              <>
                <Separator className="my-4 bg-gray-700" />

                <div ref={sourcesRef}>
                  <div className="text-gray-400 text-sm mb-4">Sources:</div>
                  <div className="space-y-2">
                    {sources.map((source, index) => {
                      // Calculate this only when needed
                      const isHighlighted = hoveredSourceIndex === index;
                      
                      return (
                        <div 
                          id={`source-${index}`}
                          key={index} 
                          className={`flex justify-between ${isHighlighted ? 'bg-cyan-500/10 rounded px-2 py-1 -mx-2' : ''} transition-all duration-300 ease-in-out`}
                        >
                          <a 
                            href={source.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-cyan-400 text-sm font-bold hover:underline hover:text-cyan-300 transition-colors"
                          >
                            {source.title}
                          </a>
                          <div className="text-gray-400 text-xs">
                            {source.url}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {analysisMethodology && (
              <Card className="bg-[#3741514c] border-0 rounded-lg mt-4">
                <CardHeader className="p-4 pb-0">
                  <CardTitle className="text-gray-100 text-sm font-normal">
                    Analysis Methodology
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-2 text-gray-300 text-sm space-y-[20px]">
                  <div>
                    <HybridMathRenderer content={analysisMethodology} />
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex space-x-[8px]">
              <Button
                variant="ghost"
                size="icon"
                className="h-[30px] w-[30px] p-0 hover:bg-cyan-500/20"
                onClick={onRetry}
                title="Retry response"
              >
                <img
                  className="w-3.5 h-3.5"
                  alt="Retry"
                  src="https://c.animaapp.com/m8rnoiwsmZEcq2/img/frame-4.svg"
                />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
