import { describe, it, expect } from 'vitest';
import { auditHeaders } from './security-headers-audit';

describe('Security Headers Auditor Helper', () => {
  it('should grade headers A+ when all security headers are present and secure', () => {
    const rawHeaders = `
      Content-Security-Policy: default-src 'self'; script-src 'self'
      Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
      X-Frame-Options: DENY
      X-Content-Type-Options: nosniff
      Referrer-Policy: strict-origin-when-cross-origin
      Permissions-Policy: geolocation=()
    `;

    const report = auditHeaders(rawHeaders);
    expect(report.score).toBe(100);
    expect(report.grade).toBe('A+');
    expect(report.missing.length).toBe(0);
    expect(report.warnings.length).toBe(0);
  });

  it('should penalize and issue warnings for weak directive values', () => {
    const rawHeaders = `
      Content-Security-Policy: default-src 'self' 'unsafe-inline' *
      Strict-Transport-Security: max-age=3600
      X-Frame-Options: SAMEORIGIN
      X-Content-Type-Options: nosniff
    `;

    const report = auditHeaders(rawHeaders);
    // HSTS is penalized for low max-age
    // CSP is penalized for unsafe-inline and wildcard
    expect(report.score).toBeLessThan(80);
    expect(report.warnings.some(w => w.includes('unsafe-inline'))).toBe(true);
    expect(report.warnings.some(w => w.includes('wildcard'))).toBe(true);
    expect(report.warnings.some(w => w.includes('max-age'))).toBe(true);
    expect(report.missing).toContain('Referrer-Policy');
    expect(report.missing).toContain('Permissions-Policy');
  });

  it('should return grade F for completely empty or insecure headers', () => {
    const report = auditHeaders('');
    expect(report.score).toBe(0);
    expect(report.grade).toBe('F');
    expect(report.missing).toContain('Content-Security-Policy');
  });
});
