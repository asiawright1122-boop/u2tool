import type { APIRoute } from 'astro';
import { createJsonErrorResponse } from '@/lib/agent-error-response';

export const prerender = false;

export const ALL: APIRoute = async ({ request }) => {
  const url = new URL(request.url);

  return createJsonErrorResponse(
    404,
    'NOT_FOUND',
    `API endpoint '${url.pathname}' was not found.`,
    'Check available API endpoints in our OpenAPI specification at /openapi.json or catalog at /llms.txt.'
  );
};
