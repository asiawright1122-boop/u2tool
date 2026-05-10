<script lang="ts">
  import JsBarcode from 'jsbarcode';

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

  let text = $state('123456789012');

  let format = $state<'CODE128' | 'CODE39' | 'EAN13' | 'UPC'>('CODE128');

  let svgRef = $state<SVGSVGElement | null>(null);

  let error = $state('');

  const formatOptions = [
    { value: 'CODE128', label: 'Code 128' },
    { value: 'CODE39', label: 'Code 39' },
    { value: 'EAN13', label: 'EAN-13' },
    { value: 'UPC', label: 'UPC-A' },
  ] as const;

  $effect(() => {
    renderBarcode();
  });

  function renderBarcode() {
    if (!svgRef) return;

    svgRef.innerHTML = '';
    error = '';

    try {
      JsBarcode(svgRef, text, {
        format,
        background: '#ffffff',
        lineColor: '#111827',
        width: 2,
        height: 80,
        displayValue: true,
        margin: 12,
      });
    } catch (caught) {
      error = caught instanceof Error ? caught.message : String(caught);
    }
  }
</script>

<div class="space-y-4">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div class="flex flex-col">
      <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2" for="barcode-text">{t('barcode.text')}</label>
      <input type="text" id="barcode-text" name="text" bind:value={text} class="w-full h-12 px-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white" />
    </div>
    <div class="flex flex-col">
      <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2" for="barcode-format">{t('barcode.format')}</label>
      <select id="barcode-format" name="format" value={format} onchange={(e) => format = (e.currentTarget as HTMLSelectElement).value as typeof format} class="w-full h-12 px-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white">
        {#each formatOptions as option (option.value)}
          <option value={option.value}>{option.label}</option>
        {/each}
      </select>
    </div>
  </div>
  <div class="bg-white rounded-lg p-4 border border-gray-200 dark:border-gray-600">
    <svg bind:this={svgRef} class="w-full h-32"></svg>
  </div>
  {#if error}
    <div class="text-sm text-red-600 dark:text-red-400">
      {error}
    </div>
  {/if}
</div>
