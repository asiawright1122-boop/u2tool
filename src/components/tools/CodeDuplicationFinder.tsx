'use client';

import { useState, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';

interface DuplicateBlock {
  lines: string[];
  occurrences: Array<{ start: number; end: number }>;
  similarity: number;
}

function findDuplicates(code: string, minLines: number = 3): DuplicateBlock[] {
  const lines = code.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('//') && !l.startsWith('*'));
  const duplicates: DuplicateBlock[] = [];
  const seen = new Map<string, number[]>();
  
  // Find exact duplicates
  for (let i = 0; i < lines.length - minLines + 1; i++) {
    for (let len = minLines; len <= Math.min(20, lines.length - i); len++) {
      const block = lines.slice(i, i + len).join('\n');
      const normalized = block.replace(/\s+/g, ' ').toLowerCase();
      
      if (!seen.has(normalized)) {
        seen.set(normalized, [i]);
      } else {
        const positions = seen.get(normalized)!;
        // Check if this is a new occurrence (not overlapping)
        if (positions.every(p => Math.abs(p - i) >= len)) {
          positions.push(i);
        }
      }
    }
  }
  
  // Filter to only blocks with duplicates
  seen.forEach((positions, block) => {
    if (positions.length > 1) {
      const blockLines = block.split('\n');
      // Check if this is not a subset of a larger duplicate
      const isSubset = duplicates.some(d => 
        d.lines.length > blockLines.length && 
        d.lines.join('\n').includes(block)
      );
      
      if (!isSubset) {
        duplicates.push({
          lines: blockLines,
          occurrences: positions.map(p => ({ start: p + 1, end: p + blockLines.length })),
          similarity: 100,
        });
      }
    }
  });
  
  // Sort by size (larger duplicates first)
  duplicates.sort((a, b) => b.lines.length - a.lines.length);
  
  return duplicates.slice(0, 10); // Limit results
}

function calculateStats(code: string, duplicates: DuplicateBlock[]) {
  const totalLines = code.split('\n').length;
  const duplicateLines = duplicates.reduce((sum, d) => 
    sum + d.lines.length * (d.occurrences.length - 1), 0
  );
  const duplicationPercentage = totalLines > 0 ? Math.round((duplicateLines / totalLines) * 100) : 0;
  
  return { totalLines, duplicateLines, duplicationPercentage };
}

const EXAMPLE_CODE = `function validateEmail(email) {
  if (!email) return false;
  if (!email.includes('@')) return false;
  if (!email.includes('.')) return false;
  return true;
}

function validateUsername(username) {
  if (!username) return false;
  if (username.length < 3) return false;
  return true;
}

function processUser(user) {
  if (!user.email) return false;
  if (!user.email.includes('@')) return false;
  if (!user.email.includes('.')) return false;
  
  console.log('Processing user:', user.name);
  return true;
}

function handleSubmit(data) {
  if (!data.email) return false;
  if (!data.email.includes('@')) return false;
  if (!data.email.includes('.')) return false;
  
  saveData(data);
  return true;
}`;

export default function CodeDuplicationFinder() {
  const t = useTranslations('tools.code-duplication-finder');
  const tCommon = useTranslations('tools');
  const [code, setCode] = useState('');
  const [minLines, setMinLines] = useState(3);

  const result = useMemo(() => {
    if (!code.trim()) return null;
    const duplicates = findDuplicates(code, minLines);
    const stats = calculateStats(code, duplicates);
    return { duplicates, stats };
  }, [code, minLines]);

  const handleClear = useCallback(() => setCode(''), []);
  const loadExample = useCallback(() => setCode(EXAMPLE_CODE), []);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Code {tCommon('input')}</label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              {t('minLines')}:
              <input type="number" value={minLines} onChange={(e) => setMinLines(Math.max(2, parseInt(e.target.value) || 3))}
                min={2} max={10} className="w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm" />
            </label>
            <button onClick={loadExample} className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400">{t('loadExample')}</button>
          </div>
        </div>
        <textarea value={code} onChange={(e) => setCode(e.target.value)} placeholder={t("inputPlaceholder")}
          className="w-full h-64 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm resize-none" />
      </div>

      <button onClick={handleClear} className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium">{tCommon('clear')}</button>

      {result && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{result.stats.totalLines}</div>
              <div className="text-sm text-gray-500">{t('totalLines')}</div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
              <div className={`text-2xl font-bold ${result.stats.duplicateLines > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                {result.stats.duplicateLines}
              </div>
              <div className="text-sm text-gray-500">{t('duplicateLines')}</div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
              <div className={`text-2xl font-bold ${result.stats.duplicationPercentage > 20 ? 'text-red-600' : result.stats.duplicationPercentage > 10 ? 'text-orange-600' : 'text-green-600'}`}>
                {result.stats.duplicationPercentage}%
              </div>
              <div className="text-sm text-gray-500">{t('duplication')}</div>
            </div>
          </div>

          {result.duplicates.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {t('foundDuplicateBlocks').replace('{count}', result.duplicates.length.toString())}
              </h3>
              {result.duplicates.map((dup, idx) => (
                <div key={idx} className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-orange-800 dark:text-orange-300">
                      {dup.lines.length} {t('lines')} × {dup.occurrences.length} {t('occurrences')}
                    </span>
                    <span className="text-xs text-orange-600 dark:text-orange-400">
                      {t('linesLabel')}: {dup.occurrences.map(o => `${o.start}-${o.end}`).join(', ')}
                    </span>
                  </div>
                  <pre className="p-3 bg-white dark:bg-gray-900 rounded text-xs font-mono text-gray-800 dark:text-gray-200 overflow-x-auto">
                    {dup.lines.join('\n')}
                  </pre>
                </div>
              ))}
              
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">💡 {t('refactoringSuggestions')}</h4>
                <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                  <li>• {t('tip1')}</li>
                  <li>• {t('tip2')}</li>
                  <li>• {t('tip3')}</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
              <div className="text-4xl mb-2">✅</div>
              <p className="text-green-700 dark:text-green-300 font-medium">{t('noDuplicationFound')}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
