'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

type Alignment = 'left' | 'center' | 'right';

export default function MarkdownTableGenerator() {
  const t = useTranslations('tools');
  const tm = useTranslations('tools.markdown-table-generator');
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [data, setData] = useState<string[][]>([
    ['Header 1', 'Header 2', 'Header 3'],
    ['Row 1 Col 1', 'Row 1 Col 2', 'Row 1 Col 3'],
    ['Row 2 Col 1', 'Row 2 Col 2', 'Row 2 Col 3'],
  ]);
  const [alignments, setAlignments] = useState<Alignment[]>(['left', 'left', 'left']);
  const [copied, setCopied] = useState(false);

  const updateCell = (row: number, col: number, value: string) => {
    const newData = [...data];
    newData[row][col] = value;
    setData(newData);
  };

  const updateAlignment = (col: number, alignment: Alignment) => {
    const newAlignments = [...alignments];
    newAlignments[col] = alignment;
    setAlignments(newAlignments);
  };

  const addRow = () => {
    const newRow = Array(cols).fill('');
    setData([...data, newRow]);
    setRows(rows + 1);
  };

  const addColumn = () => {
    const newData = data.map((row, i) => [...row, i === 0 ? `Header ${cols + 1}` : '']);
    setData(newData);
    setAlignments([...alignments, 'left']);
    setCols(cols + 1);
  };

  const removeRow = (index: number) => {
    if (data.length <= 2) return;
    const newData = data.filter((_, i) => i !== index);
    setData(newData);
    setRows(rows - 1);
  };

  const removeColumn = (index: number) => {
    if (cols <= 1) return;
    const newData = data.map(row => row.filter((_, i) => i !== index));
    const newAlignments = alignments.filter((_, i) => i !== index);
    setData(newData);
    setAlignments(newAlignments);
    setCols(cols - 1);
  };

  const generateMarkdown = (): string => {
    if (data.length === 0 || data[0].length === 0) return '';

    const colWidths = data[0].map((_, colIndex) => 
      Math.max(...data.map(row => (row[colIndex] || '').length), 3)
    );

    const padCell = (text: string, width: number, align: Alignment): string => {
      const padding = width - text.length;
      if (align === 'center') {
        const left = Math.floor(padding / 2);
        const right = padding - left;
        return ' '.repeat(left) + text + ' '.repeat(right);
      } else if (align === 'right') {
        return ' '.repeat(padding) + text;
      }
      return text + ' '.repeat(padding);
    };

    const headerRow = '| ' + data[0].map((cell, i) => 
      padCell(cell, colWidths[i], alignments[i])
    ).join(' | ') + ' |';

    const separatorRow = '| ' + alignments.map((align, i) => {
      const width = colWidths[i];
      if (align === 'center') return ':' + '-'.repeat(width - 2) + ':';
      if (align === 'right') return '-'.repeat(width - 1) + ':';
      return '-'.repeat(width);
    }).join(' | ') + ' |';

    const dataRows = data.slice(1).map(row => 
      '| ' + row.map((cell, i) => 
        padCell(cell || '', colWidths[i], alignments[i])
      ).join(' | ') + ' |'
    );

    return [headerRow, separatorRow, ...dataRows].join('\n');
  };

  const copyMarkdown = async () => {
    await navigator.clipboard.writeText(generateMarkdown());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadSample = () => {
    setData([
      ['Name', 'Age', 'City', 'Country'],
      ['John Doe', '30', 'New York', 'USA'],
      ['Jane Smith', '25', 'London', 'UK'],
      ['Bob Johnson', '35', 'Tokyo', 'Japan'],
    ]);
    setAlignments(['left', 'center', 'left', 'left']);
    setCols(4);
    setRows(4);
  };

  const clearTable = () => {
    setData([
      ['Header 1', 'Header 2', 'Header 3'],
      ['', '', ''],
      ['', '', ''],
    ]);
    setAlignments(['left', 'left', 'left']);
    setCols(3);
    setRows(3);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button onClick={addRow} className="btn-secondary">{tm('addRow')}</button>
        <button onClick={addColumn} className="btn-secondary">{tm('addColumn')}</button>
        <button onClick={loadSample} className="btn-secondary">{tm('loadSample')}</button>
        <button onClick={clearTable} className="btn-secondary">{t('clear')}</button>
      </div>

      {/* Alignment Controls */}
      <div className="p-4 bg-gray-800 rounded-lg">
        <h3 className="text-sm font-medium mb-3">{tm('columnAlignment')}</h3>
        <div className="flex flex-wrap gap-4">
          {alignments.map((align, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-sm text-gray-300">{tm('col')} {i + 1}:</span>
              <select
                value={align}
                onChange={(e) => updateAlignment(i, e.target.value as Alignment)}
                className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm"
              >
                <option value="left">{tm('left')}</option>
                <option value="center">{tm('center')}</option>
                <option value="right">{tm('right')}</option>
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Table Editor */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className={rowIndex === 0 ? 'bg-gray-700' : ''}>
                {row.map((cell, colIndex) => (
                  <td key={colIndex} className="border border-gray-600 p-0">
                    <input
                      type="text"
                      value={cell}
                      onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                      className={`w-full px-3 py-2 bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                        rowIndex === 0 ? 'font-bold' : ''
                      }`}
                      placeholder={rowIndex === 0 ? tm('header') : tm('cell')}
                    />
                  </td>
                ))}
                <td className="border border-gray-600 p-1 w-10">
                  {rowIndex > 0 && (
                    <button
                      onClick={() => removeRow(rowIndex)}
                      className="text-red-400 hover:text-red-300 p-1"
                      title={tm('removeRow')}
                    >
                      ✕
                    </button>
                  )}
                </td>
              </tr>
            ))}
            <tr>
              {data[0]?.map((_, colIndex) => (
                <td key={colIndex} className="border border-gray-600 p-1 text-center">
                  <button
                    onClick={() => removeColumn(colIndex)}
                    className="text-red-400 hover:text-red-300 p-1 text-sm"
                    title={tm('removeColumn')}
                  >
                    ✕
                  </button>
                </td>
              ))}
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Output */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium">{tm('markdownOutput')}</label>
          <button
            onClick={copyMarkdown}
            className={`text-sm px-3 py-1 rounded ${copied ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            {copied ? t('copied') : t('copy')}
          </button>
        </div>
        <pre className="tool-textarea font-mono text-sm whitespace-pre overflow-x-auto">
          {generateMarkdown()}
        </pre>
      </div>

      {/* Preview */}
      <div>
        <h3 className="text-sm font-medium mb-2">{tm('preview')}</h3>
        <div className="p-4 bg-gray-800 rounded-lg overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {data[0]?.map((cell, i) => (
                  <th
                    key={i}
                    className={`border border-gray-600 px-4 py-2 bg-gray-700 ${
                      alignments[i] === 'center' ? 'text-center' : 
                      alignments[i] === 'right' ? 'text-right' : 'text-left'
                    }`}
                  >
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.slice(1).map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, colIndex) => (
                    <td
                      key={colIndex}
                      className={`border border-gray-600 px-4 py-2 ${
                        alignments[colIndex] === 'center' ? 'text-center' : 
                        alignments[colIndex] === 'right' ? 'text-right' : 'text-left'
                      }`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
