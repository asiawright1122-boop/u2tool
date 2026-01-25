'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';

function vigenereCipher(text: string, keyword: string, decrypt: boolean = false): string {
  if (!keyword) return text;
  
  const key = keyword.toUpperCase().replace(/[^A-Z]/g, '');
  if (!key) return text;
  
  let keyIndex = 0;
  
  return text.replace(/[a-zA-Z]/g, (char) => {
    const code = char.charCodeAt(0);
    const base = code >= 97 ? 97 : 65;
    const charIndex = code - base;
    const keyChar = key[keyIndex % key.length];
    const keyShift = keyChar.charCodeAt(0) - 65;
    
    keyIndex++;
    
    if (decrypt) {
      return String.fromCharCode(((charIndex - keyShift + 26) % 26) + base);
    } else {
      return String.fromCharCode(((charIndex + keyShift) % 26) + base);
    }
  });
}

export default function VigenereCipher() {
  const t = useTranslations('tools.vigenere-cipher');
  const tCommon = useTranslations('tools');
  
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [keyword, setKeyword] = useState('');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [copied, setCopied] = useState(false);

  const handleProcess = useCallback(() => {
    setOutput(vigenereCipher(input, keyword, mode === 'decrypt'));
  }, [input, keyword, mode]);

  const handleInputChange = (value: string) => {
    setInput(value);
    if (keyword) {
      setOutput(vigenereCipher(value, keyword, mode === 'decrypt'));
    }
  };

  const handleKeywordChange = (value: string) => {
    setKeyword(value);
    if (input) {
      setOutput(vigenereCipher(input, value, mode === 'decrypt'));
    }
  };

  const handleModeChange = (newMode: 'encrypt' | 'decrypt') => {
    setMode(newMode);
    if (input && keyword) {
      setOutput(vigenereCipher(input, keyword, newMode === 'decrypt'));
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setKeyword('');
  };

  const swapInputOutput = () => {
    setInput(output);
    setMode(mode === 'encrypt' ? 'decrypt' : 'encrypt');
    setOutput(vigenereCipher(output, keyword, mode === 'encrypt'));
  };

  // Generate Vigenère table for display
  const generateTable = () => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return alphabet.split('').map((_, rowIndex) => {
      return alphabet.split('').map((_, colIndex) => {
        return alphabet[(rowIndex + colIndex) % 26];
      });
    });
  };

  const table = generateTable();

  return (
    <div className="space-y-6">
      {/* Info */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          {t('info')}
        </p>
      </div>

      {/* Mode Selection */}
      <div className="flex justify-center gap-4">
        <button
          onClick={() => handleModeChange('encrypt')}
          className={`px-6 py-2 rounded-lg font-medium ${
            mode === 'encrypt'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          {t('encrypt')}
        </button>
        <button
          onClick={() => handleModeChange('decrypt')}
          className={`px-6 py-2 rounded-lg font-medium ${
            mode === 'decrypt'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          {t('decrypt')}
        </button>
      </div>

      {/* Keyword */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('keyword')}
        </label>
        <input
          type="text"
          value={keyword}
          onChange={(e) => handleKeywordChange(e.target.value)}
          placeholder={t('keywordPlaceholder')}
          className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {keyword && (
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {t('effectiveKey')}: {keyword.toUpperCase().replace(/[^A-Z]/g, '') || t('none')}
          </p>
        )}
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
          onClick={handleProcess}
          disabled={!keyword}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg font-medium text-white"
        >
          {mode === 'encrypt' ? t('encrypt') : t('decrypt')}
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

      {/* Vigenère Table (Collapsible) */}
      <details className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <summary className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
          {t('showTable')}
        </summary>
        <div className="mt-4 overflow-x-auto">
          <table className="text-xs font-mono">
            <thead>
              <tr>
                <th className="p-1 text-gray-500 dark:text-gray-400"></th>
                {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(char => (
                  <th key={char} className="p-1 text-blue-600 dark:text-blue-400">{char}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <td className="p-1 text-blue-600 dark:text-blue-400 font-bold">
                    {String.fromCharCode(65 + rowIndex)}
                  </td>
                  {row.map((cell, colIndex) => (
                    <td 
                      key={colIndex} 
                      className="p-1 text-center text-gray-700 dark:text-gray-300"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
