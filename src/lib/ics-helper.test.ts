import { describe, it, expect } from 'vitest';
import { foldLine, escapeText, localToUtc } from './ics-helper';

describe('ics-helper tests', () => {
  it('should correctly escape text without double-escaping slashes', () => {
    const text = 'Hello \\ World, this is a description; with newlines\nand commas,';
    // Expected escape order should yield:
    // Hello \\\\ World\, this is a description\; with newlines\nand commas\,
    expect(escapeText(text)).toBe('Hello \\\\ World\\, this is a description\\; with newlines\\nand commas\\,');
  });

  it('should fold lines under 75 bytes without truncating multi-byte UTF-8 sequences', () => {
    const longChineseText = '这是一段非常非常非常非常非常非常非常非常非常非常非常非常非常长中文描述，用来验证多字节字符在75字节边界时的安全切割和折行。';
    const folded = foldLine(`DESCRIPTION:${longChineseText}`);
    const lines = folded.split('\r\n').filter(Boolean);
    
    const encoder = new TextEncoder();
    lines.forEach((line, index) => {
      const byteLen = encoder.encode(line).length;
      // The first line has a limit of 75, subsequent lines have a 1-byte space, total limit 75.
      expect(byteLen).toBeLessThanOrEqual(75);
      if (index > 0) {
        expect(line.startsWith(' ')).toBe(true);
      }
    });
    // The content joined back (without CRLF + leading spaces) should equal initial input
    const joined = lines.map((l, i) => i === 0 ? l : l.slice(1)).join('');
    expect(joined).toBe(`DESCRIPTION:${longChineseText}`);
  });

  it('should correctly convert local venue times to UTC across DST transitions', () => {
    // New York local Spring Forward: 2026-03-08T03:30:00 local is UTC-4 (07:30:00Z)
    const localTime = '2026-03-08T03:30:00';
    const tz = 'America/New_York';
    const utcDate = localToUtc(localTime, tz);
    expect(utcDate.toISOString()).toBe('2026-03-08T07:30:00.000Z');
  });

  it('should correctly handle midnight transitions without overflow', () => {
    // Test midnight boundary: 2026-06-11T00:00:00 in Mexico City (UTC-6 -> UTC 06:00:00Z)
    const localTime = '2026-06-11T00:00:00';
    const tz = 'America/Mexico_City';
    const utcDate = localToUtc(localTime, tz);
    expect(utcDate.toISOString()).toBe('2026-06-11T06:00:00.000Z');
  });
});
