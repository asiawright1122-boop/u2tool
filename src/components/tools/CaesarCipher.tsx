'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';

function caesarCipher(text: string, shift: number, decrypt: boolean = false): string {
  // For decryption, reverse the shift
  const actualShift = decrypt ? (26 - (shift % 26)) : (shift % 26);
  
  return text.replace(/[a-zA-Z]/g, (char) => {
    const code = char.charCodeAt(0);
    const base = code >= 97 ? 97 : 65; // lowercase or uppercase
    return String.fromCharCode(((code - base + actualShift) % 26) + base);
  });
}

export default function CaesarCipher() {
  const t = useTranslations('tools.caesar-cipher');
  const tCommon = useTranslations('tools');
  
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [shift, setShift] = useState(3);
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [copied, setCopied] = useState(false);

  const handleProcess = useCallback(() => {
    setOutput(caesarCipher(input, shift, mode === 'decrypt'));
  }, [input, shift, mode]);

  const handleInputChange = (value: string) => {
    setInput(value);
    // Auto-process as user types
    setOutput(caesarCipher(value, shift, mode === 'decrypt'));
  };

  const handleShiftChange = (newShift: number) => {
    setShift(newShift);
    if (input) {
      setOutput(caesarCipher(input, newShift, mode === 'decrypt'));
    }
  };

  const handleModeChange = (newMode: 'encrypt' | 'decrypt') => {
    setMode(newMode);
    if (input) {
      setOutput(caesarCipher(input, shift, newMode === 'decrypt'));
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
  };

  const swapInputOutput = () => {
    setInput(output);
    // When swapping, we need to reverse the operation
    setMode(mode === 'encrypt' ? 'decrypt' : 'encrypt');
    setOutput(caesarCipher(output, shift, mode === 'encrypt'));
  };

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

      {/* Shift Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('shift')}: {shift}
        </label>
        <input
          type="range"
          min="1"
          max="25"
          value={shift}
          onChange={(e) => handleShiftChange(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>1</span>
          <span>13</span>
          <span>25</span>
        </div>
      </div>

      {/* Quick Shift Buttons */}
      <div className="flex flex-wrap justify-center gap-2">
        {[1, 3, 5, 7, 13, 19, 23].map(s => (
          <button
            key={s}
            onClick={() => handleShiftChange(s)}
            className={`px-3 py-1 rounded text-sm ${
              shift === s
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {s}
          </button>
        ))}
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
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-white"
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

      {/* Character Mapping Preview */}
      {shift > 0 && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            {t('mappingPreview')} ({t('shift')} = {shift})
          </h3>
          <div className="overflow-x-auto">
            <div className="flex gap-1 text-xs font-mono">
              {Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ').map(char => (
                <div key={char} className="flex flex-col items-center">
                  <span className="text-gray-900 dark:text-gray-100">{char}</span>
                  <span className="text-gray-400">↓</span>
                  <span className="text-blue-600 dark:text-blue-400">{caesarCipher(char, shift)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
