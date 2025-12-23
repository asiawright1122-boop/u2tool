'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function HexBase64Converter() {
  const t = useTranslations('tools.hex-base64-converter');
  const tg = useTranslations('tools');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'hex-to-base64' | 'base64-to-hex'>('hex-to-base64');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const hexToBase64 = (hex: string): string => {
    // Remove spaces and validate
    const cleanHex = hex.replace(/\s+/g, '').toLowerCase();
    if (!/^[0-9a-f]*$/.test(cleanHex)) {
      throw new Error('Invalid hexadecimal string');
    }
    if (cleanHex.length % 2 !== 0) {
      throw new Error('Hex string must have even length');
    }

    // Convert hex to bytes
    const bytes = new Uint8Array(cleanHex.length / 2);
    for (let i = 0; i < cleanHex.length; i += 2) {
      bytes[i / 2] = parseInt(cleanHex.substr(i, 2), 16);
    }

    // Convert bytes to base64
    let binary = '';
    bytes.forEach(byte => binary += String.fromCharCode(byte));
    return btoa(binary);
  };

  const base64ToHex = (base64: string): string => {
    // Decode base64 to bytes
    const binary = atob(base64.trim());
    
    // Convert bytes to hex
    let hex = '';
    for (let i = 0; i < binary.length; i++) {
      const byte = binary.charCodeAt(i);
      hex += byte.toString(16).padStart(2, '0');
    }
    
    // Format with spaces every 2 characters for readability
    return hex.toUpperCase().match(/.{1,2}/g)?.join(' ') || '';
  };

  const convert = () => {
    setError('');
    if (!input.trim()) {
      setOutput('');
      return;
    }

    try {
      if (mode === 'hex-to-base64') {
        setOutput(hexToBase64(input));
      } else {
        setOutput(base64ToHex(input));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : tg('errorProcessing'));
      setOutput('');
    }
  };

  const swap = () => {
    setMode(mode === 'hex-to-base64' ? 'base64-to-hex' : 'hex-to-base64');
    setInput(output.replace(/\s+/g, ''));
    setOutput('');
    setError('');
  };

  const copyOutput = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadSample = () => {
    if (mode === 'hex-to-base64') {
      setInput('48 65 6C 6C 6F 20 57 6F 72 6C 64 21');
    } else {
      setInput('SGVsbG8gV29ybGQh');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => { setMode('hex-to-base64'); setOutput(''); setError(''); }}
          className={`px-4 py-2 rounded-lg ${mode === 'hex-to-base64' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
        >
          {t('hexToBase64')}
        </button>
        <button
          onClick={swap}
          className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
          title={t('swap')}
        >
          ⇄
        </button>
        <button
          onClick={() => { setMode('base64-to-hex'); setOutput(''); setError(''); }}
          className={`px-4 py-2 rounded-lg ${mode === 'base64-to-hex' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
        >
          {t('base64ToHex')}
        </button>
      </div>

      <div className="flex gap-2">
        <button
          onClick={loadSample}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm"
        >
          {t('loadSample')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            {mode === 'hex-to-base64' ? t('hexInput') : t('base64Input')}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="tool-textarea h-40 font-mono"
            placeholder={mode === 'hex-to-base64' ? t('hexPlaceholder') : t('base64Placeholder')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">{tg('output')}</label>
          <textarea
            value={output}
            readOnly
            className="tool-textarea h-40 font-mono bg-gray-800"
          />
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-900/20 border border-red-800 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="flex justify-center gap-3">
        <button
          onClick={convert}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
        >
          {tg('convert')}
        </button>
        <button
          onClick={copyOutput}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
          disabled={!output}
        >
          {copied ? tg('copied') : tg('copy')}
        </button>
      </div>

      <div className="p-4 bg-gray-800 rounded-lg text-sm">
        <h3 className="font-medium mb-2">{t('examples')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
          <div>
            <p className="font-medium text-gray-300">Hex:</p>
            <code className="text-blue-400">48 65 6C 6C 6F</code>
          </div>
          <div>
            <p className="font-medium text-gray-300">Base64:</p>
            <code className="text-green-400">SGVsbG8=</code>
          </div>
        </div>
      </div>
    </div>
  );
}
