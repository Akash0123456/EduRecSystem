declare module 'react-katex' {
  import React from 'react';
  
  interface KaTeXProps {
    children?: string;
    math?: string;
    block?: boolean;
    errorColor?: string;
    renderError?: (error: Error | TypeError) => React.ReactNode;
    settings?: Record<string, any>;
    as?: keyof JSX.IntrinsicElements;
  }
  
  export const InlineMath: React.FC<KaTeXProps>;
  export const BlockMath: React.FC<KaTeXProps>;
}
