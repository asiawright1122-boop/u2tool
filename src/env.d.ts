/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_AI_DISCOVERY_ENABLED?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
