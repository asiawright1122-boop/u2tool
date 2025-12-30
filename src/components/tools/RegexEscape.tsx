'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';

export default function RegexEscape() {
  const t = useTranslations('tools.regex-escape');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'escape' | 'unescape'>('escape');

  const specialChars = [
    { char: '\\', desc: 'backslash' },
    { char: '^', desc: 'caret' },
    { char: '$', desc: 'dollar' },
    { char: '.', desc: 'dot' },
    { char: '|', desc: 'pipe' },
    { char: '?', desc: 'question' },
    { char: '*', desc: 'asterisk' },
    { char: '+', desc: 'plus' },
    { char: '(', desc: 'openParen' },
    { char: ')', desc: 'closeParen' },
    { char: '[', desc: 'openBracket' },
    { char: ']', desc: 'closeBracket' },
    { char: '{', desc: 'openBrace' },
    { char: '}', desc: 'closeBrace' },
  ];

  const escapeRegex = useCallback((str: string): string => {
    return str.replace(/[\\^$.|?*+()[\]{}]/g, '\\$&');
  }, []);

  const unescapeRegex = useCallback((str: string): string => {
    return str.replace(/\\([\\^$.|?*+()[\]{}])/g, '$1');
  }, []);

  const handleConvert = () => {
    if (mode === 'escape') {
      setOutput(escapeRegex(input));
    } else {
      setOutput(unescapeRegex(input));
    }
  };

  const handleSwap = () => {
    setMode(mode === 'escape' ? 'unescape' : 'escape');
    setInput(output);
    setOutput('');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
  };

  const loadSample = () => {
    setInput('Hello. How are you? (I hope you\'re well!) Price: $100.00 [50% off]');
    setOutput('');
  };

  const insertChar = (char: string) => {
    setInput(input + char);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 dark:text-gray-300">{t('mode')}:</label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as 'escape' | 'unescape')}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="escape">{t('escape')}</option>
            <option value="unescape">{t('unescape')}</option>
          </select>
        </div>

        <button
          onClick={loadSample}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          {t('loadSample')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('input')}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'escape' ? t('inputPlaceholder') : t('escapedPlaceholder')}
            className="w-full h-48 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('output')}
            </label>
            {output && (
              <button
                onClick={handleCopy}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {t('copy')}
              </button>
            )}
          </div>
          <textarea
            value={output}
            readOnly
            placeholder={t('outputPlaceholder')}
            className="w-full h-48 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-mono"
          />
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={handleConvert}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {mode === 'escape' ? t('escapeBtn') : t('unescapeBtn')}
        </button>
        <button
          onClick={handleSwap}
          className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          ⇄ {t('swap')}
        </button>
      </div>

      <div className="p-4 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
        <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">{t('specialChars')}</h3>
        <div className="flex flex-wrap gap-2">
          {specialChars.map(({ char }) => (
            <button
              key={char}
              onClick={() => insertChar(char)}
              className="w-10 h-10 flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded font-mono text-lg text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              title={char}
            >
              {char}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
        <h3 className="font-medium text-blue-700 dark:text-blue-300 mb-2">{t('info')}</h3>
        <p className="text-sm text-blue-600 dark:text-blue-200">{t('infoText')}</p>
      </div>
    </div>
  );
}
