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

type ProtectedKind = 'comment' | 'string' | 'identifier';
type TokenKind = 'word' | 'number' | 'symbol' | 'string' | 'identifier';

interface ProtectedToken {
  kind: ProtectedKind;
  start: number;
  end: number;
  raw: string;
}

interface SqlToken {
  kind: TokenKind;
  start: number;
  end: number;
  depth: number;
  raw: string;
  value: string;
}

interface LexedSql {
  tokens: SqlToken[];
  protectedTokens: ProtectedToken[];
  malformed: boolean;
}

interface SqlStatement {
  start: number;
  end: number;
  tokens: SqlToken[];
  topLevelTokens: SqlToken[];
  rootKind: 'select' | 'update' | 'delete' | 'insert' | 'merge' | 'other';
  rootToken: SqlToken;
}

interface EvidenceRange {
  start: number;
  end: number;
}

const ROOT_STATEMENT_WORDS = new Set([
  'SELECT',
  'UPDATE',
  'DELETE',
  'INSERT',
  'MERGE',
]);
const FILTER_END_WORDS = new Set([
  'GROUP',
  'HAVING',
  'ORDER',
  'LIMIT',
  'OFFSET',
  'FETCH',
  'RETURNING',
  'UNION',
  'EXCEPT',
  'INTERSECT',
  'WINDOW',
]);
const ORDER_END_WORDS = new Set([
  'LIMIT',
  'OFFSET',
  'FETCH',
  'RETURNING',
  'UNION',
  'EXCEPT',
  'INTERSECT',
]);
const FILTER_FUNCTIONS = new Set([
  'LOWER',
  'UPPER',
  'DATE',
  'CAST',
  'SUBSTRING',
]);

function excerpt(value: string, focus?: EvidenceRange): string {
  const maxRawLength = 180;
  const beforeLength = 48;
  const focusStart = Math.max(0, Math.min(value.length, focus?.start ?? 0));
  const focusEnd = Math.max(
    focusStart,
    Math.min(value.length, focus?.end ?? Math.min(value.length, maxRawLength)),
  );
  let start = Math.max(0, focusStart - beforeLength);
  let end = Math.min(
    value.length,
    Math.max(focusEnd, focusStart + 1) + (maxRawLength - beforeLength),
  );

  if (end - start > maxRawLength) {
    end = start + maxRawLength;
  }
  if (end - start < maxRawLength && end === value.length) {
    start = Math.max(0, end - maxRawLength);
  }

  const prefix = start > 0 ? '…' : '';
  const suffix = end < value.length ? '…' : '';
  return `${prefix}${value.slice(start, end).replace(/\s+/g, ' ').trim()}${suffix}`;
}

function isWordBoundary(value: string | undefined): boolean {
  return value === undefined || !/[A-Za-z0-9_$]/.test(value);
}

function readQuotedToken(
  sql: string,
  quoteIndex: number,
  quote: "'" | '"' | '`',
  allowBackslashEscapes: boolean,
): { end: number; closed: boolean } {
  let index = quoteIndex + 1;

  while (index < sql.length) {
    if (allowBackslashEscapes && sql[index] === '\\') {
      index = Math.min(sql.length, index + 2);
      continue;
    }
    if (sql[index] === quote) {
      if (sql[index + 1] === quote) {
        index += 2;
        continue;
      }
      return { end: index + 1, closed: true };
    }
    index += 1;
  }

  return { end: sql.length, closed: false };
}

function readBracketIdentifier(
  sql: string,
  start: number,
): { end: number; closed: boolean } {
  let index = start + 1;
  while (index < sql.length) {
    if (sql[index] === ']') {
      if (sql[index + 1] === ']') {
        index += 2;
        continue;
      }
      return { end: index + 1, closed: true };
    }
    index += 1;
  }
  return { end: sql.length, closed: false };
}

function readBlockComment(
  sql: string,
  start: number,
): { end: number; closed: boolean } {
  let depth = 1;
  let index = start + 2;
  while (index < sql.length) {
    if (sql.startsWith('/*', index)) {
      depth += 1;
      index += 2;
      continue;
    }
    if (sql.startsWith('*/', index)) {
      depth -= 1;
      index += 2;
      if (depth === 0) {
        return { end: index, closed: true };
      }
      continue;
    }
    index += 1;
  }
  return { end: sql.length, closed: false };
}

