'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';

interface JwtParts {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
}

export default function JwtDebugger() {
  const t = useTranslations('tools.jwt-debugger');
  const [token, setToken] = useState('');
  const [decoded, setDecoded] = useState<JwtParts | null>(null);
  const [error, setError] = useState('');
  const [secret, setSecret] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [copied, setCopied] = useState('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const base64UrlDecode = (str: string): string => {
    const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    const padding = '='.repeat((4 - (base64.length % 4)) % 4);
    return atob(base64 + padding);
  };

  const decodeToken = (jwt: string) => {
    setError('');
    setDecoded(null);
    setIsValid(null);

    if (!jwt.trim()) {
      return;
    }

    const parts = jwt.split('.');
    if (parts.length !== 3) {
      setError(t('errors.invalidFormat'));
      return;
    }

    try {
      const header = JSON.parse(base64UrlDecode(parts[0]));
      const payload = JSON.parse(base64UrlDecode(parts[1]));
      const signature = parts[2];

      setDecoded({ header, payload, signature });
    } catch {
      setError(t('errors.decodeFailed'));
    }
  };

  useEffect(() => {
    decodeToken(token);
  }, [token]);

  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  const isExpired = (payload: Record<string, unknown>): boolean => {
    if (typeof payload.exp === 'number') {
      return Date.now() > payload.exp * 1000;
    }
    return false;
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000);
  };

  const loadExample = () => {
    // Example JWT (expired, for demo purposes)
    setToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyNDI2MjIsInJvbGUiOiJhZG1pbiJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c');
  };

  const renderValue = (key: string, value: unknown) => {
    if ((key === 'exp' || key === 'iat' || key === 'nbf') && typeof value === 'number') {
      useEffect(() => {
        return () => {
          if (timerRef.current) clearTimeout(timerRef.current);
        };
      }, []);

      return (
        <span>
          {value} <span className="text-gray-500">({formatTimestamp(value)})</span>
        </span>
      );
    }
    return JSON.stringify(value);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('tokenInput')}
        </label>
        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder={t('placeholder')}
          className="w-full h-32 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm break-all"
        />
        <button
          onClick={loadExample}
          className="mt-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          {t('loadExample')}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {decoded && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {t('header')}
                </h3>
                <button
                  onClick={() => copyToClipboard(JSON.stringify(decoded.header, null, 2), 'header')}
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  {copied === 'header' ? t('copied') : t('copy')}
                </button>
              </div>
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <pre className="text-sm font-mono text-red-700 dark:text-red-300 overflow-x-auto">
                  {JSON.stringify(decoded.header, null, 2)}
                </pre>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {t('payload')}
                </h3>
                <button
                  onClick={() => copyToClipboard(JSON.stringify(decoded.payload, null, 2), 'payload')}
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  {copied === 'payload' ? t('copied') : t('copy')}
                </button>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                <pre className="text-sm font-mono text-purple-700 dark:text-purple-300 overflow-x-auto">
                  {JSON.stringify(decoded.payload, null, 2)}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {t('signature')}
              </h3>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <code className="text-sm font-mono text-blue-700 dark:text-blue-300 break-all">
                  {decoded.signature}
                </code>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {t('claims')}
              </h3>
              <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-100 dark:bg-gray-800">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('claim')}
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('value')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(decoded.payload).map(([key, value]) => (
                      <tr key={key} className="border-t border-gray-300 dark:border-gray-600">
                        <td className="px-4 py-2 text-sm font-mono text-gray-900 dark:text-white">
                          {key}
                        </td>
                        <td className="px-4 py-2 text-sm font-mono text-gray-600 dark:text-gray-400">
                          {renderValue(key, value)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {typeof decoded.payload.exp === 'number' && (
              <div className={`p-4 rounded-lg ${
                isExpired(decoded.payload)
                  ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                  : 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
              }`}>
                <div className="flex items-center gap-2">
                  <span className={`text-2xl ${isExpired(decoded.payload) ? 'text-red-500' : 'text-green-500'}`}>
                    {isExpired(decoded.payload) ? '⚠️' : '✓'}
                  </span>
                  <span className={`font-medium ${
                    isExpired(decoded.payload)
                      ? 'text-red-700 dark:text-red-300'
                      : 'text-green-700 dark:text-green-300'
                  }`}>
                    {isExpired(decoded.payload) ? t('expired') : t('notExpired')}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {t('expiresAt')}: {formatTimestamp(decoded.payload.exp)}
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('verifySignature')}
              </label>
              <input
                type="text"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                placeholder={t('secretPlaceholder')}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono"
              />
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {t('verifyNote')}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
