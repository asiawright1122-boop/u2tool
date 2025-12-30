'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

// 计算函数 - 导出供测试使用
export function parseNumbers(input: string): number[] {
  return input
    .split(/[\s,;\n]+/)
    .map(s => s.trim())
    .filter(s => s !== '')
    .map(s => parseFloat(s))
    .filter(n => !isNaN(n));
}

export function calculateMean(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
}

export function calculateMedian(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

export function calculateMode(numbers: number[]): number[] {
  if (numbers.length === 0) return [];
  const freq = new Map<number, number>();
  numbers.forEach(n => freq.set(n, (freq.get(n) || 0) + 1));
  const maxFreq = Math.max(...freq.values());
  if (maxFreq === 1) return []; // 无众数
  return [...freq.entries()]
    .filter(([, count]) => count === maxFreq)
    .map(([num]) => num)
    .sort((a, b) => a - b);
}

export function calculateVariance(numbers: number[], isPopulation: boolean = true): number {
  if (numbers.length === 0) return 0;
  const mean = calculateMean(numbers);
  const squaredDiffs = numbers.map(n => Math.pow(n - mean, 2));
  const divisor = isPopulation ? numbers.length : numbers.length - 1;
  if (divisor === 0) return 0;
  return squaredDiffs.reduce((sum, d) => sum + d, 0) / divisor;
}

export function calculateStdDev(numbers: number[], isPopulation: boolean = true): number {
  return Math.sqrt(calculateVariance(numbers, isPopulation));
}

export function calculateSum(numbers: number[]): number {
  return numbers.reduce((sum, n) => sum + n, 0);
}

export function calculateMin(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return Math.min(...numbers);
}

export function calculateMax(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return Math.max(...numbers);
}

export function calculateRange(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return calculateMax(numbers) - calculateMin(numbers);
}

export default function StatisticsCalculator() {
  const t = useTranslations('tools');
  const [input, setInput] = useState('10, 20, 30, 40, 50, 30, 30');
  const [isPopulation, setIsPopulation] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  const numbers = parseNumbers(input);
  const mean = calculateMean(numbers);
  const median = calculateMedian(numbers);
  const mode = calculateMode(numbers);
  const variance = calculateVariance(numbers, isPopulation);
  const stdDev = calculateStdDev(numbers, isPopulation);
  const sum = calculateSum(numbers);
  const min = calculateMin(numbers);
  const max = calculateMax(numbers);
  const range = calculateRange(numbers);

  const copyResult = async (value: string, id: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const formatNumber = (n: number): string => {
    return Number.isInteger(n) ? n.toString() : n.toFixed(6).replace(/\.?0+$/, '');
  };

  return (
    <div className="space-y-6">
      {/* 输入区域 */}
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          {t('stats.inputLabel')}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-32 px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg font-mono text-sm text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="10, 20, 30, 40, 50"
        />
        <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">
          {t('stats.inputHint')}
        </p>
      </div>

      {/* 方差类型选择 */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600 dark:text-gray-300">{t('stats.varianceType')}:</span>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            checked={isPopulation}
            onChange={() => setIsPopulation(true)}
            className="text-blue-500"
          />
          <span className="text-sm text-gray-900 dark:text-white">{t('stats.population')}</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            checked={!isPopulation}
            onChange={() => setIsPopulation(false)}
            className="text-blue-500"
          />
          <span className="text-sm text-gray-900 dark:text-white">{t('stats.sample')}</span>
        </label>
      </div>

      {/* 数据概览 */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg">
        <h3 className="text-sm font-medium mb-2 text-gray-900 dark:text-white">{t('stats.dataOverview')}</h3>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          {t('stats.count')}: <span className="text-gray-900 dark:text-white font-mono">{numbers.length}</span>
        </div>
      </div>

      {/* 统计结果 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* 平均值 */}
        <ResultCard
          label={t('stats.mean')}
          value={formatNumber(mean)}
          id="mean"
          copied={copied}
          onCopy={copyResult}
          copyLabel={t('copy')}
        />

        {/* 中位数 */}
        <ResultCard
          label={t('stats.median')}
          value={formatNumber(median)}
          id="median"
          copied={copied}
          onCopy={copyResult}
          copyLabel={t('copy')}
        />

        {/* 众数 */}
        <ResultCard
          label={t('stats.mode')}
          value={mode.length > 0 ? mode.map(formatNumber).join(', ') : t('stats.noMode')}
          id="mode"
          copied={copied}
          onCopy={copyResult}
          copyLabel={t('copy')}
        />

        {/* 总和 */}
        <ResultCard
          label={t('stats.sum')}
          value={formatNumber(sum)}
          id="sum"
          copied={copied}
          onCopy={copyResult}
          copyLabel={t('copy')}
        />

        {/* 最小值 */}
        <ResultCard
          label={t('stats.min')}
          value={formatNumber(min)}
          id="min"
          copied={copied}
          onCopy={copyResult}
          copyLabel={t('copy')}
        />

        {/* 最大值 */}
        <ResultCard
          label={t('stats.max')}
          value={formatNumber(max)}
          id="max"
          copied={copied}
          onCopy={copyResult}
          copyLabel={t('copy')}
        />

        {/* 范围 */}
        <ResultCard
          label={t('stats.range')}
          value={formatNumber(range)}
          id="range"
          copied={copied}
          onCopy={copyResult}
          copyLabel={t('copy')}
        />

        {/* 方差 */}
        <ResultCard
          label={isPopulation ? t('stats.populationVariance') : t('stats.sampleVariance')}
          value={formatNumber(variance)}
          id="variance"
          copied={copied}
          onCopy={copyResult}
          copyLabel={t('copy')}
        />

        {/* 标准差 */}
        <ResultCard
          label={isPopulation ? t('stats.populationStdDev') : t('stats.sampleStdDev')}
          value={formatNumber(stdDev)}
          id="stddev"
          copied={copied}
          onCopy={copyResult}
          copyLabel={t('copy')}
        />
      </div>
    </div>
  );
}

function ResultCard({
  label,
  value,
  id,
  copied,
  onCopy,
  copyLabel,
}: {
  label: string;
  value: string;
  id: string;
  copied: string | null;
  onCopy: (value: string, id: string) => void;
  copyLabel: string;
}) {
  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
      <div className="text-xs text-gray-500 dark:text-gray-300 mb-1">{label}</div>
      <div className="flex items-center justify-between">
        <span className="font-mono text-lg text-green-600 dark:text-green-400">{value}</span>
        <button
          onClick={() => onCopy(value, id)}
          className={`px-2 py-1 text-xs rounded ${
            copied === id ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          {copied === id ? '✓' : copyLabel}
        </button>
      </div>
    </div>
  );
}
