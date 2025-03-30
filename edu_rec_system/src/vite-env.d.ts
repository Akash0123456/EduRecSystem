/// <reference types="vite/client" />

interface ImportMeta {
  readonly env: {
    readonly VITE_OPENAI_API_KEY: string;
    [key: string]: string | undefined;
  };
}
