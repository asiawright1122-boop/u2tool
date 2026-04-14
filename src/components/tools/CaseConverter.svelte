<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['case'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.case.${key}`;
  }
  function tg(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  let input = $state('');

  let copied = $state('');

  let timerRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  const conversions = [
    { id: 'upper', label: t('uppercase'), fn: (s: string) => s.toUpperCase() },
    { id: 'lower', label: t('lowercase'), fn: (s: string) => s.toLowerCase() },
    { id: 'title', label: t('titleCase'), fn: (s: string) => s.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()) },
    { id: 'sentence', label: t('sentenceCase'), fn: (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() },
    { id: 'camel', label: t('camelCase'), fn: (s: string) => s.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()) },
    { id: 'pascal', label: 'PascalCase', fn: (s: string) => s.toLowerCase().replace(/(?:^|[^a-zA-Z0-9]+)(.)/g, (_, c) => c.toUpperCase()) },
    { id: 'snake', label: t('snakeCase'), fn: (s: string) => s.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '') },
    { id: 'kebab', label: 'kebab-case', fn: (s: string) => s.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') },
  ];
  async function copyResult(id: string, text: string) {
    await navigator.clipboard.writeText(text);
    copied = id;
    setTimeout(() => copied = '', 2000);
  }

</script>


              <div class="p-3 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div class="flex justify-between items-center mb-2">
                  <span class="text-sm font-medium text-amber-600 dark:text-amber-400">{label}</span>
                  <button
                    onclick={() => copyResult(id, result)}
                    class={`text-xs px-2 py-1 rounded ${copied === id ? 'btn-success' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'}`}
                  >
                    {copied === id ? tg('copied') : tg('copy')}
                  </button>
                </div>
                <div class="text-sm break-all text-gray-900 dark:text-gray-100">{result}</div>
              </div>
            
