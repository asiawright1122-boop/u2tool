'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface ValidationError {
  path: string;
  message: string;
}

export default function JsonSchemaValidator() {
  const t = useTranslations('tools');
  const [jsonInput, setJsonInput] = useState('');
  const [schemaInput, setSchemaInput] = useState('');
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const validateType = (value: unknown, type: string): boolean => {
    if (type === 'string') return typeof value === 'string';
    if (type === 'number') return typeof value === 'number';
    if (type === 'integer') return typeof value === 'number' && Number.isInteger(value);
    if (type === 'boolean') return typeof value === 'boolean';
    if (type === 'array') return Array.isArray(value);
    if (type === 'object') return typeof value === 'object' && value !== null && !Array.isArray(value);
    if (type === 'null') return value === null;
    return true;
  };

  const validate = (data: unknown, schema: Record<string, unknown>, path = ''): ValidationError[] => {
    const errs: ValidationError[] = [];
    
    // Type check
    if (schema.type) {
      const types = Array.isArray(schema.type) ? schema.type : [schema.type];
      if (!types.some(tp => validateType(data, tp as string))) {
        errs.push({ path: path || 'root', message: t('schemaValidator.expectedType', { expected: String(schema.type), actual: typeof data }) });
      }
    }

    // Required properties
    if (schema.required && Array.isArray(schema.required) && typeof data === 'object' && data !== null) {
      for (const prop of schema.required as string[]) {
        if (!(prop in (data as Record<string, unknown>))) {
          errs.push({ path: `${path}.${prop}`, message: t('schemaValidator.missingRequired', { prop }) });
        }
      }
    }

    // Properties
    if (schema.properties && typeof data === 'object' && data !== null) {
      const props = schema.properties as Record<string, Record<string, unknown>>;
      for (const [key, propSchema] of Object.entries(props)) {
        if (key in (data as Record<string, unknown>)) {
          errs.push(...validate((data as Record<string, unknown>)[key], propSchema, `${path}.${key}`));
        }
      }
    }

    // Array items
    if (schema.items && Array.isArray(data)) {
      data.forEach((item, i) => {
        errs.push(...validate(item, schema.items as Record<string, unknown>, `${path}[${i}]`));
      });
    }

    // Min/max length for strings
    if (typeof data === 'string') {
      if (schema.minLength && data.length < (schema.minLength as number)) {
        errs.push({ path, message: t('schemaValidator.stringTooShort', { min: String(schema.minLength) }) });
      }
      if (schema.maxLength && data.length > (schema.maxLength as number)) {
        errs.push({ path, message: t('schemaValidator.stringTooLong', { max: String(schema.maxLength) }) });
      }
    }

    // Min/max for numbers
    if (typeof data === 'number') {
      if (schema.minimum !== undefined && data < (schema.minimum as number)) {
        errs.push({ path, message: t('schemaValidator.numberTooSmall', { min: String(schema.minimum) }) });
      }
      if (schema.maximum !== undefined && data > (schema.maximum as number)) {
        errs.push({ path, message: t('schemaValidator.numberTooLarge', { max: String(schema.maximum) }) });
      }
    }

    return errs;
  };

  const handleValidate = () => {
    try {
      const data = JSON.parse(jsonInput);
      const schema = JSON.parse(schemaInput);
      const validationErrors = validate(data, schema);
      setErrors(validationErrors);
      setIsValid(validationErrors.length === 0);
    } catch (_e) {
      setErrors([{ path: 'parse', message: (_e as Error).message }]);
      setIsValid(false);
    }
  };

  const loadExample = () => {
    setJsonInput(JSON.stringify({
      name: "John",
      age: 30,
      email: "john@example.com"
    }, null, 2));
    setSchemaInput(JSON.stringify({
      type: "object",
      required: ["name", "age"],
      properties: {
        name: { type: "string", minLength: 1 },
        age: { type: "integer", minimum: 0 },
        email: { type: "string" }
      }
    }, null, 2));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={loadExample} className="text-sm text-blue-400 hover:text-blue-300">
          {t('schemaValidator.loadExample')}
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">JSON</label>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="w-full h-48 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-3 font-mono text-sm text-gray-900 dark:text-gray-100"
            placeholder={t('schemaValidator.jsonPlaceholder')}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">JSON Schema</label>
          <textarea
            value={schemaInput}
            onChange={(e) => setSchemaInput(e.target.value)}
            className="w-full h-48 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-3 font-mono text-sm text-gray-900 dark:text-gray-100"
            placeholder={t('schemaValidator.schemaPlaceholder')}
          />
        </div>
      </div>

      <button
        onClick={handleValidate}
        className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-medium"
      >
        {t('schemaValidator.validate')}
      </button>

      {isValid !== null && (
        <div className={`p-4 rounded ${isValid ? 'bg-green-100 dark:bg-green-900/50' : 'bg-red-100 dark:bg-red-900/50'}`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{isValid ? '✅' : '❌'}</span>
            <span className="font-medium">
              {isValid ? t('schemaValidator.valid') : t('schemaValidator.invalid')}
            </span>
          </div>
          {errors.length > 0 && (
            <ul className="text-sm space-y-1">
              {errors.map((err, i) => (
                <li key={i} className="text-red-300">
                  <code className="text-yellow-400">{err.path}</code>: {err.message}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
