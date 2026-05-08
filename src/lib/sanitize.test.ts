import { describe, expect, it } from 'vitest';
import {
  decodeHtmlText,
  escapeHtmlAttribute,
  normalizeSvgColor,
  safeDownloadFileName,
  sanitizeHtml,
  sanitizeMarkdownHtml,
  sanitizeSvg,
} from './sanitize';

describe('sanitize helpers', () => {
  it('removes scripts, event handlers, and javascript urls from html fallback', () => {
    const sanitized = sanitizeHtml(
      '<p onclick="alert(1)">Hello</p><a href="javascript:alert(1)">bad</a><script>alert(1)</script>'
    );

    expect(sanitized).toContain('<p>Hello</p>');
    expect(sanitized).toContain('<a>bad</a>');
    expect(sanitized).not.toContain('onclick');
    expect(sanitized).not.toContain('javascript:');
    expect(sanitized).not.toContain('<script');
  });

  it('keeps safe markdown elements while removing unsafe attributes', () => {
    const sanitized = sanitizeMarkdownHtml(
      '<h1>Title</h1><img src="x" onerror="alert(1)" alt="preview"><img src="data:image/svg+xml,<svg onload=alert(1)>"><a href="https://example.com">safe</a>'
    );

    expect(sanitized).toContain('<h1>Title</h1>');
    expect(sanitized).toContain('alt="preview"');
    expect(sanitized).toContain('href="https://example.com"');
    expect(sanitized).not.toContain('onerror');
    expect(sanitized).not.toContain('data:image/svg+xml');
  });

  it('strips active svg content in the fallback sanitizer', () => {
    const sanitized = sanitizeSvg('<svg onload="alert(1)"><script>alert(1)</script><circle /></svg>');

    expect(sanitized).not.toContain('onload');
    expect(sanitized).not.toContain('<script');
  });

  it('removes active svg references and embedded html surfaces', () => {
    const sanitized = sanitizeSvg(`
      <?xml-stylesheet href="javascript:alert(1)"?>
      <svg>
        <foreignObject><div onclick="alert(1)">bad</div></foreignObject>
        <a href="java
          script:alert(1)"><circle /></a>
        <image href="data:image/svg+xml,<svg onload='alert(1)'></svg>" />
        <path style="fill:url(javascript:alert(1))" />
      </svg>
    `);

    expect(sanitized).not.toContain('xml-stylesheet');
    expect(sanitized).not.toContain('foreignObject');
    expect(sanitized).not.toContain('onclick');
    expect(sanitized).not.toContain('javascript:');
    expect(sanitized).not.toContain('data:image/svg+xml');
    expect(sanitized).not.toContain('style=');
  });

  it('keeps safe svg fragment references and simple styles', () => {
    const sanitized = sanitizeSvg('<svg><defs><path id="p" /></defs><use href="#p" /><stop style="stop-color:#fff;stop-opacity:1" /></svg>');

    expect(sanitized).toContain('href="#p"');
    expect(sanitized).toContain('stop-color:#fff');
  });

  it('normalizes svg color attributes before string interpolation', () => {
    expect(normalizeSvgColor('#ff00aa')).toBe('#ff00aa');
    expect(normalizeSvgColor('currentColor')).toBe('currentColor');
    expect(normalizeSvgColor('red" onload="alert(1)', '#000000')).toBe('#000000');
  });

  it('decodes html text without returning active markup from real tags', () => {
    expect(decodeHtmlText('&lt;img src=x onerror=alert(1)&gt; &amp; &#169;')).toBe(
      '<img src=x onerror=alert(1)> & ©'
    );
    expect(decodeHtmlText('<img src=x onerror=alert(1)>safe &amp; sound')).toBe('safe & sound');
  });

  it('escapes title text and normalizes download filenames', () => {
    expect(escapeHtmlAttribute('INV-1"><img src=x onerror=alert(1)>')).toBe(
      'INV-1&quot;&gt;&lt;img src=x onerror=alert(1)&gt;'
    );

    const fileName = safeDownloadFileName('../INV-1"><script>alert(1)</script>', 'invoice', 'html');
    expect(fileName).toMatch(/\.html$/);
    expect(fileName).not.toMatch(/[<>:"/\\|?*]/);
    expect(fileName).not.toMatch(/^\./);
    expect(safeDownloadFileName('   ', 'invoice', 'html')).toBe('invoice.html');
  });
});
