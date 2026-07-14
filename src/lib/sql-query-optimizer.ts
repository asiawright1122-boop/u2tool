import { formatSql } from './runtime-integrity/sql';

export const EXAMPLE_SQL = `SELECT *
FROM orders
WHERE LOWER(customer_email) = 'alice@example.com'
ORDER BY created_at DESC;`;

export type SqlDialect =
  | 'generic'
  | 'postgresql'
  | 'mysql'
  | 'sqlite'
  | 'sql-server';

export interface SqlSuggestion {
  code: string;
  severity: 'warning' | 'improvement' | 'info';
  message: string;
  evidence: string;
  indexCandidates: string[];
}

export interface ExplainFinding {
  code: string;
  severity: 'warning' | 'info';
  message: string;
  evidence: string;
}

export interface SqlAnalysisResult {
  dialect: SqlDialect;
  formattedSql: string;
  score: number;
  suggestions: SqlSuggestion[];
  explainFindings: ExplainFinding[];
  limitations: string[];
}

export interface AnalyzeSqlInput {
  sql: string;
  dialect: SqlDialect;
  explainText?: string;
}

function excerpt(value: string, match: RegExpMatchArray | null): string {
  if (!match || match.index === undefined) {
    return value.trim().slice(0, 160);
  }

  const start = match.index < 48 ? 0 : match.index - 32;
  const end = Math.min(value.length, match.index + match[0].length + 64);
  return value.slice(start, end).replace(/\s+/g, ' ').trim();
}

function maskSqlNonCode(sql: string): {
  codeSql: string;
  unterminated: boolean;
} {
  const masked = sql.split('');
  let unterminated = false;
  const blank = (index: number) => {
    if (masked[index] !== '\n' && masked[index] !== '\r') {
      masked[index] = ' ';
    }
  };
  let index = 0;

  while (index < sql.length) {
    if (sql.startsWith('--', index) || sql[index] === '#') {
      while (index < sql.length && sql[index] !== '\n') {
        blank(index);
        index += 1;
      }
      continue;
    }

    if (sql.startsWith('/*', index)) {
      blank(index);
      blank(index + 1);
      index += 2;
      while (index < sql.length && !sql.startsWith('*/', index)) {
        blank(index);
        index += 1;
      }
      if (index < sql.length) {
        blank(index);
        blank(index + 1);
        index += 2;
      } else {
        unterminated = true;
      }
      continue;
    }

    const dollarDelimiter = sql.slice(index).match(/^\$(?:[A-Za-z_][A-Za-z0-9_]*)?\$/)?.[0];
    if (dollarDelimiter) {
      for (let offset = 0; offset < dollarDelimiter.length; offset += 1) {
        blank(index + offset);
      }
      index += dollarDelimiter.length;
      const closingIndex = sql.indexOf(dollarDelimiter, index);
      const contentEnd = closingIndex === -1 ? sql.length : closingIndex;
      while (index < contentEnd) {
        blank(index);
        index += 1;
      }
      if (closingIndex !== -1) {
        for (let offset = 0; offset < dollarDelimiter.length; offset += 1) {
          blank(index + offset);
        }
        index += dollarDelimiter.length;
      } else {
        unterminated = true;
      }
      continue;
    }

    const quote = sql[index];
    if (quote === "'" || quote === '"') {
      index += 1;
      let closed = false;
      while (index < sql.length) {
        if (sql[index] === quote) {
          if (sql[index + 1] === quote) {
            blank(index);
            blank(index + 1);
            index += 2;
            continue;
          }
          index += 1;
          closed = true;
          break;
        }
        if (sql[index] !== '%') {
          masked[index] = sql[index] === '\n' || sql[index] === '\r' ? sql[index] : '_';
        }
        index += 1;
      }
      if (!closed) {
        unterminated = true;
      }
      continue;
    }

    if (quote === '`' || quote === '[') {
      const closing = quote === '[' ? ']' : '`';
      index += 1;
      while (index < sql.length && sql[index] !== closing) {
        masked[index] = sql[index] === '\n' || sql[index] === '\r' ? sql[index] : '_';
        index += 1;
      }
      if (index < sql.length) {
        index += 1;
      } else {
        unterminated = true;
      }
      continue;
    }

    index += 1;
  }

  return { codeSql: masked.join(''), unterminated };
}

