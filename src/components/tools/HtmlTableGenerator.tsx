'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function HtmlTableGenerator() {
  const t = useTranslations('tools');
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [hasHeader, setHasHeader] = useState(true);
  const [data, setData] = useState<string[][]>(() => 
    Array(3).fill(null).map(() => Array(3).fill(''))
  );
  const [copied, setCopied] = useState(false);

  const updateSize = (newRows: number, newCols: number) => {
    const newData = Array(newRows).fill(null).map((_, i) =>
      Array(newCols).fill(null).map((_, j) => data[i]?.[j] || '')
    );
    setData(newData);
    setRows(newRows);
    setCols(newCols);
  };

  const updateCell = (row: number, col: number, value: string) => {
    const newData = [...data];
    newData[row] = [...newData[row]];
    newData[row][col] = value;
    setData(newData);
  };

  const generateHtml = (): string => {
    let html = '<table>\n';
    
    data.forEach((row, i) => {
      if (i === 0 && hasHeader) {
        html += '  <thead>\n    <tr>\n';
        row.forEach(cell => {
          html += `      <th>${cell || ''}</th>\n`;
        });
        html += '    </tr>\n  </thead>\n  <tbody>\n';
      } else {
        if (i === 1 && hasHeader) {
          // Already opened tbody
        } else if (i === 0 && !hasHeader) {
          html += '  <tbody>\n';
        }
        html += '    <tr>\n';
        row.forEach(cell => {
          html += `      <td>${cell || ''}</td>\n`;
        });
        html += '    </tr>\n';
      }
    });
    
    html += '  </tbody>\n</table>';
    return html;
  };

  const copyHtml = () => {
    navigator.clipboard.writeText(generateHtml());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-300">{t('tableGen.rows')}:</label>
          <input
            type="number"
            min="1"
            max="20"
            value={rows}
            onChange={(e) => updateSize(parseInt(e.target.value) || 1, cols)}
            className="w-16 bg-gray-800 rounded px-2 py-1 text-center"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-300">{t('tableGen.cols')}:</label>
          <input
            type="number"
            min="1"
            max="10"
            value={cols}
            onChange={(e) => updateSize(rows, parseInt(e.target.value) || 1)}
            className="w-16 bg-gray-800 rounded px-2 py-1 text-center"
          />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={hasHeader}
            onChange={(e) => setHasHeader(e.target.checked)}
            className="rounded"
          />
          {t('tableGen.hasHeader')}
        </label>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j} className="p-1">
                    <input
                      type="text"
                      value={cell}
                      onChange={(e) => updateCell(i, j, e.target.value)}
                      className={`w-full bg-gray-800 rounded px-2 py-1 text-sm ${
                        i === 0 && hasHeader ? 'font-bold' : ''
                      }`}
                      placeholder={i === 0 && hasHeader ? t('tableGen.header') : t('tableGen.cell')}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm text-gray-300">HTML</label>
          <button
            onClick={copyHtml}
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            {copied ? t('copied') : t('copy')}
          </button>
        </div>
        <pre className="bg-gray-800 rounded p-3 text-sm text-green-400 overflow-x-auto">
          {generateHtml()}
        </pre>
      </div>

      <div>
        <label className="text-sm text-gray-300 mb-2 block">{t('tableGen.preview')}</label>
        <div className="bg-gray-800 rounded p-4 overflow-x-auto">
          <table className="border-collapse border border-gray-600 text-black">
            {hasHeader && data.length > 0 && (
              <thead>
                <tr>
                  {data[0].map((cell, j) => (
                    <th key={j} className="border border-gray-600 px-3 py-2 bg-gray-100">
                      {cell || '\u00A0'}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {data.slice(hasHeader ? 1 : 0).map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j} className="border border-gray-600 px-3 py-2">
                      {cell || '\u00A0'}
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