function unquoteIdentifier(raw: string): string {
  if (raw.startsWith('[')) {
    return raw.slice(1, -1).replace(/]]/g, ']');
  }
  const quote = raw[0];
  return raw.slice(1, -1).replace(new RegExp(`${quote}${quote}`, 'g'), quote);
}

function lexSql(sql: string, dialect: SqlDialect): LexedSql {
  const tokens: SqlToken[] = [];
  const protectedTokens: ProtectedToken[] = [];
  let malformed = false;
  let depth = 0;
  let index = 0;

  const addProtected = (
    kind: ProtectedKind,
    start: number,
    end: number,
    closed: boolean,
    tokenKind?: 'string' | 'identifier',
  ) => {
    const raw = sql.slice(start, end);
    protectedTokens.push({ kind, start, end, raw });
    if (!closed) malformed = true;
    if (tokenKind) {
      tokens.push({
        kind: tokenKind,
        start,
        end,
        depth,
        raw,
        value: tokenKind === 'identifier' ? unquoteIdentifier(raw) : raw,
      });
    }
    index = end;
  };

  while (index < sql.length) {
    const character = sql[index];

    const mysqlDashComment =
      dialect !== 'mysql' || isWordBoundary(sql[index + 2]);
    if (sql.startsWith('--', index) && mysqlDashComment) {
      const newline = sql.indexOf('\n', index + 2);
      const end = newline === -1 ? sql.length : newline;
      addProtected('comment', index, end, true);
      continue;
    }
    if (dialect === 'mysql' && character === '#') {
      const newline = sql.indexOf('\n', index + 1);
      const end = newline === -1 ? sql.length : newline;
      addProtected('comment', index, end, true);
      continue;
    }
    if (sql.startsWith('/*', index)) {
      const block = readBlockComment(sql, index);
      addProtected('comment', index, block.end, block.closed);
      continue;
    }

    if (
      dialect === 'postgresql' &&
      (character === 'E' || character === 'e') &&
      sql[index + 1] === "'" &&
      isWordBoundary(sql[index - 1])
    ) {
      const quoted = readQuotedToken(sql, index + 1, "'", true);
      addProtected('string', index, quoted.end, quoted.closed, 'string');
      continue;
    }

    const dollarDelimiter = sql
      .slice(index)
      .match(/^\$(?:[A-Za-z_][A-Za-z0-9_]*)?\$/)?.[0];
    if (dollarDelimiter) {
      const closingIndex = sql.indexOf(
        dollarDelimiter,
        index + dollarDelimiter.length,
      );
      const closed = closingIndex !== -1;
      const end = closed
        ? closingIndex + dollarDelimiter.length
        : sql.length;
      addProtected('string', index, end, closed, 'string');
      continue;
    }

    if (character === "'" || character === '"' || character === '`') {
      const quotedKind =
        character === "'" || (character === '"' && dialect === 'mysql')
          ? 'string'
          : 'identifier';
      const quoted = readQuotedToken(
        sql,
        index,
        character,
        dialect === 'mysql',
      );
      addProtected(
        quotedKind,
        index,
        quoted.end,
        quoted.closed,
        quotedKind,
      );
      continue;
    }

    if (character === '[') {
      const bracket = readBracketIdentifier(sql, index);
      addProtected(
        'identifier',
        index,
        bracket.end,
        bracket.closed,
        'identifier',
      );
      continue;
    }

    if (/\s/.test(character)) {
      index += 1;
      continue;
    }

    if (/[A-Za-z_$]/.test(character)) {
      const start = index;
      index += 1;
      while (index < sql.length && /[A-Za-z0-9_$]/.test(sql[index])) {
        index += 1;
      }
      const raw = sql.slice(start, index);
      tokens.push({
        kind: 'word',
        start,
        end: index,
        depth,
        raw,
        value: raw,
      });
      continue;
    }

    if (/\d/.test(character)) {
      const start = index;
      index += 1;
      while (index < sql.length && /[\d.]/.test(sql[index])) index += 1;
      const raw = sql.slice(start, index);
      tokens.push({
        kind: 'number',
        start,
        end: index,
        depth,
        raw,
        value: raw,
      });
      continue;
    }

    const start = index;
    const pair = sql.slice(index, index + 2);
    const symbol = ['>=', '<=', '!=', '<>', '==', ':=', '::'].includes(pair)
      ? pair
      : character;
    if (symbol === '(') {
      tokens.push({
        kind: 'symbol',
        start,
        end: start + 1,
        depth,
        raw: symbol,
        value: symbol,
      });
      depth += 1;
    } else if (symbol === ')') {
      if (depth === 0) malformed = true;
      depth = Math.max(0, depth - 1);
      tokens.push({
        kind: 'symbol',
        start,
        end: start + 1,
        depth,
        raw: symbol,
        value: symbol,
      });
    } else {
      tokens.push({
        kind: 'symbol',
        start,
        end: start + symbol.length,
        depth,
        raw: symbol,
        value: symbol,
      });
    }
    index += symbol.length;
  }

  if (depth !== 0) malformed = true;
  return { tokens, protectedTokens, malformed };
}

