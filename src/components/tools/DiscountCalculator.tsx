'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { calculateDiscount, DiscountResult } from '@/lib/calculator-utils';

export default function DiscountCalculator() {
  const t = useTranslations('tools.discount-calculator');
  const tc = useTranslations('tools');

  const [originalPrice, setOriginalPrice] = useState<string>('100');
  const [discountPercentage, setDiscountPercentage] = useState<string>('20');
  const [additionalDiscounts, setAdditionalDiscounts] = useState<string[]>([]);
  const [result, setResult] = useState<DiscountResult | null>(null);

  const presetDiscounts = [10, 15, 20, 25, 30, 50];

  const calculate = () => {
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
    setResult(res);
  };

  const addAdditionalDiscount = () => {
    setAdditionalDiscounts([...additionalDiscounts, '10']);
  };

  const removeAdditionalDiscount = (index: number) => {
    setAdditionalDiscounts(additionalDiscounts.filter((_, i) => i !== index));
  };

  const updateAdditionalDiscount = (index: number, value: string) => {
    const updated = [...additionalDiscounts];
    updated[index] = value;
    setAdditionalDiscounts(updated);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t('originalPrice')}
        </label>
        <input
          type="number"
          value={originalPrice}
          onChange={(e) => setOriginalPrice(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-lg"
          placeholder="100.00"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('discountPercentage')}
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {presetDiscounts.map((discount) => (
            <button
              key={discount}
              onClick={() => setDiscountPercentage(discount.toString())}
              className={`px-4 py-2 rounded-lg transition-colors ${
                discountPercentage === discount.toString()
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {discount}%
            </button>
          ))}
        </div>
        <input
          type="number"
          value={discountPercentage}
          onChange={(e) => setDiscountPercentage(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          placeholder="20"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('additionalDiscounts')}
          </label>
          <button
            onClick={addAdditionalDiscount}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            + {t('addDiscount')}
          </button>
        </div>
        {additionalDiscounts.map((discount, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="number"
              value={discount}
              onChange={(e) => updateAdditionalDiscount(index, e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="10"
            />
            <button
              onClick={() => removeAdditionalDiscount(index)}
              className="px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={calculate}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        {tc('calculate')}
      </button>

      {result && (
        <div className="space-y-4">
          <div className="p-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg text-white text-center">
            <div className="text-sm opacity-80">{t('finalPrice')}</div>
            <div className="text-4xl font-bold">{formatCurrency(result.discountedPrice)}</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400">{t('amountSaved')}</div>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {formatCurrency(result.amountSaved)}
              </div>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400">{t('totalDiscount')}</div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {result.totalDiscountPercentage.toFixed(1)}%
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex justify-between text-sm">
              <span>{t('originalPrice')}</span>
              <span className="line-through text-gray-500">{formatCurrency(parseFloat(originalPrice))}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span>{t('discount')} ({discountPercentage}%)</span>
              <span className="text-red-600">-{formatCurrency(parseFloat(originalPrice) * parseFloat(discountPercentage) / 100)}</span>
            </div>
            {additionalDiscounts.map((d, i) => (
              <div key={i} className="flex justify-between text-sm mt-1">
                <span>{t('additionalDiscount')} {i + 1} ({d}%)</span>
                <span className="text-red-600">-{d}%</span>
              </div>
            ))}
            <div className="flex justify-between font-bold mt-2 pt-2 border-t dark:border-gray-700">
              <span>{t('finalPrice')}</span>
              <span className="text-green-600">{formatCurrency(result.discountedPrice)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
