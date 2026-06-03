import { describe, expect, it } from 'vitest';
import {
  foldLine,
  escapeText,
  formatIcsDate,
  generateIcsContent
} from './world-cup-calendar';
import type { Match } from '../../lib/data/world-cup-schedule.json';

describe('World Cup 2026 iCalendar API Unit Tests', () => {
  describe('escapeText()', () => {
    it('escapes commas, semicolons, and backslashes', () => {
      const input = 'New York, NY; Estadio: MetLife\\Stadium';
      const expected = 'New York\\, NY\\; Estadio: MetLife\\\\Stadium';
      expect(escapeText(input)).toBe(expected);
    });

    it('replaces actual newlines with literal \\n characters', () => {
      const input = 'Line 1\nLine 2\r\nLine 3';
      const expected = 'Line 1\\nLine 2\\nLine 3';
      expect(escapeText(input)).toBe(expected);
    });
  });

  describe('foldLine()', () => {
    it('does not fold lines shorter than 75 bytes', () => {
      const line = 'SUMMARY:Mexico vs Sweden';
      expect(foldLine(line)).toBe(line);
    });

    it('correctly folds lines exceeding 75 bytes', () => {
      // 80 characters (all ASCII, 1 byte each)
      const line = 'DESCRIPTION:This is a very long description that definitely exceeds seventy five characters in total length.';
      const folded = foldLine(line);
      
      // Verification rules:
      // 1. Must contain CRLF folding
      expect(folded).toContain('\r\n ');
      
      // 2. Re-assembling the folded line by removing CRLF + Space should equal the original
      const restored = folded.replace(/\r\n /g, '');
      expect(restored).toBe(line);
      
      // 3. Each individual line segment must not exceed 75 characters (including CRLF)
      const segments = folded.split('\r\n');
      for (const segment of segments) {
        expect(segment.length).toBeLessThanOrEqual(75);
      }
    });

    it('handles folding multibyte characters correctly without cutting a character code in half', () => {
      // "中文测试" is multibyte. We want to verify it folds safely on byte boundary if needed.
      const line = 'DESCRIPTION:测试中文字符折行测试中文字符折行测试中文字符折行测试中文字符折行测试中文字符折行';
      const folded = foldLine(line);
      const restored = folded.replace(/\r\n /g, '');
      expect(restored).toBe(line);
    });
  });

  describe('formatIcsDate()', () => {
    it('formats a date object to iCalendar UTC format (YYYYMMDDTHHMMSSZ)', () => {
      const date = new Date('2026-06-11T20:30:00Z');
      expect(formatIcsDate(date)).toBe('20260611T203000Z');
    });
  });

  describe('generateIcsContent()', () => {
    const mockMatches: Match[] = [
      {
        id: 'M1',
        stage: 'group',
        group: 'A',
        utcTime: '2026-06-11T20:30:00Z',
        stadium: 'MEXICO_CITY',
        homeTeam: 'MEX',
        awayTeam: 'SWE',
        homePlaceholder: null,
        awayPlaceholder: null,
        venueCity: 'Mexico City',
        sequence: 2
      },
      {
        id: 'M73',
        stage: 'r32',
        group: null,
        utcTime: '2026-06-28T22:00:00Z',
        stadium: 'SOFI',
        homeTeam: 'TBA_M73_H',
        awayTeam: 'TBA_M73_A',
        homePlaceholder: 'Winner Group A',
        awayPlaceholder: 'Runner-up Group B',
        venueCity: 'Los Angeles',
        sequence: 0
      }
    ];

    it('generates a valid basic iCalendar envelope structure', () => {
      const ics = generateIcsContent(mockMatches);
      
      expect(ics).toContain('BEGIN:VCALENDAR');
      expect(ics).toContain('VERSION:2.0');
      expect(ics).toContain('PRODID:-//U2Tool//World Cup 2026 Calendar//EN');
      expect(ics).toContain('END:VCALENDAR');
      
      expect(ics).toContain('BEGIN:VEVENT');
      expect(ics).toContain('UID:M1-2026-FIFA-U2TOOL');
      expect(ics).toContain('SUMMARY:🏆 MEX vs SWE (Group A)');
      expect(ics).toContain('SEQUENCE:2');
      expect(ics).toContain('END:VEVENT');
    });

    it('generates correct TBA descriptive summary for knockout stages', () => {
      const ics = generateIcsContent(mockMatches);
      expect(ics).toContain('SUMMARY:🏆 [Round of 32] Winner Group A vs Runner-up Group B');
    });

    it('injects alarm configurations when requested', () => {
      const ics = generateIcsContent(mockMatches, 15);
      expect(ics).toContain('BEGIN:VALARM');
      expect(ics).toContain('TRIGGER:-PT15M');
      expect(ics).toContain('ACTION:DISPLAY');
      expect(ics).toContain('END:VALARM');
    });
  });
});
