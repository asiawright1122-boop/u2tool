'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

function base64UrlEncode(str: string): string {
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export default function JwtGenerator() {
  const t = useTranslations('tools');
  const [algorithm, setAlgorithm] = useState('HS256');
  const [secret, setSecret] = useState('your-256-bit-secret');
  const [payload, setPayload] = useState(JSON.stringify({
    sub: '1234567890',
    name: 'John Doe',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600
  }, null, 2));
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const generateToken = async () => {
    try {
      const parsedPayload = JSON.parse(payload);
      
      const header = { alg: algorithm, typ: 'JWT' };
      const encodedHeader = base64UrlEncode(JSON.stringify(header));
      const encodedPayload = base64UrlEncode(JSON.stringify(parsedPayload));
      
      // For demo purposes, create a simple signature
      // In production, use proper crypto libraries
      const data = `${encodedHeader}.${encodedPayload}`;
      
      // Simple HMAC simulation (not cryptographically secure - for demo only)
      const encoder = new TextEncoder();
      const keyData = encoder.encode(secret);
      const messageData = encoder.encode(data);
      
      const key = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      );
      
      const signature = await crypto.subtle.sign('HMAC', key, messageData);
      const encodedSignature = base64UrlEncode(
        String.fromCharCode(...new Uint8Array(signature))
      );
      
      setToken(`${data}.${encodedSignature}`);
      setError('');
    } catch (e: unknown) {
      if (e instanceof SyntaxError) {
        setError(t('jwt.invalidPayload'));
      } else {
        setError(t('jwt.error'));
      }
      setToken('');
    }
  };

  const copyToken = async () => {
    await navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const addClaim = (claim: string) => {
    try {
      const parsed = JSON.parse(payload);
      const now = Math.floor(Date.now() / 1000);
      
      switch (claim) {
        case 'iat':
          parsed.iat = now;
          break;
        case 'exp':
          parsed.exp = now + 3600;
          break;
        case 'nbf':
          parsed.nbf = now;
          break;
        case 'jti':
          parsed.jti = crypto.randomUUID();
          break;
      }
      
      setPayload(JSON.stringify(parsed, null, 2));
    } catch (_e) {
      // ignore
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">{t('jwt.algorithm')}</label>
          <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)} className="tool-input">
            <option value="HS256">HS256 (HMAC SHA-256)</option>
            <option value="HS384">HS384 (HMAC SHA-384)</option>
            <option value="HS512">HS512 (HMAC SHA-512)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">{t('jwt.secretKey')}</label>
          <input
            type="text"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            className="tool-input font-mono"
            placeholder={t('jwt.secretPlaceholder')}
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium">{t('jwt.payload')}</label>
          <div className="flex gap-2">
            <button onClick={() => addClaim('iat')} className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600">+iat</button>
            <button onClick={() => addClaim('exp')} className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600">+exp</button>
            <button onClick={() => addClaim('nbf')} className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600">+nbf</button>
            <button onClick={() => addClaim('jti')} className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600">+jti</button>
          </div>
        </div>
        <textarea
          value={payload}
          onChange={(e) => setPayload(e.target.value)}
          className="tool-textarea font-mono"
          rows={8}
        />
      </div>

      {error && (
        <div className="text-red-600 dark:text-red-400 text-sm bg-red-100 dark:bg-red-900/20 p-2 rounded">{error}</div>
      )}

      <button onClick={generateToken} className="btn-primary">
        {t('jwt.generate')}
      </button>

      {token && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium">{t('jwt.generatedToken')}</label>
            <button
              onClick={copyToken}
              className={`text-sm px-3 py-1 rounded ${copied ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'}`}
            >
              {copied ? t('copied') : t('copy')}
            </button>
          </div>
          <div className="p-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg break-all font-mono text-sm">
            <span className="text-red-400">{token.split('.')[0]}</span>.
            <span className="text-purple-400">{token.split('.')[1]}</span>.
            <span className="text-blue-400">{token.split('.')[2]}</span>
          </div>
        </div>
      )}

      <div className="p-4 bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg text-sm">
        <h3 className="font-medium mb-2 text-gray-900 dark:text-white">{t('jwt.commonClaims')}</h3>
        <div className="grid grid-cols-2 gap-2 text-gray-600 dark:text-gray-300">
          <div><code className="text-blue-400">iss</code> - {t('jwt.claims.iss')}</div>
          <div><code className="text-blue-400">sub</code> - {t('jwt.claims.sub')}</div>
          <div><code className="text-blue-400">aud</code> - {t('jwt.claims.aud')}</div>
          <div><code className="text-blue-400">exp</code> - {t('jwt.claims.exp')}</div>
          <div><code className="text-blue-400">nbf</code> - {t('jwt.claims.nbf')}</div>
          <div><code className="text-blue-400">iat</code> - {t('jwt.claims.iat')}</div>
          <div><code className="text-blue-400">jti</code> - {t('jwt.claims.jti')}</div>
        </div>
      </div>
    </div>
  );
}
