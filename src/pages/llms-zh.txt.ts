import type { APIRoute } from 'astro';
import { buildLlmsContent } from '@/lib/llms-content';

export const prerender = false;
export const GET: APIRoute = async ({ request }) => {
  const llmsContent = await buildLlmsContent('zh', new URL(request.url), { isFull: false });

  return new Response(llmsContent, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
};
