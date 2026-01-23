'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

type StyleType = 'strikethrough' | 'underline' | 'crosshatch' | 'slash';

export default function StrikethroughText() {
  const t = useTranslations('tools.strikethrough-text');
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const applyStyle = (text: string, style: StyleType): string => {
    const chars: Record<StyleType, string> = {
      strikethrough: '\u0336',
      underline: '\u0332',
      crosshatch: '\u0337',
      slash: '\u0338',
    };
    return text.split('').map(char => char + chars[style]).join('');
  };

  const copyToClipboard = (text: string, style: string) => {
    navigator.clipboard.writeText(text);
    setCopied(style);
    setTimeout(() => setCopied(null), 2000);
  };

  const styles: { type: StyleType; label: string; example: string }[] = [
    { type: 'strikethrough', label: t('strikethrough'), example: 'S̶t̶r̶i̶k̶e̶' },
    { type: 'underline', label: t('underline'), example: 'U̲n̲d̲e̲r̲' },
    { type: 'crosshatch', label: t('crosshatch'), example: 'C̷r̷o̷s̷s̷' },
    { type: 'slash', label: t('slash'), example: 'S̸l̸a̸s̸h̸' },
  ];

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
          className="w-full h-32 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {styles.map(({ type, label, example }) => (
          <div key={type} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="font-medium text-gray-900 dark:text-white">{label}</span>
                <span className="ml-2 text-gray-500 dark:text-gray-400">({example})</span>
              </div>
              <button
                onClick={() => copyToClipboard(applyStyle(input, type), type)}
                disabled={!input}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {copied === type ? t('copied') : t('copy')}
              </button>
            </div>
            <div className="text-lg text-gray-900 dark:text-white break-all min-h-[2rem] p-3 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
              {input ? applyStyle(input, type) : <span className="text-gray-400">{t('outputPlaceholder')}</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
        <h3 className="font-medium text-yellow-800 dark:text-yellow-300 mb-2">{t('usageTitle')}</h3>
        <ul className="text-sm text-yellow-700 dark:text-yellow-400 space-y-1">
          <li>• {t('usage1')}</li>
          <li>• {t('usage2')}</li>
          <li>• {t('usage3')}</li>
        </ul>
      </div>
    </div>
  );
}
