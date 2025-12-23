import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { parseUserAgent } from './UserAgentParser';

/**
 * **Feature: add-new-tools, Property 6: User Agent 解析完整性**
 * *For any* 有效的 User Agent 字符串，解析结果应该包含浏览器名称和操作系统信息
 * **Validates: Requirements 7.2**
 */
describe('Property 6: User Agent Parser Completeness', () => {
  const knownUserAgents = [
    {
      ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      browser: 'Chrome',
      os: 'Windows',
    },
    {
      ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      browser: 'Chrome',
      os: 'macOS',
    },
    {
      ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
      browser: 'Firefox',
      os: 'Windows',
    },
    {
      ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
      browser: 'Safari',
      os: 'iOS',
    },
    {
      ua: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
      browser: 'Chrome',
      os: 'Android',
    },
  ];

  it('should correctly identify browser for known user agents', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...knownUserAgents),
        ({ ua, browser }) => {
          const result = parseUserAgent(ua);
          expect(result.browser.name).toBe(browser);
          return true;
        }
      ),
      { numRuns: knownUserAgents.length }
    );
  });

  it('should correctly identify OS for known user agents', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...knownUserAgents),
        ({ ua, os }) => {
          const result = parseUserAgent(ua);
          expect(result.os.name).toBe(os);
          return true;
        }
      ),
      { numRuns: knownUserAgents.length }
    );
  });

  it('should always return a valid structure', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 0, maxLength: 500 }),
        (ua) => {
          const result = parseUserAgent(ua);
          expect(result).toHaveProperty('browser');
          expect(result).toHaveProperty('os');
          expect(result).toHaveProperty('device');
          expect(result).toHaveProperty('engine');
          expect(result.browser).toHaveProperty('name');
          expect(result.browser).toHaveProperty('version');
          expect(result.os).toHaveProperty('name');
          expect(result.os).toHaveProperty('version');
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should detect mobile devices correctly', () => {
    const mobileUAs = [
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
      'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36',
    ];

    for (const ua of mobileUAs) {
      const result = parseUserAgent(ua);
      expect(result.device.type).toBe('Mobile');
    }
  });

  it('should detect tablet devices correctly', () => {
    const tabletUA = 'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15';
    const result = parseUserAgent(tabletUA);
    expect(result.device.type).toBe('Tablet');
  });

  it('should return Unknown for empty user agent', () => {
    const result = parseUserAgent('');
    expect(result.browser.name).toBe('Unknown');
    expect(result.os.name).toBe('Unknown');
  });
});
