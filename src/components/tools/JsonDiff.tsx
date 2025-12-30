'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function JsonDiff() {
  const t = useTranslations('tools.json-diff');
  const tg = useTranslations('tools');
  const [json1, setJson1] = useState('');
  const [json2, setJson2] = useState('');
  const [diff, setDiff] = useState<{ path: string; type: string; val1?: string; val2?: string }[]>([]);
  const [error, setError] = useState('');

  const compare = () => {
    try {
      const obj1 = JSON.parse(json1);
      const obj2 = JSON.parse(json2);
      const diffs: { path: string; type: string; val1?: string; val2?: string }[] = [];
      
      const findDiffs = (o1: unknown, o2: unknown, path: string) => {
        if (typeof o1 !== typeof o2) {
          diffs.push({ path, type: 'type', val1: typeof o1, val2: typeof o2 });
          return;
        }
        if (o1 === null || o2 === null) {
          if (o1 !== o2) diffs.push({ path, type: 'value', val1: String(o1), val2: String(o2) });
          return;
        }
        if (typeof o1 !== 'object') {
          if (o1 !== o2) diffs.push({ path, type: 'value', val1: String(o1), val2: String(o2) });
          return;
        }
        const keys = new Set([...Object.keys(o1 as object), ...Object.keys(o2 as object)]);
        keys.forEach(key => {
          const newPath = path ? `${path}.${key}` : key;
          if (!(key in (o1 as object))) diffs.push({ path: newPath, type: 'added', val2: JSON.stringify((o2 as Record<string, unknown>)[key]) });
          else if (!(key in (o2 as object))) diffs.push({ path: newPath, type: 'removed', val1: JSON.stringify((o1 as Record<string, unknown>)[key]) });
          else findDiffs((o1 as Record<string, unknown>)[key], (o2 as Record<string, unknown>)[key], newPath);
        });
      };
      
      findDiffs(obj1, obj2, '');
      setDiff(diffs);
      setError('');
    } catch {
      setError(tg('json.invalidJson'));
      setDiff([]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">{t('json1')}</label>
          <textarea value={json1} onChange={(e) => setJson1(e.target.value)} className="w-full h-48 p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg font-mono text-sm text-gray-900 dark:text-white" placeholder={t('placeholder')} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">{t('json2')}</label>
          <textarea value={json2} onChange={(e) => setJson2(e.target.value)} className="w-full h-48 p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg font-mono text-sm text-gray-900 dark:text-white" placeholder={t('placeholder')} />
        </div>
      </div>
      <button onClick={compare} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{t('compare')}</button>
      {error && <p className="text-red-600 dark:text-red-400">{error}</p>}
      {diff.length > 0 && (
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 dark:text-white mb-2">{t('differences')}: {diff.length}</h3>
          <div className="space-y-2 max-h-64 overflow-auto">
            {diff.map((d, i) => (
              <div key={i} className={`p-2 rounded text-sm ${d.type === 'added' ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200' : d.type === 'removed' ? 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200' : 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200'}`}>
                <span className="font-mono">{d.path}</span>: {d.type === 'added' ? `+ ${d.val2}` : d.type === 'removed' ? `- ${d.val1}` : `${d.val1} → ${d.val2}`}
              </div>
            ))}
          </div>
        </div>
      )}
      {diff.length === 0 && !error && json1 && json2 && <p className="text-green-600 dark:text-green-400">{t('identical')}</p>}
    </div>
  );
}
