'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function JsonToRust() {
  const t = useTranslations('tools.json-to-rust');
  const [input, setInput] = useState('{\n  "id": 1,\n  "name": "John Doe",\n  "email": "john@example.com",\n  "is_active": true,\n  "tags": ["developer", "designer"],\n  "address": {\n    "street": "123 Main St",\n    "city": "New York"\n  }\n}');
  const [output, setOutput] = useState('');
  const [structName, setStructName] = useState('Root');
  const [useSerde, setUseSerde] = useState(true);
  const [useOption, setUseOption] = useState(true);

  const toSnakeCase = (str: string): string => {
    return str.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '');
  };

  const toPascalCase = (str: string): string => {
    return str.split(/[_-]/).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
  };

  const getRustType = (value: unknown, key: string, structs: Map<string, string>): string => {
    if (value === null) return useOption ? 'Option<serde_json::Value>' : 'serde_json::Value';
    if (typeof value === 'string') return 'String';
    if (typeof value === 'number') {
      return Number.isInteger(value) ? 'i64' : 'f64';
    }
    if (typeof value === 'boolean') return 'bool';
    if (Array.isArray(value)) {
      if (value.length === 0) return 'Vec<serde_json::Value>';
      const itemType = getRustType(value[0], key, structs);
      return `Vec<${itemType}>`;
    }
    if (typeof value === 'object') {
      const nestedStructName = toPascalCase(key);
      generateStruct(value as Record<string, unknown>, nestedStructName, structs);
      return nestedStructName;
    }
    return 'serde_json::Value';
  };

  const generateStruct = (obj: Record<string, unknown>, name: string, structs: Map<string, string>) => {
    const lines: string[] = [];
    
    if (useSerde) {
      lines.push('#[derive(Debug, Clone, Serialize, Deserialize)]');
    } else {
      lines.push('#[derive(Debug, Clone)]');
    }
    lines.push(`pub struct ${name} {`);
    
    for (const [key, value] of Object.entries(obj)) {
      const fieldName = toSnakeCase(key);
      const rustType = getRustType(value, key, structs);
      
      if (useSerde && fieldName !== key) {
        lines.push(`    #[serde(rename = "${key}")]`);
      }
      lines.push(`    pub ${fieldName}: ${rustType},`);
    }
    
    lines.push('}');
    structs.set(name, lines.join('\n'));
  };

  const convert = () => {
    try {
      const parsed = JSON.parse(input);
      const structs = new Map<string, string>();
      
      if (Array.isArray(parsed)) {
        if (parsed.length > 0 && typeof parsed[0] === 'object') {
          generateStruct(parsed[0] as Record<string, unknown>, structName, structs);
        }
      } else if (typeof parsed === 'object' && parsed !== null) {
        generateStruct(parsed as Record<string, unknown>, structName, structs);
      }
      
      let result = '';
      if (useSerde) {
        result = 'use serde::{Deserialize, Serialize};\n\n';
      }
      result += Array.from(structs.values()).reverse().join('\n\n');
      setOutput(result);
    } catch {
      setOutput(t('errorInvalidJson'));
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
            {t('structName')}
          </label>
          <input
            type="text"
            value={structName}
            onChange={(e) => setStructName(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
          />
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <input
              type="checkbox"
              checked={useSerde}
              onChange={(e) => setUseSerde(e.target.checked)}
              className="rounded bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            />
            {t('useSerde')}
          </label>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <input
              type="checkbox"
              checked={useOption}
              onChange={(e) => setUseOption(e.target.checked)}
              className="rounded bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            />
            {t('useOptionForNull')}
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
            {t('input')}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-80 px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white font-mono text-sm"
            placeholder={t('inputPlaceholder')}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
            {t('output')}
          </label>
          <textarea
            value={output}
            readOnly
            className="w-full h-80 px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white font-mono text-sm"
            placeholder={t('outputPlaceholder')}
          />
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={convert}
          className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors"
        >
          {t('convert')}
        </button>
        <button
          onClick={copyToClipboard}
          disabled={!output}
          className="px-6 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-900 dark:text-white disabled:opacity-50 rounded-lg font-medium transition-colors"
        >
          {t('copy')}
        </button>
      </div>
    </div>
  );
}
