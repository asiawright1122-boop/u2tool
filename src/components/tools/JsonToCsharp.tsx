'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function JsonToCsharp() {
  const t = useTranslations('tools.json-to-csharp');
  const tg = useTranslations('tools');
  const [input, setInput] = useState('{\n  "id": 1,\n  "name": "John Doe",\n  "email": "john@example.com",\n  "isActive": true,\n  "tags": ["developer", "designer"],\n  "address": {\n    "street": "123 Main St",\n    "city": "New York"\n  }\n}');
  const [output, setOutput] = useState('');
  const [className, setClassName] = useState('Root');
  const [useProperties, setUseProperties] = useState(true);
  const [useNullable, setUseNullable] = useState(true);

  const getCSharpType = (value: unknown, key: string, classes: Map<string, string>): string => {
    if (value === null) return useNullable ? 'object?' : 'object';
    if (typeof value === 'string') return 'string';
    if (typeof value === 'number') {
      return Number.isInteger(value) ? 'int' : 'double';
    }
    if (typeof value === 'boolean') return 'bool';
    if (Array.isArray(value)) {
      if (value.length === 0) return 'List<object>';
      const itemType = getCSharpType(value[0], key, classes);
      return `List<${itemType}>`;
    }
    if (typeof value === 'object') {
      const nestedClassName = key.charAt(0).toUpperCase() + key.slice(1);
      generateClass(value as Record<string, unknown>, nestedClassName, classes);
      return nestedClassName;
    }
    return 'object';
  };

  const generateClass = (obj: Record<string, unknown>, name: string, classes: Map<string, string>) => {
    const lines: string[] = [];
    lines.push(`public class ${name}`);
    lines.push('{');
    
    for (const [key, value] of Object.entries(obj)) {
      const propName = key.charAt(0).toUpperCase() + key.slice(1);
      const csharpType = getCSharpType(value, key, classes);
      
      if (useProperties) {
        lines.push(`    public ${csharpType} ${propName} { get; set; }`);
      } else {
        lines.push(`    public ${csharpType} ${propName};`);
      }
    }
    
    lines.push('}');
    classes.set(name, lines.join('\n'));
  };

  const convert = () => {
    try {
      const parsed = JSON.parse(input);
      const classes = new Map<string, string>();
      
      if (Array.isArray(parsed)) {
        if (parsed.length > 0 && typeof parsed[0] === 'object') {
          generateClass(parsed[0] as Record<string, unknown>, className, classes);
        }
      } else if (typeof parsed === 'object' && parsed !== null) {
        generateClass(parsed as Record<string, unknown>, className, classes);
      }
      
      const result = Array.from(classes.values()).reverse().join('\n\n');
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
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t('className')}
          </label>
          <input
            type="text"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
          />
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-gray-300">
            <input
              type="checkbox"
              checked={useProperties}
              onChange={(e) => setUseProperties(e.target.checked)}
              className="rounded bg-gray-700 border-gray-600"
            />
            {t('useProperties')}
          </label>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-gray-300">
            <input
              type="checkbox"
              checked={useNullable}
              onChange={(e) => setUseNullable(e.target.checked)}
              className="rounded bg-gray-700 border-gray-600"
            />
            {t('useNullable')}
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t('input')}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-80 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white font-mono text-sm"
            placeholder={t('inputPlaceholder')}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t('output')}
          </label>
          <textarea
            value={output}
            readOnly
            className="w-full h-80 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white font-mono text-sm"
            placeholder={t('outputPlaceholder')}
          />
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={convert}
          className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
        >
          {t('convert')}
        </button>
        <button
          onClick={copyToClipboard}
          disabled={!output}
          className="px-6 py-2 bg-gray-600 hover:bg-gray-9000 disabled:opacity-50 rounded-lg font-medium transition-colors"
        >
          {t('copy')}
        </button>
      </div>
    </div>
  );
}
