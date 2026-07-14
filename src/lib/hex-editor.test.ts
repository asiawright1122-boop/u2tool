import { describe, expect, it } from 'vitest';

import {
  bytesToRows,
  findAsciiMatches,
  findByteMatches,
  formatHexOffset,
  hexToText,
  isHexFileSizeSupported,
  MAX_HEX_FILE_BYTES,
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
    expect(findAsciiMatches(bytes, '猫')).toEqual([{ start: 4, end: 7 }]);
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

  it('accepts the 2 MiB boundary and rejects a file one byte larger', () => {
    const boundaryFixture = new Uint8Array(MAX_HEX_FILE_BYTES);

    expect(boundaryFixture.byteLength).toBe(2 * 1024 * 1024);
    expect(isHexFileSizeSupported(boundaryFixture.byteLength)).toBe(true);
    expect(isHexFileSizeSupported(boundaryFixture.byteLength + 1)).toBe(false);
  });
});
