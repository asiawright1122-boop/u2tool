#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

const LOCALES = ['en', 'zh', 'es', 'pt', 'ja', 'ru', 'fr', 'ar', 'de', 'ko'] as const;
const messagesDir = path.join(process.cwd(), 'src', 'messages');

type JsonValue = string | number | boolean | null | JsonObject | JsonValue[];
type JsonObject = { [key: string]: JsonValue };

export function isPlainObject(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function deepMerge(base: JsonObject, override: JsonObject): JsonObject {
  const merged: JsonObject = { ...base };

  for (const [key, value] of Object.entries(override)) {
    const baseValue = merged[key];
    if (isPlainObject(baseValue) && isPlainObject(value)) {
      merged[key] = deepMerge(baseValue, value);
      continue;
    }

    merged[key] = value;
  }

  return merged;
}

function readJson(filePath: string): JsonObject {
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as JsonObject;
}

function loadLocale(locale: string) {
  const rootPath = path.join(messagesDir, `${locale}.json`);
  const basePath = path.join(messagesDir, locale, 'base.json');
  const root = fs.existsSync(rootPath) ? readJson(rootPath) : {};
  const base = fs.existsSync(basePath) ? readJson(basePath) : {};

  return {
    rootPath,
    root,
    merged: deepMerge(base, root),
  };
}

export function flatten(value: JsonValue, prefix = '', out: Record<string, JsonValue> = {}) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      flatten(item, `${prefix}[${index}]`, out);
    });
    return out;
  }

  if (isPlainObject(value)) {
    for (const [key, nested] of Object.entries(value)) {
      flatten(nested, prefix ? `${prefix}.${key}` : key, out);
    }
    return out;
  }

  out[prefix] = value;
  return out;
}

function parsePathSegments(keyPath: string): Array<string | number> {
  const parts: Array<string | number> = [];

  for (const segment of keyPath.split('.')) {
    const matcher = /([^\[\]]+)|\[(\d+)\]/g;
    let match: RegExpExecArray | null;

    while ((match = matcher.exec(segment)) !== null) {
      if (match[1]) {
        parts.push(match[1]);
      } else if (match[2]) {
        parts.push(Number(match[2]));
      }
    }
  }

  return parts;
}

export function setDeep(target: JsonObject | JsonValue[], keyPath: string, value: JsonValue) {
  const parts = parsePathSegments(keyPath);
  let current: JsonObject | JsonValue[] = target;

  for (let index = 0; index < parts.length; index += 1) {
    const part = parts[index];
    const nextPart = parts[index + 1];
    const isLast = index === parts.length - 1;

    if (isLast) {
      (current as Record<string | number, JsonValue>)[part] = value;
      return;
    }

    const record = current as Record<string | number, JsonValue>;
    if (record[part] === undefined) {
      record[part] = typeof nextPart === 'number' ? [] : {};
    }

    current = record[part] as JsonObject | JsonValue[];
  }
}

export function getMissingKeys(
  referenceEntries: Record<string, JsonValue>,
  localeEntries: Record<string, JsonValue>
) {
  return Object.keys(referenceEntries).filter((key) => !(key in localeEntries));
}

export function fillMissingKeysInRoot(
  root: JsonObject,
  referenceEntries: Record<string, JsonValue>,
  localeEntries: Record<string, JsonValue>
) {
  const missingKeys = getMissingKeys(referenceEntries, localeEntries);

  for (const missingKey of missingKeys) {
    setDeep(root, missingKey, referenceEntries[missingKey]);
  }

  return missingKeys;
}

export function runFillMissingTranslationKeys(checkOnly = false) {
  const english = loadLocale('en').merged;
  const englishEntries = flatten(english);

  let totalFilled = 0;

  for (const locale of LOCALES.filter((item) => item !== 'en')) {
    const localeData = loadLocale(locale);
    const localeEntries = flatten(localeData.merged);
    const missingKeys = getMissingKeys(englishEntries, localeEntries);

    if (!checkOnly) {
      fillMissingKeysInRoot(localeData.root, englishEntries, localeEntries);

      if (missingKeys.length > 0) {
        fs.writeFileSync(localeData.rootPath, `${JSON.stringify(localeData.root, null, 2)}\n`);
      }
    }

    totalFilled += missingKeys.length;
    console.log(`${locale}: ${missingKeys.length} missing key(s)${checkOnly ? '' : ' processed'}`);
  }

  console.log(`total: ${totalFilled} missing key(s)${checkOnly ? ' detected' : ' processed'}`);

  if (checkOnly && totalFilled > 0) {
    process.exitCode = 1;
  }
}

const invokedPath = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : '';

if (invokedPath === import.meta.url) {
  runFillMissingTranslationKeys(process.argv.includes('--check'));
}
