<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['json-to-form'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.json-to-form.${key}`;
  }

  // Types
  interface FormField {
  name: string;
  type: string;
  label: string;
  required: boolean;
  placeholder?: string;
  options?: string[];
}

  let input = $state('');

  let fields = $state([]);

  let formValues = $state({});

  let outputFormat = $state('html');

  let error = $state('');

  let copied = $state(false);

  let timerRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function inferFieldType(value: unknown): string {
    if (typeof value === 'boolean') return 'checkbox';
    if (typeof value === 'number') return 'number';
    if (typeof value === 'string') {
      if (value.includes('@')) return 'email';
      if (/^\d{4}-\d{2}-\d{2}/.test(value)) return 'date';
      if (value.length > 100) return 'textarea';
    }
    if (Array.isArray(value)) return 'select';
    return 'text';
  }
  function toLabel(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/[-_]/g, ' ')
      .replace(/^\w/, c => c.toUpperCase())
      .trim();
  }
  function parseJson() {
    error = '';
    fields = [];

    if (!input.trim()) {
      error = 'Input is empty';
      return;
    }

    try {
      const json = JSON.parse(input);
      
      if (typeof json !== 'object' || json === null || Array.isArray(json)) {
        error = 'Input must be a JSON object';
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

      fields = parsedFields;
      formValues = {};
    } catch {
      error = 'Invalid JSON';
    }
  }
  function generateHtml(): string {
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
  }
  function generateReact(): string {
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
  }
  function copyToClipboard() {
    const code = outputFormat === 'html' ? generateHtml() : generateReact();
    navigator.clipboard.writeText(code);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }
  function loadExample() {
    input = JSON.stringify({
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      birthDate: "1990-01-01",
      bio: "A long description about the user that should be a textarea...",
      newsletter: true,
      country: ["USA", "Canada", "UK", "Germany", "France"]
    }, null, 2);
  }

</script>


    <div class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('jsonInput')}
            </label>
            <textarea
              bind:value={input}
              placeholder={t('placeholder')}
              class="w-full h-64 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm"></textarea>
          </div>

          {#if error}
<div class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
              {error}
            </div>
{/if}

          <div class="flex gap-4">
            <button
              onclick={parseJson}
              class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {t('generate')}
            </button>
            <button
              onclick={loadExample}
              class="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
            >
              {t('loadExample')}
            </button>
          </div>
        </div>

        {#if fields.length > 0}
<div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('formPreview')}
              </label>
              <div class="p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                <form class="space-y-4">
                  {#each fields as field (field.name)}
<div >
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {field.label} {#if field.required}
<span class="text-red-500">*</span>
{/if}
                      </label>
                      {#if field.type === 'textarea'}
<textarea
                          name={field.name}
                          placeholder={field.placeholder}
                          value={formValues[field.name] || ''}
                          onchange={(e) => formValues = ({ ...formValues, [field.name]: e.target.value })}
                          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                          rows={3}
                        />
{:else if field.type === 'select'}
<select
                          name={field.name}
                          value={formValues[field.name] || ''}
                          onchange={(e) => formValues = ({ ...formValues, [field.name]: e.target.value })}
                          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        >
                          <option value="">Select...</option>
                          {#each field.options as opt (opt)}
<option  value={opt}>{opt}</option>
{/each}
                        </select>
{:else if field.type === 'checkbox'}
<input
                          type="checkbox"
                          name={field.name}
                          checked={formValues[field.name] === 'true'}
                          onchange={(e) => formValues = ({ ...formValues, [field.name]: String(e.target.checked) })}
                          class="rounded"
                        />
{:else}
<input
                          type={field.type}
                          name={field.name}
                          placeholder={field.placeholder}
                          value={formValues[field.name] || ''}
                          onchange={(e) => formValues = ({ ...formValues, [field.name]: e.target.value })}
                          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        />
{/if}
                    </div>
{/each}
                </form>
              </div>
            </div>

            <div class="flex gap-4 items-center">
              <select
                value={outputFormat}
                onchange={(e) => outputFormat = e.target.value as 'html' | 'react'}
                class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="html">HTML</option>
                <option value="react">React</option>
              </select>
              <button
                onclick={copyToClipboard}
                class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                {copied ? t('copied') : t('copyCode')}
              </button>
            </div>
          </div>
{/if}
      </div>
    </div>
  
