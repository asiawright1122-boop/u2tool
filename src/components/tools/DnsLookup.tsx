'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface DnsResult {
  type: string;
  value: string;
  ttl?: number;
}

const isIpAddress = (input: string): boolean => {
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  return ipv4Regex.test(input) || ipv6Regex.test(input);
};

export default function DnsLookup() {
  const t = useTranslations('tools');
  const [domain, setDomain] = useState('');
  const [results, setResults] = useState<DnsResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const recordTypes = ['A', 'AAAA', 'CNAME', 'MX', 'NS', 'TXT'] as const;

  const lookupDns = async () => {
    if (!domain.trim()) return;
    if (isIpAddress(domain.trim())) {
      setError(t('dnsLookup.ipError'));
      return;
    }
    setLoading(true);
    setError('');
    setResults([]);

    try {
      const responses = await Promise.all(
        recordTypes.map(async (type) => {
          try {
            const res = await fetch(
              `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=${type}`,
              { headers: { 'Accept': 'application/dns-json' } }
            );
            const data = await res.json();
            return data.Answer?.map((a: { type: number; data: string; TTL: number }) => ({
              type,
              value: a.data,
              ttl: a.TTL
            })) || [];
          } catch {
            return [];
          }
        })
      );
      setResults(responses.flat());
    } catch {
      setError(t('dnsLookup.error'));
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <input
          type="text"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder={t('dnsLookup.placeholder')}
          onKeyDown={(e) => e.key === 'Enter' && lookupDns()}
          className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={lookupDns}
          disabled={loading || !domain.trim()}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 rounded-lg font-medium"
        >
          {loading ? t('dnsLookup.loading') : t('dnsLookup.lookup')}
        </button>
      </div>

      {error && <div className="text-red-400 text-sm">{error}</div>}

      {results.length > 0 && (
        <div className="space-y-2">
          {recordTypes.map(type => {
            const typeResults = results.filter(r => r.type === type);
            if (typeResults.length === 0) return null;
            return (
              <div key={type} className="bg-gray-800 rounded-lg p-4">
                <div className="text-sm font-medium text-blue-400 mb-2">
                  {t('dnsLookup.records', { type })}
                </div>
                {typeResults.map((r, i) => (
                  <div key={i} className="flex justify-between items-center py-1 border-b border-gray-700 last:border-0">
                    <code className="text-sm font-mono text-gray-300">{r.value}</code>
                    {r.ttl && <span className="text-xs text-gray-300">{t('dnsLookup.ttl', { ttl: r.ttl })}</span>}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      <div className="bg-gray-800/50 rounded-lg p-4">
        <h3 className="font-medium mb-2">{t('dnsLookup.recordTypes')}</h3>
        <ul className="text-sm text-gray-300 space-y-1">
          {recordTypes.map(type => (
            <li key={type}>• {type} - {t(`dnsLookup.recordDesc.${type}`)}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
