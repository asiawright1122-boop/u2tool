'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function UrlEncoder() {
  const t = useTranslations('tools');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const encode = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }
    setOutput(encodeURIComponent(input));
  };

  const decode = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }
    try {
      setOutput(decodeURIComponent(input));
    } catch (_e) {
      setOutput('Error: Invalid URL encoding');
    }
  };

  const copyOutput = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">{t('input')}</label>
        <textarea
          className="tool-textarea"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('inputPlaceholder')}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={encode} className="btn-primary">
          {t('url.encodeUrl')}
        </button>
        <button onClick={decode} className="btn-secondary">
          {t('url.decodeUrl')}
        </button>
        <button onClick={() => { setInput(''); setOutput(''); }} className="btn-secondary">
          {t('clear')}
        </button>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium">{t('output')}</label>
          {output && (
            <button
              onClick={copyOutput}
              className={`text-sm px-3 py-1 rounded ${copied ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
              {copied ? t('copied') : t('copy')}
            </button>
          )}
        </div>
        <textarea
          className="tool-textarea"
          value={output}
          readOnly
          placeholder={t('outputPlaceholder')}
        />
      </div>
    </div>
  );
}
