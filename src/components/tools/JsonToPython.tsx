'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface PythonOptions {
  className: string;
  useDataclass: boolean;
  usePydantic: boolean;
  useTypedDict: boolean;
  useOptional: boolean;
}

function toSnakeCase(str: string): string {
  return str.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '');
}

function toPythonType(value: unknown, key: string): string {
  if (value === null) return 'None';
  if (typeof value === 'string') return 'str';
  if (typeof value === 'boolean') return 'bool';
  if (typeof value === 'number') {
    return Number.isInteger(value) ? 'int' : 'float';
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return 'list';
    const itemType = toPythonType(value[0], key);
    return `list[${itemType}]`;
  }
  if (typeof value === 'object') {
    return key.charAt(0).toUpperCase() + key.slice(1);
  }
  return 'Any';
}

function generateDataclass(
  obj: Record<string, unknown>,
  className: string,
  options: PythonOptions
): { main: string; nested: string[] } {
  const nested: string[] = [];
  const fields: string[] = [];
  
  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = toSnakeCase(key);
    let pythonType = toPythonType(value, key);
    
    if (options.useOptional && value === null) {
      pythonType = `Optional[${pythonType}]`;
    }
    
    fields.push(`    ${snakeKey}: ${pythonType}`);
    
    // Generate nested classes for objects
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      const nestedResult = generateDataclass(
        value as Record<string, unknown>,
        key.charAt(0).toUpperCase() + key.slice(1),
        options
      );
      nested.unshift(nestedResult.main);
      nested.unshift(...nestedResult.nested);
    }
    
    // Handle array of objects
    if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
      const nestedResult = generateDataclass(
        value[0] as Record<string, unknown>,
        key.charAt(0).toUpperCase() + key.slice(1),
        options
      );
      nested.unshift(nestedResult.main);
      nested.unshift(...nestedResult.nested);
    }
  }
  
  let classContent = '';
  
  if (options.useDataclass) {
    classContent = `@dataclass\nclass ${className}:\n${fields.join('\n')}`;
  } else if (options.usePydantic) {
    classContent = `class ${className}(BaseModel):\n${fields.join('\n')}`;
  } else if (options.useTypedDict) {
    classContent = `class ${className}(TypedDict):\n${fields.join('\n')}`;
  } else {
    // Plain class
    const initParams = Object.entries(obj).map(([key, value]) => {
      const snakeKey = toSnakeCase(key);
      const pythonType = toPythonType(value, key);
      return `${snakeKey}: ${pythonType}`;
    }).join(', ');
    
    const initBody = Object.keys(obj).map(key => {
      const snakeKey = toSnakeCase(key);
      return `        self.${snakeKey} = ${snakeKey}`;
    }).join('\n');
    
    classContent = `class ${className}:\n    def __init__(self, ${initParams}):\n${initBody}`;
  }
  
  return { main: classContent, nested };
}

function generateImports(options: PythonOptions, hasOptional: boolean, hasNested: boolean): string {
  const imports: string[] = [];
  
  if (options.useDataclass) {
    imports.push('from dataclasses import dataclass');
  }
  if (options.usePydantic) {
    imports.push('from pydantic import BaseModel');
  }
  if (options.useTypedDict) {
    imports.push('from typing import TypedDict');
  }
  if (hasOptional && options.useOptional) {
    imports.push('from typing import Optional');
  }
  if (hasNested || !options.useDataclass && !options.usePydantic && !options.useTypedDict) {
    // May need list type hint
  }
  
  return imports.length > 0 ? imports.join('\n') + '\n\n' : '';
}

export default function JsonToPython() {
  const t = useTranslations('tools.json-to-python');
  const tg = useTranslations('tools');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [options, setOptions] = useState<PythonOptions>({
    className: 'MyClass',
    useDataclass: true,
    usePydantic: false,
    useTypedDict: false,
    useOptional: true,
  });

  const convert = () => {
    setError('');
    try {
      const parsed = JSON.parse(input);
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        throw new Error('Input must be a JSON object');
      }
      
      const hasNull = JSON.stringify(parsed).includes('null');
      const result = generateDataclass(parsed, options.className, options);
      const imports = generateImports(options, hasNull, result.nested.length > 0);
      const allClasses = [...result.nested, result.main].join('\n\n');
      setOutput(imports + allClasses);
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
  "userName": "johnDoe",
  "email": "john@example.com",
  "isActive": true,
  "score": 95.5,
  "tags": ["developer", "admin"],
  "address": {
    "streetName": "123 Main St",
    "city": "New York",
    "zipCode": "10001"
  }
}`);
    setOutput('');
    setError('');
  };

  const handleStyleChange = (style: 'dataclass' | 'pydantic' | 'typeddict' | 'plain') => {
    setOptions({
      ...options,
      useDataclass: style === 'dataclass',
      usePydantic: style === 'pydantic',
      useTypedDict: style === 'typeddict',
    });
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
          <label className="block text-sm text-gray-300 mb-1">{t('style')}</label>
          <select
            value={options.useDataclass ? 'dataclass' : options.usePydantic ? 'pydantic' : options.useTypedDict ? 'typeddict' : 'plain'}
            onChange={(e) => handleStyleChange(e.target.value as 'dataclass' | 'pydantic' | 'typeddict' | 'plain')}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm"
          >
            <option value="dataclass">@dataclass</option>
            <option value="pydantic">Pydantic BaseModel</option>
            <option value="typeddict">TypedDict</option>
            <option value="plain">Plain Class</option>
          </select>
        </div>
        <div className="flex items-center">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={options.useOptional}
              onChange={(e) => setOptions({ ...options, useOptional: e.target.checked })}
              className="rounded bg-gray-700 border-gray-600"
            />
            {t('useOptional')}
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
            <label className="text-sm font-medium text-gray-300">Python</label>
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
