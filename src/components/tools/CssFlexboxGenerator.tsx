'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function CssFlexboxGenerator() {
  const t = useTranslations('tools');
  const [flexDirection, setFlexDirection] = useState('row');
  const [justifyContent, setJustifyContent] = useState('flex-start');
  const [alignItems, setAlignItems] = useState('stretch');
  const [flexWrap, setFlexWrap] = useState('nowrap');
  const [gap, setGap] = useState(16);
  const [itemCount, setItemCount] = useState(5);
  const [copied, setCopied] = useState(false);

  const generateCSS = () => {
    return `.flex-container {
  display: flex;
  flex-direction: ${flexDirection};
  justify-content: ${justifyContent};
  align-items: ${alignItems};
  flex-wrap: ${flexWrap};
  gap: ${gap}px;
}

.flex-item {
  /* Add your item styles here */
}`;
  };

  const css = generateCSS();

  const copyCSS = async () => {
    await navigator.clipboard.writeText(css);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">{t('cssFlexboxGenerator.direction')}</label>
          <select value={flexDirection} onChange={(e) => setFlexDirection(e.target.value)} className="tool-input">
            <option value="row">{t('cssFlexboxGenerator.directionRow')}</option>
            <option value="row-reverse">{t('cssFlexboxGenerator.directionRowReverse')}</option>
            <option value="column">{t('cssFlexboxGenerator.directionColumn')}</option>
            <option value="column-reverse">{t('cssFlexboxGenerator.directionColumnReverse')}</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">{t('cssFlexboxGenerator.justifyContent')}</label>
          <select value={justifyContent} onChange={(e) => setJustifyContent(e.target.value)} className="tool-input">
            <option value="flex-start">{t('cssFlexboxGenerator.justifyFlexStart')}</option>
            <option value="flex-end">{t('cssFlexboxGenerator.justifyFlexEnd')}</option>
            <option value="center">{t('cssFlexboxGenerator.justifyCenter')}</option>
            <option value="space-between">{t('cssFlexboxGenerator.justifySpaceBetween')}</option>
            <option value="space-around">{t('cssFlexboxGenerator.justifySpaceAround')}</option>
            <option value="space-evenly">{t('cssFlexboxGenerator.justifySpaceEvenly')}</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">{t('cssFlexboxGenerator.alignItems')}</label>
          <select value={alignItems} onChange={(e) => setAlignItems(e.target.value)} className="tool-input">
            <option value="stretch">{t('cssFlexboxGenerator.alignStretch')}</option>
            <option value="flex-start">{t('cssFlexboxGenerator.alignFlexStart')}</option>
            <option value="flex-end">{t('cssFlexboxGenerator.alignFlexEnd')}</option>
            <option value="center">{t('cssFlexboxGenerator.alignCenter')}</option>
            <option value="baseline">{t('cssFlexboxGenerator.alignBaseline')}</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">{t('cssFlexboxGenerator.flexWrap')}</label>
          <select value={flexWrap} onChange={(e) => setFlexWrap(e.target.value)} className="tool-input">
            <option value="nowrap">{t('cssFlexboxGenerator.wrapNoWrap')}</option>
            <option value="wrap">{t('cssFlexboxGenerator.wrapWrap')}</option>
            <option value="wrap-reverse">{t('cssFlexboxGenerator.wrapWrapReverse')}</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">{t('cssFlexboxGenerator.gap')}</label>
          <input
            type="number"
            min={0}
            value={gap}
            onChange={(e) => setGap(parseInt(e.target.value) || 0)}
            className="tool-input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">{t('cssFlexboxGenerator.items')}</label>
          <input
            type="number"
            min={1}
            max={12}
            value={itemCount}
            onChange={(e) => setItemCount(parseInt(e.target.value) || 1)}
            className="tool-input"
          />
        </div>
      </div>

      {/* Preview */}
      <div>
        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">{t('cssFlexboxGenerator.preview')}</label>
        <div
          className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg min-h-[200px]"
          style={{
            display: 'flex',
            flexDirection: flexDirection as 'row' | 'row-reverse' | 'column' | 'column-reverse',
            justifyContent,
            alignItems,
            flexWrap: flexWrap as 'nowrap' | 'wrap' | 'wrap-reverse',
            gap: `${gap}px`,
          }}
        >
          {Array.from({ length: itemCount }).map((_, i) => (
            <div
              key={i}
              className="bg-purple-600/50 border border-purple-400 rounded p-4 text-center text-gray-900 dark:text-white"
              style={{ minWidth: '60px', minHeight: '60px' }}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* CSS Output */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium">{t('cssFlexboxGenerator.generatedCss')}</label>
          <button
            onClick={copyCSS}
            className={`text-sm px-3 py-1 rounded ${copied ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            {copied ? t('copied') : t('copy')}
          </button>
        </div>
        <pre className="tool-textarea font-mono text-sm">{css}</pre>
      </div>

      {/* Quick Reference */}
      <div className="p-4 bg-gray-100 dark:bg-gray-800/50 rounded-lg">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">{t('cssFlexboxGenerator.quickReference')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300">
          <div>
            <p className="font-medium text-gray-900 dark:text-white mb-1">justify-content</p>
            <p>{t('cssFlexboxGenerator.quickReferenceJustify')}</p>
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white mb-1">align-items</p>
            <p>{t('cssFlexboxGenerator.quickReferenceAlign')}</p>
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white mb-1">flex-direction</p>
            <p>{t('cssFlexboxGenerator.quickReferenceDirection')}</p>
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white mb-1">flex-wrap</p>
            <p>{t('cssFlexboxGenerator.quickReferenceWrap')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
