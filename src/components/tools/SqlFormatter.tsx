'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

const SQL_KEYWORDS = [
  'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'NOT', 'IN', 'LIKE', 'BETWEEN',
  'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'FULL', 'CROSS', 'ON',
  'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'OFFSET', 'UNION', 'ALL',
  'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'CREATE', 'TABLE',
  'ALTER', 'DROP', 'INDEX', 'VIEW', 'AS', 'DISTINCT', 'COUNT', 'SUM',
  'AVG', 'MAX', 'MIN', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'NULL',
  'IS', 'ASC', 'DESC', 'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES', 'CASCADE'
];

function formatSql(sql: string): string {
  let formatted = sql.trim();
  
  // Normalize whitespace
  formatted = formatted.replace(/\s+/g, ' ');
  
  // Add newlines before major keywords
  const majorKeywords = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'OUTER JOIN', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'UNION', 'INSERT', 'UPDATE', 'DELETE', 'SET', 'VALUES'];
  
  majorKeywords.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    formatted = formatted.replace(regex, `\n${keyword}`);
  });
  
  // Uppercase keywords
  SQL_KEYWORDS.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    formatted = formatted.replace(regex, keyword);
  });
  
  // Clean up
  formatted = formatted.replace(/^\n+/, '');
  formatted = formatted.replace(/\n\s*\n/g, '\n');
  
  // Indent
  const lines = formatted.split('\n');
  const indentedLines = lines.map((line, index) => {
    const trimmed = line.trim();
    if (index === 0) return trimmed;
    if (/^(SELECT|FROM|WHERE|GROUP BY|ORDER BY|HAVING|LIMIT|SET|VALUES)/i.test(trimmed)) {
      return trimmed;
    }
    if (/^(AND|OR|JOIN|LEFT|RIGHT|INNER|OUTER)/i.test(trimmed)) {
      return '  ' + trimmed;
    }
    return '    ' + trimmed;
  });
  
  return indentedLines.join('\n');
}

function minifySql(sql: string): string {
  return sql
    .replace(/--.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export default function SqlFormatter() {
  const t = useTranslations('tools');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const format = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }
    setOutput(formatSql(input));
  };

  const minify = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }
    setOutput(minifySql(input));
  };

  const copyOutput = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exampleSql = `select id, name, email from users where status = 'active' and created_at > '2024-01-01' order by name asc limit 10`;

  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">{t('input')}</label>
          <button
            onClick={() => setInput(exampleSql)}
            className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded text-gray-900 dark:text-gray-100"
          >
            {t('sql.loadExample')}
          </button>
        </div>
        <textarea
          className="tool-textarea font-mono text-sm"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('sql.loadExample')}
          rows={6}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={format} className="btn-primary">
          {t('format')}
        </button>
        <button onClick={minify} className="btn-secondary">
          {t('minify')}
        </button>
        <button onClick={() => { setInput(''); setOutput(''); }} className="btn-secondary">
          {t('clear')}
        </button>
      </div>

      {output && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">{t('output')}</label>
            <button
              onClick={copyOutput}
              className={`text-sm px-3 py-1 rounded ${copied ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100'}`}
            >
              {copied ? t('copied') : t('copy')}
            </button>
          </div>
          <textarea
            className="tool-textarea font-mono text-sm"
            value={output}
            readOnly
            rows={10}
          />
        </div>
      )}
    </div>
  );
}
