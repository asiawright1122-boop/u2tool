'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface Item {
  id: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
}

export default function UnitPriceCalculator() {
  const t = useTranslations('tools.unit-price-calculator');
  const [items, setItems] = useState<Item[]>([
    { id: '1', name: '', price: 0, quantity: 0, unit: 'g' },
    { id: '2', name: '', price: 0, quantity: 0, unit: 'g' },
  ]);

  const units = ['g', 'kg', 'oz', 'lb', 'ml', 'L', 'fl oz', 'pcs', 'pack'];

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), name: '', price: 0, quantity: 0, unit: 'g' }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 2) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof Item, value: string | number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const calculateUnitPrice = (item: Item): number => {
    if (item.quantity <= 0 || item.price <= 0) return 0;
    return item.price / item.quantity;
  };

  const getBestValue = (): string | null => {
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
  };

  const bestValueId = getBestValue();

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {items.map((item, index) => {
          const unitPrice = calculateUnitPrice(item);
          const isBest = item.id === bestValueId;
          
          return (
            <div
              key={item.id}
              className={`p-4 rounded-lg border-2 transition-colors ${
                isBest
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-gray-900 dark:text-white">
                  {t('item')} {index + 1}
                  {isBest && (
                    <span className="ml-2 px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">
                      {t('bestValue')}
                    </span>
                  )}
                </span>
                {items.length > 2 && (
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    {t('productName')}
                  </label>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                    placeholder={t('namePlaceholder')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    {t('price')}
                  </label>
                  <input
                    type="number"
                    value={item.price || ''}
                    onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    {t('quantity')}
                  </label>
                  <div className="flex gap-1">
                    <input
                      type="number"
                      value={item.quantity || ''}
                      onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      min="0"
                      step="0.01"
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
                    />
                    <select
                      value={item.unit}
                      onChange={(e) => updateItem(item.id, 'unit', e.target.value)}
                      className="px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-r bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
                    >
                      {units.map(unit => (
                        <option key={unit} value={unit}>{unit}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    {t('unitPrice')}
                  </label>
                  <div className={`px-3 py-2 rounded font-mono text-sm ${
                    isBest
                      ? 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  }`}>
                    {unitPrice > 0 ? `$${unitPrice.toFixed(4)}/${item.unit}` : '-'}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={addItem}
        className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-colors"
      >
        + {t('addItem')}
      </button>

      {bestValueId && (
        <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-lg text-center">
          <p className="text-green-800 dark:text-green-300 font-medium">
            🏆 {t('bestValueMessage')}
          </p>
        </div>
      )}

      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">{t('tipTitle')}</h3>
        <p className="text-sm text-blue-700 dark:text-blue-400">{t('tipDescription')}</p>
      </div>
    </div>
  );
}
