'use client';

import { useState, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';

interface ConversionResult {
  collection: string;
  operation: string;
  query: string;
  options?: string;
}

function convertSqlToMongo(sql: string): ConversionResult | null {
  const trimmed = sql.trim().replace(/;$/, '');
  
  // SELECT query
  const selectMatch = trimmed.match(/^SELECT\s+(.+?)\s+FROM\s+(\w+)(?:\s+WHERE\s+(.+?))?(?:\s+ORDER\s+BY\s+(.+?))?(?:\s+LIMIT\s+(\d+))?(?:\s+OFFSET\s+(\d+))?$/i);
  if (selectMatch) {
    const [, fields, table, where, orderBy, limit, offset] = selectMatch;
    const collection = table;
    
    // Build projection
    let projection = '{}';
    if (fields.trim() !== '*') {
      const fieldList = fields.split(',').map(f => f.trim());
      const projObj: Record<string, number> = {};
      fieldList.forEach(f => { projObj[f] = 1; });
      projection = JSON.stringify(projObj);
    }
    
    // Build filter
    const filter = where ? convertWhereClause(where) : '{}';
    
    // Build options
    const options: string[] = [];
    if (orderBy) {
      const sortObj: Record<string, number> = {};
      orderBy.split(',').forEach(part => {
        const [field, dir] = part.trim().split(/\s+/);
        sortObj[field] = dir?.toUpperCase() === 'DESC' ? -1 : 1;
      });
      options.push(`.sort(${JSON.stringify(sortObj)})`);
    }
    if (limit) options.push(`.limit(${limit})`);
    if (offset) options.push(`.skip(${offset})`);
    
    return {
      collection,
      operation: 'find',
      query: `db.${collection}.find(${filter}, ${projection})${options.join('')}`,
    };
  }
  
  // INSERT query
  const insertMatch = trimmed.match(/^INSERT\s+INTO\s+(\w+)\s*\((.+?)\)\s*VALUES\s*\((.+?)\)$/i);
  if (insertMatch) {
    const [, table, columns, values] = insertMatch;
    const cols = columns.split(',').map(c => c.trim());
    const vals = parseValues(values);
    
    const doc: Record<string, unknown> = {};
    cols.forEach((col, i) => { doc[col] = vals[i]; });
    
    return {
      collection: table,
      operation: 'insertOne',
      query: `db.${table}.insertOne(${JSON.stringify(doc, null, 2)})`,
    };
  }
  
  // UPDATE query
  const updateMatch = trimmed.match(/^UPDATE\s+(\w+)\s+SET\s+(.+?)(?:\s+WHERE\s+(.+?))?$/i);
  if (updateMatch) {
    const [, table, setClause, where] = updateMatch;
    const filter = where ? convertWhereClause(where) : '{}';
    
    const updateObj: Record<string, unknown> = {};
    setClause.split(',').forEach(part => {
      const [field, value] = part.split('=').map(s => s.trim());
      updateObj[field] = parseValue(value);
    });
    
    return {
      collection: table,
      operation: 'updateMany',
      query: `db.${table}.updateMany(${filter}, { $set: ${JSON.stringify(updateObj, null, 2)} })`,
    };
  }
  
  // DELETE query
  const deleteMatch = trimmed.match(/^DELETE\s+FROM\s+(\w+)(?:\s+WHERE\s+(.+?))?$/i);
  if (deleteMatch) {
    const [, table, where] = deleteMatch;
    const filter = where ? convertWhereClause(where) : '{}';
    
    return {
      collection: table,
      operation: 'deleteMany',
      query: `db.${table}.deleteMany(${filter})`,
    };
  }
  
  // COUNT query
  const countMatch = trimmed.match(/^SELECT\s+COUNT\s*\(\s*\*?\s*\)\s+FROM\s+(\w+)(?:\s+WHERE\s+(.+?))?$/i);
  if (countMatch) {
    const [, table, where] = countMatch;
    const filter = where ? convertWhereClause(where) : '{}';
    
    return {
      collection: table,
      operation: 'countDocuments',
      query: `db.${table}.countDocuments(${filter})`,
    };
  }
  
  return null;
}

function convertWhereClause(where: string): string {
  // Handle AND/OR
  if (/\s+AND\s+/i.test(where)) {
    const parts = where.split(/\s+AND\s+/i);
    const conditions = parts.map(p => JSON.parse(convertCondition(p)));
    return JSON.stringify({ $and: conditions });
  }
  if (/\s+OR\s+/i.test(where)) {
    const parts = where.split(/\s+OR\s+/i);
    const conditions = parts.map(p => JSON.parse(convertCondition(p)));
    return JSON.stringify({ $or: conditions });
  }
  
  return convertCondition(where);
}

function convertCondition(condition: string): string {
  const trimmed = condition.trim();
  
  // IN clause
  const inMatch = trimmed.match(/^(\w+)\s+IN\s*\((.+?)\)$/i);
  if (inMatch) {
    const [, field, values] = inMatch;
    const vals = parseValues(values);
    return JSON.stringify({ [field]: { $in: vals } });
  }
  
  // NOT IN clause
  const notInMatch = trimmed.match(/^(\w+)\s+NOT\s+IN\s*\((.+?)\)$/i);
  if (notInMatch) {
    const [, field, values] = notInMatch;
    const vals = parseValues(values);
    return JSON.stringify({ [field]: { $nin: vals } });
  }
  
  // LIKE clause
  const likeMatch = trimmed.match(/^(\w+)\s+LIKE\s+'(.+?)'$/i);
  if (likeMatch) {
    const [, field, pattern] = likeMatch;
    const regex = pattern.replace(/%/g, '.*').replace(/_/g, '.');
    return JSON.stringify({ [field]: { $regex: regex, $options: 'i' } });
  }
  
  // IS NULL
  const isNullMatch = trimmed.match(/^(\w+)\s+IS\s+NULL$/i);
  if (isNullMatch) {
    return JSON.stringify({ [isNullMatch[1]]: null });
  }
  
  // IS NOT NULL
  const isNotNullMatch = trimmed.match(/^(\w+)\s+IS\s+NOT\s+NULL$/i);
  if (isNotNullMatch) {
    return JSON.stringify({ [isNotNullMatch[1]]: { $ne: null } });
  }
  
  // Comparison operators
  const compMatch = trimmed.match(/^(\w+)\s*(>=|<=|!=|<>|>|<|=)\s*(.+)$/);
  if (compMatch) {
    const [, field, op, value] = compMatch;
    const val = parseValue(value.trim());
    
    const opMap: Record<string, string> = {
      '=': '$eq',
      '!=': '$ne',
      '<>': '$ne',
      '>': '$gt',
      '>=': '$gte',
      '<': '$lt',
      '<=': '$lte',
    };
    
    if (op === '=') {
      return JSON.stringify({ [field]: val });
    }
    return JSON.stringify({ [field]: { [opMap[op]]: val } });
  }
  
  return '{}';
}

function parseValues(valuesStr: string): unknown[] {
  return valuesStr.split(',').map(v => parseValue(v.trim()));
}

function parseValue(value: string): unknown {
  // String
  if ((value.startsWith("'") && value.endsWith("'")) || (value.startsWith('"') && value.endsWith('"'))) {
    return value.slice(1, -1);
  }
  // Number
  if (!isNaN(Number(value))) {
    return Number(value);
  }
  // Boolean
  if (value.toLowerCase() === 'true') return true;
  if (value.toLowerCase() === 'false') return false;
  // NULL
  if (value.toLowerCase() === 'null') return null;
  
  return value;
}

const EXAMPLES = [
  { label: 'SELECT', sql: "SELECT name, email FROM users WHERE age > 18 ORDER BY name LIMIT 10" },
  { label: 'INSERT', sql: "INSERT INTO users (name, email, age) VALUES ('John', 'john@example.com', 25)" },
  { label: 'UPDATE', sql: "UPDATE users SET status = 'active' WHERE age >= 18" },
  { label: 'DELETE', sql: "DELETE FROM users WHERE status = 'inactive'" },
  { label: 'COUNT', sql: "SELECT COUNT(*) FROM orders WHERE status = 'pending'" },
  { label: 'LIKE', sql: "SELECT * FROM products WHERE name LIKE '%phone%'" },
  { label: 'IN', sql: "SELECT * FROM users WHERE role IN ('admin', 'moderator')" },
];

export default function SqlToMongodbConverter() {
  const t = useTranslations('tools.sql-to-mongodb-converter');
  const tCommon = useTranslations('tools');
  const [sql, setSql] = useState('');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (!sql.trim()) return null;
    return convertSqlToMongo(sql);
  }, [sql]);

  const handleCopy = useCallback(() => {
    if (result) {
      navigator.clipboard.writeText(result.query);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [result]);

  const handleClear = useCallback(() => {
    setSql('');
  }, []);

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            SQL Query
          </label>
          <div className="flex gap-2">
            {EXAMPLES.slice(0, 4).map(ex => (
              <button
                key={ex.label}
                onClick={() => setSql(ex.sql)}
                className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                {ex.label}
              </button>
            ))}
          </div>
        </div>
        <textarea
          value={sql}
          onChange={(e) => setSql(e.target.value)}
          placeholder={t("inputPlaceholder")}
          className="w-full h-32 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm resize-none"
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleClear}
          className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
        >
          {tCommon('clear')}
        </button>
      </div>

      {/* Error */}
      {sql.trim() && !result && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
          Unable to convert SQL query. Please check the syntax.
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-sm font-medium">
              {result.operation}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Collection: <span className="font-mono">{result.collection}</span>
            </span>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                MongoDB Query
              </label>
              <button
                onClick={handleCopy}
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                {copied ? tCommon('copied') : tCommon('copy')}
              </button>
            </div>
            <pre className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-x-auto text-sm font-mono text-gray-800 dark:text-gray-200">
              {result.query}
            </pre>
          </div>
        </div>
      )}

      {/* Examples */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          More Examples
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {EXAMPLES.map(ex => (
            <button
              key={ex.sql}
              onClick={() => setSql(ex.sql)}
              className="p-3 text-left text-xs bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500"
            >
              <span className="font-medium text-blue-600 dark:text-blue-400">{ex.label}</span>
              <span className="block font-mono text-gray-600 dark:text-gray-400 mt-1 truncate">
                {ex.sql}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Reference */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">Supported SQL Operations</h4>
        <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
          <li>• SELECT with WHERE, ORDER BY, LIMIT, OFFSET</li>
          <li>• INSERT INTO ... VALUES</li>
          <li>• UPDATE ... SET ... WHERE</li>
          <li>• DELETE FROM ... WHERE</li>
          <li>• COUNT(*) queries</li>
          <li>• Operators: =, !=, &gt;, &lt;, &gt;=, &lt;=, IN, NOT IN, LIKE, IS NULL</li>
        </ul>
      </div>
    </div>
  );
}
