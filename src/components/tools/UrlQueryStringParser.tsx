'use client';

import { useState, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';

interface ParsedUrl {
  protocol: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  params: Array<{ key: string; value: string; decoded: string }>;
}

function parseUrl(urlString: string): ParsedUrl | null {
  try {
    // Handle query string only input
    if (urlString.startsWith('?') || (!urlString.includes('://') && urlString.includes('='))) {
      const search = urlString.startsWith('?') ? urlString : '?' + urlString;
      const params = new URLSearchParams(search);
      const paramArray: Array<{ key: string; value: string; decoded: string }> = [];
      params.forEach((value, key) => {
        paramArray.push({
          key,
          value,
          decoded: decodeURIComponent(value),
        });
      });
      return {
        protocol: '',
        hostname: '',
        port: '',
        pathname: '',
        search,
        hash: '',
        params: paramArray,
      };
    }

    const url = new URL(urlString);
    const params: Array<{ key: string; value: string; decoded: string }> = [];
    
    url.searchParams.forEach((value, key) => {
      params.push({
        key,
        value,
        decoded: decodeURIComponent(value),
      });
    });

    return {
      protocol: url.protocol.replace(':', ''),
      hostname: url.hostname,
      port: url.port,
      pathname: url.pathname,
      search: url.search,
      hash: url.hash,
      params,
    };
  } catch {
    return null;
  }
}

export default function UrlQueryStringParser() {
  const t = useTranslations('tools');
  const [url, setUrl] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const parsed = useMemo(() => {
    if (!url.trim()) return null;
    return parseUrl(url);
  }, [url]);

  const handleCopy = useCallback((text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }, []);

  const handleClear = useCallback(() => {
    setUrl('');
  }, []);

  const exampleUrl = 'https://example.com/search?q=hello%20world&page=1&sort=date&filter[category]=tech&utm_source=google&utm_medium=cpc';

  const buildQueryString = useCallback(() => {
    if (!parsed?.params.length) return '';
    return parsed.params.map(p => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.decoded)}`).join('&');
  }, [parsed]);

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            URL / Query String
          </label>
          <button
            onClick={() => setUrl(exampleUrl)}
            className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            {t('sql.loadExample')}
          </button>
        </div>
        <textarea
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/path?param1=value1&param2=value2 or ?param1=value1&param2=value2"
          className="w-full h-24 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm resize-none"
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleClear}
          className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
        >
          {t('clear')}
        </button>
      </div>

      {/* Error */}
      {url.trim() && !parsed && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
          {t('urlParser.invalid')}
        </div>
      )}

      {/* Parsed Result */}
      {parsed && (
        <div className="space-y-6">
          {/* URL Components */}
          {parsed.hostname && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                URL Components
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {parsed.protocol && (
                  <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <span className="text-sm text-gray-500 dark:text-gray-400">{t('urlParser.protocol')}</span>
                    <p className="font-mono text-gray-900 dark:text-white">{parsed.protocol}</p>
                  </div>
                )}
                {parsed.hostname && (
                  <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <span className="text-sm text-gray-500 dark:text-gray-400">{t('urlParser.hostname')}</span>
                    <p className="font-mono text-gray-900 dark:text-white">{parsed.hostname}</p>
                  </div>
                )}
                {parsed.port && (
                  <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <span className="text-sm text-gray-500 dark:text-gray-400">{t('urlParser.port')}</span>
                    <p className="font-mono text-gray-900 dark:text-white">{parsed.port}</p>
                  </div>
                )}
                {parsed.pathname && parsed.pathname !== '/' && (
                  <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <span className="text-sm text-gray-500 dark:text-gray-400">{t('urlParser.pathname')}</span>
                    <p className="font-mono text-gray-900 dark:text-white">{parsed.pathname}</p>
                  </div>
                )}
                {parsed.hash && (
                  <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <span className="text-sm text-gray-500 dark:text-gray-400">{t('urlParser.hash')}</span>
                    <p className="font-mono text-gray-900 dark:text-white">{parsed.hash}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Query Parameters */}
          {parsed.params.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {t('urlParser.queryParams')} ({parsed.params.length})
                </h3>
                <button
                  onClick={() => handleCopy(buildQueryString(), 'query')}
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  {copied === 'query' ? t('copied') : t('copy')} Query String
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-700">
                      <th className="px-4 py-2 text-left font-medium text-gray-700 dark:text-gray-300">#</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-700 dark:text-gray-300">Key</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-700 dark:text-gray-300">Value (Raw)</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-700 dark:text-gray-300">Value (Decoded)</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-700 dark:text-gray-300"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {parsed.params.map((param, idx) => (
                      <tr key={idx} className="bg-white dark:bg-gray-800">
                        <td className="px-4 py-2 text-gray-500 dark:text-gray-400">{idx + 1}</td>
                        <td className="px-4 py-2 font-mono text-blue-600 dark:text-blue-400">{param.key}</td>
                        <td className="px-4 py-2 font-mono text-gray-600 dark:text-gray-400 max-w-xs truncate">
                          {param.value}
                        </td>
                        <td className="px-4 py-2 font-mono text-gray-900 dark:text-white max-w-xs truncate">
                          {param.decoded}
                        </td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => handleCopy(param.decoded, `param-${idx}`)}
                            className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
                          >
                            {copied === `param-${idx}` ? '✓' : t('copy')}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* JSON Output */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                JSON {t('output')}
              </h3>
              <button
                onClick={() => handleCopy(JSON.stringify(Object.fromEntries(parsed.params.map(p => [p.key, p.decoded])), null, 2), 'json')}
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                {copied === 'json' ? t('copied') : t('copy')}
              </button>
            </div>
            <pre className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-x-auto text-sm font-mono text-gray-800 dark:text-gray-200">
              {JSON.stringify(Object.fromEntries(parsed.params.map(p => [p.key, p.decoded])), null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
