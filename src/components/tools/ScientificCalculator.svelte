<script lang="ts">
  import { onDestroy } from 'svelte';
  import { evaluateExpression, factorial } from '@/lib/scientific-calculator';

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

  let display = $state('0');

  let expression = $state('');

  let isRadians = $state(true);

  let memory = $state(0);

  let error = $state<string | null>(null);

  let copied = $state(false);

  let timerRef = $state<ReturnType<typeof setTimeout> | null>(null);

  function appendToExpression(value: string) {
    error = null;
    if (display === 'Error') {
      display = value;
      expression = value;
    } else if (display === '0' && !['.', '+', '-', '−', '*', '×', '/', '÷', '^', '%'].includes(value)) {
      display = value;
      expression = value;
    } else {
      display = display + value;
      expression = expression + value;
    }
  }

  function appendFunction(func: string) {
    error = null;
    display = display === '0' || display === 'Error' ? `${func}(` : display + `${func}(`;
    expression = expression + `${func}(`;
  }

  function calculate() {
    try {
      const result = evaluateExpression(expression, { angleMode: isRadians ? 'rad' : 'deg' });
      const formatted = Number.isInteger(result) ? result.toString() : result.toPrecision(10).replace(/\.?0+$/, '');
      display = formatted;
      expression = formatted;
    } catch {
      error = t('sci.error');
      display = 'Error';
    }
  }

  function clear() {
    display = '0';
    expression = '';
    error = null;
  }

  function backspace() {
    if (display.length === 1 || display === 'Error') {
      display = '0';
      expression = '';
    } else {
      display = display.slice(0, -1);
      expression = expression.slice(0, -1);
    }
    error = null;
  }

  function handleFactorial() {
    try {
      const num = parseFloat(display);
      const result = factorial(num);
      display = result.toString();
      expression = result.toString();
    } catch {
      error = t('sci.error');
      display = 'Error';
    }
  }  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  function memoryStore() { return memory = parseFloat(display) || 0; }
  function memoryRecall() { display = memory.toString(); expression = memory.toString(); }
  function memoryClear() { return memory = 0; }
  function memoryAdd() { return memory = memory + (parseFloat(display) || 0); }
  async function copyResult() {
    await navigator.clipboard.writeText(display);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }

  const neutralClass = 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700';
  const memoryClass = 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600';
  const functionClass = 'bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-900 dark:text-blue-100';
  const operatorClass = 'bg-amber-100 dark:bg-amber-900/30 hover:bg-amber-200 dark:hover:bg-amber-900/50 text-amber-900 dark:text-amber-100';
  const equalsClass = 'bg-amber-600 hover:bg-amber-700 text-white col-span-2';

  const calculatorButtons = [
    { label: 'MC', onClick: memoryClear, className: memoryClass },
    { label: 'MR', onClick: memoryRecall, className: memoryClass },
    { label: 'M+', onClick: memoryAdd, className: memoryClass },
    { label: 'MS', onClick: memoryStore, className: memoryClass },
    { label: 'C', onClick: clear, className: operatorClass },
    { label: 'sin', onClick: () => appendFunction('sin'), className: functionClass },
    { label: 'cos', onClick: () => appendFunction('cos'), className: functionClass },
    { label: 'tan', onClick: () => appendFunction('tan'), className: functionClass },
    { label: '(', onClick: () => appendToExpression('('), className: neutralClass },
    { label: ')', onClick: () => appendToExpression(')'), className: neutralClass },
    { label: 'ln', onClick: () => appendFunction('ln'), className: functionClass },
    { label: 'log', onClick: () => appendFunction('log'), className: functionClass },
    { label: '√', onClick: () => appendFunction('sqrt'), className: functionClass },
    { label: 'xʸ', onClick: () => appendToExpression('^'), className: functionClass },
    { label: '⌫', onClick: backspace, className: operatorClass },
    { label: 'π', onClick: () => appendToExpression('π'), className: functionClass },
    { label: 'e', onClick: () => appendToExpression('e'), className: functionClass },
    { label: 'n!', onClick: handleFactorial, className: functionClass },
    { label: '%', onClick: () => appendToExpression('%'), className: operatorClass },
    { label: '÷', onClick: () => appendToExpression('÷'), className: operatorClass },
    { label: '7', onClick: () => appendToExpression('7'), className: neutralClass },
    { label: '8', onClick: () => appendToExpression('8'), className: neutralClass },
    { label: '9', onClick: () => appendToExpression('9'), className: neutralClass },
    { label: '×', onClick: () => appendToExpression('×'), className: operatorClass },
    { label: '−', onClick: () => appendToExpression('−'), className: operatorClass },
    { label: '4', onClick: () => appendToExpression('4'), className: neutralClass },
    { label: '5', onClick: () => appendToExpression('5'), className: neutralClass },
    { label: '6', onClick: () => appendToExpression('6'), className: neutralClass },
    { label: '+', onClick: () => appendToExpression('+'), className: operatorClass },
    { label: '=', onClick: calculate, className: equalsClass },
    { label: '1', onClick: () => appendToExpression('1'), className: neutralClass },
    { label: '2', onClick: () => appendToExpression('2'), className: neutralClass },
    { label: '3', onClick: () => appendToExpression('3'), className: neutralClass },
    { label: '.', onClick: () => appendToExpression('.'), className: neutralClass },
    {
      label: '±',
      onClick: () => {
        const num = parseFloat(display);
        if (!Number.isNaN(num)) {
          const negated = (-num).toString();
          display = negated;
          expression = negated;
        }
      },
      className: neutralClass,
    },
    { label: '0', onClick: () => appendToExpression('0'), className: neutralClass },
    { label: '00', onClick: () => appendToExpression('00'), className: neutralClass },
  ];

