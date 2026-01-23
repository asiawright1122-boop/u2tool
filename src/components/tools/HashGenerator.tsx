'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function HashGenerator() {
  const t = useTranslations('tools');
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const generateHashes = async () => {
    if (!input.trim()) {
      setHashes({});
      return;
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(input);

    const algorithms = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'];
    const results: Record<string, string> = {};

    for (const algo of algorithms) {
      const hashBuffer = await crypto.subtle.digest(algo, data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      results[algo] = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // MD5 is not available in Web Crypto API, so we'll skip it or use a simple implementation
    setHashes(results);
  };

  const copyHash = async (algo: string, hash: string) => {
    await navigator.clipboard.writeText(hash);
    setCopied(algo);
    setTimeout(() => setCopied(''), 2000);
  };

  useEffect(() => {

    return () => {

      if (timerRef.current) clearTimeout(timerRef.current);

    };

  }, []);


  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">{t('input')}</label>
        <textarea
          className="tool-textarea"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('inputPlaceholder')}
        />
      </div>

      <button onClick={generateHashes} className="btn-primary">
        {t('hash.generateHashes')}
      </button>

      {Object.keys(hashes).length > 0 && (
        <div className="space-y-3">
          {Object.entries(hashes).map(([algo, hash]) => (
            <div key={algo} className="p-3 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{algo}</span>
                <button
                  onClick={() => copyHash(algo, hash)}
                  className={`text-xs px-2 py-1 rounded ${
                    copied === algo ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100'
                  }`}
                >
                  {copied === algo ? t('copied') : t('copy')}
                </button>
              </div>
              <div className="font-mono text-xs break-all text-gray-700 dark:text-gray-300 select-all">
                {hash}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
