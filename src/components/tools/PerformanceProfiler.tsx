'use client';

import { useState, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';

interface ProfileResult {
  totalTime: number;
  operations: Array<{
    name: string;
    time: number;
    percentage: number;
    calls: number;
  }>;
  hotspots: string[];
  suggestions: string[];
}

function analyzePerformance(code: string): ProfileResult {
  const operations: ProfileResult['operations'] = [];
  const hotspots: string[] = [];
  const suggestions: string[] = [];
  
  // Detect common performance patterns
  const patterns = [
    { regex: /for\s*\([^)]*\)\s*{[^}]*for\s*\([^)]*\)/g, name: 'Nested Loop', time: 50, issue: 'Nested loops detected - O(n²) complexity' },
    { regex: /\.forEach\([^)]+\)/g, name: 'forEach', time: 5, issue: null },
    { regex: /\.map\([^)]+\)/g, name: 'map', time: 5, issue: null },
    { regex: /\.filter\([^)]+\)/g, name: 'filter', time: 5, issue: null },
    { regex: /\.reduce\([^)]+\)/g, name: 'reduce', time: 8, issue: null },
    { regex: /\.find\([^)]+\)/g, name: 'find', time: 3, issue: null },
    { regex: /\.sort\([^)]*\)/g, name: 'sort', time: 20, issue: 'Array sorting is O(n log n)' },
    { regex: /JSON\.parse\([^)]+\)/g, name: 'JSON.parse', time: 10, issue: null },
    { regex: /JSON\.stringify\([^)]+\)/g, name: 'JSON.stringify', time: 10, issue: null },
    { regex: /new RegExp\([^)]+\)/g, name: 'RegExp creation', time: 15, issue: 'Consider caching RegExp objects' },
    { regex: /document\.querySelector/g, name: 'DOM Query', time: 8, issue: 'Cache DOM queries when possible' },
    { regex: /\.innerHTML\s*=/g, name: 'innerHTML', time: 25, issue: 'innerHTML triggers reflow - use textContent when possible' },
    { regex: /await\s+/g, name: 'Async/Await', time: 2, issue: null },
    { regex: /new Promise/g, name: 'Promise creation', time: 3, issue: null },
    { regex: /setTimeout|setInterval/g, name: 'Timer', time: 1, issue: null },
    { regex: /fetch\s*\(/g, name: 'Network Request', time: 100, issue: 'Network requests are slow - consider caching' },
    { regex: /localStorage\.|sessionStorage\./g, name: 'Storage Access', time: 5, issue: null },
    { regex: /console\.(log|warn|error)/g, name: 'Console', time: 2, issue: 'Remove console statements in production' },
  ];
  
  patterns.forEach(pattern => {
    const matches = code.match(pattern.regex);
    if (matches && matches.length > 0) {
      operations.push({
        name: pattern.name,
        time: pattern.time * matches.length,
        percentage: 0,
        calls: matches.length,
      });
      if (pattern.issue) {
        hotspots.push(`${pattern.name}: ${pattern.issue}`);
      }
    }
  });
  
  // Calculate total and percentages
  const totalTime = operations.reduce((sum, op) => sum + op.time, 0) || 1;
  operations.forEach(op => {
    op.percentage = Math.round((op.time / totalTime) * 100);
  });
  
  // Sort by time
  operations.sort((a, b) => b.time - a.time);
  
  // Generate suggestions
  if (code.includes('for') && code.includes('.length')) {
    suggestions.push('Cache array length in for loops: for (let i = 0, len = arr.length; i < len; i++)');
  }
  if (code.match(/\+\s*['"`]/)) {
    suggestions.push('Use template literals instead of string concatenation');
  }
  if (code.match(/==\s*null|!=\s*null/)) {
    suggestions.push('Use strict equality (=== / !==) for better performance');
  }
  if (operations.find(op => op.name === 'Nested Loop')) {
    suggestions.push('Consider using Map or Set for O(1) lookups instead of nested loops');
  }
  if (operations.find(op => op.name === 'DOM Query' && op.calls > 3)) {
    suggestions.push('Cache DOM queries in variables to avoid repeated lookups');
  }
  
  return { totalTime, operations, hotspots, suggestions };
}

const EXAMPLE_CODE = `function processData(items) {
  const results = [];
  
  for (let i = 0; i < items.length; i++) {
    for (let j = 0; j < items.length; j++) {
      if (items[i].id === items[j].parentId) {
        results.push({ parent: items[i], child: items[j] });
      }
    }
  }
  
  const sorted = results.sort((a, b) => a.parent.name.localeCompare(b.parent.name));
  const filtered = sorted.filter(r => r.child.active);
  const mapped = filtered.map(r => JSON.stringify(r));
  
  document.querySelector('#output').innerHTML = mapped.join('<br>');
  console.log('Processed', results.length, 'items');
  
  return fetch('/api/save', {
    method: 'POST',
    body: JSON.stringify(results)
  });
}`;

export default function PerformanceProfiler() {
  const t = useTranslations('tools.performance-profiler');
  const tCommon = useTranslations('tools');
  const [code, setCode] = useState('');

  const result = useMemo(() => {
    if (!code.trim()) return null;
    return analyzePerformance(code);
  }, [code]);

  const handleClear = useCallback(() => setCode(''), []);
  const loadExample = useCallback(() => setCode(EXAMPLE_CODE), []);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Code {tCommon('input')}</label>
          <button onClick={loadExample} className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400">{t('loadExample')}</button>
        </div>
        <textarea value={code} onChange={(e) => setCode(e.target.value)} placeholder={t("inputPlaceholder")}
          className="w-full h-64 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm resize-none" />
      </div>

      <button onClick={handleClear} className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium">{tCommon('clear')}</button>

      {result && (
        <div className="space-y-6">
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{result.totalTime}ms</div>
              <div className="text-sm text-gray-500">Estimated Execution Time</div>
            </div>
          </div>

          {result.operations.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Operations Breakdown</h3>
              <div className="space-y-2">
                {result.operations.slice(0, 10).map((op, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-32 text-sm font-mono text-gray-700 dark:text-gray-300">{op.name}</div>
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                      <div className={`h-full ${op.percentage > 30 ? 'bg-red-500' : op.percentage > 15 ? 'bg-yellow-500' : 'bg-green-500'}`}
                        style={{ width: `${Math.max(op.percentage, 2)}%` }} />
                    </div>
                    <div className="w-16 text-right text-sm text-gray-500">{op.time}ms</div>
                    <div className="w-12 text-right text-xs text-gray-400">×{op.calls}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.hotspots.length > 0 && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <h4 className="text-sm font-medium text-red-800 dark:text-red-300 mb-2">⚠️ Performance Hotspots</h4>
              <ul className="text-sm text-red-700 dark:text-red-400 space-y-1">
                {result.hotspots.map((h, i) => <li key={i}>• {h}</li>)}
              </ul>
            </div>
          )}

          {result.suggestions.length > 0 && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">💡 Suggestions</h4>
              <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                {result.suggestions.map((s, i) => <li key={i}>• {s}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
