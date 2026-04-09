<script lang="ts">
  import { COMMON_PATTERNS } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['regex-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.regex-generator.${key}`;
  }

  // Types
  interface PatternOption {
  id: string;
  labelKey: string;
  pattern: string;
  descKey: string;
}

  let selectedPattern = $state('');

  let customPattern = $state('');

  let testString = $state('');

  let flags = $state({ g: true, i: false, m: false });

  let matches = $state([]);

  // Functions
  const currentPattern = selectedPattern 
    ? COMMON_PATTERNS.find(p => p.id === selectedPattern)?.pattern || ''
    : customPattern;
  function testPattern() {
    if (!currentPattern || !testString) {
      matches = [];
      return;
    }
    
    try {
      const flagStr = Object.entries(flags).filter(([, v]) => v).map(([k]) => k).join('');
      const regex = new RegExp(currentPattern, flagStr);
      const found = testString.match(regex);
      matches = found || [];
    } catch {
      matches = [];
    }
  }
  function copyPattern() {
    navigator.clipboard.writeText(currentPattern);
  }

</script>


    <div class="space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{t('commonPatterns')}</label>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
          {#each COMMON_PATTERNS as pattern (pattern.id)}
<button 
              onclick={() => { selectedPattern = pattern.id; customPattern = ''; }}
              class={`px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedPattern === pattern.id ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
              }`}>
              {t(`patterns.${pattern.labelKey}`)}
            </button>
{/each}
        </div>
      </div>

      <div>
        <label for="regex-pattern" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {selectedPattern ? t(`patterns.${COMMON_PATTERNS.find(p => p.id === selectedPattern)?.descKey}`) : t('customPattern')}
        </label>
        <input id="regex-pattern" name="pattern" type="text" value={currentPattern}
          onchange={(e) => { customPattern = e.target.value; selectedPattern = ''; }}
          class="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white font-mono"
          placeholder={t('placeholder')} />
      </div>

      <div class="flex gap-4">
        <label for="regex-flag-g" class="flex items-center gap-2 text-gray-600 dark:text-gray-300">
          <input id="regex-flag-g" name="flagGlobal" type="checkbox" checked={flags.g} onchange={(e) => flags = {...flags, g: e.target.checked}} /> {t('flagGlobal')}
        </label>
        <label for="regex-flag-i" class="flex items-center gap-2 text-gray-600 dark:text-gray-300">
          <input id="regex-flag-i" name="flagCaseInsensitive" type="checkbox" checked={flags.i} onchange={(e) => flags = {...flags, i: e.target.checked}} /> {t('flagCaseInsensitive')}
        </label>
        <label for="regex-flag-m" class="flex items-center gap-2 text-gray-600 dark:text-gray-300">
          <input id="regex-flag-m" name="flagMultiline" type="checkbox" checked={flags.m} onchange={(e) => flags = {...flags, m: e.target.checked}} /> {t('flagMultiline')}
        </label>
      </div>

      <div>
        <label for="regex-test-string" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('testString')}</label>
        <textarea id="regex-test-string" name="testString" bind:value={testString}
          class="w-full h-32 px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
          placeholder={t('testPlaceholder')}></textarea>
      </div>

      <div class="flex gap-4">
        <button onclick={testPattern}
          class="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors text-white">
          {t('testPattern')}
        </button>
        <button onclick={copyPattern} disabled={!currentPattern}
          class="px-6 py-2 bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50 rounded-lg font-medium transition-colors">
          {t('copy')}
        </button>
      </div>

      {#if matches.length > 0}
<div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('matches')} ({matches.length})</label>
          <div class="bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 space-y-2">
            {#each matches as match, i (i)}
<div  class="px-3 py-2 bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded font-mono text-green-600 dark:text-green-400">{match}</div>
{/each}
          </div>
        </div>
{/if}
    </div>
  
