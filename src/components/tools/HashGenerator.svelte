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

  let input = $state('');

  let hashes = $state({});

  let copied = $state('');

  let timerRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  async function generateHashes() {
    if (!input.trim()) {
      hashes = {};
      return;
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(input);

    const algorithms = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'];
    const results: Record<string, string> = {};

    for (const algo of algorithms) {
      const hashBuffer = await crypto.subtle.digest(algo, data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      results[algo] = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // MD5 is not available in Web Crypto API, so we'll skip it or use a simple implementation
    hashes = results;
  }
  async function copyHash(algo: string, hash: string) {
    await navigator.clipboard.writeText(hash);
    copied = algo;
    setTimeout(() => copied = '', 2000);
  }

</script>


    <div class="space-y-4">
      <div>
        <label for="hash-input" class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">{t('input')}</label>
        <textarea
          id="hash-input"
          name="inputValue"
          bind:value={input}
          placeholder={t('inputPlaceholder')}></textarea>
      </div>

      <button onclick={generateHashes} class="btn-primary">
        {t('hash.generateHashes')}
      </button>

      {#if Object.keys(hashes).length > 0}
<div class="space-y-3">
          {#each Object.entries(hashes) as [algo, hash] (algo)}
<div  class="p-3 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div class="flex justify-between items-center mb-1">
                <span class="text-sm font-medium text-amber-600 dark:text-amber-400">{algo}</span>
                <button
                  onclick={() => copyHash(algo, hash)}
                  class={`text-xs px-2 py-1 rounded ${
                    copied === algo ? 'btn-success' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100'
                  }`}
                >
                  {copied === algo ? t('copied') : t('copy')}
                </button>
              </div>
              <div class="font-mono text-xs break-all text-gray-700 dark:text-gray-300 select-all">
                {hash}
              </div>
            </div>
{/each}
        </div>
{/if}
    </div>
  
