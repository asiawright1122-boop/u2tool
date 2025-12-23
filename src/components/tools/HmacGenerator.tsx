'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

type Algorithm = 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512';

export default function HmacGenerator() {
  const t = useTranslations('tools');
  const [message, setMessage] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [algorithm, setAlgorithm] = useState<Algorithm>('SHA-256');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  const generateHmac = async () => {
    if (!message || !secretKey) {
      setResult('');
      return;
    }

    try {
      const encoder = new TextEncoder();
      const keyData = encoder.encode(secretKey);
      const messageData = encoder.encode(message);

      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: algorithm },
        false,
        ['sign']
      );

      const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
      const hashArray = Array.from(new Uint8Array(signature));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      setResult(hashHex);
    } catch {
      setResult(t('hmac.error'));
    }
  };

  const copyResult = async () => {
    if (result) {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">{t('hmac.message')}</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t('hmac.messagePlaceholder')}
          className="w-full h-32 p-3 bg-gray-900 border border-gray-700 rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">{t('hmac.secretKey')}</label>
        <input
          type="text"
          value={secretKey}
          onChange={(e) => setSecretKey(e.target.value)}
          placeholder={t('hmac.keyPlaceholder')}
          className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">{t('hmac.algorithm')}</label>
        <select
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value as Algorithm)}
          className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="SHA-1">SHA-1</option>
          <option value="SHA-256">SHA-256</option>
          <option value="SHA-384">SHA-384</option>
          <option value="SHA-512">SHA-512</option>
        </select>
      </div>

      <button
        onClick={generateHmac}
        className="btn-primary w-full"
      >
        {t('generate')} HMAC
      </button>

      {result && (
        <div>
          <label className="block text-sm font-medium mb-2">{t('result')}</label>
          <div className="p-4 bg-gray-900 border border-gray-700 rounded-lg">
            <div className="flex items-start justify-between gap-4">
              <code className="font-mono text-sm break-all text-green-400">{result}</code>
              <button
                onClick={copyResult}
                className={`px-3 py-1 rounded text-sm whitespace-nowrap ${
                  copied ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {copied ? t('copied') : t('copy')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
