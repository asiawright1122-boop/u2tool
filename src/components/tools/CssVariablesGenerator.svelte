<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['css-variables-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.css-variables-generator.${key}`;
  }

  // Types
  interface CssVariable {
  id: string;
  name: string;
  value: string;
  type: 'color' | 'size' | 'font' | 'other';
}

  let variables = $state([
    { id: '1', name: 'primary-color', value: '#3b82f6', type: 'color' },
    { id: '2', name: 'secondary-color', value: '#10b981', type: 'color' },
    { id: '3', name: 'font-size-base', value: '16px', type: 'size' },
  ]);

  let prefix = $state('');

  let scope = $state(':root');

  // Functions
  function addVariable() {
    const newId = Date.now().toString();
    variables = [...variables, { id: newId, name: '', value: '', type: 'other' }];
  }
  function removeVariable(id: string) {
    variables = variables.filter(v => v.id !== id);
  }
  function updateVariable(id: string, field: keyof CssVariable, value: string) {
    variables = variables.map(v => 
      v.id === id ? { ...v, [field]: value } : v
    );
  }
  function generateCss(): string {
    if (variables.length === 0) return '';

    const varLines = variables
      .filter(v => v.name && v.value)
      .map(v => {
        const varName = prefix ? `--${prefix}-${v.name}` : `--${v.name}`;
        return `  ${varName}: ${v.value};`;
      })
      .join('\n');

    return `${scope} {\n${varLines}\n}`;
  }
  function generateScss(): string {
    return variables
      .filter(v => v.name && v.value)
      .map(v => {
        const varName = prefix ? `$${prefix}-${v.name}` : `$${v.name}`;
        return `${varName}: ${v.value};`;
      })
      .join('\n');
  }
  function generateJs(): string {
    const obj: Record<string, string> = {};
    variables
      .filter(v => v.name && v.value)
      .forEach(v => {
        const key = prefix ? `${prefix}${v.name.charAt(0).toUpperCase() + v.name.slice(1).replace(/-([a-z])/g, (_, c) => c.toUpperCase())}` : v.name.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
        obj[key] = v.value;
      });
    return `const cssVariables = ${JSON.stringify(obj, null, 2)};`;
  }
  function handleCopy(content: string) {
    navigator.clipboard.writeText(content);
  }
  function loadPreset(preset: 'light' | 'dark' | 'brand') {
    const presets: Record<string, CssVariable[]> = {
      light: [
        { id: '1', name: 'bg-primary', value: '#ffffff', type: 'color' },
        { id: '2', name: 'bg-secondary', value: '#f3f4f6', type: 'color' },
        { id: '3', name: 'text-primary', value: '#111827', type: 'color' },
        { id: '4', name: 'text-secondary', value: '#6b7280', type: 'color' },
        { id: '5', name: 'border-color', value: '#e5e7eb', type: 'color' },
      ],
      dark: [
        { id: '1', name: 'bg-primary', value: '#111827', type: 'color' },
        { id: '2', name: 'bg-secondary', value: '#1f2937', type: 'color' },
        { id: '3', name: 'text-primary', value: '#f9fafb', type: 'color' },
        { id: '4', name: 'text-secondary', value: '#9ca3af', type: 'color' },
        { id: '5', name: 'border-color', value: '#374151', type: 'color' },
      ],
      brand: [
        { id: '1', name: 'primary', value: '#3b82f6', type: 'color' },
        { id: '2', name: 'primary-hover', value: '#2563eb', type: 'color' },
        { id: '3', name: 'secondary', value: '#10b981', type: 'color' },
        { id: '4', name: 'accent', value: '#f59e0b', type: 'color' },
        { id: '5', name: 'danger', value: '#ef4444', type: 'color' },
      ],
    };
    variables = presets[preset];
  }
  const cssOutput = generateCss();
  const scssOutput = generateScss();
  const jsOutput = generateJs();

