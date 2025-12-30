'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';

// Base32 decode function
function base32Decode(input: string): Uint8Array {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  const cleanInput = input.toUpperCase().replace(/[^A-Z2-7]/g, '');
  
  let bits = '';
  for (const char of cleanInput) {
    const val = alphabet.indexOf(char);
    if (val === -1) continue;
    bits += val.toString(2).padStart(5, '0');
  }
  
  const bytes = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.slice(i, i + 8), 2));
  }
  
  return new Uint8Array(bytes);
}

// Generate random Base32 secret
function generateSecret(length: number = 16): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array).map(b => alphabet[b % 32]).join('');
}

// HMAC-SHA1 implementation using Web Crypto API
async function hmacSha1(key: Uint8Array, message: Uint8Array): Promise<Uint8Array> {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key.buffer as ArrayBuffer,
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, message.buffer as ArrayBuffer);
  return new Uint8Array(signature);
}

// Generate TOTP code
async function generateTotp(secret: string, timeStep: number = 30, digits: number = 6): Promise<string> {
  const key = base32Decode(secret);
  const time = Math.floor(Date.now() / 1000 / timeStep);
  
  // Convert time to 8-byte big-endian
  const timeBytes = new Uint8Array(8);
  let t = time;
  for (let i = 7; i >= 0; i--) {
    timeBytes[i] = t & 0xff;
    t = Math.floor(t / 256);
  }
  
  const hmac = await hmacSha1(key, timeBytes);
  
  // Dynamic truncation
  const offset = hmac[hmac.length - 1] & 0x0f;
  const code = (
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff)
  ) % Math.pow(10, digits);
  
  return code.toString().padStart(digits, '0');
}

export default function TotpGenerator() {
  const t = useTranslations('tools');
  const [secret, setSecret] = useState('');
  const [code, setCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [copied, setCopied] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);

  const updateCode = useCallback(async () => {
    if (secret.length >= 16) {
      try {
        const newCode = await generateTotp(secret);
        setCode(newCode);
      } catch {
        setCode('------');
      }
    } else {
      setCode('------');
    }
  }, [secret]);

  useEffect(() => {
    updateCode();
    
    const interval = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      const remaining = 30 - (now % 30);
      setTimeLeft(remaining);
      
      if (remaining === 30) {
        updateCode();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [updateCode]);

  const handleGenerateSecret = () => {
    const newSecret = generateSecret(32);
    setSecret(newSecret);
  };

  const copyCode = async () => {
    if (code && code !== '------') {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const copySecret = async () => {
    if (secret) {
      await navigator.clipboard.writeText(secret);
      setCopiedSecret(true);
      setTimeout(() => setCopiedSecret(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">{t('totp.secret')}</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={secret}
            onChange={(e) => setSecret(e.target.value.toUpperCase().replace(/[^A-Z2-7]/g, ''))}
            placeholder={t('totp.secretPlaceholder')}
            className="flex-1 p-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100"
          />
          <button
            onClick={handleGenerateSecret}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg text-sm"
          >
            {t('generate')}
          </button>
          <button
            onClick={copySecret}
            className={`px-4 py-2 rounded-lg text-sm ${
              copiedSecret ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {copiedSecret ? t('copied') : t('copy')}
          </button>
        </div>
        <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">{t('totp.secretHint')}</p>
      </div>

      <div className="p-6 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-center">
        <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">{t('totp.currentCode')}</div>
        <div className="text-4xl font-mono font-bold tracking-widest mb-4">
          {code.slice(0, 3)} {code.slice(3)}
        </div>
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-32 bg-gray-300 dark:bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-1000 ${
                  timeLeft <= 5 ? 'bg-red-500' : timeLeft <= 10 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${(timeLeft / 30) * 100}%` }}
              />
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-300">{timeLeft}s</span>
          </div>
          <button
            onClick={copyCode}
            disabled={code === '------'}
            className={`px-4 py-2 rounded-lg text-sm ${
              copied ? 'bg-green-600' : code === '------' ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {copied ? t('copied') : t('copy')}
          </button>
        </div>
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div className="text-sm font-medium mb-2">{t('totp.howItWorks')}</div>
        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
          <li>• {t('totp.step1')}</li>
          <li>• {t('totp.step2')}</li>
          <li>• {t('totp.step3')}</li>
        </ul>
      </div>
    </div>
  );
}
