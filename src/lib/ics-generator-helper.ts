export interface IcsEventInput {
  title: string;
  description?: string;
  location?: string;
  startDate: Date | string | number;
  endDate: Date | string | number;
  url?: string;
}

export function formatToUtcString(dateInput: Date | string | number): string {
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) {
    throw new Error('Invalid Date');
  }

  const pad = (n: number) => n.toString().padStart(2, '0');

  const year = date.getUTCFullYear();
  const month = pad(date.getUTCMonth() + 1);
  const day = pad(date.getUTCDate());
  const hours = pad(date.getUTCHours());
  const minutes = pad(date.getUTCMinutes());
  const seconds = pad(date.getUTCSeconds());

  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}

export function escapeText(text: string): string {
  if (!text) return '';
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

export function foldLine(line: string): string {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const bytes = encoder.encode(line);

  if (bytes.length <= 75) {
    return line;
  }

  const chunks: string[] = [];
  let offset = 0;
  let isFirstLine = true;

  while (offset < bytes.length) {
    const limit = isFirstLine ? 75 : 74;
    let chunkLength = Math.min(limit, bytes.length - offset);

    // If we are not at the end, check if we're cutting in the middle of a multi-byte UTF-8 char.
    // In UTF-8, continuation bytes start with bits '10' (0x80 to 0xBF).
    // So if the byte after our chunk is a continuation byte, we must shrink the chunk.
    if (offset + chunkLength < bytes.length) {
      while (chunkLength > 0 && (bytes[offset + chunkLength] & 0xC0) === 0x80) {
        chunkLength--;
      }
    }

    // Fallback in case chunkLength becomes 0 (e.g. extremely long single character, shouldn't happen in UTF-8)
    if (chunkLength === 0) {
      chunkLength = 1;
    }

    const chunkBytes = bytes.slice(offset, offset + chunkLength);
    const chunkText = decoder.decode(chunkBytes);

    if (isFirstLine) {
      chunks.push(chunkText);
      isFirstLine = false;
    } else {
      chunks.push(' ' + chunkText);
    }

    offset += chunkLength;
  }

  return chunks.join('\r\n');
}

export function generateIcsText(input: IcsEventInput): string {
  const {
    title,
    description = '',
    location = '',
    startDate,
    endDate,
    url = '',
  } = input;

  const startUtc = formatToUtcString(startDate);
  const endUtc = formatToUtcString(endDate);

  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Antigravity//PopularUtilityTool//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `DTSTART:${startUtc}`,
    `DTEND:${endUtc}`,
    `SUMMARY:${escapeText(title)}`,
  ];

  if (description) {
    lines.push(`DESCRIPTION:${escapeText(description)}`);
  }

  if (location) {
    lines.push(`LOCATION:${escapeText(location)}`);
  }

  if (url) {
    lines.push(`URL:${escapeText(url)}`);
  }

  lines.push('END:VEVENT');
  lines.push('END:VCALENDAR');

  // Fold all lines and join them with CRLF
  const foldedLines = lines.map(foldLine);
  
  // RFC 5545 requires every line to end with CRLF, including the last one.
  return foldedLines.join('\r\n') + '\r\n';
}
