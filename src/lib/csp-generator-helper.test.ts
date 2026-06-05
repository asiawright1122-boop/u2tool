import { describe, it, expect } from 'vitest';
import { buildCspHeader } from './csp-generator-helper';

describe('CSP Header Builder Helper', () => {
  it('should compile simple directive options into correct header values', () => {
    const config = {
      'default-src': ["'self'"],
      'script-src': ['self', 'unsafe-inline', 'https://apis.google.com'],
      'upgrade-insecure-requests': true,
      'block-all-mixed-content': false
    };

    const header = buildCspHeader(config);
    expect(header).toBe("default-src 'self'; script-src 'self' 'unsafe-inline' https://apis.google.com; upgrade-insecure-requests;");
  });

  it('should automatically wrap special keywords in single quotes if not provided', () => {
    const config = {
      'default-src': ['none'],
      'style-src': ['SELF', 'UNSAFE-INLINE', 'fonts.googleapis.com'],
      'font-src': ['data:', 'https:']
    };

    const header = buildCspHeader(config);
    expect(header).toBe("default-src 'none'; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src data: https:;");
  });

  it('should ignore empty directives and produce empty string for empty config', () => {
    expect(buildCspHeader({})).toBe('');
    expect(buildCspHeader({ 'default-src': [] })).toBe('');
  });
});
