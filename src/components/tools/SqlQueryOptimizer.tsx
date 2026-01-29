'use client';

import { useState, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';

interface OptimizationResult {
  original: string;
  optimized: string;
  suggestions: Array<{ type: 'warning' | 'info' | 'improvement'; message: string; fix?: string }>;
  score: number;
}

function optimizeSQL(sql: string): OptimizationResult {
  const suggestions: OptimizationResult['suggestions'] = [];
  let optimized = sql.trim();
  let score = 100;
  
  // Check for SELECT *
  if (/SELECT\s+\*/i.test(optimized)) {
    suggestions.push({
      type: 'warning',
      message: 'Avoid SELECT * - specify only needed columns',
      fix: 'Replace * with specific column names',
    });
    score -= 15;
  }
  
  // Check for missing WHERE clause in UPDATE/DELETE
  if (/(?:UPDATE|DELETE)\s+\w+\s*(?:SET|$)/i.test(optimized) && !/WHERE/i.test(optimized)) {
    suggestions.push({
      type: 'warning',
      message: 'UPDATE/DELETE without WHERE clause affects all rows',
      fix: 'Add a WHERE clause to limit affected rows',
    });
    score -= 20;
  }
  
  // Check for LIKE with leading wildcard
  if (/LIKE\s+['"]%/i.test(optimized)) {
    suggestions.push({
      type: 'warning',
      message: 'LIKE with leading wildcard prevents index usage',
      fix: 'Consider full-text search or restructure query',
    });
    score -= 10;
  }
  
  // Check for functions on indexed columns
  if (/WHERE\s+(?:UPPER|LOWER|DATE|YEAR|MONTH)\s*\(/i.test(optimized)) {
    suggestions.push({
      type: 'warning',
      message: 'Functions on columns prevent index usage',
      fix: 'Create functional index or restructure query',
    });
    score -= 10;
  }
  
  // Check for OR conditions
  if (/WHERE\s+.*\s+OR\s+/i.test(optimized)) {
    suggestions.push({
      type: 'info',
      message: 'OR conditions may prevent index usage',
      fix: 'Consider using UNION or IN clause instead',
    });
    score -= 5;
  }
  
  // Check for NOT IN with subquery
  if (/NOT\s+IN\s*\(\s*SELECT/i.test(optimized)) {
    suggestions.push({
      type: 'improvement',
      message: 'NOT IN with subquery can be slow',
      fix: 'Use NOT EXISTS or LEFT JOIN ... IS NULL instead',
    });
    optimized = optimized.replace(
      /(\w+)\s+NOT\s+IN\s*\(\s*SELECT\s+(\w+)\s+FROM\s+(\w+)/gi,
      '$1 NOT EXISTS (SELECT 1 FROM $3 WHERE $3.$2 = '
    );
    score -= 10;
  }
  
  // Check for implicit type conversion
  if (/WHERE\s+\w+\s*=\s*['"]?\d+['"]?/i.test(optimized)) {
    suggestions.push({
      type: 'info',
      message: 'Ensure data types match to avoid implicit conversion',
    });
  }
  
  // Check for missing LIMIT
  if (/SELECT/i.test(optimized) && !/LIMIT/i.test(optimized) && !/COUNT|SUM|AVG|MAX|MIN/i.test(optimized)) {
    suggestions.push({
      type: 'info',
      message: 'Consider adding LIMIT to prevent large result sets',
    });
    score -= 5;
  }
  
  // Check for ORDER BY without index hint
  if (/ORDER\s+BY/i.test(optimized) && !/INDEX/i.test(optimized)) {
    suggestions.push({
      type: 'info',
      message: 'Ensure ORDER BY columns are indexed for better performance',
    });
  }
  
  // Suggest index for WHERE columns
  const whereMatch = optimized.match(/WHERE\s+(\w+)\s*[=<>]/i);
  if (whereMatch) {
    suggestions.push({
      type: 'info',
      message: `Consider creating an index on column: ${whereMatch[1]}`,
    });
  }
  
  // Format improvements
  optimized = optimized
    .replace(/\s+/g, ' ')
    .replace(/,\s*/g, ', ')
    .replace(/\(\s+/g, '(')
    .replace(/\s+\)/g, ')')
    .trim();
  
  return { original: sql, optimized, suggestions, score: Math.max(0, score) };
}

const EXAMPLE_SQL = `SELECT * FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE UPPER(u.email) LIKE '%@gmail.com'
OR u.status = 'active'
AND u.id NOT IN (SELECT user_id FROM blacklist)
ORDER BY u.created_at DESC`;

export default function SqlQueryOptimizer() {
  const t = useTranslations('tools.sql-query-optimizer');
  const tCommon = useTranslations('tools');
  const [sql, setSql] = useState('');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (!sql.trim()) return null;
    return optimizeSQL(sql);
  }, [sql]);

  const handleClear = useCallback(() => setSql(''), []);
  const loadExample = useCallback(() => setSql(EXAMPLE_SQL), []);
  const handleCopy = useCallback(() => {
    if (result) {
      navigator.clipboard.writeText(result.optimized);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [result]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'warning': return 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800';
      case 'improvement': return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800';
      case 'info': return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800';
      default: return 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('sqlQuery')}</label>
          <button onClick={loadExample} className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400">{t('loadExample')}</button>
        </div>
        <textarea value={sql} onChange={(e) => setSql(e.target.value)} placeholder={t("inputPlaceholder")}
          className="w-full h-40 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm resize-none" />
      </div>

      <button onClick={handleClear} className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium">{tCommon('clear')}</button>

      {result && (
        <div className="space-y-6">
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
            <div className={`text-3xl font-bold ${result.score >= 80 ? 'text-green-600' : result.score >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
              {result.score}/100
            </div>
            <div className="text-sm text-gray-500">{t('queryPerformanceScore')}</div>
          </div>

          {result.suggestions.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t('optimizationSuggestions')}</h3>
              {result.suggestions.map((s, idx) => (
                <div key={idx} className={`p-3 rounded-lg border ${getTypeColor(s.type)}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{s.type === 'warning' ? '⚠️' : s.type === 'improvement' ? '💡' : 'ℹ️'}</span>
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{s.message}</span>
                  </div>
                  {s.fix && <p className="text-sm text-gray-600 dark:text-gray-400 ml-7">{t('fix')}: {s.fix}</p>}
                </div>
              ))}
            </div>
          )}

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('formattedQuery')}</label>
              <button onClick={handleCopy} className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
                {copied ? tCommon('copied') : tCommon('copy')}
              </button>
            </div>
            <pre className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-x-auto text-sm font-mono text-gray-800 dark:text-gray-200">
              {result.optimized}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
