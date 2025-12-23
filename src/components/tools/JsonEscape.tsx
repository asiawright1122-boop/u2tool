'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function JsonEscape() {
  const t = useTranslations('tools');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const escapeJson = () => {
    try {
      const escaped = JSON.stringify(input);
      setOutput(escaped);
    } catch {
      setOutput(t('errorProcessing'));
    }
  };

  const unescapeJson = () => {
    try {
      const unescaped = JSON.parse(input);
      setOutput(typeof unescaped === 'string' ? unescaped : JSON.stringify(unescaped, null, 2));
    } catch {
      setOutput(t('errorProcessing'));
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">{t('input')}</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('jsonEscape.placeholder')}
          className="w-full h-40 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white font-mono text-sm focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-3">
        <button onClick={escapeJson} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium">
          {t('jsonEscape.escape')}
        </button>
        <button onClick={unescapeJson} className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium">
          {t('jsonEscape.unescape')}
        </button>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-300">{t('output')}</label>
          <button
            onClick={copyToClipboard}
            disabled={!output}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 rounded text-sm"
          >
            {copied ? t('copied') : t('copy')}
          </button>
        </div>
        <textarea
          value={output}
          readOnly
          className="w-full h-40 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white font-mono text-sm"
        />
      </div>
    </div>
  );
}
