const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  const chunkSize = 0x8000;

  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
  }

  if (typeof btoa === 'function') {
    return btoa(binary);
  }

  if (typeof Buffer !== 'undefined') {
    return Buffer.from(bytes).toString('base64');
  }

  throw new Error('Base64 encoding is not available in this runtime.');
}

function base64ToBytes(base64: string): Uint8Array {
  if (typeof atob === 'function') {
    const binary = atob(base64);
    return Uint8Array.from(binary, (char) => char.charCodeAt(0));
  }

  if (typeof Buffer !== 'undefined') {
    return new Uint8Array(Buffer.from(base64, 'base64'));
  }

  throw new Error('Base64 decoding is not available in this runtime.');
}

function stringToBytes(input: string): Uint8Array {
  return new TextEncoder().encode(input);
}

function bytesToString(bytes: Uint8Array): string {
  return new TextDecoder().decode(bytes);
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}

function toBase64Url(base64: string): string {
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function fromBase64Url(base64Url: string): string {
  const normalized = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const padding = normalized.length % 4 === 0 ? '' : '='.repeat(4 - (normalized.length % 4));
  return `${normalized}${padding}`;
}

function decodeBase32(secret: string): Uint8Array {
  const normalized = secret.toUpperCase().replace(/[^A-Z2-7]/g, '');
  let bits = '';

  for (const char of normalized) {
    const value = BASE32_ALPHABET.indexOf(char);
    if (value === -1) {
      throw new Error(`Invalid base32 character: ${char}`);
    }

    bits += value.toString(2).padStart(5, '0');
  }

  const bytes: number[] = [];
  for (let index = 0; index + 8 <= bits.length; index += 8) {
    bytes.push(Number.parseInt(bits.slice(index, index + 8), 2));
  }

  return Uint8Array.from(bytes);
}

async function signHmacSha1(keyBytes: Uint8Array, messageBytes: Uint8Array): Promise<Uint8Array> {
  if (!globalThis.crypto?.subtle) {
    throw new Error('Web Crypto is unavailable.');
  }

  const key = await globalThis.crypto.subtle.importKey(
    'raw',
    toArrayBuffer(keyBytes),
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign']
  );

  const signature = await globalThis.crypto.subtle.sign('HMAC', key, toArrayBuffer(messageBytes));
  return new Uint8Array(signature);
}

export interface DecodedJwt {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
  isExpired?: boolean;
  expiresAt?: Date;
  issuedAt?: Date;
}

export function base64UrlEncode(input: string | Uint8Array): string {
  const bytes = typeof input === 'string' ? stringToBytes(input) : input;
  return toBase64Url(bytesToBase64(bytes));
}

export function decodeJwt(token: string): DecodedJwt | null {
  const parts = token.trim().split('.');
  if (parts.length !== 3 || parts.some((part) => part.length === 0)) {
    return null;
  }

  try {
    const header = JSON.parse(bytesToString(base64ToBytes(fromBase64Url(parts[0])))) as Record<
      string,
      unknown
    >;
    const payload = JSON.parse(bytesToString(base64ToBytes(fromBase64Url(parts[1])))) as Record<
      string,
      unknown
    >;

    const expiresAt =
      typeof payload.exp === 'number' ? new Date(payload.exp * 1000) : undefined;
    const issuedAt =
      typeof payload.iat === 'number' ? new Date(payload.iat * 1000) : undefined;

    return {
      header,
      payload,
      signature: parts[2],
      isExpired: expiresAt ? expiresAt.getTime() <= Date.now() : undefined,
      expiresAt,
      issuedAt,
    };
  } catch {
    return null;
  }
}

export function generateSecret(length = 32): string {
  const safeLength = Math.max(16, Math.floor(length));
  const bytes = new Uint8Array(safeLength);

  if (!globalThis.crypto?.getRandomValues) {
    throw new Error('Secure random generation is unavailable.');
  }

  globalThis.crypto.getRandomValues(bytes);

  return Array.from(bytes, (value) => BASE32_ALPHABET[value % BASE32_ALPHABET.length]).join('');
}

export async function generateTotp(
  secret: string,
  stepSeconds = 30,
  digits = 6,
  timestamp = Date.now()
): Promise<string> {
  const keyBytes = decodeBase32(secret);
  const step = Math.max(1, Math.floor(stepSeconds));
  const counter = Math.floor(timestamp / 1000 / step);
  const counterBytes = new Uint8Array(8);
  let currentCounter = counter;

  for (let index = 7; index >= 0; index -= 1) {
    counterBytes[index] = currentCounter & 0xff;
    currentCounter = Math.floor(currentCounter / 256);
  }

  const signature = await signHmacSha1(keyBytes, counterBytes);
  const offset = signature[signature.length - 1] & 0x0f;
  const binary =
    ((signature[offset] & 0x7f) << 24) |
    ((signature[offset + 1] & 0xff) << 16) |
    ((signature[offset + 2] & 0xff) << 8) |
    (signature[offset + 3] & 0xff);

  const modulus = 10 ** Math.max(1, Math.min(10, Math.floor(digits)));
  return String(binary % modulus).padStart(Math.max(1, Math.min(10, Math.floor(digits))), '0');
}
