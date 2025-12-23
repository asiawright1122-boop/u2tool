'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

const HTTP_CODES: Record<string, { name: string; desc: string }> = {
  '100': { name: 'Continue', desc: 'The server has received the request headers' },
  '101': { name: 'Switching Protocols', desc: 'The server is switching protocols' },
  '200': { name: 'OK', desc: 'The request has succeeded' },
  '201': { name: 'Created', desc: 'The request has been fulfilled and a new resource created' },
  '204': { name: 'No Content', desc: 'The server successfully processed the request but returns no content' },
  '301': { name: 'Moved Permanently', desc: 'The resource has been moved permanently' },
  '302': { name: 'Found', desc: 'The resource has been found at a different URI temporarily' },
  '304': { name: 'Not Modified', desc: 'The resource has not been modified since last request' },
  '400': { name: 'Bad Request', desc: 'The server cannot process the request due to client error' },
  '401': { name: 'Unauthorized', desc: 'Authentication is required and has failed or not been provided' },
  '403': { name: 'Forbidden', desc: 'The server refuses to authorize the request' },
  '404': { name: 'Not Found', desc: 'The requested resource could not be found' },
  '405': { name: 'Method Not Allowed', desc: 'The request method is not supported for the resource' },
  '408': { name: 'Request Timeout', desc: 'The server timed out waiting for the request' },
  '429': { name: 'Too Many Requests', desc: 'The user has sent too many requests in a given time' },
  '500': { name: 'Internal Server Error', desc: 'The server encountered an unexpected condition' },
  '502': { name: 'Bad Gateway', desc: 'The server received an invalid response from upstream' },
  '503': { name: 'Service Unavailable', desc: 'The server is currently unavailable' },
  '504': { name: 'Gateway Timeout', desc: 'The server did not receive a timely response from upstream' },
};

export default function HttpStatus() {
  const t = useTranslations('tools');
  const [search, setSearch] = useState('');

  const filtered = Object.entries(HTTP_CODES).filter(([code, info]) =>
    code.includes(search) || info.name.toLowerCase().includes(search.toLowerCase())
  );

  const getColor = (code: string) => {
    if (code.startsWith('2')) return 'bg-green-900/50 border-green-700';
    if (code.startsWith('3')) return 'bg-blue-900/50 border-blue-700';
    if (code.startsWith('4')) return 'bg-yellow-900/50 border-yellow-700';
    if (code.startsWith('5')) return 'bg-red-900/50 border-red-700';
    return 'bg-gray-800 border-gray-700';
  };

  return (
    <div className="space-y-4">
      <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg" placeholder={t('httpStatus.search')} />
      <div className="grid md:grid-cols-2 gap-3 max-h-[500px] overflow-auto">
        {filtered.map(([code, info]) => (
          <div key={code} className={`p-4 rounded-lg border ${getColor(code)}`}>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold">{code}</span>
              <span className="font-medium">{info.name}</span>
            </div>
            <p className="text-sm text-gray-300 mt-1">{info.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
