<script lang="ts">
  import { calculateMargin } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['margin-calculator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.margin-calculator.${key}`;
  }
  function tCommon(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  interface MarginResult {
  profit: number;
  profitMargin: number;
  markup: number;
  grossProfit: number;
}

  let cost = $state('50');

  let sellingPrice = $state('100');

  let result = $state(null);

  function handleCalculate() {
    const costNum = parseFloat(cost);
    const priceNum = parseFloat(sellingPrice);
    
    if (isNaN(costNum) || isNaN(priceNum) || costNum <= 0 || priceNum <= 0) {
      return;
    }
    
    result = calculateMargin(costNum, priceNum);
  }

  // Functions
  function clearAll() {
    cost = '50';
    sellingPrice = '100';
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
  function calculateFromMargin(targetMargin: number) {
    const costNum = parseFloat(cost);
    if (isNaN(costNum) || costNum <= 0 || targetMargin >= 100) return;
    
    const newPrice = costNum / (1 - targetMargin / 100);
    sellingPrice = newPrice.toFixed(2);
    result = calculateMargin(costNum, newPrice);
  }
  function calculateFromMarkup(targetMarkup: number) {
    const costNum = parseFloat(cost);
    if (isNaN(costNum) || costNum <= 0) return;
    
    const newPrice = costNum * (1 + targetMarkup / 100);
    sellingPrice = newPrice.toFixed(2);
    result = calculateMargin(costNum, newPrice);
  }

</script>


    <div class="space-y-6">
      <!-- Info -->
      <div class="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p class="text-sm text-blue-700 dark:text-blue-300">
          {t('info')}
        </p>
      </div>

      <!-- Input Form -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('cost')}
          </label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              bind:value={cost}
              placeholder="50"
              step="0.01"
              class="w-full pl-8 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('sellingPrice')}
          </label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              bind:value={sellingPrice}
              placeholder="100"
              step="0.01"
              class="w-full pl-8 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <!-- Quick Margin Buttons -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('targetMargin')}
        </label>
        <div class="flex flex-wrap gap-2">
          {#each [10, 20, 25, 30, 40, 50] as margin (margin)}
<button 
              onclick={() => calculateFromMargin(margin)}
              class="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-sm"
            >
              {margin}%
            </button>
{/each}
        </div>
      </div>

      <!-- Quick Markup Buttons -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('targetMarkup')}
        </label>
        <div class="flex flex-wrap gap-2">
          {#each [25, 50, 75, 100, 150, 200] as markup (markup)}
<button 
              onclick={() => calculateFromMarkup(markup)}
              class="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-sm"
            >
              {markup}%
            </button>
{/each}
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-center gap-4">
        <button
          onclick={handleCalculate}
          class="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-white"
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
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p class="text-sm text-green-600 dark:text-green-400">{t('profit')}</p>
              <p class="text-2xl font-bold text-green-700 dark:text-green-300">
                {formatCurrency(result.profit)}
              </p>
            </div>
            
            <div class="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p class="text-sm text-blue-600 dark:text-blue-400">{t('profitMargin')}</p>
              <p class="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {formatPercent(result.profitMargin)}
              </p>
            </div>
            
            <div class="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
              <p class="text-sm text-purple-600 dark:text-purple-400">{t('markup')}</p>
              <p class="text-2xl font-bold text-purple-700 dark:text-purple-300">
                {formatPercent(result.markup)}
              </p>
            </div>
            
            <div class="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
              <p class="text-sm text-orange-600 dark:text-orange-400">{t('grossProfit')}</p>
              <p class="text-2xl font-bold text-orange-700 dark:text-orange-300">
                {formatCurrency(result.grossProfit)}
              </p>
            </div>
          </div>

          <!-- Visual Breakdown -->
          <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{t('breakdown')}</h3>
            <div class="space-y-3">
              <div class="flex items-center gap-2">
                <div class="w-24 text-sm text-gray-600 dark:text-gray-400">{t('cost')}</div>
                <div class="flex-1 h-6 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                  <div 
                    class="h-full bg-red-400 dark:bg-red-600"
                    style="width: {(parseFloat(cost) / parseFloat(sellingPrice)) * 100}%"></div>
                </div>
                <div class="w-24 text-right text-sm text-gray-900 dark:text-gray-100">{formatCurrency(parseFloat(cost))}</div>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-24 text-sm text-gray-600 dark:text-gray-400">{t('profit')}</div>
                <div class="flex-1 h-6 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                  <div 
                    class="h-full bg-green-400 dark:bg-green-600"
                    style="width: {result.profitMargin}%"></div>
                </div>
                <div class="w-24 text-right text-sm text-gray-900 dark:text-gray-100">{formatCurrency(result.profit)}</div>
              </div>
            </div>
          </div>

          <!-- Formulas -->
          <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2">
            <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('formulas')}</h3>
            <div class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <p><strong>{t('profitMargin')}:</strong> ({t('sellingPrice')} - {t('cost')}) ÷ {t('sellingPrice')} × 100</p>
              <p><strong>{t('markup')}:</strong> ({t('sellingPrice')} - {t('cost')}) ÷ {t('cost')} × 100</p>
            </div>
          </div>

          <!-- Margin vs Markup Comparison -->
          <div class="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <h3 class="text-sm font-medium text-yellow-700 dark:text-yellow-300 mb-2">{t('marginVsMarkup')}</h3>
            <p class="text-sm text-yellow-600 dark:text-yellow-400">
              {t('marginVsMarkupExplanation')}
            </p>
          </div>
        </div>
{/if}
    </div>
  
