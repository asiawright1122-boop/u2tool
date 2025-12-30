'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';

export default function NumberFormatter() {
  const t = useTranslations('tools');
  const [number, setNumber] = useState('1234567.89');
  const [style, setStyle] = useState<'decimal' | 'currency' | 'percent'>('decimal');
  const [currency, setCurrency] = useState('USD');
  const [copied, setCopied] = useState('');

  const formats = useMemo(() => {
    const num = parseFloat(number);
    if (isNaN(num)) return [];
    const locales = ['en-US', 'zh-CN', 'ja-JP', 'de-DE', 'fr-FR', 'es-ES', 'pt-BR', 'ar-SA', 'hi-IN'];
    return locales.map(loc => {
      try {
        const formatted = new Intl.NumberFormat(loc, {
          style, currency: style === 'currency' ? currency : undefined,
          minimumFractionDigits: style === 'percent' ? 2 : undefined
        }).format(style === 'percent' ? num / 100 : num);
        return { locale: loc, formatted };
      } catch { return { locale: loc, formatted: 'Error' }; }
    });
  }, [number, style, currency]);

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(''), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">{t('numberFormat.number')}</label>
          <input type="text" value={number} onChange={(e) => setNumber(e.target.value)} className="w-full p-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg font-mono text-gray-900 dark:text-gray-100" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">{t('numberFormat.style')}</label>
          <select value={style} onChange={(e) => setStyle(e.target.value as typeof style)} className="w-full p-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100">
            <option value="decimal">{t('numberFormat.decimal')}</option>
            <option value="currency">{t('numberFormat.currency')}</option>
            <option value="percent">{t('numberFormat.percent')}</option>
          </select>
        </div>
        {style === 'currency' && (
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">{t('numberFormat.currencyCode')}</label>
            <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full p-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100">
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="JPY">JPY (¥)</option>
              <option value="CNY">CNY (¥)</option>
            </select>
          </div>
        )}
      </div>
      <div className="grid md:grid-cols-3 gap-3">
        {formats.map(({ locale, formatted }) => (
          <div key={locale} onClick={() => copy(formatted)} className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">{locale}</p>
            <p className="text-lg font-mono text-gray-900 dark:text-gray-100">{formatted}</p>
            {copied === formatted && <span className="text-xs text-green-600 dark:text-green-400">{t('copied')}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
