'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function StringObfuscator() {
  const t = useTranslations('tools.string-obfuscator');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [method, setMethod] = useState('base64');

  const obfuscate = () => {
    if (!input) {
      setOutput('');
      return;
    }

    try {
      switch (method) {
        case 'base64':
          setOutput(btoa(input));
          break;
        case 'hex':
          setOutput(input.split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(''));
          break;
        case 'html':
          setOutput(input.split('').map(c => `&#${c.charCodeAt(0)};`).join(''));
          break;
        case 'url':
          setOutput(encodeURIComponent(input));
          break;
        case 'rot13':
          setOutput(input.replace(/[a-zA-Z]/g, (c) => {
            const base = c <= 'Z' ? 65 : 97;
            return String.fromCharCode(base + (c.charCodeAt(0) - base + 13) % 26);
          }));
          break;
        case 'reverse':
          setOutput(input.split('').reverse().join(''));
          break;
      }
    } catch (e) {
      setOutput(t('error'));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
        <label className="block text-sm font-medium text-gray-300 mb-2">{t('input')}</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={4}
          className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 font-mono"
          placeholder={t('inputPlaceholder')}
        />
      </div>

      <div className="flex flex-wrap gap-4">
        <button
          onClick={() => setMethod('base64')}
          className={`px-4 py-2 rounded-lg transition-colors ${method === 'base64' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
        >
          {t('methodBase64')}
        </button>
        <button
          onClick={() => setMethod('hex')}
          className={`px-4 py-2 rounded-lg transition-colors ${method === 'hex' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
        >
          {t('methodHex')}
        </button>
        <button
          onClick={() => setMethod('html')}
          className={`px-4 py-2 rounded-lg transition-colors ${method === 'html' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
        >
          {t('methodHtml')}
        </button>
        <button
          onClick={() => setMethod('url')}
          className={`px-4 py-2 rounded-lg transition-colors ${method === 'url' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
        >
          {t('methodUrl')}
        </button>
        <button
          onClick={() => setMethod('rot13')}
          className={`px-4 py-2 rounded-lg transition-colors ${method === 'rot13' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
        >
          {t('methodRot13')}
        </button>
        <button
          onClick={() => setMethod('reverse')}
          className={`px-4 py-2 rounded-lg transition-colors ${method === 'reverse' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
        >
          {t('methodReverse')}
        </button>
      </div>

      <div className="flex justify-center">
        <button
          onClick={obfuscate}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-lg shadow-blue-500/20"
        >
          {t('obfuscate')}
        </button>
      </div>

      {output && (
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-300">{t('result')} ({method})</label>
            <button
              onClick={() => navigator.clipboard.writeText(output)}
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              {t('copy')}
            </button>
          </div>
          <textarea
            readOnly
            value={output}
            rows={4}
            className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-green-400 font-mono"
          />
        </div>
      )}
    </div>
  );
}
