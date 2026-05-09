<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['fraction-calculator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.fraction-calculator.${key}`;
  }

  let num1 = $state('1');

  let den1 = $state('2');

  let num2 = $state('1');

  let den2 = $state('4');

  let operation = $state('+');

  let result = $state<{ num: number; den: number } | null>(null);

  let copied = $state(false);

  let timerRef = $state<ReturnType<typeof setTimeout> | null>(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function setNum1(value: string) {
    num1 = value;
  }
  function setDen1(value: string) {
    den1 = value;
  }
  function setNum2(value: string) {
    num2 = value;
  }
  function setDen2(value: string) {
    den2 = value;
  }
  function gcd(a: number, b: number): number {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) { [a, b] = [b, a % b]; }
    return a;
  }
  function simplify(num: number, den: number) {
    if (den === 0) return { num: 0, den: 1 };
    const g = gcd(num, den);
    const sign = den < 0 ? -1 : 1;
    return { num: (num / g) * sign, den: Math.abs(den / g) };
  }
  function calculate() {
    const n1 = parseInt(num1) || 0;
    const d1 = parseInt(den1) || 1;
    const n2 = parseInt(num2) || 0;
    const d2 = parseInt(den2) || 1;

    let resNum = 0;
    let resDen = 1;
    switch (operation) {
      case '+':
        resNum = n1 * d2 + n2 * d1;
        resDen = d1 * d2;
        break;
      case '-':
        resNum = n1 * d2 - n2 * d1;
        resDen = d1 * d2;
        break;
      case '×':
        resNum = n1 * n2;
        resDen = d1 * d2;
        break;
      case '÷':
        resNum = n1 * d2;
        resDen = d1 * n2;
        break;
    }
    result = simplify(resNum, resDen);
  }
  function copyResult() {
    if (result) {
      navigator.clipboard.writeText(`${result.num}/${result.den}`);
      copied = true;
      if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
    }
  }

</script>

{#snippet FractionInput(num: string, den: string, setNum: (v: string) => void, setDen: (v: string) => void, label: string)}
<div class="flex flex-col items-center">
      <span class="text-sm text-gray-500 dark:text-gray-400 mb-2">{label}</span>
      <div class="flex flex-col items-center">
        <input
          type="number"
          value={num} oninput={(e) => setNum(e.currentTarget.value)}
          class="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-center text-xl"
        />
        <div class="w-20 h-0.5 bg-gray-900 dark:bg-white my-1"></div>
        <input
          type="number"
          value={den} oninput={(e) => setDen(e.currentTarget.value)}
          class="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-center text-xl"
        />
      </div>
    </div>
{/snippet}


    <div class="space-y-6">
      <div class="flex flex-wrap items-center justify-center gap-4">
        {@render FractionInput(num1, den1, setNum1, setDen1, t('fraction1'))}
        
        <div class="flex gap-2">
          {#each (['+', '-', '×', '÷'] as const) as op (op)}
<button 
              onclick={() => operation = op}
              class={`w-12 h-12 rounded-lg text-2xl font-bold transition-colors ${
                operation === op
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {op}
            </button>
{/each}
        </div>

        {@render FractionInput(num2, den2, setNum2, setDen2, t('fraction2'))}
      </div>

      <div class="flex justify-center">
        <button
          onclick={calculate}
          class="px-8 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium text-lg"
        >
          = {t('calculate')}
        </button>
      </div>

      {#if result}
<div class="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div class="text-center">
            <div class="text-sm text-gray-500 dark:text-gray-400 mb-2">{t('result')}</div>
            <div class="flex items-center justify-center gap-4">
              <div class="flex flex-col items-center">
                <span class="text-4xl font-bold text-amber-600 dark:text-amber-400">{result.num}</span>
                <div class="w-16 h-1 bg-amber-600 dark:bg-amber-400 my-1"></div>
                <span class="text-4xl font-bold text-amber-600 dark:text-amber-400">{result.den}</span>
              </div>
              {#if result.den !== 1}
<div>

                  <span class="text-2xl text-gray-400">=</span>
                  <span class="text-3xl font-mono text-gray-700 dark:text-gray-300">
                    {(result.num / result.den).toFixed(6).replace(/\.?0+$/, '')}
                  </span>
                
</div>
{/if}
            </div>
            <button
              onclick={copyResult}
              class="mt-4 px-4 py-2 btn-success rounded-lg hover:bg-green-700 transition-colors"
            >
              {copied ? t('copied') : t('copy')}
            </button>
          </div>
        </div>
{/if}

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div class="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-center">
          <div class="font-medium text-amber-600 dark:text-amber-400">+</div>
          <div class="text-gray-600 dark:text-gray-400">{t('addition')}</div>
        </div>
        <div class="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
          <div class="font-medium text-green-600 dark:text-green-400">-</div>
          <div class="text-gray-600 dark:text-gray-400">{t('subtraction')}</div>
        </div>
        <div class="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-center">
          <div class="font-medium text-yellow-600 dark:text-yellow-400">×</div>
          <div class="text-gray-600 dark:text-gray-400">{t('multiplication')}</div>
        </div>
        <div class="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
          <div class="font-medium text-red-600 dark:text-red-400">÷</div>
          <div class="text-gray-600 dark:text-gray-400">{t('division')}</div>
        </div>
      </div>
    </div>
  
