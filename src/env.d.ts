/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_AI_DISCOVERY_ENABLED?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare const __U2TOOL_HTML_CACHE_VERSION__: string | undefined;
