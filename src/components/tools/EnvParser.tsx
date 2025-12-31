'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';

interface EnvEntry {
  key: string;
  value: string;
  line: number;
  isValid: boolean;
  isDuplicate: boolean;
  isEmpty: boolean;
  error?: string;
}

interface ParseResult {
  entries: EnvEntry[];
  errors: string[];
}

// Parse .env content
function parseEnvContent(content: string): ParseResult {
  const lines = content.split('\n');
  const entries: EnvEntry[] = [];
  const errors: string[] = [];
  const seenKeys = new Map<string, number>();

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    
    // Skip empty lines and comments
    if (!trimmedLine || trimmedLine.startsWith('#')) {
      return;
    }

    // Match KEY=value pattern (with optional quotes)
    const match = trimmedLine.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    
    if (!match) {
      errors.push(`Line ${index + 1}: Invalid syntax`);
      entries.push({
        key: trimmedLine,
        value: '',
        line: index + 1,
        isValid: false,
        isDuplicate: false,
        isEmpty: true,
        error: 'Invalid syntax'
      });
      return;
    }

    const [, key, rawValue] = match;
    let value = rawValue;

    // Handle quoted values
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    const isDuplicate = seenKeys.has(key);
    if (isDuplicate) {
      errors.push(`Line ${index + 1}: Duplicate key "${key}" (first seen at line ${seenKeys.get(key)})`);
    } else {
      seenKeys.set(key, index + 1);
    }

    const isEmpty = value === '';
    if (isEmpty) {
      errors.push(`Line ${index + 1}: Empty value for key "${key}"`);
    }

    entries.push({
      key,
      value,
      line: index + 1,
      isValid: !isDuplicate,
      isDuplicate,
      isEmpty,
      error: isDuplicate ? `Duplicate key` : isEmpty ? 'Empty value' : undefined
    });
  });

  return { entries, errors };
}

// Convert entries to JSON
function toJson(entries: EnvEntry[]): string {
  const obj: Record<string, string> = {};
  entries.forEach(entry => {
    if (entry.isValid || entry.isDuplicate) {
      obj[entry.key] = entry.value;
    }
  });
  return JSON.stringify(obj, null, 2);
}

// Convert entries to YAML
function toYaml(entries: EnvEntry[]): string {
  return entries
    .filter(e => e.isValid || e.isDuplicate)
    .map(entry => {
      const value = entry.value.includes(':') || entry.value.includes('#') || 
                    entry.value.includes("'") || entry.value.includes('"') ||
                    entry.value === '' || entry.value === 'true' || entry.value === 'false' ||
                    !isNaN(Number(entry.value))
        ? `"${entry.value.replace(/"/g, '\\"')}"`
        : entry.value;
      return `${entry.key}: ${value}`;
    })
    .join('\n');
}

// Convert entries back to .env format
function toEnv(entries: EnvEntry[]): string {
  return entries
    .filter(e => e.isValid || e.isDuplicate)
    .map(entry => {
      const needsQuotes = entry.value.includes(' ') || entry.value.includes('#') ||
                         entry.value.includes('"') || entry.value.includes("'") ||
                         entry.value.includes('\n');
      const value = needsQuotes ? `"${entry.value.replace(/"/g, '\\"')}"` : entry.value;
      return `${entry.key}=${value}`;
    })
    .join('\n');
}

// Mask sensitive values
function maskValue(value: string): string {
  if (value.length <= 4) {
    return '*'.repeat(value.length);
  }
  return value.slice(0, 2) + '*'.repeat(value.length - 4) + value.slice(-2);
}

// Check if key might be sensitive
function isSensitiveKey(key: string): boolean {
  const sensitivePatterns = [
    /password/i, /secret/i, /key/i, /token/i, /api/i,
    /auth/i, /credential/i, /private/i, /access/i
  ];
  return sensitivePatterns.some(pattern => pattern.test(key));
}

