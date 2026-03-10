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

  let fromBase = $state(10);

  let results = $state([]);

  let error = $state('');

  let copied = $state('');

  let timerRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  const bases = [
    { base: 2, name: 'Binary' },
    { base: 8, name: 'Octal' },
    { base: 10, name: 'Decimal' },
    { base: 16, name: 'Hexadecimal' },
  ];
  function convert() {
    if (!input.trim()) {
      results = [];
      error = '';
      return;
    }
    try {
      const decimal = parseInt(input, fromBase);
      if (isNaN(decimal)) {
        throw new Error('Invalid number');
      }

      const converted = bases.map(({ base, name }) => ({
        base,
        name,
        value: decimal.toString(base).toUpperCase(),
      }));

      results = converted;
      error = '';
    } catch (_e) {
      error = t('errorInvalidInput');
      results = [];
    }
  }
  async function copyValue(base: number, value: string) {
    await navigator.clipboard.writeText(value);
    copied = String(base);
    setTimeout(() => copied = '', 2000);
  }

</script>


    <div class="space-y-4">
      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label for="number-base-input" class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">{t('input')}</label>
          <input
            id="number-base-input"
            name="numberInput"
            type="text"
            bind:value={input}
            class="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
            placeholder={t('inputPlaceholder')}
          />
        </div>
        <div>
          <label for="number-base-from" class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">From Base</label>
          <select
            id="number-base-from"
            name="fromBase"
            value={fromBase}
            onchange={(e) => fromBase = Number(e.target.value)}
            class="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
          >
            {#each bases as { base, name } (base)}
<option  value={base}>
                {name} (Base {base})
              </option>
{/each}
          </select>
        </div>
      </div>

      <button onclick={convert} class="btn-primary">
        {t('convert')}
      </button>

      {#if error}
<div class="p-3 bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-700 rounded-lg text-red-600 dark:text-red-300 text-sm">
          {error}
        </div>
{/if}

      {#if results.length > 0}
<div class="space-y-3">
          {#each results as { base, name, value } (base)}
<div 
              class="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <div>
                <div class="text-xs text-gray-500 dark:text-gray-300 mb-1">{name} (Base {base})</div>
                <div class="font-mono text-lg text-gray-900 dark:text-white">{value}</div>
              </div>
              <button
                onclick={() => copyValue(base, value)}
                class={`text-sm px-3 py-1 rounded ${
                  copied === String(base) ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {copied === String(base) ? t('copied') : t('copy')}
              </button>
            </div>
{/each}
        </div>
{/if}
    </div>
  
