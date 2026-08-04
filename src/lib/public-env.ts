type PublicEnvName =
  | 'PUBLIC_AI_DISCOVERY_ENABLED'
  | 'PUBLIC_SITE_URL'
  | 'PUBLIC_CF_ANALYTICS_TOKEN'
  | 'SITEMAP_LASTMOD'
  | 'SOURCE_DATE_EPOCH';

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

/**
 * Cloudflare Web Analytics beacon token. When unset, the analytics beacon is
 * omitted from the page so the site ships zero third-party JS until the token
 * is configured. Set PUBLIC_CF_ANALYTICS_TOKEN in .env.local (or the deploy
 * environment) and rebuild to enable.
 */
export function getCfAnalyticsToken(): string {
  return readPublicEnv('PUBLIC_CF_ANALYTICS_TOKEN') ?? '';
}
