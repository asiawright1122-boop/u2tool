'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';

interface StatusCode {
  code: number;
  name: string;
  description: string;
  category: string;
  solutions?: string[];
}

const HTTP_STATUS_CODES: StatusCode[] = [
  // 1xx Informational
  { code: 100, name: 'Continue', description: 'The server has received the request headers and the client should proceed to send the request body.', category: '1xx' },
  { code: 101, name: 'Switching Protocols', description: 'The server is switching protocols as requested by the client.', category: '1xx' },
  { code: 102, name: 'Processing', description: 'The server has received and is processing the request, but no response is available yet.', category: '1xx' },
  { code: 103, name: 'Early Hints', description: 'Used to return some response headers before final HTTP message.', category: '1xx' },
  
  // 2xx Success
  { code: 200, name: 'OK', description: 'The request has succeeded. The meaning depends on the HTTP method used.', category: '2xx' },
  { code: 201, name: 'Created', description: 'The request has been fulfilled and a new resource has been created.', category: '2xx' },
  { code: 202, name: 'Accepted', description: 'The request has been accepted for processing, but processing has not been completed.', category: '2xx' },
  { code: 203, name: 'Non-Authoritative Information', description: 'The returned metadata is not exactly the same as available from the origin server.', category: '2xx' },
  { code: 204, name: 'No Content', description: 'The server successfully processed the request but is not returning any content.', category: '2xx' },
  { code: 205, name: 'Reset Content', description: 'The server successfully processed the request and is not returning any content, but requires the requester to reset the document view.', category: '2xx' },
  { code: 206, name: 'Partial Content', description: 'The server is delivering only part of the resource due to a range header sent by the client.', category: '2xx' },
  
  // 3xx Redirection
  { code: 300, name: 'Multiple Choices', description: 'The request has more than one possible response. The user or user agent should choose one.', category: '3xx' },
  { code: 301, name: 'Moved Permanently', description: 'The URL of the requested resource has been changed permanently. The new URL is given in the response.', category: '3xx', solutions: ['Update bookmarks and links to the new URL', 'Implement proper redirects on the server'] },
  { code: 302, name: 'Found', description: 'The URI of requested resource has been changed temporarily. Further changes might be made in the future.', category: '3xx' },
  { code: 303, name: 'See Other', description: 'The server sent this response to direct the client to get the requested resource at another URI with a GET request.', category: '3xx' },
  { code: 304, name: 'Not Modified', description: 'This is used for caching purposes. The response has not been modified, so the client can continue to use the cached version.', category: '3xx' },
  { code: 307, name: 'Temporary Redirect', description: 'The server sends this response to direct the client to get the requested resource at another URI with same method.', category: '3xx' },
  { code: 308, name: 'Permanent Redirect', description: 'The resource is now permanently located at another URI, specified by the Location header.', category: '3xx' },
  
  // 4xx Client Errors
  { code: 400, name: 'Bad Request', description: 'The server cannot process the request due to a client error (malformed request syntax, invalid request message framing, or deceptive request routing).', category: '4xx', solutions: ['Check request syntax and format', 'Validate request parameters', 'Ensure proper Content-Type header'] },
  { code: 401, name: 'Unauthorized', description: 'Authentication is required and has failed or has not been provided.', category: '4xx', solutions: ['Provide valid authentication credentials', 'Check if token has expired', 'Verify API key is correct'] },
  { code: 403, name: 'Forbidden', description: 'The client does not have access rights to the content. Unlike 401, the client identity is known to the server.', category: '4xx', solutions: ['Check user permissions', 'Verify access rights', 'Contact administrator for access'] },
  { code: 404, name: 'Not Found', description: 'The server cannot find the requested resource. The URL is not recognized.', category: '4xx', solutions: ['Check the URL for typos', 'Verify the resource exists', 'Check if the resource was moved or deleted'] },
  { code: 405, name: 'Method Not Allowed', description: 'The request method is known by the server but is not supported by the target resource.', category: '4xx', solutions: ['Use a different HTTP method', 'Check API documentation for allowed methods'] },
  { code: 406, name: 'Not Acceptable', description: 'The server cannot produce a response matching the list of acceptable values defined in the request headers.', category: '4xx' },
  { code: 407, name: 'Proxy Authentication Required', description: 'Authentication with a proxy is required.', category: '4xx' },
  { code: 408, name: 'Request Timeout', description: 'The server timed out waiting for the request.', category: '4xx', solutions: ['Retry the request', 'Check network connection', 'Increase timeout settings'] },
  { code: 409, name: 'Conflict', description: 'The request conflicts with the current state of the server.', category: '4xx', solutions: ['Resolve the conflict', 'Refresh and retry', 'Check for concurrent modifications'] },
  { code: 410, name: 'Gone', description: 'The requested content has been permanently deleted from server, with no forwarding address.', category: '4xx' },
  { code: 411, name: 'Length Required', description: 'The server rejected the request because the Content-Length header field is not defined.', category: '4xx' },
  { code: 412, name: 'Precondition Failed', description: 'The client has indicated preconditions in its headers which the server does not meet.', category: '4xx' },
  { code: 413, name: 'Payload Too Large', description: 'Request entity is larger than limits defined by server.', category: '4xx', solutions: ['Reduce payload size', 'Compress the data', 'Split into multiple requests'] },
  { code: 414, name: 'URI Too Long', description: 'The URI requested by the client is longer than the server is willing to interpret.', category: '4xx' },
  { code: 415, name: 'Unsupported Media Type', description: 'The media format of the requested data is not supported by the server.', category: '4xx', solutions: ['Check Content-Type header', 'Use supported media format'] },
  { code: 416, name: 'Range Not Satisfiable', description: 'The range specified by the Range header field in the request cannot be fulfilled.', category: '4xx' },
  { code: 417, name: 'Expectation Failed', description: 'The expectation given in the Expect request header could not be met by the server.', category: '4xx' },
  { code: 418, name: "I'm a Teapot", description: 'The server refuses to brew coffee because it is a teapot. (April Fools joke from 1998)', category: '4xx' },
  { code: 422, name: 'Unprocessable Entity', description: 'The request was well-formed but was unable to be followed due to semantic errors.', category: '4xx', solutions: ['Check request body for validation errors', 'Verify data types and formats'] },
  { code: 429, name: 'Too Many Requests', description: 'The user has sent too many requests in a given amount of time (rate limiting).', category: '4xx', solutions: ['Wait before retrying', 'Implement rate limiting on client', 'Request higher rate limits'] },
  
  // 5xx Server Errors
  { code: 500, name: 'Internal Server Error', description: 'The server has encountered a situation it does not know how to handle.', category: '5xx', solutions: ['Check server logs', 'Contact server administrator', 'Retry later'] },
  { code: 501, name: 'Not Implemented', description: 'The request method is not supported by the server and cannot be handled.', category: '5xx' },
  { code: 502, name: 'Bad Gateway', description: 'The server, while acting as a gateway or proxy, received an invalid response from the upstream server.', category: '5xx', solutions: ['Check upstream server status', 'Verify proxy configuration', 'Retry later'] },
  { code: 503, name: 'Service Unavailable', description: 'The server is not ready to handle the request. Common causes are maintenance or overload.', category: '5xx', solutions: ['Wait and retry', 'Check server status page', 'Contact support'] },
  { code: 504, name: 'Gateway Timeout', description: 'The server, while acting as a gateway or proxy, did not get a response in time from the upstream server.', category: '5xx', solutions: ['Retry the request', 'Check upstream server', 'Increase timeout settings'] },
  { code: 505, name: 'HTTP Version Not Supported', description: 'The HTTP version used in the request is not supported by the server.', category: '5xx' },
  { code: 507, name: 'Insufficient Storage', description: 'The server is unable to store the representation needed to complete the request.', category: '5xx' },
  { code: 508, name: 'Loop Detected', description: 'The server detected an infinite loop while processing the request.', category: '5xx' },
  { code: 511, name: 'Network Authentication Required', description: 'The client needs to authenticate to gain network access.', category: '5xx' },
];