function tokenWord(token: SqlToken | undefined): string {
  return token?.kind === 'word' ? token.value.toUpperCase() : '';
}

function splitStatements(sql: string, lexed: LexedSql): SqlStatement[] {
  const boundaries = lexed.tokens.filter(
    (token) => token.depth === 0 && token.kind === 'symbol' && token.value === ';',
  );
  const ranges: EvidenceRange[] = [];
  let start = 0;
  for (const boundary of boundaries) {
    ranges.push({ start, end: boundary.end });
    start = boundary.end;
  }
  if (start < sql.length) ranges.push({ start, end: sql.length });

  const statements: SqlStatement[] = [];
  for (const range of ranges) {
    const tokens = lexed.tokens.filter(
      (token) =>
        token.start >= range.start &&
        token.end <= range.end &&
        !(token.kind === 'symbol' && token.value === ';'),
    );
    const topLevelTokens = tokens.filter((token) => token.depth === 0);
    const firstWordIndex = topLevelTokens.findIndex(
      (token) => token.kind === 'word',
    );
    if (firstWordIndex === -1) continue;

    let rootToken = topLevelTokens[firstWordIndex];
    if (tokenWord(rootToken) === 'WITH') {
      rootToken =
        topLevelTokens
          .slice(firstWordIndex + 1)
          .find((token) => ROOT_STATEMENT_WORDS.has(tokenWord(token))) ??
        rootToken;
    }

    const rootWord = tokenWord(rootToken).toLowerCase();
    const rootKind = ['select', 'update', 'delete', 'insert', 'merge'].includes(
      rootWord,
    )
      ? (rootWord as SqlStatement['rootKind'])
      : 'other';
    statements.push({
      start: range.start,
      end: range.end,
      tokens,
      topLevelTokens,
      rootKind,
      rootToken,
    });
  }
  return statements;
}

function topTokenIndex(statement: SqlStatement, token: SqlToken): number {
  return statement.topLevelTokens.indexOf(token);
}

function hasTopLevelOrderBy(statement: SqlStatement): boolean {
  const rootIndex = topTokenIndex(statement, statement.rootToken);
  const tokens = statement.topLevelTokens;
  for (let index = rootIndex + 1; index < tokens.length - 1; index += 1) {
    if (tokenWord(tokens[index]) === 'ORDER' && tokenWord(tokens[index + 1]) === 'BY') {
      return true;
    }
  }
  return false;
}

function hasTopLevelRowBound(
  statement: SqlStatement,
  dialect: SqlDialect,
): boolean {
  const rootIndex = topTokenIndex(statement, statement.rootToken);
  const tokens = statement.topLevelTokens.slice(rootIndex + 1);
  if (tokens.some((token) => ['LIMIT', 'FETCH'].includes(tokenWord(token)))) {
    return true;
  }
  if (dialect !== 'sql-server') return false;

  const fromIndex = tokens.findIndex((token) => tokenWord(token) === 'FROM');
  const selectListTokens = fromIndex === -1 ? tokens : tokens.slice(0, fromIndex);
  return selectListTokens.some((token) => tokenWord(token) === 'TOP');
}

function selectStarToken(statement: SqlStatement): SqlToken | undefined {
  if (statement.rootKind !== 'select') return undefined;
  const rootIndex = topTokenIndex(statement, statement.rootToken);
  const tokens = statement.topLevelTokens;
  const fromIndex = tokens.findIndex(
    (token, index) => index > rootIndex && tokenWord(token) === 'FROM',
  );
  const end = fromIndex === -1 ? tokens.length : fromIndex;
  return tokens
    .slice(rootIndex + 1, end)
    .find((token) => token.kind === 'symbol' && token.value === '*');
}

