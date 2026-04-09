const CLAUSE_KEYWORDS = [
  'LEFT OUTER JOIN',
  'RIGHT OUTER JOIN',
  'FULL OUTER JOIN',
  'INNER JOIN',
  'LEFT JOIN',
  'RIGHT JOIN',
  'ORDER BY',
  'GROUP BY',
  'DELETE FROM',
  'INSERT INTO',
  'UNION ALL',
  'UPDATE',
  'SELECT',
  'FROM',
  'WHERE',
  'HAVING',
  'LIMIT',
  'OFFSET',
  'VALUES',
  'SET',
  'JOIN',
  'UNION',
];

function protectQuotedStrings(sql: string): { protectedSql: string; strings: string[] } {
  const strings: string[] = [];
  const protectedSql = sql.replace(/'(?:''|[^'])*'|"(?:\\"|[^"])*"/g, (match) => {
    strings.push(match);
    return `__SQL_STRING_${strings.length - 1}__`;
  });

  return { protectedSql, strings };
}

function restoreQuotedStrings(sql: string, strings: string[]): string {
  return sql.replace(/__SQL_STRING_(\d+)__/g, (_match, index) => strings[Number(index)] || '');
}

function normalizeWhitespace(sql: string): string {
  return sql.replace(/\s+/g, ' ').trim();
}

function applyKeywordCase(sql: string): string {
  let result = sql;
  for (const keyword of [...CLAUSE_KEYWORDS, 'AND', 'OR', 'ASC', 'DESC']) {
    const pattern = new RegExp(`\\b${keyword.replace(/\s+/g, '\\s+')}\\b`, 'gi');
    result = result.replace(pattern, keyword);
  }
  return result;
}

export function formatSql(sql: string): string {
  if (!sql.trim()) {
    return '';
  }

  const { protectedSql, strings } = protectQuotedStrings(sql);
  let formatted = applyKeywordCase(normalizeWhitespace(protectedSql));

  for (const keyword of CLAUSE_KEYWORDS) {
    const pattern = new RegExp(`\\b${keyword.replace(/\s+/g, '\\s+')}\\b`, 'g');
    formatted = formatted.replace(pattern, `\n${keyword}`);
  }

  formatted = formatted
    .replace(/\bAND\b/g, '\n  AND')
    .replace(/\bOR\b/g, '\n  OR')
    .replace(/,\s*/g, ',\n  ')
    .replace(/\(\s+/g, '(')
    .replace(/\s+\)/g, ')')
    .trim();

  if (formatted.startsWith('SELECT')) {
    formatted = formatted.replace(/^SELECT\s+/, 'SELECT\n  ');
  }

  return restoreQuotedStrings(formatted, strings).trim();
}

export function minifySql(sql: string): string {
  if (!sql.trim()) {
    return '';
  }

  const { protectedSql, strings } = protectQuotedStrings(sql);
  const minified = applyKeywordCase(
    normalizeWhitespace(protectedSql)
      .replace(/\s*,\s*/g, ', ')
      .replace(/\s*\(\s*/g, '(')
      .replace(/\s*\)\s*/g, ') ')
      .trim()
  );

  return restoreQuotedStrings(minified, strings).replace(/\s+/g, ' ').trim();
}
