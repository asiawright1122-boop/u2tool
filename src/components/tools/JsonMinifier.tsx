'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function JsonMinifier() {
  const t = useTranslations('tools');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState<{ original: number; minified: number; saved: number } | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const minify = () => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      setStats(null);
      return;
    }
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setError('');
      setStats({
        original: input.length,
        minified: minified.length,
        saved: Math.round((1 - minified.length / input.length) * 100)
      });
    } catch (_e) {
      setError(t('json.invalidJson'));
      setOutput('');
      setStats(null);
    }
  };

  const beautify = () => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError('');
      setStats(null);
    } catch (_e) {
      setError(t('json.invalidJson'));
      setOutput('');
    }
  };

  const copyOutput = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 2000);
  };

  const loadSample = () => {
    setInput(`{
  "name": "John Doe",
  "age": 30,
  "email": "john@example.com",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "country": "USA"
  },
  "hobbies": ["reading", "gaming", "coding"]
}`);
  };

  useEffect(() => {

    return () => {

      if (timerRef.current) clearTimeout(timerRef.current);

    };

  }, []);


  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium">{t('input')}</label>
          <button onClick={loadSample} className="text-sm text-blue-400 hover:text-blue-300">
            Load Sample
          </button>
        </div>
        <textarea
          className="tool-textarea"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('inputPlaceholder')}
          rows={8}
        />
      </div>

      {error && (
        <div className="text-red-400 text-sm bg-red-900/20 p-2 rounded">{error}</div>
      )}

      <div className="flex flex-wrap gap-2">
        <button onClick={minify} className="btn-primary">
          {t('minify')}
        </button>
        <button onClick={beautify} className="btn-secondary">
          {t('beautify')}
        </button>
        <button onClick={() => { setInput(''); setOutput(''); setError(''); setStats(null); }} className="btn-secondary">
          {t('clear')}
        </button>
      </div>

      {stats && (
        <div className="grid grid-cols-3 gap-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.original}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Original (bytes)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.minified}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Minified (bytes)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.saved}%</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Saved</div>
          </div>
        </div>
      )}

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
          placeholder={t('outputPlaceholder')}
          rows={6}
        />
      </div>
    </div>
  );
}