function clauseRange(
  statement: SqlStatement,
  startWord: 'WHERE' | 'ORDER',
): EvidenceRange | undefined {
  const rootIndex = topTokenIndex(statement, statement.rootToken);
  const tokens = statement.topLevelTokens;
  const startIndex = tokens.findIndex(
    (token, index) => index > rootIndex && tokenWord(token) === startWord,
  );
  if (startIndex === -1) return undefined;
  const contentStart =
    startWord === 'ORDER' && tokenWord(tokens[startIndex + 1]) === 'BY'
      ? startIndex + 2
      : startIndex + 1;
  const endWords = startWord === 'WHERE' ? FILTER_END_WORDS : ORDER_END_WORDS;
  const endToken = tokens
    .slice(contentStart)
    .find((token) => endWords.has(tokenWord(token)));
  return {
    start: tokens[startIndex].start,
    end: endToken?.start ?? statement.end,
  };
}

function tokensInRange(
  statement: SqlStatement,
  range: EvidenceRange | undefined,
  topLevelOnly = false,
): SqlToken[] {
  if (!range) return [];
  return statement.tokens.filter(
    (token) =>
      token.start >= range.start &&
      token.end <= range.end &&
      (!topLevelOnly || token.depth === 0),
  );
}

function stringStartsWithPercent(token: SqlToken): boolean {
  const raw = token.raw;
  if (raw.startsWith('$')) {
    const delimiter = raw.match(/^\$(?:[A-Za-z_][A-Za-z0-9_]*)?\$/)?.[0];
    return delimiter ? raw.slice(delimiter.length).startsWith('%') : false;
  }
  const quoteIndex = /^[Ee]'/.test(raw) ? 1 : 0;
  return (
    (raw[quoteIndex] === "'" || raw[quoteIndex] === '"') &&
    raw[quoteIndex + 1] === '%'
  );
}

function simpleIdentifierName(token: SqlToken | undefined): string | undefined {
  if (!token || (token.kind !== 'word' && token.kind !== 'identifier')) {
    return undefined;
  }
  return token.value.replace(/^.*\./, '');
}

function equalityColumns(statement: SqlStatement, where: EvidenceRange): string[] {
  const tokens = tokensInRange(statement, where, true);
  const columns: string[] = [];
  for (let index = 1; index < tokens.length; index += 1) {
    if (tokens[index].kind !== 'symbol' || tokens[index].value !== '=') continue;
    const previous = tokens[index - 1];
    const beforePrevious = tokens[index - 2];
    if (
      beforePrevious?.kind === 'symbol' &&
      [':', '::'].includes(beforePrevious.value)
    ) {
      continue;
    }
    const column = simpleIdentifierName(previous);
    if (column) columns.push(column);
  }
  return [...new Set(columns)];
}

function orderColumns(statement: SqlStatement): string[] {
  const order = clauseRange(statement, 'ORDER');
  const tokens = tokensInRange(statement, order, true).slice(2);
  const segments: SqlToken[][] = [[]];
  for (const token of tokens) {
    if (token.kind === 'symbol' && token.value === ',') {
      segments.push([]);
    } else {
      segments.at(-1)?.push(token);
    }
  }

  const columns: string[] = [];
  for (const segment of segments) {
    if (segment.some((token) => token.kind === 'symbol' && token.value === '(')) {
      continue;
    }
    const identifiers = segment.filter(
      (token) =>
        (token.kind === 'word' || token.kind === 'identifier') &&
        !['ASC', 'DESC', 'NULLS', 'FIRST', 'LAST'].includes(tokenWord(token)),
    );
    const column = simpleIdentifierName(identifiers.at(-1));
    if (column) columns.push(column);
  }
  return [...new Set(columns)];
}

