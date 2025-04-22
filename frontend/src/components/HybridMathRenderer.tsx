import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface Props {
  content: string | any; // Allow any type but handle it safely
}

export const HybridMathRenderer: React.FC<Props> = ({ content }) => {
  // If content is not a string, convert it to string or return empty string
  const stringContent = typeof content === 'string' ? content : String(content || '');
  const cleanedContent = preprocessMathContent(stringContent);
  
  return (
    <ReactMarkdown
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeKatex]}
    >
      {cleanedContent}
    </ReactMarkdown>
  );
};

// Utility function to fix OpenAI-style formatting
function preprocessMathContent(raw: string): string {
  if (typeof raw !== 'string') {
    return String(raw || '');
  }
  
  return raw
    .replace(/\\,\s*\\text\{(.*?)\}/g, '$1') // remove weird units like \,\text{m/s}
    .replace(/`/g, '') // clean extra backticks
    .replace(/\*\*/g, '**') // optional: Markdown compatibility
    .replace(/\\\^2/g, '^2'); // fix superscript rendering
}
