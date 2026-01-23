'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface SchemaOptions {
  draft: 'draft-07' | 'draft-2020-12';
  includeExamples: boolean;
  markAllRequired: boolean;
}

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

// Infer JSON Schema type from value
function inferType(value: JsonValue): string {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
}

// Generate JSON Schema from a value
function generateSchema(
  value: JsonValue,
  options: SchemaOptions,
  _key?: string
): Record<string, unknown> {
  const type = inferType(value);
  const schema: Record<string, unknown> = {};

  switch (type) {
    case 'string':
      schema.type = 'string';
      if (options.includeExamples) {
        schema.examples = [value];
      }
      break;

    case 'number':
      schema.type = Number.isInteger(value as number) ? 'integer' : 'number';
      if (options.includeExamples) {
        schema.examples = [value];
      }
      break;

    case 'boolean':
      schema.type = 'boolean';
      if (options.includeExamples) {
        schema.examples = [value];
      }
      break;

    case 'null':
      schema.type = 'null';
      break;

    case 'array': {
      schema.type = 'array';
      const arr = value as JsonValue[];
      if (arr.length > 0) {
        // Infer items schema from first element
        schema.items = generateSchema(arr[0], options);
      } else {
        schema.items = {};
      }
      break;
    }

    case 'object': {
      schema.type = 'object';
      const obj = value as { [key: string]: JsonValue };
      const properties: Record<string, unknown> = {};
      const required: string[] = [];

      for (const [k, v] of Object.entries(obj)) {
        properties[k] = generateSchema(v, options, k);
        if (options.markAllRequired) {
          required.push(k);
        }
      }

      schema.properties = properties;
      if (required.length > 0) {
        schema.required = required;
      }
      schema.additionalProperties = false;
      break;
    }
  }

  return schema;
}

// Generate full JSON Schema document
function generateFullSchema(
  value: JsonValue,
  options: SchemaOptions
): Record<string, unknown> {
  const schema = generateSchema(value, options);
  
  const schemaUrl = options.draft === 'draft-07'
    ? 'http://json-schema.org/draft-07/schema#'
    : 'https://json-schema.org/draft/2020-12/schema';

  return {
    $schema: schemaUrl,
    ...schema,
  };
}

export default function JsonSchemaGenerator() {
  const t = useTranslations('tools.json-schema-generator');
  const tg = useTranslations('tools');
  
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [options, setOptions] = useState<SchemaOptions>({
    draft: 'draft-07',
    includeExamples: false,
    markAllRequired: false,
  });
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleGenerate = useCallback(() => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const schema = generateFullSchema(parsed, options);
      setOutput(JSON.stringify(schema, null, 2));
      setError('');
    } catch (e) {
      setError(tg('errorInvalidJson') + ': ' + (e as Error).message);
      setOutput('');
    }
  }, [input, options, tg]);

  const handleCopy = async () => {
    if (output) {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  useEffect(() => {

    return () => {

      if (timerRef.current) clearTimeout(timerRef.current);

    };

  }, []);


  return (
    <div className="space-y-4">
      {/* Input Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {tg('input')} (JSON)
        </label>
        <textarea
          className="tool-textarea font-mono"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('inputPlaceholder')}
          rows={10}
        />
      </div>

      {/* Options Section */}
      <div className="flex flex-wrap gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('draft')}
          </label>
          <select
            value={options.draft}
            onChange={(e) => setOptions({ ...options, draft: e.target.value as SchemaOptions['draft'] })}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="draft-07">Draft-07</option>
            <option value="draft-2020-12">Draft-2020-12</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="includeExamples"
            checked={options.includeExamples}
            onChange={(e) => setOptions({ ...options, includeExamples: e.target.checked })}
            className="rounded border-gray-300 dark:border-gray-600"
          />
          <label htmlFor="includeExamples" className="text-sm text-gray-700 dark:text-gray-300">
            {t('includeExamples')}
          </label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="markRequired"
            checked={options.markAllRequired}
            onChange={(e) => setOptions({ ...options, markAllRequired: e.target.checked })}
            className="rounded border-gray-300 dark:border-gray-600"
          />
          <label htmlFor="markRequired" className="text-sm text-gray-700 dark:text-gray-300">
            {t('markRequired')}
          </label>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <button onClick={handleGenerate} className="btn-primary">
          {t('generate')}
        </button>
        <button onClick={handleClear} className="btn-secondary">
          {tg('clear')}
        </button>
      </div>

      {/* Error Section */}
      {error && (
        <div className="tool-error">
          {error}
        </div>
      )}

      {/* Output Section */}
      {output && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('generatedSchema')}
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
            rows={15}
          />
        </div>
      )}
    </div>
  );
}
