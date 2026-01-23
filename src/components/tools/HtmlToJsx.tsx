'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function HtmlToJsx() {
  const t = useTranslations('tools.html-to-jsx');
  const [html, setHtml] = useState('');
  const [jsx, setJsx] = useState('');
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const convert = () => {
    let result = html
      .replace(/class=/g, 'className=')
      .replace(/for=/g, 'htmlFor=')
      .replace(/tabindex=/g, 'tabIndex=')
      .replace(/readonly/g, 'readOnly')
      .replace(/maxlength=/g, 'maxLength=')
      .replace(/cellpadding=/g, 'cellPadding=')
      .replace(/cellspacing=/g, 'cellSpacing=')
      .replace(/colspan=/g, 'colSpan=')
      .replace(/rowspan=/g, 'rowSpan=')
      .replace(/frameborder=/g, 'frameBorder=')
      .replace(/allowfullscreen/g, 'allowFullScreen')
      .replace(/autocomplete=/g, 'autoComplete=')
      .replace(/autofocus/g, 'autoFocus')
      .replace(/<!--[\s\S]*?-->/g, '{/* $& */}')
      .replace(/style="([^"]*)"/g, (_, styles) => {
        const obj = styles.split(';').filter(Boolean).map((s: string) => {
          const [key, val] = s.split(':').map((x: string) => x.trim());
          const camelKey = key.replace(/-([a-z])/g, (_: string, c: string) => c.toUpperCase());
          return `${camelKey}: '${val}'`;
        }).join(', ');
        return `style={{${obj}}}`;
      });
    // Self-closing tags
    result = result.replace(/<(img|input|br|hr|meta|link)([^>]*)>/gi, '<$1$2 />');
    setJsx(result);
  };

  const copy = async () => {
    await navigator.clipboard.writeText(jsx);
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
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">{t('htmlInput')}</label>
          <textarea value={html} onChange={(e) => setHtml(e.target.value)} className="w-full h-64 p-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg font-mono text-sm text-gray-900 dark:text-white" placeholder={t('placeholder')} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">{t('jsxOutput')}</label>
          <textarea value={jsx} readOnly className="w-full h-64 p-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg font-mono text-sm text-gray-900 dark:text-white" />
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={convert} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{t('convert')}</button>
        <button onClick={copy} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-700">{copied ? t('copy') : t('copy')}</button>
      </div>
    </div>
  );
}
