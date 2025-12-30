'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface PathResult {
  path: string;
  value: unknown;
  type: string;
}

export default function JsonPathFinder() {
  const t = useTranslations('tools');
  const [input, setInput] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [results, setResults] = useState<PathResult[]>([]);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');

  const findPaths = (obj: unknown, currentPath: string = '$'): PathResult[] => {
    const paths: PathResult[] = [];
    
    if (obj === null) {
      paths.push({ path: currentPath, value: null, type: 'null' });
    } else if (Array.isArray(obj)) {
      paths.push({ path: currentPath, value: `Array[${obj.length}]`, type: 'array' });
      obj.forEach((item, index) => {
        paths.push(...findPaths(item, `${currentPath}[${index}]`));
      });
    } else if (typeof obj === 'object') {
      paths.push({ path: currentPath, value: 'Object', type: 'object' });
      Object.entries(obj).forEach(([key, value]) => {
        const newPath = /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key) 
          ? `${currentPath}.${key}` 
          : `${currentPath}["${key}"]`;
        paths.push(...findPaths(value, newPath));
      });
    } else {
      paths.push({ path: currentPath, value: obj, type: typeof obj });
    }
    
    return paths;
  };

  const handleAnalyze = () => {
    setError('');
    setResults([]);
    try {
      const parsed = JSON.parse(input);
      const allPaths = findPaths(parsed);
      setResults(allPaths);
    } catch {
      setError(t('json.invalidJson'));
    }
  };

  const filteredResults = searchValue
    ? results.filter(r => 
        r.path.toLowerCase().includes(searchValue.toLowerCase()) ||
        String(r.value).toLowerCase().includes(searchValue.toLowerCase())
      )
    : results;

  const copyPath = (path: string) => {
    navigator.clipboard.writeText(path);
    setCopied(path);
    setTimeout(() => setCopied(''), 2000);
  };

  const loadSample = () => {
    setInput(JSON.stringify({
      user: {
        name: "John Doe",
        email: "john@example.com",
        address: { city: "New York", zip: "10001" }
      },
      orders: [
        { id: 1, total: 99.99 },
        { id: 2, total: 149.99 }
      ]
    }, null, 2));
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <button onClick={loadSample} className="btn-secondary text-sm">
          {t('jsonPathFinder.loadSample')}
        </button>
      </div>

      <div>
        <label className="tool-label">{t('input')}</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('jsonPathFinder.placeholder')}
          className="tool-textarea"
        />
      </div>

      <button
        onClick={handleAnalyze}
        className="btn-primary"
      >
        {t('jsonPathFinder.analyze')}
      </button>

      {error && <div className="tool-error">{error}</div>}

      {results.length > 0 && (
        <>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={t('jsonPathFinder.search')}
            className="tool-input"
          />
          <div className="text-sm text-gray-600 dark:text-gray-300">{filteredResults.length} {t('jsonPathFinder.paths')}</div>
          <div className="max-h-96 overflow-y-auto space-y-1">
            {filteredResults.map((item, i) => (
              <div key={i} className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-700 group">
                <code className="flex-1 text-sm font-mono text-blue-600 dark:text-blue-400">{item.path}</code>
                <span className="text-xs text-gray-500 dark:text-gray-300">{item.type}</span>
                <span className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-[200px]">{String(item.value)}</span>
                <button
                  onClick={() => copyPath(item.path)}
                  className="opacity-0 group-hover:opacity-100 px-2 py-1 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded text-xs"
                >
                  {copied === item.path ? '✓' : t('copy')}
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
