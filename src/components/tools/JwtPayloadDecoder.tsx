'use client';

import { useState, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface DecodedJwt {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
  isExpired?: boolean;
  expiresAt?: Date;
  issuedAt?: Date;
}

function base64UrlDecode(str: string): string {
  // Replace URL-safe characters
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  // Pad with '=' if necessary
  const pad = base64.length % 4;
  if (pad) {
    base64 += '='.repeat(4 - pad);
  }
  return atob(base64);
}

function decodeJwt(token: string): DecodedJwt | null {
  try {
    const parts = token.trim().split('.');
    if (parts.length !== 3) {
      return null;
    }

    const header = JSON.parse(base64UrlDecode(parts[0]));
    const payload = JSON.parse(base64UrlDecode(parts[1]));
    const signature = parts[2];

    const result: DecodedJwt = {
      header,
      payload,
      signature,
    };

    // Check expiration
    if (payload.exp) {
      const expDate = new Date(payload.exp * 1000);
      result.expiresAt = expDate;
      result.isExpired = expDate < new Date();
    }

    // Check issued at
    if (payload.iat) {
      result.issuedAt = new Date(payload.iat * 1000);
    }

    return result;
  } catch {
    return null;
  }
}

function formatDate(date: Date): string {
  return date.toLocaleString();
}

function formatJson(obj: Record<string, unknown>): string {
  return JSON.stringify(obj, null, 2);
}

export default function JwtPayloadDecoder() {
  const t = useTranslations('tools');
  const [token, setToken] = useState('');
  const [decoded, setDecoded] = useState<DecodedJwt | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const handleDecode = useCallback(() => {
    if (!token.trim()) {
      setError(t('errorInvalidInput'));
      setDecoded(null);
      return;
    }

    const result = decodeJwt(token);
    if (result) {
      setDecoded(result);
      setError('');
    } else {
      setError(t('errorInvalidFormat'));
      setDecoded(null);
    }
  }, [token, t]);

  // Auto-decode on paste
  useEffect(() => {
    if (token.trim() && token.includes('.')) {
      handleDecode();
    }
  }, [token, handleDecode]);

  const handleCopy = useCallback((text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  }, []);

  const handleClear = useCallback(() => {
    setToken('');
    setDecoded(null);
    setError('');
  }, []);

  const exampleToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE5MTYyMzkwMjIsInJvbGUiOiJhZG1pbiJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            JWT Token
          </label>
          <button
            onClick={() => setToken(exampleToken)}
            className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            {t('sql.loadExample')}
          </button>
        </div>
        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
          className="w-full h-32 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm resize-none"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={handleDecode}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          {t('decode')}
        </button>
        <button
          onClick={handleClear}
          className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
        >
          {t('clear')}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Decoded Result */}
      {decoded && (
        <div className="space-y-6">
          {/* Status */}
          {decoded.expiresAt && (
            <div className={`p-4 rounded-lg ${
              decoded.isExpired 
                ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' 
                : 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
            }`}>
              <div className="flex items-center gap-2">
                <span className={`text-lg ${decoded.isExpired ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                  {decoded.isExpired ? '⚠️ Token Expired' : '✓ Token Valid'}
                </span>
              </div>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                <p>Expires: {formatDate(decoded.expiresAt)}</p>
                {decoded.issuedAt && <p>Issued: {formatDate(decoded.issuedAt)}</p>}
              </div>
            </div>
          )}

          {/* Header */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Header
              </h3>
              <button
                onClick={() => handleCopy(formatJson(decoded.header), 'header')}
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                {copied === 'header' ? t('copied') : t('copy')}
              </button>
            </div>
            <pre className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-x-auto text-sm font-mono text-gray-800 dark:text-gray-200">
              {formatJson(decoded.header)}
            </pre>
          </div>

          {/* Payload */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Payload
              </h3>
              <button
                onClick={() => handleCopy(formatJson(decoded.payload), 'payload')}
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                {copied === 'payload' ? t('copied') : t('copy')}
              </button>
            </div>
            <pre className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-x-auto text-sm font-mono text-gray-800 dark:text-gray-200">
              {formatJson(decoded.payload)}
            </pre>
          </div>

          {/* Claims Table */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {t('jwt.commonClaims')}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700">
                    <th className="px-4 py-2 text-left font-medium text-gray-700 dark:text-gray-300">Claim</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700 dark:text-gray-300">Value</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700 dark:text-gray-300">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {Object.entries(decoded.payload).map(([key, value]) => (
                    <tr key={key} className="bg-white dark:bg-gray-800">
                      <td className="px-4 py-2 font-mono text-blue-600 dark:text-blue-400">{key}</td>
                      <td className="px-4 py-2 font-mono text-gray-900 dark:text-white break-all max-w-xs">
                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                      </td>
                      <td className="px-4 py-2 text-gray-600 dark:text-gray-400">
                        {key === 'iss' && t('jwt.claims.iss')}
                        {key === 'sub' && t('jwt.claims.sub')}
                        {key === 'aud' && t('jwt.claims.aud')}
                        {key === 'exp' && t('jwt.claims.exp')}
                        {key === 'nbf' && t('jwt.claims.nbf')}
                        {key === 'iat' && t('jwt.claims.iat')}
                        {key === 'jti' && t('jwt.claims.jti')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Signature */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Signature
            </h3>
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <code className="text-sm font-mono text-gray-800 dark:text-gray-200 break-all">
                {decoded.signature}
              </code>
            </div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              ⚠️ Signature verification requires the secret key and is not performed client-side.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
