'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';

interface TreeNodeProps {
  keyName: string;
  value: unknown;
  depth: number;
  expanded: Set<string>;
  toggleExpand: (path: string) => void;
  path: string;
  itemsLabel: (count: number) => string;
}

function TreeNode({ keyName, value, depth, expanded, toggleExpand, path, itemsLabel }: TreeNodeProps) {
  const isObject = value !== null && typeof value === 'object';
  const isArray = Array.isArray(value);
  const isExpanded = expanded.has(path);
  
  const getValueColor = (val: unknown): string => {
    if (val === null) return 'text-gray-300';
    if (typeof val === 'string') return 'text-green-400';
    if (typeof val === 'number') return 'text-blue-400';
    if (typeof val === 'boolean') return 'text-yellow-400';
    return 'text-white';
  };

  const renderValue = () => {
    if (value === null) return <span className="text-gray-300">null</span>;
    if (typeof value === 'string') return <span className="text-green-400">&quot;{value}&quot;</span>;
    if (typeof value === 'number') return <span className="text-blue-400">{value}</span>;
    if (typeof value === 'boolean') return <span className="text-yellow-400">{value.toString()}</span>;
    return null;
  };

  if (!isObject) {
    return (
      <div className="flex items-center" style={{ paddingLeft: `${depth * 20}px` }}>
        <span className="text-purple-400">{keyName}</span>
        <span className="text-gray-300 mx-1">:</span>
        {renderValue()}
      </div>
    );
  }

  const entries = Object.entries(value as Record<string, unknown>);
  const bracket = isArray ? ['[', ']'] : ['{', '}'];
  const count = entries.length;

  return (
    <div>
      <div className="flex items-center cursor-pointer" style={{ paddingLeft: `${depth * 20}px` }}
        onClick={() => toggleExpand(path)}>
        <span className="text-gray-300 mr-1">{isExpanded ? '▼' : '▶'}</span>
        <span className="text-purple-400">{keyName}</span>
        <span className="text-gray-300 mx-1">:</span>
        <span className="text-gray-300">{bracket[0]}</span>
        {!isExpanded && <span className="text-gray-300 ml-1">{itemsLabel(count)}{bracket[1]}</span>}
      </div>
      {isExpanded && (
        <>
          {entries.map(([k, v]) => (
            <TreeNode key={`${path}.${k}`} keyName={isArray ? `[${k}]` : k} value={v}
              depth={depth + 1} expanded={expanded} toggleExpand={toggleExpand} path={`${path}.${k}`} itemsLabel={itemsLabel} />
          ))}
          <div style={{ paddingLeft: `${depth * 20}px` }} className="text-gray-300">{bracket[1]}</div>
        </>
      )}
    </div>
  );
}

export default function JsonViewer() {
  const t = useTranslations('tools.json-viewer');
  const tg = useTranslations('tools');
  const [input, setInput] = useState('{\n  "name": "John",\n  "age": 30,\n  "active": true,\n  "tags": ["developer", "designer"],\n  "address": {\n    "city": "New York",\n    "zip": "10001"\n  }\n}');
  const [parsed, setParsed] = useState<unknown>(null);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['root']));

  const parse = () => {
    try {
      const data = JSON.parse(input);
      setParsed(data);
      setError('');
      setExpanded(new Set(['root']));
    } catch (e) {
      setError(e instanceof Error ? e.message : tg('errorInvalidJson'));
      setParsed(null);
    }
  };

  const toggleExpand = useCallback((path: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  }, []);

  const expandAll = () => {
    const paths = new Set<string>();
    const traverse = (obj: unknown, path: string) => {
      paths.add(path);
      if (obj && typeof obj === 'object') {
        Object.entries(obj).forEach(([k, v]) => traverse(v, `${path}.${k}`));
      }
    };
    if (parsed) traverse(parsed, 'root');
    setExpanded(paths);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">{t('input')}</label>
        <textarea value={input} onChange={(e) => setInput(e.target.value)}
          className="w-full h-48 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white font-mono text-sm"
          placeholder={t('inputPlaceholder')} />
      </div>

      <div className="flex gap-4">
        <button onClick={parse} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors">
          {t('parseView')}
        </button>
        <button onClick={expandAll} disabled={!parsed}
          className="px-6 py-2 bg-gray-600 hover:bg-gray-9000 disabled:opacity-50 rounded-lg font-medium transition-colors">
          {t('expandAll')}
        </button>
        <button onClick={() => setExpanded(new Set(['root']))} disabled={!parsed}
          className="px-6 py-2 bg-gray-600 hover:bg-gray-9000 disabled:opacity-50 rounded-lg font-medium transition-colors">
          {t('collapseAll')}
        </button>
      </div>

      {error && <div className="text-red-400 bg-red-900/30 rounded-lg p-4">{error}</div>}

      {parsed !== null && (
        <div className="bg-gray-700 rounded-lg p-4 font-mono text-sm overflow-x-auto">
          <TreeNode keyName="root" value={parsed} depth={0} expanded={expanded} toggleExpand={toggleExpand} path="root" itemsLabel={(count) => t('items', { count })} />
        </div>
      )}
    </div>
  );
}
