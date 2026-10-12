import type { APIRoute } from 'astro';
import { getOpenApiYaml } from '@/lib/openapi-spec';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const yamlContent = getOpenApiYaml(url.origin);

  return new Response(yamlContent, {
    status: 200,
    headers: {
      'Content-Type': 'application/yaml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      'Vary': 'Accept',
      'Access-Control-Allow-Origin': '*',
    },
  });
};
