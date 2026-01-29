'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';

interface WebhookRequest {
  id: string;
  timestamp: Date;
  method: string;
  url: string;
  headers: Record<string, string>;
  body: string;
  status: 'pending' | 'success' | 'error';
  response?: {
    status: number;
    statusText: string;
    headers: Record<string, string>;
    body: string;
    time: number;
  };
  error?: string;
}

const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

const SAMPLE_PAYLOADS = {
  json: JSON.stringify({ event: 'test', data: { message: 'Hello World', timestamp: new Date().toISOString() } }, null, 2),
  github: JSON.stringify({ action: 'push', repository: { name: 'test-repo' }, sender: { login: 'user' } }, null, 2),
  stripe: JSON.stringify({ type: 'payment_intent.succeeded', data: { object: { id: 'pi_123', amount: 1000 } } }, null, 2),
};

export default function WebhookTester() {
  const t = useTranslations('tools.webhook-tester');
  const tCommon = useTranslations('tools');
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState('POST');
  const [headers, setHeaders] = useState('Content-Type: application/json');
  const [body, setBody] = useState(SAMPLE_PAYLOADS.json);
  const [requests, setRequests] = useState<WebhookRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const parseHeaders = useCallback((headerStr: string): Record<string, string> => {
    const result: Record<string, string> = {};
    headerStr.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split(':');
      if (key && valueParts.length > 0) {
        result[key.trim()] = valueParts.join(':').trim();
      }
    });
    return result;
  }, []);

  const sendRequest = useCallback(async () => {
    if (!url.trim()) return;

    const requestId = Date.now().toString();
    const parsedHeaders = parseHeaders(headers);
    
    const newRequest: WebhookRequest = {
      id: requestId,
      timestamp: new Date(),
      method,
      url,
      headers: parsedHeaders,
      body: method !== 'GET' ? body : '',
      status: 'pending',
    };

    setRequests(prev => [newRequest, ...prev]);
    setIsLoading(true);

    const startTime = performance.now();

    try {
      const response = await fetch(url, {
        method,
        headers: parsedHeaders,
        body: method !== 'GET' ? body : undefined,
        mode: 'cors',
      });

      const endTime = performance.now();
      const responseBody = await response.text();
      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      setRequests(prev => prev.map(req => 
        req.id === requestId 
          ? {
              ...req,
              status: response.ok ? 'success' : 'error',
              response: {
                status: response.status,
                statusText: response.statusText,
                headers: responseHeaders,
                body: responseBody,
                time: Math.round(endTime - startTime),
              },
            }
          : req
      ));
    } catch (error) {
      setRequests(prev => prev.map(req => 
        req.id === requestId 
          ? {
              ...req,
              status: 'error',
              error: error instanceof Error ? error.message : 'Request failed',
            }
          : req
      ));
    } finally {
      setIsLoading(false);
    }
  }, [url, method, headers, body, parseHeaders]);

  const clearHistory = useCallback(() => {
    setRequests([]);
  }, []);

  const handleCopy = useCallback((text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }, []);

  const loadSample = useCallback((type: keyof typeof SAMPLE_PAYLOADS) => {
    setBody(SAMPLE_PAYLOADS[type]);
  }, []);

  return (
    <div className="space-y-6">
      {/* Request Builder */}
      <div className="space-y-4">
        {/* URL and Method */}
        <div className="flex gap-2">
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
          >
            {METHODS.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={t("urlPlaceholder")}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
          <button
            onClick={sendRequest}
            disabled={!url.trim() || isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isLoading ? t('sending') : t('send')}
          </button>
        </div>

        {/* Headers */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('headers')}
          </label>
          <textarea
            value={headers}
            onChange={(e) => setHeaders(e.target.value)}
            placeholder={t("headersPlaceholder")}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm resize-none"
          />
        </div>

        {/* Body */}
        {method !== 'GET' && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('requestBody')}
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => loadSample('json')}
                  className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  JSON
                </button>
                <button
                  onClick={() => loadSample('github')}
                  className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  GitHub
                </button>
                <button
                  onClick={() => loadSample('stripe')}
                  className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  Stripe
                </button>
              </div>
            </div>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={8}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm resize-none"
            />
          </div>
        )}
      </div>

      {/* Request History */}
      {requests.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {t('requestHistory')} ({requests.length})
            </h3>
            <button
              onClick={clearHistory}
              className="text-sm text-red-600 hover:text-red-700 dark:text-red-400"
            >
              {t('clearHistory')}
            </button>
          </div>
          <div className="space-y-4">
            {requests.map((req) => (
              <div
                key={req.id}
                className={`p-4 rounded-lg border ${
                  req.status === 'success'
                    ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'
                    : req.status === 'error'
                    ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20'
                    : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
                }`}
              >
                {/* Request Info */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                      req.method === 'GET' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' :
                      req.method === 'POST' ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' :
                      req.method === 'PUT' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300' :
                      req.method === 'DELETE' ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300' :
                      'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {req.method}
                    </span>
                    <span className="text-sm font-mono text-gray-600 dark:text-gray-400 truncate max-w-md">
                      {req.url}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {req.timestamp.toLocaleTimeString()}
                  </span>
                </div>

                {/* Response */}
                {req.response && (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-medium ${
                        req.response.status < 300 ? 'text-green-600 dark:text-green-400' :
                        req.response.status < 400 ? 'text-yellow-600 dark:text-yellow-400' :
                        'text-red-600 dark:text-red-400'
                      }`}>
                        {req.response.status} {req.response.statusText}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {req.response.time}ms
                      </span>
                    </div>
                    {req.response.body && (
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-500 dark:text-gray-400">{t('responseBody')}</span>
                          <button
                            onClick={() => handleCopy(req.response!.body, req.id)}
                            className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
                          >
                            {copied === req.id ? tCommon('copied') : tCommon('copy')}
                          </button>
                        </div>
                        <pre className="p-2 bg-white dark:bg-gray-900 rounded text-xs font-mono text-gray-800 dark:text-gray-200 overflow-x-auto max-h-40">
                          {req.response.body.length > 1000 
                            ? req.response.body.substring(0, 1000) + '...' 
                            : req.response.body}
                        </pre>
                      </div>
                    )}
                  </div>
                )}

                {/* Error */}
                {req.error && (
                  <div className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {t('error')}: {req.error}
                  </div>
                )}

                {/* Pending */}
                {req.status === 'pending' && (
                  <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {t('sendingRequest')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">{t('tips')}</h4>
        <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
          <li>• {t('tip1')}</li>
          <li>• {t('tip2')}</li>
          <li>• {t('tip3')}</li>
        </ul>
      </div>
    </div>
  );
}
