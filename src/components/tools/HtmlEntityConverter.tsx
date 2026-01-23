'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function HtmlEntityConverter() {
  const t = useTranslations('tools');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const entities: Record<string, string> = {
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;',
    '©': '&copy;', '®': '&reg;', '™': '&trade;', '€': '&euro;', '£': '&pound;',
    '¥': '&yen;', '¢': '&cent;', '§': '&sect;', '°': '&deg;', '±': '&plusmn;',
    '×': '&times;', '÷': '&divide;', '≠': '&ne;', '≤': '&le;', '≥': '&ge;',
    '∞': '&infin;', '←': '&larr;', '→': '&rarr;', '↑': '&uarr;', '↓': '&darr;',
    '♠': '&spades;', '♣': '&clubs;', '♥': '&hearts;', '♦': '&diams;',
    ' ': '&nbsp;', '—': '&mdash;', '–': '&ndash;', '…': '&hellip;'
  };

  const reverseEntities = Object.fromEntries(Object.entries(entities).map(([k, v]) => [v, k]));

  const convert = () => {
    if (mode === 'encode') {
      let result = input;
      for (const [char, entity] of Object.entries(entities)) {
        result = result.split(char).join(entity);
      }
      setOutput(result);
    } else {
      let result = input;
      for (const [entity, char] of Object.entries(reverseEntities)) {
        result = result.split(entity).join(char);
      }
      result = result.replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code)));
      result = result.replace(/&#x([0-9a-fA-F]+);/g, (_, code) => String.fromCharCode(parseInt(code, 16)));
      setOutput(result);
    }
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
      <div className="flex gap-2">
        <button onClick={() => setMode('encode')} className={`px-4 py-2 rounded ${mode === 'encode' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'}`}>{t('encode')}</button>
        <button onClick={() => setMode('decode')} className={`px-4 py-2 rounded ${mode === 'decode' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'}`}>{t('decode')}</button>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="tool-label">{t('input')}</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} className="tool-textarea" placeholder={mode === 'encode' ? '<div>Hello & World</div>' : '&lt;div&gt;Hello &amp; World&lt;/div&gt;'} />
        </div>
        <div>
          <label className="tool-label">{t('output')}</label>
          <textarea value={output} readOnly className="tool-textarea" />
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={convert} className="btn-primary">{t('convert')}</button>
        <button onClick={copy} className="btn-secondary">{copied ? t('copied') : t('copy')}</button>
      </div>
      <div className="tool-panel">
        <h3 className="font-medium mb-2 text-gray-900 dark:text-white">{t('htmlEntity.common')}</h3>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2 text-sm">
          {Object.entries(entities).slice(0, 24).map(([char, entity]) => (
            <div key={entity} className="bg-gray-200 dark:bg-gray-700 rounded p-2 text-center">
              <span className="text-lg text-gray-900 dark:text-white">{char}</span>
              <p className="text-xs text-gray-600 dark:text-gray-300 truncate">{entity}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
