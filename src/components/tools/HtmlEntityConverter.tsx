'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function HtmlEntityConverter() {
  const t = useTranslations('tools');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState(false);

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
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => setMode('encode')} className={`px-4 py-2 rounded ${mode === 'encode' ? 'bg-blue-600' : 'bg-gray-700'}`}>{t('encode')}</button>
        <button onClick={() => setMode('decode')} className={`px-4 py-2 rounded ${mode === 'decode' ? 'bg-blue-600' : 'bg-gray-700'}`}>{t('decode')}</button>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">{t('input')}</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} className="w-full h-48 p-3 bg-gray-800 border border-gray-700 rounded-lg font-mono text-sm" placeholder={mode === 'encode' ? '<div>Hello & World</div>' : '&lt;div&gt;Hello &amp; World&lt;/div&gt;'} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">{t('output')}</label>
          <textarea value={output} readOnly className="w-full h-48 p-3 bg-gray-800 border border-gray-700 rounded-lg font-mono text-sm" />
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={convert} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{t('convert')}</button>
        <button onClick={copy} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">{copied ? t('copied') : t('copy')}</button>
      </div>
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="font-medium mb-2">{t('htmlEntity.common')}</h3>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2 text-sm">
          {Object.entries(entities).slice(0, 24).map(([char, entity]) => (
            <div key={entity} className="bg-gray-700 rounded p-2 text-center">
              <span className="text-lg">{char}</span>
              <p className="text-xs text-gray-300 truncate">{entity}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
