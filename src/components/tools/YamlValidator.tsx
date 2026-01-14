'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import * as yaml from 'js-yaml';

export default function YamlValidator() {
  const t = useTranslations('tools.yaml-validator');
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{
    valid: boolean;
    error?: string;
    lineNumber?: number;
    parsed?: unknown;
  } | null>(null);

  const validate = () => {
    if (!input.trim()) {
      setResult({ valid: false, error: t('errors.empty') });
      return;
    }

    try {
      const parsed = yaml.load(input);
      setResult({ valid: true, parsed });
    } catch (e) {
      const error = e as yaml.YAMLException;
      setResult({
        valid: false,
        error: error.message,
        lineNumber: error.mark?.line ? error.mark.line + 1 : undefined,
      });
    }
  };

  const formatYaml = () => {
    try {
      const parsed = yaml.load(input);
      const formatted = yaml.dump(parsed, { indent: 2, lineWidth: -1 });
      setInput(formatted);
      setResult({ valid: true, parsed });
    } catch (e) {
      const error = e as yaml.YAMLException;
      setResult({
        valid: false,
        error: error.message,
        lineNumber: error.mark?.line ? error.mark.line + 1 : undefined,
      });
    }
  };

  const loadExample = () => {
    const example = `# Example YAML configuration
server:
  host: localhost
  port: 8080
  ssl: true

database:
  type: postgresql
  host: db.example.com
  port: 5432
  credentials:
    username: admin
    password: secret

features:
  - name: authentication
    enabled: true
  - name: logging
    enabled: true
    level: debug`;
    setInput(example);
    setResult(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('yamlInput')}
        </label>
        <textarea
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setResult(null);
          }}
          placeholder={t('placeholder')}
          className="w-full h-80 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm"
        />
      </div>

      <div className="flex gap-4 flex-wrap">
        <button
          onClick={validate}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          {t('validate')}
        </button>
        <button
          onClick={formatYaml}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
        >
          {t('format')}
        </button>
        <button
          onClick={loadExample}
          className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
        >
          {t('loadExample')}
        </button>
      </div>

      {result && (
        <div className={`p-6 rounded-xl ${
          result.valid
            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
            : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
        }`}>
          <div className="flex items-center gap-3 mb-4">
            <span className={`text-3xl ${result.valid ? 'text-green-500' : 'text-red-500'}`}>
              {result.valid ? '✓' : '✗'}
            </span>
            <span className={`text-xl font-semibold ${
              result.valid ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
            }`}>
              {result.valid ? t('valid') : t('invalid')}
            </span>
          </div>

          {result.error && (
            <div className="space-y-2">
              <p className="text-red-600 dark:text-red-400">{result.error}</p>
              {result.lineNumber && (
                <p className="text-sm text-red-500 dark:text-red-400">
                  {t('errorLine', { line: result.lineNumber })}
                </p>
              )}
            </div>
          )}

          {result.valid && result.parsed !== undefined && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('parsedOutput')}
              </h4>
              <pre className="p-4 bg-white dark:bg-gray-800 rounded-lg overflow-x-auto text-sm text-gray-900 dark:text-white">
                {JSON.stringify(result.parsed, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
