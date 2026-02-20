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

  let value = $state('16');

  let fromUnit = $state('px');

  let baseFontSize = $state('16');

  let viewportWidth = $state('1920');

  let viewportHeight = $state('1080');

  // Functions
  function convert(toUnit: string): string {
    const val = parseFloat(value);
    const base = parseFloat(baseFontSize);
    const vw = parseFloat(viewportWidth);
    const vh = parseFloat(viewportHeight);
    if (isNaN(val)) return '-';

    let px = val;
    if (fromUnit === 'rem' || fromUnit === 'em') px = val * base;
    else if (fromUnit === 'pt') px = val * 1.333;
    else if (fromUnit === 'vw') px = (val / 100) * vw;
    else if (fromUnit === 'vh') px = (val / 100) * vh;
    else if (fromUnit === '%') px = (val / 100) * base;

    if (toUnit === 'px') return px.toFixed(2);
    if (toUnit === 'rem' || toUnit === 'em') return (px / base).toFixed(4);
    if (toUnit === 'pt') return (px / 1.333).toFixed(2);
    if (toUnit === 'vw') return ((px / vw) * 100).toFixed(4);
    if (toUnit === 'vh') return ((px / vh) * 100).toFixed(4);
    if (toUnit === '%') return ((px / base) * 100).toFixed(2);
    return '-';
  }

</script>


    <div class="space-y-6">
      <div class="grid md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">{t('cssUnit.value')}</label>
          <input type="number" bind:value={value} class="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">{t('cssUnit.unit')}</label>
          <select bind:value={fromUnit} class="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white">
            {#each UNITS as u (u)}
<option  value={u}>{u}</option>
{/each}
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">{t('cssUnit.baseFontSize')}</label>
          <input type="number" bind:value={baseFontSize} class="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white" />
        </div>
      </div>
      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">{t('cssUnit.viewportWidth')}</label>
          <input type="number" bind:value={viewportWidth} class="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">{t('cssUnit.viewportHeight')}</label>
          <input type="number" bind:value={viewportHeight} class="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white" />
        </div>
      </div>
      <div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
        <h3 class="font-medium text-gray-900 dark:text-white mb-3">{t('result')}</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          {#each UNITS as u (u)}
<div  class="bg-gray-200 dark:bg-gray-700 rounded p-3 text-center">
              <p class="text-lg font-mono text-blue-600 dark:text-blue-400">{convert(u)}</p>
              <p class="text-sm text-gray-600 dark:text-gray-300">{u}</p>
            </div>
{/each}
        </div>
      </div>
    </div>
  
