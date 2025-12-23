'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface ExpandedUrl {
  shortUrl: string;
  expandedUrl: string;
  status: 'pending' | 'success' | 'error';
  error?: string;
}

export default function UrlShortenerPreview() {
  const t = useTranslations('tools.url-shortener-preview');
  const [input, setInput] = useState('');
  const [results, setResults] = useState<ExpandedUrl[]>([]);
  const [loading, setLoading] = useState(false);

  const shortenerDomains = [
    'bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'is.gd', 'buff.ly',
    'adf.ly', 'bit.do', 'mcaf.ee', 'su.pr', 'tiny.cc', 'tr.im', 'cli.gs',
    'short.to', 'budurl.com', 'ping.fm', 'post.ly', 'just.as', 'bkite.com',
    'snipr.com', 'fic.kr', 'loopt.us', 'doiop.com', 'short.ie', 'kl.am',
    'wp.me', 'rubyurl.com', 'om.ly', 'to.ly', 'bit.do', 'lnkd.in', 'db.tt',
    'qr.ae', 'adf.ly', 'bitly.com', 'cur.lv', 'ity.im', 'q.gs', 'po.st',
    'bc.vc', 'twitthis.com', 'u.teleportme.com', 'v.gd', 'vzturl.com'
  ];

  const isShortUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      return shortenerDomains.some(domain => urlObj.hostname.includes(domain));
    } catch {
      return false;
    }
  };

  const extractUrls = (text: string): string[] => {
    const urlRegex = /https?:\/\/[^\s<>"{}|\\^`[\]]+/g;
    return text.match(urlRegex) || [];
  };

  const analyzeUrls = () => {
    const urls = extractUrls(input);
    const shortUrls = urls.filter(isShortUrl);
    
    if (shortUrls.length === 0) {
      setResults([{
        shortUrl: t('noShortUrls'),
        expandedUrl: '',
        status: 'error',
        error: t('noShortUrlsError')
      }]);
      return;
    }

    setLoading(true);
    const newResults: ExpandedUrl[] = shortUrls.map(url => ({
      shortUrl: url,
      expandedUrl: t('unableToExpand'),
      status: 'success' as const
    }));
    setResults(newResults);
    setLoading(false);
  };

  const copyResults = () => {
    const text = results.map(r => `${r.shortUrl} → ${r.expandedUrl}`).join('\n');
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <div className="bg-yellow-900/30 border border-yellow-600 rounded-lg p-4">
        <p className="text-yellow-400 text-sm">
          {t('note')}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">{t('input')}</label>
        <textarea value={input} onChange={(e) => setInput(e.target.value)}
          className="w-full h-40 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
          placeholder={t('placeholder')} />
      </div>

      <div className="flex gap-4">
        <button onClick={analyzeUrls} disabled={loading || !input}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg font-medium transition-colors">
          {loading ? t('analyzing') : t('analyzeUrls')}
        </button>
        <button onClick={copyResults} disabled={results.length === 0}
          className="px-6 py-2 bg-gray-600 hover:bg-gray-9000 disabled:opacity-50 rounded-lg font-medium transition-colors">
          {t('copy')}
        </button>
      </div>

      {results.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">{t('results')}</label>
          <div className="space-y-2">
            {results.map((result, index) => (
              <div key={index} className={`p-4 rounded-lg ${result.status === 'error' ? 'bg-red-900/30' : 'bg-gray-700'}`}>
                <div className="font-mono text-sm text-blue-400 break-all">{result.shortUrl}</div>
                {result.expandedUrl && (
                  <div className="font-mono text-sm text-green-400 break-all mt-1">→ {result.expandedUrl}</div>
                )}
                {result.error && (
                  <div className="text-sm text-red-400 mt-1">{result.error}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">{t('supportedServices')}</label>
        <div className="flex flex-wrap gap-2">
          {shortenerDomains.slice(0, 20).map((domain) => (
            <span key={domain} className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">{domain}</span>
          ))}
          <span className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">{t('moreServices', { count: shortenerDomains.length - 20 })}</span>
        </div>
      </div>
    </div>
  );
}
