<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['unit-price-calculator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.unit-price-calculator.${key}`;
  }

  // Types
  interface Item {
  id: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
}

  let items = $state([
    { id: '1', name: '', price: 0, quantity: 0, unit: 'g' },
    { id: '2', name: '', price: 0, quantity: 0, unit: 'g' },
  ]);

  // Functions
  const units = ['g', 'kg', 'oz', 'lb', 'ml', 'L', 'fl oz', 'pcs', 'pack'];
  function addItem() {
    items = [...items, { id: Date.now().toString(), name: '', price: 0, quantity: 0, unit: 'g' }];
  }
  function removeItem(id: string) {
    if (items.length > 2) {
      items = items.filter(item => item.id !== id);
    }
  }
  function updateItem(id: string, field: keyof Item, value: string | number) {
    items = items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    );
  }
  function calculateUnitPrice(item: Item): number {
    if (item.quantity <= 0 || item.price <= 0) return 0;
    return item.price / item.quantity;
  }
  function getBestValue(): string | null {
    const validItems = items.filter(item => item.quantity > 0 && item.price > 0);
    if (validItems.length < 2) return null;
    
    let bestItem = validItems[0];
    let bestPrice = calculateUnitPrice(bestItem);
    
    validItems.forEach(item => {
      const unitPrice = calculateUnitPrice(item);
      if (unitPrice < bestPrice) {
        bestPrice = unitPrice;
        bestItem = item;
      }
    });
    
    return bestItem.id;
  }
  const bestValueId = getBestValue();

</script>


            <div
              class={`p-4 rounded-lg border-2 transition-colors ${
                isBest
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
              }`}
            >
              <div class="flex items-center justify-between mb-3">
                <span class="font-medium text-gray-900 dark:text-white">
                  {t('item')} {index + 1}
                  {#if isBest}
<span class="ml-2 px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">
                      {t('bestValue')}
                    </span>
{/if}
                </span>
                {#if items.length > 2}
<button
                    onclick={() => removeItem(item.id)}
                    class="text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
{/if}
              </div>
              
              <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    {t('productName')}
                  </label>
                  <input
                    type="text"
                    value={item.name}
                    onchange={(e) => updateItem(item.id, 'name', e.target.value)}
                    placeholder={t('namePlaceholder')}
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
                  />
                </div>
                <div>
                  <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    {t('price')}
                  </label>
                  <input
                    type="number"
                    value={item.price || ''}
                    onchange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
                  />
                </div>
                <div>
                  <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    {t('quantity')}
                  </label>
                  <div class="flex gap-1">
                    <input
                      type="number"
                      value={item.quantity || ''}
                      onchange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      min="0"
                      step="0.01"
                      class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
                    />
                    <select
                      value={item.unit}
                      onchange={(e) => updateItem(item.id, 'unit', e.target.value)}
                      class="px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-r bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
                    >
                      {#each units as unit (unit)}
<option  value={unit}>{unit}</option>
{/each}
                    </select>
                  </div>
                </div>
                <div>
                  <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    {t('unitPrice')}
                  </label>
                  <div class={`px-3 py-2 rounded font-mono text-sm ${
                    isBest
                      ? 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  }`}>
                    {unitPrice > 0 ? `$${unitPrice.toFixed(4)}/${item.unit}` : '-'}
                  </div>
                </div>
              </div>
            </div>
          
