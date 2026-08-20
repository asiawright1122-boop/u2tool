/**
 * robots.txt.ts
 *
 * Astro API endpoint that generates the robots.txt file.
 * Allows all crawlers and references the sitemap URL.
 *
 * Requirements: 5.6
 */

import type { APIRoute } from 'astro';
import { getPublicSiteUrl } from '@/lib/public-env';

const BASE_URL = getPublicSiteUrl();

export const prerender = true;

export const GET: APIRoute = () => {
  const robotsTxt = `# robots.txt for U2Tool
User-agent: *
Allow: /
Disallow: /api/
Disallow: /_next/
Disallow: /dist/

# AI Crawlers - Allow for AI citation and training
User-agent: GPTBot
Allow: /
Disallow: /api/

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /
Disallow: /api/

User-agent: Claude-Web
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: PerplexityBot
Allow: /
Disallow: /api/

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: cohere-ai
Allow: /

User-agent: Bytespider
Allow: /

User-agent: meta-externalagent
Allow: /

User-agent: Amazonbot
Allow: /

User-agent: DuckDuckBot
Allow: /

User-agent: BingBot
Allow: /

User-agent: Slurp
Allow: /

User-agent: Yandex
Allow: /
Clean-param: q
Clean-param: utm_source&utm_medium&utm_campaign&utm_term&utm_content&fbclid&gclid&yclid

# Sitemap
Sitemap: ${BASE_URL}/sitemap.xml
Sitemap: ${BASE_URL}/sitemap-priority.xml
Sitemap: ${BASE_URL}/sitemap-pages.xml
Sitemap: ${BASE_URL}/sitemap-tools.xml

# LLM discovery manifest (referenced in llms.txt standard, not a sitemap)
# ${BASE_URL}/llms.txt
# ${BASE_URL}/llms-full.txt
`;

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
};
