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

  let number = $state('1234567.89');

  let style = $state('decimal');

  let currency = $state('USD');

  let copied = $state('');

  let timerRef = $state(null);

  let formats = $derived.by(() => {
    const num = parseFloat(number);
    if (isNaN(num)) return [];
    const locales = ['en-US', 'zh-CN', 'ja-JP', 'de-DE', 'fr-FR', 'es-ES', 'pt-BR', 'ar-SA', 'hi-IN'];
    return locales.map(loc => {
      try {
        const formatted = new Intl.NumberFormat(loc, {
          style, currency: style === 'currency' ? currency : undefined,
          minimumFractionDigits: style === 'percent' ? 2 : undefined
        }).format(style === 'percent' ? num / 100 : num);
        return { locale: loc, formatted };
      } catch { return { locale: loc, formatted: 'Error' }; }
    });
  });  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  async function copy(text: string) {
    await navigator.clipboard.writeText(text);
    copied = text;
    setTimeout(() => copied = '', 1500);
  }

</script>


    <div class="space-y-4">
      <div class="grid md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200" for="number-input">{t('numberFormat.number')}</label>
          <input type="text" id="number-input" name="number" bind:value={number} class="w-full p-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg font-mono text-gray-900 dark:text-gray-100" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200" for="number-style">{t('numberFormat.style')}</label>
          <select id="number-style" name="style" value={style} onchange={(e) => style = e.target.value as typeof style} class="w-full p-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100">
            <option value="decimal">{t('numberFormat.decimal')}</option>
            <option value="currency">{t('numberFormat.currency')}</option>
            <option value="percent">{t('numberFormat.percent')}</option>
          </select>
        </div>
        {#if style === 'currency'}
<div>
            <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200" for="currency-code">{t('numberFormat.currencyCode')}</label>
            <select id="currency-code" name="currency" bind:value={currency} class="w-full p-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100">
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="JPY">JPY (¥)</option>
              <option value="CNY">CNY (¥)</option>
            </select>
          </div>
{/if}
      </div>
      <div class="grid md:grid-cols-3 gap-3">
        {#each formats as { locale, formatted } (locale)}
<div  onclick={() => copy(formatted)} class="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <p class="text-sm text-gray-600 dark:text-gray-300 mb-1">{locale}</p>
            <p class="text-lg font-mono text-gray-900 dark:text-gray-100">{formatted}</p>
            {#if copied === formatted}
<span class="text-xs text-green-600 dark:text-green-400">{t('copied')}</span>
{/if}
          </div>
{/each}
      </div>
    </div>
  
