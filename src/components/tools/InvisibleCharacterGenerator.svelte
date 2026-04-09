<script lang="ts">
  import { onDestroy } from 'svelte';
  import { invisibleChars } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['invisible-character-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.invisible-character-generator.${key}`;
  }

  let selectedChar = $state(invisibleChars[0]);

  let count = $state(1);

  let copied = $state(null);

  let testInput = $state('');

  let timerRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function generateChars(): string {
    return selectedChar.code.repeat(count);
  }
  function copyChar(char: typeof invisibleChars[0], times: number = 1) {
    navigator.clipboard.writeText(char.code.repeat(times));
    copied = char.unicode;
    setTimeout(() => copied = null, 2000);
  }
  function copyGenerated() {
    navigator.clipboard.writeText(generateChars());
    copied = 'generated';
    setTimeout(() => copied = null, 2000);
  }
  function detectInvisible(text: string) {
    const found: { char: string; count: number; name: string }[] = [];
    invisibleChars.forEach(ic => {
      const matches = text.split(ic.code).length - 1;
      if (matches > 0) {
        found.push({ char: ic.unicode, count: matches, name: ic.name });
      }
    });
    return found;
  }
  const detectedChars = detectInvisible(testInput);

</script>


    <div class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('selectCharacter')}
          </label>
          <select
            value={selectedChar.unicode}
            onchange={(e) => selectedChar = invisibleChars.find(c => c.unicode === e.target.value) || invisibleChars[0]}
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            {#each invisibleChars as char (char.unicode)}
<option  value={char.unicode}>
                {char.name} ({char.unicode})
              </option>
{/each}
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('repeatCount')}
          </label>
          <input
            type="number"
            value={count}
            onchange={(e) => count = Math.max(1, Math.min(100, parseInt(e.target.value) || 1))}
            min="1"
            max="100"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">{selectedChar.description}</p>
        <div class="flex items-center gap-4">
          <div class="flex-1 px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg font-mono">
            <span class="text-gray-400">[</span>
            <span class="bg-yellow-200 dark:bg-yellow-800">{generateChars()}</span>
            <span class="text-gray-400">]</span>
            <span class="ml-2 text-sm text-gray-500">({count} {t('characters')})</span>
          </div>
          <button
            onclick={copyGenerated}
            class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {copied === 'generated' ? t('copied') : t('copy')}
          </button>
        </div>
      </div>

      <div class="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
        <h3 class="font-medium text-gray-900 dark:text-white mb-3">{t('allCharacters')}</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {#each invisibleChars as char (char.unicode)}
<button 
              onclick={() => copyChar(char)}
              class={`p-3 text-left rounded-lg border transition-colors ${
                copied === char.unicode
                  ? 'bg-green-100 dark:bg-green-900/30 border-green-500'
                  : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-blue-500'
              }`}
            >
              <div class="font-mono text-sm text-blue-600 dark:text-blue-400">{char.unicode}</div>
              <div class="text-sm font-medium text-gray-900 dark:text-white">{char.name}</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">{char.description}</div>
            </button>
{/each}
        </div>
      </div>

      <div class="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
        <h3 class="font-medium text-purple-800 dark:text-purple-300 mb-3">{t('detectTitle')}</h3>
        <textarea
          bind:value={testInput}
          placeholder={t('detectPlaceholder')}
          class="w-full h-24 px-4 py-3 border border-purple-200 dark:border-purple-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white mb-3"></textarea>
        {#if detectedChars.length > 0}
<div class="space-y-1">
            {#each detectedChars as d, i (i)}
<div  class="text-sm text-purple-700 dark:text-purple-400">
                ✓ {d.name} ({d.char}): {d.count} {t('found')}
              </div>
{/each}
          </div>
{:else if testInput}
<p class="text-sm text-purple-600 dark:text-purple-400">{t('noInvisibleFound')}</p>
{:else}
{null}
{/if}
      </div>

      <div class="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
        <h3 class="font-medium text-yellow-800 dark:text-yellow-300 mb-2">{t('useCases')}</h3>
        <ul class="text-sm text-yellow-700 dark:text-yellow-400 space-y-1">
          <li>• {t('useCase1')}</li>
          <li>• {t('useCase2')}</li>
          <li>• {t('useCase3')}</li>
        </ul>
      </div>
    </div>
  
