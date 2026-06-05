import { describe, it, expect } from 'vitest';
import {
  generateIcsText,
  formatToUtcString,
  escapeText,
  type IcsEventInput
} from './ics-generator-helper';

describe('ICS Generator Helper', () => {
  describe('formatToUtcString', () => {
    it('formats a date object to YYYYMMDDTHHMMSSZ', () => {
      const date = new Date(Date.UTC(2026, 5, 15, 14, 30, 0)); // 2026-06-15 14:30:00 UTC
      expect(formatToUtcString(date)).toBe('20260615T143000Z');
    });

    it('formats a date string or timestamp correctly', () => {
      expect(formatToUtcString('2026-06-15T14:30:00Z')).toBe('20260615T143000Z');
      expect(formatToUtcString(1781533800000)).toBe('20260615T143000Z'); // 1781533800000 is 2026-06-15 14:30:00 UTC
    });

    it('throws error for invalid date', () => {
      expect(() => formatToUtcString('invalid-date')).toThrow('Invalid Date');
    });
  });

  describe('escapeText', () => {
    it('escapes specific characters correctly', () => {
      expect(escapeText('Hello; World, this \\ is a test\nNew Line')).toBe('Hello\\; World\\, this \\\\ is a test\\nNew Line');
    });
  });

  describe('generateIcsText', () => {
    it('generates valid RFC 5545 iCalendar content', () => {
      const input: IcsEventInput = {
        title: 'Project Kickoff Meeting',
        description: 'Discussing Phase 49 implementation details with the team.',
        location: 'Conference Room A, 5th Floor',
        startDate: '2026-06-15T10:00:00Z',
        endDate: '2026-06-15T11:00:00Z',
        url: 'https://example.com/meeting'
      };

      const ics = generateIcsText(input);
      
      expect(ics).toContain('BEGIN:VCALENDAR');
      expect(ics).toContain('VERSION:2.0');
      expect(ics).toContain('PRODID:-//Antigravity//PopularUtilityTool//EN');
      expect(ics).toContain('BEGIN:VEVENT');
      expect(ics).toContain('SUMMARY:Project Kickoff Meeting');
      expect(ics).toContain('DESCRIPTION:Discussing Phase 49 implementation details with the team.');
      expect(ics).toContain('LOCATION:Conference Room A\\, 5th Floor');
      expect(ics).toContain('DTSTART:20260615T100000Z');
      expect(ics).toContain('DTEND:20260615T110000Z');
      expect(ics).toContain('URL:https://example.com/meeting');
      expect(ics).toContain('END:VEVENT');
      expect(ics).toContain('END:VCALENDAR');

      // Verify CRLF on every line
      const lines = ics.split('\r\n');
      expect(lines.length).toBeGreaterThan(10);
      expect(lines[lines.length - 1]).toBe(''); // Last line after split of trailing CRLF should be empty
    });

    it('folds long lines (>75 octets) safely including unicode characters', () => {
      const input: IcsEventInput = {
        title: '这是一个极其漫长并且充满了中文字符的日历事件标题用以测试RFC5545的75字节折行规则是否能正确工作而不会破坏多字节中文字符',
        description: 'This is a very long description that exceeds seventy-five characters to ensure that the foldLine function breaks it up into multiple lines with a space prefix for safety.',
        startDate: '2026-06-15T10:00:00Z',
        endDate: '2026-06-15T11:00:00Z',
      };

      const ics = generateIcsText(input);

      // Verify lines limit (every line in ics should be <= 75 bytes/octets excluding CRLF itself)
      const lines = ics.split('\r\n').filter(l => l.length > 0);
      const encoder = new TextEncoder();
      
      for (const line of lines) {
        const bytes = encoder.encode(line);
        expect(bytes.length).toBeLessThanOrEqual(75);
        
        // If it is a folded line, it must start with a space or tab
        // Note: the line key (like SUMMARY:) doesn't start with space, but subsequent folded lines do.
        // Let's check folded lines in our output
      }

      // Check that the re-assembled title is correct and not corrupted
      const titleLines: string[] = [];
      let collect = false;
      for (const line of lines) {
        if (line.startsWith('SUMMARY:')) {
          titleLines.push(line.substring(8));
          collect = true;
        } else if (collect && line.startsWith(' ')) {
          titleLines.push(line.substring(1));
        } else if (collect) {
          break;
        }
      }
      const assembledTitle = titleLines.join('');
      expect(assembledTitle).toBe(input.title);
    });
  });
});
