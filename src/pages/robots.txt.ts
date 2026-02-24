/**
 * robots.txt.ts
 *
 * Astro API endpoint that generates the robots.txt file.
 * Allows all crawlers and references the sitemap URL.
 *
 * Requirements: 5.6
 */

import type { APIRoute } from 'astro';

const BASE_URL = import.meta.env.PUBLIC_SITE_URL || 'https://www.u2tool.com';

export const GET: APIRoute = () => {
  const robotsTxt = `# robots.txt for U2Tool
User-agent: *
Allow: /

# Sitemap
Sitemap: ${BASE_URL}/sitemap.xml

# Disallow admin/api paths
Disallow: /api/
`;

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
};
