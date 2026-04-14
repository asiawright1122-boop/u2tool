<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  let pattern = $state('\\b\\w+@\\w+\\.\\w+\\b');

  let flags = $state('gi');

  let testString = $state('Contact us at hello@example.com or support@test.org for help.');

  let error = $state('');

  let matches = $derived.by(() => {
    if (!pattern) return [];
    try {
      const regex = new RegExp(pattern, flags);
      error = '';
      const results: { match: string; index: number; groups?: Record<string, string> }[] = [];
      let match;
      
      if (flags.includes('g')) {
        while ((match = regex.exec(testString)) !== null) {
          results.push({
            match: match[0],
            index: match.index,
            groups: match.groups,
          });
        }
      } else {
        match = regex.exec(testString);
        if (match) {
          results.push({
            match: match[0],
            index: match.index,
            groups: match.groups,
          });
        }
      }
      return results;
    } catch (_e) {
      error = (_e as Error).message;
      return [];
    }
  });

  let highlightedText = $derived.by(() => {
    if (!pattern || error || matches.length === 0) return testString;
    
    try {
      const regex = new RegExp(pattern, flags);
      return testString.replace(regex, (match) => `<mark class="bg-yellow-500/50 text-white">${match}</mark>`);
    } catch {
      return testString;
    }
  });

  // Functions
  function toggleFlag(flag: string) {
    if (flags.includes(flag)) {
      flags = flags.replace(flag, '');
    } else {
      flags = flags + flag;
    }
  }

</script>


    <div class="space-y-4">
      <!-- Pattern Input -->
      <div>
        <label for="regex-pattern" class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">{t('regex.pattern')}</label>
        <div class="flex items-center gap-2">
          <span class="text-gray-500 dark:text-gray-300">/</span>
          <input
            id="regex-pattern"
            name="patternValue"
            type="text"
            bind:value={pattern}
            class="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded font-mono text-gray-900 dark:text-white"
            placeholder={t('regex.pattern')}
          />
          <span class="text-gray-500 dark:text-gray-300">/</span>
          <input
            id="regex-flags"
            name="flagsValue"
            type="text"
            bind:value={flags}
            class="w-16 px-3 py-2 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded font-mono text-gray-900 dark:text-white"
            placeholder="flags"
          />
        </div>
      </div>

      <!-- Flags -->
      <div class="flex flex-wrap gap-2">
        {#each [
          { flag: 'g', label: t('regex.global') },
          { flag: 'i', label: t('regex.caseInsensitive') },
          { flag: 'm', label: t('regex.multiline') },
          { flag: 's', label: t('regex.dotall') },
        ] as { flag, label } (flag)}
<button 
            onclick={() => toggleFlag(flag)}
            class={`px-3 py-1 text-sm rounded ${
              flags.includes(flag) ? 'bg-amber-600' : 'bg-gray-700'
            }`}
          >
            {flag} - {label}
          </button>
{/each}
      </div>

      <!-- Error -->
      {#if error}
<div class="p-3 bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-700 rounded-lg text-red-600 dark:text-red-300 text-sm">
          {error}
        </div>
{/if}

      <!-- Test String -->
      <div>
        <label for="regex-test-string" class="block text-sm font-medium mb-2">{t('regex.testString')}</label>
        <textarea
          id="regex-test-string"
          name="testStringValue"
          bind:value={testString}
          placeholder={t('regex.testString')}></textarea>
      </div>

      <!-- Highlighted Result -->
      <div>
        <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          {t('result')} ({matches.length} {t('match')}{matches.length !== 1 ? 'es' : ''})
        </label>
        <div
          class="p-4 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg font-mono text-sm whitespace-pre-wrap text-gray-900 dark:text-white">{@html highlightedText}</div>
      </div>

      <!-- Matches List -->
      {#if matches.length > 0}
<div>
          <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">{t('matches')}</label>
          <div class="space-y-2">
            {#each matches as m, i (i)}
<div  class="p-2 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded text-sm">
                <span class="text-gray-500 dark:text-gray-300">#{i + 1}</span>
                <span class="mx-2 text-amber-600 dark:text-amber-400 font-mono">&quot;{m.match}&quot;</span>
                <span class="text-gray-500 dark:text-gray-300">{t('regex.atIndex')} {m.index}</span>
              </div>
{/each}
          </div>
        </div>
{/if}
    </div>
  
