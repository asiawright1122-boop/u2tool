'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { performHexOperation, validateHex, HexResult } from '@/lib/calculator-utils';

type Operation = 'add' | 'subtract' | 'multiply' | 'divide' | 'and' | 'or' | 'xor' | 'not';

export default function HexCalculator() {
  const t = useTranslations('tools.hex-calculator');
  const tc = useTranslations('tools');

  const [operand1, setOperand1] = useState<string>('FF');
  const [operand2, setOperand2] = useState<string>('0A');
  const [operation, setOperation] = useState<Operation>('add');
  const [result, setResult] = useState<HexResult | null>(null);
  const [error, setError] = useState<string>('');

  const operations: { value: Operation; label: string; needsSecondOperand: boolean }[] = [
    { value: 'add', label: '+', needsSecondOperand: true },
    { value: 'subtract', label: '-', needsSecondOperand: true },
    { value: 'multiply', label: '×', needsSecondOperand: true },
    { value: 'divide', label: '÷', needsSecondOperand: true },
    { value: 'and', label: 'AND', needsSecondOperand: true },
    { value: 'or', label: 'OR', needsSecondOperand: true },
    { value: 'xor', label: 'XOR', needsSecondOperand: true },
    { value: 'not', label: 'NOT', needsSecondOperand: false },
  ];

  const needsSecondOperand = operations.find(op => op.value === operation)?.needsSecondOperand ?? true;

  const calculate = () => {
    setError('');

    if (!validateHex(operand1)) {
      setError(t('invalidHex'));
      return;
    }

    if (needsSecondOperand && !validateHex(operand2)) {
      setError(t('invalidHex'));
      return;
    }

    try {
      const res = performHexOperation(
        operand1,
        needsSecondOperand ? operand2 : undefined,
        operation
      );
      setResult(res);
    } catch {
      setError(t('calculationError'));
    }
  };

  const formatInput = (value: string) => {
    return value.toUpperCase().replace(/[^0-9A-F]/gi, '');
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t('operand1')}
        </label>
        <div className="flex items-center">
          <span className="px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-r-0 border-gray-300 dark:border-gray-600 rounded-l-lg text-gray-500">
            0x
          </span>
          <input
            type="text"
            value={operand1}
            onChange={(e) => setOperand1(formatInput(e.target.value))}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-r-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono uppercase"
          placeholder="FF"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('operation')}
        </label>
        <div className="flex flex-wrap gap-2">
          {operations.map((op) => (
            <button
              key={op.value}
              onClick={() => setOperation(op.value)}
              className={`px-3 py-2 rounded-lg font-mono transition-colors ${
                operation === op.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {op.label}
            </button>
          ))}
        </div>
      </div>

      {needsSecondOperand && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('operand2')}
          </label>
          <div className="flex items-center">
            <span className="px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-r-0 border-gray-300 dark:border-gray-600 rounded-l-lg text-gray-500">
              0x
            </span>
            <input
              type="text"
              value={operand2}
              onChange={(e) => setOperand2(formatInput(e.target.value))}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-r-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono uppercase"
              placeholder="0A"
            />
          </div>
        </div>
      )}

      <button
        onClick={calculate}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        {tc('calculate')}
      </button>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
          {error}
        </div>
      )}

      {result && !error && (
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{t('hexadecimal')}</div>
                <div className="text-xl font-mono font-bold text-green-600 dark:text-green-400">
                  0x{result.hexadecimal}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{t('decimal')}</div>
                <div className="text-xl font-mono font-bold text-blue-600 dark:text-blue-400">
                  {result.decimal}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{t('binary')}</div>
                <div className="text-xl font-mono font-bold text-gray-900 dark:text-white break-all">
                  {result.binary}
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg font-mono text-sm">
            <div className="text-gray-600 dark:text-gray-400">{t('calculation')}:</div>
            <div className="mt-2">
              0x{operand1} {operations.find(op => op.value === operation)?.label} {needsSecondOperand ? `0x${operand2}` : ''} = 0x{result.hexadecimal}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
