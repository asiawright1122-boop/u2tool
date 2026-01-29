'use client';

import { useState, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';

interface ProtoField {
  name: string;
  type: string;
  number: number;
  repeated: boolean;
}

interface ProtoMessage {
  name: string;
  fields: ProtoField[];
  nestedMessages: ProtoMessage[];
}

function inferProtoType(value: unknown): string {
  if (value === null) return 'google.protobuf.NullValue';
  if (typeof value === 'boolean') return 'bool';
  if (typeof value === 'number') {
    if (Number.isInteger(value)) {
      if (value >= -2147483648 && value <= 2147483647) return 'int32';
      return 'int64';
    }
    return 'double';
  }
  if (typeof value === 'string') {
    // Check for common patterns
    if (/^\d{4}-\d{2}-\d{2}/.test(value)) return 'google.protobuf.Timestamp';
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) return 'string';
    return 'string';
  }
  if (Array.isArray(value)) return 'repeated';
  if (typeof value === 'object') return 'message';
  return 'string';
}

function toPascalCase(str: string): string {
  return str
    .replace(/[-_](.)/g, (_, c) => c.toUpperCase())
    .replace(/^(.)/, (_, c) => c.toUpperCase());
}

function toSnakeCase(str: string): string {
  return str
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '');
}

function jsonToProto(json: unknown, messageName: string = 'Root'): ProtoMessage {
  const message: ProtoMessage = {
    name: toPascalCase(messageName),
    fields: [],
    nestedMessages: [],
  };

  if (typeof json !== 'object' || json === null) {
    return message;
  }

  let fieldNumber = 1;
  const obj = json as Record<string, unknown>;

  for (const [key, value] of Object.entries(obj)) {
    const fieldName = toSnakeCase(key);
    let fieldType = inferProtoType(value);
    let repeated = false;

    if (Array.isArray(value)) {
      repeated = true;
      if (value.length > 0) {
        const firstItem = value[0];
        if (typeof firstItem === 'object' && firstItem !== null && !Array.isArray(firstItem)) {
          const nestedName = toPascalCase(key.replace(/s$/, ''));
          fieldType = nestedName;
          const nestedMessage = jsonToProto(firstItem, nestedName);
          if (!message.nestedMessages.find(m => m.name === nestedName)) {
            message.nestedMessages.push(nestedMessage);
          }
        } else {
          fieldType = inferProtoType(firstItem);
        }
      } else {
        fieldType = 'string'; // Default for empty arrays
      }
    } else if (typeof value === 'object' && value !== null) {
      const nestedName = toPascalCase(key);
      fieldType = nestedName;
      const nestedMessage = jsonToProto(value, nestedName);
      message.nestedMessages.push(nestedMessage);
    }

    message.fields.push({
      name: fieldName,
      type: fieldType,
      number: fieldNumber++,
      repeated,
    });
  }

  return message;
}

function generateProtoFile(message: ProtoMessage, packageName: string, syntax: string): string {
  const lines: string[] = [];
  
  lines.push(`syntax = "${syntax}";`);
  lines.push('');
  if (packageName) {
    lines.push(`package ${packageName};`);
    lines.push('');
  }
  
  // Check if we need timestamp import
  const needsTimestamp = checkNeedsImport(message, 'google.protobuf.Timestamp');
  if (needsTimestamp) {
    lines.push('import "google/protobuf/timestamp.proto";');
    lines.push('');
  }

  lines.push(...generateMessage(message, 0));
  
  return lines.join('\n');
}

function checkNeedsImport(message: ProtoMessage, type: string): boolean {
  if (message.fields.some(f => f.type === type)) return true;
  return message.nestedMessages.some(m => checkNeedsImport(m, type));
}

function generateMessage(message: ProtoMessage, indent: number): string[] {
  const lines: string[] = [];
  const prefix = '  '.repeat(indent);
  
  lines.push(`${prefix}message ${message.name} {`);
  
  // Nested messages first
  for (const nested of message.nestedMessages) {
    lines.push(...generateMessage(nested, indent + 1));
    lines.push('');
  }
  
  // Fields
  for (const field of message.fields) {
    const repeated = field.repeated ? 'repeated ' : '';
    lines.push(`${prefix}  ${repeated}${field.type} ${field.name} = ${field.number};`);
  }
  
  lines.push(`${prefix}}`);
  
  return lines;
}

const EXAMPLE_JSON = {
  user: {
    id: 123,
    name: "John Doe",
    email: "john@example.com",
    isActive: true,
    createdAt: "2024-01-15T10:30:00Z",
    roles: ["admin", "user"],
    profile: {
      age: 30,
      city: "New York"
    }
  }
};

export default function JsonToProtobufConverter() {
  const t = useTranslations('tools.json-to-protobuf-converter');
  const tCommon = useTranslations('tools');
  const [input, setInput] = useState('');
  const [packageName, setPackageName] = useState('example');
  const [messageName, setMessageName] = useState('Root');
  const [syntax, setSyntax] = useState<'proto3' | 'proto2'>('proto3');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (!input.trim()) return null;
    try {
      const json = JSON.parse(input);
      const message = jsonToProto(json, messageName);
      return generateProtoFile(message, packageName, syntax);
    } catch {
      return null;
    }
  }, [input, packageName, messageName, syntax]);

  const handleCopy = useCallback(() => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [result]);

  const handleClear = useCallback(() => {
    setInput('');
  }, []);

  const loadExample = useCallback(() => {
    setInput(JSON.stringify(EXAMPLE_JSON, null, 2));
  }, []);

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            JSON {tCommon('input')}
          </label>
          <button
            onClick={loadExample}
            className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            {t('loadExample')}
          </button>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='{"name": "John", "age": 30}'
          className="w-full h-48 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm resize-none"
        />
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('packageName')}
          </label>
          <input
            type="text"
            value={packageName}
            onChange={(e) => setPackageName(e.target.value)}
            placeholder={t("packageNamePlaceholder")}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('messageName')}
          </label>
          <input
            type="text"
            value={messageName}
            onChange={(e) => setMessageName(e.target.value)}
            placeholder={t("messageNamePlaceholder")}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('syntax')}
          </label>
          <select
            value={syntax}
            onChange={(e) => setSyntax(e.target.value as 'proto3' | 'proto2')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
          >
            <option value="proto3">proto3</option>
            <option value="proto2">proto2</option>
          </select>
        </div>
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
      {input.trim() && !result && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
          {t('invalidJson')}
        </div>
      )}

      {/* Result */}
      {result && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('protocolBuffers')}
            </label>
            <button
              onClick={handleCopy}
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              {copied ? tCommon('copied') : tCommon('copy')}
            </button>
          </div>
          <pre className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-x-auto text-sm font-mono text-gray-800 dark:text-gray-200">
            {result}
          </pre>
        </div>
      )}

      {/* Type Mapping Reference */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">{t('typeMapping')}</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-blue-700 dark:text-blue-400">
          <div>string → string</div>
          <div>number (int) → int32/int64</div>
          <div>number (float) → double</div>
          <div>boolean → bool</div>
          <div>array → repeated</div>
          <div>object → message</div>
          <div>ISO date → Timestamp</div>
          <div>null → NullValue</div>
        </div>
      </div>
    </div>
  );
}
