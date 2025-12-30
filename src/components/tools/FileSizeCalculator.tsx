'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

type Unit = 'B' | 'KB' | 'MB' | 'GB' | 'TB' | 'PB';
type Base = 'binary' | 'decimal';

export default function FileSizeCalculator() {
  const t = useTranslations('tools.file-size-calculator');
  const [inputValue, setInputValue] = useState('1');
  const [inputUnit, setInputUnit] = useState<Unit>('GB');
  const [base, setBase] = useState<Base>('binary');

  const units: Unit[] = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];

  const binaryMultipliers: Record<Unit, number> = {
    B: 1,
    KB: 1024,
    MB: 1024 ** 2,
    GB: 1024 ** 3,
    TB: 1024 ** 4,
    PB: 1024 ** 5,
  };

  const decimalMultipliers: Record<Unit, number> = {
    B: 1,
    KB: 1000,
    MB: 1000 ** 2,
    GB: 1000 ** 3,
    TB: 1000 ** 4,
    PB: 1000 ** 5,
  };

  const getMultipliers = () => (base === 'binary' ? binaryMultipliers : decimalMultipliers);

  const convertToBytes = (value: number, unit: Unit): number => {
    return value * getMultipliers()[unit];
  };

  const convertFromBytes = (bytes: number, unit: Unit): number => {
    return bytes / getMultipliers()[unit];
  };

  const formatNumber = (num: number): string => {
    if (num === 0) return '0';
    if (num < 0.0001) return num.toExponential(4);
    if (num >= 1000000) return num.toLocaleString('en-US', { maximumFractionDigits: 2 });
    return num.toLocaleString('en-US', { maximumFractionDigits: 6 });
  };

  const inputNum = parseFloat(inputValue) || 0;
  const bytes = convertToBytes(inputNum, inputUnit);

  const conversions = units.map((unit) => ({
    unit,
    value: convertFromBytes(bytes, unit),
    label: base === 'binary' ? getBinaryLabel(unit) : getDecimalLabel(unit),
  }));

  function getBinaryLabel(unit: Unit): string {
    const labels: Record<Unit, string> = {
      B: 'Bytes',
      KB: 'KiB (Kibibytes)',
      MB: 'MiB (Mebibytes)',
      GB: 'GiB (Gibibytes)',
      TB: 'TiB (Tebibytes)',
      PB: 'PiB (Pebibytes)',
    };
    return labels[unit];
  }

  function getDecimalLabel(unit: Unit): string {
    const labels: Record<Unit, string> = {
      B: 'Bytes',
      KB: 'KB (Kilobytes)',
      MB: 'MB (Megabytes)',
      GB: 'GB (Gigabytes)',
      TB: 'TB (Terabytes)',
      PB: 'PB (Petabytes)',
    };
    return labels[unit];
  }

  const bits = bytes * 8;
  const bitConversions = [
    { label: 'Bits', value: bits },
    { label: 'Kilobits', value: bits / (base === 'binary' ? 1024 : 1000) },
    { label: 'Megabits', value: bits / (base === 'binary' ? 1024 ** 2 : 1000 ** 2) },
    { label: 'Gigabits', value: bits / (base === 'binary' ? 1024 ** 3 : 1000 ** 3) },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="tool-label">
            {t('inputValue')}
          </label>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="tool-input"
            min="0"
            step="any"
          />
        </div>

        <div className="space-y-2">
          <label className="tool-label">
            {t('unit')}
          </label>
          <select
            value={inputUnit}
            onChange={(e) => setInputUnit(e.target.value as Unit)}
            className="tool-input"
          >
            {units.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="tool-label">
            {t('base')}
          </label>
          <select
            value={base}
            onChange={(e) => setBase(e.target.value as Base)}
            className="tool-input"
          >
            <option value="binary">{t('binary')} (1024)</option>
            <option value="decimal">{t('decimal')} (1000)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900 dark:text-gray-100">{t('byteConversions')}</h3>
          <div className="space-y-2">
            {conversions.map(({ unit, value, label }) => (
              <div
                key={unit}
                className={`p-3 rounded-lg ${
                  unit === inputUnit
                    ? 'bg-blue-100 dark:bg-blue-900/50 border border-blue-400 dark:border-blue-600'
                    : 'bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300">{label}</span>
                  <span className="font-mono text-gray-900 dark:text-gray-100">
                    {formatNumber(value)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium text-gray-900 dark:text-gray-100">{t('bitConversions')}</h3>
          <div className="space-y-2">
            {bitConversions.map(({ label, value }) => (
              <div key={label} className="p-3 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300">{label}</span>
                  <span className="font-mono text-gray-900 dark:text-gray-100">
                    {formatNumber(value)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg">
            <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">{t('totalBytes')}</h4>
            <p className="font-mono text-lg text-green-700 dark:text-green-400">
              {bytes.toLocaleString('en-US')} {t('bytes')}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg">
        <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">{t('info')}</h3>
        <div className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
          <p>• <strong>{t('binary')}:</strong> {t('binaryDesc')}</p>
          <p>• <strong>{t('decimal')}:</strong> {t('decimalDesc')}</p>
        </div>
      </div>
    </div>
  );
}
