<script lang="ts">
  import { calculateMarkup } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['markup-calculator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.markup-calculator.${key}`;
  }
  function tCommon(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  interface MarkupResult {
  sellingPrice: number;
  profit: number;
  profitMargin: number;
}

  let cost = $state('50');

  let markupPercentage = $state('100');

  let result = $state(null);

  function handleCalculate() {
    const costNum = parseFloat(cost);
    const markupNum = parseFloat(markupPercentage);
    
    if (isNaN(costNum) || isNaN(markupNum) || costNum <= 0) {
      return;
    }
    
    result = calculateMarkup(costNum, markupNum);
  }

  // Functions
  function clearAll() {
    cost = '50';
    markupPercentage = '100';
    result = null;
  }
  function formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }
  function formatPercent(value: number): string {
    return `${value.toFixed(2)}%`;
  }
  function generateComparisonTable() {
    const costNum = parseFloat(cost);
    if (isNaN(costNum) || costNum <= 0) return [];
    
    const markups = [25, 50, 75, 100, 150, 200, 250, 300];
    return markups.map(markup => {
      const result = calculateMarkup(costNum, markup);
      return {
        markup,
        ...result,
      };
    });
  }

</script>


    <div class="space-y-6">
      <!-- Info -->
      <div class="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
        <p class="text-sm text-amber-700 dark:text-amber-300">
          {t('info')}
        </p>
      </div>

      <!-- Input Form -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="markup-cost" class="tool-label">
            {t('cost')}
          </label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              id="markup-cost"
              name="costValue"
              type="number"
              bind:value={cost}
              placeholder="50"
              step="0.01"
              class="w-full pl-8 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label for="markup-percentage" class="tool-label">
            {t('markupPercentage')}
          </label>
          <div class="relative">
            <input
              id="markup-percentage"
              name="markupPercentage"
              type="number"
              bind:value={markupPercentage}
              placeholder="100"
              step="1"
              class="w-full pr-8 pl-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
            <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
          </div>
        </div>
      </div>

      <!-- Quick Markup Buttons -->
      <div>
        <div class="tool-label">
          {t('commonMarkups')}
        </div>
        <div class="flex flex-wrap gap-2">
          {#each [25, 50, 75, 100, 150, 200, 250, 300] as markup (markup)}
<button 
              onclick={() => markupPercentage = String(markup)}
              class={`px-3 py-1 rounded text-sm ${
                markupPercentage === String(markup)
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {markup}%
            </button>
{/each}
        </div>
      </div>

      <!-- Markup Slider -->
      <div>
        <label for="markup-slider" class="tool-label">
          {t('adjustMarkup')}: {markupPercentage}%
        </label>
        <input
          id="markup-slider"
          name="markupSlider"
          type="range"
          min="0"
          max="500"
          bind:value={markupPercentage}
          class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />
        <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>0%</span>
          <span>100%</span>
          <span>200%</span>
          <span>300%</span>
          <span>400%</span>
          <span>500%</span>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-center gap-4">
        <button
          onclick={handleCalculate}
          class="px-6 py-2 bg-amber-600 hover:bg-amber-700 rounded-lg font-medium text-white"
        >
          {t('calculate')}
        </button>
        <button
          onclick={clearAll}
          class="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg font-medium text-gray-900 dark:text-gray-100"
        >
          {tCommon('clear')}
        </button>
      </div>

      <!-- Results -->
      {#if result}
<div class="space-y-6">
          <!-- Summary Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p class="text-sm text-green-600 dark:text-green-400">{t('sellingPrice')}</p>
              <p class="text-2xl font-bold text-green-700 dark:text-green-300">
                {formatCurrency(result.sellingPrice)}
              </p>
            </div>
            
            <div class="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <p class="text-sm text-amber-600 dark:text-amber-400">{t('profit')}</p>
              <p class="text-2xl font-bold text-amber-700 dark:text-amber-300">
                {formatCurrency(result.profit)}
              </p>
            </div>
            
            <div class="p-4 bg-slate-50 dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800 rounded-lg">
              <p class="text-sm text-slate-600 dark:text-slate-400">{t('profitMargin')}</p>
              <p class="text-2xl font-bold text-slate-700 dark:text-slate-300">
                {formatPercent(result.profitMargin)}
              </p>
            </div>
          </div>

          <!-- Visual Breakdown -->
          <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{t('priceBreakdown')}</h3>
            <div class="h-8 flex rounded overflow-hidden">
              <div 
                class="bg-red-400 dark:bg-rose-500 flex items-center justify-center text-white text-xs font-medium"
                style="width: {(parseFloat(cost) / result.sellingPrice) * 100}%"
              >
                {t('cost')}
              </div>
              <div 
                class="bg-green-400 dark:bg-emerald-500 flex items-center justify-center text-white text-xs font-medium"
                style="width: {(result.profit / result.sellingPrice) * 100}%"
              >
                {t('profit')}
              </div>
            </div>
            <div class="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
              <span>{formatCurrency(parseFloat(cost))} ({((parseFloat(cost) / result.sellingPrice) * 100).toFixed(1)}%)</span>
              <span>{formatCurrency(result.profit)} ({result.profitMargin.toFixed(1)}%)</span>
            </div>
          </div>
        </div>
{/if}

      <!-- Comparison Table -->
      {#if parseFloat(cost) > 0}
<div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{t('comparisonTable')}</h3>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-gray-200 dark:border-gray-700">
                  <th class="py-2 px-3 text-left text-gray-500 dark:text-gray-400">{t('markup')}</th>
                  <th class="py-2 px-3 text-right text-gray-500 dark:text-gray-400">{t('sellingPrice')}</th>
                  <th class="py-2 px-3 text-right text-gray-500 dark:text-gray-400">{t('profit')}</th>
                  <th class="py-2 px-3 text-right text-gray-500 dark:text-gray-400">{t('profitMargin')}</th>
                </tr>
              </thead>
              <tbody>
                {#each generateComparisonTable() as row, index (row.markup)}
<tr  
                    class={`${index % 2 === 0 ? 'bg-white dark:bg-gray-900' : ''} ${
                      markupPercentage === String(row.markup) ? 'bg-amber-50 dark:bg-amber-900/20' : ''
                    }`}
                  >
                    <td class="py-2 px-3 text-gray-900 dark:text-gray-100">{row.markup}%</td>
                    <td class="py-2 px-3 text-right text-gray-900 dark:text-gray-100">{formatCurrency(row.sellingPrice)}</td>
                    <td class="py-2 px-3 text-right text-green-600 dark:text-green-400">{formatCurrency(row.profit)}</td>
                    <td class="py-2 px-3 text-right text-gray-900 dark:text-gray-100">{formatPercent(row.profitMargin)}</td>
                  </tr>
{/each}
              </tbody>
            </table>
          </div>
        </div>
{/if}

      <!-- Formula -->
      <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('formula')}</h3>
        <code class="text-sm text-gray-600 dark:text-gray-400">
          {t('sellingPrice')} = {t('cost')} × (1 + {t('markup')} ÷ 100)
        </code>
      </div>
    </div>
  