function statementTable(statement: SqlStatement): string | undefined {
  const rootIndex = topTokenIndex(statement, statement.rootToken);
  const tokens = statement.topLevelTokens;
  let tableStart = rootIndex + 1;
  if (statement.rootKind === 'select') {
    tableStart = tokens.findIndex(
      (token, index) => index > rootIndex && tokenWord(token) === 'FROM',
    ) + 1;
  } else if (statement.rootKind === 'delete') {
    const fromIndex = tokens.findIndex(
      (token, index) => index > rootIndex && tokenWord(token) === 'FROM',
    );
    tableStart = fromIndex === -1 ? rootIndex + 1 : fromIndex + 1;
  }
  if (tableStart <= 0 || tableStart >= tokens.length) return undefined;

  const parts: string[] = [];
  for (let index = tableStart; index < tokens.length; index += 1) {
    const token = tokens[index];
    const name = simpleIdentifierName(token);
    if (name) {
      if (['TOP', 'ONLY', 'LOW_PRIORITY', 'IGNORE'].includes(tokenWord(token))) {
        continue;
      }
      parts.push(name);
      if (tokens[index + 1]?.value !== '.') break;
      continue;
    }
    if (token.kind === 'symbol' && ['(', ')', '.'].includes(token.value)) {
      continue;
    }
    break;
  }
  return parts.length > 0 ? parts.join('.') : undefined;
}

function formatSqlPreservingTokens(sql: string, tokens: ProtectedToken[]): string {
  if (!sql.trim()) return '';
  let sentinel = '\uE000SQL_PROTECTED_';
  while (sql.includes(sentinel)) sentinel += '_';
  const replacements = tokens.map((token, index) => ({
    token,
    placeholder: `${sentinel}${index}\uE001`,
  }));
  let protectedSql = sql;
  for (const replacement of [...replacements].reverse()) {
    protectedSql =
      protectedSql.slice(0, replacement.token.start) +
      replacement.placeholder +
      protectedSql.slice(replacement.token.end);
  }
  let formatted = formatSql(protectedSql);
  for (const replacement of replacements) {
    formatted = formatted.replace(
      replacement.placeholder,
      () => replacement.token.raw,
    );
  }
  return formatted;
}

function isNegatedOrNeverExecuted(line: string): boolean {
  return (
    /\b(?:never executed|loops\s*=\s*0|actual loops?\s*[:=]\s*0|actual executions?\s*[:=]\s*0)\b/i.test(line) ||
    /\b(?:no|not|without|avoids?|avoided|did not|does not|isn't|wasn't)\b.{0,32}\b(?:scan|type\s*:\s*all)\b/i.test(
      line,
    )
  );
}

function lineMatches(
  value: string,
  predicate: (line: string) => RegExpMatchArray | null,
): EvidenceRange | undefined {
  let offset = 0;
  for (const line of value.split(/\r?\n/)) {
    const match = predicate(line);
    if (match?.index !== undefined) {
      return {
        start: offset + match.index,
        end: offset + match.index + match[0].length,
      };
    }
    offset += line.length + 1;
  }
  return undefined;
}

function jsonPlanHasNode(
  value: unknown,
  key: string,
  expected: string,
): boolean {
  if (Array.isArray(value)) {
    return value.some((item) => jsonPlanHasNode(item, key, expected));
  }
  if (!value || typeof value !== 'object') return false;
  const record = value as Record<string, unknown>;
  if (
    String(record[key] ?? '').toUpperCase() === expected.toUpperCase() &&
    Number(record['Actual Loops'] ?? record.actual_loops ?? 1) !== 0
  ) {
    return true;
  }
  return Object.values(record).some((item) => jsonPlanHasNode(item, key, expected));
}

function jsonFindingRange(
  value: string,
  key: string,
  expected: string,
): EvidenceRange | undefined {
  try {
    if (!jsonPlanHasNode(JSON.parse(value), key, expected)) return undefined;
  } catch {
    return undefined;
  }
  const pattern = new RegExp(
    `"${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"\\s*:\\s*"${expected}"`,
    'i',
  );
  const match = value.match(pattern);
  return match?.index === undefined
    ? undefined
    : { start: match.index, end: match.index + match[0].length };
}

