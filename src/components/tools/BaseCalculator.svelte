<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['base-calculator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.base-calculator.${key}`;
  }

  // Types
  type Operation = 'add' | 'subtract' | 'multiply' | 'divide' | 'and' | 'or' | 'xor';

  let num1 = $state('1010');

  let num2 = $state('0110');

  let base = $state(2);

  let operation = $state('add');

  let result = $state(null);

  let error = $state('');

  // Functions
  function handleCalculate() {
    try {
      error = '';
      const n1 = parseNumber(num1, base);
      const n2 = parseNumber(num2, base);
      const res = calculate(n1, n2, operation);
      result = {
        decimal: res,
        formatted: formatNumber(res, base)
      };
    } catch {
      error = t('invalidNumber');
      result = null;
    }
  }
  const operationSymbols: Record<Operation, string> = {
    add: '+',
    subtract: '-',
    multiply: '×',
    divide: '÷',
    and: 'AND',
    or: 'OR',
    xor: 'XOR'
  };

</script>


    <div class="space-y-4">
      <div class="flex gap-4 items-center">
        <label class="text-sm text-gray-600 dark:text-gray-300">{t('base')}:</label>
        <select
          value={base}
          onchange={(e) => base = Number(e.target.value)}
          class="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-1 text-gray-900 dark:text-white"
        >
          <option value={2}>{t('binary')} (2)</option>
          <option value={8}>{t('octal')} (8)</option>
          <option value={10}>{t('decimal')} (10)</option>
          <option value={16}>{t('hex')} (16)</option>
        </select>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div>
          <label class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
            {t('number1')}
          </label>
          <input
            type="text"
            bind:value={num1}
            class="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white font-mono focus:outline-none focus:border-blue-500"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
            {t('operation')}
          </label>
          <select
            value={operation}
            onchange={(e) => operation = e.target.value as Operation}
            class="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white"
          >
            <option value="add">+ {t('add')}</option>
            <option value="subtract">- {t('subtract')}</option>
            <option value="multiply">× {t('multiply')}</option>
            <option value="divide">÷ {t('divide')}</option>
            <option value="and">AND</option>
            <option value="or">OR</option>
            <option value="xor">XOR</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
            {t('number2')}
          </label>
          <input
            type="text"
            bind:value={num2}
            class="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white font-mono focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <button
        onclick={handleCalculate}
        class="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        {t('calculate')}
      </button>

      {#if error}
<div class="p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-400">
          {error}
        </div>
{/if}

      {#if result}
<div class="p-4 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg">
          <div class="text-center text-lg font-mono text-gray-700 dark:text-gray-300 mb-4">
            {num1} {operationSymbols[operation]} {num2} = <span class="text-green-600 dark:text-green-400">{result.formatted}</span>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div class="text-center">
              <div class="text-gray-500 dark:text-gray-400">{t('binary')}</div>
              <div class="font-mono text-gray-900 dark:text-white">{formatNumber(result.decimal, 2)}</div>
            </div>
            <div class="text-center">
              <div class="text-gray-500 dark:text-gray-400">{t('octal')}</div>
              <div class="font-mono text-gray-900 dark:text-white">{formatNumber(result.decimal, 8)}</div>
            </div>
            <div class="text-center">
              <div class="text-gray-500 dark:text-gray-400">{t('decimal')}</div>
              <div class="font-mono text-gray-900 dark:text-white">{result.decimal}</div>
            </div>
            <div class="text-center">
              <div class="text-gray-500 dark:text-gray-400">{t('hex')}</div>
              <div class="font-mono text-gray-900 dark:text-white">{formatNumber(result.decimal, 16)}</div>
            </div>
          </div>
        </div>
{/if}
    </div>
  
