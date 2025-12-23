'use client';

import { useCallback, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';

type Separator = ':' | '-' | '';

type MacOptions = {
  uppercase: boolean;
  separator: Separator;
  locallyAdministered: boolean;
  multicast: boolean;
  prefix: string;
};

function normalizePrefix(prefix: string): number[] | null {
  const cleaned = prefix.trim().replace(/[^0-9A-Fa-f]/g, '');
  if (!cleaned) return [];
  if (cleaned.length !== 6 && cleaned.length !== 12) return null;
  if (!/^[0-9A-Fa-f]+$/.test(cleaned)) return null;

  const bytes: number[] = [];
  for (let i = 0; i < cleaned.length; i += 2) {
    bytes.push(parseInt(cleaned.slice(i, i + 2), 16));
  }
  return bytes;
}

function formatMac(bytes: number[], options: MacOptions): string {
  const hex = bytes.map((b) => b.toString(16).padStart(2, '0'));
  const joined = hex.join(options.separator);
  return options.uppercase ? joined.toUpperCase() : joined.toLowerCase();
}

function randomByte(): number {
  return Math.floor(Math.random() * 256);
}

function applyBitFlags(firstByte: number, locallyAdministered: boolean, multicast: boolean): number {
  let b = firstByte;
  b = multicast ? (b | 0x01) : (b & 0xFE);
  b = locallyAdministered ? (b | 0x02) : (b & 0xFD);
  return b;
}

export default function MacAddressGenerator() {
  const t = useTranslations('tools.mac-address-generator');
  const [count, setCount] = useState(5);
  const [uppercase, setUppercase] = useState(true);
  const [separator, setSeparator] = useState<Separator>(':');
  const [locallyAdministered, setLocallyAdministered] = useState(true);
  const [multicast, setMulticast] = useState(false);
  const [prefix, setPrefix] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const prefixBytes = useMemo(() => normalizePrefix(prefix), [prefix]);

  const generate = useCallback(() => {
    setError('');

    if (prefixBytes === null) {
      setError(t('errorInvalidPrefix'));
      return;
    }

    const safeCount = Math.max(1, Math.min(100, count || 1));

    const options: MacOptions = {
      uppercase,
      separator,
      locallyAdministered,
      multicast,
      prefix,
    };

    const results: string[] = [];

    for (let i = 0; i < safeCount; i++) {
      const bytes = [randomByte(), randomByte(), randomByte(), randomByte(), randomByte(), randomByte()];

      if (prefixBytes && prefixBytes.length > 0) {
        for (let j = 0; j < Math.min(prefixBytes.length, 6); j++) {
          bytes[j] = prefixBytes[j];
        }
      }

      bytes[0] = applyBitFlags(bytes[0], locallyAdministered, multicast);

      results.push(formatMac(bytes, options));
    }

    setOutput(results.join('\n'));
  }, [count, uppercase, separator, locallyAdministered, multicast, prefixBytes, t]);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
  };

  const loadSample = () => {
    setCount(5);
    setUppercase(true);
    setSeparator(':');
    setLocallyAdministered(true);
    setMulticast(false);
    setPrefix('');
    setOutput('');
    setError('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-300">{t('count')}:</label>
          <input
            type="number"
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value) || 1)}
            min="1"
            max="100"
            className="w-24 p-2 border border-gray-600 rounded-lg bg-gray-800 text-gray-100"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-300">{t('separator')}:</label>
          <select
            value={separator}
            onChange={(e) => setSeparator(e.target.value as Separator)}
            className="p-2 border border-gray-600 rounded-lg bg-gray-800 text-gray-100"
          >
            <option value=":">{t('sepColon')}</option>
            <option value="-">{t('sepHyphen')}</option>
            <option value="">{t('sepNone')}</option>
          </select>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={uppercase}
            onChange={(e) => setUppercase(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded"
          />
          <span className="text-sm text-gray-300">{t('uppercase')}</span>
        </label>

        <button
          onClick={loadSample}
          className="text-sm text-blue-400 hover:text-blue-300"
        >
          {t('reset')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-200">
              {t('prefix')}
            </label>
            <input
              type="text"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              placeholder={t('prefixPlaceholder')}
              className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800 text-gray-100 font-mono placeholder-gray-500"
            />
            <p className="text-xs text-gray-300">{t('prefixHint')}</p>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={locallyAdministered}
                onChange={(e) => setLocallyAdministered(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm text-gray-300">{t('locallyAdministered')}</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={multicast}
                onChange={(e) => setMulticast(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm text-gray-300">{t('multicast')}</span>
            </label>
          </div>

          {error && (
            <div className="p-3 bg-red-900/30 text-red-400 rounded-lg">
              {error}
            </div>
          )}

          <button
            onClick={generate}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('generate')}
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-200">
              {t('output')}
            </label>
            {output && (
              <button
                onClick={handleCopy}
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                {t('copyAll')}
              </button>
            )}
          </div>
          <textarea
            value={output}
            readOnly
            placeholder={t('outputPlaceholder')}
            className="w-full h-72 p-3 border border-gray-600 rounded-lg bg-gray-900 text-gray-100 font-mono placeholder-gray-500"
          />
        </div>
      </div>

      <div className="p-4 bg-blue-900/30 border border-blue-800 rounded-lg">
        <h3 className="font-medium text-blue-300 mb-2">{t('info')}</h3>
        <p className="text-sm text-blue-400">{t('infoText')}</p>
      </div>
    </div>
  );
}
