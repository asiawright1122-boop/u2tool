'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';

// ROT13 is self-inverse: rot13(rot13(x)) === x
function rot13(text: string): string {
  return text.replace(/[a-zA-Z]/g, (char) => {
    const code = char.charCodeAt(0);
    const base = code >= 97 ? 97 : 65; // lowercase or uppercase
    return String.fromCharCode(((code - base + 13) % 26) + base);
  });
}

export default function Rot13Encoder() {
  const t = useTranslations('tools.rot13-encoder');
  const tCommon = useTranslations('tools');
  
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const handleEncode = useCallback(() => {
    setOutput(rot13(input));
  }, [input]);

  const handleInputChange = (value: string) => {
    setInput(value);
    // Auto-encode as user types
    setOutput(rot13(value));
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
  };

  const swapInputOutput = () => {
    setInput(output);
    setOutput(rot13(output));
  };

  return (
    <div className="space-y-6">
      {/* Info */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          {t('info')}
        </p>
      </div>

      {/* Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {tCommon('input')}
        </label>
        <textarea
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={t('inputPlaceholder')}
          rows={6}
          className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-4">
        <button
          onClick={handleEncode}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-white"
        >
          {t('encode')}
        </button>
        <button
          onClick={swapInputOutput}
          disabled={!output}
          className="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium text-gray-900 dark:text-gray-100"
        >
          ↕ {t('swap')}
        </button>
        <button
          onClick={clearAll}
          className="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg font-medium text-gray-900 dark:text-gray-100"
        >
          {tCommon('clear')}
        </button>
      </div>

      {/* Output */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {tCommon('output')}
          </label>
          {output && (
            <button
              onClick={copyToClipboard}
              className="px-3 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-sm text-gray-900 dark:text-gray-100"
            >
              {copied ? tCommon('copied') : tCommon('copy')}
            </button>
          )}
        </div>
        <textarea
          value={output}
          readOnly
          placeholder={t('outputPlaceholder')}
          rows={6}
          className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 font-mono resize-none"
        />
      </div>

      {/* Character Mapping Table */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{t('mappingTable')}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="py-2 px-1 text-left text-gray-500 dark:text-gray-400">{t('original')}</th>
                {Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ').map(char => (
                  <th key={char} className="py-2 px-1 text-center text-gray-900 dark:text-gray-100">{char}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 px-1 text-gray-500 dark:text-gray-400">{t('encoded')}</td>
                {Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ').map(char => (
                  <td key={char} className="py-2 px-1 text-center text-blue-600 dark:text-blue-400">{rot13(char)}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
