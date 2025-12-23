'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function TextWrapper() {
  const t = useTranslations('tools');
  const [text, setText] = useState('');
  const [width, setWidth] = useState(80);
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

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
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label className="text-sm">{t('textWrapper.width')}:</label>
        <input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} min={20} max={200} className="w-24 px-3 py-2 bg-gray-800 border border-gray-700 rounded" />
        <span className="text-gray-300">{t('textWrapper.chars')}</span>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">{t('input')}</label>
          <textarea value={text} onChange={(e) => setText(e.target.value)} className="w-full h-48 p-3 bg-gray-800 border border-gray-700 rounded-lg" placeholder={t('textWrapper.placeholder')} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">{t('output')}</label>
          <textarea value={output} readOnly className="w-full h-48 p-3 bg-gray-800 border border-gray-700 rounded-lg font-mono" />
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={wrap} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{t('textWrapper.wrap')}</button>
        <button onClick={copy} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">{copied ? t('copied') : t('copy')}</button>
      </div>
    </div>
  );
}
