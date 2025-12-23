'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function NumberBaseConverter() {
  const t = useTranslations('tools');
  const [input, setInput] = useState('');
  const [fromBase, setFromBase] = useState(10);
  const [results, setResults] = useState<{ base: number; value: string; name: string }[]>([]);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');

  const bases = [
    { base: 2, name: 'Binary' },
    { base: 8, name: 'Octal' },
    { base: 10, name: 'Decimal' },
    { base: 16, name: 'Hexadecimal' },
  ];

  const convert = () => {
    if (!input.trim()) {
      setResults([]);
      setError('');
      return;
    }
    try {
      const decimal = parseInt(input, fromBase);
      if (isNaN(decimal)) {
        throw new Error('Invalid number');
      }

      const converted = bases.map(({ base, name }) => ({
        base,
        name,
        value: decimal.toString(base).toUpperCase(),
      }));

      setResults(converted);
      setError('');
    } catch (e) {
      setError(t('errorInvalidInput'));
      setResults([]);
    }
  };

  const copyValue = async (base: number, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(String(base));
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">{t('input')}</label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
            placeholder={t('inputPlaceholder')}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">From Base</label>
          <select
            value={fromBase}
            onChange={(e) => setFromBase(Number(e.target.value))}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
          >
            {bases.map(({ base, name }) => (
              <option key={base} value={base}>
                {name} (Base {base})
              </option>
            ))}
          </select>
        </div>
      </div>

      <button onClick={convert} className="btn-primary">
        {t('convert')}
      </button>

      {error && (
        <div className="p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-3">
          {results.map(({ base, name, value }) => (
            <div
              key={base}
              className="flex items-center justify-between p-4 bg-gray-800 rounded-lg"
            >
              <div>
                <div className="text-xs text-gray-300 mb-1">{name} (Base {base})</div>
                <div className="font-mono text-lg">{value}</div>
              </div>
              <button
                onClick={() => copyValue(base, value)}
                className={`text-sm px-3 py-1 rounded ${
                  copied === String(base) ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {copied === String(base) ? t('copied') : t('copy')}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
