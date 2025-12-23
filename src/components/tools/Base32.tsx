'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

const BASE32_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

export default function Base32() {
  const t = useTranslations('tools');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState(false);

  const encode = (str: string): string => {
    const bytes = new TextEncoder().encode(str);
    let bits = '';
    bytes.forEach(b => bits += b.toString(2).padStart(8, '0'));
    while (bits.length % 5 !== 0) bits += '0';
    let result = '';
    for (let i = 0; i < bits.length; i += 5) {
      result += BASE32_CHARS[parseInt(bits.slice(i, i + 5), 2)];
    }
    while (result.length % 8 !== 0) result += '=';
    return result;
  };

  const decode = (str: string): string => {
    const cleaned = str.replace(/=/g, '').toUpperCase();
    let bits = '';
    for (const char of cleaned) {
      const idx = BASE32_CHARS.indexOf(char);
      if (idx === -1) throw new Error('Invalid');
      bits += idx.toString(2).padStart(5, '0');
    }
    const bytes: number[] = [];
    for (let i = 0; i + 8 <= bits.length; i += 8) {
      bytes.push(parseInt(bits.slice(i, i + 8), 2));
    }
    return new TextDecoder().decode(new Uint8Array(bytes));
  };

  const convert = () => {
    try {
      setOutput(mode === 'encode' ? encode(input) : decode(input));
    } catch {
      setOutput(t('error'));
    }
  };

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => setMode('encode')} className={`px-4 py-2 rounded ${mode === 'encode' ? 'bg-blue-600' : 'bg-gray-700'}`}>{t('encode')}</button>
        <button onClick={() => setMode('decode')} className={`px-4 py-2 rounded ${mode === 'decode' ? 'bg-blue-600' : 'bg-gray-700'}`}>{t('decode')}</button>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">{t('input')}</label>
        <textarea value={input} onChange={(e) => setInput(e.target.value)} className="w-full h-32 p-3 bg-gray-800 border border-gray-700 rounded-lg font-mono text-sm" placeholder={mode === 'encode' ? 'Hello World' : 'JBSWY3DPEBLW64TMMQ======'} />
      </div>
      <div className="flex gap-2">
        <button onClick={convert} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{t('convert')}</button>
        <button onClick={copy} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">{copied ? t('copied') : t('copy')}</button>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">{t('output')}</label>
        <textarea value={output} readOnly className="w-full h-32 p-3 bg-gray-800 border border-gray-700 rounded-lg font-mono text-sm" />
      </div>
    </div>
  );
}
