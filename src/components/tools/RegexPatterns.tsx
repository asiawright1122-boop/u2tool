'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface Pattern {
  name: string;
  pattern: string;
  description: string;
  example: string;
}

const patterns: Pattern[] = [
  { name: 'email', pattern: '^[\\w.-]+@[\\w.-]+\\.\\w+$', description: 'Email address', example: 'user@example.com' },
  { name: 'url', pattern: '^https?:\\/\\/[\\w.-]+(?:\\.[\\w.-]+)+[\\w\\-._~:/?#[\\]@!$&\'()*+,;=]*$', description: 'URL', example: 'https://example.com/path' },
  { name: 'phone', pattern: '^\\+?[1-9]\\d{1,14}$', description: 'Phone (E.164)', example: '+1234567890' },
  { name: 'ipv4', pattern: '^(?:(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$', description: 'IPv4 address', example: '192.168.1.1' },
  { name: 'ipv6', pattern: '^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$', description: 'IPv6 address', example: '2001:0db8:85a3:0000:0000:8a2e:0370:7334' },
  { name: 'date', pattern: '^\\d{4}-\\d{2}-\\d{2}$', description: 'Date (YYYY-MM-DD)', example: '2024-01-15' },
  { name: 'time', pattern: '^\\d{2}:\\d{2}(:\\d{2})?$', description: 'Time (HH:MM:SS)', example: '14:30:00' },
  { name: 'hex', pattern: '^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$', description: 'Hex color', example: '#FF5733' },
  { name: 'uuid', pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$', description: 'UUID', example: '550e8400-e29b-41d4-a716-446655440000' },
  { name: 'creditCard', pattern: '^\\d{4}[- ]?\\d{4}[- ]?\\d{4}[- ]?\\d{4}$', description: 'Credit card', example: '4111-1111-1111-1111' },
  { name: 'zipUS', pattern: '^\\d{5}(-\\d{4})?$', description: 'US ZIP code', example: '12345-6789' },
  { name: 'username', pattern: '^[a-zA-Z][a-zA-Z0-9_]{2,15}$', description: 'Username (3-16 chars)', example: 'user_123' },
  { name: 'password', pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$', description: 'Strong password', example: 'Password1' },
  { name: 'slug', pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$', description: 'URL slug', example: 'my-blog-post' },
  { name: 'chinese', pattern: '[\\u4e00-\\u9fa5]+', description: 'Chinese characters', example: '你好世界' },
  { name: 'japanese', pattern: '[\\u3040-\\u309F\\u30A0-\\u30FF]+', description: 'Japanese (Hiragana/Katakana)', example: 'こんにちは' },
];

export default function RegexPatterns() {
  const t = useTranslations('tools');
  const [testInput, setTestInput] = useState('');
  const [selectedPattern, setSelectedPattern] = useState<Pattern | null>(null);
  const [copied, setCopied] = useState('');

  const copyPattern = (pattern: string) => {
    navigator.clipboard.writeText(pattern);
    setCopied(pattern);
    setTimeout(() => setCopied(''), 2000);
  };

  const testPattern = (pattern: Pattern) => {
    setSelectedPattern(pattern);
    setTestInput(pattern.example);
  };

  const isMatch = selectedPattern && testInput
    ? new RegExp(selectedPattern.pattern).test(testInput)
    : null;

  return (
    <div className="space-y-4">
      {selectedPattern && (
        <div className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-900 dark:text-white">{t(`regexPatterns.${selectedPattern.name}`)}</span>
            <button
              onClick={() => setSelectedPattern(null)}
              className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white"
            >
              ✕
            </button>
          </div>
          <code className="block bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-2 rounded text-sm text-green-600 dark:text-green-400 break-all">
            {selectedPattern.pattern}
          </code>
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('regexPatterns.test')}</label>
            <input
              type="text"
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded p-2 text-gray-900 dark:text-white"
              placeholder={selectedPattern.example}
            />
          </div>
          {testInput && (
            <div className={`text-sm ${isMatch ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {isMatch ? '✅ ' + t('regexPatterns.match') : '❌ ' + t('regexPatterns.noMatch')}
            </div>
          )}
        </div>
      )}

      <div className="grid gap-2">
        {patterns.map((p) => (
          <div
            key={p.name}
            className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-3 flex items-center justify-between hover:bg-gray-200 dark:hover:bg-gray-750"
          >
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm text-gray-900 dark:text-white">{t(`regexPatterns.${p.name}`)}</div>
              <code className="text-xs text-gray-500 dark:text-gray-300 truncate block">{p.pattern}</code>
            </div>
            <div className="flex gap-2 ml-2">
              <button
                onClick={() => testPattern(p)}
                className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 px-2 py-1 rounded"
              >
                {t('regexPatterns.tryIt')}
              </button>
              <button
                onClick={() => copyPattern(p.pattern)}
                className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded"
              >
                {copied === p.pattern ? '✓' : t('copy')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