export default function EnvParser() {
  const t = useTranslations('tools.env-parser');
  const tg = useTranslations('tools');
  
  const [input, setInput] = useState('');
  const [parseResult, setParseResult] = useState<ParseResult>({ entries: [], errors: [] });
  const [outputFormat, setOutputFormat] = useState<'env' | 'json' | 'yaml'>('env');
  const [showValues, setShowValues] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleParse = useCallback(() => {
    if (!input.trim()) {
      setParseResult({ entries: [], errors: [] });
      return;
    }
    const result = parseEnvContent(input);
    setParseResult(result);
  }, [input]);

  const getOutput = useCallback(() => {
    const { entries } = parseResult;
    if (entries.length === 0) return '';
    
    switch (outputFormat) {
      case 'json':
        return toJson(entries);
      case 'yaml':
        return toYaml(entries);
      default:
        return toEnv(entries);
    }
  }, [parseResult, outputFormat]);

  const handleCopy = async () => {
    const output = getOutput();
    if (output) {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClear = () => {
    setInput('');
    setParseResult({ entries: [], errors: [] });
  };

  const output = getOutput();

  return (
    <div className="space-y-4">
      {/* Input Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {tg('input')}
        </label>
        <textarea
          className="tool-textarea"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('inputPlaceholder')}
          rows={8}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <button onClick={handleParse} className="btn-primary">
          {t('parse')}
        </button>
        <button onClick={handleClear} className="btn-secondary">
          {tg('clear')}
        </button>
      </div>

      {/* Errors Section */}
      {parseResult.errors.length > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
            {t('issues')} ({parseResult.errors.length})
          </h3>
          <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
            {parseResult.errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Parsed Entries Table */}
      {parseResult.entries.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('parsedEntries')} ({parseResult.entries.length})
            </h3>
            <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <input
                type="checkbox"
                checked={showValues}
                onChange={(e) => setShowValues(e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-600"
              />
              {t('showValues')}
            </label>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">{t('line')}</th>
                  <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">{t('key')}</th>
                  <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">{t('value')}</th>
                  <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">{t('status')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {parseResult.entries.map((entry, index) => (
                  <tr 
                    key={index}
                    className={
                      entry.isDuplicate ? 'bg-red-50 dark:bg-red-900/20' :
                      entry.isEmpty ? 'bg-yellow-50 dark:bg-yellow-900/20' :
                      !entry.isValid ? 'bg-red-50 dark:bg-red-900/20' :
                      ''
                    }
                  >
                    <td className="px-4 py-2 text-gray-600 dark:text-gray-400">{entry.line}</td>
                    <td className="px-4 py-2 font-mono text-gray-900 dark:text-gray-100">{entry.key}</td>
                    <td className="px-4 py-2 font-mono text-gray-900 dark:text-gray-100">
                      {showValues 
                        ? entry.value 
                        : isSensitiveKey(entry.key) 
                          ? maskValue(entry.value)
                          : entry.value
                      }
                    </td>
                    <td className="px-4 py-2">
                      {entry.error ? (
                        <span className="text-red-600 dark:text-red-400">{entry.error}</span>
                      ) : (
                        <span className="text-green-600 dark:text-green-400">✓</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Output Format Selection */}
      {parseResult.entries.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('outputFormat')}
          </label>
          <div className="flex gap-2">
            {(['env', 'json', 'yaml'] as const).map((format) => (
              <button
                key={format}
                onClick={() => setOutputFormat(format)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  outputFormat === format
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {format.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Output Section */}
      {output && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {tg('output')}
            </label>
            <button
              onClick={handleCopy}
              className={`text-sm px-3 py-1 rounded ${
                copied 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100'
              }`}
            >
              {copied ? tg('copied') : tg('copy')}
            </button>
          </div>
          <textarea
            className="tool-textarea font-mono"
            value={output}
            readOnly
            rows={10}
          />
        </div>
      )}
    </div>
  );
}
