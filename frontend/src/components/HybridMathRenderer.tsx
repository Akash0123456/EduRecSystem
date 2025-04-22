import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface Props {
  content: string;
}

export const HybridMathRenderer: React.FC<Props> = ({ content }) => {
  const cleanedContent = preprocessMathContent(content);
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
  return raw
    .replace(/\\,\s*\\text\{(.*?)\}/g, '$1') // remove weird units like \,\text{m/s}
    .replace(/`/g, '') // clean extra backticks
    .replace(/\*\*/g, '**') // optional: Markdown compatibility
    .replace(/\\\^2/g, '^2'); // fix superscript rendering
}
