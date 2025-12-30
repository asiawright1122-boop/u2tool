'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';

export type ExtractType = 'email' | 'url' | 'phone' | 'ip' | 'number' | 'hashtag' | 'mention';

// 提取正则表达式 - 导出供测试使用
export const extractPatterns: Record<ExtractType, RegExp> = {
  email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
  url: /https?:\/\/[^\s<>"{}|\\^`[\]]+/g,
  phone: /(?:\+?[1-9]\d{0,2}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/g,
  ip: /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g,
  number: /-?\d+(?:\.\d+)?/g,
  hashtag: /#[a-zA-Z0-9_\u4e00-\u9fa5]+/g,
  mention: /@[a-zA-Z0-9_]+/g,
};

// 提取函数 - 导出供测试使用
export function extractFromText(text: string, type: ExtractType): string[] {
  const pattern = extractPatterns[type];
  const matches = text.match(pattern) || [];
  return [...new Set(matches)]; // 去重
}

export function extractAll(text: string): Record<ExtractType, string[]> {
  const result: Record<ExtractType, string[]> = {
    email: [],
    url: [],
    phone: [],
    ip: [],
    number: [],
    hashtag: [],
    mention: [],
  };
  
  for (const type of Object.keys(extractPatterns) as ExtractType[]) {
    result[type] = extractFromText(text, type);
  }
  
  return result;
}

export default function TextExtractor() {
  const t = useTranslations('tools');
  const [input, setInput] = useState('');
  const [extractType, setExtractType] = useState<ExtractType | 'all'>('email');
  const [results, setResults] = useState<string[]>([]);
  const [allResults, setAllResults] = useState<Record<ExtractType, string[]> | null>(null);
  const [copied, setCopied] = useState(false);

  const handleExtract = useCallback(() => {
    if (extractType === 'all') {
      const all = extractAll(input);
      setAllResults(all);
      setResults([]);
    } else {
      const extracted = extractFromText(input, extractType);
      setResults(extracted);
      setAllResults(null);
    }
  }, [input, extractType]);

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyAll = async () => {
    const text = results.join('\n');
    await handleCopy(text);
  };

  const handleClear = () => {
    setInput('');
    setResults([]);
    setAllResults(null);
  };

  const loadExample = () => {
    setInput(`联系我们：support@example.com 或 sales@company.org
访问我们的网站：https://www.example.com/page?id=123
电话：+86 138-1234-5678 或 (021) 1234-5678
服务器 IP：192.168.1.1 和 10.0.0.255
价格：$99.99 和 ¥688
关注我们 @twitter_user #开发者工具 #DevTools`);
  };

  const extractTypes: { value: ExtractType | 'all'; label: string }[] = [
    { value: 'email', label: t('extractor.email') },
    { value: 'url', label: t('extractor.url') },
    { value: 'phone', label: t('extractor.phone') },
    { value: 'ip', label: t('extractor.ip') },
    { value: 'number', label: t('extractor.number') },
    { value: 'hashtag', label: t('extractor.hashtag') },
    { value: 'mention', label: t('extractor.mention') },
    { value: 'all', label: t('all') },
  ];

  const totalResults = allResults 
    ? Object.values(allResults).reduce((sum, arr) => sum + arr.length, 0)
    : results.length;

  return (
    <div className="space-y-4">
      {/* 控制面板 */}
      <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg space-y-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">{t('extractor.type')}</label>
            <select
              value={extractType}
              onChange={(e) => setExtractType(e.target.value as ExtractType | 'all')}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-white"
            >
              {extractTypes.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleExtract}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-sm font-medium text-white"
            >
              {t('extractor.extract')}
            </button>
            <button
              onClick={loadExample}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-sm text-gray-700 dark:text-white"
            >
              {t('extractor.loadExample')}
            </button>
            <button
              onClick={handleClear}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-sm text-gray-700 dark:text-white"
            >
              {t('clear')}
            </button>
          </div>
        </div>
      </div>

      {/* 输入区域 */}
      <div>
        <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">{t('input')}</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('extractor.placeholder')}
          className="w-full h-40 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded font-mono text-sm text-gray-900 dark:text-white resize-none focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* 结果区域 */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm text-gray-600 dark:text-gray-300">
            {t('result')} ({totalResults} {t('extractor.found')})
          </label>
          {results.length > 0 && (
            <button
              onClick={handleCopyAll}
              className={`px-2 py-1 text-xs rounded ${
                copied ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-white'
              }`}
            >
              {copied ? t('copied') : t('extractor.copyAll')}
            </button>
          )}
        </div>

        {/* 单类型结果 */}
        {results.length > 0 && (
          <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg space-y-2 max-h-64 overflow-y-auto">
            {results.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700/50 rounded group"
              >
                <span className="font-mono text-sm break-all text-gray-900 dark:text-white">{item}</span>
                <button
                  onClick={() => handleCopy(item)}
                  className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded opacity-0 group-hover:opacity-100 transition-opacity ml-2 shrink-0 text-gray-700 dark:text-white"
                >
                  {t('copy')}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* 全部类型结果 */}
        {allResults && (
          <div className="space-y-3">
            {(Object.entries(allResults) as [ExtractType, string[]][]).map(([type, items]) => (
              items.length > 0 && (
                <div key={type} className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      {extractTypes.find(t => t.value === type)?.label} ({items.length})
                    </span>
                  </div>
                  <div className="space-y-1">
                    {items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700/50 rounded group text-sm"
                      >
                        <span className="font-mono break-all text-gray-900 dark:text-white">{item}</span>
                        <button
                          onClick={() => handleCopy(item)}
                          className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded opacity-0 group-hover:opacity-100 transition-opacity ml-2 shrink-0 text-gray-700 dark:text-white"
                        >
                          {t('copy')}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>
        )}

        {/* 无结果提示 */}
        {totalResults === 0 && input && (
          <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-center text-gray-600 dark:text-gray-300">
            {t('extractor.noResults')}
          </div>
        )}
      </div>

      {/* 说明 */}
      <div className="p-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg text-xs text-gray-600 dark:text-gray-300">
        <div className="font-medium mb-1">{t('extractor.supportedTypes')}</div>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>{t('extractor.email')}</strong>: user@example.com</li>
          <li><strong>{t('extractor.url')}</strong>: https://example.com</li>
          <li><strong>{t('extractor.phone')}</strong>: +86 138-1234-5678</li>
          <li><strong>{t('extractor.ip')}</strong>: 192.168.1.1</li>
          <li><strong>{t('extractor.number')}</strong>: 123, -45.67</li>
          <li><strong>{t('extractor.hashtag')}</strong>: #DevTools</li>
          <li><strong>{t('extractor.mention')}</strong>: @username</li>
        </ul>
      </div>
    </div>
  );
}
