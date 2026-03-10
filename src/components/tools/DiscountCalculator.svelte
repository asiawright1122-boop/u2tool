<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['discount-calculator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.discount-calculator.${key}`;
  }
  function tc(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Imports
  import { calculateDiscount, type DiscountResult } from '@/lib/calculator-utils';

  let originalPrice = $state('100');

  let discountPercentage = $state('20');

  let additionalDiscounts = $state([]);

  let result = $state(null);

  // Functions
  const presetDiscounts = [10, 15, 20, 25, 30, 50];
  function calculate() {
    const price = parseFloat(originalPrice);
    const discount = parseFloat(discountPercentage);

    if (isNaN(price) || isNaN(discount) || price <= 0 || discount < 0 || discount > 100) {
      return;
    }

    const additional = additionalDiscounts
      .map((d) => parseFloat(d))
      .filter((d) => !isNaN(d) && d > 0 && d <= 100);

    const res = calculateDiscount({
      originalPrice: price,
      discountPercentage: discount,
      additionalDiscounts: additional,
    });
    result = res;
  }
  function addAdditionalDiscount() {
    additionalDiscounts = [...additionalDiscounts, '10'];
  }
  function removeAdditionalDiscount(index: number) {
    additionalDiscounts = additionalDiscounts.filter((_, i) => i !== index);
  }
  function updateAdditionalDiscount(index: number, value: string) {
    const updated = [...additionalDiscounts];
    updated[index] = value;
    additionalDiscounts = updated;
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
        <label for="discount-original-price" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t('originalPrice')}
        </label>
        <input
          id="discount-original-price"
          name="originalPrice"
          type="number"
          bind:value={originalPrice}
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-lg"
          placeholder="100.00"
        />
      </div>

      <div>
        <label for="discount-percentage" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('discountPercentage')}
        </label>
        <div class="flex flex-wrap gap-2 mb-2">
          {#each presetDiscounts as discount (discount)}
<button 
              onclick={() => discountPercentage = discount.toString()}
              class={`px-4 py-2 rounded-lg transition-colors ${
                discountPercentage === discount.toString()
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {discount}%
            </button>
{/each}
        </div>
        <input
          id="discount-percentage"
          name="discountPercentage"
          type="number"
          bind:value={discountPercentage}
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          placeholder="20"
        />
      </div>

      <div>
        <div class="flex justify-between items-center mb-2">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('additionalDiscounts')}
          </label>
          <button
            onclick={addAdditionalDiscount}
            class="text-sm text-blue-600 hover:text-blue-700"
          >
            + {t('addDiscount')}
          </button>
        </div>
        {#each additionalDiscounts as discount, index (index)}
<div  class="flex gap-2 mb-2">
            <input
              type="number"
              value={discount}
              onchange={(e) => updateAdditionalDiscount(index, e.target.value)}
              class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="10"
            />
            <button
              onclick={() => removeAdditionalDiscount(index)}
              class="px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
            >
              ✕
            </button>
          </div>
{/each}
      </div>

      <button
        onclick={calculate}
        class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        {tc('calculate')}
      </button>

      {#if result}
<div class="space-y-4">
          <div class="p-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg text-white text-center">
            <div class="text-sm opacity-80">{t('finalPrice')}</div>
            <div class="text-4xl font-bold">{formatCurrency(result.discountedPrice)}</div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div class="text-sm text-gray-600 dark:text-gray-400">{t('amountSaved')}</div>
              <div class="text-2xl font-bold text-red-600 dark:text-red-400">
                {formatCurrency(result.amountSaved)}
              </div>
            </div>
            <div class="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div class="text-sm text-gray-600 dark:text-gray-400">{t('totalDiscount')}</div>
              <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {result.totalDiscountPercentage.toFixed(1)}%
              </div>
            </div>
          </div>

          <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div class="flex justify-between text-sm">
              <span>{t('originalPrice')}</span>
              <span class="line-through text-gray-500">{formatCurrency(parseFloat(originalPrice))}</span>
            </div>
            <div class="flex justify-between text-sm mt-1">
              <span>{t('discount')} ({discountPercentage}%)</span>
              <span class="text-red-600">-{formatCurrency(parseFloat(originalPrice) * parseFloat(discountPercentage) / 100)}</span>
            </div>
            {#each additionalDiscounts as d, i (i)}
<div  class="flex justify-between text-sm mt-1">
                <span>{t('additionalDiscount')} {i + 1} ({d}%)</span>
                <span class="text-red-600">-{d}%</span>
              </div>
{/each}
            <div class="flex justify-between font-bold mt-2 pt-2 border-t dark:border-gray-700">
              <span>{t('finalPrice')}</span>
              <span class="text-green-600">{formatCurrency(result.discountedPrice)}</span>
            </div>
          </div>
        </div>
{/if}
    </div>
  
