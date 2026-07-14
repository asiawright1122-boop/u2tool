import { describe, expect, it } from 'vitest';

import {
  bytesToRows,
  findAsciiMatches,
  findByteMatches,
  findNextByteMatch,
  findPreviousByteMatch,
  formatHexOffset,
  hexToText,
  isHexFileSizeSupported,
  MAX_HEX_FILE_BYTES,
  parseAsciiSearch,
  parseHexSearch,
  textToHex,
  updateByte,
} from './hex-editor';

describe('hex editor byte model', () => {
  it('builds 16-byte rows with numeric offsets, printable ASCII, and zero-padded display offsets [capability:hex-editor:profile:release-readiness]', () => {
    const bytes = Uint8Array.from([
      0x41, 0x1f, 0x20, 0x7e, 0x7f, 0x42, 0x43, 0x44,
      0x45, 0x46, 0x47, 0x48, 0x49, 0x4a, 0x4b, 0x4c,
      0x5a,
    ]);

    expect(bytesToRows(bytes)).toEqual([
      {
        offset: 0,
        bytes: [
          0x41, 0x1f, 0x20, 0x7e, 0x7f, 0x42, 0x43, 0x44,
          0x45, 0x46, 0x47, 0x48, 0x49, 0x4a, 0x4b, 0x4c,
        ],
        ascii: 'A. ~.BCDEFGHIJKL',
      },
      { offset: 16, bytes: [0x5a], ascii: 'Z' },
    ]);
    expect(formatHexOffset(0)).toBe('00000000');
    expect(formatHexOffset(16)).toBe('00000010');
  });

  it('edits one byte immutably and rejects invalid offsets or hex pairs', () => {
    const original = Uint8Array.from([0x00, 0x41, 0xff]);

    expect(updateByte(original, 1, '7a')).toEqual(
      Uint8Array.from([0x00, 0x7a, 0xff]),
    );
    expect(original).toEqual(Uint8Array.from([0x00, 0x41, 0xff]));
    expect(() => updateByte(original, -1, '00')).toThrow(RangeError);
    expect(() => updateByte(original, 3, '00')).toThrow(RangeError);
    expect(() => updateByte(original, 0, 'A')).toThrow(TypeError);
    expect(() => updateByte(original, 0, 'GG')).toThrow(TypeError);
  });

  it('parses strict hex searches and returns every overlapping hex or ASCII match', () => {
    const bytes = Uint8Array.from([0x41, 0x41, 0x41, 0x20, 0xe7, 0x8c, 0xab]);

    expect(parseHexSearch('41 41')).toEqual(Uint8Array.from([0x41, 0x41]));
    expect(findByteMatches(bytes, parseHexSearch('4141'))).toEqual([
      { start: 0, end: 2 },
      { start: 1, end: 3 },
    ]);
    expect(findAsciiMatches(bytes, 'AA')).toEqual([
      { start: 0, end: 2 },
      { start: 1, end: 3 },
    ]);
    expect(() => findAsciiMatches(bytes, '猫')).toThrow(TypeError);
    expect(findByteMatches(bytes, new Uint8Array())).toEqual([]);
    expect(findAsciiMatches(bytes, '')).toEqual([]);
    expect(() => parseHexSearch('4')).toThrow(TypeError);
    expect(() => parseHexSearch('4Z')).toThrow(TypeError);
  });

  it('round-trips Unicode text through UTF-8 bytes without locale-specific processing [capability:hex-editor:engine:language-support]', () => {
    expect(textToHex('Hello 猫')).toBe('48 65 6C 6C 6F 20 E7 8C AB');
    expect(hexToText('48 65 6c 6c 6f 20 e7 8c ab')).toBe('Hello 猫');
    expect(textToHex('')).toBe('');
    expect(hexToText('')).toBe('');
    expect(bytesToRows(new Uint8Array())).toEqual([]);
    expect(() => hexToText('ABC')).toThrow(TypeError);
  });

  it('searches direct ASCII bytes and rejects every non-ASCII code point', () => {
    const bytes = Uint8Array.from([0x41, 0x7f, 0xc3, 0xa9]);

    expect(parseAsciiSearch('A\x7F')).toEqual(Uint8Array.from([0x41, 0x7f]));
    expect(findAsciiMatches(bytes, '\x7F')).toEqual([{ start: 1, end: 2 }]);
    expect(() => parseAsciiSearch('é')).toThrow(TypeError);
    expect(() => findAsciiMatches(bytes, '猫')).toThrow(TypeError);
    expect(() => findAsciiMatches(bytes, '😀')).toThrow(TypeError);
  });

  it('rejects malformed and incomplete UTF-8 byte sequences during hex decoding', () => {
    expect(() => hexToText('FF')).toThrow(TypeError);
    expect(() => hexToText('C3')).toThrow(TypeError);
    expect(() => hexToText('E2 82')).toThrow(TypeError);
    expect(() => hexToText('F0 9F 98')).toThrow(TypeError);
  });

  it('accepts the 2 MiB boundary and rejects a file one byte larger', () => {
    const boundaryFixture = new Uint8Array(MAX_HEX_FILE_BYTES);

    expect(boundaryFixture.byteLength).toBe(2 * 1024 * 1024);
    expect(isHexFileSizeSupported(boundaryFixture.byteLength)).toBe(true);
    expect(isHexFileSizeSupported(boundaryFixture.byteLength + 1)).toBe(false);
  });

  it('finds a long repeated-byte query in linear time at the 2 MiB boundary', () => {
    const bytes = new Uint8Array(MAX_HEX_FILE_BYTES).fill(0x41);
    const needle = new Uint8Array(1024).fill(0x41);
    needle[needle.length - 1] = 0x42;

    const startedAt = performance.now();
    const matches = findByteMatches(bytes, needle);
    const elapsedMs = performance.now() - startedAt;

    expect(matches).toEqual([]);
    expect(elapsedMs).toBeLessThan(1_000);
  });

  it('preserves all-match semantics for a one-byte query across a 2 MiB high-match file', () => {
    const bytes = new Uint8Array(MAX_HEX_FILE_BYTES).fill(0x41);

    const startedAt = performance.now();
    const matches = findByteMatches(bytes, Uint8Array.of(0x41));
    const elapsedMs = performance.now() - startedAt;

    expect(matches).toHaveLength(MAX_HEX_FILE_BYTES);
    expect(matches[0]).toEqual({ start: 0, end: 1 });
    expect(matches.at(-1)).toEqual({
      start: MAX_HEX_FILE_BYTES - 1,
      end: MAX_HEX_FILE_BYTES,
    });
    expect(elapsedMs).toBeLessThan(1_000);
  });

  it('navigates one overlapping match at a time without materializing the match set', () => {
    const bytes = new Uint8Array(MAX_HEX_FILE_BYTES).fill(0x41);
    const pair = Uint8Array.of(0x41, 0x41);

    expect(findNextByteMatch(bytes, pair, 0)).toEqual({ start: 0, end: 2 });
    expect(findNextByteMatch(bytes, pair, 1)).toEqual({ start: 1, end: 3 });
    expect(findNextByteMatch(bytes, pair, bytes.length - 1)).toBeNull();
    expect(findPreviousByteMatch(bytes, pair, bytes.length - 2)).toEqual({
      start: bytes.length - 2,
      end: bytes.length,
    });
    expect(findPreviousByteMatch(bytes, pair, 0)).toEqual({ start: 0, end: 2 });
    expect(findPreviousByteMatch(bytes, pair, -1)).toBeNull();
  });
});
