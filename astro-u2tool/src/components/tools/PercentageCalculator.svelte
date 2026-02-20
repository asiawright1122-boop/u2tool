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

  let value1 = $state('100');

  let percent1 = $state('25');

  let part = $state('25');

  let whole = $state('100');

  let oldValue = $state('80');

  let newValue = $state('100');

  let baseValue = $state('100');

  let changePercent = $state('20');

  let isIncrease = $state(true);

  let copied = $state(null);

  let timerRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
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
  async function copyResult(value: string, id: string) {
    await navigator.clipboard.writeText(value);
    copied = id;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = null, 2000);
  }
  const result1 = calculatePercentageOf(parseFloat(value1) || 0, parseFloat(percent1) || 0);
  const result2 = calculateWhatPercent(parseFloat(part) || 0, parseFloat(whole) || 0);
  const result3 = calculatePercentageChange(parseFloat(oldValue) || 0, parseFloat(newValue) || 0);
  const result4 = calculateValueAfterChange(
    parseFloat(baseValue) || 0,
    parseFloat(changePercent) || 0,
    isIncrease
  );

</script>


    <div class="space-y-6">
      <!-- 计算 X 的 Y% -->
      <div class="p-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
        <h3 class="text-sm font-medium mb-3 text-gray-900 dark:text-white">{t('percent.whatIsPercent')}</h3>
        <div class="flex items-center gap-2 flex-wrap">
          <input
            type="number"
            bind:value={percent1}
            class="w-24 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-center text-gray-900 dark:text-white"
            placeholder="25"
          />
          <span class="text-gray-600 dark:text-gray-300">% {t('percent.of')}</span>
          <input
            type="number"
            bind:value={value1}
            class="w-32 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-center text-gray-900 dark:text-white"
            placeholder="100"
          />
          <span class="text-gray-600 dark:text-gray-300">=</span>
          <div class="flex items-center gap-2">
            <span class="font-mono text-lg text-green-600 dark:text-green-400">{result1.toFixed(2)}</span>
            <button
              onclick={() => copyResult(result1.toFixed(2), 'r1')}
              class={`px-2 py-1 text-xs rounded ${copied === 'r1' ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'}`}
            >
              {copied === 'r1' ? '✓' : t('copy')}
            </button>
          </div>
        </div>
      </div>

      <!-- X 是 Y 的百分之几 -->
      <div class="p-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
        <h3 class="text-sm font-medium mb-3 text-gray-900 dark:text-white">{t('percent.whatPercentIs')}</h3>
        <div class="flex items-center gap-2 flex-wrap">
          <input
            type="number"
            bind:value={part}
            class="w-32 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-center text-gray-900 dark:text-white"
            placeholder="25"
          />
          <span class="text-gray-600 dark:text-gray-300">{t('percent.isWhatPercentOf')}</span>
          <input
            type="number"
            bind:value={whole}
            class="w-32 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-center text-gray-900 dark:text-white"
            placeholder="100"
          />
          <span class="text-gray-600 dark:text-gray-300">=</span>
          <div class="flex items-center gap-2">
            <span class="font-mono text-lg text-green-600 dark:text-green-400">{result2.toFixed(2)}%</span>
            <button
              onclick={() => copyResult(result2.toFixed(2) + '%', 'r2')}
              class={`px-2 py-1 text-xs rounded ${copied === 'r2' ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'}`}
            >
              {copied === 'r2' ? '✓' : t('copy')}
            </button>
          </div>
        </div>
      </div>

      <!-- 百分比变化 -->
      <div class="p-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
        <h3 class="text-sm font-medium mb-3 text-gray-900 dark:text-white">{t('percent.percentChange')}</h3>
        <div class="flex items-center gap-2 flex-wrap">
          <span class="text-gray-600 dark:text-gray-300">{t('percent.from')}</span>
          <input
            type="number"
            bind:value={oldValue}
            class="w-32 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-center text-gray-900 dark:text-white"
            placeholder="80"
          />
          <span class="text-gray-600 dark:text-gray-300">{t('percent.to')}</span>
          <input
            type="number"
            bind:value={newValue}
            class="w-32 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-center text-gray-900 dark:text-white"
            placeholder="100"
          />
          <span class="text-gray-600 dark:text-gray-300">=</span>
          <div class="flex items-center gap-2">
            <span class={`font-mono text-lg ${result3 >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {result3 >= 0 ? '+' : ''}{result3.toFixed(2)}%
            </span>
            <button
              onclick={() => copyResult((result3 >= 0 ? '+' : '') + result3.toFixed(2) + '%', 'r3')}
              class={`px-2 py-1 text-xs rounded ${copied === 'r3' ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'}`}
            >
              {copied === 'r3' ? '✓' : t('copy')}
            </button>
          </div>
        </div>
      </div>

      <!-- 增减百分比 -->
      <div class="p-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
        <h3 class="text-sm font-medium mb-3 text-gray-900 dark:text-white">{t('percent.increaseDecrease')}</h3>
        <div class="flex items-center gap-2 flex-wrap">
          <input
            type="number"
            bind:value={baseValue}
            class="w-32 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-center text-gray-900 dark:text-white"
            placeholder="100"
          />
          <select
            value={isIncrease ? 'increase' : 'decrease'}
            onchange={(e) => isIncrease = e.target.value === 'increase'}
            class="px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
          >
            <option value="increase">{t('percent.increase')}</option>
            <option value="decrease">{t('percent.decrease')}</option>
          </select>
          <input
            type="number"
            bind:value={changePercent}
            class="w-24 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-center text-gray-900 dark:text-white"
            placeholder="20"
          />
          <span class="text-gray-600 dark:text-gray-300">%</span>
          <span class="text-gray-600 dark:text-gray-300">=</span>
          <div class="flex items-center gap-2">
            <span class="font-mono text-lg text-green-600 dark:text-green-400">{result4.toFixed(2)}</span>
            <button
              onclick={() => copyResult(result4.toFixed(2), 'r4')}
              class={`px-2 py-1 text-xs rounded ${copied === 'r4' ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'}`}
            >
              {copied === 'r4' ? '✓' : t('copy')}
            </button>
          </div>
        </div>
      </div>

      <!-- 常用百分比参考 -->
      <div class="p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg">
        <h3 class="text-sm font-medium mb-3 text-gray-900 dark:text-white">{t('percent.quickRef')}</h3>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          <div class="text-center p-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded">
            <div class="text-gray-600 dark:text-gray-300">10%</div>
            <div class="font-mono text-gray-900 dark:text-white">÷ 10</div>
          </div>
          <div class="text-center p-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded">
            <div class="text-gray-600 dark:text-gray-300">25%</div>
            <div class="font-mono text-gray-900 dark:text-white">÷ 4</div>
          </div>
          <div class="text-center p-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded">
            <div class="text-gray-600 dark:text-gray-300">50%</div>
            <div class="font-mono text-gray-900 dark:text-white">÷ 2</div>
          </div>
          <div class="text-center p-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded">
            <div class="text-gray-600 dark:text-gray-300">75%</div>
            <div class="font-mono text-gray-900 dark:text-white">× 0.75</div>
          </div>
        </div>
      </div>
    </div>
  
