'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

function convertSqlToMongo(sql: string): string {
  const sqlLower = sql.toLowerCase().trim();
  
  // SELECT query
  if (sqlLower.startsWith('select')) {
    return convertSelect(sql);
  }
  
  // INSERT query
  if (sqlLower.startsWith('insert')) {
    return convertInsert(sql);
  }
  
  // UPDATE query
  if (sqlLower.startsWith('update')) {
    return convertUpdate(sql);
  }
  
  // DELETE query
  if (sqlLower.startsWith('delete')) {
    return convertDelete(sql);
  }
  
  return '// Unsupported SQL query type';
}

function convertSelect(sql: string): string {
  const match = sql.match(/select\s+(.+?)\s+from\s+(\w+)(?:\s+where\s+(.+?))?(?:\s+order\s+by\s+(.+?))?(?:\s+limit\s+(\d+))?(?:\s+offset\s+(\d+))?$/i);
  
  if (!match) return '// Could not parse SELECT query';
  
  const [, fields, collection, where, orderBy, limit, offset] = match;
  
  let result = `db.${collection}.find(`;
  
  // Build filter
  const filter = where ? convertWhere(where) : '{}';
  result += filter;
  
  // Build projection
  if (fields.trim() !== '*') {
    const projection: Record<string, number> = {};
    fields.split(',').forEach(f => {
      const field = f.trim();
      if (field) projection[field] = 1;
    });
    result += `, ${JSON.stringify(projection)}`;
  }
  
  result += ')';
  
  // Add sort
  if (orderBy) {
    const sortObj: Record<string, number> = {};
    orderBy.split(',').forEach(s => {
      const parts = s.trim().split(/\s+/);
      const field = parts[0];
      const dir = parts[1]?.toLowerCase() === 'desc' ? -1 : 1;
      sortObj[field] = dir;
    });
    result += `.sort(${JSON.stringify(sortObj)})`;
  }
  
  // Add skip/limit
  if (offset) result += `.skip(${offset})`;
  if (limit) result += `.limit(${limit})`;
  
  return result;
}

