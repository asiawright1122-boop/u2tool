/**
 * OG Image Generation API Endpoint
 *
 * Generates Open Graph images as SVG for social media sharing.
 * Accepts query params: title, description, locale
 *
 * Requirements: 7.1, 7.2
 */

import type { APIRoute } from 'astro';

// Server-side only - do not prerender
export const prerender = false;

// Cache for 7 days
const CACHE_MAX_AGE = 60 * 60 * 24 * 7;

// Supported locales for validation
const SUPPORTED_LOCALES = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];

/**
 * Escape special XML/HTML characters to prevent XSS in SVG output
 */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Truncate text to fit within the OG image dimensions
 */
function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Generate an SVG-based OG image
 * Returns a 1200x630 SVG with title and description text
 */
function generateOgSvg(title: string, description: string, locale: string): string {
  const isRTL = locale === 'ar';
  const textAnchor = isRTL ? 'end' : 'start';
  const textX = isRTL ? 1140 : 60;

  const safeTitle = escapeXml(truncateText(title, 60));
  const safeDescription = escapeXml(truncateText(description, 120));

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1e3a5f;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0f172a;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)" />

  <!-- Decorative accent line -->
  <rect x="60" y="180" width="80" height="4" rx="2" fill="#3b82f6" />

  <!-- Brand -->
  <text x="${textX}" y="140" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="600" fill="#94a3b8" text-anchor="${textAnchor}">
    U2Tool
  </text>

  <!-- Title -->
  <text x="${textX}" y="250" font-family="system-ui, -apple-system, sans-serif" font-size="48" font-weight="700" fill="#f8fafc" text-anchor="${textAnchor}">
    ${safeTitle}
  </text>

  <!-- Description -->
  <text x="${textX}" y="320" font-family="system-ui, -apple-system, sans-serif" font-size="24" fill="#cbd5e1" text-anchor="${textAnchor}">
    ${safeDescription}
  </text>

  <!-- Footer -->
  <text x="${textX}" y="580" font-family="system-ui, -apple-system, sans-serif" font-size="20" fill="#64748b" text-anchor="${textAnchor}">
    www.u2tool.com
  </text>
</svg>`;
}

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const title = url.searchParams.get('title') || 'U2Tool';
    const description = url.searchParams.get('description') || 'Free Online Tools';
    const locale = url.searchParams.get('locale') || 'en';

    // Validate locale
    const validLocale = SUPPORTED_LOCALES.includes(locale) ? locale : 'en';

    // Validate title and description length (prevent abuse)
    if (title.length > 200 || description.length > 500) {
      return new Response(
        JSON.stringify({ error: 'Title or description too long' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const svg = generateOgSvg(title, description, validLocale);

    return new Response(svg, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': `public, max-age=${CACHE_MAX_AGE}`,
      },
    });
  } catch (error) {
    console.error('OG image generation error:', error);

    return new Response(
      JSON.stringify({
        error: 'Failed to generate OG image',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
