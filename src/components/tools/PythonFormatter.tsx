'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { formatPython } from '@/lib/code-formatters/python';

export default function PythonFormatter() {
  const t = useTranslations('tools.python-formatter');
  const tg = useTranslations('tools');
  const [input, setInput] = useState(`def hello(name):
    print("Hello, "+name+"!")
    return True

class MyClass:
    def __init__(self,value):
        self.value=value
    def get_value(self):
        return self.value`);
  const [output, setOutput] = useState('');
  const [indentSize, setIndentSize] = useState<2 | 4>(4);
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const format = useCallback(() => {
    if (!input.trim()) {
      setOutput('');
      return;
    }
    try {
      const result = formatPython(input, { indentSize });
      setOutput(result);
    } catch (e) {
      setOutput(`Error: ${(e as Error).message}`);
    }
  }, [input, indentSize]);

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
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('indentSize')}</label>
          <select
            value={indentSize}
            onChange={(e) => setIndentSize(Number(e.target.value) as 2 | 4)}
            className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white"
          >
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={format} className="btn-primary">
          {tg('format')}
        </button>
        <button onClick={copyOutput} disabled={!output} className="btn-secondary">
          {copied ? tg('copied') : tg('copy')}
        </button>
        <button onClick={() => { setInput(''); setOutput(''); }} className="btn-secondary">
          {tg('clear')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">{tg('input')}</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-80 bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
            placeholder={t('inputPlaceholder')}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">{tg('output')}</label>
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
