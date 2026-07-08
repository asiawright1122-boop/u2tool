<script lang="ts">
  import { onDestroy } from 'svelte';
  import { units } from '@/lib/tool-stubs';

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
  function tu(key: string): string {
    const scope = translations['tools']['unit-converter'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.unit-converter.${key}`;
  }

  // Types
  type UnitCategory = 'length' | 'weight' | 'temperature' | 'area' | 'volume' | 'speed' | 'data';
  interface UnitDef {
  name: string;
  toBase: (v: number) => number;
  fromBase: (v: number) => number;
}

  let category = $state('length');

  let fromUnit = $state('m');

  let toUnit = $state('km');

  let inputValue = $state('1');

  let copied = $state(false);

  let timerRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function convert(): string {
    const value = parseFloat(inputValue);
    if (isNaN(value)) return '';

    const fromDef = units[category][fromUnit];
    const toDef = units[category][toUnit];

    if (!fromDef || !toDef) return '';

    const baseValue = fromDef.toBase(value);
    const result = toDef.fromBase(baseValue);

    return result.toLocaleString(undefined, { maximumFractionDigits: 10 });
  }
  const result = convert();
  async function copyResult() {
    await navigator.clipboard.writeText(result);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }
  function swapUnits() {
    const temp = fromUnit;
    fromUnit = toUnit;
    toUnit = temp;
  }
  const categoryUnits = Object.entries(units[category]);

</script>


    <div class="space-y-6">
      <!-- Category Selection -->
      <div>
        <div class="tool-label">{'Category'}</div>
        <div class="flex flex-wrap gap-2">
          {#each (Object.keys(units) as UnitCategory[]) as cat (cat)}
<button 
              onclick={() => {
                category = cat;
                const unitKeys = Object.keys(units[cat]);
                fromUnit = unitKeys[0];
                toUnit = unitKeys[1] || unitKeys[0];
              }}
              class={`px-4 py-2 rounded-lg text-sm transition-colors ${category === cat ? 'bg-amber-600 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700'
                }`}
            >
              {t(`unit.${cat}`)}
            </button>
{/each}
        </div>
      </div>

      <!-- Conversion -->
      <div class="grid md:grid-cols-[1fr,auto,1fr] gap-4 items-stretch">
        <!-- From Section -->
        <div class="p-5 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700 transition-all hover:border-amber-400/50 hover:shadow-lg hover:shadow-amber-500/10">
          <label for="unit-from-value" class="tool-label text-xs uppercase tracking-wider text-gray-500 mb-3 block text-center md:text-left">{'From'}</label>
          <div class="space-y-3">
            <input
              id="unit-from-value"
              name="inputValue"
              type="number"
              bind:value={inputValue}
              class="tool-input text-2xl md:text-3xl font-mono text-center h-16 bg-white dark:bg-gray-800 shadow-sm"
              placeholder={tu('enterValue')}
            />
            <select
              id="unit-from"
              name="fromUnit"
              bind:value={fromUnit}
              class="tool-select text-center font-medium bg-white dark:bg-gray-800 shadow-sm"
            >
              {#each categoryUnits as [key, def] (key)}
<option  value={key}>{def.name}</option>
{/each}
            </select>
          </div>
        </div>

        <!-- Swap Button -->
        <div class="flex items-center justify-center self-center py-2 md:py-0">
          <button
            onclick={swapUnits}
            class="p-4 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-500 hover:text-amber-600 hover:border-amber-500 dark:hover:border-amber-500 hover:shadow-md transition-all duration-200 active:scale-90 group"
            title={tu('swapUnits')}
            aria-label={tu('swapUnits')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width={2}
              stroke="currentColor"
              class="w-6 h-6 transform group-hover:rotate-180 transition-transform duration-500"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"></path>
            </svg>
          </button>
        </div>

        <!-- To Section -->
        <div class="p-5 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700 transition-all hover:border-amber-400/50 hover:shadow-lg hover:shadow-amber-500/10">
          <label for="unit-to" class="tool-label text-xs uppercase tracking-wider text-gray-500 mb-3 block text-center md:text-left">{'To'}</label>
          <div class="space-y-3">
            <div class="tool-input flex items-center justify-center text-2xl md:text-3xl font-mono h-16 bg-white dark:bg-gray-800 shadow-sm overflow-hidden text-ellipsis whitespace-nowrap">
              {result || '0'}
            </div>
            <select
              id="unit-to"
              name="toUnit"
              bind:value={toUnit}
              class="tool-select text-center font-medium bg-white dark:bg-gray-800 shadow-sm"
            >
              {#each categoryUnits as [key, def] (key)}
<option  value={key}>{def.name}</option>
{/each}
            </select>
          </div>
        </div>
      </div>

      {#if result}
<div class="flex justify-center">
          <button
            onclick={copyResult}
            class={`px-6 py-2 rounded-lg text-white ${copied ? 'bg-emerald-500' : 'bg-gray-600 dark:bg-gray-700 hover:bg-gray-500 dark:hover:bg-gray-600'}`}
          >
            {copied ? t('copied') : t('copy')} {t('result')}
          </button>
        </div>
{/if}

      <!-- Quick Reference -->
      <div class="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h3 class="text-sm font-medium mb-3 text-gray-900 dark:text-white">{'Quick Reference'}</h3>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-600 dark:text-gray-300">
          {#each categoryUnits.slice(0, 6) as [key, def] (key)}
<div >
              <span class="text-amber-600 dark:text-amber-400">{key}</span> = {def.name}
            </div>
{/each}
        </div>
      </div>
    </div>
  
