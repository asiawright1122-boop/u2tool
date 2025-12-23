'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function CssGridGenerator() {
  const t = useTranslations('tools');
  const tg = useTranslations('tools.css-grid-generator');
  const [columns, setColumns] = useState(3);
  const [rows, setRows] = useState(3);
  const [gap, setGap] = useState(16);
  const [columnSizes, setColumnSizes] = useState<string[]>(['1fr', '1fr', '1fr']);
  const [rowSizes, setRowSizes] = useState<string[]>(['auto', 'auto', 'auto']);
  const [justifyItems, setJustifyItems] = useState('stretch');
  const [alignItems, setAlignItems] = useState('stretch');
  const [copied, setCopied] = useState(false);

  const updateColumns = (newCols: number) => {
    setColumns(newCols);
    const newSizes = [...columnSizes];
    while (newSizes.length < newCols) newSizes.push('1fr');
    while (newSizes.length > newCols) newSizes.pop();
    setColumnSizes(newSizes);
  };

  const updateRows = (newRows: number) => {
    setRows(newRows);
    const newSizes = [...rowSizes];
    while (newSizes.length < newRows) newSizes.push('auto');
    while (newSizes.length > newRows) newSizes.pop();
    setRowSizes(newSizes);
  };

  const generateCSS = () => {
    return `.grid-container {
  display: grid;
  grid-template-columns: ${columnSizes.join(' ')};
  grid-template-rows: ${rowSizes.join(' ')};
  gap: ${gap}px;
  justify-items: ${justifyItems};
  align-items: ${alignItems};
}`;
  };

  const css = generateCSS();

  const copyCSS = async () => {
    await navigator.clipboard.writeText(css);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sizeOptions = ['auto', '1fr', '2fr', '3fr', 'min-content', 'max-content', '100px', '200px', '50%'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex flex-col">
          <label className="block text-sm font-medium mb-2 truncate">{tg('columns')}</label>
          <input
            type="number"
            min={1}
            max={12}
            value={columns}
            onChange={(e) => updateColumns(parseInt(e.target.value) || 1)}
            className="tool-input flex-1"
          />
        </div>
        <div className="flex flex-col">
          <label className="block text-sm font-medium mb-2 truncate">{tg('rows')}</label>
          <input
            type="number"
            min={1}
            max={12}
            value={rows}
            onChange={(e) => updateRows(parseInt(e.target.value) || 1)}
            className="tool-input flex-1"
          />
        </div>
        <div className="flex flex-col">
          <label className="block text-sm font-medium mb-2 truncate">{tg('gap')}</label>
          <input
            type="number"
            min={0}
            value={gap}
            onChange={(e) => setGap(parseInt(e.target.value) || 0)}
            className="tool-input flex-1"
          />
        </div>
        <div className="flex flex-col">
          <label className="block text-sm font-medium mb-2 truncate">{tg('justifyItems')}</label>
          <select value={justifyItems} onChange={(e) => setJustifyItems(e.target.value)} className="tool-input flex-1">
            <option value="stretch">{tg('stretch')}</option>
            <option value="start">{tg('start')}</option>
            <option value="center">{tg('center')}</option>
            <option value="end">{tg('end')}</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-3">{tg('columnSizes')}</label>
          <div className="space-y-2">
            {columnSizes.map((size, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-sm text-gray-300 w-16 shrink-0 whitespace-nowrap">{tg('col', { index: i + 1 })}:</span>
                <select
                  value={size}
                  onChange={(e) => {
                    const newSizes = [...columnSizes];
                    newSizes[i] = e.target.value;
                    setColumnSizes(newSizes);
                  }}
                  className="tool-input flex-1 min-w-0"
                >
                  {sizeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-3">{tg('rowSizes')}</label>
          <div className="space-y-2">
            {rowSizes.map((size, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-sm text-gray-300 w-16 shrink-0 whitespace-nowrap">{tg('row', { index: i + 1 })}:</span>
                <select
                  value={size}
                  onChange={(e) => {
                    const newSizes = [...rowSizes];
                    newSizes[i] = e.target.value;
                    setRowSizes(newSizes);
                  }}
                  className="tool-input flex-1 min-w-0"
                >
                  {sizeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Preview */}
      <div>
        <label className="block text-sm font-medium mb-2">{tg('preview')}</label>
        <div
          className="p-4 bg-gray-800 rounded-lg min-h-[200px]"
          style={{
            display: 'grid',
            gridTemplateColumns: columnSizes.join(' '),
            gridTemplateRows: rowSizes.join(' '),
            gap: `${gap}px`,
            justifyItems: justifyItems as 'stretch' | 'start' | 'center' | 'end',
            alignItems: alignItems as 'stretch' | 'start' | 'center' | 'end',
          }}
        >
          {Array.from({ length: columns * rows }).map((_, i) => (
            <div
              key={i}
              className="bg-blue-600/50 border border-blue-400 rounded p-2 text-center text-sm"
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* CSS Output */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium">{tg('generatedCss')}</label>
          <button
            onClick={copyCSS}
            className={`text-sm px-3 py-1 rounded ${copied ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            {copied ? t('copied') : t('copy')}
          </button>
        </div>
        <pre className="tool-textarea font-mono text-sm">{css}</pre>
      </div>
    </div>
  );
}
