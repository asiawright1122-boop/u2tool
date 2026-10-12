import { describe, expect, it } from 'vitest';
import { GET as getSearchApi, ALL as allSearchApi } from '../pages/api/ai-discovery/search';
import { GET as getOpenApiJson } from '../pages/openapi.json';
import { GET as getOpenApiYaml } from '../pages/api/openapi.yaml';
import { ALL as catchAllApi } from '../pages/api/[...apiPath]';
import { createNotFoundResponse } from './agent-error-response';
import { prefersJson, prefersMarkdown } from './content-negotiation';
import fs from 'node:fs';
import path from 'node:path';

describe('Agent Readiness Tests (Ora Readiness Model)', () => {
  describe('Fix 1: Agent-friendly 404s', () => {
    it('returns a real HTTP 404 with Markdown error body when Accept: text/markdown is requested', async () => {
      const req = new Request('https://www.u2tool.com/some-path-that-does-not-exist', {
        headers: { accept: 'text/markdown' },
      });
      const res = createNotFoundResponse(req);

      expect(res.status).toBe(404);
      expect(res.headers.get('content-type')).toContain('text/markdown');
      expect(res.headers.get('vary')).toContain('Accept');
      expect(res.headers.get('x-robots-tag')).toBe('noindex, nofollow');

      const body = await res.text();
      expect(body.length).toBeGreaterThan(20);
      expect(body).toContain('# 404 Not Found');
      expect(body).toContain('The requested resource could not be found');
      expect(body).toContain('https://www.u2tool.com/llms.txt');
      expect(body).toContain('https://www.u2tool.com/sitemap.xml');
    });

    it('returns a real HTTP 404 with structured JSON when Accept: application/json is requested', async () => {
      const req = new Request('https://www.u2tool.com/some-path-that-does-not-exist', {
        headers: { accept: 'application/json' },
      });
      const res = createNotFoundResponse(req);

      expect(res.status).toBe(404);
      expect(res.headers.get('content-type')).toContain('application/json');
      expect(res.headers.get('vary')).toContain('Accept');

      const json = await res.json();
      expect(json.error).toBe('NOT_FOUND');
      expect(json.message).toBeTruthy();
      expect(json.resolution).toBeTruthy();
    });
  });

  describe('Fix 2: Content without JavaScript and Heading Hierarchy', () => {
    it('verifies index.astro heading hierarchy starts with h1 and does not skip from h1 to h3', () => {
      const indexAstroPath = path.resolve(process.cwd(), 'src/pages/[locale]/index.astro');
      const content = fs.readFileSync(indexAstroPath, 'utf8');

      // Check headings in index.astro template
      const headingMatches = [...content.matchAll(/<(h[1-6])[^>]*>/gi)].map((m) => m[1].toLowerCase());

      expect(headingMatches[0]).toBe('h1');
      // The second heading in the hero section must be h2 (not h3)
      expect(headingMatches[1]).toBe('h2');

      // Verify no transition skips directly from h1 to h3 or h2 to h4 in the template
      for (let i = 0; i < headingMatches.length - 1; i++) {
        const currLevel = parseInt(headingMatches[i].replace('h', ''), 10);
        const nextLevel = parseInt(headingMatches[i + 1].replace('h', ''), 10);
        expect(nextLevel - currLevel).toBeLessThanOrEqual(1);
      }
    });

    it('verifies Footer.astro headings are h2', () => {
      const footerPath = path.resolve(process.cwd(), 'src/components/layout/Footer.astro');
      const content = fs.readFileSync(footerPath, 'utf8');
      const headings = [...content.matchAll(/<(h[1-6])[^>]*>/gi)].map((m) => m[1].toLowerCase());

      expect(headings.every((h) => h === 'h2')).toBe(true);
    });
  });

  describe('Fix 3: OpenAPI Spec Published', () => {
    it('serves OpenAPI 3.1.0 specification at /openapi.json', async () => {
      const req = new Request('https://www.u2tool.com/openapi.json');
      const res = await getOpenApiJson({ request: req } as any);

      expect(res.status).toBe(200);
      expect(res.headers.get('content-type')).toContain('application/json');

      const spec = await res.json();
      expect(spec.openapi).toBe('3.1.0');
      expect(spec.info.title).toBe('U2Tool API');
      expect(spec.paths['/api/ai-discovery/search']).toBeDefined();
      expect(spec.paths['/{locale}/tools-index.json']).toBeDefined();
      expect(spec.components.schemas.ErrorResponse).toBeDefined();
    });

    it('serves OpenAPI YAML specification at /api/openapi.yaml', async () => {
      const req = new Request('https://www.u2tool.com/api/openapi.yaml');
      const res = await getOpenApiYaml({ request: req } as any);

      expect(res.status).toBe(200);
      expect(res.headers.get('content-type')).toContain('application/yaml');

      const yamlText = await res.text();
      expect(yamlText).toContain('openapi: 3.1.0');
      expect(yamlText).toContain('U2Tool API');
    });
  });

  describe('Fix 4: JSON Error Responses', () => {
    it('returns structured JSON errors on search API with error codes, messages, and resolution hints', async () => {
      // Disabled feature test
      const resDisabled = await getSearchApi({
        request: new Request('https://www.u2tool.com/api/ai-discovery/search?locale=en&q='),
      } as any);
      expect(resDisabled.status).toBe(404);
      expect(resDisabled.headers.get('content-type')).toContain('application/json');
      const jsonDisabled = await resDisabled.json();
      expect(jsonDisabled.error).toBe('FEATURE_DISABLED');
      expect(jsonDisabled.message).toBeTruthy();
      expect(jsonDisabled.resolution).toBeTruthy();
    });

    it('returns 405 Method Not Allowed with structured JSON for unsupported HTTP methods', async () => {
      const resPost = await allSearchApi({
        request: new Request('https://www.u2tool.com/api/ai-discovery/search', {
          method: 'POST',
        }),
      } as any);
      expect(resPost.status).toBe(405);
      expect(resPost.headers.get('content-type')).toContain('application/json');
      const jsonPost = await resPost.json();
      expect(jsonPost.error).toBe('METHOD_NOT_ALLOWED');
      expect(jsonPost.resolution).toBeTruthy();
    });

    it('returns structured JSON 404 for unknown /api/* endpoints', async () => {
      const resCatchAll = await catchAllApi({
        request: new Request('https://www.u2tool.com/api/nonexistent-route'),
      } as any);
      expect(resCatchAll.status).toBe(404);
      expect(resCatchAll.headers.get('content-type')).toContain('application/json');
      const jsonCatchAll = await resCatchAll.json();
      expect(jsonCatchAll.error).toBe('NOT_FOUND');
      expect(jsonCatchAll.message).toContain('/api/nonexistent-route');
      expect(jsonCatchAll.resolution).toContain('/openapi.json');
    });
  });

  describe('Fix 5: Markdown Content Negotiation (acceptmarkdown.com)', () => {
    it('correctly detects Accept: text/markdown header preferences', () => {
      expect(prefersMarkdown('text/markdown')).toBe(true);
      expect(prefersMarkdown('text/markdown, text/html;q=0.9')).toBe(true);
      expect(prefersMarkdown('text/html, application/xhtml+xml')).toBe(false);
      expect(prefersMarkdown('text/html;q=1.0, text/markdown;q=0.5')).toBe(false);
    });

    it('correctly detects Accept: application/json header preferences', () => {
      expect(prefersJson('application/json')).toBe(true);
      expect(prefersJson('application/json, text/html;q=0.5')).toBe(true);
      expect(prefersJson('text/html, application/xhtml+xml')).toBe(false);
    });
  });
});
