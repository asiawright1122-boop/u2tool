'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function HexEditor() {
  const t = useTranslations('tools');
  const [text, setText] = useState('');
  const [hex, setHex] = useState('');
  const [copied, setCopied] = useState(false);

  const textToHex = () => {
    const result = Array.from(new TextEncoder().encode(text))
      .map(b => b.toString(16).padStart(2, '0').toUpperCase())
      .join(' ');
    setHex(result);
  };

  const hexToText = () => {
    try {
      const bytes = hex.replace(/\s+/g, '').match(/.{1,2}/g) || [];
      const result = new TextDecoder().decode(new Uint8Array(bytes.map(b => parseInt(b, 16))));
      setText(result);
    } catch { setText('Error'); }
  };

  const copy = async (val: string) => {
    await navigator.clipboard.writeText(val);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">{t('hexEditor.text')}</label>
          <textarea value={text} onChange={(e) => setText(e.target.value)} className="w-full h-40 p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg font-mono text-sm text-gray-900 dark:text-white" placeholder={t('inputPlaceholder')} />
          <div className="flex gap-2 mt-2">
            <button onClick={textToHex} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{t('hexEditor.toHex')}</button>
            <button onClick={() => copy(text)} className="px-3 py-2 bg-gray-500 dark:bg-gray-600 text-white rounded hover:bg-gray-600 dark:hover:bg-gray-700">{copied ? t('copied') : t('copy')}</button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">{t('hexEditor.hex')}</label>
          <textarea value={hex} onChange={(e) => setHex(e.target.value)} className="w-full h-40 p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg font-mono text-sm text-gray-900 dark:text-white" placeholder="48 65 6C 6C 6F" />
          <div className="flex gap-2 mt-2">
            <button onClick={hexToText} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">{t('hexEditor.toText')}</button>
            <button onClick={() => copy(hex)} className="px-3 py-2 bg-gray-500 dark:bg-gray-600 text-white rounded hover:bg-gray-600 dark:hover:bg-gray-700">{copied ? t('copied') : t('copy')}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
