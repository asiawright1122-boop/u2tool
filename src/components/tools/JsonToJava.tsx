'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface JavaOptions {
  className: string;
  packageName: string;
  useLombok: boolean;
  useGettersSetters: boolean;
  useBuilder: boolean;
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function toJavaType(value: unknown, key: string): string {
  if (value === null) return 'Object';
  if (typeof value === 'string') return 'String';
  if (typeof value === 'boolean') return 'Boolean';
  if (typeof value === 'number') {
    return Number.isInteger(value) ? 'Integer' : 'Double';
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return 'List<Object>';
    const itemType = toJavaType(value[0], key);
    return `List<${itemType}>`;
  }
  if (typeof value === 'object') {
    return capitalizeFirst(key);
  }
  return 'Object';
}

function generateJavaClass(
  obj: Record<string, unknown>,
  className: string,
  options: JavaOptions,
  indent = ''
): { main: string; nested: string[] } {
  const nested: string[] = [];
  const fields: string[] = [];
  const gettersSetters: string[] = [];
  
  for (const [key, value] of Object.entries(obj)) {
    const javaType = toJavaType(value, key);
    fields.push(`${indent}    private ${javaType} ${key};`);
    
    // Generate nested classes for objects
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      const nestedResult = generateJavaClass(
        value as Record<string, unknown>,
        capitalizeFirst(key),
        { ...options, packageName: '' },
        ''
      );
      nested.push(nestedResult.main);
      nested.push(...nestedResult.nested);
    }
    
    // Handle array of objects
    if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
      const nestedResult = generateJavaClass(
        value[0] as Record<string, unknown>,
        capitalizeFirst(key),
        { ...options, packageName: '' },
        ''
      );
      nested.push(nestedResult.main);
      nested.push(...nestedResult.nested);
    }
    
    if (options.useGettersSetters && !options.useLombok) {
      const capitalizedKey = capitalizeFirst(key);
      gettersSetters.push(`
${indent}    public ${javaType} get${capitalizedKey}() {
${indent}        return ${key};
${indent}    }

${indent}    public void set${capitalizedKey}(${javaType} ${key}) {
${indent}        this.${key} = ${key};
${indent}    }`);
    }
  }
  
  let classContent = '';
  
  // Package declaration
  if (options.packageName) {
    classContent += `package ${options.packageName};\n\n`;
  }
  
  // Imports
  const imports: string[] = [];
  const fieldsStr = fields.join('\n');
  if (fieldsStr.includes('List<')) {
    imports.push('import java.util.List;');
  }
  if (options.useLombok) {
    imports.push('import lombok.Data;');
    if (options.useBuilder) {
      imports.push('import lombok.Builder;');
    }
  }
  if (imports.length > 0) {
    classContent += imports.join('\n') + '\n\n';
  }
  
  // Lombok annotations
  if (options.useLombok) {
    classContent += `${indent}@Data\n`;
    if (options.useBuilder) {
      classContent += `${indent}@Builder\n`;
    }
  }
  
  // Class declaration
  classContent += `${indent}public class ${className} {\n`;
  classContent += fields.join('\n');
  
  if (gettersSetters.length > 0) {
    classContent += '\n' + gettersSetters.join('\n');
  }
  
  classContent += `\n${indent}}`;
  
  return { main: classContent, nested };
}

export default function JsonToJava() {
  const t = useTranslations('tools.json-to-java');
  const tg = useTranslations('tools');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [options, setOptions] = useState<JavaOptions>({
    className: 'MyClass',
    packageName: 'com.example',
    useLombok: false,
    useGettersSetters: true,
    useBuilder: false,
  });

  const convert = () => {
    setError('');
    try {
      const parsed = JSON.parse(input);
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        throw new Error('Input must be a JSON object');
      }
      
      const result = generateJavaClass(parsed, options.className, options);
      const allClasses = [result.main, ...result.nested].join('\n\n');
      setOutput(allClasses);
    } catch (_err) {
      setError(err instanceof Error ? err.message : tg('errorProcessing'));
      setOutput('');
    }
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
  };

  const loadSample = () => {
    setInput(`{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "active": true,
  "score": 95.5,
  "tags": ["developer", "admin"],
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "zipCode": "10001"
  }
}`);
    setOutput('');
    setError('');
  };

  return (
    <div className="space-y-6">
      {/* Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-gray-300 mb-1">{t('className')}</label>
          <input
            type="text"
            value={options.className}
            onChange={(e) => setOptions({ ...options, className: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">{t('packageName')}</label>
          <input
            type="text"
            value={options.packageName}
            onChange={(e) => setOptions({ ...options, packageName: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={options.useLombok}
              onChange={(e) => setOptions({ ...options, useLombok: e.target.checked })}
              className="rounded bg-gray-700 border-gray-600"
            />
            {t('useLombok')}
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={options.useGettersSetters}
              onChange={(e) => setOptions({ ...options, useGettersSetters: e.target.checked })}
              disabled={options.useLombok}
              className="rounded bg-gray-700 border-gray-600"
            />
            {t('useGettersSetters')}
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={options.useBuilder}
              onChange={(e) => setOptions({ ...options, useBuilder: e.target.checked })}
              disabled={!options.useLombok}
              className="rounded bg-gray-700 border-gray-600"
            />
            {t('useBuilder')}
          </label>
        </div>
      </div>

      {/* Input/Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-300">JSON</label>
            <button
              onClick={loadSample}
              className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs"
            >
              {t('loadSample')}
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('inputPlaceholder')}
            className="w-full h-96 bg-gray-800 border border-gray-700 rounded-lg p-4 font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-300">Java</label>
            <button
              onClick={copyOutput}
              disabled={!output}
              className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs disabled:opacity-50"
            >
              {t('copy')}
            </button>
          </div>
          <textarea
            value={output}
            readOnly
            placeholder={t('outputPlaceholder')}
            className="w-full h-96 bg-gray-800 border border-gray-700 rounded-lg p-4 font-mono text-sm resize-none"
          />
        </div>
      </div>

      {/* Convert Button */}
      <div className="flex justify-center">
        <button
          onClick={convert}
          disabled={!input.trim()}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-medium"
        >
          {t('convert')}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-300">
          {error}
        </div>
      )}
    </div>
  );
}
