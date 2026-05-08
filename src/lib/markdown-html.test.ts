import { describe, expect, it } from 'vitest';
import { renderMarkdownHtml } from './markdown-html';

describe('renderMarkdownHtml', () => {
  it('renders normal markdown while removing active HTML payloads', () => {
    const html = renderMarkdownHtml(`
# Safe Title

<img src="x" onerror="alert(1)" alt="preview">
<script>alert(1)</script>
[bad](javascript:alert(1))
<a href="java
script:alert(1)">bad link</a>
<img src="data:image/svg+xml,<svg onload=alert(1)>" alt="svg">
`);

    expect(html).toContain('<h1>Safe Title</h1>');
    expect(html).toContain('alt="preview"');
    expect(html).not.toContain('onerror');
    expect(html).not.toContain('<script');
    expect(html).not.toContain('javascript:');
    expect(html).not.toContain('data:image/svg+xml');
  });
});
