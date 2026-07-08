<script lang="ts">
  import { onDestroy } from 'svelte';

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

  // Types
  interface Pattern {
  name: string;
  pattern: string;
  description: string;
  example: string;
}

  const patterns: Pattern[] = [
    { name: 'email', pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$', description: 'Email address', example: 'hello@example.com' },
    { name: 'url', pattern: 'https?:\\/\\/[^\\s]+', description: 'HTTP or HTTPS URL', example: 'https://example.com' },
    { name: 'phone', pattern: '^\\+?[0-9\\s().-]{7,}$', description: 'Phone number', example: '+1 555 0100' },
    { name: 'ipv4', pattern: '^(?:\\d{1,3}\\.){3}\\d{1,3}$', description: 'IPv4 address', example: '192.168.1.1' },
    { name: 'hexColor', pattern: '^#(?:[0-9a-fA-F]{3}){1,2}$', description: 'Hex color', example: '#ffcc00' },
    { name: 'uuid', pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$', description: 'UUID', example: '550e8400-e29b-41d4-a716-446655440000' },
  ];

  let testInput = $state('');

  let selectedPattern = $state<Pattern | null>(null);

  let copied = $state('');

  let timerRef = $state<ReturnType<typeof setTimeout> | null>(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function copyPattern(pattern: string) {
    navigator.clipboard.writeText(pattern);
    copied = pattern;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = '', 2000);
  }
  function testPattern(pattern: Pattern) {
    selectedPattern = pattern;
    testInput = pattern.example;
  }
  let isMatch = $derived(selectedPattern && testInput
    ? new RegExp(selectedPattern.pattern).test(testInput)
    : null);

</script>


    <div class="space-y-4">
      {#if selectedPattern}
<div class="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-4 space-y-3">
          <div class="flex justify-between items-center">
            <span class="font-medium text-gray-900 dark:text-white">{t(`regexPatterns.${selectedPattern.name}`)}</span>
            <button
              onclick={() => selectedPattern = null}
              class="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white"
            >
              ✕
            </button>
          </div>
          <code class="block bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-2 rounded text-sm text-green-600 dark:text-green-400 break-all">
            {selectedPattern.pattern}
          </code>
          <div>
            <label for="regex-patterns-field-2" class="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('regexPatterns.test')}</label>
            <input
              type="text"
              bind:value={testInput}
              class="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded p-2 text-gray-900 dark:text-white"
              placeholder={selectedPattern.example} id="regex-patterns-field-2" />
          </div>
          {#if testInput}
<div class={`text-sm ${isMatch ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {@html isMatch ? '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg> ' + t('regexPatterns.match') : '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg> ' + t('regexPatterns.noMatch')}
            </div>
{/if}
        </div>
{/if}

      <div class="grid gap-2">
        {#each patterns as p (p.name)}
<div 
            class="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-3 flex items-center justify-between hover:bg-gray-200 dark:hover:bg-gray-750"
          >
            <div class="flex-1 min-w-0">
              <div class="font-medium text-sm text-gray-900 dark:text-white">{t(`regexPatterns.${p.name}`)}</div>
              <code class="text-xs text-gray-500 dark:text-gray-300 truncate block">{p.pattern}</code>
            </div>
            <div class="flex gap-2 ml-2">
              <button
                onclick={() => testPattern(p)}
                class="text-xs bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 px-2 py-1 rounded"
              >
                {t('regexPatterns.tryIt')}
              </button>
              <button
                onclick={() => copyPattern(p.pattern)}
                class="text-xs bg-amber-600 hover:bg-amber-700 text-white px-2 py-1 rounded"
              >
                {copied === p.pattern ? '✓' : t('copy')}
              </button>
            </div>
          </div>
{/each}
      </div>
    </div>
  
