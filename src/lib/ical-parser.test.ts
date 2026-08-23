import { describe, expect, it } from 'vitest';
import { formatEventDate, parseICal, parseRRule } from './ical-parser';

// The en/ical-parser organic profile promises a parsed VEVENT table plus JSON
// export covering dates, location, attendees, recurrence, status, and a
// timezone boundary. These tests lock that evidence block to real parser
// behaviour so the P0 recovery claim cannot silently regress.
const SAMPLE_ICS = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//U2Tool//iCal Parser//EN',
  'X-WR-CALNAME:Team Calendar',
  'X-WR-TIMEZONE:Europe/Berlin',
  'BEGIN:VEVENT',
  'UID:standup-001',
  'SUMMARY:Daily standup',
  'DESCRIPTION:Sync on blockers\\nand next steps',
  'LOCATION:Room A\\, Floor 2',
  'DTSTART:20260310T090000Z',
  'DTEND:20260310T091500Z',
  'RRULE:FREQ=WEEKLY;BYDAY=MO,WE;COUNT=10',
  'ORGANIZER:mailto:lead@example.com',
  'ATTENDEE:mailto:dev1@example.com',
  'ATTENDEE:mailto:dev2@example.com',
  'STATUS:CONFIRMED',
  'CATEGORIES:work,engineering',
  'SEQUENCE:2',
  'TRANSP:OPAQUE',
  'URL:https://example.com/standup',
  'END:VEVENT',
  'BEGIN:VEVENT',
  'UID:retro-002',
  'SUMMARY:Sprint retro',
  'DTSTART:20260301T140000Z',
  'END:VEVENT',
  'END:VCALENDAR',
].join('\r\n');

