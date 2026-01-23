'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function JsonFormatter() {
  const t = useTranslations('tools.json-formatter');
  const tg = useTranslations('tools');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const formatJson = () => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError('');
    } catch (_e) {
      setError(tg('json.invalidJson') + ': ' + (_e as Error).message);
      setOutput('');
    }
  };

  const minifyJson = () => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError('');
    } catch (_e) {
      setError(tg('json.invalidJson') + ': ' + (_e as Error).message);
      setOutput('');
    }
  };

  const copyOutput = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 2000);
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  useEffect(() => {

    return () => {

      if (timerRef.current) clearTimeout(timerRef.current);

    };

  }, []);


  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{tg('input')}</label>
        <textarea
          className="tool-textarea"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('inputPlaceholder')}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={formatJson} className="btn-primary">
          {tg('format')} ({tg('beautify')})
        </button>
        <button onClick={minifyJson} className="btn-secondary">
          {tg('minify')}
        </button>
        <button onClick={clearAll} className="btn-secondary">
          {tg('clear')}
        </button>
      </div>

      {error && (
        <div className="tool-error">
          {error}
        </div>
      )}

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{tg('output')}</label>
          {output && (
            <button
              onClick={copyOutput}
              className={`text-sm px-3 py-1 rounded ${copied ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100'}`}
            >
              {copied ? tg('copied') : tg('copy')}
            </button>
          )}
        </div>
        <textarea
          className="tool-textarea"
          value={output}
          readOnly
          placeholder={t('outputPlaceholder')}
        />
      </div>
    </div>
  );
}
