'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function TypescriptPlayground() {
  const t = useTranslations('tools.typescript-playground');
  const tg = useTranslations('tools');
  const [input, setInput] = useState(`// TypeScript Example
interface User {
  name: string;
  age: number;
}

function greet(user: User): string {
  return \`Hello, \${user.name}!\`;
}

const user: User = { name: "World", age: 25 };
console.log(greet(user));`);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [target, setTarget] = useState('ES2020');
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const compile = useCallback(async () => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      return;
    }

    try {
      // 简单的 TypeScript 到 JavaScript 转换（移除类型注解）
      let result = input;
      
      // 移除接口定义
      result = result.replace(/interface\s+\w+\s*\{[^}]*\}/g, '');
      
      // 移除类型注解
      result = result.replace(/:\s*\w+(\[\])?(\s*\|\s*\w+(\[\])?)*(?=\s*[=,)\]}])/g, '');
      result = result.replace(/:\s*\w+(\[\])?(\s*\|\s*\w+(\[\])?)*(?=\s*\{)/g, '');
      
      // 移除泛型
      result = result.replace(/<[^>]+>/g, '');
      
      // 移除 as 类型断言
      result = result.replace(/\s+as\s+\w+/g, '');
      
      // 清理多余空行
      result = result.replace(/\n\s*\n\s*\n/g, '\n\n');
      result = result.trim();

      setOutput(result);
      setError('');
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  }, [input]);

  const copyOutput = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-center">
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('target')}</label>
          <select
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white"
          >
            <option value="ES5">ES5</option>
            <option value="ES2015">ES2015</option>
            <option value="ES2020">ES2020</option>
            <option value="ESNext">ESNext</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={compile} className="btn-primary">
          {t('compile')}
        </button>
        <button onClick={copyOutput} disabled={!output} className="btn-secondary">
          {copied ? tg('copied') : tg('copy')}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg p-3 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">TypeScript</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-80 bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
            placeholder={t('inputPlaceholder')}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">JavaScript</label>
          <textarea
            value={output}
            readOnly
            className="w-full h-80 bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
          />
        </div>
      </div>
    </div>
  );
}
