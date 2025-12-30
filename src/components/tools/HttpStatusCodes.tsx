'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

const statusCodes = [
  // 1xx
  { code: 100, status: 'Continue', desc: 'The server has received the request headers and the client should proceed to send the request body.' },
  { code: 101, status: 'Switching Protocols', desc: 'The requester has asked the server to switch protocols and the server has agreed to do so.' },
  { code: 102, status: 'Processing', desc: 'A WebDAV request may contain many sub-requests involving file operations.' },
  { code: 103, status: 'Early Hints', desc: 'Used to return some response headers before final HTTP message.' },

  // 2xx
  { code: 200, status: 'OK', desc: 'Standard response for successful HTTP requests.' },
  { code: 201, status: 'Created', desc: 'The request has been fulfilled, resulting in the creation of a new resource.' },
  { code: 202, status: 'Accepted', desc: 'The request has been accepted for processing, but the processing has not been completed.' },
  { code: 203, status: 'Non-Authoritative Information', desc: 'The server is a transforming proxy (e.g. a Web accelerator) that received a 200 OK from its origin, but is returning a modified version of the origin\'s response.' },
  { code: 204, status: 'No Content', desc: 'The server successfully processed the request and is not returning any content.' },
  { code: 205, status: 'Reset Content', desc: 'The server successfully processed the request, but is not returning any content. Unlike a 204 response, this response requires that the requester reset the document view.' },
  { code: 206, status: 'Partial Content', desc: 'The server is delivering only part of the resource (byte serving) due to a range header sent by the client.' },

  // 3xx
  { code: 300, status: 'Multiple Choices', desc: 'Indicates multiple options for the resource from which the client may choose.' },
  { code: 301, status: 'Moved Permanently', desc: 'This and all future requests should be directed to the given URI.' },
  { code: 302, status: 'Found', desc: 'Previously "Moved Temporarily". Tells the client to look at (browse to) another URL.' },
  { code: 303, status: 'See Other', desc: 'The response to the request can be found under another URI using the GET method.' },
  { code: 304, status: 'Not Modified', desc: 'Indicates that the resource has not been modified since the version specified by the request headers If-Modified-Since or If-None-Match.' },
  { code: 307, status: 'Temporary Redirect', desc: 'In this case, the request should be repeated with another URI; however, future requests should still use the original URI.' },
  { code: 308, status: 'Permanent Redirect', desc: 'The request and all future requests should be repeated using another URI.' },

  // 4xx
  { code: 400, status: 'Bad Request', desc: 'The server cannot or will not process the request due to an apparent client error.' },
  { code: 401, status: 'Unauthorized', desc: 'Similar to 403 Forbidden, but specifically for use when authentication is required and has failed or has not yet been provided.' },
  { code: 402, status: 'Payment Required', desc: 'Reserved for future use. The original intention was that this code might be used as part of some form of digital cash or micropayment scheme.' },
  { code: 403, status: 'Forbidden', desc: 'The request was valid, but the server is refusing action. The user might not have the necessary permissions for a resource.' },
  { code: 404, status: 'Not Found', desc: 'The requested resource could not be found but may be available in the future.' },
  { code: 405, status: 'Method Not Allowed', desc: 'A request method is not supported for the requested resource.' },
  { code: 406, status: 'Not Acceptable', desc: 'The requested resource is capable of generating only content not acceptable according to the Accept headers sent in the request.' },
  { code: 407, status: 'Proxy Authentication Required', desc: 'The client must first authenticate itself with the proxy.' },
  { code: 408, status: 'Request Timeout', desc: 'The server timed out waiting for the request.' },
  { code: 409, status: 'Conflict', desc: 'Indicates that the request could not be processed because of conflict in the request, such as an edit conflict.' },
  { code: 410, status: 'Gone', desc: 'Indicates that the resource requested is no longer available and will not be available again.' },
  { code: 411, status: 'Length Required', desc: 'The request did not specify the length of its content, which is required by the requested resource.' },
  { code: 412, status: 'Precondition Failed', desc: 'The server does not meet one of the preconditions that the requester put on the request.' },
  { code: 413, status: 'Payload Too Large', desc: 'The request is larger than the server is willing or able to process.' },
  { code: 414, status: 'URI Too Long', desc: 'The URI provided was too long for the server to process.' },
  { code: 415, status: 'Unsupported Media Type', desc: 'The request entity has a media type which the server or resource does not support.' },
  { code: 416, status: 'Range Not Satisfiable', desc: 'The client has asked for a portion of the file, but the server cannot supply that portion.' },
  { code: 417, status: 'Expectation Failed', desc: 'The server cannot meet the requirements of the Expect request-header field.' },
  { code: 418, status: 'I\'m a teapot', desc: 'Any attempt to brew coffee with a teapot should result in the error code "418 I\'m a teapot".' },
  { code: 421, status: 'Misdirected Request', desc: 'The request was directed at a server that is not able to produce a response.' },
  { code: 422, status: 'Unprocessable Entity', desc: 'The request was well-formed but was unable to be followed due to semantic errors.' },
  { code: 423, status: 'Locked', desc: 'The resource that is being accessed is locked.' },
  { code: 424, status: 'Failed Dependency', desc: 'The request failed because it depended on another request and that request failed.' },
  { code: 425, status: 'Too Early', desc: 'Indicates that the server is unwilling to risk processing a request that might be replayed.' },
  { code: 426, status: 'Upgrade Required', desc: 'The client should switch to a different protocol such as TLS/1.0.' },
  { code: 428, status: 'Precondition Required', desc: 'The origin server requires the request to be conditional.' },
  { code: 429, status: 'Too Many Requests', desc: 'The user has sent too many requests in a given amount of time.' },
  { code: 431, status: 'Request Header Fields Too Large', desc: 'The server is unwilling to process the request because either an individual header field, or all the header fields collectively, are too large.' },
  { code: 451, status: 'Unavailable For Legal Reasons', desc: 'A server operator has received a legal demand to deny access to a resource or to a set of resources.' },

  // 5xx
  { code: 500, status: 'Internal Server Error', desc: 'A generic error message, given when an unexpected condition was encountered and no more specific message is suitable.' },
  { code: 501, status: 'Not Implemented', desc: 'The server either does not recognize the request method, or it lacks the ability to fulfill the request.' },
  { code: 502, status: 'Bad Gateway', desc: 'The server was acting as a gateway or proxy and received an invalid response from the upstream server.' },
  { code: 503, status: 'Service Unavailable', desc: 'The server is currently unavailable (because it is overloaded or down for maintenance).' },
  { code: 504, status: 'Gateway Timeout', desc: 'The server was acting as a gateway or proxy and did not receive a timely response from the upstream server.' },
  { code: 505, status: 'HTTP Version Not Supported', desc: 'The server does not support the HTTP protocol version used in the request.' },
  { code: 506, status: 'Variant Also Negotiates', desc: 'Transparent content negotiation for the request results in a circular reference.' },
  { code: 507, status: 'Insufficient Storage', desc: 'The server is unable to store the representation needed to complete the request.' },
  { code: 508, status: 'Loop Detected', desc: 'The server detected an infinite loop while processing the request.' },
  { code: 510, status: 'Not Extended', desc: 'Further extensions to the request are required for the server to fulfill it.' },
  { code: 511, status: 'Network Authentication Required', desc: 'The client needs to authenticate to gain network access.' },
];

