'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface JwtPayload {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
}

export default function JwtDecoder() {
  const t = useTranslations('tools');
  const tj = useTranslations('tools.jwt-decoder');
  const [input, setInput] = useState('');
  const [decoded, setDecoded] = useState<JwtPayload | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');

  const decodeJwt = () => {
    if (!input.trim()) {
      setError(tj('enterToken'));
      setDecoded(null);
      return;
    }
    try {
      const parts = input.trim().split('.');
      if (parts.length !== 3) {
        throw new Error(tj('invalidFormat'));
      }

      const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      
      setDecoded({ header, payload, signature: parts[2] });
      setError('');
    } catch (_e) {
      setError(tj('invalidToken'));
      setDecoded(null);
    }
  };

  const copySection = async (section: string, content: string) => {
    await navigator.clipboard.writeText(content);
    setCopied(section);
    setTimeout(() => setCopied(''), 2000);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">{t('input')} (JWT Token)</label>
        <textarea
          className="tool-textarea"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
          rows={4}
        />
      </div>

      <button onClick={decodeJwt} className="btn-primary">
        {t('decode')}
      </button>

      {error && (
        <div className="p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}

      {decoded && (
        <div className="space-y-4">
          {/* Header */}
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="flex justify-between items-center px-4 py-2 bg-blue-900/30 border-b border-gray-700">
              <span className="font-medium text-blue-400">{tj('header')}</span>
              <button
                onClick={() => copySection('header', JSON.stringify(decoded.header, null, 2))}
                className="text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded"
              >
                {copied === 'header' ? t('copied') : t('copy')}
              </button>
            </div>
            <pre className="p-4 text-sm overflow-x-auto">
              {JSON.stringify(decoded.header, null, 2)}
            </pre>
          </div>

          {/* Payload */}
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="flex justify-between items-center px-4 py-2 bg-purple-900/30 border-b border-gray-700">
              <span className="font-medium text-purple-400">{tj('payload')}</span>
              <button
                onClick={() => copySection('payload', JSON.stringify(decoded.payload, null, 2))}
                className="text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded"
              >
                {copied === 'payload' ? t('copied') : t('copy')}
              </button>
            </div>
            <pre className="p-4 text-sm overflow-x-auto">
              {JSON.stringify(decoded.payload, null, 2)}
            </pre>
            {/* Show formatted dates for common claims */}
            {(decoded.payload.exp !== undefined || decoded.payload.iat !== undefined || decoded.payload.nbf !== undefined) && (
              <div className="px-4 pb-4 text-xs text-gray-300 space-y-1 border-t border-gray-700 pt-3">
                {decoded.payload.iat !== undefined && (
                  <div>{tj('issuedAt')}: {formatDate(Number(decoded.payload.iat))}</div>
                )}
                {decoded.payload.exp !== undefined && (
                  <div>{tj('expires')}: {formatDate(Number(decoded.payload.exp))}</div>
                )}
                {decoded.payload.nbf !== undefined && (
                  <div>{tj('notBefore')}: {formatDate(Number(decoded.payload.nbf))}</div>
                )}
              </div>
            )}
          </div>

          {/* Signature */}
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="flex justify-between items-center px-4 py-2 bg-green-900/30 border-b border-gray-700">
              <span className="font-medium text-green-400">{tj('signature')}</span>
              <button
                onClick={() => copySection('signature', decoded.signature)}
                className="text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded"
              >
                {copied === 'signature' ? t('copied') : t('copy')}
              </button>
            </div>
            <div className="p-4 text-sm text-gray-300 break-all">
              {decoded.signature}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
