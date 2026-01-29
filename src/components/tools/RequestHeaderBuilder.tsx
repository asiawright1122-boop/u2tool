'use client';

import { useState, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';

interface Header {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

const COMMON_HEADERS = [
  { key: 'Content-Type', values: ['application/json', 'application/x-www-form-urlencoded', 'multipart/form-data', 'text/plain', 'text/html', 'application/xml'] },
  { key: 'Accept', values: ['application/json', '*/*', 'text/html', 'application/xml', 'text/plain'] },
  { key: 'Authorization', values: ['Bearer <token>', 'Basic <base64>', 'API-Key <key>'] },
  { key: 'Cache-Control', values: ['no-cache', 'no-store', 'max-age=3600', 'must-revalidate'] },
  { key: 'Accept-Language', values: ['en-US', 'zh-CN', 'ja-JP', 'ko-KR', 'es-ES', 'fr-FR', 'de-DE'] },
  { key: 'Accept-Encoding', values: ['gzip, deflate, br', 'gzip, deflate', 'identity'] },
  { key: 'User-Agent', values: ['Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'curl/7.68.0', 'PostmanRuntime/7.28.0'] },
  { key: 'Origin', values: ['https://example.com'] },
  { key: 'Referer', values: ['https://example.com/page'] },
  { key: 'X-Requested-With', values: ['XMLHttpRequest'] },
  { key: 'X-API-Key', values: ['<your-api-key>'] },
  { key: 'X-Custom-Header', values: ['<custom-value>'] },
];

const PRESETS = {
  json: [
    { key: 'Content-Type', value: 'application/json' },
    { key: 'Accept', value: 'application/json' },
  ],
  form: [
    { key: 'Content-Type', value: 'application/x-www-form-urlencoded' },
    { key: 'Accept', value: '*/*' },
  ],
  cors: [
    { key: 'Origin', value: 'https://example.com' },
    { key: 'Access-Control-Request-Method', value: 'POST' },
    { key: 'Access-Control-Request-Headers', value: 'Content-Type, Authorization' },
  ],
  auth: [
    { key: 'Authorization', value: 'Bearer <your-token>' },
    { key: 'Content-Type', value: 'application/json' },
  ],
};

export default function RequestHeaderBuilder() {
  const t = useTranslations('tools.request-header-builder');
  const tCommon = useTranslations('tools');
  const [headers, setHeaders] = useState<Header[]>([
    { id: '1', key: 'Content-Type', value: 'application/json', enabled: true },
    { id: '2', key: 'Accept', value: 'application/json', enabled: true },
  ]);
  const [copied, setCopied] = useState(false);
  const [outputFormat, setOutputFormat] = useState<'raw' | 'json' | 'curl' | 'fetch'>('raw');

  const addHeader = useCallback(() => {
    setHeaders(prev => [...prev, { id: Date.now().toString(), key: '', value: '', enabled: true }]);
  }, []);

  const removeHeader = useCallback((id: string) => {
    setHeaders(prev => prev.filter(h => h.id !== id));
  }, []);

  const updateHeader = useCallback((id: string, field: 'key' | 'value' | 'enabled', val: string | boolean) => {
    setHeaders(prev => prev.map(h => h.id === id ? { ...h, [field]: val } : h));
  }, []);

  const applyPreset = useCallback((preset: keyof typeof PRESETS) => {
    const newHeaders = PRESETS[preset].map((h, i) => ({
      id: Date.now().toString() + i,
      key: h.key,
      value: h.value,
      enabled: true,
    }));
    setHeaders(newHeaders);
  }, []);

  const clearAll = useCallback(() => {
    setHeaders([]);
  }, []);

  const enabledHeaders = useMemo(() => headers.filter(h => h.enabled && h.key.trim()), [headers]);

  const output = useMemo(() => {
    if (enabledHeaders.length === 0) return '';

    switch (outputFormat) {
      case 'raw':
        return enabledHeaders.map(h => `${h.key}: ${h.value}`).join('\n');
      case 'json':
        const obj: Record<string, string> = {};
        enabledHeaders.forEach(h => { obj[h.key] = h.value; });
        return JSON.stringify(obj, null, 2);
      case 'curl':
        return enabledHeaders.map(h => `-H "${h.key}: ${h.value}"`).join(' \\\n');
      case 'fetch':
        const fetchObj: Record<string, string> = {};
        enabledHeaders.forEach(h => { fetchObj[h.key] = h.value; });
        return `headers: ${JSON.stringify(fetchObj, null, 2)}`;
      default:
        return '';
    }
  }, [enabledHeaders, outputFormat]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  return (
    <div className="space-y-6">
      {/* Presets */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Quick Presets
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => applyPreset('json')}
            className="px-3 py-1.5 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50"
          >
            JSON API
          </button>
          <button
            onClick={() => applyPreset('form')}
            className="px-3 py-1.5 text-sm bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50"
          >
            Form Data
          </button>
          <button
            onClick={() => applyPreset('cors')}
            className="px-3 py-1.5 text-sm bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50"
          >
            CORS Preflight
          </button>
          <button
            onClick={() => applyPreset('auth')}
            className="px-3 py-1.5 text-sm bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-lg hover:bg-orange-200 dark:hover:bg-orange-900/50"
          >
            Auth Bearer
          </button>
        </div>
      </div>

      {/* Headers List */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Headers ({enabledHeaders.length} active)
          </label>
          <div className="flex gap-2">
            <button
              onClick={clearAll}
              className="text-xs text-red-600 hover:text-red-700 dark:text-red-400"
            >
              {tCommon('clear')} All
            </button>
          </div>
        </div>
        <div className="space-y-2">
          {headers.map((header) => (
            <div key={header.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={header.enabled}
                onChange={(e) => updateHeader(header.id, 'enabled', e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 dark:border-gray-600"
              />
              <div className="flex-1 grid grid-cols-2 gap-2">
                <div className="relative">
                  <input
                    type="text"
                    value={header.key}
                    onChange={(e) => updateHeader(header.id, 'key', e.target.value)}
                    placeholder={t("headerNamePlaceholder")}
                    list={`headers-${header.id}`}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                  />
                  <datalist id={`headers-${header.id}`}>
                    {COMMON_HEADERS.map(h => (
                      <option key={h.key} value={h.key} />
                    ))}
                  </datalist>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={header.value}
                    onChange={(e) => updateHeader(header.id, 'value', e.target.value)}
                    placeholder={t("valuePlaceholder")}
                    list={`values-${header.id}`}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                  />
                  <datalist id={`values-${header.id}`}>
                    {COMMON_HEADERS.find(h => h.key === header.key)?.values.map(v => (
                      <option key={v} value={v} />
                    ))}
                  </datalist>
                </div>
              </div>
              <button
                onClick={() => removeHeader(header.id)}
                className="p-2 text-red-500 hover:text-red-600 dark:text-red-400"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={addHeader}
          className="mt-3 px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          + Add Header
        </button>
      </div>

      {/* Output Format */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {tCommon('output')} Format
        </label>
        <div className="flex flex-wrap gap-2">
          {(['raw', 'json', 'curl', 'fetch'] as const).map(fmt => (
            <button
              key={fmt}
              onClick={() => setOutputFormat(fmt)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                outputFormat === fmt
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {fmt.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Output */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {tCommon('output')}
          </label>
          <button
            onClick={handleCopy}
            disabled={!output}
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 disabled:opacity-50"
          >
            {copied ? tCommon('copied') : tCommon('copy')}
          </button>
        </div>
        <pre className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-x-auto text-sm font-mono text-gray-800 dark:text-gray-200 min-h-[120px]">
          {output || 'No headers configured'}
        </pre>
      </div>

      {/* Common Headers Reference */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Common HTTP Headers Reference
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {COMMON_HEADERS.slice(0, 9).map(h => (
            <button
              key={h.key}
              onClick={() => {
                setHeaders(prev => [...prev, {
                  id: Date.now().toString(),
                  key: h.key,
                  value: h.values[0],
                  enabled: true,
                }]);
              }}
              className="p-2 text-left text-xs bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500"
            >
              <span className="font-medium text-gray-900 dark:text-white">{h.key}</span>
              <span className="block text-gray-500 dark:text-gray-400 truncate">{h.values[0]}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
