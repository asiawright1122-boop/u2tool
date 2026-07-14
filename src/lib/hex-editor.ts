export interface HexRow {
  offset: number;
  bytes: number[];
  ascii: string;
}

export interface HexSearchMatch {
  start: number;
  end: number;
}

export class InvalidUtf8Error extends TypeError {
  constructor() {
    super('Hexadecimal bytes are not valid UTF-8.');
    this.name = 'InvalidUtf8Error';
  }
}

const DEFAULT_ROW_WIDTH = 16;

export const MAX_HEX_FILE_BYTES = 2 * 1024 * 1024;

export function isHexFileSizeSupported(size: number): boolean {
  return Number.isSafeInteger(size) && size >= 0 && size <= MAX_HEX_FILE_BYTES;
}

export function bytesToRows(
  bytes: Uint8Array,
  width = DEFAULT_ROW_WIDTH,
): HexRow[] {
  if (!Number.isInteger(width) || width <= 0) {
    throw new RangeError('Row width must be a positive integer.');
  }

  const rows: HexRow[] = [];
  for (let offset = 0; offset < bytes.length; offset += width) {
    const rowBytes = Array.from(bytes.slice(offset, offset + width));
    rows.push({
      offset,
      bytes: rowBytes,
      ascii: rowBytes
        .map((byte) => (byte >= 0x20 && byte <= 0x7e ? String.fromCharCode(byte) : '.'))
        .join(''),
    });
  }
  return rows;
}

export function formatHexOffset(offset: number, minimumWidth = 8): string {
  if (!Number.isSafeInteger(offset) || offset < 0) {
    throw new RangeError('Offset must be a non-negative safe integer.');
  }
  if (!Number.isInteger(minimumWidth) || minimumWidth <= 0) {
    throw new RangeError('Offset width must be a positive integer.');
  }

  return offset.toString(16).toUpperCase().padStart(minimumWidth, '0');
}

export function updateByte(
  bytes: Uint8Array,
  offset: number,
  hex: string,
): Uint8Array {
  if (!Number.isInteger(offset) || offset < 0 || offset >= bytes.length) {
    throw new RangeError('Byte offset is outside the file.');
  }
  if (!/^[0-9a-f]{2}$/i.test(hex)) {
    throw new TypeError('Byte value must contain exactly two hexadecimal digits.');
  }

  const updated = bytes.slice();
  updated[offset] = Number.parseInt(hex, 16);
  return updated;
}

export function parseHexSearch(input: string): Uint8Array {
  const compact = input.replace(/\s+/gu, '');
  if (compact.length === 0) {
    return new Uint8Array();
  }
  if (compact.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(compact)) {
    throw new TypeError('Hex search must contain complete hexadecimal byte pairs.');
  }

  return Uint8Array.from(
    compact.match(/.{2}/gu)?.map((pair) => Number.parseInt(pair, 16)) ?? [],
  );
}

export function findByteMatches(
  bytes: Uint8Array,
  needle: Uint8Array,
): HexSearchMatch[] {
  if (needle.length === 0 || needle.length > bytes.length) {
    return [];
  }

  const matches: HexSearchMatch[] = [];
  scanByteMatches(
    bytes,
    needle,
    0,
    bytes.length - needle.length,
    (match) => {
      matches.push(match);
      return true;
    },
  );
  return matches;
}

export function findNextByteMatch(
  bytes: Uint8Array,
  needle: Uint8Array,
  fromStart = 0,
): HexSearchMatch | null {
  if (needle.length === 0 || needle.length > bytes.length) return null;
  const lastStart = bytes.length - needle.length;
  const minimumStart = Math.max(0, Math.trunc(fromStart));
  if (minimumStart > lastStart) return null;

  let result: HexSearchMatch | null = null;
  scanByteMatches(bytes, needle, minimumStart, lastStart, (match) => {
    result = match;
    return false;
  });
  return result;
}

export function findPreviousByteMatch(
  bytes: Uint8Array,
  needle: Uint8Array,
  fromStart = bytes.length - needle.length,
): HexSearchMatch | null {
  if (needle.length === 0 || needle.length > bytes.length) return null;
  const maximumStart = Math.min(
    bytes.length - needle.length,
    Math.trunc(fromStart),
  );
  if (maximumStart < 0) return null;

  let result: HexSearchMatch | null = null;
  scanByteMatches(bytes, needle, 0, maximumStart, (match) => {
    result = match;
    return true;
  });
  return result;
}

function scanByteMatches(
  bytes: Uint8Array,
  needle: Uint8Array,
  minimumStart: number,
  maximumStart: number,
  visit: (match: HexSearchMatch) => boolean,
): void {
  const prefix = buildPrefixTable(needle);
  const scanEnd = Math.min(bytes.length, maximumStart + needle.length);
  let matchedLength = 0;

  for (let index = minimumStart; index < scanEnd; index += 1) {
    while (
      matchedLength > 0 &&
      bytes[index] !== needle[matchedLength]
    ) {
      matchedLength = prefix[matchedLength - 1];
    }
    if (bytes[index] === needle[matchedLength]) {
      matchedLength += 1;
    }
    if (matchedLength !== needle.length) continue;

    const start = index - needle.length + 1;
    if (!visit({ start, end: start + needle.length })) return;
    matchedLength = prefix[matchedLength - 1];
  }
}

function buildPrefixTable(needle: Uint8Array): Uint32Array {
  const prefix = new Uint32Array(needle.length);
  let matchedLength = 0;

  for (let index = 1; index < needle.length; index += 1) {
    while (
      matchedLength > 0 &&
      needle[index] !== needle[matchedLength]
    ) {
      matchedLength = prefix[matchedLength - 1];
    }
    if (needle[index] === needle[matchedLength]) {
      matchedLength += 1;
    }
    prefix[index] = matchedLength;
  }

  return prefix;
}

export function findAsciiMatches(
  bytes: Uint8Array,
  query: string,
): HexSearchMatch[] {
  return findByteMatches(bytes, parseAsciiSearch(query));
}

export function parseAsciiSearch(query: string): Uint8Array {
  const ascii = new Uint8Array(query.length);
  for (let index = 0; index < query.length; index += 1) {
    const codePoint = query.charCodeAt(index);
    if (codePoint > 0x7f) {
      throw new TypeError('ASCII search accepts code points from U+0000 to U+007F only.');
    }
    ascii[index] = codePoint;
  }
  return ascii;
}

export function textToHex(text: string): string {
  return Array.from(new TextEncoder().encode(text), (byte) =>
    byte.toString(16).toUpperCase().padStart(2, '0'),
  ).join(' ');
}

export function hexToText(hex: string): string {
  const bytes = parseHexSearch(hex);
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    throw new InvalidUtf8Error();
  }
}
