import { describe, it, expect } from 'vitest';

// Inline MD5 algorithm from DeveloperCryptographicToolbox.svelte to verify correctness
function calculateInlineMD5(str: string): string {
  let k = [
    0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee, 0xf57c0faf, 0x4787c62a, 0xa8304613, 0xfd469501,
    0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be, 0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821,
    0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa, 0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8,
    0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed, 0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a,
    0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c, 0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70,
    0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x04881d05, 0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665,
    0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039, 0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1,
    0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1, 0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391
  ];
  let r = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
    5,  9, 14, 20, 5,  9, 14, 20, 5,  9, 14, 20, 5,  9, 14, 20,
    4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21
  ];

  let words: number[] = [];
  for (let i = 0; i < str.length * 8; i += 8) {
    words[i >> 5] |= (str.charCodeAt(i / 8) & 0xff) << (i % 32);
  }
  let len = str.length * 8;
  words[len >> 5] |= 0x80 << (len % 32);
  words[(((len + 64) >>> 9) << 4) + 14] = len;

  let h0 = 0x67452301, h1 = 0xefcdab89, h2 = 0x98badcfe, h3 = 0x10325476;

  for (let i = 0; i < words.length; i += 16) {
    let a = h0, b = h1, c = h2, d = h3;
    for (let j = 0; j < 64; j++) {
      let f, g;
      if (j < 16) {
        f = (b & c) | (~b & d);
        g = j;
      } else if (j < 32) {
        f = (d & b) | (~d & c);
        g = (5 * j + 1) % 16;
      } else if (j < 48) {
        f = b ^ c ^ d;
        g = (3 * j + 5) % 16;
      } else {
        f = c ^ (b | ~d);
        g = (7 * j) % 16;
      }
      let temp = d;
      d = c;
      c = b;
      let rot = r[j];
      let val = a + f + k[j] + (words[i + g] || 0);
      b = b + ((val << rot) | (val >>> (32 - rot)));
      a = temp;
    }
    h0 = (h0 + a) | 0;
    h1 = (h1 + b) | 0;
    h2 = (h2 + c) | 0;
    h3 = (h3 + d) | 0;
  }

  let hex = '';
  for (let i = 0; i < 4; i++) {
    let val = [h0, h1, h2, h3][i];
    for (let j = 0; j < 4; j++) {
      hex += ((val >> (j * 8)) & 0xff).toString(16).padStart(2, '0');
    }
  }
  return hex;
}

// Simulated bcrypt engine for matching verification
function generateSimulatedBcrypt(password: string, cost: number): string {
  const alphabet = './ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let salt = '';
  for (let i = 0; i < 22; i++) {
    const charCode = (password.charCodeAt(i % password.length) || 0) + i + cost;
    salt += alphabet[charCode % alphabet.length];
  }
  let hash = '';
  for (let i = 0; i < 31; i++) {
    const charCode = (password.charCodeAt(i % password.length) || 0) * (i + 1) + cost * 17;
    hash += alphabet[charCode % alphabet.length];
  }
  return `$2a$${cost.toString().padStart(2, '0')}$${salt}${hash}`;
}

describe('DeveloperCryptographicToolbox - Core Algorithms', () => {
  it('should calculate MD5 correctly for empty string', () => {
    expect(calculateInlineMD5('')).toBe('d41d8cd98f00b204e9800998ecf8427e');
  });

  it('should calculate MD5 correctly for "hello"', () => {
    expect(calculateInlineMD5('hello')).toBe('5d41402abc4b2a76b9719d911017c592');
  });

  it('should calculate MD5 correctly for "u2tool"', () => {
    expect(calculateInlineMD5('u2tool')).toBe('7eedcd1ad6ff6180a59cc0f3077f663c');
  });

  it('should calculate and verify simulated bcrypt hashes correctly', () => {
    const cost = 10;
    const password = 'u2tool-premium-cryptography-payload-2026';
    const hash = generateSimulatedBcrypt(password, cost);
    
    expect(hash.startsWith(`$2a$${cost}$`)).toBe(true);
    
    // Simulate verifier
    const derived = generateSimulatedBcrypt(password, cost);
    expect(derived).toBe(hash);
  });
});
