'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';

export type SortType = 'alphabetical' | 'numerical' | 'natural' | 'length';
export type SortOrder = 'asc' | 'desc';

// 排序函数 - 导出供测试使用
export function sortLines(
  lines: string[],
  sortType: SortType,
  order: SortOrder,
  caseSensitive: boolean,
  trimLines: boolean
): string[] {
  const processed = lines.map(line => trimLines ? line.trim() : line);
  
  const compareFn = (a: string, b: string): number => {
    const strA = caseSensitive ? a : a.toLowerCase();
    const strB = caseSensitive ? b : b.toLowerCase();
    
    let result: number;
    
    switch (sortType) {
      case 'alphabetical':
        result = strA.localeCompare(strB);
        break;
      case 'numerical':
        const numA = parseFloat(strA) || 0;
        const numB = parseFloat(strB) || 0;
        result = numA - numB;
        break;
      case 'natural':
        result = strA.localeCompare(strB, undefined, { numeric: true, sensitivity: caseSensitive ? 'case' : 'base' });
        break;
      case 'length':
        result = a.length - b.length;
        break;
      default:
        result = 0;
    }
    
    return order === 'desc' ? -result : result;
  };
  
  // 使用稳定排序
  return [...processed].sort((a, b) => {
    const cmp = compareFn(a, b);
    // 如果相等，保持原始顺序（稳定排序）
    if (cmp === 0) {
      return processed.indexOf(a) - processed.indexOf(b);
    }
    return cmp;
  });
}

export function removeDuplicates(lines: string[], caseSensitive: boolean): string[] {
  const seen = new Set<string>();
  return lines.filter(line => {
    const key = caseSensitive ? line : line.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export default function TextSorter() {
  const t = useTranslations('tools');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [sortType, setSortType] = useState<SortType>('alphabetical');
  const [order, setOrder] = useState<SortOrder>('asc');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [trimLines, setTrimLines] = useState(true);
  const [removeDups, setRemoveDups] = useState(false);
  const [removeEmpty, setRemoveEmpty] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleSort = useCallback(() => {
    let lines = input.split('\n');
    
    if (removeEmpty) {
      lines = lines.filter(line => line.trim() !== '');
    }
    
    if (removeDups) {
      lines = removeDuplicates(lines, caseSensitive);
    }
    
    const sorted = sortLines(lines, sortType, order, caseSensitive, trimLines);
    setOutput(sorted.join('\n'));
  }, [input, sortType, order, caseSensitive, trimLines, removeDups, removeEmpty]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
  };

  const loadExample = () => {
    setInput('banana\napple\nCherry\n10\n2\n1\nfile1.txt\nfile10.txt\nfile2.txt');
  };

  const inputLines = input.split('\n').filter(l => l.trim()).length;
  const outputLines = output.split('\n').filter(l => l.trim()).length;

  return (
    <div className="space-y-4">
      {/* 控制面板 */}
      <div className="p-4 bg-gray-800 rounded-lg space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* 排序类型 */}
          <div>
            <label className="block text-xs text-gray-300 mb-1">{t('sorter.sortType')}</label>
            <select
              value={sortType}
              onChange={(e) => setSortType(e.target.value as SortType)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-sm"
            >
              <option value="alphabetical">{t('sorter.alphabetical')}</option>
              <option value="numerical">{t('sorter.numerical')}</option>
              <option value="natural">{t('sorter.natural')}</option>
              <option value="length">{t('sorter.byLength')}</option>
            </select>
          </div>
          
          {/* 排序顺序 */}
          <div>
            <label className="block text-xs text-gray-300 mb-1">{t('sorter.order')}</label>
            <select
              value={order}
              onChange={(e) => setOrder(e.target.value as SortOrder)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-sm"
            >
              <option value="asc">{t('sorter.ascending')}</option>
              <option value="desc">{t('sorter.descending')}</option>
            </select>
          </div>
        </div>

        {/* 选项 */}
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={caseSensitive}
              onChange={(e) => setCaseSensitive(e.target.checked)}
              className="rounded bg-gray-700 border-gray-600"
            />
            {t('sorter.caseSensitive')}
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={trimLines}
              onChange={(e) => setTrimLines(e.target.checked)}
              className="rounded bg-gray-700 border-gray-600"
            />
            {t('sorter.trimLines')}
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={removeEmpty}
              onChange={(e) => setRemoveEmpty(e.target.checked)}
              className="rounded bg-gray-700 border-gray-600"
            />
            {t('sorter.removeEmpty')}
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={removeDups}
              onChange={(e) => setRemoveDups(e.target.checked)}
              className="rounded bg-gray-700 border-gray-600"
            />
            {t('sorter.removeDuplicates')}
          </label>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-2">
          <button
            onClick={handleSort}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-sm font-medium"
          >
            {t('sorter.sort')}
          </button>
          <button
            onClick={loadExample}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm"
          >
            {t('sorter.loadExample')}
          </button>
          <button
            onClick={handleClear}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm"
          >
            {t('clear')}
          </button>
        </div>
      </div>

      {/* 输入输出区域 */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* 输入 */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm text-gray-300">{t('input')}</label>
            <span className="text-xs text-gray-300">{inputLines} {t('sorter.lines')}</span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('sorter.placeholder')}
            className="w-full h-64 px-3 py-2 bg-gray-800 border border-gray-700 rounded font-mono text-sm resize-none focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* 输出 */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm text-gray-300">{t('output')}</label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-300">{outputLines} {t('sorter.lines')}</span>
              <button
                onClick={handleCopy}
                disabled={!output}
                className={`px-2 py-1 text-xs rounded ${
                  copied ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'
                } disabled:opacity-50`}
              >
                {copied ? t('copied') : t('copy')}
              </button>
            </div>
          </div>
          <textarea
            value={output}
            readOnly
            className="w-full h-64 px-3 py-2 bg-gray-800 border border-gray-700 rounded font-mono text-sm resize-none"
          />
        </div>
      </div>

      {/* 说明 */}
      <div className="p-3 bg-gray-800/50 rounded-lg text-xs text-gray-300">
        <div className="font-medium mb-1">{t('sorter.sortTypes')}</div>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>{t('sorter.alphabetical')}</strong>: {t('sorter.alphabeticalDesc')}</li>
          <li><strong>{t('sorter.numerical')}</strong>: {t('sorter.numericalDesc')}</li>
          <li><strong>{t('sorter.natural')}</strong>: {t('sorter.naturalDesc')}</li>
          <li><strong>{t('sorter.byLength')}</strong>: {t('sorter.byLengthDesc')}</li>
        </ul>
      </div>
    </div>
  );
}
