// @ts-nocheck
// AUTO-GENERATED tool stubs to prevent runtime crashes
// TODO: Replace stubs with real implementations.

import {
  base64UrlEncode as runtimeBase64UrlEncode,
  decodeJwt as runtimeDecodeJwt,
  generateSecret as runtimeGenerateSecret,
  generateTotp as runtimeGenerateTotp,
} from './runtime-integrity/token';
import {
  formatJson as runtimeFormatJson,
  parseResponse as runtimeParseResponse,
  sortObject as runtimeSortObject,
} from './runtime-integrity/object';
import {
  calculateBreakEven as runtimeCalculateBreakEven,
  calculateCapacity as runtimeCalculateCapacity,
  calculateStats as runtimeCalculateStats,
  getContrastRatio as runtimeGetContrastRatio,
  getWCAGLevel as runtimeGetWCAGLevel,
} from './runtime-integrity/calculators';
import {
  analyzeComplexity as runtimeAnalyzeComplexity,
  analyzeDeadCode as runtimeAnalyzeDeadCode,
  analyzePerformance as runtimeAnalyzePerformance,
} from './runtime-integrity/code-analysis';
import {
  generateGo as runtimeGenerateGo,
  generateJava as runtimeGenerateJava,
  generateJavaScript as runtimeGenerateJavaScript,
  generatePhp as runtimeGeneratePhp,
  generatePython as runtimeGeneratePython,
  generateRuby as runtimeGenerateRuby,
  parseCurlCommand as runtimeParseCurlCommand,
} from './runtime-integrity/curl';
import { commonResolutions as runtimeCommonResolutions } from './runtime-integrity/display';
import { ibanSpecs as runtimeIbanSpecs } from './runtime-integrity/iban';
import {
  convertTime as runtimeConvertTime,
  findAvailableSlots as runtimeFindAvailableSlots,
  formatHour as runtimeFormatHour,
  formatMinutesToTime as runtimeFormatMinutesToTime,
  mergeBusySlots as runtimeMergeBusySlots,
  parseConflicts as runtimeParseConflicts,
  parseTimeToMinutes as runtimeParseTimeToMinutes,
} from './runtime-integrity/scheduling';
import { formatSql as runtimeFormatSql, minifySql as runtimeMinifySql } from './runtime-integrity/sql';
import {
  ASCII_FONTS as runtimeAsciiFonts,
  flipMap as runtimeFlipMap,
  mirrorMap as runtimeMirrorMap,
  MORSE_CODE as runtimeMorseCode,
  NATO_ALPHABET as runtimeNatoAlphabet,
  REVERSE_MORSE as runtimeReverseMorse,
  smallCapsMap as runtimeSmallCapsMap,
  subscriptMap as runtimeSubscriptMap,
  superscriptMap as runtimeSuperscriptMap,
} from './runtime-integrity/text-reference';
import { marked } from 'marked';
import * as yaml from 'js-yaml';
import { pinyin } from 'pinyin-pro';
import { escapeHtmlAttribute, sanitizeMarkdownHtml } from './sanitize';

function safeText(value) {
  return String(value ?? '').trim();
}

function safeHtmlText(value) {
  return escapeHtmlAttribute(safeText(value));
}

function normalizeHttpUrl(value) {
  const trimmed = safeText(value);
  if (!trimmed) return '';

  try {
    const url = new URL(/^[a-z][a-z0-9+.-]*:/i.test(trimmed) ? trimmed : `https://${trimmed}`);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.toString() : '';
  } catch {
    return '';
  }
}

function normalizeSocialUrl(value, baseUrl) {
  const trimmed = safeText(value).replace(/^@/, '');
  if (!trimmed) return '';

  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) {
    return normalizeHttpUrl(trimmed);
  }

  return `${baseUrl}${encodeURIComponent(trimmed)}`;
}

function gcd(a, b) {
  let x = Math.abs(Math.trunc(Number(a) || 0));
  let y = Math.abs(Math.trunc(Number(b) || 0));
  while (y !== 0) {
    [x, y] = [y, x % y];
  }
  return x || 1;
}

