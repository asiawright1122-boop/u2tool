import type { APIRoute } from 'astro';
import { getOpenApiSpec } from '@/lib/openapi-spec';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const spec = getOpenApiSpec(url.origin);

  return new Response(JSON.stringify(spec, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      'Vary': 'Accept',
      'Access-Control-Allow-Origin': '*',
    },
  });
};
