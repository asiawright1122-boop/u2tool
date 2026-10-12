import { describe, expect, it } from 'vitest';
import {
  createHtmlNotFoundResponse,
  createJsonErrorResponse,
  createMarkdownNotFoundResponse,
  createNotFoundResponse,
} from './agent-error-response';

describe('agent-error-response', () => {
  it('creates markdown 404 response with status 404, Content-Type, Vary, and explanation', async () => {
    const res = createMarkdownNotFoundResponse();
    expect(res.status).toBe(404);
    expect(res.headers.get('content-type')).toContain('text/markdown');
    expect(res.headers.get('vary')).toContain('Accept');
    expect(res.headers.get('x-robots-tag')).toBe('noindex, nofollow');

    const text = await res.text();
    expect(text).toContain('# 404 Not Found');
    expect(text.length).toBeGreaterThan(20);
    expect(text).toContain('llms.txt');
    expect(text).toContain('sitemap.xml');
  });

  it('creates structured JSON error response with error code, message, and resolution', async () => {
    const res = createJsonErrorResponse(
      404,
      'NOT_FOUND',
      'The requested tool was not found.',
      'Check /openapi.json or /llms.txt.'
    );
    expect(res.status).toBe(404);
    expect(res.headers.get('content-type')).toContain('application/json');
    expect(res.headers.get('vary')).toContain('Accept');

    const json = await res.json();
    expect(json).toEqual({
      error: 'NOT_FOUND',
      message: 'The requested tool was not found.',
      resolution: 'Check /openapi.json or /llms.txt.',
    });
  });

  it('creates HTML 404 response', async () => {
    const res = createHtmlNotFoundResponse();
    expect(res.status).toBe(404);
    expect(res.headers.get('content-type')).toContain('text/html');
    expect(res.headers.get('vary')).toContain('Accept');
  });

  describe('createNotFoundResponse router', () => {
    it('dispatches to Markdown when Accept prefers markdown', async () => {
      const req = new Request('https://www.u2tool.com/nonexistent', {
        headers: { accept: 'text/markdown' },
      });
      const res = createNotFoundResponse(req);
      expect(res.status).toBe(404);
      expect(res.headers.get('content-type')).toContain('text/markdown');
      const text = await res.text();
      expect(text).toContain('# 404 Not Found');
    });

    it('dispatches to JSON when Accept prefers json', async () => {
      const req = new Request('https://www.u2tool.com/nonexistent', {
        headers: { accept: 'application/json' },
      });
      const res = createNotFoundResponse(req);
      expect(res.status).toBe(404);
      expect(res.headers.get('content-type')).toContain('application/json');
      const json = await res.json();
      expect(json.error).toBe('NOT_FOUND');
      expect(json.resolution).toBeTruthy();
    });

    it('dispatches to JSON for any /api/* request even without JSON accept header', async () => {
      const req = new Request('https://www.u2tool.com/api/unknown-endpoint');
      const res = createNotFoundResponse(req);
      expect(res.status).toBe(404);
      expect(res.headers.get('content-type')).toContain('application/json');
      const json = await res.json();
      expect(json.error).toBe('NOT_FOUND');
      expect(json.resolution).toBeTruthy();
    });

    it('dispatches to HTML for standard browser requests', async () => {
      const req = new Request('https://www.u2tool.com/nonexistent', {
        headers: { accept: 'text/html,application/xhtml+xml' },
      });
      const res = createNotFoundResponse(req);
      expect(res.status).toBe(404);
      expect(res.headers.get('content-type')).toContain('text/html');
    });
  });
});
