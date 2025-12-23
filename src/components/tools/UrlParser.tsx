'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function UrlParser() {
  const t = useTranslations('tools.url-parser');
  const tg = useTranslations('tools');
  const [url, setUrl] = useState('https://example.com:8080/path/to/page?name=John&age=30#section');
  const [copied, setCopied] = useState('');

  const parseUrl = () => {
    try {
      const parsed = new URL(url);
      return {
        protocol: parsed.protocol,
        hostname: parsed.hostname,
        port: parsed.port,
        pathname: parsed.pathname,
        search: parsed.search,
        hash: parsed.hash,
        origin: parsed.origin,
        host: parsed.host,
        params: Object.fromEntries(parsed.searchParams)
      };
    } catch {
      return null;
    }
  };

  const parsed = parseUrl();

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(''), 1500);
  };

  const Row = ({ label, value }: { label: string; value: string }) => (
    <div className="flex items-center justify-between p-3 bg-gray-700 rounded">
      <span className="text-gray-300">{label}</span>
      <div className="flex items-center gap-2">
        <code className="text-blue-400">{value}</code>
        <button onClick={() => copy(value)} className="text-xs px-2 py-1 bg-gray-600 rounded hover:bg-gray-9000">{copied === value ? '✓' : tg('copy')}</button>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">{t('urlLabel')}</label>
        <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg font-mono text-sm" />
      </div>
      {parsed ? (
        <div className="space-y-2">
          <Row label={t('protocol')} value={parsed.protocol} />
          <Row label={t('hostname')} value={parsed.hostname} />
          <Row label={t('port')} value={parsed.port || t('defaultPort')} />
          <Row label={t('pathname')} value={parsed.pathname} />
          <Row label={t('search')} value={parsed.search || t('none')} />
          <Row label={t('hash')} value={parsed.hash || t('none')} />
          <Row label={t('origin')} value={parsed.origin} />
          {Object.keys(parsed.params).length > 0 && (
            <div className="bg-gray-800 rounded-lg p-4 mt-4">
              <h3 className="font-medium mb-2">{t('queryParams')}</h3>
              <div className="space-y-2">
                {Object.entries(parsed.params).map(([k, v]) => (
                  <div key={k} className="flex justify-between p-2 bg-gray-700 rounded">
                    <span className="text-yellow-400">{k}</span>
                    <span className="text-green-400">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="text-red-400">{t('invalid')}</p>
      )}
    </div>
  );
}