function explainScanRange(
  explainText: string,
  dialect: SqlDialect,
): EvidenceRange | undefined {
  if (dialect === 'postgresql') {
    return (
      jsonFindingRange(explainText, 'Node Type', 'Seq Scan') ??
      lineMatches(explainText, (line) =>
        isNegatedOrNeverExecuted(line)
          ? null
          : line.match(
              /^\s*(?:->\s*)?(?:parallel\s+)?seq\s+scan\s+on\s+\S+/i,
            ),
      )
    );
  }
  if (dialect === 'mysql') {
    return (
      jsonFindingRange(explainText, 'access_type', 'ALL') ??
      lineMatches(explainText, (line) =>
        isNegatedOrNeverExecuted(line)
          ? null
          : line.match(/^\s*(?:type|access_type)\s*:\s*ALL\s*$/i),
      )
    );
  }
  if (dialect === 'sqlite') {
    return lineMatches(explainText, (line) => {
      if (isNegatedOrNeverExecuted(line)) return null;
      const match = line.match(
        /^\s*(?:(?:\d+\|){3})?(?:(?:\|--|`--)\s*)?SCAN\s+(.+)$/i,
      );
      const target = match?.[1]?.trim() ?? '';
      if (
        !match ||
        /^(?:(?:\d+\s+)?CONSTANT\s+ROWS?\b|(?:TABLE\s+)?(?:SUBQUERY|CO-ROUTINE|VALUES)\b|\(subquery[^)]*\))/i.test(
          target,
        )
      ) {
        return null;
      }
      return match;
    });
  }
  if (dialect === 'sql-server') {
    return lineMatches(explainText, (line) => {
      if (isNegatedOrNeverExecuted(line)) return null;
      return (
        line.match(/PhysicalOp\s*=\s*["']Table Scan["']/i) ??
        line.match(/"PhysicalOp"\s*:\s*"Table Scan"/i) ??
        line.match(
          /^\s*(?:(?:\|--|`--)\s*)?Table Scan\s*\([^\n]*\bOBJECT\s*:/i,
        )
      );
    });
  }
  return undefined;
}