function isValidIPv6(value) {
  const input = String(value || '').trim();
  if (!input.includes(':')) return false;
  if ((input.match(/::/g) || []).length > 1) return false;

  const parts = input.split('::');
  const left = parts[0] ? parts[0].split(':') : [];
  const right = parts[1] ? parts[1].split(':') : [];
  const groups = [...left, ...right];

  if (groups.some((group) => !/^[0-9a-fA-F]{1,4}$/.test(group))) {
    return false;
  }

  return parts.length === 2 ? groups.length < 8 : groups.length === 8;
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function mergeValues(first, second, strategy) {
  if (strategy === 'concat' && Array.isArray(first) && Array.isArray(second)) {
    return [...first, ...second];
  }

  if (!isPlainObject(first) || !isPlainObject(second)) {
    return strategy === 'concat' && Array.isArray(first) ? [...first, second] : second;
  }

  if (strategy === 'shallow') {
    return { ...first, ...second };
  }

  const result = { ...first };
  for (const [key, value] of Object.entries(second)) {
    if (strategy === 'concat' && Array.isArray(result[key]) && Array.isArray(value)) {
      result[key] = [...result[key], ...value];
    } else if ((strategy === 'deep' || strategy === 'concat') && isPlainObject(result[key]) && isPlainObject(value)) {
      result[key] = mergeValues(result[key], value, strategy);
    } else {
      result[key] = value;
    }
  }
  return result;
}

type EnvOutputEntry = { key: string; value?: unknown; isValid?: boolean };

function entriesToObject(entries: EnvOutputEntry[]) {
  return Object.fromEntries(
    (Array.isArray(entries) ? entries : [])
      .filter((entry) => entry?.key && entry.isValid !== false)
      .map((entry) => [entry.key, entry.value ?? ''])
  );
}

function quoteEnvValue(value) {
  const text = String(value ?? '');
  if (!text || /[\s#"'\\]/.test(text)) {
    return `"${text.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
  }
  return text;
}

function quoteYamlValue(value) {
  const text = String(value ?? '');
  if (!text) return '""';
  if (/[:#\n\r\t]|^\s|\s$/.test(text)) {
    return JSON.stringify(text);
  }
  return text;
}

function parseHexColor(value) {
  const match = String(value || '').trim().match(/^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);
  if (!match) return null;
  const hex = match[1].length === 3
    ? match[1].split('').map((char) => char + char).join('')
    : match[1];
  return {
    r: Number.parseInt(hex.slice(0, 2), 16),
    g: Number.parseInt(hex.slice(2, 4), 16),
    b: Number.parseInt(hex.slice(4, 6), 16),
  };
}

function parseTailwindSize(value) {
  if (value === 'auto' || value === 'full' || value === 'screen' || value === 'min' || value === 'max' || value === 'fit') {
    return value;
  }

  if (value === '0' || value === '0px') return '0';

  const rem = value.match(/^(-?\d*\.?\d+)rem$/);
  const px = value.match(/^(-?\d*\.?\d+)px$/);
  const number = rem ? Number(rem[1]) * 4 : px ? Number(px[1]) / 4 : Number.NaN;

  if (!Number.isFinite(number)) return '';
  return Number.isInteger(number) ? String(number) : `[${value}]`;
}

const NAMED_COLORS = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#ffffff' },
  { name: 'Red', hex: '#ff0000' },
  { name: 'Lime', hex: '#00ff00' },
  { name: 'Blue', hex: '#0000ff' },
  { name: 'Yellow', hex: '#ffff00' },
  { name: 'Cyan', hex: '#00ffff' },
  { name: 'Magenta', hex: '#ff00ff' },
  { name: 'Silver', hex: '#c0c0c0' },
  { name: 'Gray', hex: '#808080' },
  { name: 'Maroon', hex: '#800000' },
  { name: 'Olive', hex: '#808000' },
  { name: 'Green', hex: '#008000' },
  { name: 'Purple', hex: '#800080' },
  { name: 'Teal', hex: '#008080' },
  { name: 'Navy', hex: '#000080' },
  { name: 'Orange', hex: '#ffa500' },
  { name: 'Pink', hex: '#ffc0cb' },
  { name: 'Brown', hex: '#a52a2a' },
  { name: 'Steel Blue', hex: '#4682b4' },
  { name: 'Slate Gray', hex: '#708090' },
  { name: 'Rebecca Purple', hex: '#663399' },
];

function normalizeHexColor(value) {
  const trimmed = safeText(value);
  return /^#[0-9a-f]{6}$/i.test(trimmed) ? trimmed : '#2563eb';
}

function shellQuote(value) {
  return `'${String(value ?? '').replace(/'/g, "'\"'\"'")}'`;
}

function safeShellFileName(value) {
  return safeText(value)
    .replace(/[^A-Za-z0-9_.-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'database';
}

function getBackupCronSchedule(schedule) {
  const normalized = safeText(schedule).toLowerCase();
  if (parseCron(safeText(schedule))) return safeText(schedule);

  const schedules = {
    hourly: '0 * * * *',
    daily: '0 2 * * *',
    weekly: '0 2 * * 0',
    monthly: '0 2 1 * *',
  };

  return schedules[normalized] || schedules.daily;
}

const CRON_MONTH_NAMES = {
  jan: 1,
  feb: 2,
  mar: 3,
  apr: 4,
  may: 5,
  jun: 6,
  jul: 7,
  aug: 8,
  sep: 9,
  oct: 10,
  nov: 11,
  dec: 12,
};

const CRON_WEEKDAY_NAMES = {
  sun: 0,
  mon: 1,
  tue: 2,
  wed: 3,
  thu: 4,
  fri: 5,
  sat: 6,
};

function rangeInclusive(start, end, step = 1) {
  const values = [];
  for (let value = start; value <= end; value += step) {
    values.push(value);
  }
  return values;
}

function parseCronValue(value, min, max, normalizeSunday) {
  const token = String(value || '').trim().toLowerCase();
  const namedValue =
    max === 12 ? CRON_MONTH_NAMES[token] :
      normalizeSunday ? CRON_WEEKDAY_NAMES[token] :
        undefined;
  const parsed = namedValue ?? Number.parseInt(token, 10);

  if (!Number.isInteger(parsed) || parsed < min || parsed > max) return null;
  return normalizeSunday && parsed === 7 ? 0 : parsed;
}

function parseCronField(field, min, max, normalizeSunday = false) {
  const raw = safeText(field);
  if (!raw) return null;

  const effectiveMax = normalizeSunday && max === 7 ? 6 : max;
  const allValues = rangeInclusive(min, effectiveMax);
  if (raw === '*' || raw === '?') {
    return { values: allValues, all: true, raw };
  }

  const values = [];
  for (const segment of raw.split(',')) {
    const [base, stepText] = segment.split('/');
    if (!base || segment.split('/').length > 2) return null;

    const step = stepText === undefined ? 1 : Number.parseInt(stepText, 10);
    if (!Number.isInteger(step) || step < 1) return null;

    if (base === '*') {
      values.push(...rangeInclusive(min, effectiveMax, step));
      continue;
    }

    if (base.includes('-')) {
      const [startText, endText] = base.split('-');
      if (!startText || !endText || base.split('-').length > 2) return null;

      const start = parseCronValue(startText, min, max, normalizeSunday);
      const end = parseCronValue(endText, min, max, normalizeSunday);
      if (start === null || end === null || start > end) return null;

      values.push(...rangeInclusive(start, end, step));
      continue;
    }

    if (stepText !== undefined) return null;

    const value = parseCronValue(base, min, max, normalizeSunday);
    if (value === null) return null;
    values.push(value);
  }

  const uniqueValues = [...new Set(values)]
    .filter((value) => value >= min && value <= effectiveMax)
    .sort((a, b) => a - b);

  if (uniqueValues.length === 0) return null;

  return {
    values: uniqueValues,
    all: uniqueValues.length === allValues.length,
    raw,
  };
}

function cronFieldMatches(field, value) {
  return Boolean(field?.all || field?.values?.includes(value));
}

function matchesCronDate(parsed, date) {
  if (!parsed || Number.isNaN(date?.getTime?.())) return false;

  const minuteMatches = cronFieldMatches(parsed.minute, date.getMinutes());
  const hourMatches = cronFieldMatches(parsed.hour, date.getHours());
  const monthMatches = cronFieldMatches(parsed.month, date.getMonth() + 1);
  const dayOfMonthMatches = cronFieldMatches(parsed.dayOfMonth, date.getDate());
  const dayOfWeekMatches = cronFieldMatches(parsed.dayOfWeek, date.getDay());

  const dayMatches =
    parsed.dayOfMonth.all && parsed.dayOfWeek.all
      ? true
      : parsed.dayOfMonth.all
        ? dayOfWeekMatches
        : parsed.dayOfWeek.all
          ? dayOfMonthMatches
          : dayOfMonthMatches || dayOfWeekMatches;

  return minuteMatches && hourMatches && monthMatches && dayMatches;
}

function describeCronField(field, label) {
  if (!field) return `${label}: invalid`;
  if (field.all) return `every ${label}`;

  const values = field.values || [];
  if (values.length === 1) return `${label} ${values[0]}`;

  const contiguous = values.every((value, index) => index === 0 || value === values[index - 1] + 1);
  if (contiguous && values.length > 2) {
    return `${label}s ${values[0]}-${values[values.length - 1]}`;
  }

  return `${label}s ${values.join(', ')}`;
}

function stripSqlSemicolon(value) {
  return String(value || '').trim().replace(/;\s*$/, '').trim();
}

function splitSqlTopLevel(input, delimiter = ',') {
  const parts = [];
  let current = '';
  let quote = '';
  let depth = 0;

  for (let index = 0; index < String(input || '').length; index += 1) {
    const char = input[index];
    const next = input[index + 1];

    if (quote) {
      current += char;
      if (char === quote) {
        if (char === "'" && next === "'") {
          current += next;
          index += 1;
        } else {
          quote = '';
        }
      }
      continue;
    }

    if (char === "'" || char === '"' || char === '`') {
      quote = char;
      current += char;
      continue;
    }

    if (char === '(') depth += 1;
    if (char === ')' && depth > 0) depth -= 1;

    if (char === delimiter && depth === 0) {
      parts.push(current.trim());
      current = '';
      continue;
    }

    current += char;
  }

  if (current.trim()) parts.push(current.trim());
  return parts;
}

function splitSqlStatements(input) {
  return splitSqlTopLevel(input, ';').map(stripSqlSemicolon).filter(Boolean);
}

function splitSqlConditions(where = '') {
  const conditions = [];
  let current = '';
  let quote = '';
  let depth = 0;
  const text = String(where || '');

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (quote) {
      current += char;
      if (char === quote) {
        if (char === "'" && next === "'") {
          current += next;
          index += 1;
        } else {
          quote = '';
        }
      }
      continue;
    }

    if (char === "'" || char === '"' || char === '`') {
      quote = char;
      current += char;
      continue;
    }

    if (char === '(') depth += 1;
    if (char === ')' && depth > 0) depth -= 1;

    const maybeAnd = text.slice(index, index + 3);
    const before = text[index - 1] || ' ';
    const after = text[index + 3] || ' ';
    if (depth === 0 && maybeAnd.toLowerCase() === 'and' && /\W/.test(before) && /\W/.test(after)) {
      if (current.trim()) conditions.push(current.trim());
      current = '';
      index += 2;
      continue;
    }

    current += char;
  }

  if (current.trim()) conditions.push(current.trim());
  return conditions;
}

function unquoteSqlIdentifier(identifier = '') {
  const cleaned = String(identifier || '')
    .trim()
    .replace(/\s+as\s+.+$/i, '')
    .replace(/\s+.+$/i, '')
    .replace(/^[`"]|[`"]$/g, '');
  return cleaned.includes('.') ? cleaned.split('.').pop() : cleaned;
}

function parseSqlLiteral(value = '') {
  const raw = String(value || '').trim();
  if (/^null$/i.test(raw)) return null;
  if (/^true$/i.test(raw)) return true;
  if (/^false$/i.test(raw)) return false;
  if (/^-?\d+(?:\.\d+)?$/.test(raw)) return Number(raw);
  if ((raw.startsWith("'") && raw.endsWith("'")) || (raw.startsWith('"') && raw.endsWith('"'))) {
    return raw.slice(1, -1).replace(/''/g, "'");
  }
  return raw;
}

function parseSqlValueRows(valuesText = '') {
  const rows = [];
  let current = '';
  let quote = '';
  let depth = 0;
  const text = stripSqlSemicolon(valuesText);

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (quote) {
      current += char;
      if (char === quote) {
        if (char === "'" && next === "'") {
          current += next;
          index += 1;
        } else {
          quote = '';
        }
      }
      continue;
    }

    if (char === "'" || char === '"') {
      quote = char;
      current += char;
      continue;
    }

    if (char === '(') {
      if (depth > 0) current += char;
      depth += 1;
      continue;
    }

    if (char === ')') {
      depth -= 1;
      if (depth === 0) {
        rows.push(splitSqlTopLevel(current).map(parseSqlLiteral));
        current = '';
        continue;
      }
      current += char;
      continue;
    }

    if (depth > 0) current += char;
  }

  return rows;
}

function regexEscape(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function likeToRegex(value) {
  const literal = String(parseSqlLiteral(value) ?? '');
  return `^${literal.split('').map((char) => {
    if (char === '%') return '.*';
    if (char === '_') return '.';
    return regexEscape(char);
  }).join('')}$`;
}

function addMongoCondition(query, field, condition) {
  if (query[field] === undefined) {
    query[field] = condition;
    return query;
  }

  if (isPlainObject(query[field]) && isPlainObject(condition)) {
    query[field] = { ...query[field], ...condition };
    return query;
  }

  query.$and = [...(query.$and || []), { [field]: condition }];
  return query;
}

function parseSqlWhere(where = '') {
  const query = {};
  const conditions = splitSqlConditions(where);

  for (const conditionText of conditions) {
    const condition = conditionText.trim().replace(/^\((.*)\)$/s, '$1').trim();

    let match = condition.match(/^(.+?)\s+is\s+(not\s+)?null$/i);
    if (match) {
      const field = unquoteSqlIdentifier(match[1]);
      addMongoCondition(query, field, match[2] ? { $ne: null } : null);
      continue;
    }

    match = condition.match(/^(.+?)\s+(not\s+in|in)\s*\(([\s\S]+)\)$/i);
    if (match) {
      const field = unquoteSqlIdentifier(match[1]);
      const values = splitSqlTopLevel(match[3]).map(parseSqlLiteral);
      addMongoCondition(query, field, { [match[2].toLowerCase().startsWith('not') ? '$nin' : '$in']: values });
      continue;
    }

    match = condition.match(/^(.+?)\s+(not\s+like|like)\s+(.+)$/i);
    if (match) {
      const field = unquoteSqlIdentifier(match[1]);
      const regex = { $regex: likeToRegex(match[3]) };
      addMongoCondition(query, field, match[2].toLowerCase().startsWith('not') ? { $not: regex } : regex);
      continue;
    }

    match = condition.match(/^(.+?)\s*(=|!=|<>|>=|<=|>|<)\s*(.+)$/i);
    if (match) {
      const field = unquoteSqlIdentifier(match[1]);
      const value = parseSqlLiteral(match[3]);
      const operator = match[2];
      const operatorMap = {
        '!=': '$ne',
        '<>': '$ne',
        '>': '$gt',
        '<': '$lt',
        '>=': '$gte',
        '<=': '$lte',
      };
      addMongoCondition(query, field, operator === '=' ? value : { [operatorMap[operator]]: value });
    }
  }

  return query;
}

function mongoStringify(value) {
  return JSON.stringify(value, null, 2);
}

function getSqlClause(rest, keyword, stopKeywords = []) {
  const text = String(rest || '');
  const keywordPattern = new RegExp(`\\b${keyword.replace(/\s+/g, '\\s+')}\\b`, 'i');
  const startMatch = keywordPattern.exec(text);
  if (!startMatch) return '';

  const start = startMatch.index + startMatch[0].length;
  let end = text.length;
  for (const stopKeyword of stopKeywords) {
    const stopPattern = new RegExp(`\\b${stopKeyword.replace(/\s+/g, '\\s+')}\\b`, 'i');
    const relative = stopPattern.exec(text.slice(start));
    if (relative) end = Math.min(end, start + relative.index);
  }

  return text.slice(start, end).trim();
}

function parseSqlOrder(orderText = '') {
  const order = {};
  for (const part of splitSqlTopLevel(orderText)) {
    const match = part.match(/^(.+?)(?:\s+(asc|desc))?$/i);
    if (match) order[unquoteSqlIdentifier(match[1])] = match[2]?.toLowerCase() === 'desc' ? -1 : 1;
  }
  return order;
}

function parseSqlAssignments(setText = '') {
  const updates = {};
  for (const assignment of splitSqlTopLevel(setText)) {
    const match = assignment.match(/^(.+?)\s*=\s*(.+)$/s);
    if (match) updates[unquoteSqlIdentifier(match[1])] = parseSqlLiteral(match[2]);
  }
  return updates;
}

function parseSqlProjection(columns = '') {
  const raw = String(columns || '').trim();
  if (raw === '*') return null;
  if (/^count\s*\(\s*\*\s*\)$/i.test(raw)) return { count: true };

  const projection = {};
  for (const column of splitSqlTopLevel(raw)) {
    const field = unquoteSqlIdentifier(column);
    if (field && field !== '*') projection[field] = 1;
  }
  if (Object.keys(projection).length > 0) projection._id = 0;
  return projection;
}

function buildMongoConversion(sql = '') {
  const statement = stripSqlSemicolon(sql);

  let match = statement.match(/^select\s+([\s\S]+?)\s+from\s+([`"\w.]+)([\s\S]*)$/i);
  if (match) {
    const collection = unquoteSqlIdentifier(match[2]);
    const rest = match[3] || '';
    const where = parseSqlWhere(getSqlClause(rest, 'where', ['order by', 'limit', 'offset']));
    const projection = parseSqlProjection(match[1]);
    const order = parseSqlOrder(getSqlClause(rest, 'order by', ['limit', 'offset']));
    const limit = Number.parseInt(getSqlClause(rest, 'limit', ['offset']), 10);
    const offset = Number.parseInt(getSqlClause(rest, 'offset'), 10);

    if (projection?.count) {
      return {
        collection,
        operation: 'countDocuments',
        query: `db.${collection}.countDocuments(${mongoStringify(where)})`,
      };
    }

    let query = `db.${collection}.find(${mongoStringify(where)}`;
    if (projection) query += `, ${mongoStringify(projection)}`;
    query += ')';
    if (Object.keys(order).length > 0) query += `.sort(${mongoStringify(order)})`;
    if (Number.isFinite(offset)) query += `.skip(${offset})`;
    if (Number.isFinite(limit)) query += `.limit(${limit})`;

    return { collection, operation: 'find', query };
  }

  match = statement.match(/^insert\s+into\s+([`"\w.]+)\s*\(([\s\S]+?)\)\s*values\s*([\s\S]+)$/i);
  if (match) {
    const collection = unquoteSqlIdentifier(match[1]);
    const columns = splitSqlTopLevel(match[2]).map(unquoteSqlIdentifier);
    const documents = parseSqlValueRows(match[3]).map((row) => Object.fromEntries(columns.map((column, index) => [column, row[index] ?? null])));
    if (documents.length === 0) return null;

    return {
      collection,
      operation: documents.length === 1 ? 'insertOne' : 'insertMany',
      query: documents.length === 1
        ? `db.${collection}.insertOne(${mongoStringify(documents[0])})`
        : `db.${collection}.insertMany(${mongoStringify(documents)})`,
    };
  }

  match = statement.match(/^update\s+([`"\w.]+)\s+set\s+([\s\S]+?)(?:\s+where\s+([\s\S]+))?$/i);
  if (match) {
    const collection = unquoteSqlIdentifier(match[1]);
    const where = parseSqlWhere(match[3] || '');
    const updates = parseSqlAssignments(match[2]);
    return {
      collection,
      operation: 'updateMany',
      query: `db.${collection}.updateMany(${mongoStringify(where)}, ${mongoStringify({ $set: updates })})`,
    };
  }

  match = statement.match(/^delete\s+from\s+([`"\w.]+)(?:\s+where\s+([\s\S]+))?$/i);
  if (match) {
    const collection = unquoteSqlIdentifier(match[1]);
    const where = parseSqlWhere(match[2] || '');
    return {
      collection,
      operation: 'deleteMany',
      query: `db.${collection}.deleteMany(${mongoStringify(where)})`,
    };
  }

  return null;
}

function assertSafeObjectKey(key) {
  if (key === '__proto__' || key === 'prototype' || key === 'constructor') {
    throw new Error(`Unsafe object key: ${key}`);
  }
}

function stripTomlComment(line = '') {
  let quote = '';
  let result = '';
  const text = String(line || '');

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (quote) {
      result += char;
      if (char === quote && text[index - 1] !== '\\') quote = '';
      continue;
    }
    if (char === "'" || char === '"') {
      quote = char;
      result += char;
      continue;
    }
    if (char === '#') break;
    result += char;
  }

  return result.trim();
}

function parseTomlValue(value = '') {
  const raw = String(value || '').trim();
  if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) {
    return raw.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
  }
  if (/^(true|false)$/i.test(raw)) return raw.toLowerCase() === 'true';
  if (/^-?\d+(?:\.\d+)?$/.test(raw)) return Number(raw);
  if (raw.startsWith('[') && raw.endsWith(']')) {
    const inner = raw.slice(1, -1).trim();
    return inner ? splitSqlTopLevel(inner).map(parseTomlValue) : [];
  }
  return raw;
}

function getTomlSection(root, path) {
  let target = root;
  for (const rawPart of path) {
    const part = rawPart.trim();
    assertSafeObjectKey(part);
    if (!isPlainObject(target[part])) target[part] = {};
    target = target[part];
  }
  return target;
}

function tomlQuoteString(value) {
  return `"${String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

function tomlFormatValue(value) {
  if (typeof value === 'string') return tomlQuoteString(value);
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (Array.isArray(value)) return `[${value.map(tomlFormatValue).join(', ')}]`;
  if (value === null || value === undefined) return tomlQuoteString('');
  return tomlQuoteString(JSON.stringify(value));
}

function appendTomlObject(lines, object, path = []) {
  const scalarEntries = [];
  const nestedEntries = [];

  for (const [key, value] of Object.entries(object || {})) {
    assertSafeObjectKey(key);
    if (isPlainObject(value)) nestedEntries.push([key, value]);
    else scalarEntries.push([key, value]);
  }

  if (path.length > 0) {
    if (lines.length > 0 && lines[lines.length - 1] !== '') lines.push('');
    lines.push(`[${path.join('.')}]`);
  }

  for (const [key, value] of scalarEntries) {
    lines.push(`${key} = ${tomlFormatValue(value)}`);
  }

  for (const [key, value] of nestedEntries) {
    appendTomlObject(lines, value, [...path, key]);
  }
}

function parseVersionParts(version = '') {
  const cleaned = String(version || '')
    .trim()
    .replace(/^[\s~^<>=v]+/, '')
    .split(/[+\-\s]/)[0];
  const match = cleaned.match(/^(\d+)(?:\.(\d+))?(?:\.(\d+))?/);
  if (!match) return null;
  return [Number(match[1]), Number(match[2] || 0), Number(match[3] || 0)];
}

function compareVersions(left = '', right = '') {
  const a = parseVersionParts(left);
  const b = parseVersionParts(right);
  if (!a || !b) return null;
  for (let index = 0; index < 3; index += 1) {
    if (a[index] < b[index]) return -1;
    if (a[index] > b[index]) return 1;
  }
  return 0;
}

const LIMITED_VULNERABILITY_DB = [
  {
    package: 'lodash',
    below: '4.17.21',
    severity: 'high',
    title: 'Prototype pollution in lodash',
    description: 'Older lodash releases contain prototype pollution issues that can corrupt object prototypes when attacker-controlled paths are merged.',
    fixedIn: '4.17.21',
    cve: 'CVE-2021-23337',
  },
  {
    package: 'minimist',
    below: '1.2.6',
    severity: 'critical',
    title: 'Prototype pollution in minimist',
    description: 'Vulnerable minimist versions can allow crafted CLI arguments to pollute object prototypes.',
    fixedIn: '1.2.6',
    cve: 'CVE-2021-44906',
  },
  {
    package: 'jquery',
    below: '3.5.0',
    severity: 'medium',
    title: 'Cross-site scripting in jQuery HTML parsing',
    description: 'Older jQuery versions can execute unexpected code when untrusted HTML is passed to DOM manipulation APIs.',
    fixedIn: '3.5.0',
    cve: 'CVE-2020-11023',
  },
  {
    package: 'axios',
    below: '0.21.2',
    severity: 'high',
    title: 'Server-side request forgery risk in axios',
    description: 'Older axios releases include URL handling flaws that can increase SSRF risk in server-side request paths.',
    fixedIn: '0.21.2',
    cve: 'CVE-2021-3749',
  },
  {
    package: 'node-fetch',
    below: '2.6.7',
    severity: 'high',
    title: 'node-fetch forwarding sensitive headers',
    description: 'Older node-fetch 2.x releases can forward secure headers to untrusted redirect targets.',
    fixedIn: '2.6.7',
    cve: 'CVE-2022-0235',
  },
  {
    package: 'serialize-javascript',
    below: '3.1.0',
    severity: 'high',
    title: 'Cross-site scripting in serialized output',
    description: 'Older serialize-javascript versions can emit unsafe serialized strings when values are rendered into HTML.',
    fixedIn: '3.1.0',
    cve: 'CVE-2019-16769',
  },
];

function wordsFromIdentifier(value = '') {
  const words = String(value || '')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[^A-Za-z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  return words.length > 0 ? words : ['value'];
}

function toPascalCase(value = '') {
  return wordsFromIdentifier(value)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

function toCamelCase(value = '') {
  const pascal = toPascalCase(value);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function toSnakeCase(value = '') {
  return wordsFromIdentifier(value).map((word) => word.toLowerCase()).join('_');
}

function safeCodeIdentifier(value = '', fallback = 'value') {
  const identifier = toCamelCase(value || fallback).replace(/^[^A-Za-z_]+/, '');
  return identifier || fallback;
}

function safeClassName(value = '', fallback = 'Generated') {
  const className = toPascalCase(value || fallback).replace(/^[^A-Za-z_]+/, '');
  return className || fallback;
}

function safeTsIdentifier(value = '', fallback = 'value') {
  const reserved = new Set([
    'arguments',
    'await',
    'break',
    'case',
    'catch',
    'class',
    'const',
    'continue',
    'debugger',
    'default',
    'delete',
    'do',
    'else',
    'enum',
    'export',
    'extends',
    'false',
    'finally',
    'for',
    'function',
    'if',
    'import',
    'in',
    'instanceof',
    'new',
    'null',
    'return',
    'super',
    'switch',
    'this',
    'throw',
    'true',
    'try',
    'typeof',
    'var',
    'void',
    'while',
    'with',
    'yield',
  ]);
  const identifier = safeCodeIdentifier(value, fallback);
  return reserved.has(identifier) ? `${identifier}Value` : identifier;
}

function quoteTsPropertyName(name) {
  return /^[A-Za-z_$][\w$]*$/.test(String(name || '')) ? name : JSON.stringify(String(name || ''));
}

function firstContentSchema(content = {}) {
  if (!content || typeof content !== 'object') return null;
  const entries = Object.entries(content);
  const preferred =
    entries.find(([type]) => type.toLowerCase().includes('json')) ||
    entries.find(([type]) => type.toLowerCase().includes('*/*')) ||
    entries[0];
  return preferred?.[1]?.schema || null;
}

function schemaNameFromRef(ref = '') {
  const parts = String(ref || '').split('/');
  return parts.length > 0 ? decodeURIComponent(parts[parts.length - 1]) : '';
}

function schemaRefName(schema = {}) {
  return schema?.$ref ? safeClassName(schemaNameFromRef(schema.$ref), 'Generated') : '';
}

function resolveOpenApiSchema(spec = {}, schema = {}) {
  if (!schema || typeof schema !== 'object') return schema || {};
  if (!schema.$ref) return schema;
  const name = schemaNameFromRef(schema.$ref);
  return spec?.components?.schemas?.[name] || spec?.definitions?.[name] || schema;
}

function openApiSchemas(spec = {}) {
  return spec?.components?.schemas || spec?.definitions || {};
}

function isOpenApiLike(value) {
  return Boolean(value && typeof value === 'object' && value.paths && typeof value.paths === 'object');
}

function openApiBaseUrl(spec = {}) {
  if (Array.isArray(spec.servers) && spec.servers[0]?.url) {
    return String(spec.servers[0].url);
  }

  if (spec.swagger && spec.host) {
    const scheme = Array.isArray(spec.schemes) && spec.schemes[0] ? spec.schemes[0] : 'https';
    return `${scheme}://${spec.host}${spec.basePath || ''}`;
  }

  return '';
}

function openApiParameterSchema(parameter = {}) {
  return parameter.schema || {
    type: parameter.type,
    format: parameter.format,
    items: parameter.items,
    enum: parameter.enum,
  };
}

function openApiOperationName(method, path, operation = {}, usedNames = new Set()) {
  const rawName = operation.operationId || `${method}${toPascalCase(String(path).replace(/[{}]/g, ' '))}`;
  let name = safeTsIdentifier(rawName, `${method}Operation`);
  let index = 2;
  while (usedNames.has(name)) {
    name = `${safeTsIdentifier(rawName, `${method}Operation`)}${index}`;
    index += 1;
  }
  usedNames.add(name);
  return name;
}

function openApiOperations(spec = {}) {
  const methods = new Set(['get', 'post', 'put', 'patch', 'delete', 'head', 'options']);
  const usedNames = new Set();
  const operations = [];

  for (const [path, pathItem] of Object.entries(spec.paths || {})) {
    if (!pathItem || typeof pathItem !== 'object') continue;
    for (const [method, operation] of Object.entries(pathItem)) {
      if (!methods.has(method.toLowerCase()) || !operation || typeof operation !== 'object') {
        continue;
      }

      const parameters = [
        ...(Array.isArray(pathItem.parameters) ? pathItem.parameters : []),
        ...(Array.isArray(operation.parameters) ? operation.parameters : []),
      ];
      operations.push({
        method: method.toUpperCase(),
        path,
        operation,
        parameters,
        name: openApiOperationName(method.toLowerCase(), path, operation, usedNames),
      });
    }
  }

  return operations;
}

function openApiRequestBody(operation = {}, parameters = []) {
  if (operation.requestBody) {
    const schema = firstContentSchema(operation.requestBody.content);
    return {
      schema,
      required: operation.requestBody.required === true,
    };
  }

  const bodyParameter = parameters.find((parameter) => parameter.in === 'body');
  if (bodyParameter?.schema) {
    return { schema: bodyParameter.schema, required: bodyParameter.required === true };
  }

  const formParameters = parameters.filter((parameter) => parameter.in === 'formData');
  if (formParameters.length > 0) {
    return {
      required: formParameters.some((parameter) => parameter.required),
      schema: {
        type: 'object',
        required: formParameters.filter((parameter) => parameter.required).map((parameter) => parameter.name),
        properties: Object.fromEntries(
          formParameters.map((parameter) => [parameter.name, openApiParameterSchema(parameter)])
        ),
      },
    };
  }

  return null;
}

function openApiResponseSchema(operation = {}) {
  const responses = operation.responses || {};
  const entries = Object.entries(responses);
  const preferred =
    entries.find(([status]) => /^2\d\d$/.test(status)) ||
    entries.find(([status]) => status === 'default') ||
    entries[0];
  const response = preferred?.[1] || {};
  return response.schema || firstContentSchema(response.content);
}

function tsTypeForSchema(schema = {}, spec = {}, fallback = 'unknown') {
  if (!schema || typeof schema !== 'object') return fallback;
  if (schema.$ref) return schemaRefName(schema) || fallback;

  if (Array.isArray(schema.oneOf) || Array.isArray(schema.anyOf)) {
    const variants = (schema.oneOf || schema.anyOf)
      .map((item) => tsTypeForSchema(item, spec, fallback))
      .filter(Boolean);
    return variants.length > 0 ? variants.join(' | ') : fallback;
  }

  if (Array.isArray(schema.allOf)) {
    const variants = schema.allOf
      .map((item) => tsTypeForSchema(item, spec, fallback))
      .filter(Boolean);
    return variants.length > 0 ? variants.join(' & ') : fallback;
  }

  const nullable = schema.nullable === true || (Array.isArray(schema.type) && schema.type.includes('null'));
  const rawType = Array.isArray(schema.type) ? schema.type.find((item) => item !== 'null') : schema.type;
  let type;

  if (Array.isArray(schema.enum) && schema.enum.length > 0) {
    type = schema.enum.map((item) => JSON.stringify(item)).join(' | ');
  } else if (rawType === 'array') {
    const itemType = tsTypeForSchema(schema.items || {}, spec, 'unknown');
    type = /[|&]/.test(itemType) ? `Array<${itemType}>` : `${itemType}[]`;
  } else if (rawType === 'integer' || rawType === 'number') {
    type = 'number';
  } else if (rawType === 'boolean') {
    type = 'boolean';
  } else if (rawType === 'string') {
    type = 'string';
  } else if (rawType === 'object' || schema.properties || schema.additionalProperties) {
    if (schema.properties) {
      const required = new Set(Array.isArray(schema.required) ? schema.required : []);
      const fields = Object.entries(schema.properties).map(([name, propertySchema]) => {
        const optional = required.has(name) ? '' : '?';
        return `${quoteTsPropertyName(name)}${optional}: ${tsTypeForSchema(propertySchema, spec, 'unknown')};`;
      });
      type = fields.length > 0 ? `{ ${fields.join(' ')} }` : 'Record<string, unknown>';
    } else if (schema.additionalProperties && typeof schema.additionalProperties === 'object') {
      type = `Record<string, ${tsTypeForSchema(schema.additionalProperties, spec, 'unknown')}>`;
    } else {
      type = 'Record<string, unknown>';
    }
  } else {
    type = fallback;
  }

  return nullable ? `${type} | null` : type;
}

function renderTypeScriptSchemas(spec = {}) {
  const schemas = openApiSchemas(spec);
  return Object.entries(schemas).map(([name, rawSchema]) => {
    const schema = resolveOpenApiSchema(spec, rawSchema);
    const typeName = safeClassName(name, 'Generated');

    if (schema?.type === 'object' || schema?.properties) {
      const required = new Set(Array.isArray(schema.required) ? schema.required : []);
      const fields = Object.entries(schema.properties || {}).map(([propertyName, propertySchema]) => {
        const optional = required.has(propertyName) ? '' : '?';
        return `  ${quoteTsPropertyName(propertyName)}${optional}: ${tsTypeForSchema(propertySchema, spec, 'unknown')};`;
      });
      return [`export interface ${typeName} {`, ...(fields.length ? fields : ['  [key: string]: unknown;']), '}'].join('\n');
    }

    return `export type ${typeName} = ${tsTypeForSchema(schema, spec, 'unknown')};`;
  });
}

function renderTypeScriptQueryType(queryParameters, spec) {
  if (queryParameters.length === 0) return '';
  const fields = queryParameters.map((parameter) => {
    const optional = parameter.required ? '' : '?';
    return `${quoteTsPropertyName(parameter.name)}${optional}: ${tsTypeForSchema(openApiParameterSchema(parameter), spec, 'string')}`;
  });
  return `{ ${fields.join('; ')} }`;
}

function renderTypeScriptOperation(spec, operationInfo) {
  const pathParameters = operationInfo.parameters.filter((parameter) => parameter.in === 'path');
  const queryParameters = operationInfo.parameters.filter((parameter) => parameter.in === 'query');
  const body = openApiRequestBody(operationInfo.operation, operationInfo.parameters);
  const responseType = tsTypeForSchema(openApiResponseSchema(operationInfo.operation), spec, 'unknown');
  const args = [];

  for (const parameter of pathParameters) {
    args.push(`${safeTsIdentifier(parameter.name, 'pathParam')}: ${tsTypeForSchema(openApiParameterSchema(parameter), spec, 'string')}`);
  }

  if (body?.schema) {
    const bodyType = tsTypeForSchema(body.schema, spec, 'unknown');
    args.push(body.required ? `body: ${bodyType}` : `body: ${bodyType} | undefined = undefined`);
  }

  if (queryParameters.length > 0) {
    args.push(`query: ${renderTypeScriptQueryType(queryParameters, spec)} = {}`);
  }

  args.push('options: RequestOptions = {}');

  let pathExpression = JSON.stringify(operationInfo.path);
  for (const parameter of pathParameters) {
    const identifier = safeTsIdentifier(parameter.name, 'pathParam');
    pathExpression = pathExpression.replace(
      `{${parameter.name}}`,
      `\${encodeURIComponent(String(${identifier}))}`
    );
  }

  const lines = [
    `export async function ${operationInfo.name}(${args.join(', ')}): Promise<${responseType}> {`,
    `  const path = \`${pathExpression.slice(1, -1)}\`;`,
    `  const init: RequestInit = { method: '${operationInfo.method}' };`,
  ];

  if (body?.schema) {
    lines.push('  if (body !== undefined) init.body = JSON.stringify(body);');
  }

  if (queryParameters.length > 0) {
    lines.push('  const search = new URLSearchParams();');
    for (const parameter of queryParameters) {
      const key = JSON.stringify(parameter.name);
      const identifier = /^[A-Za-z_$][\w$]*$/.test(parameter.name)
        ? `query.${parameter.name}`
        : `query[${key}]`;
      lines.push(`  if (${identifier} !== undefined && ${identifier} !== null) search.set(${key}, String(${identifier}));`);
    }
    lines.push('  const queryString = search.toString();');
    lines.push(`  return apiRequest<${responseType}>(\`${'${path}${queryString ? `?${queryString}` : ""}'}\`, init, options);`);
  } else {
    lines.push(`  return apiRequest<${responseType}>(path, init, options);`);
  }

  lines.push('}');
  return lines.join('\n');
}

function renderTypeScriptClient(spec = {}) {
  if (!isOpenApiLike(spec)) return '';
  const baseUrl = JSON.stringify(openApiBaseUrl(spec));
  const schemas = renderTypeScriptSchemas(spec);
  const operations = openApiOperations(spec).map((operation) => renderTypeScriptOperation(spec, operation));
  const prelude = [
    `// Generated from ${spec.info?.title || 'OpenAPI'} ${spec.info?.version || ''}`.trim(),
    '',
    'export interface RequestOptions {',
    '  baseUrl?: string;',
    '  headers?: Record<string, string>;',
    '  fetch?: typeof fetch;',
    '}',
    '',
    `const DEFAULT_BASE_URL = ${baseUrl};`,
    '',
    'async function apiRequest<T>(path: string, init: RequestInit = {}, options: RequestOptions = {}): Promise<T> {',
    '  const fetchImpl = options.fetch ?? fetch;',
    '  const response = await fetchImpl(`${options.baseUrl ?? DEFAULT_BASE_URL}${path}`, {',
    '    ...init,',
    '    headers: {',
    "      'Content-Type': 'application/json',",
    '      ...(options.headers ?? {}),',
    '      ...((init.headers as Record<string, string> | undefined) ?? {}),',
    '    },',
    '  });',
    '',
    '  if (!response.ok) {',
    '    const message = await response.text();',
    '    throw new Error(`Request failed ${response.status}: ${message}`);',
    '  }',
    '',
    '  if (response.status === 204) return undefined as T;',
    '  return response.json() as Promise<T>;',
    '}',
  ].join('\n');

  return [
    prelude,
    ...schemas,
    ...operations,
  ].filter(Boolean).join('\n\n');
}

function renderPythonOpenApiClient(spec = {}) {
  if (!isOpenApiLike(spec)) return '';
  const operations = openApiOperations(spec);
  const lines = [
    'import requests',
    'from urllib.parse import quote',
    '',
    `BASE_URL = ${JSON.stringify(openApiBaseUrl(spec))}`,
    '',
    'def request(path, method="GET", *, params=None, json_body=None, base_url=BASE_URL):',
    '    response = requests.request(method, f"{base_url}{path}", params=params, json=json_body)',
    '    response.raise_for_status()',
    '    return response.json() if response.content else None',
  ];

  for (const operationInfo of operations) {
    const pathParameters = operationInfo.parameters.filter((parameter) => parameter.in === 'path');
    const queryParameters = operationInfo.parameters.filter((parameter) => parameter.in === 'query');
    const body = openApiRequestBody(operationInfo.operation, operationInfo.parameters);
    const name = toSnakeCase(operationInfo.name);
    const args = [
      ...pathParameters.map((parameter) => safeTsIdentifier(parameter.name, 'path_param')),
    ];
    if (body?.schema) args.push(body.required ? 'body' : 'body=None');
    args.push(...queryParameters.map((parameter) => `${safeTsIdentifier(parameter.name, 'query_param')}=None`));
    args.push('base_url=BASE_URL');

    let path = operationInfo.path;
    for (const parameter of pathParameters) {
      const identifier = safeTsIdentifier(parameter.name, 'path_param');
      path = path.replace(`{${parameter.name}}`, `{quote(str(${identifier}), safe='')}`);
    }

    lines.push('');
    lines.push(`def ${name}(${args.join(', ')}):`);
    lines.push(`    path = f${JSON.stringify(path)}`);
    if (queryParameters.length > 0) {
      const pairs = queryParameters.map((parameter) => {
        const identifier = safeTsIdentifier(parameter.name, 'query_param');
        return `${JSON.stringify(parameter.name)}: ${identifier}`;
      });
      lines.push(`    params = {${pairs.join(', ')}}`);
      lines.push('    params = {key: value for key, value in params.items() if value is not None}');
    } else {
      lines.push('    params = None');
    }
    lines.push(`    return request(path, ${JSON.stringify(operationInfo.method)}, params=params, json_body=${body?.schema ? 'body' : 'None'}, base_url=base_url)`);
  }

  return lines.join('\n');
}

function renderGoOpenApiClient(spec = {}) {
  if (!isOpenApiLike(spec)) return '';
  const operations = openApiOperations(spec);
  const lines = [
    'package api',
    '',
    'import (',
    '\t"bytes"',
    '\t"context"',
    '\t"encoding/json"',
    '\t"fmt"',
    '\t"net/http"',
    '\t"net/url"',
    ')',
    '',
    `const DefaultBaseURL = ${JSON.stringify(openApiBaseUrl(spec))}`,
    '',
    'type Client struct {',
    '\tBaseURL string',
    '\tHTTPClient *http.Client',
    '}',
    '',
    'func NewClient() *Client {',
    '\treturn &Client{BaseURL: DefaultBaseURL, HTTPClient: http.DefaultClient}',
    '}',
    '',
    'func (c *Client) do(ctx context.Context, method string, path string, body any, out any) error {',
    '\tvar reader *bytes.Reader',
    '\tif body != nil {',
    '\t\tpayload, err := json.Marshal(body)',
    '\t\tif err != nil { return err }',
    '\t\treader = bytes.NewReader(payload)',
    '\t} else {',
    '\t\treader = bytes.NewReader(nil)',
    '\t}',
    '\treq, err := http.NewRequestWithContext(ctx, method, c.BaseURL+path, reader)',
    '\tif err != nil { return err }',
    '\treq.Header.Set("Content-Type", "application/json")',
    '\tresp, err := c.HTTPClient.Do(req)',
    '\tif err != nil { return err }',
    '\tdefer resp.Body.Close()',
    '\tif resp.StatusCode < 200 || resp.StatusCode >= 300 { return fmt.Errorf("request failed: %s", resp.Status) }',
    '\tif out == nil || resp.StatusCode == http.StatusNoContent { return nil }',
    '\treturn json.NewDecoder(resp.Body).Decode(out)',
    '}',
  ];

  for (const operationInfo of operations) {
    const pathParameters = operationInfo.parameters.filter((parameter) => parameter.in === 'path');
    const queryParameters = operationInfo.parameters.filter((parameter) => parameter.in === 'query');
    const body = openApiRequestBody(operationInfo.operation, operationInfo.parameters);
    const responseType = tsTypeForSchema(openApiResponseSchema(operationInfo.operation), spec, 'map[string]any');
    const goResultType = responseType.includes('[]') ? '[]map[string]any' : 'map[string]any';
    const args = ['ctx context.Context'];
    for (const parameter of pathParameters) args.push(`${safeTsIdentifier(parameter.name, 'pathParam')} string`);
    if (queryParameters.length > 0) args.push('query map[string]string');
    if (body?.schema) args.push('body any');
    const functionName = safeClassName(operationInfo.name, 'Operation');

    let path = operationInfo.path;
    for (const parameter of pathParameters) {
      const identifier = safeTsIdentifier(parameter.name, 'pathParam');
      path = path.replace(`{${parameter.name}}`, `%s`);
      args.push();
      operationInfo.__goPathParamNames = [...(operationInfo.__goPathParamNames || []), identifier];
    }

    lines.push('');
    lines.push(`func (c *Client) ${functionName}(${args.join(', ')}) (${goResultType}, error) {`);
    if (operationInfo.__goPathParamNames?.length) {
      const formatArgs = operationInfo.__goPathParamNames.map((name) => `url.PathEscape(${name})`).join(', ');
      lines.push(`\tpath := fmt.Sprintf(${JSON.stringify(path)}, ${formatArgs})`);
    } else {
      lines.push(`\tpath := ${JSON.stringify(path)}`);
    }
    if (queryParameters.length > 0) {
      lines.push('\tvalues := url.Values{}');
      lines.push('\tfor key, value := range query { values.Set(key, value) }');
      lines.push('\tif encoded := values.Encode(); encoded != "" { path += "?" + encoded }');
    } else {
      lines.push('\t_ = url.Values{}');
    }
    lines.push(`\tvar result ${goResultType}`);
    lines.push(`\terr := c.do(ctx, ${JSON.stringify(operationInfo.method)}, path, ${body?.schema ? 'body' : 'nil'}, &result)`);
    lines.push('\treturn result, err');
    lines.push('}');
    delete operationInfo.__goPathParamNames;
  }

  return lines.join('\n');
}

function normalizeDocumentPunctuation(text) {
  return text
    .replace(/[ \t]+([,;:!?])/g, '$1')
    .replace(/([,;:!?])(?=\S)/g, '$1 ')
    .replace(/(^|[^0-9])\.([A-Za-z])/g, '$1. $2')
    .replace(/[ \t]+([.)\]])/g, '$1')
    .replace(/([(\\[])[ \t]+/g, '$1');
}

function capitalizeDocumentSentences(text) {
  return text.replace(/(^|[.!?]\s+|\n+)([a-z])/g, (_match, prefix, letter) => `${prefix}${letter.toUpperCase()}`);
}

function wrapDocumentLine(line, width) {
  const maxWidth = Math.trunc(Number(width) || 0);
  if (maxWidth <= 0 || line.length <= maxWidth) return [line];

  const words = line.split(/\s+/).filter(Boolean);
  const wrapped = [];
  let current = '';

  for (const word of words) {
    if (!current) {
      current = word;
      continue;
    }

    if (`${current} ${word}`.length <= maxWidth) {
      current = `${current} ${word}`;
    } else {
      wrapped.push(current);
      current = word;
    }
  }

  if (current) wrapped.push(current);
  return wrapped.length > 0 ? wrapped : [line];
}

function regexTokenLabel(token) {
  if (!token || typeof token !== 'object') return '';
  if (token.type === 'group') return `group ${token.value}`;
  if (token.type === 'charset') return `set ${token.value}`;
  if (token.type === 'quantifier') return `repeat ${token.value}`;
  if (token.type === 'alternation') return 'or';
  if (token.type === 'anchor') return `anchor ${token.value}`;
  if (token.type === 'special') return token.value;
  return token.value;
}

function isUuidString(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value || ''));
}

function isIsoDateString(value) {
  return /^\d{4}-\d{2}-\d{2}(?:[T ][\d:.+-]+Z?)?$/.test(String(value || '')) && !Number.isNaN(Date.parse(value));
}

function firstArrayValue(value) {
  return Array.isArray(value) && value.length > 0 ? value.find((item) => item !== null && item !== undefined) ?? value[0] : undefined;
}

function inferCodeKind(value) {
  if (value === null || value === undefined) return { kind: 'null', nullable: true };
  if (Array.isArray(value)) {
    const item = firstArrayValue(value);
    return { kind: 'array', item: inferCodeKind(item), nullable: false };
  }
  if (typeof value === 'object') return { kind: 'object', nullable: false };
  if (typeof value === 'boolean') return { kind: 'boolean', nullable: false };
  if (typeof value === 'number') return { kind: Number.isInteger(value) ? 'integer' : 'number', nullable: false };
  if (typeof value === 'string') {
    if (isUuidString(value)) return { kind: 'uuid', nullable: false };
    if (isIsoDateString(value)) return { kind: 'datetime', nullable: false };
    return { kind: 'string', nullable: false };
  }
  return { kind: 'unknown', nullable: true };
}

function inferPythonType(value, fieldName, options = {}) {
  const kind = inferCodeKind(value);
  let type = 'Any';
  if (kind.kind === 'string' || kind.kind === 'uuid' || kind.kind === 'datetime') type = 'str';
  if (kind.kind === 'integer') type = 'int';
  if (kind.kind === 'number') type = 'float';
  if (kind.kind === 'boolean') type = 'bool';
  if (kind.kind === 'object') type = safeClassName(fieldName);
  if (kind.kind === 'array') type = `List[${inferPythonType(firstArrayValue(value), fieldName, { ...options, useOptional: false })}]`;
  if ((options.useOptional && (value === null || value === undefined)) || kind.nullable) type = `Optional[${type}]`;
  return type;
}

function inferJavaType(value, fieldName) {
  const kind = inferCodeKind(value);
  if (kind.kind === 'string' || kind.kind === 'uuid' || kind.kind === 'datetime') return 'String';
  if (kind.kind === 'integer') return 'Integer';
  if (kind.kind === 'number') return 'Double';
  if (kind.kind === 'boolean') return 'Boolean';
  if (kind.kind === 'object') return safeClassName(fieldName);
  if (kind.kind === 'array') return `List<${inferJavaType(firstArrayValue(value), fieldName)}>`;
  return 'Object';
}

function inferKotlinType(value, fieldName, nullable = true) {
  const kind = inferCodeKind(value);
  let type = 'Any';
  if (kind.kind === 'string' || kind.kind === 'uuid' || kind.kind === 'datetime') type = 'String';
  if (kind.kind === 'integer') type = 'Int';
  if (kind.kind === 'number') type = 'Double';
  if (kind.kind === 'boolean') type = 'Boolean';
  if (kind.kind === 'object') type = safeClassName(fieldName);
  if (kind.kind === 'array') type = `List<${inferKotlinType(firstArrayValue(value), fieldName, false)}>`;
  return nullable || kind.nullable ? `${type}?` : type;
}

function inferDartType(value, fieldName) {
  const kind = inferCodeKind(value);
  if (kind.kind === 'string' || kind.kind === 'uuid' || kind.kind === 'datetime') return 'String';
  if (kind.kind === 'integer') return 'int';
  if (kind.kind === 'number') return 'double';
  if (kind.kind === 'boolean') return 'bool';
  if (kind.kind === 'object') return safeClassName(fieldName);
  if (kind.kind === 'array') return `List<${inferDartType(firstArrayValue(value), fieldName)}>`;
  return 'dynamic';
}

function collectNestedObjects(value) {
  return Object.entries(value || {}).filter(([, fieldValue]) => {
    if (isPlainObject(fieldValue)) return true;
    const item = firstArrayValue(fieldValue);
    return isPlainObject(item);
  });
}

function graphQlTypeFor(value, fieldName) {
  const kind = inferCodeKind(value);
  if (kind.kind === 'uuid' || safeCodeIdentifier(fieldName).toLowerCase() === 'id') return 'ID';
  if (kind.kind === 'datetime') return 'DateTime';
  if (kind.kind === 'string') return 'String';
  if (kind.kind === 'integer') return 'Int';
  if (kind.kind === 'number') return 'Float';
  if (kind.kind === 'boolean') return 'Boolean';
  if (kind.kind === 'object') return safeClassName(fieldName);
  if (kind.kind === 'array') return `[${graphQlTypeFor(firstArrayValue(value), fieldName)}!]`;
  return 'String';
}

function protoTypeFor(value, fieldName) {
  const kind = inferCodeKind(value);
  if (kind.kind === 'uuid' || kind.kind === 'datetime' || kind.kind === 'string') return 'string';
  if (kind.kind === 'integer') return Math.abs(Number(value)) > 2147483647 ? 'int64' : 'int32';
  if (kind.kind === 'number') return 'double';
  if (kind.kind === 'boolean') return 'bool';
  if (kind.kind === 'object') return safeClassName(fieldName);
  if (kind.kind === 'array') return protoTypeFor(firstArrayValue(value), fieldName);
  return 'string';
}

function generateJsonSchemaForValue(value, options = {}) {
  if (value === null) return { type: 'null' };
  if (Array.isArray(value)) {
    const item = firstArrayValue(value);
    const schema = { type: 'array', items: generateJsonSchemaForValue(item ?? null, options) };
    if (options.includeExamples) schema.examples = [value];
    return schema;
  }
  if (isPlainObject(value)) {
    const properties = {};
    const required = [];
    for (const [key, fieldValue] of Object.entries(value)) {
      properties[key] = generateJsonSchemaForValue(fieldValue, options);
      if (options.markAllRequired && fieldValue !== null && fieldValue !== undefined) required.push(key);
    }
    const schema = { type: 'object', properties, additionalProperties: false };
    if (required.length > 0) schema.required = required;
    if (options.includeExamples) schema.examples = [value];
    return schema;
  }
  if (typeof value === 'string') {
    const schema = { type: 'string' };
    if (isUuidString(value)) schema.format = 'uuid';
    if (isIsoDateString(value)) schema.format = value.includes('T') ? 'date-time' : 'date';
    if (options.includeExamples) schema.examples = [value];
    return schema;
  }
  if (typeof value === 'number') {
    const schema = { type: Number.isInteger(value) ? 'integer' : 'number' };
    if (options.includeExamples) schema.examples = [value];
    return schema;
  }
  if (typeof value === 'boolean') {
    const schema = { type: 'boolean' };
    if (options.includeExamples) schema.examples = [value];
    return schema;
  }
  return {};
}

function parseImportStatement(statement = '', line = 1) {
  const trimmed = String(statement || '').trim();
  const sideEffectMatch = trimmed.match(/^import\s+['"]([^'"]+)['"];?$/);
  if (sideEffectMatch) {
    return { line, statement, source: sideEffectMatch[1], imports: [], named: [], used: [], unused: [], sideEffect: true };
  }

  const match = trimmed.match(/^import\s+(type\s+)?([\s\S]+?)\s+from\s+['"]([^'"]+)['"];?$/);
  if (!match) return null;

  const spec = match[2].trim();
  const info = {
    line,
    statement,
    source: match[3],
    imports: [],
    named: [],
    defaultImport: '',
    namespaceImport: '',
    typeOnly: Boolean(match[1]),
    used: [],
    unused: [],
  };

  if (spec.startsWith('* as ')) {
    info.namespaceImport = spec.replace(/^\*\s+as\s+/, '').trim();
    info.imports.push(info.namespaceImport);
    return info;
  }

  const namedMatch = spec.match(/\{([\s\S]*)\}/);
  const defaultPart = namedMatch ? spec.slice(0, namedMatch.index).replace(/,$/, '').trim() : spec;
  if (defaultPart && !defaultPart.startsWith('{')) {
    info.defaultImport = defaultPart;
    info.imports.push(defaultPart);
  }

  if (namedMatch) {
    for (const part of splitSqlTopLevel(namedMatch[1])) {
      const [imported, local] = part.split(/\s+as\s+/i).map((item) => item.trim()).filter(Boolean);
      if (!imported) continue;
      const localName = local || imported;
      info.named.push({ imported, local: localName });
      info.imports.push(localName);
    }
  }

  return info.imports.length > 0 ? info : null;
}

function stripImportLines(lines, importLines) {
  return lines.filter((_, index) => !importLines.has(index + 1)).join('\n');
}

function rebuildImportStatement(info, usedNames) {
  if (info.sideEffect) return info.statement;

  const parts = [];
  if (info.defaultImport && usedNames.has(info.defaultImport)) parts.push(info.defaultImport);
  if (info.namespaceImport && usedNames.has(info.namespaceImport)) parts.push(`* as ${info.namespaceImport}`);

  const named = (info.named || [])
    .filter((item) => usedNames.has(item.local))
    .map((item) => item.imported === item.local ? item.imported : `${item.imported} as ${item.local}`);
  if (named.length > 0) parts.push(`{ ${named.join(', ')} }`);

  return parts.length > 0 ? `import ${info.typeOnly ? 'type ' : ''}${parts.join(', ')} from '${info.source}';` : '';
}

function slugifyHeading(text = '') {
  return String(text || '')
    .toLowerCase()
    .replace(/<[^>]*>/g, '')
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'section';
}

function stripHtmlTags(text = '') {
  return String(text || '').replace(/<[^>]*>/g, '').trim();
}

function renderOutlineItems(items = [], options = {}, depth = 0, counters = []) {
  const maxDepth = Math.max(1, Math.min(6, Number(options.maxDepth) || 6));
  const lines = [];

  items.filter((item) => item.level <= maxDepth).forEach((item, index) => {
    const numberPath = [...counters, index + 1];
    const indent = '  '.repeat(depth);
    const label = options.numbered ? `${numberPath.join('.')}. ${item.text}` : item.text;
    const linkedLabel = options.includeLinks ? `[${label}](#${item.id})` : label;

    if (options.format === 'html') {
      lines.push(`${indent}<li><a href="#${escapeHtmlAttribute(item.id)}">${safeHtmlText(label)}</a>`);
      if (item.children?.length) lines.push(`${indent}  <ul>\n${renderOutlineItems(item.children, options, depth + 2, numberPath)}\n${indent}  </ul>`);
      lines.push(`${indent}</li>`);
    } else if (options.format === 'text') {
      lines.push(`${indent}${label}`);
      if (item.children?.length) lines.push(renderOutlineItems(item.children, options, depth + 1, numberPath));
    } else {
      lines.push(`${indent}- ${linkedLabel}`);
      if (item.children?.length) lines.push(renderOutlineItems(item.children, options, depth + 1, numberPath));
    }
  });

  return lines.filter(Boolean).join('\n');
}

function renderTocEntries(entries = [], options = {}, depth = 0, counters = []) {
  const lines = [];
  const indent = ' '.repeat((Number(options.indentSize) || 4) * depth);

  entries.forEach((entry, index) => {
    const numberPath = [...counters, index + 1];
    const prefix = options.style === 'numbered' ? `${numberPath.join('.')} ` : '';
    const title = `${prefix}${entry.title}`;
    const page = options.showPageNumbers && entry.page ? String(entry.page) : '';
    if (page && options.style === 'dotted') lines.push(`${indent}${title} ${'.'.repeat(Math.max(2, 48 - indent.length - title.length - page.length))} ${page}`);
    else if (page && options.style === 'lined') lines.push(`${indent}${title} - ${page}`);
    else if (page) lines.push(`${indent}${title} ${page}`);
    else lines.push(`${indent}${title}`);
    if (entry.children?.length) lines.push(renderTocEntries(entry.children, options, depth + 1, numberPath));
  });

  return lines.filter(Boolean).join('\n');
}

function renderHtmlTocEntries(entries = [], options = {}, ordered = false) {
  const tag = ordered ? 'ol' : 'ul';
  const items = entries.map((entry) => {
    const page = options.showPageNumbers && entry.page ? ` <span class="toc-page">${safeHtmlText(entry.page)}</span>` : '';
    const children = entry.children?.length ? renderHtmlTocEntries(entry.children, options, ordered) : '';
    return `<li><span class="toc-title">${safeHtmlText(entry.title)}</span>${page}${children}</li>`;
  }).join('');
  return `<${tag}>${items}</${tag}>`;
}

function dumpYamlDocument(value) {
  return yaml.dump(value, { lineWidth: -1, noRefs: true, sortKeys: false }).trimEnd();
}

function safeK8sName(value = 'app') {
  return String(value || 'app')
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 63) || 'app';
}

function dockerServiceName(value = 'service') {
  return String(value || 'service')
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '_')
    .replace(/^_+|_+$/g, '') || 'service';
}

function filterEmptyArray(values = []) {
  return (Array.isArray(values) ? values : []).map((value) => String(value || '').trim()).filter(Boolean);
}

export const ACTIVITY_FACTORS = {
  "sedentary": 1,
  "light": 1.1,
  "moderate": 1.2,
  "active": 1.35
};
export const ACTIVITY_MULTIPLIERS = {
  "sedentary": 1.2,
  "light": 1.375,
  "moderate": 1.55,
  "active": 1.725,
  "veryActive": 1.9
};
export const AI_PATTERNS = {};
export const ASCII_FONTS = runtimeAsciiFonts;
export const AVAILABLE_TIMEZONES = [
  {
    "name": "New York",
    "timezone": "America/New_York"
  },
  {
    "name": "London",
    "timezone": "Europe/London"
  },
  {
    "name": "Tokyo",
    "timezone": "Asia/Tokyo"
  },
  {
    "name": "Shanghai",
    "timezone": "Asia/Shanghai"
  }
];
export const BADGE_TYPES = [];
export const BASE32_CHARS = {};
export const BASE85_CHARS = {};
export const CLIMATE_FACTORS = {
  "temperate": 1,
  "hot": 1.15,
  "cold": 1.05
};
export const CODE_TEMPLATES = [
  {
    "name": "JavaScript",
    "template": "const re = /PATTERN/g;"
  },
  {
    "name": "Python",
    "template": "import re\\nre.compile(r\"PATTERN\")"
  }
];
export const COLORS = [
  "#2563eb",
  "#22c55e",
  "#f97316",
  "#a855f7",
  "#ef4444",
  "#14b8a6"
];
export const COMMON_PATTERNS = [
  {
    "name": "Email",
    "pattern": "^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$"
  },
  {
    "name": "URL",
    "pattern": "https?://[^\\s]+"
  },
  {
    "name": "IPv4",
    "pattern": "^(?:[0-9]{1,3}\\.){3}[0-9]{1,3}$"
  }
];
export const COMMON_RESOLUTIONS = runtimeCommonResolutions;
export const COMMON_SPEEDS = {};
export const CONCEPTION_OFFSET = 266;
export const CURRENCIES = [
  {
    "code": "USD",
    "symbol": "$",
    "name": "US Dollar"
  },
  {
    "code": "EUR",
    "symbol": "€",
    "name": "Euro"
  },
  {
    "code": "GBP",
    "symbol": "£",
    "name": "British Pound"
  },
  {
    "code": "JPY",
    "symbol": "¥",
    "name": "Japanese Yen"
  }
];
export const CURRENCY_SYMBOLS = {
  "USD": "$",
  "EUR": "€",
  "GBP": "£",
  "JPY": "¥",
  "CNY": "¥"
};
export const DATA_TYPES: Record<string, string[]> = {
  postgresql: ['SERIAL', 'INTEGER', 'BIGINT', 'VARCHAR(255)', 'TEXT', 'BOOLEAN', 'TIMESTAMP', 'UUID', 'JSONB'],
  mysql: ['INT AUTO_INCREMENT', 'INT', 'BIGINT', 'VARCHAR(255)', 'TEXT', 'BOOLEAN', 'DATETIME', 'JSON'],
  sqlite: ['INTEGER', 'TEXT', 'REAL', 'BOOLEAN', 'DATETIME', 'BLOB'],
  mongodb: ['String', 'Number', 'Boolean', 'Date', 'ObjectId', 'Mixed'],
};
export const DEFAULT_CITIES = [
  {
    "id": "nyc",
    "name": "New York",
    "timezone": "America/New_York",
    "offset": "UTC-4"
  },
  {
    "id": "lon",
    "name": "London",
    "timezone": "Europe/London",
    "offset": "UTC+0"
  },
  {
    "id": "tok",
    "name": "Tokyo",
    "timezone": "Asia/Tokyo",
    "offset": "UTC+9"
  }
];
export const DEFAULT_PORTS = {};
export const EMPTY_ENTRY = "(empty)";
export const EXAMPLE_CODE = `import fs from 'fs';
import path from 'path';
import { readFile, writeFile as saveFile, unlink } from 'fs/promises';

app.get('/users', async (req, res) => {
  const sql = "SELECT * FROM users WHERE email = '" + req.query.email + "'";
  const users = await db.query(sql);
  res.json(users);
});

function normalizeUser(user) {
  const name = user.name.trim();
  const email = user.email.toLowerCase();
  return { name, email };
}

function normalizeAdmin(user) {
  const name = user.name.trim();
  const email = user.email.toLowerCase();
  return { name, email };
}

await readFile(path.join('data', 'users.json'), 'utf8');
await saveFile('out.json', JSON.stringify({ ok: true }));
console.log(fs.existsSync('out.json'));`;
export const EXAMPLE_INCOMES = "";
export const EXAMPLE_JSON = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  active: true,
  tags: ['developer', 'admin'],
  address: {
    city: 'New York',
    country: 'USA',
  },
};
export const EXAMPLE_PACKAGE_JSON = `{
  "dependencies": {
    "lodash": "4.17.20",
    "minimist": "1.2.5",
    "jquery": "3.4.1",
    "axios": "0.21.0"
  },
  "devDependencies": {
    "webpack": "5.90.0"
  }
}`;
export const EXAMPLE_SPEC = {
  openapi: '3.0.3',
  info: {
    title: 'Example Users API',
    version: '1.0.0',
  },
  servers: [
    { url: 'https://api.example.com/v1' },
  ],
  paths: {
    '/users': {
      get: {
        operationId: 'listUsers',
        summary: 'List users',
        parameters: [
          { name: 'status', in: 'query', schema: { type: 'string' } },
          { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1 } },
        ],
        responses: {
          '200': {
            description: 'Users returned',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/User' },
                },
              },
            },
          },
        },
      },
      post: {
        operationId: 'createUser',
        summary: 'Create a user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateUserRequest' },
            },
          },
        },
        responses: {
          '201': {
            description: 'User created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/User' },
              },
            },
          },
        },
      },
    },
    '/users/{id}': {
      get: {
        operationId: 'getUser',
        summary: 'Get one user',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': {
            description: 'User returned',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/User' },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      User: {
        type: 'object',
        required: ['id', 'email'],
        properties: {
          id: { type: 'string' },
          email: { type: 'string', format: 'email' },
          name: { type: 'string' },
          active: { type: 'boolean' },
          roles: {
            type: 'array',
            items: { type: 'string' },
          },
        },
      },
      CreateUserRequest: {
        type: 'object',
        required: ['email'],
        properties: {
          email: { type: 'string', format: 'email' },
          name: { type: 'string' },
          roles: {
            type: 'array',
            items: { type: 'string' },
          },
        },
      },
    },
  },
};
export const EXAMPLE_SQL = `SELECT *
FROM orders
WHERE LOWER(customer_email) = 'alice@example.com'
ORDER BY created_at DESC;`;
export const ErrorInfo = [];
export const FIELD_NAMES = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "company",
  "title"
];
export const FILLER_WORDS = [];
export const GRADE_POINTS_4 = {
  "A": 4,
  "A-": 3.7,
  "B+": 3.3,
  "B": 3,
  "B-": 2.7,
  "C": 2,
  "D": 1,
  "F": 0
};
export const GRADE_POINTS_5 = {
  "A": 5,
  "A-": 4.7,
  "B+": 4.3,
  "B": 4,
  "B-": 3.7,
  "C": 3,
  "D": 2,
  "F": 0
};
export const HTTP_CODES = {
  "200": "OK",
  "201": "Created",
  "204": "No Content",
  "301": "Moved Permanently",
  "302": "Found",
  "400": "Bad Request",
  "401": "Unauthorized",
  "403": "Forbidden",
  "404": "Not Found",
  "500": "Internal Server Error"
};
export const HTTP_STATUS_CODES = {
  "200": "OK",
  "201": "Created",
  "301": "Moved Permanently",
  "400": "Bad Request",
  "401": "Unauthorized",
  "403": "Forbidden",
  "404": "Not Found",
  "500": "Internal Server Error"
};
export const ICO_SIZES = [];
export const K = [];
export const LICENSES = [
  {
    "id": "mit",
    "name": "MIT License",
    "text": "MIT License\\n\\nCopyright (c) {{year}} {{name}}"
  },
  {
    "id": "apache-2.0",
    "name": "Apache 2.0",
    "text": "Apache License 2.0\\n\\nCopyright (c) {{year}} {{name}}"
  }
];
export const MORSE_CODE = runtimeMorseCode;
export const NAMING_CONVENTIONS = [
  {
    "id": "feature",
    "pattern": "feature/your-branch",
    "desc": "Feature branches"
  },
  {
    "id": "bugfix",
    "pattern": "bugfix/your-branch",
    "desc": "Bug fix branches"
  }
];
export const NATO_ALPHABET = runtimeNatoAlphabet;
export const PREGNANCY_DAYS = 280;
export const PRESETS: Record<string, any[]> = {
  node: [
    { key: 'NODE_ENV', value: 'development', description: 'Node environment', required: true, secret: false },
    { key: 'PORT', value: '3000', description: 'HTTP server port', required: true, secret: false },
    { key: 'DATABASE_URL', value: 'postgres://user:pass@localhost:5432/app', description: 'Database connection string', required: true, secret: true },
  ],
  nextjs: [
    { key: 'NEXT_PUBLIC_APP_URL', value: 'http://localhost:3000', description: 'Public app URL', required: true, secret: false },
    { key: 'DATABASE_URL', value: '', description: 'Database connection string', required: true, secret: true },
    { key: 'AUTH_SECRET', value: '', description: 'Authentication secret', required: true, secret: true },
  ],
  rails: [
    { key: 'RAILS_ENV', value: 'development', description: 'Rails environment', required: true, secret: false },
    { key: 'DATABASE_URL', value: '', description: 'Database connection string', required: true, secret: true },
    { key: 'SECRET_KEY_BASE', value: '', description: 'Rails secret key base', required: true, secret: true },
  ],
};
export const PRINT_SIZES = {};
export const REVERSE_MORSE = runtimeReverseMorse;
export const ReactNode = [];
export const SAMPLE_CONFLICT = "<<<<<<< HEAD\\nLocal change\\n=======\\nIncoming change\\n>>>>>>> branch";
export const SAMPLE_CONTENT = `# Product Guide

## Getting Started
Content

### Installation
Content

## Advanced Usage
Content`;
export const SAMPLE_INPUT = `Introduction | 1
  Getting Started | 3
  Installation | 5
Advanced Usage | 9
  Configuration | 10`;
