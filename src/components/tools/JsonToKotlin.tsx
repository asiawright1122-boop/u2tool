'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface KotlinOptions {
  className: string;
  packageName: string;
  useDataClass: boolean;
  useNullable: boolean;
  useMoshi: boolean;
  useGson: boolean;
  useKotlinx: boolean;
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function toKotlinType(value: unknown, key: string, nullable: boolean): string {
  const suffix = nullable && value === null ? '?' : '';
  
  if (value === null) return `Any${suffix}`;
  if (typeof value === 'string') return `String${suffix}`;
  if (typeof value === 'boolean') return `Boolean${suffix}`;
  if (typeof value === 'number') {
    return Number.isInteger(value) ? `Int${suffix}` : `Double${suffix}`;
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return `List<Any>${suffix}`;
    const itemType = toKotlinType(value[0], key, false);
    return `List<${itemType}>${suffix}`;
  }
  if (typeof value === 'object') {
    return `${capitalizeFirst(key)}${suffix}`;
  }
  return `Any${suffix}`;
}

function generateKotlinClass(
  obj: Record<string, unknown>,
  className: string,
  options: KotlinOptions,
  isNested = false
): { main: string; nested: string[] } {
  const nested: string[] = [];
  const fields: string[] = [];
  
  for (const [key, value] of Object.entries(obj)) {
    const kotlinType = toKotlinType(value, key, options.useNullable);
    
    let annotation = '';
    if (options.useMoshi) {
      annotation = `    @Json(name = "${key}")\n`;
    } else if (options.useGson) {
      annotation = `    @SerializedName("${key}")\n`;
    } else if (options.useKotlinx) {
      annotation = `    @SerialName("${key}")\n`;
    }
    
    fields.push(`${annotation}    val ${key}: ${kotlinType}`);
    
    // Generate nested classes for objects
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      const nestedResult = generateKotlinClass(
        value as Record<string, unknown>,
        capitalizeFirst(key),
        { ...options, packageName: '' },
        true
      );
      nested.push(nestedResult.main);
      nested.push(...nestedResult.nested);
    }
    
    // Handle array of objects
    if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
      const nestedResult = generateKotlinClass(
        value[0] as Record<string, unknown>,
        capitalizeFirst(key),
        { ...options, packageName: '' },
        true
      );
      nested.push(nestedResult.main);
      nested.push(...nestedResult.nested);
    }
  }
  
  let classContent = '';
  
  // Package declaration (only for main class)
  if (options.packageName && !isNested) {
    classContent += `package ${options.packageName}\n\n`;
  }
  
  // Imports (only for main class)
  if (!isNested) {
    const imports: string[] = [];
    if (options.useMoshi) {
      imports.push('import com.squareup.moshi.Json');
      imports.push('import com.squareup.moshi.JsonClass');
    }
    if (options.useGson) {
      imports.push('import com.google.gson.annotations.SerializedName');
    }
    if (options.useKotlinx) {
      imports.push('import kotlinx.serialization.SerialName');
      imports.push('import kotlinx.serialization.Serializable');
    }
    if (imports.length > 0) {
      classContent += imports.join('\n') + '\n\n';
    }
  }
  
  // Class annotation
  if (options.useMoshi) {
    classContent += '@JsonClass(generateAdapter = true)\n';
  } else if (options.useKotlinx) {
    classContent += '@Serializable\n';
  }
  
  // Class declaration
  const classKeyword = options.useDataClass ? 'data class' : 'class';
  classContent += `${classKeyword} ${className}(\n${fields.join(',\n')}\n)`;
  
  return { main: classContent, nested };
}

export default function JsonToKotlin() {
  const t = useTranslations('tools.json-to-kotlin');
  const tg = useTranslations('tools');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [options, setOptions] = useState<KotlinOptions>({
    className: 'MyClass',
    packageName: 'com.example',
    useDataClass: true,
    useNullable: true,
    useMoshi: false,
    useGson: false,
    useKotlinx: false,
  });

  const convert = () => {
    setError('');
    try {
      const parsed = JSON.parse(input);
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        throw new Error('Input must be a JSON object');
      }
      
      const result = generateKotlinClass(parsed, options.className, options);
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

  const handleSerializerChange = (serializer: 'none' | 'moshi' | 'gson' | 'kotlinx') => {
    setOptions({
      ...options,
      useMoshi: serializer === 'moshi',
      useGson: serializer === 'gson',
      useKotlinx: serializer === 'kotlinx',
    });
  };

  return (
    <div className="space-y-6">
      {/* Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
        <div>
          <label className="block text-sm text-gray-300 mb-1">{t('serializer')}</label>
          <select
            value={options.useMoshi ? 'moshi' : options.useGson ? 'gson' : options.useKotlinx ? 'kotlinx' : 'none'}
            onChange={(e) => handleSerializerChange(e.target.value as 'none' | 'moshi' | 'gson' | 'kotlinx')}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm"
          >
            <option value="none">{t('noSerializer')}</option>
            <option value="moshi">Moshi</option>
            <option value="gson">Gson</option>
            <option value="kotlinx">Kotlinx Serialization</option>
          </select>
        </div>
        <div className="flex flex-col gap-2 justify-center">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={options.useDataClass}
              onChange={(e) => setOptions({ ...options, useDataClass: e.target.checked })}
              className="rounded bg-gray-700 border-gray-600"
            />
            {t('useDataClass')}
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={options.useNullable}
              onChange={(e) => setOptions({ ...options, useNullable: e.target.checked })}
              className="rounded bg-gray-700 border-gray-600"
            />
            {t('useNullable')}
          </label>
        </div>
      </div>

      {/* Input/Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-300">{t('input')}</label>
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
            <label className="text-sm font-medium text-gray-300">{t('output')}</label>
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