</script>

{#snippet Button(value: string, onClick: () => void, className: string)}
<button
      onclick={onClick}
      class={`p-3 rounded-lg font-mono text-sm transition-colors text-gray-900 dark:text-white ${className}`}
    >
      {value}
    </button>
{/snippet}


    <div class="max-w-md mx-auto space-y-4">
      <!-- 显示屏 -->
      <div class="p-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div class="text-xs text-gray-500 dark:text-gray-300 h-5 overflow-hidden">{expression || '0'}</div>
        <div class="flex items-center justify-between">
          <div class={`text-2xl font-mono truncate ${error ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
            {display}
          </div>
          <button
            onclick={copyResult}
            class={`px-2 py-1 text-xs rounded ${copied ? 'btn-success' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'}`}
          >
            {copied ? '✓' : t('copy')}
          </button>
        </div>
      </div>

      <!-- 模式切换 -->
      <div class="flex items-center justify-between px-2">
        <div class="flex items-center gap-2">
          <span class="text-xs text-gray-600 dark:text-gray-300">{t('sci.angleMode')}:</span>
          <button
            onclick={() => isRadians = true}
            class={`px-2 py-1 text-xs rounded ${isRadians ? 'bg-amber-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'}`}
          >
            RAD
          </button>
          <button
            onclick={() => isRadians = false}
            class={`px-2 py-1 text-xs rounded ${!isRadians ? 'bg-amber-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'}`}
          >
            DEG
          </button>
        </div>
        <div class="text-xs text-gray-600 dark:text-gray-300">M: {memory}</div>
      </div>

      <!-- 按钮区域 -->
      <div class="grid grid-cols-5 gap-2">
        {#each calculatorButtons as button (button.label)}
          {@render Button(button.label, button.onClick, button.className)}
        {/each}
      </div>

      <!-- 快捷公式 -->
      <div class="p-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div class="text-xs text-gray-600 dark:text-gray-300 mb-2">{t('sci.quickFormulas')}</div>
        <div class="flex flex-wrap gap-2">
          {#each ['sin(π/6)', 'cos(π/4)', 'sqrt(2)', 'log(100)', 'e^2'] as formula (formula)}
<button 
              onclick={() => { display = formula; expression = formula; }}
              class="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 rounded font-mono"
            >
              {formula}
            </button>
{/each}
        </div>
      </div>
    </div>
  