export const SAMPLE_LOG = `a1b2c3d4e5f6|0011223|Ada Lovelace|2026-05-01|feat: add export flow
001122334455||Grace Hopper|2026-04-30|fix: handle empty input
998877665544|a1b2c3d4e5f6 001122334455|Linus Torvalds|2026-04-29|Merge branch 'main'`;
export const COMMIT_TYPE_KEYS = ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'build', 'ci', 'chore', 'revert'];
export const CHANGE_TYPES = [
  { value: 'added', label: 'Added' },
  { value: 'changed', label: 'Changed' },
  { value: 'deprecated', label: 'Deprecated' },
  { value: 'removed', label: 'Removed' },
  { value: 'fixed', label: 'Fixed' },
  { value: 'security', label: 'Security' },
];
export const SAMPLE_MARKDOWN = "# Sample Markdown\\n\\n**Bold** and _italic_.";
export const SAMPLE_PAYLOADS = {
  "json": "{\n  \"event\": \"ping\",\n  \"timestamp\": \"2026-04-04T00:00:00Z\"\n}",
  "xml": "<event><type>ping</type><timestamp>2026-04-04T00:00:00Z</timestamp></event>",
  "form": "event=ping&timestamp=2026-04-04T00%3A00%3A00Z"
};
export const SAMPLE_TEXT = "Sample text for analysis.";
export const SERVICES = [];
export const SERVICE_TEMPLATES: Record<string, any> = {
  app: {
    image: 'node:20-alpine',
    ports: ['3000:3000'],
    environment: { NODE_ENV: 'production' },
    volumes: ['.:/app'],
    command: 'npm start',
  },
  postgres: {
    image: 'postgres:16-alpine',
    ports: ['5432:5432'],
    environment: { POSTGRES_USER: 'user', POSTGRES_PASSWORD: 'password', POSTGRES_DB: 'app' },
    volumes: ['postgres_data:/var/lib/postgresql/data'],
  },
  redis: {
    image: 'redis:7-alpine',
    ports: ['6379:6379'],
    volumes: ['redis_data:/data'],
  },
  nginx: {
    image: 'nginx:alpine',
    ports: ['8080:80'],
    volumes: ['./nginx.conf:/etc/nginx/nginx.conf:ro'],
  },
};
export const SLEEP_CYCLE_MINUTES = 90;
export const SYNONYMS = {};
export const TEMPLATES = [];
export const TIMEZONES = [
  { value: 'UTC', label: 'UTC' },
  { value: 'America/New_York', label: 'New York (ET)' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (PT)' },
  { value: 'Europe/London', label: 'London' },
  { value: 'Europe/Berlin', label: 'Berlin' },
  { value: 'Asia/Shanghai', label: 'Shanghai' },
  { value: 'Asia/Tokyo', label: 'Tokyo' },
  { value: 'Australia/Sydney', label: 'Sydney' },
];
export const alignItems = [];
export const presetKeyframes = {
  bounce: '@keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-25%); } }',
  pulse: '@keyframes pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.08); opacity: 0.75; } }',
  shake: '@keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-8px); } 75% { transform: translateX(8px); } }',
  spin: '@keyframes spin { to { transform: rotate(360deg); } }',
  fadeIn: '@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }',
  slideIn: '@keyframes slideIn { from { transform: translateX(-24px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }',
  zoomIn: '@keyframes zoomIn { from { transform: scale(0.75); opacity: 0; } to { transform: scale(1); opacity: 1; } }',
  flip: '@keyframes flip { from { transform: rotateY(0); } to { transform: rotateY(360deg); } }',
};
export const allKeyframes = Object.values(presetKeyframes).join('\n');
export function analyzeComplexity(code: any = '', language: any = 'javascript') {
  return runtimeAnalyzeComplexity(code, language);
}
export function analyzeDeadCode(code: any = '') { return runtimeAnalyzeDeadCode(code); }
export function analyzeDocument() { return { score: 0, issues: [] }; }
export function analyzeFrequency() { return { score: 0, issues: [] }; }
export function analyzePerformance(code: any = '') { return runtimeAnalyzePerformance(code); }
export function analyzeQuery() { return { score: 0, issues: [] }; }
export function applyBitFlags(byte = 0, locallyAdministered = true, multicast = false) {
  let value = Number(byte) & 0xff;
  value = locallyAdministered ? value | 0x02 : value & ~0x02;
  value = multicast ? value | 0x01 : value & ~0x01;
  return value;
}
export const bandConversions = {};
export function base64UrlEncode(value) { return runtimeBase64UrlEncode(value); }
export const bicDatabase = {};
export function buildCrc32Table() {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i += 1) {
    let value = i;
    for (let bit = 0; bit < 8; bit += 1) {
      value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
    }
    table[i] = value >>> 0;
  }
  return table;
}
export function buildOutlineTree(headings: any[] = []) {
  const root = [];
  const stack = [{ level: 0, children: root }];

  for (const heading of headings || []) {
    const item = { ...heading, children: [] };
    while (stack.length > 1 && stack[stack.length - 1].level >= item.level) stack.pop();
    stack[stack.length - 1].children.push(item);
    stack.push(item);
  }

  return root;
}
export function bumpVersion() { return null; }
export function caesarCipher(input = '', shift = 0, decrypt = false) {
  const normalizedShift = (((Number(shift) || 0) % 26) + 26) % 26;
  const effectiveShift = decrypt ? (26 - normalizedShift) % 26 : normalizedShift;
  return String(input || '').replace(/[A-Za-z]/g, (char) => {
    const base = char >= 'a' && char <= 'z' ? 97 : 65;
    return String.fromCharCode(((char.charCodeAt(0) - base + effectiveShift) % 26) + base);
  });
}
export function calculateAspectRatio(width = 0, height = 0) {
  const w = Math.abs(Math.trunc(Number(width) || 0));
  const h = Math.abs(Math.trunc(Number(height) || 0));
  if (w === 0 || h === 0) return '0:0';
  const divisor = gcd(w, h);
  return `${w / divisor}:${h / divisor}`;
}
export function calculateBreakEven(fixedCosts = 0, variableCostPerUnit = 0, sellingPricePerUnit = 0) {
    return runtimeCalculateBreakEven(
      Number(fixedCosts) || 0,
      Number(variableCostPerUnit) || 0,
      Number(sellingPricePerUnit) || 0
    );
  }
