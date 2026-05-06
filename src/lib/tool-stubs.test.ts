import { describe, expect, it } from 'vitest';
import { convertMarkdownToHtml, formatCitation, generateSignature } from './tool-stubs';

describe('tool stubs with rendered html output', () => {
  it('sanitizes markdown html before returning it for preview', () => {
    const html = convertMarkdownToHtml(
      '# Hello\n\n<img src=x onerror="alert(1)">\n\n[bad](javascript:alert(1))'
    );

    expect(html).toContain('<h1>Hello</h1>');
    expect(html).not.toContain('onerror');
    expect(html).not.toContain('javascript:');
  });

  it('escapes signature fields and drops unsafe urls', () => {
    const result = generateSignature({
      name: '<img src=x onerror="alert(1)">',
      title: 'Lead <script>alert(1)</script>',
      company: 'Example',
      email: 'person@example.com',
      phone: '+1 (555) 0100',
      website: 'javascript:alert(1)',
      linkedin: 'person',
      primaryColor: 'url(javascript:alert(1))',
    });

    expect(result.html).toContain('&lt;img');
    expect(result.html).toContain('person@example.com');
    expect(result.html).toContain('https://www.linkedin.com/in/person');
    expect(result.html).not.toContain('<img');
    expect(result.html).not.toContain('<script');
    expect(result.html).not.toContain('onerror="');
    expect(result.html).not.toContain('javascript:');
  });

  it('formats citation text instead of returning an empty stub', () => {
    const citation = formatCitation({
      authors: 'Ada Lovelace',
      title: 'Notes on Computing',
      year: '1843',
      publisher: 'Analytical Press',
    }, 'apa');

    expect(citation).toContain('Ada Lovelace');
    expect(citation).toContain('*Notes on Computing*');
    expect(citation).toContain('1843');
  });
});
