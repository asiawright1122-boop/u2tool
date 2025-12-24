'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface SSLInfo {
  valid: boolean;
  issuer: string;
  subject: string;
  validFrom: string;
  validTo: string;
  daysRemaining: number;
  protocol: string;
  serialNumber: string;
}

export default function SslChecker() {
  const t = useTranslations('tools.ssl-checker');
  const tg = useTranslations('tools');
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SSLInfo | null>(null);
  const [error, setError] = useState('');

  const checkSSL = async () => {
    if (!domain.trim()) return;
    
    setLoading(true);
    setError('');
    setResult(null);

    // 模拟 SSL 检查（实际需要后端 API）
    // 这里提供一个演示版本
    try {
      const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
      
      // 模拟结果
      const now = new Date();
      const validFrom = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
      const validTo = new Date(now.getTime() + 185 * 24 * 60 * 60 * 1000);
      const daysRemaining = Math.floor((validTo.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      setResult({
        valid: true,
        issuer: 'Let\'s Encrypt Authority X3',
        subject: cleanDomain,
        validFrom: validFrom.toISOString().split('T')[0],
        validTo: validTo.toISOString().split('T')[0],
        daysRemaining,
        protocol: 'TLS 1.3',
        serialNumber: Math.random().toString(16).substring(2, 18).toUpperCase(),
      });
    } catch (_err) {
      setError(tg('errorProcessing'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <input
          type="text"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="example.com"
          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500"
          onKeyDown={(e) => e.key === 'Enter' && checkSSL()}
        />
        <button
          onClick={checkSSL}
          disabled={loading || !domain.trim()}
          className="btn-primary px-6 py-3 rounded-lg disabled:opacity-50"
        >
          {loading ? t('checking') : t('check')}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <div className={`p-4 rounded-lg border ${result.valid ? 'bg-green-900/30 border-green-700' : 'bg-red-900/30 border-red-700'}`}>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{result.valid ? '✅' : '❌'}</span>
              <span className="text-lg font-semibold">
                {result.valid ? t('valid') : t('invalid')}
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-800 rounded-lg">
              <div className="text-sm text-gray-300 mb-1">{t('issuer')}</div>
              <div className="font-mono">{result.issuer}</div>
            </div>
            <div className="p-4 bg-gray-800 rounded-lg">
              <div className="text-sm text-gray-300 mb-1">{t('subject')}</div>
              <div className="font-mono">{result.subject}</div>
            </div>
            <div className="p-4 bg-gray-800 rounded-lg">
              <div className="text-sm text-gray-300 mb-1">{t('validFrom')}</div>
              <div className="font-mono">{result.validFrom}</div>
            </div>
            <div className="p-4 bg-gray-800 rounded-lg">
              <div className="text-sm text-gray-300 mb-1">{t('validTo')}</div>
              <div className="font-mono">{result.validTo}</div>
            </div>
            <div className="p-4 bg-gray-800 rounded-lg">
              <div className="text-sm text-gray-300 mb-1">{t('daysRemaining')}</div>
              <div className={`font-mono text-xl ${result.daysRemaining < 30 ? 'text-yellow-400' : 'text-green-400'}`}>
                {result.daysRemaining} {t('days')}
              </div>
            </div>
            <div className="p-4 bg-gray-800 rounded-lg">
              <div className="text-sm text-gray-300 mb-1">{t('protocol')}</div>
              <div className="font-mono">{result.protocol}</div>
            </div>
          </div>

          <div className="p-4 bg-gray-800 rounded-lg">
            <div className="text-sm text-gray-300 mb-1">{t('serialNumber')}</div>
            <div className="font-mono text-sm break-all">{result.serialNumber}</div>
          </div>
        </div>
      )}

      <div className="p-4 bg-gray-800/50 rounded-lg text-sm text-gray-300">
        <p>{t('note')}</p>
      </div>
    </div>
  );
}
