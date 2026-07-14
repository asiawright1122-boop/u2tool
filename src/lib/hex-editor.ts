export interface HexRow {
  offset: number;
  bytes: number[];
  ascii: string;
}

export interface HexSearchMatch {
  start: number;
  end: number;
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
  for (let start = 0; start <= bytes.length - needle.length; start += 1) {
    let matched = true;
    for (let offset = 0; offset < needle.length; offset += 1) {
      if (bytes[start + offset] !== needle[offset]) {
        matched = false;
        break;
      }
    }
    if (matched) {
      matches.push({ start, end: start + needle.length });
    }
  }
  return matches;
}

export function findAsciiMatches(
  bytes: Uint8Array,
  query: string,
): HexSearchMatch[] {
  return findByteMatches(bytes, new TextEncoder().encode(query));
}

export function textToHex(text: string): string {
  return Array.from(new TextEncoder().encode(text), (byte) =>
    byte.toString(16).toUpperCase().padStart(2, '0'),
  ).join(' ');
}

export function hexToText(hex: string): string {
  return new TextDecoder().decode(parseHexSearch(hex));
}
