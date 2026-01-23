'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function FractionCalculator() {
  const t = useTranslations('tools.fraction-calculator');
  const [num1, setNum1] = useState('1');
  const [den1, setDen1] = useState('2');
  const [num2, setNum2] = useState('1');
  const [den2, setDen2] = useState('4');
  const [operation, setOperation] = useState<'+' | '-' | '×' | '÷'>('+');
  const [result, setResult] = useState<{ num: number; den: number } | null>(null);
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const gcd = (a: number, b: number): number => {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) { [a, b] = [b, a % b]; }
    return a;
  };

  const simplify = (num: number, den: number): { num: number; den: number } => {
    if (den === 0) return { num: 0, den: 1 };
    const g = gcd(num, den);
    const sign = den < 0 ? -1 : 1;
    return { num: (num / g) * sign, den: Math.abs(den / g) };
  };

  const calculate = () => {
    const n1 = parseInt(num1) || 0;
    const d1 = parseInt(den1) || 1;
    const n2 = parseInt(num2) || 0;
    const d2 = parseInt(den2) || 1;

    let resNum: number, resDen: number;
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
    setResult(simplify(resNum, resDen));
  };

  const copyResult = () => {
    if (result) {
      navigator.clipboard.writeText(`${result.num}/${result.den}`);
      setCopied(true);
      if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 2000);
    }
  };

  const FractionInput = ({ num, den, setNum, setDen, label }: { num: string; den: string; setNum: (v: string) => void; setDen: (v: string) => void; label: string }) => (
    <div className="flex flex-col items-center">
      <span className="text-sm text-gray-500 dark:text-gray-400 mb-2">{label}</span>
      <div className="flex flex-col items-center">
        <input
          type="number"
          value={num}
          onChange={(e) => setNum(e.target.value)}
          className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-center text-xl"
        />
        <div className="w-20 h-0.5 bg-gray-900 dark:bg-white my-1" />
        <input
          type="number"
          value={den}
          onChange={(e) => setDen(e.target.value)}
          className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-center text-xl"
        />
      </div>
    </div>
  );

  useEffect(() => {

    return () => {

      if (timerRef.current) clearTimeout(timerRef.current);

    };

  }, []);


  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-center gap-4">
        <FractionInput num={num1} den={den1} setNum={setNum1} setDen={setDen1} label={t('fraction1')} />
        
        <div className="flex gap-2">
          {(['+', '-', '×', '÷'] as const).map((op) => (
            <button
              key={op}
              onClick={() => setOperation(op)}
              className={`w-12 h-12 rounded-lg text-2xl font-bold transition-colors ${
                operation === op
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {op}
            </button>
          ))}
        </div>

        <FractionInput num={num2} den={den2} setNum={setNum2} setDen={setDen2} label={t('fraction2')} />
      </div>

      <div className="flex justify-center">
        <button
          onClick={calculate}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
        >
          = {t('calculate')}
        </button>
      </div>

      {result && (
        <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-center">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">{t('result')}</div>
            <div className="flex items-center justify-center gap-4">
              <div className="flex flex-col items-center">
                <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">{result.num}</span>
                <div className="w-16 h-1 bg-blue-600 dark:bg-blue-400 my-1" />
                <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">{result.den}</span>
              </div>
              {result.den !== 1 && (
                <>
                  <span className="text-2xl text-gray-400">=</span>
                  <span className="text-3xl font-mono text-gray-700 dark:text-gray-300">
                    {(result.num / result.den).toFixed(6).replace(/\.?0+$/, '')}
                  </span>
                </>
              )}
            </div>
            <button
              onClick={copyResult}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              {copied ? t('copied') : t('copy')}
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
          <div className="font-medium text-blue-600 dark:text-blue-400">+</div>
          <div className="text-gray-600 dark:text-gray-400">{t('addition')}</div>
        </div>
        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
          <div className="font-medium text-green-600 dark:text-green-400">-</div>
          <div className="text-gray-600 dark:text-gray-400">{t('subtraction')}</div>
        </div>
        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-center">
          <div className="font-medium text-yellow-600 dark:text-yellow-400">×</div>
          <div className="text-gray-600 dark:text-gray-400">{t('multiplication')}</div>
        </div>
        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
          <div className="font-medium text-red-600 dark:text-red-400">÷</div>
          <div className="text-gray-600 dark:text-gray-400">{t('division')}</div>
        </div>
      </div>
    </div>
  );
}
