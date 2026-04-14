<script lang="ts">
  import { onDestroy } from 'svelte';
  import { defaultDirectives } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['csp-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.csp-generator.${key}`;
  }

  // Types
  interface CspDirective {
  name: string;
  description: string;
  values: string[];
  enabled: boolean;
}

  let directives = $state(defaultDirectives);

  let copied = $state(false);

  let outputFormat = $state('header');

  let timerRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function toggleDirective(index: number) {
    const newDirectives = [...directives];
    newDirectives[index].enabled = !newDirectives[index].enabled;
    directives = newDirectives;
  }
  function updateValues(index: number, values: string[]) {
    const newDirectives = [...directives];
    newDirectives[index].values = values;
    directives = newDirectives;
  }
  function addValue(index: number, value: string) {
    if (!value.trim()) return;
    const newDirectives = [...directives];
    if (!newDirectives[index].values.includes(value)) {
      newDirectives[index].values.push(value);
      directives = newDirectives;
    }
  }
  function removeValue(directiveIndex: number, valueIndex: number) {
    const newDirectives = [...directives];
    newDirectives[directiveIndex].values.splice(valueIndex, 1);
    directives = newDirectives;
  }
  function generateCsp(): string {
    const parts = directives
      .filter(d => d.enabled)
      .map(d => {
        if (d.values.length === 0) {
          return d.name;
        }
        return `${d.name} ${d.values.join(' ')}`;
      });

    return parts.join('; ');
  }
  function getOutput(): string {
    const csp = generateCsp();
    if (outputFormat === 'meta') {
      return `<meta http-equiv="Content-Security-Policy" content="${csp}">`;
    }
    return `Content-Security-Policy: ${csp}`;
  }
  function copyToClipboard() {
    navigator.clipboard.writeText(getOutput());
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }
  function resetToDefaults() {
    directives = defaultDirectives.map(d => ({ ...d, values: [...d.values] }));
  }

</script>


    <div class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            {t('directives')}
          </h3>

          <div class="space-y-3 max-h-[500px] overflow-y-auto pr-2">
            {#each directives as directive, index (directive.name)}
<div 
                class={`p-4 border rounded-lg ${directive.enabled
                    ? 'border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20'
                    : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800'
                  }`}
              >
                <div class="flex items-center justify-between mb-2">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={directive.enabled}
                      onchange={() => toggleDirective(index)}
                      class="rounded"
                    />
                    <span class="font-mono font-medium text-gray-900 dark:text-white">
                      {directive.name}
                    </span>
                  </label>
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  {directive.description}
                </p>

                {#if directive.enabled}
{#if directive.name !== 'upgrade-insecure-requests' && directive.name !== 'block-all-mixed-content'}
                  <div class="space-y-2">
                    <div class="flex flex-wrap gap-1">
                      {#each directive.values as value, valueIndex (valueIndex)}
<span 
                          class="inline-flex items-center gap-1 px-2 py-1 bg-white dark:bg-gray-700 rounded text-xs font-mono"
                        >
                          {value}
                          <button
                            onclick={() => removeValue(index, valueIndex)}
                            class="text-red-500 hover:text-red-600"
                          >
                            ×
                          </button>
                        </span>
{/each}
                    </div>
                    <select
                      onchange={(e) => {
                        addValue(index, e.target.value);
                        e.target.value = '';
                      }}
                      class="tool-select py-1 text-sm h-9"
                      defaultValue=""
                    >
                      <option value="">{t('addValue')}</option>
                      {#each commonValues as v (v)}
<option  value={v}>{v}</option>
{/each}
                    </select>
                  </div>
                {/if}
{/if}
              </div>
{/each}
          </div>

          <button
            onclick={resetToDefaults}
            class="text-sm text-amber-600 hover:text-amber-700 dark:text-amber-400"
          >
            {t('resetDefaults')}
          </button>
        </div>

        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              {t('output')}
            </h3>
            <select
              value={outputFormat}
              onchange={(e) => outputFormat = e.target.value as 'header' | 'meta'}
              class="tool-select w-auto py-1 px-3 text-sm h-9"
            >
              <option value="header">{t('httpHeader')}</option>
              <option value="meta">{t('metaTag')}</option>
            </select>
          </div>

          <div class="tool-result bg-gray-900 dark:bg-black border-gray-800">
            <pre class="text-sm font-mono text-green-400 whitespace-pre-wrap break-all">
              {getOutput()}
            </pre>
          </div>

          <button
            onclick={copyToClipboard}
            class="w-full px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
          >
            {copied ? t('copied') : t('copy')}
          </button>

          <div class="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <h4 class="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
              {t('testingTip')}
            </h4>
            <p class="text-sm text-yellow-700 dark:text-yellow-300">
              {t('testingTipText')}
            </p>
          </div>
        </div>
      </div>
    </div>
  
