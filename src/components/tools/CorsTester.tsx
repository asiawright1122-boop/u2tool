'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface CorsResult {
  success: boolean;
  headers: Record<string, string>;
  error?: string;
  method: string;
  url: string;
}

export default function CorsTester() {
  const t = useTranslations('tools.cors-tester');
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState('GET');
  const [origin, setOrigin] = useState(typeof window !== 'undefined' ? window.location.origin : '');
  const [results, setResults] = useState<CorsResult[]>([]);
  const [loading, setLoading] = useState(false);

  const testCors = async () => {
    if (!url.trim()) return;

    setLoading(true);
    const newResults: CorsResult[] = [];

    // Test preflight (OPTIONS)
    try {
      const preflightResponse = await fetch(url, {
        method: 'OPTIONS',
        headers: {
          'Origin': origin,
          'Access-Control-Request-Method': method,
          'Access-Control-Request-Headers': 'Content-Type',
        },
      });

      const preflightHeaders: Record<string, string> = {};
      preflightResponse.headers.forEach((value, key) => {
        if (key.toLowerCase().startsWith('access-control')) {
          preflightHeaders[key] = value;
        }
      });

      newResults.push({
        success: preflightResponse.ok,
        headers: preflightHeaders,
        method: 'OPTIONS (Preflight)',
        url,
      });
    } catch (e) {
      newResults.push({
        success: false,
        headers: {},
        error: (e as Error).message,
        method: 'OPTIONS (Preflight)',
        url,
      });
    }

    // Test actual request
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Origin': origin,
        },
        mode: 'cors',
      });

      const corsHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        if (key.toLowerCase().startsWith('access-control')) {
          corsHeaders[key] = value;
        }
      });

      newResults.push({
        success: true,
        headers: corsHeaders,
        method,
        url,
      });
    } catch (e) {
      newResults.push({
        success: false,
        headers: {},
        error: (e as Error).message,
        method,
        url,
      });
    }

    setResults(newResults);
    setLoading(false);
  };

  const loadExample = () => {
    setUrl('https://api.github.com/users/octocat');
    setMethod('GET');
  };

  const getCorsStatus = (): { status: string; color: string; description: string } => {
    if (results.length === 0) {
      return { status: '', color: '', description: '' };
    }

    const actualRequest = results.find(r => r.method !== 'OPTIONS (Preflight)');
    if (!actualRequest) {
      return { status: t('unknown'), color: 'gray', description: '' };
    }

    if (actualRequest.success) {
      const allowOrigin = actualRequest.headers['access-control-allow-origin'];
      if (allowOrigin === '*') {
        return { 
          status: t('corsEnabled'), 
          color: 'green', 
          description: t('corsEnabledAll') 
        };
      } else if (allowOrigin) {
        return { 
          status: t('corsEnabled'), 
          color: 'green', 
          description: t('corsEnabledSpecific', { origin: allowOrigin }) 
        };
      }
      return { 
        status: t('corsEnabled'), 
        color: 'green', 
        description: t('corsEnabledNoHeader') 
      };
    }

    return { 
      status: t('corsBlocked'), 
      color: 'red', 
      description: actualRequest.error || t('corsBlockedDescription') 
    };
  };

  const corsStatus = getCorsStatus();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('urlToTest')}
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={t('urlPlaceholder')}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('method')}
              </label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
                <option value="PATCH">PATCH</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('origin')}
              </label>
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={testCors}
              disabled={loading || !url}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
            >
              {loading ? t('testing') : t('testCors')}
            </button>
            <button
              onClick={loadExample}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
            >
              {t('loadExample')}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {corsStatus.status && (
            <div className={`p-6 rounded-xl ${
              corsStatus.color === 'green'
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                : corsStatus.color === 'red'
                ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                : 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
            }`}>
              <div className="flex items-center gap-3 mb-2">
                <span className={`text-3xl ${
                  corsStatus.color === 'green' ? 'text-green-500' : 
                  corsStatus.color === 'red' ? 'text-red-500' : 'text-gray-500'
                }`}>
                  {corsStatus.color === 'green' ? '✓' : corsStatus.color === 'red' ? '✗' : '?'}
                </span>
                <span className={`text-xl font-semibold ${
                  corsStatus.color === 'green' ? 'text-green-700 dark:text-green-300' : 
                  corsStatus.color === 'red' ? 'text-red-700 dark:text-red-300' : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {corsStatus.status}
                </span>
              </div>
              <p className={`text-sm ${
                corsStatus.color === 'green' ? 'text-green-600 dark:text-green-400' : 
                corsStatus.color === 'red' ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'
              }`}>
                {corsStatus.description}
              </p>
            </div>
          )}

          {results.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {t('results')}
              </h3>
              
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    result.success
                      ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'
                      : 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`font-mono font-medium ${
                      result.success ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
                    }`}>
                      {result.method}
                    </span>
                    <span className={result.success ? 'text-green-500' : 'text-red-500'}>
                      {result.success ? '✓' : '✗'}
                    </span>
                  </div>
                  
                  {result.error && (
                    <p className="text-sm text-red-600 dark:text-red-400 mb-2">
                      {result.error}
                    </p>
                  )}
                  
                  {Object.keys(result.headers).length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                        {t('corsHeaders')}:
                      </p>
                      <div className="text-xs font-mono bg-white dark:bg-gray-800 p-2 rounded">
                        {Object.entries(result.headers).map(([key, value]) => (
                          <div key={key}>
                            <span className="text-blue-600 dark:text-blue-400">{key}:</span> {value}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
          {t('whatIsCors')}
        </h4>
        <p className="text-sm text-blue-700 dark:text-blue-300">
          {t('corsExplanation')}
        </p>
      </div>
    </div>
  );
}
