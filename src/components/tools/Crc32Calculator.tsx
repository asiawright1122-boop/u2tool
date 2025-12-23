'use client';

import { useCallback, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';

function buildCrc32Table(): Uint32Array {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c >>> 0;
  }
  return table;
}

function crc32(bytes: Uint8Array, table: Uint32Array): number {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < bytes.length; i++) {
    crc = table[(crc ^ bytes[i]) & 0xFF] ^ (crc >>> 8);
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

export default function Crc32Calculator() {
  const t = useTranslations('tools.crc32-calculator');
  const [inputMode, setInputMode] = useState<'text' | 'file'>('text');
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [crcHex, setCrcHex] = useState('');
  const [crcDec, setCrcDec] = useState('');
  const [error, setError] = useState('');

  const table = useMemo(() => buildCrc32Table(), []);

  const calculateForBytes = useCallback((bytes: Uint8Array) => {
    const value = crc32(bytes, table);
    setCrcHex(value.toString(16).toUpperCase().padStart(8, '0'));
    setCrcDec(value.toString(10));
  }, [table]);

  const handleCalculate = useCallback(async () => {
    setError('');
    setCrcHex('');
    setCrcDec('');

    if (inputMode === 'text') {
      if (!text) return;
      const encoder = new TextEncoder();
      calculateForBytes(encoder.encode(text));
      return;
    }

    if (!file) {
      setError(t('errorNoFile'));
      return;
    }

    try {
      const buffer = await file.arrayBuffer();
      calculateForBytes(new Uint8Array(buffer));
    } catch {
      setError(t('errorReadFile'));
    }
  }, [calculateForBytes, file, inputMode, t, text]);

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
  };

  const loadSample = () => {
    setInputMode('text');
    setFile(null);
    setText(t('sampleText'));
    setCrcHex('');
    setCrcDec('');
    setError('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-300">{t('inputMode')}:</label>
          <select
            value={inputMode}
            onChange={(e) => {
              setInputMode(e.target.value as 'text' | 'file');
              setError('');
              setCrcHex('');
              setCrcDec('');
            }}
            className="p-2 border border-gray-600 rounded-lg bg-gray-800 text-gray-100"
          >
            <option value="text">{t('modeText')}</option>
            <option value="file">{t('modeFile')}</option>
          </select>
        </div>

        <button
          onClick={loadSample}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          {t('loadSample')}
        </button>
      </div>

      {inputMode === 'text' ? (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            {t('textInput')}
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t('textPlaceholder')}
            className="w-full h-40 p-3 border border-gray-600 rounded-lg bg-gray-800 text-gray-100 font-mono"
          />
        </div>
      ) : (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            {t('fileInput')}
          </label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full p-2 border border-gray-600 rounded-lg bg-gray-800 text-gray-100"
          />
          {file && (
            <div className="text-sm text-gray-300">
              {t('selectedFile')}: {file.name} ({(file.size / 1024).toFixed(2)} KB)
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex justify-center">
        <button
          onClick={handleCalculate}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {t('calculate')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="p-4 bg-gray-900 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-300">{t('crcHex')}</div>
            {crcHex && (
              <button
                onClick={() => handleCopy(crcHex)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {t('copy')}
              </button>
            )}
          </div>
          <div className="mt-1 font-mono text-lg text-gray-100">{crcHex ? `0x${crcHex}` : '-'}</div>
        </div>

        <div className="p-4 bg-gray-900 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-300">{t('crcDec')}</div>
            {crcDec && (
              <button
                onClick={() => handleCopy(crcDec)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {t('copy')}
              </button>
            )}
          </div>
          <div className="mt-1 font-mono text-lg text-gray-100">{crcDec || '-'}</div>
        </div>
      </div>

      <div className="p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-blue-800 mb-2">{t('info')}</h3>
        <p className="text-sm text-blue-700">{t('infoText')}</p>
      </div>
    </div>
  );
}