export default function HttpStatusCodes() {
  const t = useTranslations('tools.http-status-codes');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = statusCodes.filter(item => {
    const matchesSearch = 
      item.code.toString().includes(search) || 
      item.status.toLowerCase().includes(search.toLowerCase()) ||
      item.desc.toLowerCase().includes(search.toLowerCase());
    
    const matchesFilter = 
      filter === 'all' || 
      (filter === '1xx' && item.code >= 100 && item.code < 200) ||
      (filter === '2xx' && item.code >= 200 && item.code < 300) ||
      (filter === '3xx' && item.code >= 300 && item.code < 400) ||
      (filter === '4xx' && item.code >= 400 && item.code < 500) ||
      (filter === '5xx' && item.code >= 500 && item.code < 600);

    return matchesSearch && matchesFilter;
  });

  const getBadgeColor = (code: number) => {
    if (code >= 100 && code < 200) return 'bg-gray-200 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 border-gray-400/30 dark:border-gray-500/30';
    if (code >= 200 && code < 300) return 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30';
    if (code >= 300 && code < 400) return 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/30';
    if (code >= 400 && code < 500) return 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/30';
    if (code >= 500 && code < 600) return 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/30';
    return 'bg-gray-200 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('searchPlaceholder')}
          className="flex-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">{t('allCategories')}</option>
          <option value="1xx">{t('informational')}</option>
          <option value="2xx">{t('success')}</option>
          <option value="3xx">{t('redirection')}</option>
          <option value="4xx">{t('clientError')}</option>
          <option value="5xx">{t('serverError')}</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filtered.map((item) => (
          <div key={item.code} className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl p-6 flex flex-col md:flex-row gap-4 md:items-start hover:border-gray-400 dark:hover:border-gray-600 transition-colors">
            <div className={`flex-shrink-0 w-24 h-16 flex items-center justify-center rounded-lg border text-xl font-bold font-mono ${getBadgeColor(item.code)}`}>
              {item.code}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{item.status}</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-300">
            {t('noResults')}
          </div>
        )}
      </div>
    </div>
  );
}
