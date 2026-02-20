<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['binary-calculator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.binary-calculator.${key}`;
  }
  function tc(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Imports
  import { performBinaryOperation, validateBinary, BinaryResult } from '@/lib/calculator-utils';

  // Types
  type Operation = 'add' | 'subtract' | 'multiply' | 'divide' | 'and' | 'or' | 'xor' | 'not' | 'leftShift' | 'rightShift';

  let operand1 = $state('1010');

  let operand2 = $state('0101');

  let operation = $state('add');

  let shiftAmount = $state('1');

  let result = $state(null);

  let error = $state('');

  // Functions
  const operations: { value: Operation; label: string; needsSecondOperand: boolean }[] = [
    { value: 'add', label: '+', needsSecondOperand: true },
    { value: 'subtract', label: '-', needsSecondOperand: true },
    { value: 'multiply', label: '×', needsSecondOperand: true },
    { value: 'divide', label: '÷', needsSecondOperand: true },
    { value: 'and', label: 'AND', needsSecondOperand: true },
    { value: 'or', label: 'OR', needsSecondOperand: true },
    { value: 'xor', label: 'XOR', needsSecondOperand: true },
    { value: 'not', label: 'NOT', needsSecondOperand: false },
    { value: 'leftShift', label: '<<', needsSecondOperand: false },
    { value: 'rightShift', label: '>>', needsSecondOperand: false },
  ];
  const needsSecondOperand = operations.find(op => op.value === operation)?.needsSecondOperand ?? true;
  const isShiftOperation = operation === 'leftShift' || operation === 'rightShift';
  function calculate() {
    error = '';

    if (!validateBinary(operand1)) {
      error = t('invalidBinary');
      return;
    }

    if (needsSecondOperand && !validateBinary(operand2)) {
      error = t('invalidBinary');
      return;
    }

    try {
      const res = performBinaryOperation(
        operand1,
        needsSecondOperand ? operand2 : undefined,
        operation,
        isShiftOperation ? parseInt(shiftAmount) : undefined
      );
      result = res;
    } catch {
      error = t('calculationError');
    }
  }

</script>


    <div class="space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t('operand1')}
        </label>
        <input
          type="text"
          value={operand1}
          onchange={(e) => operand1 = e.target.value.replace(/[^01]/g, '')}
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono"
          placeholder="1010"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('operation')}
        </label>
        <div class="flex flex-wrap gap-2">
          {#each operations as op (op.value)}
<button 
              onclick={() => operation = op.value}
              class={`px-3 py-2 rounded-lg font-mono transition-colors ${
                operation === op.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {op.label}
            </button>
{/each}
        </div>
      </div>

      {#if needsSecondOperand}
<div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('operand2')}
          </label>
          <input
            type="text"
            value={operand2}
            onchange={(e) => operand2 = e.target.value.replace(/[^01]/g, '')}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono"
            placeholder="0101"
          />
        </div>
{/if}

      {#if isShiftOperation}
<div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('shiftAmount')}
          </label>
          <input
            type="number"
            bind:value={shiftAmount}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            min="1"
            max="32"
          />
        </div>
{/if}

      <button
        onclick={calculate}
        class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        {tc('calculate')}
      </button>

      {#if error}
<div class="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
          {error}
        </div>
{/if}

      {#if result}
!error && (
        <div class="space-y-4">
          <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div class="grid grid-cols-3 gap-4">
              <div>
                <div class="text-sm text-gray-600 dark:text-gray-400">{t('binary')}</div>
                <div class="text-xl font-mono font-bold text-gray-900 dark:text-white break-all">
                  {result.binary}
                </div>
              </div>
              <div>
                <div class="text-sm text-gray-600 dark:text-gray-400">{t('decimal')}</div>
                <div class="text-xl font-mono font-bold text-blue-600 dark:text-blue-400">
                  {result.decimal}
                </div>
              </div>
              <div>
                <div class="text-sm text-gray-600 dark:text-gray-400">{t('hexadecimal')}</div>
                <div class="text-xl font-mono font-bold text-green-600 dark:text-green-400">
                  0x{result.hexadecimal}
                </div>
              </div>
            </div>
          </div>

          <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg font-mono text-sm">
            <div class="text-gray-600 dark:text-gray-400">{t('calculation')}:</div>
            <div class="mt-2">
              {operand1} {operations.find(op => op.value === operation)?.label} {needsSecondOperand ? operand2 : isShiftOperation ? shiftAmount : ''} = {result.binary}
            </div>
          </div>
        </div>
      )
{/if}
    </div>
  
