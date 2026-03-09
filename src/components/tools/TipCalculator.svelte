<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['tip-calculator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.tip-calculator.${key}`;
  }
  function tc(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Imports
  import { calculateTip, type TipResult } from '@/lib/calculator-utils';

  let billAmount = $state('50');

  let tipPercentage = $state('15');

  let splitCount = $state('1');

  let result = $state(null);

  // Functions
  const presetTips = [10, 15, 18, 20, 25];
  function calculate() {
    const bill = parseFloat(billAmount);
    const tip = parseFloat(tipPercentage);
    const split = parseInt(splitCount);

    if (isNaN(bill) || isNaN(tip) || isNaN(split) || bill <= 0 || tip < 0 || split < 1) {
      return;
    }

    const res = calculateTip({ billAmount: bill, tipPercentage: tip, splitCount: split });
    result = res;
  }
  function formatCurrency(value: number) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  }

</script>


    <div class="space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t('billAmount')}
        </label>
        <input
          type="number"
          bind:value={billAmount}
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-lg"
          placeholder="50.00"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('tipPercentage')}
        </label>
        <div class="flex flex-wrap gap-2 mb-2">
          {#each presetTips as tip (tip)}
<button 
              onclick={() => tipPercentage = tip.toString()}
              class={`px-4 py-2 rounded-lg transition-colors ${
                tipPercentage === tip.toString()
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {tip}%
            </button>
{/each}
        </div>
        <input
          type="number"
          bind:value={tipPercentage}
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          placeholder="15"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t('splitCount')}
        </label>
        <div class="flex items-center gap-2">
          <button
            onclick={() => splitCount = Math.max(1, parseInt(splitCount) - 1).toString()}
            class="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            -
          </button>
          <input
            type="number"
            bind:value={splitCount}
            class="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-center"
            min="1"
          />
          <button
            onclick={() => splitCount = (parseInt(splitCount) + 1).toString()}
            class="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            +
          </button>
        </div>
      </div>

      <button
        onclick={calculate}
        class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        {tc('calculate')}
      </button>

      {#if result}
<div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div class="text-sm text-gray-600 dark:text-gray-400">{t('tipAmount')}</div>
              <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {formatCurrency(result.tipAmount)}
              </div>
            </div>
            <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div class="text-sm text-gray-600 dark:text-gray-400">{t('totalAmount')}</div>
              <div class="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(result.totalAmount)}
              </div>
            </div>
          </div>

          {#if parseInt(splitCount) > 1}
<div class="grid grid-cols-2 gap-4">
              <div class="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div class="text-sm text-gray-600 dark:text-gray-400">{t('perPersonTip')}</div>
                <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {formatCurrency(result.perPersonTip)}
                </div>
              </div>
              <div class="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div class="text-sm text-gray-600 dark:text-gray-400">{t('perPersonTotal')}</div>
                <div class="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {formatCurrency(result.perPersonAmount)}
                </div>
              </div>
            </div>
{/if}
        </div>
{/if}
    </div>
  
