const encoder = new TextEncoder();
const decoder = new TextDecoder();

/**
 * Escapes characters for TEXT properties (SUMMARY, DESCRIPTION, LOCATION).
 * Escapes backslashes first, then commas and semicolons, and finally translates newlines to \\n.
 */
export function escapeText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
    .replace(/\r?\n/g, '\\n');
}

/**
 * Folds a physical line in an iCalendar file to strictly fit within 75 octets.
 * The first line has a limit of 75 octets. Subsequent folded lines must begin with
 * a space character (1 octet), limiting their content portion to 74 octets.
 * Uses TextEncoder to perform octet-based splitting and guards against splitting UTF-8 sequences.
 */
export function foldLine(input: string): string {
  const bytes = encoder.encode(input);
  let result = '';
  let start = 0;
  
  while (start < bytes.length) {
    // First line has a limit of 75, subsequent lines start with a 1-byte space, making content limit 74
    const limit = start === 0 ? 75 : 74;
    
    if (bytes.length - start <= limit) {
      result += decoder.decode(bytes.subarray(start)) + '\r\n';
      break;
    }
    
    let end = start + limit;
    
    // Ensure we do not cut in the middle of a multi-byte UTF-8 character byte sequence.
    // UTF-8 continuation bytes start with bits 10 (byte & 0xC0 === 0x80)
    while (end > start && (bytes[end] & 0xC0) === 0x80) {
      end--;
    }
    
    if (end === start) {
      end = start + limit;
    }
    
    result += decoder.decode(bytes.subarray(start, end)) + '\r\n ';
    start = end;
  }
  
  return result;
}

/**
 * Accurately parses a local venue date-time string (like 2026-06-11T20:30:00)
 * and resolves its absolute Date UTC object based on its IANA timeZone name.
 * Uses a two-step refinement iteration to ensure DST transitions are mathematically exact.
 */
export function localToUtc(localDateStr: string, timeZone: string): Date {
  const parts = localDateStr.split(/[-T:]/);
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  const hour = parseInt(parts[3], 10);
  const minute = parseInt(parts[4], 10);
  const second = parts[5] ? parseInt(parts[5], 10) : 0;

  const utcDate = new Date(Date.UTC(year, month, day, hour, minute, second));
  
  const getLocalFields = (date: Date): number => {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false,
      hourCycle: 'h23' // Prevent 24:00 midnight overflow in V8 engines
    });
    
    const p = formatter.formatToParts(date);
    const map: Record<string, number> = {};
    p.forEach(part => {
      if (part.type !== 'literal') map[part.type] = parseInt(part.value, 10);
    });
    
    return Date.UTC(
      map.year, 
      map.month - 1, 
      map.day, 
      map.hour, 
      map.minute, 
      map.second
    );
  };

  // Step 1: Approximate local time Offset based on UTC mapping
  const formattedLocalTime1 = getLocalFields(utcDate);
  const diff1 = utcDate.getTime() - formattedLocalTime1;
  const candidate1 = new Date(utcDate.getTime() + diff1);

  // Step 2: Refine using candidate target local-time offset to resolve DST transition margins
  const formattedLocalTime2 = getLocalFields(candidate1);
  if (formattedLocalTime2 === utcDate.getTime()) {
    return candidate1;
  }
  
  const offset2 = candidate1.getTime() - formattedLocalTime2;
  return new Date(utcDate.getTime() + offset2);
}