function convertWhere(where: string): string {
  const conditions: Record<string, unknown> = {};
  
  // Simple equality: field = 'value' or field = number
  const eqMatch = where.match(/(\w+)\s*=\s*['"]?([^'"]+)['"]?/i);
  if (eqMatch) {
    const [, field, value] = eqMatch;
    conditions[field] = isNaN(Number(value)) ? value : Number(value);
  }
  
  // Greater than
  const gtMatch = where.match(/(\w+)\s*>\s*(\d+)/i);
  if (gtMatch) {
    const [, field, value] = gtMatch;
    conditions[field] = { $gt: Number(value) };
  }
  
  // Less than
  const ltMatch = where.match(/(\w+)\s*<\s*(\d+)/i);
  if (ltMatch) {
    const [, field, value] = ltMatch;
    conditions[field] = { $lt: Number(value) };
  }
  
  // LIKE
  const likeMatch = where.match(/(\w+)\s+like\s+'%?([^%']+)%?'/i);
  if (likeMatch) {
    const [, field, pattern] = likeMatch;
    conditions[field] = { $regex: pattern, $options: 'i' };
  }
  
  // IN
  const inMatch = where.match(/(\w+)\s+in\s*\(([^)]+)\)/i);
  if (inMatch) {
    const [, field, values] = inMatch;
    const arr = values.split(',').map(v => {
      const trimmed = v.trim().replace(/['"]/g, '');
      return isNaN(Number(trimmed)) ? trimmed : Number(trimmed);
    });
    conditions[field] = { $in: arr };
  }
  
  return JSON.stringify(conditions, null, 2);
}

function convertInsert(sql: string): string {
  const match = sql.match(/insert\s+into\s+(\w+)\s*\(([^)]+)\)\s*values\s*\(([^)]+)\)/i);
  
  if (!match) return '// Could not parse INSERT query';
  
  const [, collection, columns, values] = match;
  const cols = columns.split(',').map(c => c.trim());
  const vals = values.split(',').map(v => {
    const trimmed = v.trim().replace(/['"]/g, '');
    return isNaN(Number(trimmed)) ? trimmed : Number(trimmed);
  });
  
  const doc: Record<string, unknown> = {};
  cols.forEach((col, i) => {
    doc[col] = vals[i];
  });
  
  return `db.${collection}.insertOne(${JSON.stringify(doc, null, 2)})`;
}

function convertUpdate(sql: string): string {
  const match = sql.match(/update\s+(\w+)\s+set\s+(.+?)(?:\s+where\s+(.+))?$/i);
  
  if (!match) return '// Could not parse UPDATE query';
  
  const [, collection, setClause, where] = match;
  
  const updates: Record<string, unknown> = {};
  setClause.split(',').forEach(s => {
    const [field, value] = s.split('=').map(p => p.trim());
    const cleanValue = value.replace(/['"]/g, '');
    updates[field] = isNaN(Number(cleanValue)) ? cleanValue : Number(cleanValue);
  });
  
  const filter = where ? convertWhere(where) : '{}';
  
  return `db.${collection}.updateMany(\n  ${filter},\n  { $set: ${JSON.stringify(updates, null, 2)} }\n)`;
}

function convertDelete(sql: string): string {
  const match = sql.match(/delete\s+from\s+(\w+)(?:\s+where\s+(.+))?$/i);
  
  if (!match) return '// Could not parse DELETE query';
  
  const [, collection, where] = match;
  const filter = where ? convertWhere(where) : '{}';
  
  return `db.${collection}.deleteMany(${filter})`;
}

export default function SqlToMongo() {
  const t = useTranslations('tools.sql-to-mongo');
  const tg = useTranslations('tools');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const convert = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }
    setOutput(convertSqlToMongo(input));
  };

  const copyOutput = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 2000);
  };

  const examples = [
    { sql: "SELECT * FROM users WHERE age > 25", descKey: "exampleSimpleSelect" },
    { sql: "SELECT name, email FROM users WHERE status = 'active' ORDER BY name LIMIT 10", descKey: "exampleSelectProjection" },
    { sql: "INSERT INTO users (name, email, age) VALUES ('John', 'john@example.com', 30)", descKey: "exampleInsert" },
    { sql: "UPDATE users SET status = 'inactive' WHERE age < 18", descKey: "exampleUpdate" },
    { sql: "DELETE FROM users WHERE status = 'deleted'", descKey: "exampleDelete" },
  ];

  useEffect(() => {

    return () => {

      if (timerRef.current) clearTimeout(timerRef.current);

    };

  }, []);


  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">{t('sqlQuery')}</label>
        <textarea
          className="tool-textarea font-mono"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('sqlPlaceholder')}
          rows={4}
        />
      </div>

      <div className="flex gap-2">
        <button onClick={convert} className="btn-primary">{tg('convert')}</button>
        <button onClick={() => { setInput(''); setOutput(''); }} className="btn-secondary">
          {tg('clear')}
        </button>
      </div>

      {output && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium">{t('mongoQuery')}</label>
            <button
              onClick={copyOutput}
              className={`text-sm px-3 py-1 rounded ${copied ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
              {copied ? tg('copied') : tg('copy')}
            </button>
          </div>
          <pre className="tool-textarea font-mono text-sm whitespace-pre">{output}</pre>
        </div>
      )}

      <div>
        <h3 className="text-sm font-medium mb-3 text-gray-900 dark:text-white">{t('examples')}</h3>
        <div className="space-y-2">
          {examples.map((ex, i) => (
            <button
              key={i}
              onClick={() => setInput(ex.sql)}
              className="w-full p-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-left hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="text-sm text-gray-600 dark:text-gray-300">{t(ex.descKey)}</div>
              <code className="text-blue-600 dark:text-blue-400 text-sm">{ex.sql}</code>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