export function analyzeSql(input: AnalyzeSqlInput): SqlAnalysisResult {
  const sql = String(input.sql ?? '').trim();
  const lexed = lexSql(sql, input.dialect);
  const statements = splitStatements(sql, lexed);
  const explainText = String(input.explainText ?? '').trim();
  const suggestions: SqlSuggestion[] = [];
  const explainFindings: ExplainFinding[] = [];
  let score = 100;

  const addSuggestion = (
    code: string,
    severity: SqlSuggestion['severity'],
    message: string,
    focus: EvidenceRange,
    indexCandidates: string[] = [],
  ) => {
    suggestions.push({
      code,
      severity,
      message,
      evidence: excerpt(sql, focus),
      indexCandidates,
    });
    score -= severity === 'warning' ? 20 : severity === 'improvement' ? 12 : 5;
  };

  if (lexed.malformed) {
    addSuggestion(
      'possibly-malformed-sql',
      'warning',
      'The SQL appears to contain an unterminated token or unbalanced parentheses, so other findings may be incomplete; review the syntax before relying on this static analysis.',
      { start: 0, end: Math.min(sql.length, 1) },
    );
  }

  for (const statement of statements) {
    const star = selectStarToken(statement);
    if (star) {
      addSuggestion(
        'select-star',
        'improvement',
        'SELECT * may read columns the caller does not need; review an explicit column list.',
        { start: statement.rootToken.start, end: star.end },
      );
    }

    const bounded = hasTopLevelRowBound(statement, input.dialect);
    if (statement.rootKind === 'select' && !bounded) {
      addSuggestion(
        'unbounded-read',
        'improvement',
        'This SELECT may return an unbounded result set; consider a dialect-appropriate row limit when the caller needs only part of it.',
        { start: statement.rootToken.start, end: statement.rootToken.end },
      );
    }

    if (
      statement.rootKind === 'select' &&
      hasTopLevelOrderBy(statement) &&
      !bounded
    ) {
      const order = clauseRange(statement, 'ORDER');
      addSuggestion(
        'order-without-limit',
        'info',
        'ORDER BY without a top-level row bound may sort more rows than the caller needs; consider pagination for bounded reads.',
        order ?? { start: statement.rootToken.start, end: statement.rootToken.end },
      );
    }

    const where = clauseRange(statement, 'WHERE');
    if (
      (statement.rootKind === 'update' || statement.rootKind === 'delete') &&
      !where
    ) {
      addSuggestion(
        'write-without-where',
        'warning',
        'This statement may affect every row because no top-level WHERE clause was detected; review the target scope before running it elsewhere.',
        { start: statement.rootToken.start, end: statement.rootToken.end },
      );
    }

    if (where) {
      const topWhereTokens = tokensInRange(statement, where, true);
      for (let index = 0; index < topWhereTokens.length - 1; index += 1) {
        const token = topWhereTokens[index];
        const next = topWhereTokens[index + 1];
        if (
          tokenWord(token) === 'LIKE' &&
          next.kind === 'string' &&
          stringStartsWithPercent(next)
        ) {
          addSuggestion(
            'leading-wildcard-like',
            'warning',
            'A leading-wildcard LIKE filter may prevent a conventional B-tree index from narrowing the search; consider a database-specific text-search option.',
            { start: token.start, end: next.end },
          );
          break;
        }
      }

      const filteredFunction = topWhereTokens.find(
        (token, index) =>
          FILTER_FUNCTIONS.has(tokenWord(token)) &&
          topWhereTokens[index + 1]?.kind === 'symbol' &&
          topWhereTokens[index + 1]?.value === '(',
      );
      if (filteredFunction) {
        addSuggestion(
          'filtered-column-function',
          'warning',
          'A function applied in the filter may make a plain column index less useful; review normalized data or a matching expression index where supported.',
          { start: filteredFunction.start, end: filteredFunction.end + 1 },
        );
      }

      const orToken = topWhereTokens.find((token) => tokenWord(token) === 'OR');
      if (orToken) {
        addSuggestion(
          'or-filter',
          'info',
          'OR predicates can make index selection harder; consider whether separate indexed branches would be clearer for this workload.',
          { start: orToken.start, end: orToken.end },
        );
      }

    }

    const table = statementTable(statement);
    const indexColumns = [
      ...new Set([
        ...(where ? equalityColumns(statement, where) : []),
        ...orderColumns(statement),
      ]),
    ];
    if (table && indexColumns.length > 0) {
      addSuggestion(
        indexColumns.length >= 2
          ? 'composite-index-candidate'
          : 'index-review-candidate',
        'info',
        indexColumns.length >= 2
          ? 'This column order is a review candidate for a composite index, but schema statistics and existing indexes may make another order better.'
          : 'This filtered or ordered column is an index review candidate, but schema statistics and existing indexes may make another choice better.',
        where ??
          clauseRange(statement, 'ORDER') ?? {
            start: statement.rootToken.start,
            end: statement.rootToken.end,
          },
        [`${table} (${indexColumns.join(', ')})`],
      );
    }
  }

  const explainRange = explainText
    ? explainScanRange(explainText, input.dialect)
    : undefined;
  if (explainRange) {
    const explainCopy: Partial<Record<SqlDialect, [string, string]>> = {
      postgresql: [
        'postgresql-sequential-scan',
        'The pasted PostgreSQL plan contains an executed Seq Scan node, which may indicate a broad table read; review row estimates, selectivity, and available indexes in the database.',
      ],
      mysql: [
        'mysql-full-scan',
        'The pasted MySQL plan reports an ALL access type in a plan field, which may indicate a full table scan; review possible_keys, key, rows, and filtered in the original plan.',
      ],
      sqlite: [
        'sqlite-table-scan',
        'The pasted SQLite plan contains a table SCAN step, which may read many rows; review whether a selective SEARCH step or suitable index is possible.',
      ],
      'sql-server': [
        'sql-server-table-scan',
        'The pasted SQL Server plan contains a Table Scan plan node, which may indicate a broad read; review estimated rows, predicates, and index choices in the full plan.',
      ],
    };
    const copy = explainCopy[input.dialect];
    if (copy) {
      explainFindings.push({
        code: copy[0],
        severity: 'warning',
        message: copy[1],
        evidence: excerpt(explainText, explainRange),
      });
      score -= 15;
    }
  }

  return {
    dialect: input.dialect,
    formattedSql: formatSqlPreservingTokens(sql, lexed.protectedTokens),
    score: Math.max(0, Math.min(100, score)),
    suggestions,
    explainFindings,
    limitations: [
      'Static text review only; no database connection or query execution occurs.',
      'The analyzer does not rewrite SQL or apply changes automatically.',
      'Index candidates are hypotheses and are not verified against a schema.',
      'Heuristic clause parsing can miss complex CTEs, nested statement shapes, and vendor-specific syntax; review each statement in its database dialect.',
      'Suggestions do not guarantee faster queries.',
    ],
  };
}
