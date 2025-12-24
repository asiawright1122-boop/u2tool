'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface WhoisInfo {
  domain: string;
  registrar: string;
  createdDate: string;
  expiryDate: string;
  updatedDate: string;
  status: string[];
  nameServers: string[];
  dnssec: string;
}

export default function WhoisLookup() {
  const t = useTranslations('tools.whois-lookup');
  const tg = useTranslations('tools');
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WhoisInfo | null>(null);
  const [error, setError] = useState('');

  const lookup = async () => {
    if (!domain.trim()) return;
    
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '').toLowerCase();
      
      // 模拟 WHOIS 查询结果
      const now = new Date();
      const created = new Date(now.getTime() - 5 * 365 * 24 * 60 * 60 * 1000);
      const expiry = new Date(now.getTime() + 2 * 365 * 24 * 60 * 60 * 1000);
      const updated = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      setResult({
        domain: cleanDomain,
        registrar: 'Example Registrar, Inc.',
        createdDate: created.toISOString().split('T')[0],
        expiryDate: expiry.toISOString().split('T')[0],
        updatedDate: updated.toISOString().split('T')[0],
        status: ['clientTransferProhibited', 'clientUpdateProhibited'],
        nameServers: ['ns1.example.com', 'ns2.example.com'],
        dnssec: 'unsigned',
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
          onKeyDown={(e) => e.key === 'Enter' && lookup()}
        />
        <button
          onClick={lookup}
          disabled={loading || !domain.trim()}
          className="btn-primary px-6 py-3 rounded-lg disabled:opacity-50"
        >
          {loading ? t('loading') : t('lookup')}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <div className="p-4 bg-blue-900/30 border border-blue-700 rounded-lg">
            <div className="text-lg font-semibold">{result.domain}</div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-800 rounded-lg">
              <div className="text-sm text-gray-300 mb-1">{t('registrar')}</div>
              <div className="font-mono">{result.registrar}</div>
            </div>
            <div className="p-4 bg-gray-800 rounded-lg">
              <div className="text-sm text-gray-300 mb-1">{t('dnssec')}</div>
              <div className="font-mono">{result.dnssec}</div>
            </div>
            <div className="p-4 bg-gray-800 rounded-lg">
              <div className="text-sm text-gray-300 mb-1">{t('createdDate')}</div>
              <div className="font-mono">{result.createdDate}</div>
            </div>
            <div className="p-4 bg-gray-800 rounded-lg">
              <div className="text-sm text-gray-300 mb-1">{t('expiryDate')}</div>
              <div className="font-mono">{result.expiryDate}</div>
            </div>
            <div className="p-4 bg-gray-800 rounded-lg">
              <div className="text-sm text-gray-300 mb-1">{t('updatedDate')}</div>
              <div className="font-mono">{result.updatedDate}</div>
            </div>
          </div>

          <div className="p-4 bg-gray-800 rounded-lg">
            <div className="text-sm text-gray-300 mb-2">{t('nameServers')}</div>
            <div className="space-y-1">
              {result.nameServers.map((ns, i) => (
                <div key={i} className="font-mono text-sm">{ns}</div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-gray-800 rounded-lg">
            <div className="text-sm text-gray-300 mb-2">{t('domainStatus')}</div>
            <div className="flex flex-wrap gap-2">
              {result.status.map((status, i) => (
                <span key={i} className="px-2 py-1 bg-gray-700 rounded text-sm font-mono">
                  {status}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="p-4 bg-gray-800/50 rounded-lg text-sm text-gray-300">
        <p>{t('note')}</p>
      </div>
    </div>
  );
}
