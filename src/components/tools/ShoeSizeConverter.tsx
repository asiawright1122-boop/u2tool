'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { 
  getShoeSizes, 
  sizeSystemNames, 
  type SizeSystem, 
  type Gender,
  type ShoeSizeRow 
} from '@/lib/data/shoe-sizes';

export default function ShoeSizeConverter() {
  const t = useTranslations('tools.shoe-size-converter');
  const tc = useTranslations('tools');
  
  const [gender, setGender] = useState<Gender>('men');
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [fromSystem, setFromSystem] = useState<SizeSystem>('us_men');
  
  const sizes = getShoeSizes(gender);
  const systems: SizeSystem[] = ['us_men', 'us_women', 'uk', 'eu', 'jp', 'cn'];
  
  // Find matching row
  const matchingRow = selectedSize !== null 
    ? sizes.find(row => Math.abs(row[fromSystem] - selectedSize) < 0.5)
    : null;

  const handleGenderChange = (newGender: Gender) => {
    setGender(newGender);
    setSelectedSize(null);
  };

  const handleSystemChange = (system: SizeSystem) => {
    setFromSystem(system);
    setSelectedSize(null);
  };

  return (
    <div className="space-y-6">
      {/* Gender Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('gender')}
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => handleGenderChange('men')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              gender === 'men'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {t('men')}
          </button>
          <button
            onClick={() => handleGenderChange('women')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              gender === 'women'
                ? 'bg-pink-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {t('women')}
          </button>
        </div>
      </div>

      {/* Size System Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('selectSystem')}
        </label>
        <div className="flex flex-wrap gap-2">
          {systems.map(system => (
            <button
              key={system}
              onClick={() => handleSystemChange(system)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                fromSystem === system
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {sizeSystemNames[system]}
            </button>
          ))}
        </div>
      </div>

      {/* Size Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('selectSize')} ({sizeSystemNames[fromSystem]})
        </label>
        <div className="flex flex-wrap gap-2">
          {sizes.map((row, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedSize(row[fromSystem])}
              className={`px-3 py-2 rounded-lg font-medium transition-colors min-w-[50px] ${
                selectedSize === row[fromSystem]
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {row[fromSystem]}
            </button>
          ))}
        </div>
      </div>

      {/* Conversion Results */}
      {matchingRow && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('conversionResults')}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {systems.map(system => (
              <div
                key={system}
                className={`p-4 rounded-lg text-center ${
                  system === fromSystem
                    ? 'bg-blue-100 dark:bg-blue-900 border-2 border-blue-500'
                    : 'bg-white dark:bg-gray-700'
                }`}
              >
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  {sizeSystemNames[system]}
                </div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {matchingRow[system]}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Size Chart Table */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t('sizeChart')} - {gender === 'men' ? t('men') : t('women')}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-600">
                {systems.map(system => (
                  <th key={system} className="px-3 py-2 text-left font-medium text-gray-700 dark:text-gray-300">
                    {sizeSystemNames[system]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sizes.map((row, idx) => (
                <tr 
                  key={idx} 
                  className={`border-b border-gray-100 dark:border-gray-700 ${
                    matchingRow === row ? 'bg-blue-50 dark:bg-blue-900/30' : ''
                  }`}
                >
                  {systems.map(system => (
                    <td key={system} className="px-3 py-2 text-gray-900 dark:text-white">
                      {row[system]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4">
        <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
          {t('tips')}
        </h4>
        <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1 list-disc list-inside">
          <li>{t('tip1')}</li>
          <li>{t('tip2')}</li>
          <li>{t('tip3')}</li>
        </ul>
      </div>
    </div>
  );
}
