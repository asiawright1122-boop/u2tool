import { appendVaryHeader, prefersJson, prefersMarkdown } from './content-negotiation';

export const MARKDOWN_404_BODY = `# 404 Not Found

The requested resource could not be found on U2Tool.

Please explore our tools and documentation:
- Homepage: https://www.u2tool.com/en/
- All Tools Catalog: https://www.u2tool.com/en/tools/
- XML Sitemap: https://www.u2tool.com/sitemap.xml
- LLMs Discovery: https://www.u2tool.com/llms.txt
- Full LLMs Directory: https://www.u2tool.com/llms-full.txt
- OpenAPI Specification: https://www.u2tool.com/openapi.json
`;

export const DEFAULT_NOT_FOUND_MESSAGE = 'The requested resource could not be found on U2Tool.';
export const DEFAULT_NOT_FOUND_RESOLUTION =
  'Check our catalog at /en/tools/, view the sitemap at /sitemap.xml, or discover API endpoints via /openapi.json and /llms.txt.';

export interface StructuredJsonError {
  error: string;
  message: string;
  resolution: string;
}

export function createMarkdownNotFoundResponse(customBody?: string): Response {
  const headers = new Headers({
    'Content-Type': 'text/markdown; charset=utf-8',
    'x-robots-tag': 'noindex, nofollow',
  });
  appendVaryHeader(headers, 'Accept');

  return new Response(customBody || MARKDOWN_404_BODY, {
    status: 404,
    headers,
  });
}

export function createJsonErrorResponse(
  status: number,
  error: string,
  message: string,
  resolution: string
): Response {
  const body: StructuredJsonError = {
    error,
    message,
    resolution,
  };

  const headers = new Headers({
    'Content-Type': 'application/json; charset=utf-8',
    'x-robots-tag': 'noindex, nofollow',
  });
  appendVaryHeader(headers, 'Accept');

  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers,
  });
}

export function createHtmlNotFoundResponse(htmlContent?: string): Response {
  const fallbackHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Page Not Found | U2Tool</title>
  <meta name="robots" content="noindex, nofollow" />
  <style>
    :root { color-scheme: light dark; font-family: system-ui, -apple-system, sans-serif; }
    body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #0f172a; color: #f8fafc; text-align: center; padding: 2rem; }
    h1 { font-size: 3rem; margin: 0 0 1rem; color: #f59e0b; }
    p { color: #94a3b8; max-width: 28rem; margin: 0 auto 2rem; }
    a { display: inline-block; padding: 0.75rem 1.5rem; background: #f59e0b; color: #000; border-radius: 9999px; text-decoration: none; font-weight: 700; }
  </style>
</head>
<body>
  <main>
    <h1>404</h1>
    <h2>Page not found</h2>
    <p>The page you requested could not be found. Explore our collection of 564+ free developer tools.</p>
    <a href="/en/">Back to Homepage</a>
  </main>
</body>
</html>`;

  const headers = new Headers({
    'Content-Type': 'text/html; charset=utf-8',
    'x-robots-tag': 'noindex, nofollow',
  });
  appendVaryHeader(headers, 'Accept');

  return new Response(htmlContent || fallbackHtml, {
    status: 404,
    headers,
  });
}

/**
 * Universal content-negotiated 404 responder.
 * Dispatches to Markdown, JSON, or HTML based on client Accept header and URL path.
 */
export function createNotFoundResponse(
  request: Request,
  options?: {
    message?: string;
    resolution?: string;
    htmlFallback?: string;
  }
): Response {
  const accept = request.headers.get('accept');
  const pathname = new URL(request.url).pathname;

  if (prefersMarkdown(accept)) {
    return createMarkdownNotFoundResponse();
  }

  if (prefersJson(accept) || pathname === '/api' || pathname.startsWith('/api/')) {
    return createJsonErrorResponse(
      404,
      'NOT_FOUND',
      options?.message || DEFAULT_NOT_FOUND_MESSAGE,
      options?.resolution || DEFAULT_NOT_FOUND_RESOLUTION
    );
  }

  return createHtmlNotFoundResponse(options?.htmlFallback);
}
