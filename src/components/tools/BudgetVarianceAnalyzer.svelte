<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['budget-variance-analyzer'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.budget-variance-analyzer.${key}`;
  }
  function tCommon(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  interface BudgetItem {
  id: string;
  category: string;
  budgeted: number;
  actual: number;
  notes: string;
}
  interface AnalysisData {
  title: string;
  period: string;
  items: BudgetItem[];
  currency: string;
}

  let data = $state({
    title: 'Q1 Budget Analysis',
    period: 'January - March 2024',
    items: [
      { id: '1', category: 'Revenue', budgeted: 100000, actual: 95000, notes: '' },
      { id: '2', category: 'Cost of Goods Sold', budgeted: 40000, actual: 42000, notes: '' },
      { id: '3', category: 'Marketing', budgeted: 15000, actual: 18000, notes: 'Additional campaign' },
      { id: '4', category: 'Salaries', budgeted: 30000, actual: 30000, notes: '' },
      { id: '5', category: 'Rent', budgeted: 5000, actual: 5000, notes: '' },
      { id: '6', category: 'Utilities', budgeted: 2000, actual: 1800, notes: '' },
    ],
    currency: 'USD',
  });

  function updateData(key: K, value: AnalysisData[K]) {
    data = ({ ...data, [key]: value });
  }

  function addItem() {
    data = ({
      ...data,
      items: [...data.items, { id: Date.now().toString(), category: '', budgeted: 0, actual: 0, notes: '' }],
    });
  }

  function updateItem(id: string, field: keyof BudgetItem, value: string | number) {
    data = ({
      ...data,
      items: data.items.map(item => item.id === id ? { ...item, [field]: value } : item),
    });
  }

  function removeItem(id: string) {
    data = ({
      ...data,
      items: data.items.filter(item => item.id !== id),
    });
  }

  let analysis = $derived.by(() => {
    const items = data.items.map(item => {
      const variance = item.actual - item.budgeted;
      const variancePercent = item.budgeted !== 0 ? (variance / item.budgeted) * 100 : 0;
      const isRevenue = item.category.toLowerCase().includes('revenue');
      const isFavorable = isRevenue ? variance >= 0 : variance <= 0;
      return { ...item, variance, variancePercent, isFavorable };
    });

    const totalBudgeted = items.reduce((sum, i) => sum + i.budgeted, 0);
    const totalActual = items.reduce((sum, i) => sum + i.actual, 0);
    const totalVariance = totalActual - totalBudgeted;
    const totalVariancePercent = totalBudgeted !== 0 ? (totalVariance / totalBudgeted) * 100 : 0;

    const favorable = items.filter(i => i.isFavorable);
    const unfavorable = items.filter(i => !i.isFavorable);
    const largestVariance = [...items].sort((a, b) => Math.abs(b.variance) - Math.abs(a.variance))[0];

    return {
      items,
      totalBudgeted,
      totalActual,
      totalVariance,
      totalVariancePercent,
      favorable,
      unfavorable,
      largestVariance,
    };
  });

  let currencySymbol = $derived.by(() => {
    const symbols: Record<string, string> = { USD: '$', EUR: '€', GBP: '£', CNY: '¥', JPY: '¥' };
    return symbols[data.currency] || '$';
  });

  function formatCurrency(amount: number) {
    const sign = amount < 0 ? '-' : '';
    return `${sign}${currencySymbol}${Math.abs(amount).toLocaleString()}`;
  }

  function exportReport() {
    const report = {
      ...data,
      analysis: {
        totalBudgeted: analysis.totalBudgeted,
        totalActual: analysis.totalActual,
        totalVariance: analysis.totalVariance,
        totalVariancePercent: analysis.totalVariancePercent,
        favorableCount: analysis.favorable.length,
        unfavorableCount: analysis.unfavorable.length,
      },
      items: analysis.items,
      generatedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `budget-variance-${data.period.replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

</script>


    <div class="space-y-6">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-xs text-gray-500 mb-1">{t('reportTitle')}</label>
          <input
            type="text"
            value={data.title}
            onchange={(e) => updateData('title', e.target.value)}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-1">{t('period')}</label>
          <input
            type="text"
            value={data.period}
            onchange={(e) => updateData('period', e.target.value)}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-1">{t('currency')}</label>
          <select
            value={data.currency}
            onchange={(e) => updateData('currency', e.target.value)}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            {#each ['USD', 'EUR', 'GBP', 'CNY', 'JPY'] as c (c)}
<option  value={c}>{c}</option>
{/each}
          </select>
        </div>
        <div class="flex items-end">
          <button onclick={addItem} class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            {t('addItem')}
          </button>
        </div>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <p class="text-xs text-gray-500">{t('totalBudgeted')}</p>
          <p class="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(analysis.totalBudgeted)}</p>
        </div>
        <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <p class="text-xs text-gray-500">{t('totalActual')}</p>
          <p class="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(analysis.totalActual)}</p>
        </div>
        <div class={`p-4 rounded-lg ${analysis.totalVariance >= 0 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
          <p class="text-xs text-gray-500">{t('totalVariance')}</p>
          <p class={`text-xl font-bold ${analysis.totalVariance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(analysis.totalVariance)}
          </p>
          <p class={`text-xs ${analysis.totalVariance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {analysis.totalVariancePercent >= 0 ? '+' : ''}{analysis.totalVariancePercent.toFixed(1)}%
          </p>
        </div>
        <div class="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <p class="text-xs text-gray-500">{t('status')}</p>
          <p class="text-lg font-bold text-purple-600">
            {analysis.favorable.length} / {analysis.items.length}
          </p>
          <p class="text-xs text-purple-500">{t('favorableItems')}</p>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-700">
              <th class="text-left py-3 px-2">{t('category')}</th>
              <th class="text-right py-3 px-2">{t('budgeted')}</th>
              <th class="text-right py-3 px-2">{t('actual')}</th>
              <th class="text-right py-3 px-2">{t('variance')}</th>
              <th class="text-right py-3 px-2">%</th>
              <th class="text-center py-3 px-2">{t('status')}</th>
              <th class="text-left py-3 px-2">{t('notes')}</th>
              <th class="py-3 px-2"></th>
            </tr>
          </thead>
          <tbody>
            {#each analysis.items as item (item.id)}
<tr  class="border-b border-gray-100 dark:border-gray-800">
                <td class="py-2 px-2">
                  <input
                    type="text"
                    value={item.category}
                    onchange={(e) => updateItem(item.id, 'category', e.target.value)}
                    list="categories"
                    placeholder={t("categoryPlaceholder")}
                    class="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </td>
                <td class="py-2 px-2">
                  <input
                    type="number"
                    value={item.budgeted}
                    onchange={(e) => updateItem(item.id, 'budgeted', parseFloat(e.target.value) || 0)}
                    class="w-28 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-right"
                  />
                </td>
                <td class="py-2 px-2">
                  <input
                    type="number"
                    value={item.actual}
                    onchange={(e) => updateItem(item.id, 'actual', parseFloat(e.target.value) || 0)}
                    class="w-28 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-right"
                  />
                </td>
                <td class={`py-2 px-2 text-right font-medium ${item.isFavorable ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(item.variance)}
                </td>
                <td class={`py-2 px-2 text-right ${item.isFavorable ? 'text-green-600' : 'text-red-600'}`}>
                  {item.variancePercent >= 0 ? '+' : ''}{item.variancePercent.toFixed(1)}%
                </td>
                <td class="py-2 px-2 text-center">
                  <span class={`px-2 py-0.5 text-xs rounded ${item.isFavorable ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                    {item.isFavorable ? t('favorable') : t('unfavorable')}
                  </span>
                </td>
                <td class="py-2 px-2">
                  <input
                    type="text"
                    value={item.notes}
                    onchange={(e) => updateItem(item.id, 'notes', e.target.value)}
                    placeholder={t("notesPlaceholder")}
                    class="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </td>
                <td class="py-2 px-2">
                  <button onclick={() => removeItem(item.id)} class="text-red-500 hover:text-red-700">×</button>
                </td>
              </tr>
{/each}
          </tbody>
        </table>
        <datalist id="categories">
          {#each DEFAULT_CATEGORIES as c (c)}
<option  value={c}></option>
{/each}
        </datalist>
      </div>

      {#if analysis.largestVariance}
<div class="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <h4 class="font-medium text-yellow-800 dark:text-yellow-200 mb-2"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg> {t('largestVarianceAlert')}</h4>
          <p class="text-sm text-yellow-700 dark:text-yellow-300">
            <strong>{analysis.largestVariance.category}</strong> has the largest variance of{' '}
            <strong>{formatCurrency(analysis.largestVariance.variance)}</strong>{' '}
            ({analysis.largestVariance.variancePercent >= 0 ? '+' : ''}{analysis.largestVariance.variancePercent.toFixed(1)}%)
          </p>
        </div>
{/if}

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <h4 class="font-medium mb-3 text-green-600">{t('favorableVariances')}</h4>
          {#if analysis.favorable.length > 0}
<ul class="space-y-1 text-sm">
              {#each analysis.favorable as item (item.id)}
<li  class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">{item.category}</span>
                  <span class="text-green-600">{formatCurrency(Math.abs(item.variance))}</span>
                </li>
{/each}
            </ul>
{:else}
<p class="text-sm text-gray-500">{t('noFavorableVariances')}</p>
{/if}
        </div>
        <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <h4 class="font-medium mb-3 text-red-600">{t('unfavorableVariances')}</h4>
          {#if analysis.unfavorable.length > 0}
<ul class="space-y-1 text-sm">
              {#each analysis.unfavorable as item (item.id)}
<li  class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">{item.category}</span>
                  <span class="text-red-600">{formatCurrency(Math.abs(item.variance))}</span>
                </li>
{/each}
            </ul>
{:else}
<p class="text-sm text-gray-500">{t('noUnfavorableVariances')}</p>
{/if}
        </div>
      </div>

      <button onclick={exportReport} class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        {t('exportReport')}
      </button>
    </div>
  
