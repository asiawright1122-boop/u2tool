/**
 * Unit tests for src/lib/seo-probe.ts Phase 81 extractors.
 *
 * These tests exercise the REAL regex extraction logic against sample HTML
 * (no network, no mocks). The getTagContent/fetchHtmlWithRetry functions are
 * already covered indirectly by validate-tdk-drift.test.ts; here we focus on
 * the new Phase 81 extractors: getOgTitle, getTwitterTitle, getKeywords,
 * extractJsonLdBlocks.
 */

import { describe, it, expect } from 'vitest';
import {
  getTagContent,
  getOgTitle,
  getTwitterTitle,
  getKeywords,
  extractJsonLdBlocks,
  buildProbeHeaders,
  CHROME_DESKTOP_UA,
} from './seo-probe';

// ---------------------------------------------------------------------------
// getOgTitle
// ---------------------------------------------------------------------------

describe('getOgTitle', () => {
  it('extracts content from og:title meta tag', () => {
    const html = '<head><meta property="og:title" content="JSON Formatter | U2Tool"></head>';
    expect(getOgTitle(html)).toBe('JSON Formatter | U2Tool');
  });

  it('extracts when og:title uses single quotes', () => {
    const html = `<head><meta property='og:title' content='My Tool'></head>`;
    expect(getOgTitle(html)).toBe('My Tool');
  });

  it('extracts when attributes are reversed (content before property)', () => {
    const html = '<meta content="Reversed Attrs" property="og:title">';
    expect(getOgTitle(html)).toBe('Reversed Attrs');
  });

  it('returns empty string when og:title is absent', () => {
    const html = '<head><meta property="og:description" content="desc"></head>';
    expect(getOgTitle(html)).toBe('');
  });

  it('does not match og:description or other og: tags', () => {
    const html = '<meta property="og:description" content="not the title">';
    expect(getOgTitle(html)).toBe('');
  });

  it('handles CJK content', () => {
    const html = '<meta property="og:title" content="JSON格式化ツール | U2Tool">';
    expect(getOgTitle(html)).toBe('JSON格式化ツール | U2Tool');
  });
});

// ---------------------------------------------------------------------------
// getTwitterTitle
// ---------------------------------------------------------------------------

describe('getTwitterTitle', () => {
  it('extracts content from twitter:title meta tag', () => {
    const html = '<meta name="twitter:title" content="JSON Formatter | U2Tool">';
    expect(getTwitterTitle(html)).toBe('JSON Formatter | U2Tool');
  });

  it('returns empty string when twitter:title is absent', () => {
    const html = '<meta name="twitter:card" content="summary_large_image">';
    expect(getTwitterTitle(html)).toBe('');
  });

  it('does not match twitter:description', () => {
    const html = '<meta name="twitter:description" content="not the title">';
    expect(getTwitterTitle(html)).toBe('');
  });
});

// ---------------------------------------------------------------------------
// getKeywords
// ---------------------------------------------------------------------------

describe('getKeywords', () => {
  it('extracts content from keywords meta tag', () => {
    const html = '<meta name="keywords" content="json, formatter, online">';
    expect(getKeywords(html)).toBe('json, formatter, online');
  });

  it('returns empty string when keywords tag is absent', () => {
    const html = '<meta name="description" content="desc">';
    expect(getKeywords(html)).toBe('');
  });

  it('handles empty content attribute', () => {
    const html = '<meta name="keywords" content="">';
    expect(getKeywords(html)).toBe('');
  });
});

// ---------------------------------------------------------------------------
// extractJsonLdBlocks
// ---------------------------------------------------------------------------

describe('extractJsonLdBlocks', () => {
  it('extracts a single JSON-LD block', () => {
    const html = '<script type="application/ld+json">{"@type":"SoftwareApplication","name":"X"}</script>';
    const blocks = extractJsonLdBlocks(html);
    expect(blocks).toHaveLength(1);
    expect(blocks[0]['@type']).toBe('SoftwareApplication');
    expect(blocks[0].name).toBe('X');
  });

  it('extracts multiple JSON-LD blocks', () => {
    const html = `
      <script type="application/ld+json">{"@type":"SoftwareApplication","name":"App"}</script>
      <script type="application/ld+json">{"@type":"BreadcrumbList","itemListElement":[]}</script>
      <script type="application/ld+json">{"@type":"FAQPage","mainEntity":[]}</script>
    `;
    const blocks = extractJsonLdBlocks(html);
    expect(blocks).toHaveLength(3);
    expect(blocks.map((b) => b['@type'])).toEqual([
      'SoftwareApplication', 'BreadcrumbList', 'FAQPage',
    ]);
  });

  it('returns empty array when no JSON-LD blocks exist', () => {
    const html = '<html><head><title>No JSON-LD</title></head></html>';
    expect(extractJsonLdBlocks(html)).toEqual([]);
  });

  it('skips malformed JSON blocks silently', () => {
    const html = `
      <script type="application/ld+json">{"@type":"SoftwareApplication","name":"Good"}</script>
      <script type="application/ld+json">{invalid json}</script>
    `;
    const blocks = extractJsonLdBlocks(html);
    expect(blocks).toHaveLength(1);
    expect(blocks[0].name).toBe('Good');
  });

  it('does not match regular <script> tags', () => {
    const html = '<script type="text/javascript">var x = 1;</script>';
    expect(extractJsonLdBlocks(html)).toEqual([]);
  });

  it('handles JSON-LD block with nested objects', () => {
    const html = `<script type="application/ld+json">{
      "@type": "SoftwareApplication",
      "name": "Tool",
      "offers": { "@type": "Offer", "price": "0" }
    }</script>`;
    const blocks = extractJsonLdBlocks(html);
    expect(blocks).toHaveLength(1);
    expect(blocks[0].name).toBe('Tool');
    expect((blocks[0].offers as Record<string, unknown>).price).toBe('0');
  });

  it('matches type attribute with single quotes', () => {
    const html = `<script type='application/ld+json'>{"@type":"X"}</script>`;
    const blocks = extractJsonLdBlocks(html);
    expect(blocks).toHaveLength(1);
  });

  it('handles empty script body', () => {
    const html = '<script type="application/ld+json"></script>';
    expect(extractJsonLdBlocks(html)).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// Existing extractors regression (ensure no breakage)
// ---------------------------------------------------------------------------

describe('getTagContent (regression)', () => {
  it('title extraction still works', () => {
    const html = '<title>My Page | U2Tool</title>';
    expect(getTagContent(html, 'title')).toBe('My Page | U2Tool');
  });

  it('description extraction still works', () => {
    const html = '<meta name="description" content="A great page.">';
    expect(getTagContent(html, 'description')).toBe('A great page.');
  });
});

// ---------------------------------------------------------------------------
// buildProbeHeaders regression
// ---------------------------------------------------------------------------

describe('buildProbeHeaders (regression)', () => {
  it('returns Chrome UA without token by default', () => {
    const headers = buildProbeHeaders();
    expect(headers['User-Agent']).toBe(CHROME_DESKTOP_UA);
    expect(headers['x-waf-bypass-token']).toBeUndefined();
  });

  it('includes bypass token when provided', () => {
    const headers = buildProbeHeaders('secret');
    expect(headers['x-waf-bypass-token']).toBe('secret');
  });
});
