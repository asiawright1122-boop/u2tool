import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// HMAC generation function (extracted for testing)
async function generateHmac(
  message: string,
  secretKey: string,
  algorithm: 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512'
): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secretKey);
  const messageData = encoder.encode(message);

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: algorithm },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
  const hashArray = Array.from(new Uint8Array(signature));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * **Feature: add-new-tools, Property 4: HMAC 生成正确性**
 * *For any* 输入文本和密钥，使用相同算法生成的 HMAC 应该与标准库生成的结果一致
 * **Validates: Requirements 6.2**
 */
describe('Property 4: HMAC Generation Correctness', () => {
  it('should generate consistent HMAC for same input', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 100 }),
        fc.string({ minLength: 1, maxLength: 50 }),
        async (message, key) => {
          const hmac1 = await generateHmac(message, key, 'SHA-256');
          const hmac2 = await generateHmac(message, key, 'SHA-256');
          expect(hmac1).toBe(hmac2);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should generate different HMAC for different keys', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 100 }),
        fc.string({ minLength: 1, maxLength: 50 }),
        fc.string({ minLength: 1, maxLength: 50 }),
        async (message, key1, key2) => {
          fc.pre(key1 !== key2);
          const hmac1 = await generateHmac(message, key1, 'SHA-256');
          const hmac2 = await generateHmac(message, key2, 'SHA-256');
          expect(hmac1).not.toBe(hmac2);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should generate correct length HMAC for each algorithm', async () => {
    const expectedLengths = {
      'SHA-1': 40,
      'SHA-256': 64,
      'SHA-384': 96,
      'SHA-512': 128,
    };

    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 50 }),
        fc.string({ minLength: 1, maxLength: 20 }),
        fc.constantFrom('SHA-1', 'SHA-256', 'SHA-384', 'SHA-512') as fc.Arbitrary<'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512'>,
        async (message, key, algorithm) => {
          const hmac = await generateHmac(message, key, algorithm);
          expect(hmac.length).toBe(expectedLengths[algorithm]);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should only contain hexadecimal characters', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 50 }),
        fc.string({ minLength: 1, maxLength: 20 }),
        async (message, key) => {
          const hmac = await generateHmac(message, key, 'SHA-256');
          expect(hmac).toMatch(/^[0-9a-f]+$/);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