export function calculateCapacity(member = {}, config = {}) {
    return runtimeCalculateCapacity(member, config);
  }
export function calculateInflation(amount = 0, startYear = 0, endYear = 0, annualRate = 0) {
  const principal = Number(amount) || 0;
  const start = Math.trunc(Number(startYear) || 0);
  const end = Math.trunc(Number(endYear) || 0);
  const rate = Number(annualRate) || 0;
  const years = Math.max(0, end - start);
  const yearlyBreakdown = [];
  let value = principal;

  for (let i = 1; i <= years; i += 1) {
    value *= 1 + rate / 100;
    yearlyBreakdown.push({
      year: start + i,
      value,
      inflation: principal === 0 ? 0 : ((value - principal) / principal) * 100,
    });
  }

  return {
    adjustedValue: value,
    totalInflation: principal === 0 ? 0 : ((value - principal) / principal) * 100,
    purchasingPowerLoss: value === 0 ? 0 : (1 - principal / value) * 100,
    yearlyBreakdown,
  };
}
function normalizeArrayBuffer(input) {
  if (!input) return null;
  if (typeof input === 'string') {
    if (typeof TextEncoder !== 'undefined') {
      return new TextEncoder().encode(input).buffer;
    }
    return null;
  }
  if (input instanceof ArrayBuffer) return input;
  if (typeof Blob !== 'undefined' && input instanceof Blob) {
    return input.arrayBuffer();
  }
  if (typeof input.arrayBuffer === 'function') {
    return input.arrayBuffer();
  }
  return null;
}
function add32(a, b) {
  return ((a | 0) + (b | 0)) | 0;
}
function rol(num, cnt) {
  return (num << cnt) | (num >>> (32 - cnt));
}
function cmn(q, a, b, x, s, t) {
  return add32(rol(add32(add32(a, q), add32(x, t)), s), b);
}
function ff(a, b, c, d, x, s, t) {
  return cmn((b & c) | (~b & d), a, b, x, s, t);
}
function gg(a, b, c, d, x, s, t) {
  return cmn((b & d) | (c & ~d), a, b, x, s, t);
}
function hh(a, b, c, d, x, s, t) {
  return cmn(b ^ c ^ d, a, b, x, s, t);
}
function ii(a, b, c, d, x, s, t) {
  return cmn(c ^ (b | ~d), a, b, x, s, t);
}
function md5ArrayBuffer(buffer) {
  const bytes = new Uint8Array(buffer);
  const words = [];
  for (let i = 0; i < bytes.length; i += 1) {
    words[i >> 2] |= bytes[i] << ((i % 4) * 8);
  }
  const bitLen = bytes.length * 8;
  words[bitLen >> 5] |= 0x80 << (bitLen % 32);
  words[(((bitLen + 64) >>> 9) << 4) + 14] = bitLen;

  let a = 1732584193;
  let b = -271733879;
  let c = -1732584194;
  let d = 271733878;

  for (let i = 0; i < words.length; i += 16) {
    const oldA = a;
    const oldB = b;
    const oldC = c;
    const oldD = d;

    a = ff(a, b, c, d, words[i + 0], 7, -680876936);
    d = ff(d, a, b, c, words[i + 1], 12, -389564586);
    c = ff(c, d, a, b, words[i + 2], 17, 606105819);
    b = ff(b, c, d, a, words[i + 3], 22, -1044525330);
    a = ff(a, b, c, d, words[i + 4], 7, -176418897);
    d = ff(d, a, b, c, words[i + 5], 12, 1200080426);
    c = ff(c, d, a, b, words[i + 6], 17, -1473231341);
    b = ff(b, c, d, a, words[i + 7], 22, -45705983);
    a = ff(a, b, c, d, words[i + 8], 7, 1770035416);
    d = ff(d, a, b, c, words[i + 9], 12, -1958414417);
    c = ff(c, d, a, b, words[i + 10], 17, -42063);
    b = ff(b, c, d, a, words[i + 11], 22, -1990404162);
    a = ff(a, b, c, d, words[i + 12], 7, 1804603682);
    d = ff(d, a, b, c, words[i + 13], 12, -40341101);
    c = ff(c, d, a, b, words[i + 14], 17, -1502002290);
    b = ff(b, c, d, a, words[i + 15], 22, 1236535329);

    a = gg(a, b, c, d, words[i + 1], 5, -165796510);
    d = gg(d, a, b, c, words[i + 6], 9, -1069501632);
    c = gg(c, d, a, b, words[i + 11], 14, 643717713);
    b = gg(b, c, d, a, words[i + 0], 20, -373897302);
    a = gg(a, b, c, d, words[i + 5], 5, -701558691);
    d = gg(d, a, b, c, words[i + 10], 9, 38016083);
    c = gg(c, d, a, b, words[i + 15], 14, -660478335);
    b = gg(b, c, d, a, words[i + 4], 20, -405537848);
    a = gg(a, b, c, d, words[i + 9], 5, 568446438);
    d = gg(d, a, b, c, words[i + 14], 9, -1019803690);
    c = gg(c, d, a, b, words[i + 3], 14, -187363961);
    b = gg(b, c, d, a, words[i + 8], 20, 1163531501);
    a = gg(a, b, c, d, words[i + 13], 5, -1444681467);
    d = gg(d, a, b, c, words[i + 2], 9, -51403784);
    c = gg(c, d, a, b, words[i + 7], 14, 1735328473);
    b = gg(b, c, d, a, words[i + 12], 20, -1926607734);

    a = hh(a, b, c, d, words[i + 5], 4, -378558);
    d = hh(d, a, b, c, words[i + 8], 11, -2022574463);
    c = hh(c, d, a, b, words[i + 11], 16, 1839030562);
    b = hh(b, c, d, a, words[i + 14], 23, -35309556);
    a = hh(a, b, c, d, words[i + 1], 4, -1530992060);
    d = hh(d, a, b, c, words[i + 4], 11, 1272893353);
    c = hh(c, d, a, b, words[i + 7], 16, -155497632);
    b = hh(b, c, d, a, words[i + 10], 23, -1094730640);
    a = hh(a, b, c, d, words[i + 13], 4, 681279174);
    d = hh(d, a, b, c, words[i + 0], 11, -358537222);
    c = hh(c, d, a, b, words[i + 3], 16, -722521979);
    b = hh(b, c, d, a, words[i + 6], 23, 76029189);
    a = hh(a, b, c, d, words[i + 9], 4, -640364487);
    d = hh(d, a, b, c, words[i + 12], 11, -421815835);
    c = hh(c, d, a, b, words[i + 15], 16, 530742520);
    b = hh(b, c, d, a, words[i + 2], 23, -995338651);

    a = ii(a, b, c, d, words[i + 0], 6, -198630844);
    d = ii(d, a, b, c, words[i + 7], 10, 1126891415);
    c = ii(c, d, a, b, words[i + 14], 15, -1416354905);
    b = ii(b, c, d, a, words[i + 5], 21, -57434055);
    a = ii(a, b, c, d, words[i + 12], 6, 1700485571);
    d = ii(d, a, b, c, words[i + 3], 10, -1894986606);
    c = ii(c, d, a, b, words[i + 10], 15, -1051523);
    b = ii(b, c, d, a, words[i + 1], 21, -2054922799);
    a = ii(a, b, c, d, words[i + 8], 6, 1873313359);
    d = ii(d, a, b, c, words[i + 15], 10, -30611744);
    c = ii(c, d, a, b, words[i + 6], 15, -1560198380);
    b = ii(b, c, d, a, words[i + 13], 21, 1309151649);
    a = ii(a, b, c, d, words[i + 4], 6, -145523070);
    d = ii(d, a, b, c, words[i + 11], 10, -1120210379);
    c = ii(c, d, a, b, words[i + 2], 15, 718787259);
    b = ii(b, c, d, a, words[i + 9], 21, -343485551);

    a = add32(a, oldA);
    b = add32(b, oldB);
    c = add32(c, oldC);
    d = add32(d, oldD);
  }

  const toHex = (num) => (num >>> 0).toString(16).padStart(8, '0');
  return `${toHex(a)}${toHex(b)}${toHex(c)}${toHex(d)}`;
}
export async function calculateHash(input, algorithm = 'SHA-256') {
  try {
    const bufferOrPromise = normalizeArrayBuffer(input);
    const buffer = bufferOrPromise && typeof bufferOrPromise.then === 'function'
      ? await bufferOrPromise
      : bufferOrPromise;
    if (!buffer || typeof crypto === 'undefined' || !crypto.subtle?.digest) return '';
    const hashBuffer = await crypto.subtle.digest(algorithm, buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch {
    return '';
  }
}
export async function calculateMD5(input) {
  try {
    const bufferOrPromise = normalizeArrayBuffer(input);
    const buffer = bufferOrPromise && typeof bufferOrPromise.then === 'function'
      ? await bufferOrPromise
      : bufferOrPromise;
    if (!buffer) return '';
    return md5ArrayBuffer(buffer);
  } catch {
    return '';
  }
}
export function calculateMargin(cost = 0, sellingPrice = 0) {
  const costValue = Number(cost) || 0;
  const priceValue = Number(sellingPrice) || 0;
  const profit = priceValue - costValue;
  return {
    profit,
    grossProfit: profit,
    profitMargin: priceValue > 0 ? (profit / priceValue) * 100 : 0,
    markup: costValue > 0 ? (profit / costValue) * 100 : 0,
  };
}
export function calculateMarkup(cost = 0, markupPercentage = 0) {
  const costValue = Number(cost) || 0;
  const markupValue = Number(markupPercentage) || 0;
  const sellingPrice = costValue * (1 + markupValue / 100);
  const profit = sellingPrice - costValue;
  return {
    sellingPrice,
    profit,
    profitMargin: sellingPrice > 0 ? (profit / sellingPrice) * 100 : 0,
  };
}
export function calculateProjectEstimation(tasks: any[] = []) {
  const estimates = (tasks || []).map((task) => {
    const optimistic = Number(task.optimistic) || 0;
    const mostLikely = Number(task.mostLikely) || 0;
    const pessimistic = Number(task.pessimistic) || 0;
    const expected = (optimistic + 4 * mostLikely + pessimistic) / 6;
    const standardDeviation = (pessimistic - optimistic) / 6;
    const variance = standardDeviation ** 2;
    return { ...task, expected, standardDeviation, variance };
  });
  const expected = estimates.reduce((sum, task) => sum + task.expected, 0);
  const variance = estimates.reduce((sum, task) => sum + task.variance, 0);
  const standardDeviation = Math.sqrt(variance);
  const round = (value) => Math.round(value * 10) / 10;
  return {
    tasks: estimates,
    expected: round(expected),
    standardDeviation: round(standardDeviation),
    variance: round(variance),
    confidence68: { min: round(Math.max(0, expected - standardDeviation)), max: round(expected + standardDeviation) },
    confidence95: { min: round(Math.max(0, expected - 2 * standardDeviation)), max: round(expected + 2 * standardDeviation) },
  };
}
export function calculateStats(items: unknown = [], duplicates: unknown[] = []) {
    return runtimeCalculateStats(items as never[] | string, duplicates as never[]);
  }
export function calculateSummary(resources = [], projects = []) {
    const totalAvailable = resources.reduce((sum, r) => sum + (r.availability || 0), 0);
    const totalAllocated = projects.reduce((sum, p) => sum + (p.assignedResources || []).reduce((s, ar) => s + (ar.hours || 0), 0), 0);
    const totalCost = projects.reduce((sum, p) => sum + (p.assignedResources || []).reduce((s, ar) => s + (ar.hours || 0) * (resources.find(r => r.id === ar.resourceId)?.cost || 0), 0), 0);
    const utilizationRate = totalAvailable ? Math.round((totalAllocated / totalAvailable) * 100) : 0;
    return { totalAvailable, totalAllocated, utilizationRate, totalCost, overallocated: [], underutilized: [] };
  }
export const cardPatterns = [];
export const characterCategories = {};
export function checkVulnerabilities(dependencies = {}) {
  const vulnerabilities = [];
  const entries = Object.entries(dependencies || {});

  for (const [name, version] of entries) {
    const advisory = LIMITED_VULNERABILITY_DB.find((item) => item.package === name);
    if (!advisory) continue;

    const comparison = compareVersions(String(version), advisory.fixedIn);
    if (comparison !== null && comparison < 0) {
      vulnerabilities.push({
        package: name,
        version: String(version),
        severity: advisory.severity,
        title: advisory.title,
        description: advisory.description,
        fixedIn: advisory.fixedIn,
        cve: advisory.cve,
      });
    }
  }

  return vulnerabilities.sort((a, b) => {
    const order = { critical: 0, high: 1, medium: 2, low: 3 };
    return order[a.severity] - order[b.severity] || a.package.localeCompare(b.package);
  });
}
export const chineseSentences = [];
export const chineseWords = [];
export const commonMimeTypes = [
  {
    "extension": "html",
    "type": "text/html"
  },
  {
    "extension": "css",
    "type": "text/css"
  },
  {
    "extension": "js",
    "type": "application/javascript"
  },
  {
    "extension": "json",
    "type": "application/json"
  },
  {
    "extension": "png",
    "type": "image/png"
  }
];
export const commonPasswords = [];
export const commonPorts = [
  {
    "port": 80,
    "service": "HTTP",
    "descKey": "portScanner.http"
  },
  {
    "port": 443,
    "service": "HTTPS",
    "descKey": "portScanner.https"
  },
  {
    "port": 22,
    "service": "SSH",
    "descKey": "portScanner.ssh"
  },
  {
    "port": 53,
    "service": "DNS",
    "descKey": "portScanner.dns"
  }
];
export const commonTypos = {};
export const conversions = {};
export function convertMarkdownToHtml(markdown = '', options = {}) {
  try {
    const rawHtml = marked.parse(String(markdown || ''), {
      breaks: Boolean(options.breaks),
      gfm: options.gfm !== false,
    });
    return sanitizeMarkdownHtml(String(rawHtml || ''));
  } catch {
    return sanitizeMarkdownHtml(String(markdown || ''));
  }
}
export function convertSqlToMongo(sql = '') {
  return buildMongoConversion(sql);
}
export function convertTime(time: any, fromTz: any, toTz: any, referenceDate?: any) {
  return runtimeConvertTime(time, fromTz, toTz, referenceDate);
}
export const countryFormats = [];
export const countryNames = {};
export function crc32(input = new Uint8Array(), table = buildCrc32Table()) {
  const bytes = input instanceof Uint8Array ? input : new TextEncoder().encode(String(input || ''));
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc = (crc >>> 8) ^ table[(crc ^ byte) & 0xff];
  }
  return (crc ^ 0xffffffff) >>> 0;
}
export const cssToTailwindMap = {};
export const cupSizes = [];
export function decodeBase58() { return null; }
export function decodeJwt(token) { return runtimeDecodeJwt(token); }
export const defaultColors = [];
export const defaultDirectives = [];
export const defaultParams = [];
export function detectFormat(value = '') {
  const text = String(value || '').trim();
  if (/^-?\d{13}$/.test(text)) return 'milliseconds';
  if (/^-?\d{10}$/.test(text)) return 'seconds';
  if (!Number.isNaN(new Date(text).getTime())) return 'iso8601';
  return 'unknown';
}
export function detectMemoryLeaks(code = '') {
  const source = String(code || '');
  const lines = source.split(/\r?\n/);
  const issues = [];
  const hasRemoveEventListener = /\bremoveEventListener\s*\(/.test(source);
  const hasClearInterval = /\bclearInterval\s*\(/.test(source);
  const hasClearTimeout = /\bclearTimeout\s*\(/.test(source);
  const hasRevokeObjectUrl = /\bURL\.revokeObjectURL\s*\(/.test(source);
  const hasObserverDisconnect = /\.disconnect\s*\(/.test(source);
  const hasWorkerTerminate = /\.terminate\s*\(/.test(source);
  const hasSocketClose = /\.close\s*\(/.test(source);
  const hasCleanupReturn = /return\s*(?:\(\s*)?[\w\s,{}()=]*=>/.test(source) || /\bonDestroy\s*\(/.test(source);

  const addIssue = (line, type, severity, description, fix) => {
    const duplicate = issues.some((issue) => issue.line === line && issue.type === type);
    if (duplicate) return;
    issues.push({
      type,
      severity,
      line,
      code: lines[line - 1]?.trim() || '',
      description,
      fix,
    });
  };

  lines.forEach((line, index) => {
    const lineNumber = index + 1;

    if (/\bsetInterval\s*\(/.test(line) && !hasClearInterval) {
      addIssue(
        lineNumber,
        'Uncleared interval',
        'high',
        'setInterval keeps callbacks and captured state alive until clearInterval is called.',
        'Store the interval id and clear it in the component or request lifecycle cleanup.'
      );
    }

    if (/\bsetTimeout\s*\(/.test(line) && /\bsetTimeout\s*\([^,]+,\s*[1-9]\d{4,}/.test(line) && !hasClearTimeout) {
      addIssue(
        lineNumber,
        'Long-lived timeout',
        'low',
        'Long timers can retain closures and stale component state after navigation.',
        'Store the timeout id and clear it when the owner is destroyed.'
      );
    }

    if (/\baddEventListener\s*\(/.test(line) && !hasRemoveEventListener && !hasCleanupReturn) {
      addIssue(
        lineNumber,
        'Event listener without cleanup',
        'medium',
        'Listeners registered on window, document, or shared nodes can retain callbacks after the UI is removed.',
        'Pair addEventListener with removeEventListener in the same lifecycle cleanup.'
      );
    }

    if (/\bURL\.createObjectURL\s*\(/.test(line) && !hasRevokeObjectUrl) {
      addIssue(
        lineNumber,
        'Object URL not revoked',
        'medium',
        'Blob object URLs hold memory until URL.revokeObjectURL releases them.',
        'Call URL.revokeObjectURL once the preview, download, or image load has completed.'
      );
    }

    if (/\bnew\s+(?:MutationObserver|ResizeObserver|IntersectionObserver)\s*\(/.test(line) && !hasObserverDisconnect) {
      addIssue(
        lineNumber,
        'Observer without disconnect',
        'medium',
        'DOM observers continue tracking targets and callbacks until disconnect is called.',
        'Keep the observer reference and call disconnect in cleanup.'
      );
    }

    if (/\bnew\s+Worker\s*\(/.test(line) && !hasWorkerTerminate) {
      addIssue(
        lineNumber,
        'Worker without terminate',
        'medium',
        'Web Workers can keep memory, message ports, and CPU resources alive beyond the owning view.',
        'Call worker.terminate when the work is complete or the owner is destroyed.'
      );
    }

    if (/\bnew\s+WebSocket\s*\(/.test(line) && !hasSocketClose) {
      addIssue(
        lineNumber,
        'WebSocket without close',
        'medium',
        'Open sockets retain event handlers and network resources until explicitly closed.',
        'Close the socket in cleanup and clear message handlers if they capture large state.'
      );
    }

    if (/\.(?:push|set)\s*\(/.test(line) && /\b(cache|registry|listeners|subscribers|items)\b/i.test(line) && !/\b(?:delete|clear|splice|shift|pop)\s*\(/.test(source)) {
      addIssue(
        lineNumber,
        'Unbounded collection growth',
        'low',
        'Long-lived collections that only grow can retain user data and computed objects indefinitely.',
        'Add eviction, a maximum size, or a matching delete/clear path.'
      );
    }
  });

  const penalty = issues.reduce((total, issue) => {
    if (issue.severity === 'high') return total + 30;
    if (issue.severity === 'medium') return total + 18;
    return total + 8;
  }, 0);

  return {
    issues,
    score: Math.max(0, 100 - penalty),
  };
}
export const diceConfig = {};
export const dictionary = [];
export const disposableDomains = [];
export const emissionFactors = [];
export const emojiData = [];
export function encodeBase58() { return null; }
export const euCupSizes = {};
export function extractHeadings(content = '') {
  const headings = [];
  const lines = String(content || '').split(/\r?\n/);

  lines.forEach((line, index) => {
    const markdown = line.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/);
    if (markdown) {
      const text = stripHtmlTags(markdown[2]);
      headings.push({ level: markdown[1].length, text, id: slugifyHeading(text), line: index + 1 });
    }
  });

  const html = String(content || '');
  for (const match of html.matchAll(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi)) {
    const text = stripHtmlTags(match[2]);
    headings.push({ level: Number(match[1]), text, id: slugifyHeading(text), line: html.slice(0, match.index).split(/\r?\n/).length });
  }

  return headings.sort((a, b) => a.line - b.line || a.level - b.level);
}
export const extractPatterns = {};
export function extractVariables(template = '') {
    const vars = new Set();
    const re = /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g;
    let m;
    while ((m = re.exec(template))) vars.add(m[1]);
    return Array.from(vars);
  }
export function findAvailableSlots(peopleOrSlots: any = [], workStart: any = '09:00', workEnd: any = '17:00', minimumDuration: any = 30) {
  return runtimeFindAvailableSlots(peopleOrSlots, workStart, workEnd, minimumDuration);
}
export function mergeBusySlots(slots: any = []) { return runtimeMergeBusySlots(slots); }
export function findClosestColor(color = '') {
  const rgb = parseHexColor(color);
  if (!rgb) return [];

  return NAMED_COLORS
    .map((candidate) => {
      const candidateRgb = parseHexColor(candidate.hex);
      const distance = candidateRgb
        ? Math.sqrt(
            (rgb.r - candidateRgb.r) ** 2 +
            (rgb.g - candidateRgb.g) ** 2 +
            (rgb.b - candidateRgb.b) ** 2
          )
        : Number.POSITIVE_INFINITY;
      return { ...candidate, distance };
    })
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 5);
}
export function findDuplicates(code = '', minLines = 3) {
  const lines = String(code || '').split(/\r?\n/);
  const windowSize = Math.max(2, Math.min(20, Math.trunc(Number(minLines) || 3)));
  const windows = new Map();

  for (let index = 0; index <= lines.length - windowSize; index += 1) {
    const block = lines.slice(index, index + windowSize);
    if (block.every((line) => !line.trim())) continue;
    const normalized = block.map((line) => line.trim()).join('\n');
    if (!normalized) continue;
    const occurrences = windows.get(normalized) || [];
    occurrences.push({ start: index + 1, end: index + windowSize });
    windows.set(normalized, occurrences);
  }

  return [...windows.entries()]
    .filter(([, occurrences]) => occurrences.length > 1)
    .map(([normalized, occurrences]) => ({
      lines: normalized.split('\n'),
      occurrences,
      similarity: 100,
    }))
    .sort((a, b) => b.occurrences.length - a.occurrences.length || a.occurrences[0].start - b.occurrences[0].start);
}
export function findUnusedImports(code = '') {
  const lines = String(code || '').split(/\r?\n/);
  const imports = lines
    .map((line, index) => parseImportStatement(line, index + 1))
    .filter(Boolean);
  const body = stripImportLines(lines, new Set(imports.map((item) => item.line)));

  return imports.map((item) => {
    const used = [];
    const unused = [];
    for (const name of item.imports) {
      const pattern = new RegExp(`\\b${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`);
      if (pattern.test(body)) used.push(name);
      else unused.push(name);
    }
    return { ...item, used, unused };
  });
}
export const flipMap = runtimeFlipMap;
export const fontMappings = {};
export const fontStyles = [];
export function formatCitation(citation = {}, style = 'apa') {
  const authors = safeText(citation.authors);
  const title = safeText(citation.title);
  const year = safeText(citation.year);
  const publisher = safeText(citation.publisher);
  const journal = safeText(citation.journal);
  const volume = safeText(citation.volume);
  const issue = safeText(citation.issue);
  const pages = safeText(citation.pages);
  const url = normalizeHttpUrl(citation.url);
  const accessDate = safeText(citation.accessDate);
  const doi = safeText(citation.doi);
  const sourceTitle = title ? `*${title}*` : 'Untitled';
  const authorPart = authors || 'Unknown author';
  const yearPart = year || 'n.d.';

  switch (String(style).toLowerCase()) {
    case 'mla':
      return [
        `${authorPart}.`,
        `"${title || 'Untitled'}."`,
        journal || publisher ? `${journal || publisher},` : '',
        year ? `${year}.` : '',
        url ? `Web. ${url}.` : '',
      ].filter(Boolean).join(' ');
    case 'chicago':
      return [
        `${authorPart}.`,
        `${sourceTitle}.`,
        publisher || journal ? `${publisher || journal},` : '',
        year ? `${year}.` : '',
        url || doi ? url || `doi:${doi}.` : '',
      ].filter(Boolean).join(' ');
    case 'harvard':
      return [
        `${authorPart} (${yearPart})`,
        sourceTitle,
        publisher || journal ? `${publisher || journal}.` : '',
        url ? `Available at: ${url}${accessDate ? ` (Accessed: ${accessDate})` : ''}.` : '',
      ].filter(Boolean).join(' ');
    case 'ieee':
      return [
        `${authorPart},`,
        `"${title || 'Untitled'},"`,
        journal || publisher ? `${journal || publisher},` : '',
        volume ? `vol. ${volume},` : '',
        issue ? `no. ${issue},` : '',
        pages ? `pp. ${pages},` : '',
        year ? `${year}.` : '',
        doi ? `doi: ${doi}.` : url,
      ].filter(Boolean).join(' ');
    case 'apa':
    default:
      return [
        `${authorPart}.`,
        `(${yearPart}).`,
        `${sourceTitle}.`,
        journal || publisher ? `${journal || publisher}.` : '',
        volume ? `${volume}${issue ? `(${issue})` : ''}${pages ? `, ${pages}` : ''}.` : '',
        doi ? `https://doi.org/${doi.replace(/^https?:\/\/doi\.org\//i, '')}` : url,
      ].filter(Boolean).join(' ');
  }
}
export function formatDocument(input = '', options = {}) {
  const settings = {
    trimLines: true,
    removeExtraSpaces: true,
    removeBlankLines: false,
    normalizeLineBreaks: true,
    capitalizeFirst: false,
    fixPunctuation: false,
    lineWidth: 0,
    indentStyle: 'none',
    indentSize: 4,
    ...options,
  };

  let text = String(input ?? '');
  if (settings.normalizeLineBreaks) {
    text = text.replace(/\r\n?/g, '\n');
  }

  let lines = text.split('\n').map((line) => {
    let current = line;
    if (settings.trimLines) current = current.trim();
    if (settings.removeExtraSpaces) current = current.replace(/[ \t\f\v]+/g, ' ');
    if (settings.fixPunctuation) current = normalizeDocumentPunctuation(current);
    return current;
  });

  if (settings.removeBlankLines) {
    lines = lines.filter((line) => line.trim() !== '');
  }

  text = lines.join('\n');
  if (settings.capitalizeFirst) {
    text = capitalizeDocumentSentences(text);
  }

  lines = text.split('\n').flatMap((line) => wrapDocumentLine(line, settings.lineWidth));

  if (settings.indentStyle === 'spaces' || settings.indentStyle === 'tabs') {
    const count = Math.max(0, Math.min(16, Math.trunc(Number(settings.indentSize) || 0)));
    const indent = settings.indentStyle === 'tabs' ? '\t'.repeat(count || 1) : ' '.repeat(count || 2);
    lines = lines.map((line) => (line.trim() ? `${indent}${line}` : line));
  }

  return lines.join('\n');
}
export function formatHour(hour: any) { return runtimeFormatHour(hour); }
export function formatJson(value, indentSize = 2) { return runtimeFormatJson(value, indentSize); }
export function formatMac(bytes: number[] = [], options: { separator?: ':' | '-' | ''; uppercase?: boolean } = {}) {
  const separator = options.separator === '-' || options.separator === '' ? options.separator : ':';
  const parts = Array.from({ length: 6 }, (_, index) => Number(bytes[index] ?? 0) & 0xff)
    .map((byte) => byte.toString(16).padStart(2, '0'));
  const text = parts.join(separator);
  return options.uppercase === false ? text.toLowerCase() : text.toUpperCase();
}
export function formatMinutesToTime(value: any = 0) { return runtimeFormatMinutesToTime(value); }
export function formatSql(sql = '') { return runtimeFormatSql(sql); }
export function formatValue(value, dialect = 'mysql') {
  if (value === null || value === undefined) return 'NULL';
  if (typeof value === 'number') return Number.isFinite(value) ? String(value) : 'NULL';
  if (typeof value === 'boolean') return dialect === 'sqlite' ? (value ? '1' : '0') : value ? 'TRUE' : 'FALSE';
  if (value instanceof Date) return `'${value.toISOString().replace(/'/g, "''")}'`;
  if (typeof value === 'object') return `'${JSON.stringify(value).replace(/'/g, "''")}'`;
  return `'${String(value).replace(/'/g, "''")}'`;
}
export const freeProviders = [];
export function fromSeconds(totalSeconds = 0) {
  const total = Math.trunc(Number(totalSeconds) || 0);
  const negative = total < 0;
  let remaining = Math.abs(total);
  const hours = Math.floor(remaining / 3600);
  remaining %= 3600;
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  return { hours, minutes, seconds, negative };
}
export function generateAgenda() { return ''; }
export function generateBackupScript(config = {}) {
  const database = ['postgresql', 'mysql', 'mongodb'].includes(config.database) ? config.database : 'postgresql';
  const host = shellQuote(config.host || 'localhost');
  const dbName = shellQuote(config.dbName || 'mydb');
  const username = shellQuote(config.username || 'dbuser');
  const outputPath = shellQuote(config.outputPath || '/var/backups/database');
  const retention = Math.max(1, Math.trunc(Number(config.retention) || 7));
  const compression = Boolean(config.compression);

  const extension = database === 'mongodb' ? 'archive' : 'sql';
  const dumpCommand =
    database === 'postgresql'
      ? `pg_dump -h "$DB_HOST" -U "$DB_USER" "$DB_NAME" > "$BACKUP_FILE"`
      : database === 'mysql'
        ? `mysqldump -h "$DB_HOST" -u "$DB_USER" "$DB_NAME" > "$BACKUP_FILE"`
        : `mongodump --host "$DB_HOST" --db "$DB_NAME" --archive="$BACKUP_FILE"`;

  const compressionBlock = compression
    ? `
gzip -f "$BACKUP_FILE"
BACKUP_FILE="$BACKUP_FILE.gz"`
    : '';

  return `#!/usr/bin/env bash
set -euo pipefail

DB_TYPE=${shellQuote(database)}
DB_HOST=${host}
DB_NAME=${dbName}
DB_USER=${username}
BACKUP_DIR=${outputPath}
RETENTION_DAYS=${retention}

mkdir -p "$BACKUP_DIR"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP_FILE="$BACKUP_DIR/$DB_NAME-$TIMESTAMP.${extension}"

echo "Starting $DB_TYPE backup for $DB_NAME"
${dumpCommand}${compressionBlock}
find "$BACKUP_DIR" -type f -name "$DB_NAME-*" -mtime +"$RETENTION_DAYS" -delete
echo "Backup written to $BACKUP_FILE"`;
}
export function generateChangelog(releases: any[] = [], format = 'keepachangelog') {
  const groups = {
    added: 'Added',
    changed: 'Changed',
    deprecated: 'Deprecated',
    removed: 'Removed',
    fixed: 'Fixed',
    security: 'Security',
  };

  const renderEntry = (entry) => {
    const refs = [entry.issue, entry.pr].filter(Boolean).map((ref) => `(${ref})`).join(' ');
    return `- ${entry.description || 'Describe change'}${refs ? ` ${refs}` : ''}`;
  };

  if (format === 'simple') {
    return releases.map((release) => [
      `${release.version} - ${release.date}`,
      ...(release.entries || []).map(renderEntry),
    ].join('\n')).join('\n\n');
  }

  const body = releases.map((release) => {
    const entries = release.entries || [];
    const sections = Object.entries(groups)
      .map(([type, label]) => {
        const typedEntries = entries.filter((entry) => entry.type === type);
        return typedEntries.length ? `### ${label}\n${typedEntries.map(renderEntry).join('\n')}` : '';
      })
      .filter(Boolean)
      .join('\n\n');
    return `## [${release.version}] - ${release.date}\n${sections || '- No changes recorded.'}`;
  }).join('\n\n');

  if (format === 'conventional') return body;
  return `# Changelog\n\nAll notable changes to this project will be documented in this file.\n\n${body}`;
}
export function generateCleanedCode(code = '', imports = findUnusedImports(code)) {
  const lines = String(code || '').split(/\r?\n/);
  const importByLine = new Map((imports || []).map((item) => [item.line, item]));
  const result = [];

  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    const info = importByLine.get(lineNumber);
    if (!info) {
      result.push(line);
      return;
    }

    const usedNames = new Set(info.used || []);
    const rebuilt = rebuildImportStatement(info, usedNames);
    if (rebuilt) result.push(rebuilt);
  });

  return result.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}
export function generateCodeSnippet() { return '/* connection snippet */'; }
export function generateCommands() { return ''; }
export function generateCommitMessage(config = {}) {
  const type = safeText(config.type || 'feat');
  const scope = safeText(config.scope);
  const subject = safeText(config.subject);
  if (!type || !subject) return '';

  const header = `${type}${scope ? `(${scope})` : ''}${config.breaking ? '!' : ''}: ${subject}`;
  const sections = [header];
  if (safeText(config.body)) sections.push('', safeText(config.body));
  if (config.breaking && safeText(config.breakingDescription)) sections.push('', `BREAKING CHANGE: ${safeText(config.breakingDescription)}`);
  if (safeText(config.issues)) sections.push('', safeText(config.issues).match(/^(refs|closes|fixes)\b/i) ? safeText(config.issues) : `Refs: ${safeText(config.issues)}`);
  return sections.join('\n');
}
export function generateConnectionString() { return 'postgres://user:pass@localhost:5432/db'; }
export function generateCrontab(config = {}) {
  const schedule = getBackupCronSchedule(config.schedule || 'daily');
  const outputPath = String(config.outputPath || '/var/backups/database').replace(/\/+$/, '') || '/var/backups/database';
  const scriptPath = `${outputPath}/backup-${safeShellFileName(config.dbName || 'database')}.sh`;
  return `${schedule} ${shellQuote(scriptPath)} >> ${shellQuote(`${scriptPath}.log`)} 2>&1`;
}
export function generateDataclass(object = {}, className = 'Generated', options = {}) {
  const safeName = safeClassName(className);
  const nested = [];

  for (const [fieldName, value] of collectNestedObjects(object)) {
    const nestedValue = isPlainObject(value) ? value : firstArrayValue(value);
    const result = generateDataclass(nestedValue, safeClassName(fieldName), options);
    nested.push(...result.nested, result.main);
  }

  const entries = Object.entries(object || {});
  const fields = entries.map(([fieldName, value]) => {
    const name = toSnakeCase(fieldName);
    const type = inferPythonType(value, fieldName, options);
    return `    ${name}: ${type}`;
  });

  let main;
  if (options.usePydantic) {
    main = [`class ${safeName}(BaseModel):`, ...(fields.length ? fields : ['    pass'])].join('\n');
  } else if (options.useTypedDict) {
    main = [`class ${safeName}(TypedDict):`, ...(fields.length ? fields : ['    pass'])].join('\n');
  } else if (options.useDataclass !== false) {
    main = ['@dataclass', `class ${safeName}:`, ...(fields.length ? fields : ['    pass'])].join('\n');
  } else {
    const args = entries.map(([fieldName]) => `${toSnakeCase(fieldName)}=None`).join(', ');
    const assignments = entries.map(([fieldName]) => `        self.${toSnakeCase(fieldName)} = ${toSnakeCase(fieldName)}`);
    main = [`class ${safeName}:`, `    def __init__(self${args ? `, ${args}` : ''}):`, ...(assignments.length ? assignments : ['        pass'])].join('\n');
  }

  return { main, nested };
}
export function generateDeployment(config = {}) {
  const name = safeK8sName(config.name);
  const namespace = safeK8sName(config.namespace || 'default');
  const env = (config.envVars || [])
    .filter((item) => item.key)
    .map((item) => ({ name: item.key, value: String(item.value ?? '') }));

  return dumpYamlDocument({
    apiVersion: 'apps/v1',
    kind: 'Deployment',
    metadata: { name, namespace },
    spec: {
      replicas: Math.max(1, Number(config.replicas) || 1),
      selector: { matchLabels: { app: name } },
      template: {
        metadata: { labels: { app: name } },
        spec: {
          containers: [{
            name,
            image: config.image || 'nginx:latest',
            ports: [{ containerPort: Number(config.targetPort || config.port || 80) }],
            ...(env.length ? { env } : {}),
            resources: {
              requests: {
                cpu: config.resources?.cpuRequest || '100m',
                memory: config.resources?.memoryRequest || '128Mi',
              },
              limits: {
                cpu: config.resources?.cpuLimit || '500m',
                memory: config.resources?.memoryLimit || '512Mi',
              },
            },
          }],
        },
      },
    },
  });
}
export function generateDockerCompose(services: any[] = []) {
  const compose = { services: {}, volumes: {} };

  for (const service of services || []) {
    const name = dockerServiceName(service.name);
    if (!name || !service.image) continue;
    const ports = filterEmptyArray(service.ports);
    const volumes = filterEmptyArray(service.volumes);
    const dependsOn = filterEmptyArray(service.dependsOn);
    const definition = {
      image: service.image,
      ...(ports.length ? { ports } : {}),
      ...(Object.keys(service.environment || {}).length ? { environment: service.environment } : {}),
      ...(volumes.length ? { volumes } : {}),
      ...(dependsOn.length ? { depends_on: dependsOn } : {}),
      ...(service.restart ? { restart: service.restart } : {}),
      ...(service.command ? { command: service.command } : {}),
    };
    compose.services[name] = definition;

    for (const volume of volumes) {
      const source = volume.split(':')[0];
      if (source && !source.startsWith('.') && !source.startsWith('/') && !source.startsWith('~')) {
        compose.volumes[source] = {};
      }
    }
  }

  if (Object.keys(compose.volumes).length === 0) delete compose.volumes;
  return dumpYamlDocument(compose);
}
export function generateExampleFile(vars: any[] = []) {
  return (vars || [])
    .filter((item) => item.key)
    .map((item) => {
      const comments = [
        item.description ? `# ${item.description}` : '',
        item.required ? '# Required' : '# Optional',
      ].filter(Boolean).join('\n');
      return `${comments}\n${item.key}=`;
    })
    .join('\n\n');
}
export function generateFullSchema(value = {}, options = {}) {
  const schema = generateJsonSchemaForValue(value, options);
  return {
    $schema: options.draft === 'draft-2020-12'
      ? 'https://json-schema.org/draft/2020-12/schema'
      : 'http://json-schema.org/draft-07/schema#',
    ...schema,
  };
}
export function generateGo(input) {
  return isOpenApiLike(input) ? renderGoOpenApiClient(input) : runtimeGenerateGo(input);
}
export function generateGraphQLSchema(value = {}, typeName = 'Root') {
  const seen = new Set();
  const types = [];
  let usesDateTime = false;

  const visit = (object, name) => {
    const safeName = safeClassName(name);
    if (seen.has(safeName)) return;
    seen.add(safeName);

    for (const [fieldName, fieldValue] of collectNestedObjects(object)) {
      const nestedValue = isPlainObject(fieldValue) ? fieldValue : firstArrayValue(fieldValue);
      visit(nestedValue, safeClassName(fieldName));
    }

    const fields = Object.entries(object || {}).map(([fieldName, fieldValue]) => {
      const type = graphQlTypeFor(fieldValue, fieldName);
      if (type === 'DateTime') usesDateTime = true;
      return `  ${safeCodeIdentifier(fieldName)}: ${type}`;
    });
    types.push([`type ${safeName} {`, ...(fields.length ? fields : ['  value: String']), '}'].join('\n'));
  };

  visit(Array.isArray(value) ? firstArrayValue(value) || {} : value, typeName);
  return [usesDateTime ? 'scalar DateTime\n' : '', ...types].filter(Boolean).join('\n\n');
}
export function generateHPA(config = {}) {
  const name = safeK8sName(config.name);
  return dumpYamlDocument({
    apiVersion: 'autoscaling/v2',
    kind: 'HorizontalPodAutoscaler',
    metadata: { name, namespace: safeK8sName(config.namespace || 'default') },
    spec: {
      scaleTargetRef: { apiVersion: 'apps/v1', kind: 'Deployment', name },
      minReplicas: Math.max(1, Number(config.hpaMinReplicas) || 1),
      maxReplicas: Math.max(1, Number(config.hpaMaxReplicas) || 3),
      metrics: [{
        type: 'Resource',
        resource: {
          name: 'cpu',
          target: { type: 'Utilization', averageUtilization: Number(config.hpaTargetCPU) || 80 },
        },
      }],
    },
  });
}
export function generateHashtags(topic = '', platform = 'instagram', count = 20) {
  const platformLimits = { instagram: 30, twitter: 10, tiktok: 5, linkedin: 5, all: 30 };
  const limit = Math.max(1, Math.min(platformLimits[platform] || 30, Number(count) || 20));
  const words = wordsFromIdentifier(topic).map((word) => word.toLowerCase()).filter((word) => word.length > 1);
  const compact = words.join('');
  const title = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join('');
  const base = [
    compact,
    title,
    ...words,
    `${compact}tips`,
    `${compact}ideas`,
    `${compact}community`,
    `${compact}daily`,
    `${compact}life`,
  ].filter(Boolean);
  const popularSuffixes = platform === 'linkedin'
    ? ['business', 'leadership', 'innovation', 'productivity', 'careers']
    : ['instagood', 'viral', 'trending', 'explore', 'love', 'photooftheday', 'reels'];
  const nicheSuffixes = ['guide', 'workflow', 'inspiration', 'strategy', 'resources', 'checklist', 'behindthescenes'];
  const popular = popularSuffixes.map((suffix) => `#${suffix}`);
  const niche = nicheSuffixes.map((suffix) => `#${compact}${suffix}`).filter((tag) => tag.length > 1);
  const hashtags = [...new Set([...base.map((tag) => `#${tag.replace(/^#/, '')}`), ...popular, ...niche])]
    .map((tag) => tag.replace(/[^#A-Za-z0-9_]/g, ''))
    .filter((tag) => tag.length > 1)
    .slice(0, limit);

  return {
    hashtags,
    popular: hashtags.filter((tag) => popular.includes(tag)),
    niche: hashtags.filter((tag) => niche.includes(tag)),
  };
}
export function generateHtmlToc(entries: any[] = [], options = {}) {
  return renderHtmlTocEntries(entries, options, options.style === 'numbered');
}
export function generateImports(options = {}, hasNull = false, hasNested = false) {
  const lines = [];
  if (options.useDataclass !== false && !options.usePydantic && !options.useTypedDict) lines.push('from dataclasses import dataclass');
  if (options.usePydantic) lines.push('from pydantic import BaseModel');

  const typing = new Set(['Any', 'List']);
  if (options.useOptional || hasNull) typing.add('Optional');
  if (options.useTypedDict) typing.add('TypedDict');
  if (hasNested) typing.add('ForwardRef');
  lines.push(`from typing import ${[...typing].sort().join(', ')}`);
  return `${lines.join('\n')}\n\n`;
}
export function generateIngress(config = {}) {
  const name = safeK8sName(config.name);
  return dumpYamlDocument({
    apiVersion: 'networking.k8s.io/v1',
    kind: 'Ingress',
    metadata: { name, namespace: safeK8sName(config.namespace || 'default') },
    spec: {
      rules: [{
        host: config.ingressHost || `${name}.example.com`,
        http: {
          paths: [{
            path: '/',
            pathType: 'Prefix',
            backend: {
              service: {
                name,
                port: { number: Number(config.port) || 80 },
              },
            },
          }],
        },
      }],
    },
  });
}
export function generateJava(input) { return runtimeGenerateJava(input); }
export function generateJavaClass(object = {}, className = 'Generated', options = {}) {
  const safeName = safeClassName(className);
  const nested = [];
  for (const [fieldName, value] of collectNestedObjects(object)) {
    const nestedValue = isPlainObject(value) ? value : firstArrayValue(value);
    const result = generateJavaClass(nestedValue, safeClassName(fieldName), { ...options, packageName: '' });
    nested.push(result.main, ...result.nested);
  }

  const packageLine = options.packageName ? `package ${options.packageName};\n\n` : '';
  const imports = 'import java.util.List;\n\n';
  const annotations = options.useLombok
    ? ['@lombok.Data', options.useBuilder ? '@lombok.Builder' : ''].filter(Boolean).join('\n') + '\n'
    : '';
  const fields = Object.entries(object || {}).map(([fieldName, value]) => `    private ${inferJavaType(value, fieldName)} ${safeCodeIdentifier(fieldName)};`);
  const methods = !options.useLombok && options.useGettersSetters !== false
    ? Object.entries(object || {}).flatMap(([fieldName, value]) => {
      const name = safeCodeIdentifier(fieldName);
      const type = inferJavaType(value, fieldName);
      const cap = name.charAt(0).toUpperCase() + name.slice(1);
      return [
        `    public ${type} get${cap}() { return ${name}; }`,
        `    public void set${cap}(${type} ${name}) { this.${name} = ${name}; }`,
      ];
    })
    : [];

  const main = [
    packageLine + imports + annotations + `public class ${safeName} {`,
    ...(fields.length ? fields : ['    // Add fields here']),
    ...(methods.length ? ['', ...methods] : []),
    '}',
  ].join('\n');

  return { main, nested };
}
export function generateJavaScript(input) { return runtimeGenerateJavaScript(input); }
export function generateKotlinClass(object = {}, className = 'Generated', options = {}) {
  const safeName = safeClassName(className);
  const nested = [];
  for (const [fieldName, value] of collectNestedObjects(object)) {
    const nestedValue = isPlainObject(value) ? value : firstArrayValue(value);
    const result = generateKotlinClass(nestedValue, safeClassName(fieldName), { ...options, packageName: '' });
    nested.push(result.main, ...result.nested);
  }

  const packageLine = options.packageName ? `package ${options.packageName}\n\n` : '';
  const imports = [
    options.useMoshi ? 'import com.squareup.moshi.JsonClass' : '',
    options.useGson ? 'import com.google.gson.annotations.SerializedName' : '',
    options.useKotlinx ? 'import kotlinx.serialization.Serializable' : '',
  ].filter(Boolean);
  const annotations = [
    options.useMoshi ? '@JsonClass(generateAdapter = true)' : '',
    options.useKotlinx ? '@Serializable' : '',
  ].filter(Boolean);
  const fields = Object.entries(object || {}).map(([fieldName, value]) => {
    const name = safeCodeIdentifier(fieldName);
    const annotation = options.useGson && name !== fieldName ? `    @SerializedName("${fieldName}")\n` : '';
    return `${annotation}    val ${name}: ${inferKotlinType(value, fieldName, options.useNullable !== false)} = null`;
  });
  const classPrefix = options.useDataClass === false ? 'class' : 'data class';
  const body = fields.length ? fields.join(',\n') : '    val value: String? = null';
  const main = `${packageLine}${imports.length ? `${imports.join('\n')}\n\n` : ''}${annotations.length ? `${annotations.join('\n')}\n` : ''}${classPrefix} ${safeName}(\n${body}\n)`;

  return { main, nested };
}
export function generateMinutes(data = {}, format = 'markdown') {
  const list = (value) => String(value || '').split(/\r?\n|,/).map((item) => item.trim()).filter(Boolean);
  const actionItems = data.actionItems || [];

  if (format === 'html') {
    return `
<h1>${safeHtmlText(data.title || 'Meeting Minutes')}</h1>
<p><strong>Date:</strong> ${safeHtmlText(data.date || '')} ${safeHtmlText(data.time || '')}</p>
<p><strong>Location:</strong> ${safeHtmlText(data.location || '')}</p>
<h2>Attendees</h2>
<ul>${list(data.attendees).map((item) => `<li>${safeHtmlText(item)}</li>`).join('')}</ul>
${data.absentees ? `<h2>Absentees</h2><ul>${list(data.absentees).map((item) => `<li>${safeHtmlText(item)}</li>`).join('')}</ul>` : ''}
<h2>Agenda</h2>
<ul>${list(data.agenda).map((item) => `<li>${safeHtmlText(item.replace(/^\d+\.\s*/, ''))}</li>`).join('')}</ul>
<h2>Discussion</h2>
<p>${safeHtmlText(data.discussion || 'No discussion notes recorded.')}</p>
<h2>Decisions</h2>
<p>${safeHtmlText(data.decisions || 'No decisions recorded.')}</p>
<h2>Action Items</h2>
<ul>${actionItems.map((item) => `<li>${safeHtmlText(item.task || 'Action item')} - ${safeHtmlText(item.assignee || 'Unassigned')}${item.dueDate ? `, due ${safeHtmlText(item.dueDate)}` : ''}</li>`).join('')}</ul>
${data.nextMeeting ? `<h2>Next Meeting</h2><p>${safeHtmlText(data.nextMeeting)}</p>` : ''}`.trim();
  }

  const lines = [
    format === 'markdown' ? `# ${data.title || 'Meeting Minutes'}` : data.title || 'Meeting Minutes',
    '',
    `Date: ${data.date || ''}${data.time ? `, ${data.time}` : ''}`,
    `Location: ${data.location || ''}`,
    '',
    format === 'markdown' ? '## Attendees' : 'Attendees',
    ...list(data.attendees).map((item) => `- ${item}`),
  ];
  if (data.absentees) lines.push('', format === 'markdown' ? '## Absentees' : 'Absentees', ...list(data.absentees).map((item) => `- ${item}`));
  lines.push('', format === 'markdown' ? '## Agenda' : 'Agenda', ...list(data.agenda).map((item) => `- ${item.replace(/^\d+\.\s*/, '')}`));
  lines.push('', format === 'markdown' ? '## Discussion' : 'Discussion', data.discussion || 'No discussion notes recorded.');
  lines.push('', format === 'markdown' ? '## Decisions' : 'Decisions', data.decisions || 'No decisions recorded.');
  lines.push('', format === 'markdown' ? '## Action Items' : 'Action Items');
  if (actionItems.length) {
    lines.push(...actionItems.map((item) => `- ${item.task || 'Action item'} (${item.assignee || 'Unassigned'}${item.dueDate ? `, due ${item.dueDate}` : ''})`));
  } else {
    lines.push('- No action items recorded.');
  }
  if (data.nextMeeting) lines.push('', format === 'markdown' ? '## Next Meeting' : 'Next Meeting', data.nextMeeting);
  return lines.join('\n').trim();
}
export function generateNamespace(namespace = 'default') {
  return dumpYamlDocument({
    apiVersion: 'v1',
    kind: 'Namespace',
    metadata: { name: safeK8sName(namespace) },
  });
}
export function generateOutline(tree: any[] = [], options = {}) {
  if (options.format === 'html') {
    return `<ul>\n${renderOutlineItems(tree, options, 1)}\n</ul>`;
  }
  return renderOutlineItems(tree, options);
}
export function generateOutput(vars: any[] = [], format = 'env') {
  const entries = (vars || []).filter((item) => item.key);
  const object = Object.fromEntries(entries.map((item) => [item.key, item.value ?? '']));

  if (format === 'json') return JSON.stringify(object, null, 2);
  if (format === 'yaml') return dumpYamlDocument(object);
  if (format === 'docker') {
    return entries.map((item) => `      - ${item.key}=${item.value ?? ''}`).join('\n');
  }
  if (format === 'shell') {
    return entries.map((item) => `export ${item.key}=${quoteEnvValue(item.value)}`).join('\n');
  }
  return entries.map((item) => {
    const comment = item.description ? `# ${item.description}\n` : '';
    return `${comment}${item.key}=${quoteEnvValue(item.value)}`;
  }).join('\n');
}
export function generateParagraph() { return ''; }
export function generatePhp(input) { return runtimeGeneratePhp(input); }
export function generatePrisma(tableName = 'items', columns: any[] = []) {
  const modelName = safeClassName(tableName.replace(/s$/, ''));
  const fields = (columns || []).filter((column) => column.name).map((column) => {
    const rawType = String(column.type || '').toLowerCase();
    const type =
      rawType.includes('int') || rawType.includes('serial') ? 'Int' :
        rawType.includes('bool') ? 'Boolean' :
          rawType.includes('time') || rawType.includes('date') ? 'DateTime' :
            rawType.includes('json') ? 'Json' :
              rawType.includes('real') || rawType.includes('double') || rawType.includes('float') ? 'Float' :
                'String';
    const attrs = [];
    if (column.primaryKey) attrs.push('@id');
    if (column.primaryKey && /serial|auto_increment/i.test(column.type)) attrs.push('@default(autoincrement())');
    if (column.unique) attrs.push('@unique');
    if (column.defaultValue && !column.primaryKey) attrs.push(`@default(${column.defaultValue})`);
    return `  ${safeCodeIdentifier(column.name)} ${type}${column.nullable ? '?' : ''}${attrs.length ? ` ${attrs.join(' ')}` : ''}`;
  });
  return [`model ${modelName} {`, ...fields, '}'].join('\n');
}
export function generateProtoFile(message, packageName = 'example', syntax = 'proto3') {
  const renderMessage = (protoMessage, indent = '') => {
    const nested = protoMessage.nestedMessages.map((nestedMessage) => renderMessage(nestedMessage, `${indent}  `));
    const fields = protoMessage.fields.map((field) => {
      const repeated = field.repeated ? 'repeated ' : '';
      return `${indent}  ${repeated}${field.type} ${field.name} = ${field.number};`;
    });
    return [
      `${indent}message ${protoMessage.name} {`,
      ...nested,
      ...fields,
      `${indent}}`,
    ].join('\n');
  };

  return [
    `syntax = "${syntax === 'proto2' ? 'proto2' : 'proto3'}";`,
    packageName ? `package ${String(packageName).replace(/[^A-Za-z0-9_.]/g, '') || 'example'};` : '',
    '',
    renderMessage(message),
  ].filter((line) => line !== '').join('\n');
}
export function generatePython(input) {
  return isOpenApiLike(input) ? renderPythonOpenApiClient(input) : runtimeGeneratePython(input);
}
export function generateRawSQL(tableName = 'items', columns: any[] = [], database = 'postgresql', action = 'create') {
  const quote = (name) => quoteIdentifier(name, database === 'postgresql' ? 'postgresql' : database === 'sqlite' ? 'sqlite' : 'mysql');
  const columnSql = (column) => [
    quote(column.name),
    column.type,
    column.primaryKey ? 'PRIMARY KEY' : '',
    column.unique ? 'UNIQUE' : '',
    column.nullable || column.primaryKey ? '' : 'NOT NULL',
    column.defaultValue ? `DEFAULT ${column.defaultValue}` : '',
    column.foreignKey ? `REFERENCES ${column.foreignKey}` : '',
  ].filter(Boolean).join(' ');

  const validColumns = (columns || []).filter((column) => column.name && column.type);
  if (action === 'alter') {
    return validColumns.map((column) => `ALTER TABLE ${quote(tableName)} ADD COLUMN ${columnSql(column)};`).join('\n');
  }

  return [
    `CREATE TABLE ${quote(tableName)} (`,
    validColumns.map((column) => `  ${columnSql(column)}`).join(',\n'),
    ');',
  ].join('\n');
}
export function generateResolved() { return ''; }
export function generateRuby(input) { return runtimeGenerateRuby(input); }
export function generateSecret(length = 32) { return runtimeGenerateSecret(length); }
export function generateSentence() { return ''; }
export function generateService(config = {}) {
  const name = safeK8sName(config.name);
  return dumpYamlDocument({
    apiVersion: 'v1',
    kind: 'Service',
    metadata: { name, namespace: safeK8sName(config.namespace || 'default') },
    spec: {
      type: config.serviceType || 'ClusterIP',
      selector: { app: name },
      ports: [{
        port: Number(config.port) || 80,
        targetPort: Number(config.targetPort || config.port) || 80,
        protocol: 'TCP',
      }],
    },
  });
}
export function generateSignature(config = {}) {
  const name = safeText(config.name);
  const title = safeText(config.title);
  const company = safeText(config.company);
  const email = safeText(config.email);
  const phone = safeText(config.phone);
  const websiteUrl = normalizeHttpUrl(config.website);
  const linkedinUrl = normalizeSocialUrl(config.linkedin, 'https://www.linkedin.com/in/');
  const twitterUrl = normalizeSocialUrl(config.twitter, 'https://twitter.com/');
  const githubUrl = normalizeSocialUrl(config.github, 'https://github.com/');
  const primaryColor = normalizeHexColor(config.primaryColor);
  const style = ['professional', 'modern', 'minimal'].includes(config.style) ? config.style : 'professional';

  const contactItems = [];
  if (email) {
    contactItems.push(`<a href="mailto:${escapeHtmlAttribute(email)}" style="color:${primaryColor};text-decoration:none">${safeHtmlText(email)}</a>`);
  }
  if (phone) {
    const phoneHref = phone.replace(/[^\d+]/g, '');
    contactItems.push(phoneHref
      ? `<a href="tel:${escapeHtmlAttribute(phoneHref)}" style="color:${primaryColor};text-decoration:none">${safeHtmlText(phone)}</a>`
      : safeHtmlText(phone));
  }
  if (websiteUrl) {
    contactItems.push(`<a href="${escapeHtmlAttribute(websiteUrl)}" style="color:${primaryColor};text-decoration:none">${safeHtmlText(config.website)}</a>`);
  }

  const socialItems = [
    ['LinkedIn', linkedinUrl],
    ['Twitter', twitterUrl],
    ['GitHub', githubUrl],
  ]
    .filter(([, url]) => Boolean(url))
    .map(([label, url]) => `<a href="${escapeHtmlAttribute(url)}" style="color:${primaryColor};text-decoration:none">${label}</a>`);

  const borderStyle = style === 'minimal' ? 'none' : `3px solid ${primaryColor}`;
  const background = style === 'modern' ? '#f8fafc' : '#ffffff';
  const titleLine = [title, company].filter(Boolean).map(safeHtmlText).join(' · ');
  const contactLine = contactItems.join(' <span style="color:#94a3b8">|</span> ');
  const socialLine = socialItems.join(' <span style="color:#94a3b8">|</span> ');

  const html = `
<table role="presentation" cellpadding="0" cellspacing="0" style="font-family:Arial,sans-serif;color:#0f172a;background:${background};border-left:${borderStyle};padding:12px 16px;max-width:520px">
  <tr>
    <td>
      ${name ? `<div style="font-size:18px;font-weight:700;color:#0f172a">${safeHtmlText(name)}</div>` : ''}
      ${titleLine ? `<div style="font-size:13px;color:#475569;margin-top:3px">${titleLine}</div>` : ''}
      ${contactLine ? `<div style="font-size:12px;color:#475569;margin-top:10px">${contactLine}</div>` : ''}
      ${socialLine ? `<div style="font-size:12px;color:#475569;margin-top:6px">${socialLine}</div>` : ''}
    </td>
  </tr>
</table>`.trim();

  const plainText = [
    name,
    [title, company].filter(Boolean).join(' · '),
    email,
    phone,
    websiteUrl,
    linkedinUrl,
    twitterUrl,
    githubUrl,
  ].filter(Boolean).join('\n');

  return { html, plainText };
}
export function generateSvg(tokens = []) {
  const items = Array.isArray(tokens) ? tokens : tokenizeRegex(String(tokens || ''));
  const nodeHeight = 34;
  const nodeY = 36;
  const lineY = nodeY + nodeHeight / 2;
  const gap = 24;
  let x = 56;
  const nodes = items.map((token, index) => {
    const label = regexTokenLabel(token) || '(empty)';
    const width = Math.max(58, Math.min(180, label.length * 8 + 28));
    const node = {
      token,
      label,
      x,
      y: nodeY,
      width,
      index,
    };
    x += width + gap;
    return node;
  });
  const width = Math.max(220, x + 42);
  const height = 112;
  const colors = {
    literal: '#fef3c7',
    group: '#dbeafe',
    charset: '#dcfce7',
    quantifier: '#fee2e2',
    anchor: '#ede9fe',
    alternation: '#fce7f3',
    special: '#e0f2fe',
  };

  const nodeMarkup = nodes.map((node) => {
    const type = node.token?.type || 'literal';
    const fill = colors[type] || '#f3f4f6';
    const text = safeHtmlText(node.label);
    const label = safeHtmlText(type);
    const center = node.x + node.width / 2;
    return [
      `<rect x="${node.x}" y="${node.y}" width="${node.width}" height="${nodeHeight}" rx="6" fill="${fill}" stroke="#475569" stroke-width="1.25"/>`,
      `<text x="${center}" y="${node.y + 21}" text-anchor="middle" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="12" fill="#0f172a">${text}</text>`,
      `<text x="${center}" y="${node.y + 52}" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="#64748b">${label}</text>`,
    ].join('\n');
  });

  const connectors = [];
  const startX = 24;
  const endX = width - 24;
  const firstX = nodes[0]?.x || endX - 44;
  connectors.push(`<line x1="${startX + 12}" y1="${lineY}" x2="${firstX}" y2="${lineY}" stroke="#475569" stroke-width="1.5"/>`);
  for (let index = 0; index < nodes.length - 1; index += 1) {
    connectors.push(`<line x1="${nodes[index].x + nodes[index].width}" y1="${lineY}" x2="${nodes[index + 1].x}" y2="${lineY}" stroke="#475569" stroke-width="1.5"/>`);
  }
  const lastRight = nodes.length ? nodes[nodes.length - 1].x + nodes[nodes.length - 1].width : firstX;
  connectors.push(`<line x1="${lastRight}" y1="${lineY}" x2="${endX - 12}" y2="${lineY}" stroke="#475569" stroke-width="1.5"/>`);

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="Regular expression diagram">`,
    '<rect width="100%" height="100%" fill="#ffffff"/>',
    `<circle cx="${startX}" cy="${lineY}" r="9" fill="#0f172a"/>`,
    `<circle cx="${endX}" cy="${lineY}" r="9" fill="#ffffff" stroke="#0f172a" stroke-width="3"/>`,
    connectors.join('\n'),
    nodeMarkup.join('\n'),
    '</svg>',
  ].join('\n');
}
export function generateToc(entries: any[] = [], options = {}) {
  return renderTocEntries(entries, options);
}
export async function generateTotp(secret, stepSeconds = 30, digits = 6, timestamp = Date.now()) {
    return runtimeGenerateTotp(secret, stepSeconds, digits, timestamp);
  }
export function generateTypeORM(tableName = 'items', columns: any[] = []) {
  const className = safeClassName(tableName.replace(/s$/, ''));
  const imports = "import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';";
  const fields = (columns || []).filter((column) => column.name).map((column) => {
    const name = safeCodeIdentifier(column.name);
    const rawType = String(column.type || '').toLowerCase();
    const tsType = rawType.includes('int') || rawType.includes('serial') || rawType.includes('real') || rawType.includes('double') || rawType.includes('float') ? 'number' :
      rawType.includes('bool') ? 'boolean' :
        rawType.includes('json') ? 'Record<string, unknown>' :
          'string';
    if (column.primaryKey && /serial|auto_increment/i.test(column.type)) {
      return `  @PrimaryGeneratedColumn()\n  ${name}: ${tsType};`;
    }
    if (column.primaryKey) return `  @PrimaryColumn()\n  ${name}: ${tsType};`;
    const options = [
      `type: '${String(column.type || 'varchar').split(/[ (]/)[0].toLowerCase()}'`,
      column.nullable ? 'nullable: true' : '',
      column.unique ? 'unique: true' : '',
      column.defaultValue ? `default: ${JSON.stringify(column.defaultValue)}` : '',
    ].filter(Boolean).join(', ');
    return `  @Column({ ${options} })\n  ${name}: ${tsType};`;
  });
  return [imports, '', `@Entity('${tableName}')`, `export class ${className} {`, ...fields, '}'].join('\n');
}
export function generateTypeScript(input) {
  return renderTypeScriptClient(input);
}
export function generateWords() { return ''; }
export const generators = {};
export function getContrastRatio(foreground, background) {
    return runtimeGetContrastRatio(String(foreground || ''), String(background || ''));
  }
export function getDaysUntil(dateValue = '') {
  const target = new Date(dateValue);
  if (Number.isNaN(target.getTime())) return 0;
  const today = new Date();
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const targetMidnight = new Date(target.getFullYear(), target.getMonth(), target.getDate()).getTime();
  return Math.ceil((targetMidnight - todayMidnight) / 86_400_000);
}
export function getMonthRuns(cronInput, year = new Date().getFullYear(), monthIndex = new Date().getMonth()) {
  const parsed = typeof cronInput === 'string' ? parseCron(cronInput) : cronInput;
  if (!parsed) return [];

  const runs = [];
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const hours = parsed.hour.values;
  const minutes = parsed.minute.values;

  for (let day = 1; day <= daysInMonth; day += 1) {
    let found = false;
    for (const hour of hours) {
      for (const minute of minutes) {
        const date = new Date(year, monthIndex, day, hour, minute, 0, 0);
        if (matchesCronDate(parsed, date)) {
          runs.push(date);
          found = true;
          break;
        }
      }
      if (found) break;
    }
  }

  return runs;
}
export function getNextRuns(cronInput, limit = 5, fromDate = new Date()) {
  const parsed = typeof cronInput === 'string' ? parseCron(cronInput) : cronInput;
  const maxRuns = Math.max(1, Math.min(50, Math.trunc(Number(limit) || 5)));
  if (!parsed) return [];

  const runs = [];
  const cursor = new Date(fromDate);
  cursor.setSeconds(0, 0);
  cursor.setMinutes(cursor.getMinutes() + 1);

  const maxIterations = 60 * 24 * 366 * 2;
  for (let i = 0; i < maxIterations && runs.length < maxRuns; i += 1) {
    if (matchesCronDate(parsed, cursor)) {
      runs.push(new Date(cursor));
    }
    cursor.setMinutes(cursor.getMinutes() + 1);
  }

  return runs;
}
export function getRiskLevel(score = 0) {
  const value = Number(score) || 0;
  if (value >= 15) return { level: 'Critical', color: 'red', label: 'Critical' };
  if (value >= 10) return { level: 'High', color: 'orange', label: 'High' };
  if (value >= 5) return { level: 'Medium', color: 'yellow', label: 'Medium' };
  return { level: 'Low', color: 'green', label: 'Low' };
}
export function getRiskScore(probability = 1, impact = 1) {
  return Math.max(1, Math.min(5, Number(probability) || 1)) * Math.max(1, Math.min(5, Number(impact) || 1));
}
export function getSqlType(value, dialect = 'mysql') {
  if (typeof value === 'number') return Number.isInteger(value) ? 'INTEGER' : dialect === 'postgresql' ? 'DOUBLE PRECISION' : 'REAL';
  if (typeof value === 'boolean') return dialect === 'sqlite' ? 'INTEGER' : 'BOOLEAN';
  if (value instanceof Date) return dialect === 'postgresql' ? 'TIMESTAMP' : 'DATETIME';
  if (typeof value === 'object' && value !== null) return dialect === 'postgresql' ? 'JSONB' : 'TEXT';
  return 'TEXT';
}
export function getWCAGLevel(ratio, largeText = false) { return runtimeGetWCAGLevel(Number(ratio) || 0, Boolean(largeText)); }
export const h = [];
export const handwritingStyles = {};
export const headerDescriptions = {};
export const ibanSpecs = runtimeIbanSpecs;
export const invisibleChars = [];
export function isAvailable(room = {}, startTime = 540, endTime = 600) {
  const start = Number(startTime);
  const end = Number(endTime);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return false;
  return !(room.bookings || []).some((booking) => start < Number(booking.end) && end > Number(booking.start));
}
export function isIpAddress(value = '') {
  return validateIP(value).isValid;
}
export function isWorkingHour(hour) { return hour >= 9 && hour <= 17; }
export function jsonToDart(input = '{}', className = 'Generated') {
  const root = typeof input === 'string' ? JSON.parse(input) : input;
  const classes = [];

  const renderClass = (object, name) => {
    const safeName = safeClassName(name);
    for (const [fieldName, value] of collectNestedObjects(object)) {
      renderClass(isPlainObject(value) ? value : firstArrayValue(value), safeClassName(fieldName));
    }

    const entries = Object.entries(object || {});
    const fields = entries.map(([fieldName, value]) => `  final ${inferDartType(value, fieldName)} ${safeCodeIdentifier(fieldName)};`);
    const constructorArgs = entries.map(([fieldName]) => `    required this.${safeCodeIdentifier(fieldName)},`);
    const fromJsonArgs = entries.map(([fieldName, value]) => {
      const name = safeCodeIdentifier(fieldName);
      const type = inferDartType(value, fieldName);
      if (isPlainObject(value)) return `      ${name}: ${type}.fromJson(json['${fieldName}'] as Map<String, dynamic>),`;
      if (Array.isArray(value) && isPlainObject(firstArrayValue(value))) {
        const nestedType = safeClassName(fieldName);
        return `      ${name}: (json['${fieldName}'] as List).map((item) => ${nestedType}.fromJson(item as Map<String, dynamic>)).toList(),`;
      }
      return `      ${name}: json['${fieldName}'] as ${type},`;
    });
    const toJsonEntries = entries.map(([fieldName]) => `      '${fieldName}': ${safeCodeIdentifier(fieldName)},`);

    classes.push([
      `class ${safeName} {`,
      ...fields,
      '',
      `  const ${safeName}({`,
      ...constructorArgs,
      '  });',
      '',
      `  factory ${safeName}.fromJson(Map<String, dynamic> json) {`,
      `    return ${safeName}(`,
      ...fromJsonArgs,
      '    );',
      '  }',
      '',
      '  Map<String, dynamic> toJson() {',
      '    return {',
      ...toJsonEntries,
      '    };',
      '  }',
      '}',
    ].join('\n'));
  };

  renderClass(root, className);
  return classes.join('\n\n');
}
export function jsonToProto(value = {}, messageName = 'Root') {
  const object = Array.isArray(value) ? firstArrayValue(value) || {} : value;
  const nestedMessages = [];
  const fields = [];
  let number = 1;

  for (const [fieldName, fieldValue] of Object.entries(object || {})) {
    const repeated = Array.isArray(fieldValue);
    const sample = repeated ? firstArrayValue(fieldValue) : fieldValue;
    if (isPlainObject(sample)) {
      const nested = jsonToProto(sample, safeClassName(fieldName));
      nestedMessages.push(nested);
      fields.push({ name: toSnakeCase(fieldName), type: nested.name, number, repeated });
    } else {
      fields.push({ name: toSnakeCase(fieldName), type: protoTypeFor(sample, fieldName), number, repeated });
    }
    number += 1;
  }

  return { name: safeClassName(messageName), fields, nestedMessages };
}
export function jsonToToml(value = {}) {
  const lines = [];
  appendTomlObject(lines, value);
  return lines.join('\n').trim();
}
export function jsonToYaml(value = {}) {
  return yaml.dump(value, {
    indent: 2,
    lineWidth: -1,
    noRefs: true,
    sortKeys: false,
  }).trimEnd();
}
export const keyLabels = {};
export const m = [];
export function mergeJsonObjects(json1 = '{}', json2 = '{}', strategy = 'deep') {
  const first = typeof json1 === 'string' ? JSON.parse(json1) : json1;
  const second = typeof json2 === 'string' ? JSON.parse(json2) : json2;
  const merged = mergeValues(first, second, strategy);
  return JSON.stringify(merged, null, 2);
}
export function minifyHtml(input = '') {
  return String(input || '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/>\s+</g, '><')
    .replace(/\s{2,}/g, ' ')
    .trim();
}
export function minifySql(sql = '') { return runtimeMinifySql(sql); }
export function minifyXml(input = '') {
  return String(input || '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/>\s+</g, '><')
    .replace(/\s{2,}/g, ' ')
    .trim();
}
export const mirrorMap = runtimeMirrorMap;
export const nameData = {};
export function normalizePrefix(prefix = '') {
  const raw = String(prefix || '').trim();
  if (!raw) return [];

  const compact = raw.replace(/[\s:.-]/g, '');
  if (!compact || compact.length > 12 || compact.length % 2 !== 0 || !/^[0-9a-fA-F]+$/.test(compact)) {
    return null;
  }

  const bytes = [];
  for (let index = 0; index < compact.length; index += 2) {
    bytes.push(Number.parseInt(compact.slice(index, index + 2), 16));
  }
  return bytes;
}
export function optimizeSQL(sql = '') {
  const original = String(sql || '').trim();
  const suggestions = [];
  let score = 100;

  const addSuggestion = (type, message, fix) => {
    suggestions.push({ type, message, fix });
    score -= type === 'warning' ? 20 : type === 'improvement' ? 12 : 5;
  };

  if (/^\s*select\s+\*/i.test(original)) {
    addSuggestion('improvement', 'Avoid SELECT * in production queries.', 'Select only the columns needed by the caller.');
  }

  if (/^\s*select\b/i.test(original) && !/\blimit\b/i.test(original)) {
    addSuggestion('improvement', 'Large SELECT queries should usually include a LIMIT.', 'Add a LIMIT when the UI or API only needs a bounded result set.');
  }

  if (/^\s*(update|delete)\b/i.test(original) && !/\bwhere\b/i.test(original)) {
    addSuggestion('warning', 'UPDATE or DELETE without a WHERE clause can affect the whole table.', 'Add a restrictive WHERE clause or run the statement inside a reviewed migration.');
  }

  if (/\blike\s+['"]%/i.test(original)) {
    addSuggestion('warning', 'Leading-wildcard LIKE patterns usually cannot use a normal B-tree index.', 'Prefer prefix search, full-text search, or a trigram index if substring search is required.');
  }

  if (/\bwhere\b[\s\S]*\b(lower|upper|date|cast|substring)\s*\(/i.test(original)) {
    addSuggestion('warning', 'Functions applied to filtered columns can prevent index usage.', 'Compare normalized stored values or add a matching functional index.');
  }

  if (/\border\s+by\b/i.test(original) && !/\blimit\b/i.test(original)) {
    addSuggestion('info', 'ORDER BY without LIMIT may sort more rows than needed.', 'Add LIMIT/OFFSET for paginated reads.');
  }

  if (/\bwhere\b[\s\S]*\bor\b/i.test(original)) {
    addSuggestion('info', 'OR-heavy filters can make index selection harder.', 'Consider UNION ALL or separate indexed predicates for hot paths.');
  }

  const whereText = original.match(/\bwhere\b([\s\S]*?)(?:\border\s+by\b|\bgroup\s+by\b|\blimit\b|$)/i)?.[1] || '';
  const orderText = getSqlClause(original, 'order by', ['limit', 'offset']);
  const indexFields = new Set();
  for (const condition of splitSqlConditions(whereText)) {
    const field = condition.match(/^(.+?)\s*(?:=|!=|<>|>=|<=|>|<|\bin\b|\blike\b|\bis\b)/i)?.[1];
    if (field) indexFields.add(unquoteSqlIdentifier(field));
  }
  for (const field of Object.keys(parseSqlOrder(orderText))) indexFields.add(field);
  if (indexFields.size > 0) {
    addSuggestion('info', `Review indexes for: ${[...indexFields].join(', ')}.`, 'Align composite indexes with WHERE equality columns first, then range and ORDER BY columns.');
  }

  return {
    original,
    optimized: runtimeFormatSql(original),
    suggestions,
    score: Math.max(0, Math.min(100, score)),
  };
}
export const paperStyles = {};
export function parseConflicts(input: any = []) { return runtimeParseConflicts(input); }
export function parseCron(expression = '') {
  const parts = String(expression || '').trim().split(/\s+/);
  if (parts.length !== 5) return null;

  const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;
  const parsed = {
    minute: parseCronField(minute, 0, 59),
    hour: parseCronField(hour, 0, 23),
    dayOfMonth: parseCronField(dayOfMonth, 1, 31),
    month: parseCronField(month, 1, 12),
    dayOfWeek: parseCronField(dayOfWeek, 0, 7, true),
  };

  if (Object.values(parsed).some((field) => !field)) return null;
  return parsed;
}
export function parseCronExpression(expression = '', translate = (key) => key) {
  const parsed = parseCron(expression);
  const t = (key) => {
    const translated = translate(key);
    return translated && !String(translated).startsWith('MISSING:') ? translated : key;
  };

  if (!parsed) return t('invalidCronExpression') || 'Invalid cron expression';

  const parts = [
    describeCronField(parsed.minute, 'minute'),
    describeCronField(parsed.hour, 'hour'),
    describeCronField(parsed.dayOfMonth, 'day'),
    describeCronField(parsed.month, 'month'),
    describeCronField(parsed.dayOfWeek, 'weekday'),
  ];

  if (expression.trim() === '* * * * *') return t('everyMinute');
  return parts.join('; ');
}
export function parseCurlCommand(input = '') { return runtimeParseCurlCommand(String(input || '')); }
export function parseDependencies(input = '') {
  const text = String(input || '').trim();
  if (!text) return null;

  const dependencies = {};
  const assignDependency = (name, version) => {
    const cleanName = String(name || '').trim();
    assertSafeObjectKey(cleanName);
    if (!cleanName || !version) return;
    dependencies[cleanName] = String(version).trim();
  };

  try {
    const parsed = JSON.parse(text);
    for (const section of ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']) {
      for (const [name, version] of Object.entries(parsed?.[section] || {})) {
        assignDependency(name, version);
      }
    }
    return Object.keys(dependencies).length > 0 ? dependencies : null;
  } catch {
    for (const line of text.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('//')) continue;
      const match =
        trimmed.match(/^(@?[\w.-]+(?:\/[\w.-]+)?)@([^\s,]+)$/) ||
        trimmed.match(/^(@?[\w.-]+(?:\/[\w.-]+)?)\s*[:=]\s*["']?([^"',\s]+)["']?$/);
      if (match) assignDependency(match[1], match[2]);
    }
    return Object.keys(dependencies).length > 0 ? dependencies : null;
  }
}
export function parseEnvContent(content = '') {
  const entries = [];
  const errors = [];
  const seen = new Map();

  String(content || '').split(/\r?\n/).forEach((line, index) => {
    const lineNumber = index + 1;
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('#')) {
      return;
    }

    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!match) {
      const message = `Line ${lineNumber}: invalid KEY=value syntax`;
      entries.push({ key: '', value: trimmed, line: lineNumber, isValid: false, isDuplicate: false, isEmpty: false, error: message });
      errors.push(message);
      return;
    }

    const key = match[1];
    let value = match[2] ?? '';
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    const isDuplicate = seen.has(key);
    const isEmpty = value.length === 0;
    const error = isDuplicate ? `Line ${lineNumber}: duplicate key ${key}` : undefined;
    if (error) errors.push(error);
    seen.set(key, lineNumber);

    entries.push({
      key,
      value,
      line: lineNumber,
      isValid: !isDuplicate,
      isDuplicate,
      isEmpty,
      error,
    });
  });

  return { entries, errors };
}
export function parseGitLog(input = '') {
  return String(input || '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      if (line.includes('|')) {
        const [hash, parentsText = '', author = '', date = '', ...messageParts] = line.split('|');
        const parents = parentsText.trim() ? parentsText.trim().split(/\s+/) : [];
        const message = messageParts.join('|').trim();
        return {
          hash,
          shortHash: hash.slice(0, 7),
          message,
          author,
          date,
          parents,
          isMerge: parents.length > 1 || /^merge\b/i.test(message),
        };
      }

      const graphMatch = line.match(/^[*|\\/ ]*([0-9a-f]{6,40})\s+(.+)$/i);
      const hash = graphMatch?.[1] || line.slice(0, 7);
      const message = graphMatch?.[2] || line;
      return {
        hash,
        shortHash: hash.slice(0, 7),
        message,
        author: '',
        date: '',
        parents: [],
        isMerge: /^merge\b/i.test(message),
      };
    });
}
export function parseNumber(value = '', base = 10) {
  const radix = Number(base) || 10;
  const parsed = Number.parseInt(String(value).trim(), radix);
  if (Number.isNaN(parsed)) {
    throw new Error('Invalid number');
  }
  return parsed;
}
export function parseResponse(input = '') { return runtimeParseResponse(String(input || '')); }
export function parseScatterCSV(csv = '') {
  const lines = String(csv || '').split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (lines.length === 0) return [];

  const first = splitSqlTopLevel(lines[0]);
  const hasHeader = first.some((cell) => /^(series|name|x|y)$/i.test(cell.trim()));
  const headers = hasHeader ? first.map((cell) => cell.trim().toLowerCase()) : ['x', 'y', 'series'];
  const rows = hasHeader ? lines.slice(1) : lines;
  const seriesMap = new Map();

  for (const row of rows) {
    const cells = splitSqlTopLevel(row).map((cell) => cell.replace(/^"|"$/g, '').trim());
    const record = Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? '']));
    const x = Number(record.x ?? cells[0]);
    const y = Number(record.y ?? cells[1]);
    if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
    const name = record.series || record.name || cells[2] || 'Series 1';
    if (!seriesMap.has(name)) seriesMap.set(name, { name, data: [] });
    seriesMap.get(name).data.push({ x, y });
  }

  return [...seriesMap.values()];
}
export function parseSchema(sql = '') {
  const tables = [];
  for (const statement of splitSqlStatements(sql)) {
    const match = statement.match(/^create\s+table\s+(?:if\s+not\s+exists\s+)?([`"\w.]+)\s*\(([\s\S]+)\)$/i);
    if (!match) continue;

    const table = { name: unquoteSqlIdentifier(match[1]), columns: [] };
    const tablePrimaryKeys = new Set();
    const foreignKeys = new Map();

    for (const part of splitSqlTopLevel(match[2])) {
      const trimmed = part.trim();
      let constraint = trimmed.match(/^primary\s+key\s*\(([^)]+)\)/i);
      if (constraint) {
        splitSqlTopLevel(constraint[1]).map(unquoteSqlIdentifier).forEach((key) => tablePrimaryKeys.add(key));
        continue;
      }
      constraint = trimmed.match(/^foreign\s+key\s*\(([^)]+)\)\s+references\s+([`"\w.]+)\s*\(([^)]+)\)/i);
      if (constraint) {
        foreignKeys.set(unquoteSqlIdentifier(constraint[1]), `${unquoteSqlIdentifier(constraint[2])}.${unquoteSqlIdentifier(constraint[3])}`);
        continue;
      }

      const columnMatch = trimmed.match(/^([`"\w]+)\s+(.+?)(?:\s+(primary\s+key|not\s+null|null|unique|default|references)\b[\s\S]*)?$/i);
      if (!columnMatch) continue;
      const name = unquoteSqlIdentifier(columnMatch[1]);
      const rest = trimmed.slice(columnMatch[1].length).trim();
      const references = rest.match(/\breferences\s+([`"\w.]+)\s*\(([^)]+)\)/i);
      table.columns.push({
        name,
        type: columnMatch[2].trim(),
        pk: /\bprimary\s+key\b/i.test(rest) || tablePrimaryKeys.has(name),
        fk: references ? `${unquoteSqlIdentifier(references[1])}.${unquoteSqlIdentifier(references[2])}` : foreignKeys.get(name),
      });
    }

    for (const column of table.columns) {
      if (tablePrimaryKeys.has(column.name)) column.pk = true;
      if (foreignKeys.has(column.name)) column.fk = foreignKeys.get(column.name);
    }
    tables.push(table);
  }
  return tables;
}
export function parseSemver(version = '') {
    const m = /^v?(\d+)\.(\d+)\.(\d+)(?:-(.+))?$/.exec(version.trim());
    if (!m) return null;
    return { major: Number(m[1]), minor: Number(m[2]), patch: Number(m[3]), prerelease: m[4] || '' };
  }
export function parseTimeToMinutes(value: any = '') { return runtimeParseTimeToMinutes(value); }
export function parseTimestamp(value = '', format = detectFormat(value)) {
  const text = String(value || '').trim();
  let date;

  switch (format) {
    case 'seconds':
      date = new Date(Number(text) * 1000);
      break;
    case 'milliseconds':
      date = new Date(Number(text));
      break;
    case 'iso8601':
      date = new Date(text);
      break;
    default:
      return null;
  }

  return Number.isNaN(date.getTime()) ? null : date;
}
export function parseTocInput(input = '') {
  const root = [];
  const stack = [{ level: -1, children: root }];

  for (const rawLine of String(input || '').split(/\r?\n/)) {
    if (!rawLine.trim()) continue;
    const indent = rawLine.match(/^\s*/)?.[0].replace(/\t/g, '  ').length || 0;
    const level = Math.floor(indent / 2);
    const [titlePart, pagePart] = rawLine.trim().split('|').map((part) => part.trim());
    if (!titlePart) continue;

    const item = { title: titlePart, page: pagePart || '', children: [] };
    while (stack.length > 1 && stack[stack.length - 1].level >= level) stack.pop();
    stack[stack.length - 1].children.push(item);
    stack.push({ level, children: item.children });
  }

  return root;
}
export function parseToml(input = '') {
  const root = {};
  let current = root;

  for (const rawLine of String(input || '').split(/\r?\n/)) {
    const line = stripTomlComment(rawLine);
    if (!line) continue;

    const sectionMatch = line.match(/^\[([A-Za-z0-9_.-]+)\]$/);
    if (sectionMatch) {
      current = getTomlSection(root, sectionMatch[1].split('.'));
      continue;
    }

    const assignmentMatch = line.match(/^([A-Za-z0-9_.-]+)\s*=\s*([\s\S]*)$/);
    if (!assignmentMatch) {
      throw new Error(`Invalid TOML line: ${rawLine}`);
    }

    const keyPath = assignmentMatch[1].split('.');
    const key = keyPath.pop();
    assertSafeObjectKey(key);
    const target = keyPath.length > 0 ? getTomlSection(current, keyPath) : current;
    target[key] = parseTomlValue(assignmentMatch[2]);
  }

  return root;
}
export function parseUrl(input) {
    try {
      const url = input.startsWith('?') ? new URL('https://example.com' + input) : new URL(input);
      const params = [];
      url.searchParams.forEach((value, key) => {
        params.push({ key, value, decoded: decodeURIComponent(value) });
      });
      return {
        protocol: url.protocol.replace(':', ''),
        hostname: url.hostname,
        port: url.port,
        pathname: url.pathname,
        search: url.search,
        hash: url.hash,
        params,
      };
    } catch {
      return null;
    }
  }
export function parseYaml(input = '') {
  const parsed = yaml.load(String(input || ''));
  return parsed === undefined ? null : JSON.parse(JSON.stringify(parsed));
}
export function prettyPrintGraphQL() { return null; }
export function processTemplate(template = '', vars = {}) {
    return template.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_, key) => (vars[key] ?? ''));
  }
export function quoteIdentifier(identifier = '', dialect = 'mysql') {
  const raw = String(identifier || 'value');
  if (dialect === 'postgresql' || dialect === 'sqlite') {
    return `"${raw.replace(/"/g, '""')}"`;
  }
  return `\`${raw.replace(/`/g, '``')}\``;
}
export function randomByte() {
  const cryptoApi = globalThis.crypto;
  if (!cryptoApi?.getRandomValues) {
    throw new Error('Secure random generator is not available');
  }

  const bytes = new Uint8Array(1);
  cryptoApi.getRandomValues(bytes);
  return bytes[0];
}
export function rot13(input = '') {
  return caesarCipher(input, 13, false);
}
export const s = {};
export const sizeMap = {};
export function sizeToTailwind(value = '', prefix = '') {
  const raw = String(value || '').trim().toLowerCase();
  if (!raw) return '';

  if (prefix === 'text') {
    const textMap = { '12px': 'xs', '14px': 'sm', '16px': 'base', '18px': 'lg', '20px': 'xl', '24px': '2xl', '30px': '3xl', '36px': '4xl' };
    return textMap[raw] ? `text-${textMap[raw]}` : `text-[${raw}]`;
  }

  if (prefix === 'leading') {
    const leadingMap = { '1': 'none', '1.25': 'tight', '1.375': 'snug', '1.5': 'normal', '1.625': 'relaxed', '2': 'loose' };
    return leadingMap[raw] ? `leading-${leadingMap[raw]}` : `leading-[${raw}]`;
  }

  if (prefix === 'rounded') {
    const roundedMap = { '0px': 'none', '2px': 'sm', '4px': '', '6px': 'md', '8px': 'lg', '12px': 'xl', '16px': '2xl', '24px': '3xl', '9999px': 'full' };
    if (raw in roundedMap) return roundedMap[raw] ? `rounded-${roundedMap[raw]}` : 'rounded';
    return `rounded-[${raw}]`;
  }

  if (prefix === 'border') {
    if (raw === '0' || raw === '0px') return 'border-0';
    if (raw === '1px') return 'border';
    const borderWidth = raw.match(/^(\d+)px$/)?.[1];
    return borderWidth ? `border-${borderWidth}` : `border-[${raw}]`;
  }

  const size = parseTailwindSize(raw);
  return size ? `${prefix}-${size}` : `${prefix}-[${raw}]`;
}
export const smallCapsMap = runtimeSmallCapsMap;
export function sortObject(value, order = 'asc') { return runtimeSortObject(value, order); }
export function sqlToJson(input = '') {
  const rows = [];

  for (const statement of splitSqlStatements(input)) {
    const match = statement.match(/^insert\s+into\s+([`"\w.]+)\s*\(([\s\S]+?)\)\s*values\s*([\s\S]+)$/i);
    if (!match) continue;

    const columns = splitSqlTopLevel(match[2]).map(unquoteSqlIdentifier);
    for (const values of parseSqlValueRows(match[3])) {
      rows.push(Object.fromEntries(columns.map((column, index) => [column, values[index] ?? null])));
    }
  }

  return rows;
}
export const statusCodes = [
  {
    "code": 200,
    "message": "OK"
  },
  {
    "code": 201,
    "message": "Created"
  },
  {
    "code": 301,
    "message": "Moved Permanently"
  },
  {
    "code": 400,
    "message": "Bad Request"
  },
  {
    "code": 404,
    "message": "Not Found"
  },
  {
    "code": 500,
    "message": "Internal Server Error"
  }
];
export const subscriptMap = runtimeSubscriptMap;
export function suggestBranchName() { return null; }
export const superscriptMap = runtimeSuperscriptMap;
export const synonyms = {};
export const tailwindToCssMap = {};
export function testForInjection(code = '') {
  const source = String(code || '');
  const issues = [];
  const sqlKeyword = /\b(select|insert|update|delete|drop|alter|truncate)\b/i;
  const userInput = /\b(req|request)\.(query|body|params)\b|\b(params|query|body)\s*\[|\.searchParams\b/i;
  const parameterized = /\bprepare\s*\(|\$\d+\b|\?|\bwhere\s*:\s*\{|\bPrismaClient\b/i;

  const addIssue = (severity, type, description, fix) => {
    if (!issues.some((issue) => issue.type === type)) {
      issues.push({ severity, type, description, fix });
    }
  };

  if (/`[\s\S]*\b(select|insert|update|delete|drop|alter|truncate)\b[\s\S]*\$\{/i.test(source)) {
    addIssue(
      'high',
      'Template literal SQL interpolation',
      'SQL text is built with template interpolation, so user-controlled values can change query structure.',
      'Use parameter placeholders and pass values separately to the database driver.'
    );
  }

  if (/["'`][^"'`]*(select|insert|update|delete|drop|alter|truncate)[^"'`]*["'`]\s*\+/i.test(source) || (sqlKeyword.test(source) && /\+\s*(req\.|request\.|params|query|body)/i.test(source))) {
    addIssue(
      'high',
      'String concatenated SQL',
      'SQL text is assembled with string concatenation, which is the classic SQL injection failure mode.',
      'Replace concatenation with prepared statements or a query builder that binds parameters.'
    );
  }

  if (sqlKeyword.test(source) && userInput.test(source) && !parameterized.test(source)) {
    addIssue(
      'medium',
      'User input reaches SQL without clear binding',
      'Request-derived values appear near SQL execution without an obvious parameter binding pattern.',
      'Keep SQL static and pass request values in the driver parameter array/object.'
    );
  }

  if (/\b(order\s+by|limit|offset)\b[\s\S]*(req\.|request\.|params|query|body)/i.test(source)) {
    addIssue(
      'medium',
      'Dynamic SQL identifier or clause',
      'Parameterized values do not protect SQL identifiers, ORDER BY clauses, or LIMIT fragments.',
      'Map user choices through a strict allow-list before adding identifiers or clauses to SQL.'
    );
  }

  if (/\bmultipleStatements\s*:\s*true\b/i.test(source)) {
    addIssue(
      'low',
      'Multiple SQL statements enabled',
      'Allowing multiple statements increases impact if injection reaches the database driver.',
      'Disable multiple statements unless a reviewed migration path explicitly needs them.'
    );
  }

  const penalty = issues.reduce((total, issue) => total + (issue.severity === 'high' ? 35 : issue.severity === 'medium' ? 20 : 10), 0);

  return {
    vulnerable: issues.some((issue) => issue.severity === 'high' || issue.severity === 'medium'),
    issues,
    score: Math.max(0, 100 - penalty),
  };
}
export const themes = {};
export function toEnv(entries: EnvOutputEntry[] = []) {
  return entries
    .filter((entry) => entry?.key)
    .map((entry) => `${entry.key}=${quoteEnvValue(entry.value)}`)
    .join('\n');
}
export function toJson(entries: EnvOutputEntry[] = []) {
  return JSON.stringify(entriesToObject(entries), null, 2);
}
export function toPinyin(input = '', withTone = true) {
  return pinyin(String(input || ''), {
    toneType: withTone ? 'symbol' : 'none',
    nonZh: 'consecutive',
  });
}
export function toSeconds(value = {}) {
  const hours = Math.trunc(Number(value.hours ?? 0) || 0);
  const minutes = Math.trunc(Number(value.minutes ?? 0) || 0);
  const seconds = Math.trunc(Number(value.seconds ?? 0) || 0);
  const total = hours * 3600 + minutes * 60 + seconds;
  return value.negative ? -total : total;
}
export function toSimplified() { return null; }
export function toTraditional() { return null; }
export function toYaml(entries: EnvOutputEntry[] = []) {
  return Object.entries(entriesToObject(entries))
    .map(([key, value]) => `${key}: ${quoteYamlValue(value)}`)
    .join('\n');
}
export function tokenizeRegex(pattern = '') {
  const input = String(pattern || '');
  const tokens = [];

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    const next = input[index + 1];

    if (char === '\\') {
      const value = next ? `\\${next}` : '\\';
      tokens.push({
        type: next === 'b' || next === 'B' ? 'anchor' : 'special',
        value,
      });
      if (next) index += 1;
      continue;
    }

    if (char === '[') {
      let end = index + 1;
      let escaping = false;
      while (end < input.length) {
        const current = input[end];
        if (escaping) {
          escaping = false;
        } else if (current === '\\') {
          escaping = true;
        } else if (current === ']') {
          break;
        }
        end += 1;
      }
      const value = input.slice(index, Math.min(end + 1, input.length));
      tokens.push({ type: 'charset', value });
      index = end;
      continue;
    }

    if (char === '(') {
      let depth = 1;
      let end = index + 1;
      let escaping = false;
      while (end < input.length) {
        const current = input[end];
        if (escaping) {
          escaping = false;
        } else if (current === '\\') {
          escaping = true;
        } else if (current === '(') {
          depth += 1;
        } else if (current === ')') {
          depth -= 1;
          if (depth === 0) break;
        }
        end += 1;
      }
      const inner = input.slice(index + 1, depth === 0 ? end : input.length);
      const value = input.slice(index, depth === 0 ? end + 1 : input.length);
      tokens.push({ type: 'group', value, children: tokenizeRegex(inner) });
      index = depth === 0 ? end : input.length;
      continue;
    }

    if (char === '{') {
      const match = input.slice(index).match(/^\{\d+(?:,\d*)?\}/);
      if (match) {
        tokens.push({ type: 'quantifier', value: match[0] });
        index += match[0].length - 1;
        continue;
      }
    }

    if (char === '*' || char === '+' || char === '?') {
      tokens.push({ type: 'quantifier', value: char });
      continue;
    }

    if (char === '^' || char === '$') {
      tokens.push({ type: 'anchor', value: char });
      continue;
    }

    if (char === '|') {
      tokens.push({ type: 'alternation', value: char });
      continue;
    }

    tokens.push({ type: 'literal', value: char });
  }

  return tokens;
}
export function useEffect() { return null; }
export function validateBranch() { return null; }
export function validateIP(value = '') {
  const input = String(value || '').trim();
  const ipv4Parts = input.split('.');

  if (ipv4Parts.length === 4 && ipv4Parts.every((part) => /^\d+$/.test(part))) {
    const octets = ipv4Parts.map(Number);
    const isValid = octets.every((octet) => octet >= 0 && octet <= 255);
    if (!isValid) {
      return { isValid: false, type: 'Invalid', details: {} };
    }

    const first = octets[0];
    const second = octets[1];
    const addressClass =
      first <= 127 ? 'A' :
      first <= 191 ? 'B' :
      first <= 223 ? 'C' :
      first <= 239 ? 'D' : 'E';

    return {
      isValid: true,
      type: 'IPv4',
      details: {
        class: addressClass,
        isPrivate:
          first === 10 ||
          (first === 172 && second >= 16 && second <= 31) ||
          (first === 192 && second === 168),
        isLoopback: first === 127,
        isMulticast: first >= 224 && first <= 239,
      },
    };
  }

  if (isValidIPv6(input)) {
    return {
      isValid: true,
      type: 'IPv6',
      details: {
        isLoopback: input === '::1' || input === '0:0:0:0:0:0:0:1',
        isPrivate: /^f[cd]/i.test(input),
        isMulticast: /^ff/i.test(input),
      },
    };
  }

  return { isValid: false, type: 'Invalid', details: {} };
}
export const vatRates = {
  "DE": {
    "name": "Germany",
    "standard": 19,
    "reduced": [
      7
    ]
  },
  "FR": {
    "name": "France",
    "standard": 20,
    "reduced": [
      10,
      5.5
    ],
    "superReduced": 2.1
  },
  "ES": {
    "name": "Spain",
    "standard": 21,
    "reduced": [
      10,
      4
    ]
  },
  "UK": {
    "name": "United Kingdom",
    "standard": 20,
    "reduced": [
      5
    ],
    "superReduced": 0
  }
};
export function vigenereCipher(input = '', keyword = '', decrypt = false) {
  const key = String(keyword || '').toUpperCase().replace(/[^A-Z]/g, '');
  if (!key) return String(input || '');

  let keyIndex = 0;
  return String(input || '').replace(/[A-Za-z]/g, (char) => {
    const base = char >= 'a' && char <= 'z' ? 97 : 65;
    const keyShift = key.charCodeAt(keyIndex % key.length) - 65;
    const shift = decrypt ? (26 - keyShift) % 26 : keyShift;
    keyIndex += 1;
    return String.fromCharCode(((char.charCodeAt(0) - base + shift) % 26) + base);
  });
}
export function calculate(a, b, operation = 'add') {
  const x = Number(a);
  const y = Number(b);
  if (!Number.isFinite(x) || !Number.isFinite(y)) return 0;
  switch (operation) {
    case 'add':
      return x + y;
    case 'subtract':
      return x - y;
    case 'multiply':
      return x * y;
    case 'divide':
      return y === 0 ? 0 : x / y;
    case 'and':
      return x & y;
    case 'or':
      return x | y;
    case 'xor':
      return x ^ y;
    default:
      return x + y;
  }
}
export function formatNumber(value, base = 10) {
  const num = Number(value);
  if (!Number.isFinite(num)) return '';
  if (Number(base) === 10) return String(num);
  if (Number.isInteger(num)) return num.toString(Number(base)).toUpperCase();
  return String(num);
}
export function formatTime(value, format = '24h') {
  if (!value) return '';
  const negative = Boolean(value.negative);
  const hours = Math.abs(Number(value.hours ?? 0));
  const minutes = Math.abs(Number(value.minutes ?? 0));
  const seconds = Math.abs(Number(value.seconds ?? 0));
  const pad = (n) => String(Math.max(0, Math.trunc(n))).padStart(2, '0');
  const sign = negative ? '-' : '';
  if (format === '12h') {
    const period = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    return `${sign}${pad(hour12)}:${pad(minutes)}:${pad(seconds)} ${period}`;
  }
  return `${sign}${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}
export function formatDate(date, timeZone = 'UTC', outputFormat = 'local') {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  if (outputFormat === 'iso') {
    const zoned = new Date(d.toLocaleString('en-US', { timeZone }));
    return zoned.toISOString();
  }
  return d.toLocaleString(undefined, { timeZone });
}
export function formatXml(input = '') {
  const xml = String(input || '').trim();
  if (!xml) return '';
  const reg = /(>)(<)(\/*)/g;
  const lines = xml.replace(reg, '$1\n$2$3').split('\n');
  let pad = 0;
  const indent = '  ';
  return lines
    .map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return '';
      if (trimmed.startsWith('</')) pad = Math.max(pad - 1, 0);
      const result = indent.repeat(pad) + trimmed;
      if (trimmed.startsWith('<') &&
          !trimmed.startsWith('</') &&
          !trimmed.endsWith('/>') &&
          !trimmed.startsWith('<?') &&
          !trimmed.startsWith('<!') &&
          !trimmed.includes('</')) {
        pad += 1;
      }
      return result;
    })
    .filter(Boolean)
    .join('\n');
}
export function minifyCss(input = '') {
  return String(input || '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}:;,])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim();
}
export function minifyJs(input = '') {
  return String(input || '').trim();
}
export function parseMarkdown(input = '') {
  try {
    return marked.parse(String(input || ''), { breaks: true, gfm: true });
  } catch {
    return String(input || '');
  }
}
export const colors = [
  '#ef4444',
  '#f97316',
  '#f59e0b',
  '#22c55e',
  '#3b82f6',
  '#8b5cf6',
];
export const commonWords = [
  'example',
  'apple',
  'orange',
  'banana',
  'grape',
  'melon',
  'hello',
  'world',
  'tool',
  'code',
  'solve',
  'trace',
];
export const presets = {
  triangle: { value: 'polygon(50% 0%, 0% 100%, 100% 100%)' },
  diamond: { value: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' },
  star: { value: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' },
  circle: { value: 'circle(50% at 50% 50%)' },
  inset: { value: 'inset(10% 20% 10% 20% round 10%)' },
};
export const units = {
  length: {
    m: { name: 'Meter', toBase: (v) => v, fromBase: (v) => v },
    km: { name: 'Kilometer', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    cm: { name: 'Centimeter', toBase: (v) => v / 100, fromBase: (v) => v * 100 },
    in: { name: 'Inch', toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
    ft: { name: 'Foot', toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
    mi: { name: 'Mile', toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
  },
  weight: {
    kg: { name: 'Kilogram', toBase: (v) => v, fromBase: (v) => v },
    g: { name: 'Gram', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    lb: { name: 'Pound', toBase: (v) => v * 0.45359237, fromBase: (v) => v / 0.45359237 },
    oz: { name: 'Ounce', toBase: (v) => v * 0.0283495231, fromBase: (v) => v / 0.0283495231 },
  },
  temperature: {
    c: { name: 'Celsius', toBase: (v) => v, fromBase: (v) => v },
    f: { name: 'Fahrenheit', toBase: (v) => (v - 32) * (5 / 9), fromBase: (v) => v * (9 / 5) + 32 },
    k: { name: 'Kelvin', toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
  },
  area: {
    sqm: { name: 'Square meter', toBase: (v) => v, fromBase: (v) => v },
    sqkm: { name: 'Square kilometer', toBase: (v) => v * 1e6, fromBase: (v) => v / 1e6 },
    sqft: { name: 'Square foot', toBase: (v) => v * 0.092903, fromBase: (v) => v / 0.092903 },
    acre: { name: 'Acre', toBase: (v) => v * 4046.8564224, fromBase: (v) => v / 4046.8564224 },
  },
  volume: {
    l: { name: 'Liter', toBase: (v) => v, fromBase: (v) => v },
    ml: { name: 'Milliliter', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    m3: { name: 'Cubic meter', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    gal: { name: 'Gallon', toBase: (v) => v * 3.78541, fromBase: (v) => v / 3.78541 },
  },
  speed: {
    mps: { name: 'Meters/sec', toBase: (v) => v, fromBase: (v) => v },
    kmh: { name: 'Kilometers/hour', toBase: (v) => v / 3.6, fromBase: (v) => v * 3.6 },
    mph: { name: 'Miles/hour', toBase: (v) => v * 0.44704, fromBase: (v) => v / 0.44704 },
    knot: { name: 'Knot', toBase: (v) => v * 0.514444, fromBase: (v) => v / 0.514444 },
  },
  data: {
    b: { name: 'Byte', toBase: (v) => v, fromBase: (v) => v },
    kb: { name: 'Kilobyte', toBase: (v) => v * 1024, fromBase: (v) => v / 1024 },
    mb: { name: 'Megabyte', toBase: (v) => v * 1024 ** 2, fromBase: (v) => v / 1024 ** 2 },
    gb: { name: 'Gigabyte', toBase: (v) => v * 1024 ** 3, fromBase: (v) => v / 1024 ** 3 },
    tb: { name: 'Terabyte', toBase: (v) => v * 1024 ** 4, fromBase: (v) => v / 1024 ** 4 },
  },
};
