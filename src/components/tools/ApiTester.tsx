'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface Header {
  key: string;
  value: string;
  enabled: boolean;
}

interface ApiResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  time: number;
}

export default function ApiTester() {
  const t = useTranslations('tools.api-tester');
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState('GET');
  const [headers, setHeaders] = useState<Header[]>([
    { key: 'Content-Type', value: 'application/json', enabled: true }
  ]);
  const [body, setBody] = useState('');
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'headers' | 'body' | 'response'>('headers');

  const addHeader = () => {
    setHeaders([...headers, { key: '', value: '', enabled: true }]);
  };

  const updateHeader = (index: number, field: keyof Header, value: string | boolean) => {
    const newHeaders = [...headers];
    newHeaders[index] = { ...newHeaders[index], [field]: value };
    setHeaders(newHeaders);
  };

  const removeHeader = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  const sendRequest = async () => {
    if (!url) {
      setError(t('errors.noUrl'));
      return;
    }

    setLoading(true);
    setError('');
    setResponse(null);

    const startTime = Date.now();

    try {
      const requestHeaders: Record<string, string> = {};
      headers.filter(h => h.enabled && h.key).forEach(h => {
        requestHeaders[h.key] = h.value;
      });

      const options: RequestInit = {
        method,
        headers: requestHeaders,
      };

      if (['POST', 'PUT', 'PATCH'].includes(method) && body) {
        options.body = body;
      }

      const res = await fetch(url, options);
      const endTime = Date.now();

      const responseHeaders: Record<string, string> = {};
      res.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      let responseBody = '';
      try {
        const text = await res.text();
        try {
          responseBody = JSON.stringify(JSON.parse(text), null, 2);
        } catch {
          responseBody = text;
        }
      } catch {
        responseBody = t('errors.cannotReadBody');
      }

      setResponse({
        status: res.status,
        statusText: res.statusText,
        headers: responseHeaders,
        body: responseBody,
        time: endTime - startTime,
      });
      setActiveTab('response');
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-green-500';
    if (status >= 300 && status < 400) return 'text-yellow-500';
    if (status >= 400 && status < 500) return 'text-orange-500';
    return 'text-red-500';
  };

  const loadExample = () => {
    setUrl('https://jsonplaceholder.typicode.com/posts/1');
    setMethod('GET');
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="PATCH">PATCH</option>
          <option value="DELETE">DELETE</option>
          <option value="HEAD">HEAD</option>
          <option value="OPTIONS">OPTIONS</option>
        </select>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={t('urlPlaceholder')}
          className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono"
        />
        <button
          onClick={sendRequest}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
        >
          {loading ? t('sending') : t('send')}
        </button>
      </div>

      <button
        onClick={loadExample}
        className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
      >
        {t('loadExample')}
      </button>

      <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
        <div className="flex border-b border-gray-300 dark:border-gray-600">
          <button
            onClick={() => setActiveTab('headers')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'headers'
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            {t('headers')} ({headers.length})
          </button>
          <button
            onClick={() => setActiveTab('body')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'body'
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            {t('body')}
          </button>
          {response && (
            <button
              onClick={() => setActiveTab('response')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'response'
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              {t('response')} <span className={getStatusColor(response.status)}>{response.status}</span>
            </button>
          )}
        </div>

        <div className="p-4">
          {activeTab === 'headers' && (
            <div className="space-y-2">
              {headers.map((header, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    type="checkbox"
                    checked={header.enabled}
                    onChange={(e) => updateHeader(index, 'enabled', e.target.checked)}
                    className="rounded"
                  />
                  <input
                    type="text"
                    value={header.key}
                    onChange={(e) => updateHeader(index, 'key', e.target.value)}
                    placeholder="Header name"
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                  />
                  <input
                    type="text"
                    value={header.value}
                    onChange={(e) => updateHeader(index, 'value', e.target.value)}
                    placeholder="Value"
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                  />
                  <button
                    onClick={() => removeHeader(index)}
                    className="p-2 text-red-500 hover:text-red-600"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                onClick={addHeader}
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                + {t('addHeader')}
              </button>
            </div>
          )}

          {activeTab === 'body' && (
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={t('bodyPlaceholder')}
              className="w-full h-48 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm"
            />
          )}

          {activeTab === 'response' && response && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm">
                <span className={`font-bold ${getStatusColor(response.status)}`}>
                  {response.status} {response.statusText}
                </span>
                <span className="text-gray-500">{response.time}ms</span>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('responseHeaders')}
                </h4>
                <div className="text-xs font-mono bg-gray-50 dark:bg-gray-900 p-2 rounded max-h-32 overflow-auto">
                  {Object.entries(response.headers).map(([key, value]) => (
                    <div key={key}>
                      <span className="text-blue-600 dark:text-blue-400">{key}:</span> {value}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('responseBody')}
                </h4>
                <pre className="text-sm font-mono bg-gray-50 dark:bg-gray-900 p-4 rounded overflow-auto max-h-64 text-gray-900 dark:text-white">
                  {response.body}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
          {error}
        </div>
      )}
    </div>
  );
}
