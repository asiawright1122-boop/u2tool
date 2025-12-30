'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';

// 计算函数 - 导出供测试使用
export function evaluateExpression(expr: string): number {
  // 预处理：替换科学函数
  const processed = expr
    .replace(/π/g, String(Math.PI))
    .replace(/e(?![0-9])/g, String(Math.E))
    .replace(/sin\(/g, 'Math.sin(')
    .replace(/cos\(/g, 'Math.cos(')
    .replace(/tan\(/g, 'Math.tan(')
    .replace(/asin\(/g, 'Math.asin(')
    .replace(/acos\(/g, 'Math.acos(')
    .replace(/atan\(/g, 'Math.atan(')
    .replace(/log\(/g, 'Math.log10(')
    .replace(/ln\(/g, 'Math.log(')
    .replace(/sqrt\(/g, 'Math.sqrt(')
    .replace(/abs\(/g, 'Math.abs(')
    .replace(/exp\(/g, 'Math.exp(')
    .replace(/pow\(/g, 'Math.pow(')
    .replace(/\^/g, '**')
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/mod/g, '%');

  // 安全检查：只允许数字、运算符和 Math 函数
  const safePattern = /^[0-9+\-*/().%\s,Math.sincotaglqrtbexpow]+$/;
  if (!safePattern.test(processed)) {
    throw new Error('Invalid expression');
  }

  // 使用 Function 构造器计算（比 eval 更安全）
  const result = new Function(`return ${processed}`)();
  if (typeof result !== 'number' || !isFinite(result)) {
    throw new Error('Invalid result');
  }
  return result;
}

export function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) throw new Error('Invalid input');
  if (n > 170) throw new Error('Number too large');
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

export function degreesToRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function radiansToDegrees(rad: number): number {
  return (rad * 180) / Math.PI;
}


export default function ScientificCalculator() {
  const t = useTranslations('tools');
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [isRadians, setIsRadians] = useState(true);
  const [memory, setMemory] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const appendToExpression = useCallback((value: string) => {
    setError(null);
    if (display === '0' && !['.','+','-','*','/'].includes(value)) {
      setDisplay(value);
      setExpression(value);
    } else {
      setDisplay(prev => prev + value);
      setExpression(prev => prev + value);
    }
  }, [display]);

  const appendFunction = useCallback((func: string) => {
    setError(null);
    setDisplay(prev => prev === '0' ? `${func}(` : prev + `${func}(`);
    setExpression(prev => prev + `${func}(`);
  }, []);

  const calculate = useCallback(() => {
    try {
      let expr = expression;
      // 处理角度/弧度转换
      if (!isRadians) {
        expr = expr
          .replace(/sin\(([^)]+)\)/g, (_, arg) => `sin(${degreesToRadians(parseFloat(arg))})`)
          .replace(/cos\(([^)]+)\)/g, (_, arg) => `cos(${degreesToRadians(parseFloat(arg))})`)
          .replace(/tan\(([^)]+)\)/g, (_, arg) => `tan(${degreesToRadians(parseFloat(arg))})`);
      }
      const result = evaluateExpression(expr);
      const formatted = Number.isInteger(result) ? result.toString() : result.toPrecision(10).replace(/\.?0+$/, '');
      setDisplay(formatted);
      setExpression(formatted);
    } catch {
      setError(t('sci.error'));
      setDisplay('Error');
    }
  }, [expression, isRadians, t]);

  const clear = useCallback(() => {
    setDisplay('0');
    setExpression('');
    setError(null);
  }, []);

  const backspace = useCallback(() => {
    if (display.length === 1 || display === 'Error') {
      setDisplay('0');
      setExpression('');
    } else {
      setDisplay(prev => prev.slice(0, -1));
      setExpression(prev => prev.slice(0, -1));
    }
    setError(null);
  }, [display]);

  const handleFactorial = useCallback(() => {
    try {
      const num = parseFloat(display);
      const result = factorial(num);
      setDisplay(result.toString());
      setExpression(result.toString());
    } catch {
      setError(t('sci.error'));
      setDisplay('Error');
    }
  }, [display, t]);

  const memoryStore = () => setMemory(parseFloat(display) || 0);
  const memoryRecall = () => { setDisplay(memory.toString()); setExpression(memory.toString()); };
  const memoryClear = () => setMemory(0);
  const memoryAdd = () => setMemory(prev => prev + (parseFloat(display) || 0));

  const copyResult = async () => {
    await navigator.clipboard.writeText(display);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const Button = ({ value, onClick, className = '' }: { value: string; onClick: () => void; className?: string }) => (
    <button
      onClick={onClick}
      className={`p-3 rounded-lg font-mono text-sm transition-colors text-gray-900 dark:text-white ${className}`}
    >
      {value}
    </button>
  );

  return (
    <div className="max-w-md mx-auto space-y-4">
      {/* 显示屏 */}
      <div className="p-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div className="text-xs text-gray-500 dark:text-gray-300 h-5 overflow-hidden">{expression || '0'}</div>
        <div className="flex items-center justify-between">
          <div className={`text-2xl font-mono truncate ${error ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
            {display}
          </div>
          <button
            onClick={copyResult}
            className={`px-2 py-1 text-xs rounded ${copied ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'}`}
          >
            {copied ? '✓' : t('copy')}
          </button>
        </div>
      </div>

      {/* 模式切换 */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600 dark:text-gray-300">{t('sci.angleMode')}:</span>
          <button
            onClick={() => setIsRadians(true)}
            className={`px-2 py-1 text-xs rounded ${isRadians ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'}`}
          >
            RAD
          </button>
          <button
            onClick={() => setIsRadians(false)}
            className={`px-2 py-1 text-xs rounded ${!isRadians ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'}`}
          >
            DEG
          </button>
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-300">M: {memory}</div>
      </div>

      {/* 按钮区域 */}
      <div className="grid grid-cols-5 gap-2">
        {/* 第一行：内存和清除 */}
        <Button value="MC" onClick={memoryClear} className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-xs" />
        <Button value="MR" onClick={memoryRecall} className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-xs" />
        <Button value="M+" onClick={memoryAdd} className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-xs" />
        <Button value="MS" onClick={memoryStore} className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-xs" />
        <Button value="C" onClick={clear} className="bg-red-600 hover:bg-red-500 text-white" />

        {/* 第二行：科学函数 */}
        <Button value="sin" onClick={() => appendFunction('sin')} className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600" />
        <Button value="cos" onClick={() => appendFunction('cos')} className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600" />
        <Button value="tan" onClick={() => appendFunction('tan')} className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600" />
        <Button value="(" onClick={() => appendToExpression('(')} className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600" />
        <Button value=")" onClick={() => appendToExpression(')')} className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600" />

        {/* 第三行：更多函数 */}
        <Button value="ln" onClick={() => appendFunction('ln')} className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600" />
        <Button value="log" onClick={() => appendFunction('log')} className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600" />
        <Button value="√" onClick={() => appendFunction('sqrt')} className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600" />
        <Button value="xʸ" onClick={() => appendToExpression('^')} className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600" />
        <Button value="⌫" onClick={backspace} className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600" />

        {/* 第四行：常数和阶乘 */}
        <Button value="π" onClick={() => appendToExpression('π')} className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600" />
        <Button value="e" onClick={() => appendToExpression('e')} className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600" />
        <Button value="n!" onClick={handleFactorial} className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600" />
        <Button value="%" onClick={() => appendToExpression('%')} className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600" />
        <Button value="÷" onClick={() => appendToExpression('/')} className="bg-orange-600 hover:bg-orange-500 text-white" />

        {/* 数字键盘 */}
        <Button value="7" onClick={() => appendToExpression('7')} className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700" />
        <Button value="8" onClick={() => appendToExpression('8')} className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700" />
        <Button value="9" onClick={() => appendToExpression('9')} className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700" />
        <Button value="×" onClick={() => appendToExpression('*')} className="bg-orange-600 hover:bg-orange-500 text-white" />
        <Button value="−" onClick={() => appendToExpression('-')} className="bg-orange-600 hover:bg-orange-500 text-white" />

        <Button value="4" onClick={() => appendToExpression('4')} className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700" />
        <Button value="5" onClick={() => appendToExpression('5')} className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700" />
        <Button value="6" onClick={() => appendToExpression('6')} className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700" />
        <Button value="+" onClick={() => appendToExpression('+')} className="bg-orange-600 hover:bg-orange-500 text-white" />
        <Button value="=" onClick={calculate} className="bg-blue-600 hover:bg-blue-500 row-span-2 text-white" />

        <Button value="1" onClick={() => appendToExpression('1')} className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700" />
        <Button value="2" onClick={() => appendToExpression('2')} className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700" />
        <Button value="3" onClick={() => appendToExpression('3')} className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700" />
        <Button value="." onClick={() => appendToExpression('.')} className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700" />

        <Button value="0" onClick={() => appendToExpression('0')} className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 col-span-2" />
        <Button value="00" onClick={() => appendToExpression('00')} className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700" />
        <Button value="±" onClick={() => {
          const num = parseFloat(display);
          if (!isNaN(num)) {
            const negated = (-num).toString();
            setDisplay(negated);
            setExpression(negated);
          }
        }} className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700" />
      </div>

      {/* 快捷公式 */}
      <div className="p-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div className="text-xs text-gray-600 dark:text-gray-300 mb-2">{t('sci.quickFormulas')}</div>
        <div className="flex flex-wrap gap-2">
          {['sin(π/6)', 'cos(π/4)', 'sqrt(2)', 'log(100)', 'e^2'].map(formula => (
            <button
              key={formula}
              onClick={() => { setDisplay(formula); setExpression(formula); }}
              className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 rounded font-mono"
            >
              {formula}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
