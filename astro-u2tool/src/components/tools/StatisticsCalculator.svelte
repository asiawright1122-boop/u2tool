<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  let input = $state('10, 20, 30, 40, 50, 30, 30');

  let isPopulation = $state(true);

  let copied = $state(null);

  let timerRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
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
  async function copyResult(value: string, id: string) {
    await navigator.clipboard.writeText(value);
    copied = id;
    setTimeout(() => copied = null, 2000);
  }
  function formatNumber(n: number): string {
    return Number.isInteger(n) ? n.toString() : n.toFixed(6).replace(/\.?0+$/, '');
  }

</script>


    <div class="space-y-6">
      <!-- 输入区域 -->
      <div>
        <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          {t('stats.inputLabel')}
        </label>
        <textarea
          bind:value={input}
          class="w-full h-32 px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg font-mono text-sm text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="10, 20, 30, 40, 50"></textarea>
        <p class="text-xs text-gray-500 dark:text-gray-300 mt-1">
          {t('stats.inputHint')}
        </p>
      </div>

      <!-- 方差类型选择 -->
      <div class="flex items-center gap-4">
        <span class="text-sm text-gray-600 dark:text-gray-300">{t('stats.varianceType')}:</span>
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            checked={isPopulation}
            onchange={() => isPopulation = true}
            class="text-blue-500"
          />
          <span class="text-sm text-gray-900 dark:text-white">{t('stats.population')}</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            checked={!isPopulation}
            onchange={() => isPopulation = false}
            class="text-blue-500"
          />
          <span class="text-sm text-gray-900 dark:text-white">{t('stats.sample')}</span>
        </label>
      </div>

      <!-- 数据概览 -->
      <div class="p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg">
        <h3 class="text-sm font-medium mb-2 text-gray-900 dark:text-white">{t('stats.dataOverview')}</h3>
        <div class="text-sm text-gray-600 dark:text-gray-300">
          {t('stats.count')}: <span class="text-gray-900 dark:text-white font-mono">{numbers.length}</span>
        </div>
      </div>

      <!-- 统计结果 -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <!-- 平均值 -->
        <ResultCard
          label={t('stats.mean')}
          value={formatNumber(mean)}
          id="mean"
          copied={copied}
          oncopy={copyResult}
          copyLabel={t('copy')}
        />

        <!-- 中位数 -->
        <ResultCard
          label={t('stats.median')}
          value={formatNumber(median)}
          id="median"
          copied={copied}
          oncopy={copyResult}
          copyLabel={t('copy')}
        />

        <!-- 众数 -->
        <ResultCard
          label={t('stats.mode')}
          value={mode.length > 0 ? mode.map(formatNumber).join(', ') : t('stats.noMode')}
          id="mode"
          copied={copied}
          oncopy={copyResult}
          copyLabel={t('copy')}
        />

        <!-- 总和 -->
        <ResultCard
          label={t('stats.sum')}
          value={formatNumber(sum)}
          id="sum"
          copied={copied}
          oncopy={copyResult}
          copyLabel={t('copy')}
        />

        <!-- 最小值 -->
        <ResultCard
          label={t('stats.min')}
          value={formatNumber(min)}
          id="min"
          copied={copied}
          oncopy={copyResult}
          copyLabel={t('copy')}
        />

        <!-- 最大值 -->
        <ResultCard
          label={t('stats.max')}
          value={formatNumber(max)}
          id="max"
          copied={copied}
          oncopy={copyResult}
          copyLabel={t('copy')}
        />

        <!-- 范围 -->
        <ResultCard
          label={t('stats.range')}
          value={formatNumber(range)}
          id="range"
          copied={copied}
          oncopy={copyResult}
          copyLabel={t('copy')}
        />

        <!-- 方差 -->
        <ResultCard
          label={isPopulation ? t('stats.populationVariance') : t('stats.sampleVariance')}
          value={formatNumber(variance)}
          id="variance"
          copied={copied}
          oncopy={copyResult}
          copyLabel={t('copy')}
        />

        <!-- 标准差 -->
        <ResultCard
          label={isPopulation ? t('stats.populationStdDev') : t('stats.sampleStdDev')}
          value={formatNumber(stdDev)}
          id="stddev"
          copied={copied}
          oncopy={copyResult}
          copyLabel={t('copy')}
        />
      </div>
    </div>
  
