declare module '@microlink/react' {
  import React from 'react';

  interface MicrolinkProps {
    url: string;
    size?: 'large' | 'normal' | 'small';
    contrast?: boolean;
    autoPlay?: boolean;
    controls?: boolean;
    muted?: boolean;
    loop?: boolean;
    playsInline?: boolean;
    media?: string[];
    fetchData?: boolean;
    setData?: (data: any) => void;
    className?: string;
    style?: React.CSSProperties;
    [key: string]: any;
  }

  const Microlink: React.FC<MicrolinkProps>;
  
  export default Microlink;
}
