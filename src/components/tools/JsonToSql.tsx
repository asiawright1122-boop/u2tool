'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export interface JsonToSqlOptions {
  tableName: string;
  includeCreate: boolean;
  dialect: 'mysql' | 'postgresql' | 'sqlite';
}

// 转换函数 - 导出供测试使用
export function jsonToSql(jsonStr: string, options: JsonToSqlOptions): string {
  const { tableName, includeCreate, dialect } = options;
  
  let data: Record<string, unknown>[];
  try {
    const parsed = JSON.parse(jsonStr);
    data = Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    throw new Error('Invalid JSON');
  }
  
  if (data.length === 0) {
    throw new Error('Empty data');
  }
  
  // 获取所有列名
  const columns = new Set<string>();
  data.forEach(row => {
    Object.keys(row).forEach(key => columns.add(key));
  });
  const columnList = Array.from(columns);
  
  const lines: string[] = [];
  
  // CREATE TABLE 语句
  if (includeCreate) {
    const columnDefs = columnList.map(col => {
      const sampleValue = data.find(row => row[col] !== undefined)?.[col];
      const sqlType = getSqlType(sampleValue, dialect);
      return `  ${quoteIdentifier(col, dialect)} ${sqlType}`;
    });
    
    lines.push(`CREATE TABLE ${quoteIdentifier(tableName, dialect)} (`);
    lines.push(columnDefs.join(',\n'));
    lines.push(');');
    lines.push('');
  }

  // INSERT 语句
  const quotedColumns = columnList.map(col => quoteIdentifier(col, dialect)).join(', ');
  
  data.forEach(row => {
    const values = columnList.map(col => formatValue(row[col], dialect));
    lines.push(`INSERT INTO ${quoteIdentifier(tableName, dialect)} (${quotedColumns}) VALUES (${values.join(', ')});`);
  });
  
  return lines.join('\n');
}

function getSqlType(value: unknown, dialect: string): string {
  if (value === null || value === undefined) return 'TEXT';
  if (typeof value === 'number') {
    return Number.isInteger(value) ? 'INTEGER' : (dialect === 'postgresql' ? 'NUMERIC' : 'DECIMAL(10,2)');
  }
  if (typeof value === 'boolean') {
    return dialect === 'postgresql' ? 'BOOLEAN' : 'TINYINT(1)';
  }
  return dialect === 'postgresql' ? 'TEXT' : 'VARCHAR(255)';
}

function quoteIdentifier(name: string, dialect: string): string {
  if (dialect === 'mysql') return `\`${name}\``;
  if (dialect === 'postgresql') return `"${name}"`;
  return `"${name}"`;
}

function formatValue(value: unknown, dialect: string): string {
  if (value === null || value === undefined) return 'NULL';
  if (typeof value === 'number') return String(value);
  if (typeof value === 'boolean') {
    if (dialect === 'postgresql') return value ? 'TRUE' : 'FALSE';
    return value ? '1' : '0';
  }
  if (typeof value === 'string') {
    return `'${value.replace(/'/g, "''")}'`;
  }
  if (typeof value === 'object') {
    return `'${JSON.stringify(value).replace(/'/g, "''")}'`;
  }
  return `'${String(value).replace(/'/g, "''")}'`;
}

export default function JsonToSql() {
  const t = useTranslations('tools.json-to-sql');
  const tg = useTranslations('tools');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [tableName, setTableName] = useState('my_table');
  const [includeCreate, setIncludeCreate] = useState(true);
  const [dialect, setDialect] = useState<'mysql' | 'postgresql' | 'sqlite'>('mysql');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);


  const handleConvert = useCallback(() => {
    setError(null);
    try {
      const sql = jsonToSql(input, { tableName, includeCreate, dialect });
      setOutput(sql);
    } catch (_e) {
      setError(_e instanceof Error ? _e.message : tg('errorProcessing'));
      setOutput('');
    }
  }, [input, tableName, includeCreate, dialect]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError(null);
  };

  const loadExample = () => {
    setInput(JSON.stringify([
      { id: 1, name: "Alice", email: "alice@example.com", age: 25, active: true },
      { id: 2, name: "Bob", email: "bob@example.com", age: 30, active: false },
      { id: 3, name: "Charlie", email: "charlie@example.com", age: 35, active: true }
    ], null, 2));
  };

  useEffect(() => {

    return () => {

      if (timerRef.current) clearTimeout(timerRef.current);

    };

  }, []);


  return (
    <div className="space-y-4">
      {/* 控制面板 */}
      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">{t('tableName')}</label>
            <input
              type="text"
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">{t('dialect')}</label>
            <select
              value={dialect}
              onChange={(e) => setDialect(e.target.value as 'mysql' | 'postgresql' | 'sqlite')}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-white"
            >
              <option value="mysql">MySQL</option>
              <option value="postgresql">PostgreSQL</option>
              <option value="sqlite">SQLite</option>
            </select>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 items-center">
          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-white">
            <input
              type="checkbox"
              checked={includeCreate}
              onChange={(e) => setIncludeCreate(e.target.checked)}
              className="rounded bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            />
            {t('includeCreate')}
          </label>
          
          <div className="flex gap-2 ml-auto">
            <button onClick={handleConvert} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-sm font-medium">
              {tg('convert')}
            </button>
            <button onClick={loadExample} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded text-sm">
              {t('loadExample')}
            </button>
            <button onClick={handleClear} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded text-sm">
              {tg('clear')}
            </button>
          </div>
        </div>
      </div>


      {/* 输入输出区域 */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">JSON {tg('input')}</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('inputPlaceholder')}
            className="w-full h-64 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded font-mono text-sm text-gray-900 dark:text-white resize-none focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm text-gray-600 dark:text-gray-300">SQL {tg('output')}</label>
            <button
              onClick={handleCopy}
              disabled={!output}
              className={`px-2 py-1 text-xs rounded ${copied ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white'} disabled:opacity-50`}
            >
              {copied ? tg('copied') : tg('copy')}
            </button>
          </div>
          <textarea
            value={error || output}
            readOnly
            className={`w-full h-64 px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded font-mono text-sm text-gray-900 dark:text-white resize-none ${error ? 'text-red-600 dark:text-red-400' : ''}`}
          />
        </div>
      </div>
    </div>
  );
}
