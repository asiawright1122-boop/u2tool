'use client';

import { useState, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';

interface ParsedResponse {
  status?: number;
  statusText?: string;
  headers?: Record<string, string>;
  body?: unknown;
  contentType?: string;
}

function parseResponse(input: string): ParsedResponse | null {
  try {
    // Try parsing as JSON directly
    const jsonBody = JSON.parse(input);
    return { body: jsonBody, contentType: 'application/json' };
  } catch {
    // Try parsing as HTTP response
    const lines = input.split('\n');
    const result: ParsedResponse = {};
    
    // Check for HTTP status line
    const statusMatch = lines[0]?.match(/^HTTP\/[\d.]+ (\d+)\s*(.*)?$/i);
    if (statusMatch) {
      result.status = parseInt(statusMatch[1]);
      result.statusText = statusMatch[2] || '';
      
      // Parse headers
      result.headers = {};
      let bodyStartIndex = 1;
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line === '') {
          bodyStartIndex = i + 1;
          break;
        }
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length > 0) {
          result.headers[key.trim()] = valueParts.join(':').trim();
          if (key.toLowerCase() === 'content-type') {
            result.contentType = valueParts.join(':').trim();
          }
        }
      }
      
      // Parse body
      const bodyStr = lines.slice(bodyStartIndex).join('\n').trim();
      if (bodyStr) {
        try {
          result.body = JSON.parse(bodyStr);
        } catch {
          result.body = bodyStr;
        }
      }
      
      return result;
    }
    
    // Try as XML
    if (input.trim().startsWith('<')) {
      return { body: input, contentType: 'application/xml' };
    }
    
    return null;
  }
}

function formatJson(obj: unknown, indent: number = 2): string {
  return JSON.stringify(obj, null, indent);
}

function formatXml(xml: string): string {
  let formatted = '';
  let indent = 0;
  const parts = xml.replace(/>\s*</g, '><').split(/(<[^>]+>)/);
  
  parts.forEach(part => {
    if (!part.trim()) return;
    
    if (part.match(/^<\/\w/)) {
      indent--;
    }
    
    formatted += '  '.repeat(Math.max(0, indent)) + part + '\n';
    
    if (part.match(/^<\w[^>]*[^\/]>$/)) {
      indent++;
    }
  });
  
  return formatted.trim();
}

