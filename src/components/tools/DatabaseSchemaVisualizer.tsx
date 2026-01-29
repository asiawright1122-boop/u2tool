'use client';

import { useState, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';

interface Table {
  name: string;
  columns: Array<{ name: string; type: string; pk?: boolean; fk?: string }>;
}

function parseSchema(sql: string): Table[] {
  const tables: Table[] = [];
  const createTableRegex = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?[`"]?(\w+)[`"]?\s*\(([\s\S]*?)\);/gi;
  
  let match;
  while ((match = createTableRegex.exec(sql)) !== null) {
    const tableName = match[1];
    const columnsStr = match[2];
    const columns: Table['columns'] = [];
    
    const lines = columnsStr.split(',').map(l => l.trim());
    lines.forEach(line => {
      if (line.toUpperCase().startsWith('PRIMARY KEY') || line.toUpperCase().startsWith('FOREIGN KEY') || 
          line.toUpperCase().startsWith('UNIQUE') || line.toUpperCase().startsWith('INDEX')) return;
      
      const colMatch = line.match(/[`"]?(\w+)[`"]?\s+(\w+(?:\([^)]+\))?)/i);
      if (colMatch) {
        const isPK = /PRIMARY\s+KEY/i.test(line);
        const fkMatch = line.match(/REFERENCES\s+[`"]?(\w+)[`"]?\s*\([`"]?(\w+)[`"]?\)/i);
        columns.push({
          name: colMatch[1],
          type: colMatch[2].toUpperCase(),
          pk: isPK,
          fk: fkMatch ? `${fkMatch[1]}.${fkMatch[2]}` : undefined,
        });
      }
    });
    
    if (columns.length > 0) {
      tables.push({ name: tableName, columns });
    }
  }
  
  return tables;
}

const EXAMPLE_SQL = `CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  content TEXT,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES posts(id),
  user_id INTEGER REFERENCES users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);`;

export default function DatabaseSchemaVisualizer() {
  const t = useTranslations('tools.database-schema-visualizer');
  const tCommon = useTranslations('tools');
  const [sql, setSql] = useState('');

  const tables = useMemo(() => {
    if (!sql.trim()) return [];
    return parseSchema(sql);
  }, [sql]);

  const handleClear = useCallback(() => setSql(''), []);
  const loadExample = useCallback(() => setSql(EXAMPLE_SQL), []);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('sqlSchema')}</label>
          <button onClick={loadExample} className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400">{t('loadExample')}</button>
        </div>
        <textarea value={sql} onChange={(e) => setSql(e.target.value)} placeholder={t("inputPlaceholder")}
          className="w-full h-48 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm resize-none" />
      </div>

      <button onClick={handleClear} className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium">{tCommon('clear')}</button>

      {tables.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t('schemaVisualization')} ({tables.length} {t('tables')})</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tables.map((table, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="bg-blue-600 text-white px-4 py-2 font-medium">{table.name}</div>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {table.columns.map((col, cidx) => (
                    <div key={cidx} className="px-4 py-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {col.pk && <span className="text-yellow-500" title="Primary Key">🔑</span>}
                        {col.fk && <span className="text-blue-500" title={`FK: ${col.fk}`}>🔗</span>}
                        <span className="font-mono text-sm text-gray-900 dark:text-white">{col.name}</span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{col.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Relationships */}
          {tables.some(t => t.columns.some(c => c.fk)) && (
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{t('relationships')}</h4>
              <div className="space-y-2">
                {tables.flatMap(table => 
                  table.columns.filter(c => c.fk).map((col, idx) => (
                    <div key={`${table.name}-${idx}`} className="flex items-center gap-2 text-sm">
                      <span className="font-mono text-blue-600 dark:text-blue-400">{table.name}.{col.name}</span>
                      <span className="text-gray-400">→</span>
                      <span className="font-mono text-green-600 dark:text-green-400">{col.fk}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
