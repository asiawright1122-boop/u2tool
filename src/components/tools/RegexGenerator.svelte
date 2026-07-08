<script lang="ts">
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

  const PATTERN_OPTIONS: PatternOption[] = [
    { id: 'email', labelKey: 'email', pattern: '^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$', descKey: 'emailDesc' },
    { id: 'phone', labelKey: 'phone', pattern: '^\\+?1?[-.\\s]?\\(?[2-9]\\d{2}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}$', descKey: 'phoneDesc' },
    { id: 'url', labelKey: 'url', pattern: 'https?:\\/\\/[^\\s]+', descKey: 'urlDesc' },
    { id: 'ip', labelKey: 'ip', pattern: '^(?:[0-9]{1,3}\\.){3}[0-9]{1,3}$', descKey: 'ipDesc' },
    { id: 'date', labelKey: 'date', pattern: '^\\d{4}-\\d{2}-\\d{2}$', descKey: 'dateDesc' },
    { id: 'time', labelKey: 'time', pattern: '^(?:[01]\\d|2[0-3]):[0-5]\\d$', descKey: 'timeDesc' },
    { id: 'hex', labelKey: 'hex', pattern: '^#(?:[0-9a-fA-F]{3}){1,2}$', descKey: 'hexDesc' },
    { id: 'username', labelKey: 'username', pattern: '^[a-zA-Z0-9_]{3,16}$', descKey: 'usernameDesc' },
    { id: 'password', labelKey: 'password', pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z\\d]).{8,}$', descKey: 'passwordDesc' },
    { id: 'zip', labelKey: 'zip', pattern: '^\\d{5}(?:-\\d{4})?$', descKey: 'zipDesc' },
    { id: 'creditcard', labelKey: 'creditcard', pattern: '^(?:\\d[ -]*?){13,19}$', descKey: 'creditcardDesc' },
    { id: 'slug', labelKey: 'slug', pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$', descKey: 'slugDesc' },
  ];

  let selectedPattern = $state('email');
  let customPattern = $state('');
  let testString = $state('');
  let flags = $state({ g: true, i: false, m: false });
  let matches = $state<string[]>([]);

  const selectedPatternOption = $derived(PATTERN_OPTIONS.find((pattern) => pattern.id === selectedPattern));
  const currentPattern = $derived(selectedPatternOption?.pattern || customPattern);
  const currentPatternLabel = $derived(
    selectedPatternOption ? t(`patterns.${selectedPatternOption.descKey}`) : t('customPattern')
  );

  // Functions
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
    if (currentPattern) navigator.clipboard.writeText(currentPattern);
  }

</script>


    <div class="space-y-6">
      <div>
        <div class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{t('commonPatterns')}</div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
          {#each PATTERN_OPTIONS as pattern (pattern.id)}
<button 
              onclick={() => { selectedPattern = pattern.id; customPattern = ''; }}
              class={`px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedPattern === pattern.id ? 'bg-amber-600' : 'bg-gray-700 hover:bg-gray-600'
              }`}>
              {t(`patterns.${pattern.labelKey}`)}
            </button>
{/each}
        </div>
      </div>

      <div>
        <label for="regex-pattern" class="tool-label">
          {currentPatternLabel}
        </label>
        <input id="regex-pattern" name="pattern" type="text" value={currentPattern}
          oninput={(e) => { customPattern = e.currentTarget.value; selectedPattern = ''; }}
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
        <label for="regex-test-string" class="tool-label">{t('testString')}</label>
        <textarea id="regex-test-string" name="testString" bind:value={testString}
          class="w-full h-32 px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
          placeholder={t('testPlaceholder')}></textarea>
      </div>

      <div class="flex gap-4">
        <button onclick={testPattern}
          class="px-6 py-2 bg-emerald-500 hover:bg-green-700 rounded-lg font-medium transition-colors text-white">
          {t('testPattern')}
        </button>
        <button onclick={copyPattern} disabled={!currentPattern}
          class="px-6 py-2 bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50 rounded-lg font-medium transition-colors">
          {t('copy')}
        </button>
      </div>

      {#if matches.length > 0}
<div>
          <div class="tool-label">{t('matches')} ({matches.length})</div>
          <div class="bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 space-y-2">
            {#each matches as match, i (i)}
<div  class="px-3 py-2 bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded font-mono text-green-600 dark:text-green-400">{match}</div>
{/each}
          </div>
        </div>
{/if}
    </div>
  
