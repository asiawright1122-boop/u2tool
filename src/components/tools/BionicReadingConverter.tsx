'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function BionicReadingConverter() {
  const t = useTranslations('tools.bionic-reading-converter');
  const [input, setInput] = useState('');
  const [fixationStrength, setFixationStrength] = useState(50);
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const convertToBionic = (text: string): string => {
    const words = text.split(/(\s+)/);
    return words.map(word => {
      if (/^\s+$/.test(word)) return word;
      if (word.length <= 1) return `<b>${word}</b>`;
      
      const boldLength = Math.ceil(word.length * (fixationStrength / 100));
      const boldPart = word.slice(0, boldLength);
      const normalPart = word.slice(boldLength);
      
      return `<b>${boldPart}</b>${normalPart}`;
    }).join('');
  };

  const bionicHtml = convertToBionic(input);

  const copyHtml = () => {
    navigator.clipboard.writeText(bionicHtml);
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 2000);
  };

  const copyPlainText = () => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = bionicHtml;
    navigator.clipboard.writeText(tempDiv.textContent || '');
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {

    return () => {

      if (timerRef.current) clearTimeout(timerRef.current);

    };

  }, []);


  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('inputLabel')}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('inputPlaceholder')}
          className="w-full h-40 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('fixationStrength')}: {fixationStrength}%
        </label>
        <input
          type="range"
          min="20"
          max="80"
          value={fixationStrength}
          onChange={(e) => setFixationStrength(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>{t('light')}</span>
          <span>{t('medium')}</span>
          <span>{t('strong')}</span>
        </div>
      </div>

      <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-gray-900 dark:text-white">{t('preview')}</h3>
          <div className="flex gap-2">
            <button
              onClick={copyHtml}
              disabled={!input}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {copied ? t('copied') : t('copyHtml')}
            </button>
          </div>
        </div>
        <div
          className="prose dark:prose-invert max-w-none text-lg leading-relaxed"
          dangerouslySetInnerHTML={{ __html: bionicHtml || `<span class="text-gray-400">${t('previewPlaceholder')}</span>` }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <h3 className="font-medium text-yellow-800 dark:text-yellow-300 mb-2">{t('whatIsBionic')}</h3>
          <p className="text-sm text-yellow-700 dark:text-yellow-400">{t('bionicDescription')}</p>
        </div>
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <h3 className="font-medium text-green-800 dark:text-green-300 mb-2">{t('benefits')}</h3>
          <ul className="text-sm text-green-700 dark:text-green-400 space-y-1">
            <li>• {t('benefit1')}</li>
            <li>• {t('benefit2')}</li>
            <li>• {t('benefit3')}</li>
          </ul>
        </div>
      </div>

      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h3 className="font-medium text-gray-900 dark:text-white mb-2">{t('htmlOutput')}</h3>
        <pre className="text-xs text-gray-600 dark:text-gray-400 overflow-x-auto whitespace-pre-wrap break-all">
          {bionicHtml || t('noOutput')}
        </pre>
      </div>
    </div>
  );
}