describe('parseICal', () => {
  it('reads calendar-level metadata including the timezone identifier', () => {
    const result = parseICal(SAMPLE_ICS);

    expect(result.errors).toEqual([]);
    expect(result.calendarName).toBe('Team Calendar');
    expect(result.timezone).toBe('Europe/Berlin');
    expect(result.version).toBe('2.0');
    expect(result.prodId).toBe('-//U2Tool//iCal Parser//EN');
  });

  it('sorts events by start date', () => {
    const result = parseICal(SAMPLE_ICS);

    expect(result.events).toHaveLength(2);
    expect(result.events.map((event) => event.uid)).toEqual(['retro-002', 'standup-001']);
  });

  it('exposes every field promised by the evidence block', () => {
    const event = parseICal(SAMPLE_ICS).events.find((item) => item.uid === 'standup-001');

    expect(event).toBeDefined();
    expect(event?.summary).toBe('Daily standup');
    expect(event?.location).toBe('Room A, Floor 2');
    expect(event?.description).toBe('Sync on blockers\nand next steps');
    expect(event?.dtstart?.toISOString()).toBe('2026-03-10T09:00:00.000Z');
    expect(event?.dtend?.toISOString()).toBe('2026-03-10T09:15:00.000Z');
    expect(event?.rrule).toBe('FREQ=WEEKLY;BYDAY=MO,WE;COUNT=10');
    expect(event?.attendees).toEqual(['dev1@example.com', 'dev2@example.com']);
    expect(event?.organizer).toBe('lead@example.com');
    expect(event?.status).toBe('CONFIRMED');
    expect(event?.categories).toEqual(['work', 'engineering']);
    expect(event?.sequence).toBe(2);
    expect(event?.transp).toBe('OPAQUE');
    expect(event?.url).toBe('https://example.com/standup');
  });

  it('keeps recurrence, attendees, and status in the JSON export shape', () => {
    const events = parseICal(SAMPLE_ICS).events;
    const exported = JSON.parse(JSON.stringify(events)) as Array<Record<string, unknown>>;
    const standup = exported.find((item) => item.uid === 'standup-001');

    expect(standup).toMatchObject({
      rrule: 'FREQ=WEEKLY;BYDAY=MO,WE;COUNT=10',
      status: 'CONFIRMED',
      attendees: ['dev1@example.com', 'dev2@example.com'],
      location: 'Room A, Floor 2',
    });
  });

  it('unfolds folded lines before parsing properties', () => {
    const folded = [
      'BEGIN:VCALENDAR',
      'BEGIN:VEVENT',
      'UID:folded-1',
      'SUMMARY:A very long event title that got',
      '  folded across lines',
      'DTSTART:20260401T100000Z',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const result = parseICal(folded);

    expect(result.events).toHaveLength(1);
    expect(result.events[0].summary).toBe('A very long event title that got folded across lines');
  });

  it('parses date-only and TZID-prefixed start values', () => {
    const ics = [
      'BEGIN:VCALENDAR',
      'BEGIN:VEVENT',
      'UID:allday-1',
      'SUMMARY:All day offsite',
      'DTSTART;VALUE=DATE:20260415',
      'END:VEVENT',
      'BEGIN:VEVENT',
      'UID:tzid-1',
      'SUMMARY:Local meeting',
      'DTSTART;TZID=Europe/Berlin:20260416T110000',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const result = parseICal(ics);
    const allDay = result.events.find((event) => event.uid === 'allday-1');
    const local = result.events.find((event) => event.uid === 'tzid-1');

    expect(allDay?.dtstart).toBeInstanceOf(Date);
    expect(allDay?.dtstartStr).toBe('20260415');
    expect(local?.dtstart).toBeInstanceOf(Date);
    expect(local?.dtstart?.getFullYear()).toBe(2026);
  });

  it('drops events that are missing a UID or summary', () => {
    const ics = [
      'BEGIN:VCALENDAR',
      'BEGIN:VEVENT',
      'SUMMARY:No uid here',
      'DTSTART:20260501T100000Z',
      'END:VEVENT',
      'BEGIN:VEVENT',
      'UID:no-summary',
      'DTSTART:20260502T100000Z',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    expect(parseICal(ics).events).toEqual([]);
  });

  it('returns an empty result for content without events', () => {
    const result = parseICal('BEGIN:VCALENDAR\r\nVERSION:2.0\r\nEND:VCALENDAR');

    expect(result.events).toEqual([]);
    expect(result.errors).toEqual([]);
  });
});

describe('parseRRule', () => {
  it('returns an empty string for missing input', () => {
    expect(parseRRule('')).toBe('');
  });

  it('describes simple frequencies', () => {
    expect(parseRRule('FREQ=DAILY')).toBe('Daily');
    expect(parseRRule('FREQ=WEEKLY')).toBe('Weekly');
    expect(parseRRule('FREQ=MONTHLY')).toBe('Monthly');
    expect(parseRRule('FREQ=YEARLY')).toBe('Yearly');
  });

  it('expands BYDAY into weekday names', () => {
    expect(parseRRule('FREQ=WEEKLY;BYDAY=MO,WE,FR')).toBe('Weekly on Mon, Wed, Fri');
  });

  it('uses correct plural units for every interval frequency', () => {
    expect(parseRRule('FREQ=DAILY;INTERVAL=2')).toBe('Every 2 days');
    expect(parseRRule('FREQ=WEEKLY;INTERVAL=3')).toBe('Every 3 weeks');
    expect(parseRRule('FREQ=MONTHLY;INTERVAL=2')).toBe('Every 2 months');
    expect(parseRRule('FREQ=YEARLY;INTERVAL=4')).toBe('Every 4 years');
  });

  it('ignores an interval of one', () => {
    expect(parseRRule('FREQ=WEEKLY;INTERVAL=1')).toBe('Weekly');
  });

  it('appends an occurrence count', () => {
    expect(parseRRule('FREQ=WEEKLY;COUNT=10')).toBe('Weekly, 10 times');
  });

  it('appends an until date', () => {
    expect(parseRRule('FREQ=WEEKLY;UNTIL=20260601T000000Z')).toContain('until');
  });

  it('falls back to the raw rule for unknown frequencies', () => {
    expect(parseRRule('FREQ=HOURLY')).toBe('FREQ=HOURLY');
  });
});

describe('formatEventDate', () => {
  it('returns N/A for missing dates', () => {
    expect(formatEventDate(null)).toBe('N/A');
    expect(formatEventDate(undefined)).toBe('N/A');
  });

  it('formats a real date', () => {
    expect(formatEventDate(new Date(Date.UTC(2026, 2, 10, 9, 0, 0)))).not.toBe('N/A');
  });
});