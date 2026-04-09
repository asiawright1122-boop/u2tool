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

  let text1 = $state('');

  let text2 = $state('');

  let hash1 = $state('');

  let hash2 = $state('');

  let algorithm = $state('SHA-256');

  let isComparing = $state(false);

  // Functions
  const algorithms = ['SHA-256', 'SHA-384', 'SHA-512', 'SHA-1'];
  async function computeHash(text: string, algo: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest(algo, data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  async function handleCompare() {
    isComparing = true;
    try {
      const [h1, h2] = await Promise.all([
        computeHash(text1, algorithm),
        computeHash(text2, algorithm)
      ]);
      hash1 = h1;
      hash2 = h2;
    } catch {
      hash1 = 'Error';
      hash2 = 'Error';
    }
    isComparing = false;
  }
  const isMatch = hash1 && hash2 && hash1 === hash2;

</script>


    <div class="space-y-6">
      <div class="flex gap-4 items-center">
        <select
          bind:value={algorithm}
          class="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-gray-100"
        >
          {#each algorithms as algo (algo)}
<option  value={algo}>{algo}</option>
{/each}
        </select>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
            {t('hashCompare.text1')}
          </label>
          <textarea
            bind:value={text1}
            placeholder={t('hashCompare.placeholder')}
            class="w-full h-32 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-blue-500"></textarea>
          {#if hash1}
<div class="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono break-all text-gray-600 dark:text-gray-300">
              {hash1}
            </div>
{/if}
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
            {t('hashCompare.text2')}
          </label>
          <textarea
            bind:value={text2}
            placeholder={t('hashCompare.placeholder')}
            class="w-full h-32 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-blue-500"></textarea>
          {#if hash2}
<div class="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono break-all text-gray-600 dark:text-gray-300">
              {hash2}
            </div>
{/if}
        </div>
      </div>

      <button
        onclick={handleCompare}
        disabled={isComparing || !text1 || !text2}
        class="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white disabled:text-gray-500 dark:disabled:text-gray-400 rounded-lg font-medium transition-colors"
      >
        {isComparing ? t('hashCompare.comparing') : t('hashCompare.compare')}
      </button>

      {#if hash1}
{#if hash2}
        <div class={`p-4 rounded-lg border ${isMatch ? 'bg-green-900/20 border-green-700' : 'bg-red-900/20 border-red-700'}`}>
          <div class="flex items-center gap-2">
            <span class={`text-2xl ${isMatch ? 'text-green-400' : 'text-red-400'}`}>
              {isMatch ? '✓' : '✗'}
            </span>
            <span class="font-medium">
              {isMatch ? t('hashCompare.match') : t('hashCompare.noMatch')}
            </span>
          </div>
        </div>
      {/if}
{/if}
    </div>
  
