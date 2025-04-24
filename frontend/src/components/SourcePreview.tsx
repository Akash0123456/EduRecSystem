import React, { useState, useEffect } from 'react';
import { ChatSource } from '../models/chat';

interface SourcePreviewProps {
  source: ChatSource;
  sourceId?: string;
}

export const SourcePreview: React.FC<SourcePreviewProps> = ({ source, sourceId }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [microlinkData, setMicrolinkData] = useState<any>(null);

  // Fetch microlink data when component mounts
  useEffect(() => {
    const fetchMicrolinkData = async () => {
      try {
        const response = await fetch(`https://api.microlink.io?url=${encodeURIComponent(source.url)}`);
        const data = await response.json();
        if (data.status === 'success') {
          setMicrolinkData(data.data);
        }
      } catch (error) {
        console.error('Error fetching microlink data:', error);
      }
    };

    fetchMicrolinkData();
  }, [source.url]);

  return (
    <>
      {/* Simple hover preview with native HTML */}
      <div 
        className="relative"
        onMouseEnter={() => {
          setShowTooltip(true);
          // Highlight corresponding sentences when hovering over source
          if (sourceId) {
            const sentences = document.querySelectorAll(`span[data-source-id="${sourceId}"]`);
            sentences.forEach(sentence => {
              sentence.classList.add('bg-cyan-900/20');
            });
          }
        }}
        onMouseLeave={() => {
          setShowTooltip(false);
          // Remove highlight from sentences
          if (sourceId) {
            const sentences = document.querySelectorAll(`span[data-source-id="${sourceId}"]`);
            sentences.forEach(sentence => {
              sentence.classList.remove('bg-cyan-900/20');
            });
          }
        }}
      >
        <a 
          href={source.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-cyan-400 text-sm font-bold hover:underline hover:text-cyan-300 transition-colors"
        >
          {source.title}
        </a>
        
        {/* Tooltip that appears on hover */}
        {showTooltip && (
          <div className="absolute left-0 bottom-full mb-2 z-50">
            <div className="bg-gray-800 rounded-lg shadow-lg p-3 w-80">
              {microlinkData ? (
                <div className="space-y-2">
                  {microlinkData.logo && (
                    <div className="flex items-center space-x-2">
                      <img 
                        src={microlinkData.logo.url} 
                        alt="Site logo" 
                        className="w-4 h-4"
                      />
                      <span className="text-gray-300 text-xs">{microlinkData.publisher}</span>
                    </div>
                  )}
                  <h3 className="text-white text-sm font-medium">{microlinkData.title || source.title}</h3>
                  {microlinkData.description && (
                    <p className="text-gray-300 text-xs line-clamp-2">{microlinkData.description}</p>
                  )}
                  {source.url.startsWith('http') ? (
                    <a 
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="preview-button bg-cyan-600 hover:bg-cyan-700 text-white text-xs py-1 px-2 rounded transition-colors inline-block"
                    >
                      Go to website
                    </a>
                  ) : (
                    <div className="text-gray-400 text-xs italic">No website available</div>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <h3 className="text-white text-sm font-medium">{source.title}</h3>
                  <p className="text-gray-300 text-xs truncate">{source.url}</p>
                  {source.url.startsWith('http') ? (
                    <a 
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="preview-button bg-cyan-600 hover:bg-cyan-700 text-white text-xs py-1 px-2 rounded transition-colors inline-block"
                    >
                      Go to website
                    </a>
                  ) : (
                    <div className="text-gray-400 text-xs italic">No website available</div>
                  )}
                </div>
              )}
              <div className="absolute top-full left-4 w-0 h-0 border-8 border-transparent border-t-gray-800"></div>
            </div>
          </div>
        )}
      </div>

      {/* We've removed the preview modal and replaced it with a direct link */}
    </>
  );
};
