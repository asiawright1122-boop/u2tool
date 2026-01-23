'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

// 计算函数
export function calculatePercentageOf(value: number, percentage: number): number {
  return (value * percentage) / 100;
}

export function calculateWhatPercent(part: number, whole: number): number {
  if (whole === 0) return 0;
  return (part / whole) * 100;
}

export function calculatePercentageChange(oldValue: number, newValue: number): number {
  if (oldValue === 0) return 0;
  return ((newValue - oldValue) / oldValue) * 100;
}

export function calculateValueAfterChange(value: number, percentage: number, isIncrease: boolean): number {
  const change = (value * percentage) / 100;
  return isIncrease ? value + change : value - change;
}

export default function PercentageCalculator() {
  const t = useTranslations('tools');

  // 计算 X 的 Y%
  const [value1, setValue1] = useState<string>('100');
  const [percent1, setPercent1] = useState<string>('25');

  // X 是 Y 的百分之几
  const [part, setPart] = useState<string>('25');
  const [whole, setWhole] = useState<string>('100');

  // 百分比变化
  const [oldValue, setOldValue] = useState<string>('80');
  const [newValue, setNewValue] = useState<string>('100');

  // 增减百分比
  const [baseValue, setBaseValue] = useState<string>('100');
  const [changePercent, setChangePercent] = useState<string>('20');
  const [isIncrease, setIsIncrease] = useState(true);

  const [copied, setCopied] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const copyResult = async (value: string, id: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(id);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(null), 2000);
  };

  const result1 = calculatePercentageOf(parseFloat(value1) || 0, parseFloat(percent1) || 0);
  const result2 = calculateWhatPercent(parseFloat(part) || 0, parseFloat(whole) || 0);
  const result3 = calculatePercentageChange(parseFloat(oldValue) || 0, parseFloat(newValue) || 0);
  const result4 = calculateValueAfterChange(
    parseFloat(baseValue) || 0,
    parseFloat(changePercent) || 0,
    isIncrease
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* 计算 X 的 Y% */}
      <div className="p-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
        <h3 className="text-sm font-medium mb-3 text-gray-900 dark:text-white">{t('percent.whatIsPercent')}</h3>
        <div className="flex items-center gap-2 flex-wrap">
          <input
            type="number"
            value={percent1}
            onChange={(e) => setPercent1(e.target.value)}
            className="w-24 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-center text-gray-900 dark:text-white"
            placeholder="25"
          />
          <span className="text-gray-600 dark:text-gray-300">% {t('percent.of')}</span>
          <input
            type="number"
            value={value1}
            onChange={(e) => setValue1(e.target.value)}
            className="w-32 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-center text-gray-900 dark:text-white"
            placeholder="100"
          />
          <span className="text-gray-600 dark:text-gray-300">=</span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-lg text-green-600 dark:text-green-400">{result1.toFixed(2)}</span>
            <button
              onClick={() => copyResult(result1.toFixed(2), 'r1')}
              className={`px-2 py-1 text-xs rounded ${copied === 'r1' ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'}`}
            >
              {copied === 'r1' ? '✓' : t('copy')}
            </button>
          </div>
        </div>
      </div>

      {/* X 是 Y 的百分之几 */}
      <div className="p-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
        <h3 className="text-sm font-medium mb-3 text-gray-900 dark:text-white">{t('percent.whatPercentIs')}</h3>
        <div className="flex items-center gap-2 flex-wrap">
          <input
            type="number"
            value={part}
            onChange={(e) => setPart(e.target.value)}
            className="w-32 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-center text-gray-900 dark:text-white"
            placeholder="25"
          />
          <span className="text-gray-600 dark:text-gray-300">{t('percent.isWhatPercentOf')}</span>
          <input
            type="number"
            value={whole}
            onChange={(e) => setWhole(e.target.value)}
            className="w-32 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-center text-gray-900 dark:text-white"
            placeholder="100"
          />
          <span className="text-gray-600 dark:text-gray-300">=</span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-lg text-green-600 dark:text-green-400">{result2.toFixed(2)}%</span>
            <button
              onClick={() => copyResult(result2.toFixed(2) + '%', 'r2')}
              className={`px-2 py-1 text-xs rounded ${copied === 'r2' ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'}`}
            >
              {copied === 'r2' ? '✓' : t('copy')}
            </button>
          </div>
        </div>
      </div>

      {/* 百分比变化 */}
      <div className="p-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
        <h3 className="text-sm font-medium mb-3 text-gray-900 dark:text-white">{t('percent.percentChange')}</h3>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-gray-600 dark:text-gray-300">{t('percent.from')}</span>
          <input
            type="number"
            value={oldValue}
            onChange={(e) => setOldValue(e.target.value)}
            className="w-32 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-center text-gray-900 dark:text-white"
            placeholder="80"
          />
          <span className="text-gray-600 dark:text-gray-300">{t('percent.to')}</span>
          <input
            type="number"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            className="w-32 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-center text-gray-900 dark:text-white"
            placeholder="100"
          />
          <span className="text-gray-600 dark:text-gray-300">=</span>
          <div className="flex items-center gap-2">
            <span className={`font-mono text-lg ${result3 >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {result3 >= 0 ? '+' : ''}{result3.toFixed(2)}%
            </span>
            <button
              onClick={() => copyResult((result3 >= 0 ? '+' : '') + result3.toFixed(2) + '%', 'r3')}
              className={`px-2 py-1 text-xs rounded ${copied === 'r3' ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'}`}
            >
              {copied === 'r3' ? '✓' : t('copy')}
            </button>
          </div>
        </div>
      </div>

      {/* 增减百分比 */}
      <div className="p-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
        <h3 className="text-sm font-medium mb-3 text-gray-900 dark:text-white">{t('percent.increaseDecrease')}</h3>
        <div className="flex items-center gap-2 flex-wrap">
          <input
            type="number"
            value={baseValue}
            onChange={(e) => setBaseValue(e.target.value)}
            className="w-32 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-center text-gray-900 dark:text-white"
            placeholder="100"
          />
          <select
            value={isIncrease ? 'increase' : 'decrease'}
            onChange={(e) => setIsIncrease(e.target.value === 'increase')}
            className="px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
          >
            <option value="increase">{t('percent.increase')}</option>
            <option value="decrease">{t('percent.decrease')}</option>
          </select>
          <input
            type="number"
            value={changePercent}
            onChange={(e) => setChangePercent(e.target.value)}
            className="w-24 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-center text-gray-900 dark:text-white"
            placeholder="20"
          />
          <span className="text-gray-600 dark:text-gray-300">%</span>
          <span className="text-gray-600 dark:text-gray-300">=</span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-lg text-green-600 dark:text-green-400">{result4.toFixed(2)}</span>
            <button
              onClick={() => copyResult(result4.toFixed(2), 'r4')}
              className={`px-2 py-1 text-xs rounded ${copied === 'r4' ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'}`}
            >
              {copied === 'r4' ? '✓' : t('copy')}
            </button>
          </div>
        </div>
      </div>

      {/* 常用百分比参考 */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg">
        <h3 className="text-sm font-medium mb-3 text-gray-900 dark:text-white">{t('percent.quickRef')}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          <div className="text-center p-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded">
            <div className="text-gray-600 dark:text-gray-300">10%</div>
            <div className="font-mono text-gray-900 dark:text-white">÷ 10</div>
          </div>
          <div className="text-center p-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded">
            <div className="text-gray-600 dark:text-gray-300">25%</div>
            <div className="font-mono text-gray-900 dark:text-white">÷ 4</div>
          </div>
          <div className="text-center p-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded">
            <div className="text-gray-600 dark:text-gray-300">50%</div>
            <div className="font-mono text-gray-900 dark:text-white">÷ 2</div>
          </div>
          <div className="text-center p-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded">
            <div className="text-gray-600 dark:text-gray-300">75%</div>
            <div className="font-mono text-gray-900 dark:text-white">× 0.75</div>
          </div>
        </div>
      </div>
    </div>
  );
}
