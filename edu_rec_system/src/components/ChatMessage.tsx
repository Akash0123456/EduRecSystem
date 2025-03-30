import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Button } from './ui/button';
import { Message, ChatSource } from '../models/chat';

interface ChatMessageProps {
  message: Message;
  sources?: ChatSource[];
  analysisMethodology?: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  sources,
  analysisMethodology,
}) => {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div className="flex justify-end mb-6">
        <div className="bg-[#06b6d433] rounded-[16px_2px_16px_16px] p-4 max-w-[338px]">
          <div className="text-cyan-50 text-base">{message.content}</div>
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
            <div className="text-gray-100 text-base leading-4">
              {message.content}
            </div>

            {sources && sources.length > 0 && (
              <>
                <Separator className="my-4 bg-gray-700" />

                <div>
                  <div className="text-gray-400 text-sm mb-4">Sources:</div>
                  <div className="space-y-2">
                    {sources.map((source, index) => (
                      <div key={index} className="flex justify-between">
                        <div className="text-cyan-400 text-sm">
                          {source.title}
                        </div>
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
                  <p>{analysisMethodology}</p>
                </CardContent>
              </Card>
            )}

            <div className="flex space-x-[8px]">
              <Button
                variant="ghost"
                size="icon"
                className="h-[30px] w-[26px] p-0"
              >
                <img
                  className="w-[10.5px] h-3.5"
                  alt="Copy"
                  src="https://c.animaapp.com/m8rnoiwsmZEcq2/img/frame-1.svg"
                />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-[30px] w-7 p-0"
              >
                <img
                  className="w-[12.25px] h-3.5"
                  alt="Bookmark"
                  src="https://c.animaapp.com/m8rnoiwsmZEcq2/img/frame-3.svg"
                />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-[30px] w-[30px] p-0"
              >
                <img
                  className="w-3.5 h-3.5"
                  alt="Share"
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
