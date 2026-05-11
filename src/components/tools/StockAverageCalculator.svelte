<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  interface StockLot {
    id: string;
    quantity: string;
    price: string;
    fees: string;
  }

  interface StockMetrics {
    totalShares: number;
    totalCost: number;
    averagePrice: number;
    marketValue: number;
    profitLoss: number;
    roi: number;
    breakEvenPrice: number;
  }

  let { locale, translations }: Props = $props();
  void locale;

  function t(key: string): string {
    const scope = (translations.tools as Record<string, unknown>)?.['stock-average-calculator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const part of keys) {
      value = (value as Record<string, unknown>)?.[part];
    }
    return typeof value === 'string' ? value : `MISSING: tools.stock-average-calculator.${key}`;
  }

  let currency = $state('USD');
  let currentPrice = $state('58');
  let lots = $state<StockLot[]>([
    { id: 'lot-1', quantity: '100', price: '42', fees: '2' },
    { id: 'lot-2', quantity: '50', price: '51', fees: '1.5' },
  ]);

  function parsePositive(value: string): number {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  }

  function parseNonNegative(value: string): number {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
  }

  function calculateMetrics(): StockMetrics | null {
    let totalShares = 0;
    let totalCost = 0;

    for (const lot of lots) {
      const quantity = parsePositive(lot.quantity);
      const price = parseNonNegative(lot.price);
      const fees = parseNonNegative(lot.fees);
      if (!quantity || !price) {
        continue;
      }
      totalShares += quantity;
      totalCost += quantity * price + fees;
    }

    if (!totalShares || !totalCost) {
      return null;
    }

    const latestPrice = parseNonNegative(currentPrice);
    const marketValue = latestPrice ? totalShares * latestPrice : 0;
    const profitLoss = marketValue ? marketValue - totalCost : 0;
    const roi = marketValue ? (profitLoss / totalCost) * 100 : 0;
    const averagePrice = totalCost / totalShares;

    return {
      totalShares,
      totalCost,
      averagePrice,
      marketValue,
      profitLoss,
      roi,
      breakEvenPrice: averagePrice,
    };
  }

  const metrics = $derived(calculateMetrics());

  function addLot() {
    lots = [
      ...lots,
      {
        id: `lot-${Date.now()}`,
        quantity: '',
        price: '',
        fees: '0',
      },
    ];
  }

  function removeLot(id: string) {
    lots = lots.length > 1 ? lots.filter((lot) => lot.id !== id) : lots;
  }

  function loadExample() {
    currency = 'USD';
    currentPrice = '58';
    lots = [
      { id: 'sample-1', quantity: '100', price: '42', fees: '2' },
      { id: 'sample-2', quantity: '50', price: '51', fees: '1.5' },
      { id: 'sample-3', quantity: '25', price: '55', fees: '1' },
    ];
  }

  function reset() {
    currentPrice = '';
    lots = [{ id: 'lot-1', quantity: '', price: '', fees: '0' }];
  }

  function formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 4,
    }).format(value);
  }

  function formatNumber(value: number): string {
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 6,
    }).format(value);
  }

  function formatPercent(value: number): string {
    const sign = value > 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  }
</script>

