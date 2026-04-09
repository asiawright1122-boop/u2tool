type PublicEnvName = 'PUBLIC_AI_DISCOVERY_ENABLED' | 'PUBLIC_SITE_URL' | 'SITEMAP_LASTMOD' | 'SOURCE_DATE_EPOCH';

function readImportMetaEnv(name: PublicEnvName): string | undefined {
  return (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env?.[name];
}

function readProcessEnv(name: PublicEnvName): string | undefined {
  return typeof process !== 'undefined' ? process.env[name] : undefined;
}

export function readPublicEnv(name: PublicEnvName): string | undefined {
  return readImportMetaEnv(name) ?? readProcessEnv(name);
}

export function getPublicSiteUrl(): string {
  return readPublicEnv('PUBLIC_SITE_URL') || 'https://www.u2tool.com';
}

export function isPublicAiDiscoveryEnabled(): boolean {
  return readPublicEnv('PUBLIC_AI_DISCOVERY_ENABLED') === 'true';
}