export default function ApiResponseFormatter() {
  const t = useTranslations('tools.api-response-formatter');
  const tCommon = useTranslations('tools');
  const [input, setInput] = useState('');
  const [indentSize, setIndentSize] = useState(2);
  const [sortKeys, setSortKeys] = useState(false);
  const [copied, setCopied] = useState(false);

  const parsed = useMemo(() => {
    if (!input.trim()) return null;
    return parseResponse(input);
  }, [input]);

  const formattedBody = useMemo(() => {
    if (!parsed?.body) return '';
    
    if (typeof parsed.body === 'string') {
      if (parsed.contentType?.includes('xml')) {
        return formatXml(parsed.body);
      }
      return parsed.body;
    }
    
    let obj: unknown = parsed.body;
    if (sortKeys && typeof obj === 'object' && obj !== null) {
      obj = sortObject(obj);
    }
    
    return formatJson(obj, indentSize);
  }, [parsed, indentSize, sortKeys]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(formattedBody);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [formattedBody]);

  const handleClear = useCallback(() => {
    setInput('');
  }, []);

  const loadExample = useCallback((type: 'json' | 'http' | 'xml') => {
    const examples = {
      json: `{"users":[{"id":1,"name":"John Doe","email":"john@example.com","roles":["admin","user"]},{"id":2,"name":"Jane Smith","email":"jane@example.com","roles":["user"]}],"total":2,"page":1}`,
      http: `HTTP/1.1 200 OK
Content-Type: application/json
X-Request-Id: abc123
Cache-Control: no-cache

{"success":true,"data":{"id":123,"message":"Operation completed"},"timestamp":"2024-01-15T10:30:00Z"}`,
      xml: `<?xml version="1.0" encoding="UTF-8"?><response><status>success</status><data><user><id>1</id><name>John</name></user></data></response>`,
    };
    setInput(examples[type]);
  }, []);

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            API Response {tCommon('input')}
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => loadExample('json')}
              className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              JSON
            </button>
            <button
              onClick={() => loadExample('http')}
              className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              HTTP
            </button>
            <button
              onClick={() => loadExample('xml')}
              className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              XML
            </button>
          </div>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("inputPlaceholder")}
          className="w-full h-48 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm resize-none"
        />
      </div>

      {/* Options */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-700 dark:text-gray-300">{t('indent')}:</label>
          <select
            value={indentSize}
            onChange={(e) => setIndentSize(parseInt(e.target.value))}
            className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
          >
            <option value={2}>2 {t('spaces')}</option>
            <option value={4}>4 {t('spaces')}</option>
            <option value={0}>{t('minified')}</option>
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            checked={sortKeys}
            onChange={(e) => setSortKeys(e.target.checked)}
            className="rounded border-gray-300 dark:border-gray-600"
          />
          {t('sortKeysAlphabetically')}
        </label>
        <button
          onClick={handleClear}
          className="px-4 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          {tCommon('clear')}
        </button>
      </div>

      {/* Error */}
      {input.trim() && !parsed && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
          {t('unableToParse')}
        </div>
      )}

      {/* Parsed Result */}
      {parsed && (
        <div className="space-y-4">
          {/* Status and Headers */}
          {(parsed.status || parsed.headers) && (
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              {parsed.status && (
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2 py-0.5 text-sm font-medium rounded ${
                    parsed.status < 300 ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' :
                    parsed.status < 400 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300' :
                    'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'
                  }`}>
                    {parsed.status}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">{parsed.statusText}</span>
                </div>
              )}
              {parsed.headers && Object.keys(parsed.headers).length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('headers')}</h4>
                  <div className="space-y-1">
                    {Object.entries(parsed.headers).map(([key, value]) => (
                      <div key={key} className="text-sm font-mono">
                        <span className="text-blue-600 dark:text-blue-400">{key}:</span>
                        <span className="text-gray-600 dark:text-gray-400 ml-2">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Formatted Body */}
          {formattedBody && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Formatted {tCommon('output')}
                  {parsed.contentType && (
                    <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                      ({parsed.contentType})
                    </span>
                  )}
                </label>
                <button
                  onClick={handleCopy}
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  {copied ? tCommon('copied') : tCommon('copy')}
                </button>
              </div>
              <pre className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-x-auto text-sm font-mono text-gray-800 dark:text-gray-200 max-h-96">
                {formattedBody}
              </pre>
            </div>
          )}

          {/* Stats */}
          {typeof parsed.body === 'object' && parsed.body !== null && (
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span>{t('keys')}: {countKeys(parsed.body)}</span>
              <span>{t('depth')}: {getDepth(parsed.body)}</span>
              <span>{t('size')}: {new Blob([formattedBody]).size} {t('bytes')}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function sortObject(obj: unknown): unknown {
  if (Array.isArray(obj)) {
    return obj.map(sortObject);
  }
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj as Record<string, unknown>)
      .sort()
      .reduce((result, key) => {
        result[key] = sortObject((obj as Record<string, unknown>)[key]);
        return result;
      }, {} as Record<string, unknown>);
  }
  return obj;
}

function countKeys(obj: unknown): number {
  if (Array.isArray(obj)) {
    return obj.reduce((sum, item) => sum + countKeys(item), 0);
  }
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).length + 
      Object.values(obj as Record<string, unknown>).reduce((sum: number, val) => sum + countKeys(val), 0);
  }
  return 0;
}

function getDepth(obj: unknown, current: number = 0): number {
  if (Array.isArray(obj)) {
    return obj.length === 0 ? current : Math.max(...obj.map(item => getDepth(item, current + 1)));
  }
  if (obj !== null && typeof obj === 'object') {
    const values = Object.values(obj as Record<string, unknown>);
    return values.length === 0 ? current : Math.max(...values.map(val => getDepth(val, current + 1)));
  }
  return current;
}
