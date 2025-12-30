'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function TextCleaner() {
  const t = useTranslations('tools.text-cleaner');
  const [input, setInput] = useState('');
  const [options, setOptions] = useState({
    trim: true,
    removeEmptyLines: true,
    removeDuplicateLines: false,
    removeExtraSpaces: true,
    removeHtml: false,
    removePunctuation: false,
    lowercase: false,
    uppercase: false,
  });

  const clean = () => {
    let result = input;

    if (options.removeHtml) {
      result = result.replace(/<[^>]*>/g, '');
    }

    if (options.removePunctuation) {
      result = result.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '');
    }

    if (options.removeExtraSpaces) {
      result = result.replace(/\s+/g, ' ');
    }

    let lines = result.split('\n');

    if (options.trim) {
      lines = lines.map((line: string) => line.trim());
    }

    if (options.removeEmptyLines) {
      lines = lines.filter((line: string) => line.length > 0);
    }

    if (options.removeDuplicateLines) {
      lines = [...new Set(lines)];
    }

    result = lines.join('\n');

    if (options.lowercase) {
      result = result.toLowerCase();
    } else if (options.uppercase) {
      result = result.toUpperCase();
    }

    return result;
  };

  const handleOptionChange = (key: keyof typeof options) => {
    setOptions((prev: typeof options) => {
      const newOptions = { ...prev, [key]: !prev[key] };
      // Ensure lowercase and uppercase are mutually exclusive
      if (key === 'lowercase' && newOptions.lowercase) newOptions.uppercase = false;
      if (key === 'uppercase' && newOptions.uppercase) newOptions.lowercase = false;
      return newOptions;
    });
  };

  const output = clean();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">{t('input')}</label>
              <button
                onClick={() => setInput('')}
                className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
              >
                {t('clear')}
              </button>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={8}
              className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 font-mono"
              placeholder={t('placeholder')}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">{t('cleanedText')}</label>
              <button
                onClick={() => navigator.clipboard.writeText(output)}
                className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                {t('copyResult')}
              </button>
            </div>
            <textarea
              readOnly
              value={output}
              rows={8}
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-green-600 dark:text-green-400 font-mono"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">{t('options')}</h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.trim}
                  onChange={() => handleOptionChange('trim')}
                  className="form-checkbox h-4 w-4 text-blue-600 rounded bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                />
                <span className="text-gray-600 dark:text-gray-300 text-sm">{t('trimLines')}</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.removeEmptyLines}
                  onChange={() => handleOptionChange('removeEmptyLines')}
                  className="form-checkbox h-4 w-4 text-blue-600 rounded bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                />
                <span className="text-gray-600 dark:text-gray-300 text-sm">{t('removeEmptyLines')}</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.removeDuplicateLines}
                  onChange={() => handleOptionChange('removeDuplicateLines')}
                  className="form-checkbox h-4 w-4 text-blue-600 rounded bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                />
                <span className="text-gray-600 dark:text-gray-300 text-sm">{t('removeDuplicateLines')}</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.removeExtraSpaces}
                  onChange={() => handleOptionChange('removeExtraSpaces')}
                  className="form-checkbox h-4 w-4 text-blue-600 rounded bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                />
                <span className="text-gray-600 dark:text-gray-300 text-sm">{t('removeExtraSpaces')}</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.removeHtml}
                  onChange={() => handleOptionChange('removeHtml')}
                  className="form-checkbox h-4 w-4 text-blue-600 rounded bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                />
                <span className="text-gray-600 dark:text-gray-300 text-sm">{t('removeHtmlTags')}</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.removePunctuation}
                  onChange={() => handleOptionChange('removePunctuation')}
                  className="form-checkbox h-4 w-4 text-blue-600 rounded bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                />
                <span className="text-gray-600 dark:text-gray-300 text-sm">{t('removePunctuation')}</span>
              </label>
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <label className="flex items-center space-x-3 cursor-pointer mb-2">
                  <input
                    type="checkbox"
                    checked={options.lowercase}
                    onChange={() => handleOptionChange('lowercase')}
                    className="form-checkbox h-4 w-4 text-blue-600 rounded bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                  />
                  <span className="text-gray-600 dark:text-gray-300 text-sm">{t('lowercase')}</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={options.uppercase}
                    onChange={() => handleOptionChange('uppercase')}
                    className="form-checkbox h-4 w-4 text-blue-600 rounded bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                  />
                  <span className="text-gray-600 dark:text-gray-300 text-sm">{t('uppercase')}</span>
                </label>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
             <div className="text-sm text-gray-600 dark:text-gray-300">
                <div className="flex justify-between mb-1">
                  <span>{t('characters')}:</span>
                  <span className="text-gray-900 dark:text-white">{output.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('lines')}:</span>
                  <span className="text-gray-900 dark:text-white">{output ? output.split('\n').length : 0}</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