</script>


    <div class="space-y-6">
      <div class="flex flex-wrap gap-4 items-center">
        <div class="flex items-center gap-2">
          <label class="text-sm text-gray-600 dark:text-gray-300">{t('prefix')}:</label>
          <input
            type="text"
            bind:value={prefix}
            placeholder={t('prefixPlaceholder')}
            class="w-24 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>

        <div class="flex items-center gap-2">
          <label class="text-sm text-gray-600 dark:text-gray-300">{t('scope')}:</label>
          <select
            bind:value={scope}
            class="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value=":root">:root</option>
            <option value="body">body</option>
            <option value=".theme-light">.theme-light</option>
            <option value=".theme-dark">.theme-dark</option>
          </select>
        </div>

        <div class="flex gap-2">
          <span class="text-sm text-gray-600 dark:text-gray-300">{t('presets')}:</span>
          <button onclick={() => loadPreset('light')} class="text-sm px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white">
            {t('presetLight')}
          </button>
          <button onclick={() => loadPreset('dark')} class="text-sm px-2 py-1 bg-gray-700 dark:bg-gray-800 text-white rounded hover:bg-gray-600 dark:hover:bg-gray-700">
            {t('presetDark')}
          </button>
          <button onclick={() => loadPreset('brand')} class="text-sm px-2 py-1 bg-amber-100 text-amber-700 rounded hover:bg-amber-200">
            {t('presetBrand')}
          </button>
        </div>
      </div>

      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <h3 class="font-medium text-gray-100">{t('variables')}</h3>
          <button
            onclick={addVariable}
            class="px-3 py-1 text-sm btn-success rounded hover:bg-green-700"
          >
            + {t('addVariable')}
          </button>
        </div>

        <div class="space-y-2">
          {#each variables as variable (variable.id)}
<div  class="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-900 rounded-lg">
              <select
                value={variable.type}
                onchange={(e) => updateVariable(variable.id, 'type', e.target.value)}
                class="w-24 p-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <option value="color">{t('typeColor')}</option>
                <option value="size">{t('typeSize')}</option>
                <option value="font">{t('typeFont')}</option>
                <option value="other">{t('typeOther')}</option>
              </select>
              <input
                type="text"
                value={variable.name}
                onchange={(e) => updateVariable(variable.id, 'name', e.target.value)}
                placeholder={t('varNamePlaceholder')}
                class="flex-1 p-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono"
              />
              {#if variable.type === 'color'}
<div class="flex items-center gap-1">
                  <input
                    type="color"
                    value={variable.value || '#000000'}
                    onchange={(e) => updateVariable(variable.id, 'value', e.target.value)}
                    class="w-10 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={variable.value}
                    onchange={(e) => updateVariable(variable.id, 'value', e.target.value)}
                    class="w-28 p-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono"
                  />
                </div>
{:else}
<input
                  type="text"
                  value={variable.value}
                  onchange={(e) => updateVariable(variable.id, 'value', e.target.value)}
                  placeholder={t('varValuePlaceholder')}
                  class="w-40 p-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono"
                />
{/if}
              <button
                onclick={() => removeVariable(variable.id)}
                class="p-2 text-red-600 hover:text-red-800"
              >
                ✕
              </button>
            </div>
{/each}
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">{t('cssLabel')}</label>
            <button onclick={() => handleCopy(cssOutput)} class="text-sm text-amber-600 hover:text-amber-800">
              {t('copy')}
            </button>
          </div>
          <pre class="h-48 p-3 bg-gray-100 dark:bg-gray-900 text-green-700 dark:text-green-400 rounded-lg overflow-auto text-xs font-mono">
            {cssOutput || t('noOutput')}
          </pre>
        </div>

        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">{t('scssLabel')}</label>
            <button onclick={() => handleCopy(scssOutput)} class="text-sm text-amber-600 hover:text-amber-800">
              {t('copy')}
            </button>
          </div>
          <pre class="h-48 p-3 bg-gray-100 dark:bg-gray-900 text-pink-700 dark:text-pink-400 rounded-lg overflow-auto text-xs font-mono">
            {scssOutput || t('noOutput')}
          </pre>
        </div>

        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">{t('jsLabel')}</label>
            <button onclick={() => handleCopy(jsOutput)} class="text-sm text-amber-600 hover:text-amber-800">
              {t('copy')}
            </button>
          </div>
          <pre class="h-48 p-3 bg-gray-100 dark:bg-gray-900 text-yellow-700 dark:text-yellow-400 rounded-lg overflow-auto text-xs font-mono">
            {jsOutput || t('noOutput')}
          </pre>
        </div>
      </div>
    </div>
  
