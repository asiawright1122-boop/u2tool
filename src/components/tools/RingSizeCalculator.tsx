'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { 
  ringSizes, 
  ringSizeSystemNames,
  calculateRingSizeFromMeasurement,
  measurementTips,
  type RingSizeSystem,
  type RingSizeRow 
} from '@/lib/data/ring-sizes';

export default function RingSizeCalculator() {
  const t = useTranslations('tools.ring-size-calculator');
  const tc = useTranslations('tools');
  
  const [mode, setMode] = useState<'convert' | 'measure'>('convert');
  const [selectedUS, setSelectedUS] = useState<number | null>(null);
  const [measurement, setMeasurement] = useState('');
  const [measureType, setMeasureType] = useState<'diameter' | 'circumference'>('circumference');
  
  const systems: RingSizeSystem[] = ['us', 'uk', 'eu', 'jp', 'diameter', 'circumference'];
  
  // Find matching row
  const matchingRow = selectedUS !== null 
    ? ringSizes.find(row => row.us === selectedUS)
    : null;

  // Calculate from measurement
  const calculatedRow = measurement 
    ? calculateRingSizeFromMeasurement(parseFloat(measurement), measureType)
    : null;

  const displayRow = mode === 'convert' ? matchingRow : calculatedRow;

  return (
    <div className="space-y-6">
      {/* Mode Selection */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode('convert')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            mode === 'convert'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          {t('convertMode')}
        </button>
        <button
          onClick={() => setMode('measure')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            mode === 'measure'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          {t('measureMode')}
        </button>
      </div>

      {mode === 'convert' ? (
        /* Size Selection */
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('selectUSSize')}
          </label>
          <div className="flex flex-wrap gap-2">
            {ringSizes.map((row) => (
              <button
                key={row.us}
                onClick={() => setSelectedUS(row.us)}
                className={`px-3 py-2 rounded-lg font-medium transition-colors min-w-[50px] ${
                  selectedUS === row.us
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {row.us}
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Measurement Input */
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('measurementType')}
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setMeasureType('circumference')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  measureType === 'circumference'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {t('circumference')}
              </button>
              <button
                onClick={() => setMeasureType('diameter')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  measureType === 'diameter'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {t('diameter')}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('enterMeasurement')} (mm)
            </label>
            <input
              type="number"
              value={measurement}
              onChange={(e) => setMeasurement(e.target.value)}
              placeholder={measureType === 'circumference' ? '44-75' : '14-24'}
              step="0.1"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      {/* Conversion Results */}
      {displayRow && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('yourRingSize')}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {systems.map(system => (
              <div
                key={system}
                className="p-4 rounded-lg text-center bg-white dark:bg-gray-700"
              >
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  {ringSizeSystemNames[system]}
                </div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {displayRow[system as keyof RingSizeRow]}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Size Chart Table */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t('sizeChart')}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-600">
                {systems.map(system => (
                  <th key={system} className="px-3 py-2 text-left font-medium text-gray-700 dark:text-gray-300">
                    {ringSizeSystemNames[system]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ringSizes.map((row, idx) => (
                <tr 
                  key={idx} 
                  className={`border-b border-gray-100 dark:border-gray-700 ${
                    displayRow === row ? 'bg-blue-50 dark:bg-blue-900/30' : ''
                  }`}
                >
                  {systems.map(system => (
                    <td key={system} className="px-3 py-2 text-gray-900 dark:text-white">
                      {row[system as keyof RingSizeRow]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Measurement Tips */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4">
        <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
          {t('measurementTips')}
        </h4>
        <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1 list-disc list-inside">
          {measurementTips.map((tip, idx) => (
            <li key={idx}>{tip}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
