'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

type Operation = 'add' | 'subtract' | 'multiply' | 'divide' | 'and' | 'or' | 'xor';

function parseNumber(value: string, base: number): number {
  const parsed = parseInt(value, base);
  if (isNaN(parsed)) throw new Error('Invalid number');
  return parsed;
}

function formatNumber(value: number, base: number): string {
  return value.toString(base).toUpperCase();
}

function calculate(num1: number, num2: number, operation: Operation): number {
  switch (operation) {
    case 'add': return num1 + num2;
    case 'subtract': return num1 - num2;
    case 'multiply': return num1 * num2;
    case 'divide': return Math.floor(num1 / num2);
    case 'and': return num1 & num2;
    case 'or': return num1 | num2;
    case 'xor': return num1 ^ num2;
  }
}

export default function BaseCalculator() {
  const t = useTranslations('tools.base-calculator');
  const [num1, setNum1] = useState('1010');
  const [num2, setNum2] = useState('0110');
  const [base, setBase] = useState(2);
  const [operation, setOperation] = useState<Operation>('add');
  const [result, setResult] = useState<{ decimal: number; formatted: string } | null>(null);
  const [error, setError] = useState('');

  const handleCalculate = () => {
    try {
      setError('');
      const n1 = parseNumber(num1, base);
      const n2 = parseNumber(num2, base);
      const res = calculate(n1, n2, operation);
      setResult({
        decimal: res,
        formatted: formatNumber(res, base)
      });
    } catch {
      setError(t('invalidNumber'));
      setResult(null);
    }
  };

  const operationSymbols: Record<Operation, string> = {
    add: '+',
    subtract: '-',
    multiply: '×',
    divide: '÷',
    and: 'AND',
    or: 'OR',
    xor: 'XOR'
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center">
        <label className="text-sm text-gray-300">{t('base')}:</label>
        <select
          value={base}
          onChange={(e) => setBase(Number(e.target.value))}
          className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-white"
        >
          <option value={2}>{t('binary')} (2)</option>
          <option value={8}>{t('octal')} (8)</option>
          <option value={10}>{t('decimal')} (10)</option>
          <option value={16}>{t('hex')} (16)</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t('number1')}
          </label>
          <input
            type="text"
            value={num1}
            onChange={(e) => setNum1(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t('operation')}
          </label>
          <select
            value={operation}
            onChange={(e) => setOperation(e.target.value as Operation)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
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
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t('number2')}
          </label>
          <input
            type="text"
            value={num2}
            onChange={(e) => setNum2(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <button
        onClick={handleCalculate}
        className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        {t('calculate')}
      </button>

      {error && (
        <div className="p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {result && (
        <div className="p-4 bg-gray-700 rounded-lg">
          <div className="text-center text-lg font-mono text-gray-300 mb-4">
            {num1} {operationSymbols[operation]} {num2} = <span className="text-green-400">{result.formatted}</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-gray-400">{t('binary')}</div>
              <div className="font-mono text-white">{formatNumber(result.decimal, 2)}</div>
            </div>
            <div className="text-center">
              <div className="text-gray-400">{t('octal')}</div>
              <div className="font-mono text-white">{formatNumber(result.decimal, 8)}</div>
            </div>
            <div className="text-center">
              <div className="text-gray-400">{t('decimal')}</div>
              <div className="font-mono text-white">{result.decimal}</div>
            </div>
            <div className="text-center">
              <div className="text-gray-400">{t('hex')}</div>
              <div className="font-mono text-white">{formatNumber(result.decimal, 16)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
