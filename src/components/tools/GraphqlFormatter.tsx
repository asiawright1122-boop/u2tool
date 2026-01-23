'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function GraphqlFormatter() {
  const t = useTranslations('tools.graphql-formatter');
  const tc = useTranslations('tools');
  
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const formatGraphQL = () => {
    if (!input.trim()) return;
    setError('');

    try {
      const formatted = prettyPrintGraphQL(input);
      setOutput(formatted);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid GraphQL');
    }
  };

  const minifyGraphQL = () => {
    if (!input.trim()) return;
    setError('');

    try {
      // Remove comments and extra whitespace
      const minified = input
        .replace(/#[^\n]*/g, '') // Remove comments
        .replace(/\s+/g, ' ') // Collapse whitespace
        .replace(/\s*([{}():,])\s*/g, '$1') // Remove space around punctuation
        .trim();
      setOutput(minified);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid GraphQL');
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {

    return () => {

      if (timerRef.current) clearTimeout(timerRef.current);

    };

  }, []);


  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {tc('input')}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('placeholder')}
            rows={15}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
          />
        </div>

        {/* Output */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {tc('output')}
            </label>
            {output && (
              <button
                onClick={copyToClipboard}
                className={`px-3 py-1 rounded text-sm ${
                  copied ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-600 hover:bg-gray-300'
                }`}
              >
                {copied ? tc('copied') : tc('copy')}
              </button>
            )}
          </div>
          <textarea
            value={output}
            readOnly
            placeholder={tc('outputPlaceholder')}
            rows={15}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={formatGraphQL}
          disabled={!input.trim()}
          className="flex-1 py-3 bg-pink-600 text-white rounded-lg font-medium hover:bg-pink-700 disabled:opacity-50"
        >
          {tc('format')}
        </button>
        <button
          onClick={minifyGraphQL}
          disabled={!input.trim()}
          className="flex-1 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 disabled:opacity-50"
        >
          {t('minify')}
        </button>
      </div>

      {/* Example */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
        <h4 className="font-medium text-gray-900 dark:text-white mb-2">{t('example')}</h4>
        <pre className="text-xs text-gray-600 dark:text-gray-400 overflow-x-auto">
{`query GetUser($id: ID!) {
  user(id: $id) {
    id
    name
    email
    posts {
      title
      createdAt
    }
  }
}`}
        </pre>
      </div>
    </div>
  );
}

// Simple GraphQL pretty printer
function prettyPrintGraphQL(query: string): string {
  let result = '';
  let indent = 0;
  let inString = false;
  let stringChar = '';
  
  // Normalize whitespace first
  const normalized = query.replace(/\s+/g, ' ').trim();
  
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized[i];
    const nextChar = normalized[i + 1];
    
    // Handle strings
    if ((char === '"' || char === "'") && normalized[i - 1] !== '\\') {
      if (!inString) {
        inString = true;
        stringChar = char;
      } else if (char === stringChar) {
        inString = false;
      }
      result += char;
      continue;
    }
    
    if (inString) {
      result += char;
      continue;
    }
    
    // Handle brackets and formatting
    switch (char) {
      case '{':
        result += ' {\n' + '  '.repeat(++indent);
        break;
      case '}':
        result = result.trimEnd();
        result += '\n' + '  '.repeat(--indent) + '}';
        if (nextChar && nextChar !== '}' && nextChar !== ')' && nextChar !== ',') {
          result += '\n' + '  '.repeat(indent);
        }
        break;
      case '(':
        result += '(';
        break;
      case ')':
        result += ')';
        break;
      case ',':
        result += ',\n' + '  '.repeat(indent);
        break;
      case ':':
        result += ': ';
        break;
      case ' ':
        // Skip extra spaces
        if (result[result.length - 1] !== ' ' && 
            result[result.length - 1] !== '\n' &&
            result[result.length - 1] !== '(' &&
            result[result.length - 1] !== ':') {
          result += ' ';
        }
        break;
      default:
        result += char;
    }
  }
  
  return result.trim();
}
