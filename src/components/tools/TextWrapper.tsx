'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function TextWrapper() {
  const t = useTranslations('tools');
  const [text, setText] = useState('');
  const [width, setWidth] = useState(80);
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const wrap = () => {
    const words = text.split(/\s+/);
    const lines: string[] = [];
    let currentLine = '';
    
    for (const word of words) {
      if (currentLine.length + word.length + 1 <= width) {
        currentLine += (currentLine ? ' ' : '') + word;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) lines.push(currentLine);
    setOutput(lines.join('\n'));
  };

  const copy = async () => {
    await navigator.clipboard.writeText(output);
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
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label className="text-sm text-gray-700 dark:text-white">{t('textWrapper.width')}:</label>
        <input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} min={20} max={200} className="w-24 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-gray-900 dark:text-white" />
        <span className="text-gray-600 dark:text-gray-300">{t('textWrapper.chars')}</span>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">{t('input')}</label>
          <textarea value={text} onChange={(e) => setText(e.target.value)} className="w-full h-48 p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white" placeholder={t('textWrapper.placeholder')} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">{t('output')}</label>
          <textarea value={output} readOnly className="w-full h-48 p-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg font-mono text-gray-900 dark:text-white" />
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={wrap} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{t('textWrapper.wrap')}</button>
        <button onClick={copy} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-700">{copied ? t('copied') : t('copy')}</button>
      </div>
    </div>
  );
}
