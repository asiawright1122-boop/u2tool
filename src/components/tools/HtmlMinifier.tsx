'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function HtmlMinifier() {
  const t = useTranslations('tools');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const minifyHtml = () => {
    try {
      const result = input
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/\s+/g, ' ')
        .replace(/>\s+</g, '><')
        .replace(/\s+>/g, '>')
        .replace(/<\s+/g, '<')
        .trim();
      setOutput(result);
    } catch {
      setOutput(t('error'));
    }
  };

  const beautifyHtml = () => {
    try {
      const result = input.replace(/></g, '>\n<');
      const lines = result.split('\n');
      let indent = 0;
      const formatted = lines.map(line => {
        line = line.trim();
        if (line.match(/^<\/\w/)) indent--;
        const spaces = '  '.repeat(Math.max(0, indent));
        if (line.match(/^<\w[^>]*[^/]>.*$/)) indent++;
        return spaces + line;
      });
      setOutput(formatted.join('\n'));
    } catch {
      setOutput(t('error'));
    }
  };

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <button onClick={minifyHtml} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{t('minify')}</button>
        <button onClick={beautifyHtml} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">{t('beautify')}</button>
        <button onClick={copy} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-700">{copied ? t('copied') : t('copy')}</button>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">{t('input')}</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} className="w-full h-64 p-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg font-mono text-sm text-gray-900 dark:text-gray-100" placeholder="<html>..." />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">{t('output')}</label>
          <textarea value={output} readOnly className="w-full h-64 p-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg font-mono text-sm text-gray-900 dark:text-gray-100" />
        </div>
      </div>
    </div>
  );
}