<div class="space-y-6">
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div>
      <label for="stock-currency" class="tool-label">{t('currency')}</label>
      <select id="stock-currency" bind:value={currency} class="tool-input">
        <option value="USD">USD</option>
        <option value="CNY">CNY</option>
        <option value="EUR">EUR</option>
        <option value="GBP">GBP</option>
        <option value="INR">INR</option>
        <option value="JPY">JPY</option>
      </select>
    </div>
    <div class="md:col-span-2">
      <label for="stock-current-price" class="tool-label">{t('currentPrice')}</label>
      <input
        id="stock-current-price"
        type="number"
        min="0"
        step="any"
        bind:value={currentPrice}
        class="tool-input"
        placeholder="58"
      />
    </div>
  </div>

  <div class="space-y-3">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <h3 class="text-base font-semibold text-gray-900 dark:text-white">{t('purchaseLots')}</h3>
      <div class="flex flex-wrap gap-2">
        <button type="button" onclick={loadExample} class="btn-secondary">{t('loadExample')}</button>
        <button type="button" onclick={addLot} class="btn-primary">{t('addLot')}</button>
      </div>
    </div>

    <div class="space-y-3">
      {#each lots as lot, index (lot.id)}
        <div class="grid grid-cols-1 md:grid-cols-[0.4fr,1fr,1fr,1fr,auto] gap-3 items-end p-4 bg-gray-50 dark:bg-gray-900/40 rounded-xl border border-gray-200 dark:border-gray-700">
          <div class="text-sm font-semibold text-gray-500 dark:text-gray-400">#{index + 1}</div>
          <div>
            <label for={`stock-qty-${lot.id}`} class="tool-label">{t('quantity')}</label>
            <input id={`stock-qty-${lot.id}`} type="number" min="0" step="any" bind:value={lot.quantity} class="tool-input" placeholder="100" />
          </div>
          <div>
            <label for={`stock-price-${lot.id}`} class="tool-label">{t('buyPrice')}</label>
            <input id={`stock-price-${lot.id}`} type="number" min="0" step="any" bind:value={lot.price} class="tool-input" placeholder="42" />
          </div>
          <div>
            <label for={`stock-fees-${lot.id}`} class="tool-label">{t('fees')}</label>
            <input id={`stock-fees-${lot.id}`} type="number" min="0" step="any" bind:value={lot.fees} class="tool-input" placeholder="0" />
          </div>
          <button
            type="button"
            onclick={() => removeLot(lot.id)}
            disabled={lots.length === 1}
            class="px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-40 dark:bg-red-900/20 dark:text-red-300 dark:hover:bg-red-900/40"
          >
            {t('remove')}
          </button>
        </div>
      {/each}
    </div>
  </div>

  <div class="flex flex-wrap gap-3">
    <button type="button" onclick={reset} class="btn-secondary">{t('reset')}</button>
  </div>

  {#if metrics}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
        <div class="text-sm text-gray-600 dark:text-gray-400">{t('averagePrice')}</div>
        <div class="text-2xl font-bold text-amber-700 dark:text-amber-300">{formatCurrency(metrics.averagePrice)}</div>
      </div>
      <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
        <div class="text-sm text-gray-600 dark:text-gray-400">{t('totalShares')}</div>
        <div class="text-2xl font-bold text-gray-900 dark:text-white">{formatNumber(metrics.totalShares)}</div>
      </div>
      <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
        <div class="text-sm text-gray-600 dark:text-gray-400">{t('totalCost')}</div>
        <div class="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(metrics.totalCost)}</div>
      </div>
      <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
        <div class="text-sm text-gray-600 dark:text-gray-400">{t('breakEvenPrice')}</div>
        <div class="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(metrics.breakEvenPrice)}</div>
      </div>
    </div>

    {#if metrics.marketValue > 0}
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <div class="text-sm text-gray-600 dark:text-gray-400">{t('marketValue')}</div>
          <div class="text-xl font-semibold text-gray-900 dark:text-white">{formatCurrency(metrics.marketValue)}</div>
        </div>
        <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <div class="text-sm text-gray-600 dark:text-gray-400">{t('profitLoss')}</div>
          <div class={`text-xl font-semibold ${metrics.profitLoss >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {metrics.profitLoss >= 0 ? '+' : ''}{formatCurrency(metrics.profitLoss)}
          </div>
        </div>
        <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <div class="text-sm text-gray-600 dark:text-gray-400">{t('roi')}</div>
          <div class={`text-xl font-semibold ${metrics.roi >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {formatPercent(metrics.roi)}
          </div>
        </div>
      </div>
    {/if}
  {:else}
    <div class="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl text-sm text-yellow-800 dark:text-yellow-200">
      {t('emptyState')}
    </div>
  {/if}
</div>
