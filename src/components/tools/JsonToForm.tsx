'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface FormField {
  name: string;
  type: string;
  label: string;
  required: boolean;
  placeholder?: string;
  options?: string[];
}

export default function JsonToForm() {
  const t = useTranslations('tools.json-to-form');
  const [input, setInput] = useState('');
  const [fields, setFields] = useState<FormField[]>([]);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [outputFormat, setOutputFormat] = useState<'html' | 'react'>('html');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const inferFieldType = (value: unknown): string => {
    if (typeof value === 'boolean') return 'checkbox';
    if (typeof value === 'number') return 'number';
    if (typeof value === 'string') {
      if (value.includes('@')) return 'email';
      if (/^\d{4}-\d{2}-\d{2}/.test(value)) return 'date';
      if (value.length > 100) return 'textarea';
    }
    if (Array.isArray(value)) return 'select';
    return 'text';
  };

  const toLabel = (key: string): string => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/[-_]/g, ' ')
      .replace(/^\w/, c => c.toUpperCase())
      .trim();
  };

  const parseJson = () => {
    setError('');
    setFields([]);

    if (!input.trim()) {
      setError(t('errors.empty'));
      return;
    }

    try {
      const json = JSON.parse(input);
      
      if (typeof json !== 'object' || json === null || Array.isArray(json)) {
        setError(t('errors.notObject'));
        return;
      }

      const parsedFields: FormField[] = [];
      
      for (const [key, value] of Object.entries(json)) {
        const field: FormField = {
          name: key,
          type: inferFieldType(value),
          label: toLabel(key),
          required: value !== null && value !== '',
        };

        if (Array.isArray(value)) {
          field.options = value.map(String);
        }

        if (typeof value === 'string' && value) {
          field.placeholder = value;
        }

        parsedFields.push(field);
      }

      setFields(parsedFields);
      setFormValues({});
    } catch {
      setError(t('errors.invalidJson'));
    }
  };

  const generateHtml = (): string => {
    const lines = ['<form>'];
    
    for (const field of fields) {
      lines.push(`  <div class="form-group">`);
      lines.push(`    <label for="${field.name}">${field.label}</label>`);
      
      if (field.type === 'textarea') {
        lines.push(`    <textarea id="${field.name}" name="${field.name}"${field.required ? ' required' : ''}${field.placeholder ? ` placeholder="${field.placeholder}"` : ''}></textarea>`);
      } else if (field.type === 'select' && field.options) {
        lines.push(`    <select id="${field.name}" name="${field.name}"${field.required ? ' required' : ''}>`);
        for (const option of field.options) {
          lines.push(`      <option value="${option}">${option}</option>`);
        }
        lines.push(`    </select>`);
      } else if (field.type === 'checkbox') {
        lines.push(`    <input type="checkbox" id="${field.name}" name="${field.name}"${field.required ? ' required' : ''} />`);
      } else {
        lines.push(`    <input type="${field.type}" id="${field.name}" name="${field.name}"${field.required ? ' required' : ''}${field.placeholder ? ` placeholder="${field.placeholder}"` : ''} />`);
      }
      
      lines.push(`  </div>`);
    }
    
    lines.push(`  <button type="submit">Submit</button>`);
    lines.push('</form>');
    
    return lines.join('\n');
  };

  const generateReact = (): string => {
    const lines = [
      `import { useState } from 'react';`,
      '',
      `export default function GeneratedForm() {`,
      `  const [formData, setFormData] = useState({`,
    ];
    
    for (const field of fields) {
      const defaultValue = field.type === 'checkbox' ? 'false' : "''";
      lines.push(`    ${field.name}: ${defaultValue},`);
    }
    
    lines.push(`  });`);
    lines.push('');
    lines.push(`  const handleChange = (e) => {`);
    lines.push(`    const { name, value, type, checked } = e.target;`);
    lines.push(`    setFormData(prev => ({`);
    lines.push(`      ...prev,`);
    lines.push(`      [name]: type === 'checkbox' ? checked : value`);
    lines.push(`    }));`);
    lines.push(`  };`);
    lines.push('');
    lines.push(`  const handleSubmit = (e) => {`);
    lines.push(`    e.preventDefault();`);
    lines.push(`    console.log(formData);`);
    lines.push(`  };`);
    lines.push('');
    lines.push(`  return (`);
    lines.push(`    <form onSubmit={handleSubmit}>`);
    
    for (const field of fields) {
      lines.push(`      <div className="form-group">`);
      lines.push(`        <label htmlFor="${field.name}">${field.label}</label>`);
      
      if (field.type === 'textarea') {
        lines.push(`        <textarea`);
        lines.push(`          id="${field.name}"`);
        lines.push(`          name="${field.name}"`);
        lines.push(`          value={formData.${field.name}}`);
        lines.push(`          onChange={handleChange}`);
        if (field.required) lines.push(`          required`);
        lines.push(`        />`);
      } else if (field.type === 'select' && field.options) {
        lines.push(`        <select`);
        lines.push(`          id="${field.name}"`);
        lines.push(`          name="${field.name}"`);
        lines.push(`          value={formData.${field.name}}`);
        lines.push(`          onChange={handleChange}`);
        if (field.required) lines.push(`          required`);
        lines.push(`        >`);
        for (const option of field.options) {
          lines.push(`          <option value="${option}">${option}</option>`);
        }
        lines.push(`        </select>`);
      } else if (field.type === 'checkbox') {
        lines.push(`        <input`);
        lines.push(`          type="checkbox"`);
        lines.push(`          id="${field.name}"`);
        lines.push(`          name="${field.name}"`);
        lines.push(`          checked={formData.${field.name}}`);
        lines.push(`          onChange={handleChange}`);
        lines.push(`        />`);
      } else {
        lines.push(`        <input`);
        lines.push(`          type="${field.type}"`);
        lines.push(`          id="${field.name}"`);
        lines.push(`          name="${field.name}"`);
        lines.push(`          value={formData.${field.name}}`);
        lines.push(`          onChange={handleChange}`);
        if (field.required) lines.push(`          required`);
        lines.push(`        />`);
      }
      
      lines.push(`      </div>`);
    }
    
    lines.push(`      <button type="submit">Submit</button>`);
    lines.push(`    </form>`);
    lines.push(`  );`);
    lines.push(`}`);
    
    return lines.join('\n');
  };

  const copyToClipboard = () => {
    const code = outputFormat === 'html' ? generateHtml() : generateReact();
    navigator.clipboard.writeText(code);
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 2000);
  };

  const loadExample = () => {
    setInput(JSON.stringify({
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      birthDate: "1990-01-01",
      bio: "A long description about the user that should be a textarea...",
      newsletter: true,
      country: ["USA", "Canada", "UK", "Germany", "France"]
    }, null, 2));
  };

  useEffect(() => {

    return () => {

      if (timerRef.current) clearTimeout(timerRef.current);

    };

  }, []);


  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('jsonInput')}
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('placeholder')}
              className="w-full h-64 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm"
            />
          </div>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={parseJson}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {t('generate')}
            </button>
            <button
              onClick={loadExample}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
            >
              {t('loadExample')}
            </button>
          </div>
        </div>

        {fields.length > 0 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('formPreview')}
              </label>
              <div className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                <form className="space-y-4">
                  {fields.map((field) => (
                    <div key={field.name}>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {field.label} {field.required && <span className="text-red-500">*</span>}
                      </label>
                      {field.type === 'textarea' ? (
                        <textarea
                          name={field.name}
                          placeholder={field.placeholder}
                          value={formValues[field.name] || ''}
                          onChange={(e) => setFormValues(prev => ({ ...prev, [field.name]: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                          rows={3}
                        />
                      ) : field.type === 'select' ? (
                        <select
                          name={field.name}
                          value={formValues[field.name] || ''}
                          onChange={(e) => setFormValues(prev => ({ ...prev, [field.name]: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        >
                          <option value="">Select...</option>
                          {field.options?.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : field.type === 'checkbox' ? (
                        <input
                          type="checkbox"
                          name={field.name}
                          checked={formValues[field.name] === 'true'}
                          onChange={(e) => setFormValues(prev => ({ ...prev, [field.name]: String(e.target.checked) }))}
                          className="rounded"
                        />
                      ) : (
                        <input
                          type={field.type}
                          name={field.name}
                          placeholder={field.placeholder}
                          value={formValues[field.name] || ''}
                          onChange={(e) => setFormValues(prev => ({ ...prev, [field.name]: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        />
                      )}
                    </div>
                  ))}
                </form>
              </div>
            </div>

            <div className="flex gap-4 items-center">
              <select
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value as 'html' | 'react')}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="html">HTML</option>
                <option value="react">React</option>
              </select>
              <button
                onClick={copyToClipboard}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                {copied ? t('copied') : t('copyCode')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
