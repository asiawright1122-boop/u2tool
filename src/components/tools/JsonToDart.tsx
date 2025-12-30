'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function toCamelCase(str: string): string {
  return str.replace(/[-_](.)/g, (_, c) => c.toUpperCase());
}

function toPascalCase(str: string): string {
  const camel = toCamelCase(str);
  return capitalize(camel);
}

function getDartType(value: unknown): string {
  if (value === null) return 'dynamic';
  if (typeof value === 'string') return 'String';
  if (typeof value === 'number') return Number.isInteger(value) ? 'int' : 'double';
  if (typeof value === 'boolean') return 'bool';
  if (Array.isArray(value)) {
    if (value.length === 0) return 'List<dynamic>';
    return `List<${getDartType(value[0])}>`;
  }
  if (typeof value === 'object') return 'Map<String, dynamic>';
  return 'dynamic';
}

function jsonToDart(json: string, className: string): string {
  const obj = JSON.parse(json);
  const lines: string[] = [];
  
  lines.push(`class ${toPascalCase(className)} {`);
  
  // 字段声明
  for (const [key, value] of Object.entries(obj)) {
    const dartType = getDartType(value);
    lines.push(`  final ${dartType}? ${toCamelCase(key)};`);
  }
  
  lines.push('');
  
  // 构造函数
  lines.push(`  ${toPascalCase(className)}({`);
  for (const key of Object.keys(obj)) {
    lines.push(`    this.${toCamelCase(key)},`);
  }
  lines.push('  });');
  
  lines.push('');

  // fromJson 工厂方法
  lines.push(`  factory ${toPascalCase(className)}.fromJson(Map<String, dynamic> json) {`);
  lines.push(`    return ${toPascalCase(className)}(`);
  for (const [key, value] of Object.entries(obj)) {
    const dartType = getDartType(value);
    if (dartType.startsWith('List')) {
      lines.push(`      ${toCamelCase(key)}: json['${key}'] != null ? List<${getDartType((value as unknown[])[0])}>.from(json['${key}']) : null,`);
    } else {
      lines.push(`      ${toCamelCase(key)}: json['${key}'],`);
    }
  }
  lines.push('    );');
  lines.push('  }');
  
  lines.push('');
  
  // toJson 方法
  lines.push('  Map<String, dynamic> toJson() {');
  lines.push('    return {');
  for (const key of Object.keys(obj)) {
    lines.push(`      '${key}': ${toCamelCase(key)},`);
  }
  lines.push('    };');
  lines.push('  }');
  
  lines.push('}');
  
  return lines.join('\n');
}

export default function JsonToDart() {
  const t = useTranslations('tools.json-to-dart');
  const [input, setInput] = useState('{\n  "id": 1,\n  "name": "John",\n  "email": "john@example.com",\n  "is_active": true\n}');
  const [className, setClassName] = useState('User');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleConvert = () => {
    try {
      setError('');
      setOutput(jsonToDart(input, className));
    } catch (_e) {
      setError(_e instanceof Error ? _e.message : 'Invalid JSON');
      setOutput('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{t('className')}</label>
          <input type="text" value={className} onChange={(e) => setClassName(e.target.value)}
            className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white" />
        </div>
        <button onClick={handleConvert} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          {t('convert')}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">JSON</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)}
            className="w-full h-64 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white font-mono text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Dart</label>
          <textarea value={output} readOnly
            className="w-full h-64 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-green-600 dark:text-green-400 font-mono text-sm" />
        </div>
      </div>
      {error && <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 rounded-lg text-red-700 dark:text-red-400">{error}</div>}
    </div>
  );
}