export function analyzeSql(input: AnalyzeSqlInput): SqlAnalysisResult {
  const sql = String(input.sql ?? '').trim();
  const { codeSql, unterminated } = maskSqlNonCode(sql);
  const explainText = String(input.explainText ?? '').trim();
  const suggestions: SqlSuggestion[] = [];
  const explainFindings: ExplainFinding[] = [];
  let score = 100;

  const addSuggestion = (
    code: string,
    severity: SqlSuggestion['severity'],
    message: string,
    match: RegExpMatchArray | null,
    indexCandidates: string[] = [],
  ) => {
    suggestions.push({
      code,
      severity,
      message,
      evidence: excerpt(sql, match),
      indexCandidates,
    });
    score -= severity === 'warning' ? 20 : severity === 'improvement' ? 12 : 5;
  };

  const addExplainFinding = (
    code: string,
    severity: ExplainFinding['severity'],
    message: string,
    match: RegExpMatchArray,
  ) => {
    explainFindings.push({
      code,
      severity,
      message,
      evidence: excerpt(explainText, match),
    });
    score -= severity === 'warning' ? 15 : 5;
  };

  if (unterminated) {
    addSuggestion(
      'possibly-malformed-sql',
      'warning',
      'The SQL appears to contain an unterminated quote or comment, so other findings may be incomplete; review the syntax before relying on this static analysis.',
      null,
    );
  }

  const selectStar = codeSql.match(/^\s*select\s+\*/i);
  if (selectStar) {
    addSuggestion(
      'select-star',
      'improvement',
      'SELECT * may read columns the caller does not need; review an explicit column list.',
      selectStar,
    );
  }

  const select = codeSql.match(/^\s*select\b/i);
  const hasRowBound =
    /\blimit\b/i.test(codeSql) ||
    (input.dialect === 'sql-server' &&
      (/^\s*select\s+(?:distinct\s+)?top\s*(?:\(\s*\d+\s*\)|\d+)(?:\s+|$)/i.test(
        codeSql,
      ) ||
        /\bfetch\s+(?:next|first)\s+\d+\s+rows?\s+only\b/i.test(codeSql)));
  if (select && !hasRowBound) {
    addSuggestion(
      'unbounded-read',
      'improvement',
      'This SELECT may return an unbounded result set; consider a dialect-appropriate row limit when the caller needs only part of it.',
      select,
    );
  }

  const writeStatement = codeSql.match(/^\s*(?:update|delete\s+from)\b/i);
  if (writeStatement && !/\bwhere\b/i.test(codeSql)) {
    addSuggestion(
      'write-without-where',
      'warning',
      'This statement may affect every row because no WHERE clause was detected; review the target scope before running it elsewhere.',
      writeStatement,
    );
  }

  const leadingWildcard = codeSql.match(/\blike\s+(['"])%/i);
  if (leadingWildcard) {
    addSuggestion(
      'leading-wildcard-like',
      'warning',
      'A leading-wildcard LIKE filter may prevent a conventional B-tree index from narrowing the search; consider a database-specific text-search option.',
      leadingWildcard,
    );
  }

  const filteredFunction = codeSql.match(
    /\bwhere\b[\s\S]*?\b(?:lower|upper|date|cast|substring)\s*\(/i,
  );
  if (filteredFunction) {
    addSuggestion(
      'filtered-column-function',
      'warning',
      'A function applied in the filter may make a plain column index less useful; review normalized data or a matching expression index where supported.',
      filteredFunction,
    );
  }

  const orFilter = codeSql.match(/\bwhere\b[\s\S]*?\bor\b/i);
  if (orFilter) {
    addSuggestion(
      'or-filter',
      'info',
      'OR predicates can make index selection harder; consider whether separate indexed branches would be clearer for this workload.',
      orFilter,
    );
  }

  const table = codeSql.match(/\bfrom\s+([\w."`\[\]-]+)/i)?.[1]
    ?.replace(/["`\[\]]/g, '');
  const whereClause = codeSql.match(
    /\bwhere\b([\s\S]*?)(?:\border\s+by\b|\bgroup\s+by\b|\blimit\b|\boffset\b|;|$)/i,
  );
  const equalityColumns = whereClause?.[1]
    .split(/\band\b/i)
    .map((condition) =>
      condition.match(/^\s*([\w."`\[\]-]+)\s*=/i)?.[1]
        ?.replace(/["`\[\]]/g, '')
        .replace(/^.*\./, ''),
    )
    .filter((column): column is string => Boolean(column)) ?? [];
  const orderColumns =
    codeSql
      .match(/\border\s+by\b([\s\S]*?)(?:\blimit\b|\boffset\b|;|$)/i)?.[1]
      .split(',')
      .map((order) =>
        order
          .trim()
          .replace(/\s+(?:asc|desc)\b.*$/i, '')
          .replace(/["`\[\]]/g, '')
          .replace(/^.*\./, ''),
      )
      .filter(Boolean) ?? [];
  const indexColumns = [...new Set([...equalityColumns, ...orderColumns])];
  if (table && indexColumns.length >= 2) {
    addSuggestion(
      'composite-index-candidate',
      'info',
      'This column order is a review candidate for a composite index, but schema statistics and existing indexes may make another order better.',
      whereClause,
      [`${table} (${indexColumns.join(', ')})`],
    );
  }

  if (explainText) {
    if (input.dialect === 'postgresql') {
      const match = explainText.match(/\bseq\s+scan\b/i);
      if (match) {
        addExplainFinding(
          'postgresql-sequential-scan',
          'warning',
          'The pasted PostgreSQL plan contains a Seq Scan token, which may indicate a broad table read; review row estimates, selectivity, and available indexes in the database.',
          match,
        );
      }
    } else if (input.dialect === 'mysql') {
      const match = explainText.match(/\btype\s*:\s*all\b/i);
      if (match) {
        addExplainFinding(
          'mysql-full-scan',
          'warning',
          'The pasted MySQL plan reports type: ALL, which may indicate a full table scan; review the possible_keys, key, rows, and filtered fields in the original plan.',
          match,
        );
      }
    } else if (input.dialect === 'sqlite') {
      const match = explainText.match(/(?:^|\n)\s*scan\s+[^\n]+/i);
      if (match) {
        addExplainFinding(
          'sqlite-table-scan',
          'warning',
          'The pasted SQLite plan contains a SCAN step, which may read many rows; review whether a selective SEARCH step or suitable index is possible.',
          match,
        );
      }
    } else if (input.dialect === 'sql-server') {
      const match = explainText.match(/\btable\s+scan\b/i);
      if (match) {
        addExplainFinding(
          'sql-server-table-scan',
          'warning',
          'The pasted SQL Server plan text contains Table Scan, which may indicate a broad read; review estimated rows, predicates, and index choices in the full plan.',
          match,
        );
      }
    }
  }

  return {
    dialect: input.dialect,
    formattedSql: formatSql(sql),
    score: Math.max(0, Math.min(100, score)),
    suggestions,
    explainFindings,
    limitations: [
      'Static text review only; no database connection or query execution occurs.',
      'The analyzer does not rewrite SQL or apply changes automatically.',
      'Index candidates are hypotheses and are not verified against a schema.',
      'Suggestions do not guarantee faster queries.',
    ],
  };
}
