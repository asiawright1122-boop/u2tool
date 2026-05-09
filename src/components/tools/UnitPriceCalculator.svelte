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

<div class="space-y-4">
  {#each items as item, index (item.id)}
    {@const unitPrice = calculateUnitPrice(item)}
    {@const isBest = bestValueId === item.id}
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
            <span class="ml-2 px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">{t('bestValue')}</span>
          {/if}
        </span>
        {#if items.length > 2}
          <button onclick={() => removeItem(item.id)} class="text-red-500 hover:text-red-700">x</button>
        {/if}
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <input type="text" value={item.name} oninput={(event) => updateItem(item.id, 'name', event.currentTarget.value)} placeholder={t('namePlaceholder')} class="px-3 py-2 border rounded bg-white dark:bg-gray-900" />
        <input type="number" value={item.price || ''} oninput={(event) => updateItem(item.id, 'price', parseFloat(event.currentTarget.value) || 0)} placeholder="0.00" min="0" step="0.01" class="px-3 py-2 border rounded bg-white dark:bg-gray-900" />
        <div class="flex">
          <input type="number" value={item.quantity || ''} oninput={(event) => updateItem(item.id, 'quantity', parseFloat(event.currentTarget.value) || 0)} placeholder="0" min="0" step="0.01" class="flex-1 px-3 py-2 border rounded-l bg-white dark:bg-gray-900" />
          <select value={item.unit} onchange={(event) => updateItem(item.id, 'unit', event.currentTarget.value)} class="px-2 py-2 border rounded-r bg-white dark:bg-gray-900">
            {#each units as unit (unit)}
              <option value={unit}>{unit}</option>
            {/each}
          </select>
        </div>
        <div class={`px-3 py-2 rounded font-mono text-sm ${isBest ? 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200' : 'bg-gray-100 dark:bg-gray-700'}`}>
          {unitPrice > 0 ? `$${unitPrice.toFixed(4)}/${item.unit}` : '-'}
        </div>
      </div>
    </div>
  {/each}

  <button onclick={addItem} class="px-4 py-2 bg-amber-600 text-white rounded-lg">{t('addItem')}</button>
</div>
