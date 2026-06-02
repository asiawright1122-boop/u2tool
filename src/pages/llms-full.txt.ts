import type { APIRoute } from 'astro';
import { buildLlmsContent } from '@/lib/llms-content';

export const GET: APIRoute = async ({ request }) => {
  const llmsContent = await buildLlmsContent('en', new URL(request.url), { isFull: true });

  return new Response(llmsContent, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
};
