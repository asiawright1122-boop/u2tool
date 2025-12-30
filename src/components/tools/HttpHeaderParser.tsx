'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface ParsedHeader {
  name: string;
  value: string;
  description: string;
}

const headerDescriptions: Record<string, string> = {
  'content-type': 'Indicates the media type of the resource',
  'content-length': 'The size of the response body in bytes',
  'cache-control': 'Directives for caching mechanisms',
  'authorization': 'Contains credentials for authenticating the client',
  'accept': 'Media types acceptable for the response',
  'accept-encoding': 'Acceptable encodings for the response',
  'accept-language': 'Preferred languages for the response',
  'user-agent': 'Information about the client application',
  'host': 'The domain name of the server',
  'connection': 'Control options for the current connection',
  'cookie': 'HTTP cookies previously sent by the server',
  'set-cookie': 'Send cookies from the server to the client',
  'location': 'URL to redirect to',
  'x-forwarded-for': 'Original IP address of the client',
  'x-requested-with': 'Identifies Ajax requests',
  'origin': 'Indicates where a fetch originates from',
  'referer': 'The address of the previous web page',
  'content-encoding': 'The encoding used on the data',
  'transfer-encoding': 'The form of encoding used to transfer the body',
  'access-control-allow-origin': 'Indicates whether the response can be shared',
};

export function parseHeaders(input: string): ParsedHeader[] {
  const lines = input.split('\n').filter(line => line.trim());
  const headers: ParsedHeader[] = [];

  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const name = line.substring(0, colonIndex).trim();
      const value = line.substring(colonIndex + 1).trim();
      const description = headerDescriptions[name.toLowerCase()] || '';
      headers.push({ name, value, description });
    }
  }

  return headers;
}

export default function HttpHeaderParser() {
  const t = useTranslations('tools');
  const [input, setInput] = useState('');
  const [headers, setHeaders] = useState<ParsedHeader[]>([]);

  const handleParse = () => {
    setHeaders(parseHeaders(input));
  };

  const loadExample = () => {
    const example = `Content-Type: application/json; charset=utf-8
Content-Length: 1234
Cache-Control: max-age=3600, public
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Accept: application/json
Accept-Encoding: gzip, deflate, br
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0
Host: api.example.com
Connection: keep-alive
X-Requested-With: XMLHttpRequest`;
    setInput(example);
    setHeaders(parseHeaders(example));
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium">{t('httpHeader.input')}</label>
          <button
            onClick={loadExample}
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            {t('httpHeader.loadExample')}
          </button>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('httpHeader.placeholder')}
          className="w-full h-48 p-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg font-mono text-sm text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <button onClick={handleParse} className="btn-primary w-full">
        {t('httpHeader.parse')}
      </button>

      {headers.length > 0 && (
        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-900 dark:text-white">{t('httpHeader.parsed')} ({headers.length})</div>
          <div className="space-y-2">
            {headers.map((header, index) => (
              <div key={index} className="p-4 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg">
                <div className="flex flex-wrap items-start gap-2">
                  <span className="px-2 py-1 bg-blue-600 text-white rounded text-sm font-medium">
                    {header.name}
                  </span>
                  <span className="flex-1 font-mono text-sm text-gray-600 dark:text-gray-300 break-all">
                    {header.value}
                  </span>
                </div>
                {header.description && (
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-300">{header.description}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
