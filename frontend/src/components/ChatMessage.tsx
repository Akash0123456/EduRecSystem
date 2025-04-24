import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Button } from './ui/button';
import { Message, ChatSource } from '../models/chat';
import { HybridMathRenderer } from './HybridMathRenderer';
import { SourcePreview } from './SourcePreview';

interface ChatMessageProps {
  message: Message;
  sources?: ChatSource[];
  analysisMethodology?: string;
  onRetry?: () => void;
}

// Helper function to generate a unique ID for a source
const generateSourceId = (index: number) => `source-${index}`;

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  sources,
  analysisMethodology,
  onRetry,
}) => {
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
                <div className="source-annotated-content">
                  {sources && sources.length > 0 ? (
                    <AnnotatedContent content={message.content} sources={sources} />
                  ) : (
                    <HybridMathRenderer content={message.content} />
                  )}
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
                        <div key={idx} className="leading-6 source-annotated-content">
                          {sources && sources.length > 0 ? (
                            <AnnotatedContent content={section.content} sources={sources} />
                          ) : (
                            <HybridMathRenderer content={section.content} />
                          )}
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
                            {section.items?.map((item, itemIdx) => (
                              <li key={itemIdx} className="pl-1">
                                <HybridMathRenderer content={item} />
                              </li>
                            ))}
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
                            {section.items?.map((item, itemIdx) => (
                              <li key={itemIdx} className="pl-1">
                                <HybridMathRenderer content={item} />
                              </li>
                            ))}
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

                <div>
                  <div className="text-gray-400 text-sm mb-4">Sources:</div>
                  <div className="space-y-2">
                    {sources.map((source, index) => (
                      <div 
                        key={index} 
                        className="flex justify-between source-item"
                        data-source-id={generateSourceId(index)}
                      >
                        <SourcePreview source={source} sourceId={generateSourceId(index)} />
                        <div className="text-gray-400 text-xs">
                          {source.url}
                        </div>
                      </div>
                    ))}
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

// Component to annotate content with source references
const AnnotatedContent: React.FC<{ content: string, sources: ChatSource[] }> = ({ content, sources }) => {
  const [hoveredSourceId, setHoveredSourceId] = useState<string | null>(null);
  const [hoveredSource, setHoveredSource] = useState<ChatSource | null>(null);
  
  // Simple sentence splitting - this is a basic implementation
  // A more sophisticated implementation would handle edge cases better
  const sentences = content.split(/(?<=[.!?])\s+/);
  
  // Distribute sources among sentences
  // This is a simple distribution - in a real implementation, you'd want to match
  // sentences to their actual sources based on content analysis
  return (
    <div className="source-content">
      {sentences.map((sentence, idx) => {
        // Assign a source to this sentence - simple round-robin distribution
        const sourceIndex = idx % sources.length;
        const sourceId = generateSourceId(sourceIndex);
        const source = sources[sourceIndex];
        
        return (
          <span 
            key={idx}
            className="source-sentence relative group"
            data-source-id={sourceId}
            onMouseEnter={() => {
              setHoveredSourceId(sourceId);
              setHoveredSource(source);
              // Highlight the corresponding source
              const sourceElement = document.querySelector(`.source-item[data-source-id="${sourceId}"]`);
              if (sourceElement) {
                sourceElement.classList.add('bg-cyan-900/20');
                // Scroll into view if needed
                sourceElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
              }
            }}
            onMouseLeave={() => {
              setHoveredSourceId(null);
              setHoveredSource(null);
              // Remove highlight from the source
              const sourceElement = document.querySelector(`.source-item[data-source-id="${sourceId}"]`);
              if (sourceElement) {
                sourceElement.classList.remove('bg-cyan-900/20');
              }
            }}
          >
            {/* Light highlight effect on hover */}
            <span className="relative">
              <span className="relative z-10">
                <HybridMathRenderer content={sentence + ' '} />
                {idx === sentences.length - 1 ? null : ' '}
              </span>
              <span className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded"></span>
            </span>
            
            {/* Small tooltip that appears on hover */}
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 bg-gray-800 text-white text-xs py-0.5 px-1.5 rounded shadow-lg z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
              Source: {source.title}
            </span>
          </span>
        );
      })}
    </div>
  );
};