const CATEGORY_COLORS: Record<string, string> = {
  '1xx': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  '2xx': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  '3xx': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  '4xx': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  '5xx': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
};

const CATEGORY_NAMES: Record<string, string> = {
  '1xx': 'Informational',
  '2xx': 'Success',
  '3xx': 'Redirection',
  '4xx': 'Client Error',
  '5xx': 'Server Error',
};

export default function HttpStatusCodeReference() {
  const t = useTranslations('tools');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCode, setSelectedCode] = useState<StatusCode | null>(null);

  const filteredCodes = useMemo(() => {
    return HTTP_STATUS_CODES.filter(status => {
      const matchesSearch = search === '' || 
        status.code.toString().includes(search) ||
        status.name.toLowerCase().includes(search.toLowerCase()) ||
        status.description.toLowerCase().includes(search.toLowerCase());
      
      const matchesCategory = !selectedCategory || status.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  const categories = ['1xx', '2xx', '3xx', '4xx', '5xx'];

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('httpStatus.search')}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              !selectedCategory 
                ? 'bg-gray-800 text-white dark:bg-white dark:text-gray-800' 
                : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {t('all')}
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === cat 
                  ? CATEGORY_COLORS[cat]
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Status Code Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCodes.map(status => (
          <div
            key={status.code}
            onClick={() => setSelectedCode(status)}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 cursor-pointer transition-colors bg-white dark:bg-gray-800"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-2 py-1 rounded text-sm font-bold ${CATEGORY_COLORS[status.category]}`}>
                {status.code}
              </span>
              <span className="font-medium text-gray-900 dark:text-white truncate">
                {status.name}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {status.description}
            </p>
          </div>
        ))}
      </div>

      {filteredCodes.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          {t('nav.noResults')}
        </div>
      )}

      {/* Detail Modal */}
      {selectedCode && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedCode(null)}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-xl max-w-lg w-full p-6 shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-4 mb-4">
              <span className={`px-3 py-2 rounded-lg text-xl font-bold ${CATEGORY_COLORS[selectedCode.category]}`}>
                {selectedCode.code}
              </span>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {selectedCode.name}
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {CATEGORY_NAMES[selectedCode.category]}
                </span>
              </div>
            </div>
            
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {selectedCode.description}
            </p>

            {selectedCode.solutions && selectedCode.solutions.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Solutions:
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  {selectedCode.solutions.map((solution, idx) => (
                    <li key={idx}>{solution}</li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={() => setSelectedCode(null)}
              className="mt-6 w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              {t('clear')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
