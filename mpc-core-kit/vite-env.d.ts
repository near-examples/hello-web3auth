//<reference types="vite/client" />

interface ImportMetaEnv {
  readonly BASE_URL: string;  
  readonly MODE: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  // Add any other environment variables prefixed with VITE_ here
  // readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
