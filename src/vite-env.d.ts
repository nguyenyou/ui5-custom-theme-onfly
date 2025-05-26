/// <reference types="vite/client" />

declare global {
  interface Window {
    less: {
      render: (input: string, options?: any) => Promise<{ css: string }>;
    };
  }
}

export {};
