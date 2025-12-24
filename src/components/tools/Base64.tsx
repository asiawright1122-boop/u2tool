'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function Base64() {
  const t = useTranslations('tools.base64');
  const tg = useTranslations('tools');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const encode = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }
    try {
      setOutput(btoa(unescape(encodeURIComponent(input))));
    } catch (_e) {
      setOutput(tg('errorEncoding'));
    }
  };

  const decode = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }
    try {
      setOutput(decodeURIComponent(escape(atob(input))));
    } catch (_e) {
      setOutput(tg('errorInvalidBase64'));
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
        <label className="block text-sm font-medium text-gray-300 mb-2">{tg('input')}</label>
        <textarea
          className="tool-textarea"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('inputPlaceholder')}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={encode} className="btn-primary">
          {t('encodeToBase64')}
        </button>
        <button onClick={decode} className="btn-secondary">
          {t('decodeFromBase64')}
        </button>
        <button onClick={() => { setInput(''); setOutput(''); }} className="btn-secondary">
          {tg('clear')}
        </button>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-300">{tg('output')}</label>
          {output && (
            <button
              onClick={copyOutput}
              className={`text-sm px-3 py-1 rounded ${copied ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
              {copied ? tg('copied') : tg('copy')}
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
