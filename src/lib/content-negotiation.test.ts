import { describe, expect, it } from 'vitest';
import {
  appendVaryHeader,
  parseAcceptHeader,
  prefersJson,
  prefersMarkdown,
} from './content-negotiation';

describe('content-negotiation', () => {
  describe('parseAcceptHeader', () => {
    it('handles empty or null headers', () => {
      expect(parseAcceptHeader(null)).toEqual([]);
      expect(parseAcceptHeader('')).toEqual([]);
    });

    it('parses multiple types and q values', () => {
      const parsed = parseAcceptHeader('text/html, text/markdown;q=0.8, application/json;q=0.9');
      expect(parsed).toEqual([
        { mediaType: 'text/html', q: 1.0 },
        { mediaType: 'application/json', q: 0.9 },
        { mediaType: 'text/markdown', q: 0.8 },
      ]);
    });
  });

  describe('prefersMarkdown', () => {
    it('returns true for exact text/markdown', () => {
      expect(prefersMarkdown('text/markdown')).toBe(true);
      expect(prefersMarkdown('text/markdown; charset=utf-8')).toBe(true);
    });

    it('returns true when markdown has higher or equal q than html', () => {
      expect(prefersMarkdown('text/markdown, text/html;q=0.5')).toBe(true);
      expect(prefersMarkdown('text/markdown;q=1, text/html;q=1')).toBe(true);
      expect(prefersMarkdown('text/markdown, */*;q=0.8')).toBe(true);
    });

    it('returns false when html has higher q', () => {
      expect(prefersMarkdown('text/html;q=1.0, text/markdown;q=0.5')).toBe(false);
    });

    it('returns false for standard browser accept headers', () => {
      expect(
        prefersMarkdown('text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,*/*;q=0.8')
      ).toBe(false);
    });

    it('returns false when text/markdown is not requested or q is 0', () => {
      expect(prefersMarkdown(null)).toBe(false);
      expect(prefersMarkdown('application/json')).toBe(false);
      expect(prefersMarkdown('text/markdown;q=0, text/html')).toBe(false);
    });
  });

  describe('prefersJson', () => {
    it('returns true for application/json', () => {
      expect(prefersJson('application/json')).toBe(true);
      expect(prefersJson('application/json, text/html;q=0.5')).toBe(true);
    });

    it('returns false for html preference', () => {
      expect(prefersJson('text/html, application/json;q=0.5')).toBe(false);
      expect(prefersJson(null)).toBe(false);
    });
  });

  describe('appendVaryHeader', () => {
    it('sets Vary when empty', () => {
      const headers = new Headers();
      appendVaryHeader(headers, 'Accept');
      expect(headers.get('vary')).toBe('Accept');
    });

    it('appends to existing Vary without duplicates', () => {
      const headers = new Headers({ vary: 'Accept-Encoding' });
      appendVaryHeader(headers, 'Accept');
      expect(headers.get('vary')).toBe('Accept-Encoding, Accept');

      // Adding again should not duplicate
      appendVaryHeader(headers, 'Accept');
      expect(headers.get('vary')).toBe('Accept-Encoding, Accept');
      appendVaryHeader(headers, 'accept');
      expect(headers.get('vary')).toBe('Accept-Encoding, Accept');
    });
  });
});
