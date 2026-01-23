'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function SriHashGenerator() {
  const t = useTranslations('tools.sri-hash-generator');
  const [input, setInput] = useState('');
  const [inputType, setInputType] = useState<'url' | 'content'>('url');
  const [algorithm, setAlgorithm] = useState<'sha256' | 'sha384' | 'sha512'>('sha384');
  const [hash, setHash] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const generateHash = async (content: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    
    const hashBuffer = await crypto.subtle.digest(
      algorithm === 'sha256' ? 'SHA-256' : algorithm === 'sha384' ? 'SHA-384' : 'SHA-512',
      data
    );
    
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const base64Hash = btoa(String.fromCharCode(...hashArray));
    
    return `${algorithm}-${base64Hash}`;
  };

  const generate = async () => {
    setError('');
    setHash('');
    setLoading(true);

    try {
      let content = input;

      if (inputType === 'url') {
        if (!input.trim()) {
          setError(t('errors.noUrl'));
          return;
        }

        try {
          const response = await fetch(input);
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }
          content = await response.text();
        } catch (e) {
          setError(t('errors.fetchFailed', { error: (e as Error).message }));
          return;
        }
      } else {
        if (!input.trim()) {
          setError(t('errors.noContent'));
          return;
        }
      }

      const sriHash = await generateHash(content);
      setHash(sriHash);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000);
  };

  const getScriptTag = (): string => {
    if (!hash) return '';
    const url = inputType === 'url' ? input : 'your-script.js';
    return `<script src="${url}" integrity="${hash}" crossorigin="anonymous"></script>`;
  };

  const getLinkTag = (): string => {
    if (!hash) return '';
    const url = inputType === 'url' ? input : 'your-style.css';
    return `<link rel="stylesheet" href="${url}" integrity="${hash}" crossorigin="anonymous">`;
  };

  const loadExample = () => {
    setInputType('url');
    setInput('https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css');
  };

  useEffect(() => {

    return () => {

      if (timerRef.current) clearTimeout(timerRef.current);

    };

  }, []);


  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="inputType"
                checked={inputType === 'url'}
                onChange={() => setInputType('url')}
                className="text-blue-600"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{t('fromUrl')}</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="inputType"
                checked={inputType === 'content'}
                onChange={() => setInputType('content')}
                className="text-blue-600"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{t('fromContent')}</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {inputType === 'url' ? t('urlInput') : t('contentInput')}
            </label>
            {inputType === 'url' ? (
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('urlPlaceholder')}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono"
              />
            ) : (
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('contentPlaceholder')}
                className="w-full h-48 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm"
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('algorithm')}
            </label>
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value as 'sha256' | 'sha384' | 'sha512')}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="sha256">SHA-256</option>
              <option value="sha384">SHA-384 ({t('recommended')})</option>
              <option value="sha512">SHA-512</option>
            </select>
          </div>

          <div className="flex gap-4">
            <button
              onClick={generate}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
            >
              {loading ? t('generating') : t('generate')}
            </button>
            <button
              onClick={loadExample}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
            >
              {t('loadExample')}
            </button>
          </div>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
              {error}
            </div>
          )}
        </div>

        {hash && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('sriHash')}
                </label>
                <button
                  onClick={() => copyToClipboard(hash, 'hash')}
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  {copied === 'hash' ? t('copied') : t('copy')}
                </button>
              </div>
              <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <code className="text-sm font-mono text-gray-900 dark:text-white break-all">
                  {hash}
                </code>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('scriptTag')}
                </label>
                <button
                  onClick={() => copyToClipboard(getScriptTag(), 'script')}
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  {copied === 'script' ? t('copied') : t('copy')}
                </button>
              </div>
              <div className="p-4 bg-gray-900 rounded-lg">
                <code className="text-sm font-mono text-green-400 break-all">
                  {getScriptTag()}
                </code>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('linkTag')}
                </label>
                <button
                  onClick={() => copyToClipboard(getLinkTag(), 'link')}
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  {copied === 'link' ? t('copied') : t('copy')}
                </button>
              </div>
              <div className="p-4 bg-gray-900 rounded-lg">
                <code className="text-sm font-mono text-green-400 break-all">
                  {getLinkTag()}
                </code>
              </div>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                {t('whatIsSri')}
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                {t('sriExplanation')}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
