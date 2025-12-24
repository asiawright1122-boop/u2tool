'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

function encodeBase58(input: string): string {
  const bytes = new TextEncoder().encode(input);
  
  if (bytes.length === 0) return '';
  
  // Count leading zeros
  let zeros = 0;
  for (const byte of bytes) {
    if (byte === 0) zeros++;
    else break;
  }
  
  // Convert to big integer
  let num = BigInt(0);
  for (const byte of bytes) {
    num = num * BigInt(256) + BigInt(byte);
  }
  
  // Convert to base58
  let result = '';
  while (num > 0) {
    const remainder = Number(num % BigInt(58));
    num = num / BigInt(58);
    result = BASE58_ALPHABET[remainder] + result;
  }
  
  // Add leading '1's for each leading zero byte
  return '1'.repeat(zeros) + result;
}

function decodeBase58(input: string): string {
  if (input.length === 0) return '';
  
  // Count leading '1's
  let zeros = 0;
  for (const char of input) {
    if (char === '1') zeros++;
    else break;
  }
  
  // Convert from base58 to big integer
  let num = BigInt(0);
  for (const char of input) {
    const index = BASE58_ALPHABET.indexOf(char);
    if (index === -1) throw new Error(`Invalid Base58 character: ${char}`);
    num = num * BigInt(58) + BigInt(index);
  }
  
  // Convert to bytes
  const bytes: number[] = [];
  while (num > 0) {
    bytes.unshift(Number(num % BigInt(256)));
    num = num / BigInt(256);
  }
  
  // Add leading zero bytes
  for (let i = 0; i < zeros; i++) {
    bytes.unshift(0);
  }
  
  return new TextDecoder().decode(new Uint8Array(bytes));
}

export default function Base58() {
  const t = useTranslations('tools');
  const tb = useTranslations('tools.base58');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const encode = () => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      return;
    }
    try {
      setOutput(encodeBase58(input));
      setError('');
    } catch (_e) {
      setError(t('errorEncoding'));
      setOutput('');
    }
  };

  const decode = () => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      return;
    }
    try {
      setOutput(decodeBase58(input));
      setError('');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : t('errorInvalidInput'));
      setOutput('');
    }
  };

  const copyOutput = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">{t('input')}</label>
        <textarea
          className="tool-textarea"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={tb('placeholder')}
          rows={4}
        />
      </div>

      {error && (
        <div className="text-red-400 text-sm bg-red-900/20 p-2 rounded">{error}</div>
      )}

      <div className="flex flex-wrap gap-2">
        <button onClick={encode} className="btn-primary">
          {tb('encodeBtn')}
        </button>
        <button onClick={decode} className="btn-secondary">
          {tb('decodeBtn')}
        </button>
        <button onClick={() => { setInput(''); setOutput(''); setError(''); }} className="btn-secondary">
          {t('clear')}
        </button>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium">{t('output')}</label>
          {output && (
            <button
              onClick={copyOutput}
              className={`text-sm px-3 py-1 rounded ${copied ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
              {copied ? t('copied') : t('copy')}
            </button>
          )}
        </div>
        <textarea
          className="tool-textarea"
          value={output}
          readOnly
          placeholder={tb('resultPlaceholder')}
          rows={4}
        />
      </div>

      <div className="p-4 bg-gray-800/50 rounded-lg text-sm text-gray-300">
        <h3 className="font-medium text-white mb-2">{tb('aboutTitle')}</h3>
        <p className="mb-2">
          {tb('aboutText')}
        </p>
        <p className="font-mono text-xs">
          Alphabet: {BASE58_ALPHABET}
        </p>
      </div>
    </div>
  );
}
