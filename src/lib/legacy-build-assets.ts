export const LEGACY_BUILD_ASSET_PREFIXES = ['/_next/', '/dist/'] as const;

const LEGACY_BUILD_ASSET_GONE_HEADERS = {
  'cache-control': 'public, max-age=86400, s-maxage=86400',
  'content-security-policy': "frame-ancestors 'none'",
  'content-type': 'text/plain; charset=utf-8',
  'permissions-policy': 'camera=(), microphone=(), geolocation=()',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'strict-transport-security': 'max-age=31536000; includeSubDomains; preload',
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'DENY',
  'x-robots-tag': 'noindex, nofollow',
  'x-xss-protection': '1; mode=block',
} as const;

export function isLegacyBuildAssetPath(pathname: string): boolean {
  const normalizedPath = pathname.replace(/^\/[a-z]{2}(?=\/)/, '');
  return LEGACY_BUILD_ASSET_PREFIXES.some((prefix) => normalizedPath.startsWith(prefix));
}

export function isLegacyBuildAssetRequest(request: Request): boolean {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return false;
  }

  return isLegacyBuildAssetPath(new URL(request.url).pathname);
}

export function createLegacyBuildAssetGoneResponse(method = 'GET'): Response {
  return new Response(method === 'HEAD' ? null : 'Gone', {
    status: 410,
    headers: LEGACY_BUILD_ASSET_GONE_HEADERS,
  });
}
