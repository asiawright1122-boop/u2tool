'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

const BASE85_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!#$%&()*+-;<=>?@^_`{|}~';

export default function Base85() {
  const t = useTranslations('tools.base85');
  const tg = useTranslations('tools');
  const [input, setInput] = useState('Hello, World!');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const encode = (str: string): string => {
    const bytes = new TextEncoder().encode(str);
    let result = '';
    
    for (let i = 0; i < bytes.length; i += 4) {
      let value = 0;
      const chunk = Math.min(4, bytes.length - i);
      
      for (let j = 0; j < chunk; j++) {
        value = value * 256 + bytes[i + j];
      }
      
      // Pad with zeros if needed
      for (let j = chunk; j < 4; j++) {
        value = value * 256;
      }
      
      const encoded: string[] = [];
      for (let j = 0; j < 5; j++) {
        encoded.unshift(BASE85_CHARS[value % 85]);
        value = Math.floor(value / 85);
      }
      
      // Only include necessary characters based on input length
      const outputChars = chunk === 4 ? 5 : chunk + 1;
      result += encoded.slice(0, outputChars).join('');
    }
    
    return result;
  };

  const decode = (str: string): string => {
    const bytes: number[] = [];
    let i = 0;
    
    while (i < str.length) {
      let value = 0;
      const chunk = Math.min(5, str.length - i);
      
      for (let j = 0; j < chunk; j++) {
        const charIndex = BASE85_CHARS.indexOf(str[i + j]);
        if (charIndex === -1) {
          throw new Error(`Invalid character: ${str[i + j]}`);
        }
        value = value * 85 + charIndex;
      }

      // Pad with 'u' (84) if needed
      for (let j = chunk; j < 5; j++) {
        value = value * 85 + 84;
      }
      
      const outputBytes = chunk === 5 ? 4 : chunk - 1;
      for (let j = 3; j >= 4 - outputBytes; j--) {
        bytes.push((value >> (j * 8)) & 0xff);
      }
      
      i += chunk;
    }
    
    return new TextDecoder().decode(new Uint8Array(bytes));
  };

  const process = () => {
    try {
      if (mode === 'encode') {
        setOutput(encode(input));
      } else {
        setOutput(decode(input));
      }
    } catch (_e) {
      setOutput(`${tg('error')}: ${_e instanceof Error ? _e.message : tg('errorInvalidInput')}`);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <button onClick={() => setMode('encode')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${mode === 'encode' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}>
          Encode
        </button>
        <button onClick={() => setMode('decode')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${mode === 'decode' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}>
          Decode
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">{t('input')}</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)}
            className="w-full h-60 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white font-mono text-sm"
            placeholder={mode === 'encode' ? t('inputPlaceholderEncode') : t('inputPlaceholderDecode')} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">{t('output')}</label>
          <textarea value={output} readOnly
            className="w-full h-60 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white font-mono text-sm"
            placeholder={t('outputPlaceholder')} />
        </div>
      </div>

      <div className="flex gap-4">
        <button onClick={process}
          className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors">
          {mode === 'encode' ? t('encode') : t('decode')}
        </button>
        <button onClick={copyToClipboard} disabled={!output}
          className="px-6 py-2 bg-gray-600 hover:bg-gray-9000 disabled:opacity-50 rounded-lg font-medium transition-colors">
          {t('copy')}
        </button>
      </div>
    </div>
  );
}
