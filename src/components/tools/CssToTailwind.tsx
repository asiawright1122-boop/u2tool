'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

// CSS to Tailwind mapping
const cssToTailwindMap: Record<string, (value: string) => string | null> = {
  'display': (v) => ({ 'flex': 'flex', 'block': 'block', 'inline': 'inline', 'inline-block': 'inline-block', 'grid': 'grid', 'none': 'hidden', 'inline-flex': 'inline-flex' }[v] || null),
  'position': (v) => ({ 'relative': 'relative', 'absolute': 'absolute', 'fixed': 'fixed', 'sticky': 'sticky', 'static': 'static' }[v] || null),
  'flex-direction': (v) => ({ 'row': 'flex-row', 'column': 'flex-col', 'row-reverse': 'flex-row-reverse', 'column-reverse': 'flex-col-reverse' }[v] || null),
  'justify-content': (v) => ({ 'flex-start': 'justify-start', 'flex-end': 'justify-end', 'center': 'justify-center', 'space-between': 'justify-between', 'space-around': 'justify-around', 'space-evenly': 'justify-evenly' }[v] || null),
  'align-items': (v) => ({ 'flex-start': 'items-start', 'flex-end': 'items-end', 'center': 'items-center', 'baseline': 'items-baseline', 'stretch': 'items-stretch' }[v] || null),
  'flex-wrap': (v) => ({ 'wrap': 'flex-wrap', 'nowrap': 'flex-nowrap', 'wrap-reverse': 'flex-wrap-reverse' }[v] || null),
  'text-align': (v) => ({ 'left': 'text-left', 'center': 'text-center', 'right': 'text-right', 'justify': 'text-justify' }[v] || null),
  'font-weight': (v) => {
    const weights: Record<string, string> = { '100': 'font-thin', '200': 'font-extralight', '300': 'font-light', '400': 'font-normal', '500': 'font-medium', '600': 'font-semibold', '700': 'font-bold', '800': 'font-extrabold', '900': 'font-black', 'bold': 'font-bold', 'normal': 'font-normal' };
    return weights[v] || null;
  },
  'overflow': (v) => ({ 'hidden': 'overflow-hidden', 'auto': 'overflow-auto', 'scroll': 'overflow-scroll', 'visible': 'overflow-visible' }[v] || null),
  'cursor': (v) => ({ 'pointer': 'cursor-pointer', 'default': 'cursor-default', 'not-allowed': 'cursor-not-allowed', 'wait': 'cursor-wait', 'text': 'cursor-text', 'move': 'cursor-move' }[v] || null),
  'visibility': (v) => ({ 'hidden': 'invisible', 'visible': 'visible' }[v] || null),
  'white-space': (v) => ({ 'nowrap': 'whitespace-nowrap', 'normal': 'whitespace-normal', 'pre': 'whitespace-pre', 'pre-line': 'whitespace-pre-line', 'pre-wrap': 'whitespace-pre-wrap' }[v] || null),
  'text-decoration': (v) => ({ 'underline': 'underline', 'line-through': 'line-through', 'none': 'no-underline' }[v] || null),
  'text-transform': (v) => ({ 'uppercase': 'uppercase', 'lowercase': 'lowercase', 'capitalize': 'capitalize', 'none': 'normal-case' }[v] || null),
  'border-style': (v) => ({ 'solid': 'border-solid', 'dashed': 'border-dashed', 'dotted': 'border-dotted', 'none': 'border-none' }[v] || null),
};

const sizeToTailwind = (value: string, prefix: string): string | null => {
  const pxMatch = value.match(/^(\d+)px$/);
  if (pxMatch) {
    const px = parseInt(pxMatch[1]);
    const remValue = px / 4;
    if (Number.isInteger(remValue) && remValue <= 96) {
      return `${prefix}-${remValue}`;
    }
    return `${prefix}-[${value}]`;
  }
  
  const remMatch = value.match(/^(\d+(?:\.\d+)?)rem$/);
  if (remMatch) {
    const rem = parseFloat(remMatch[1]);
    const tailwindValue = rem * 4;
    if (Number.isInteger(tailwindValue) && tailwindValue <= 96) {
      return `${prefix}-${tailwindValue}`;
    }
  }
  
  if (value === '0') return `${prefix}-0`;
  if (value === 'auto') return `${prefix}-auto`;
  if (value === '100%') return `${prefix}-full`;
  if (value === '50%') return `${prefix}-1/2`;
  
  return `${prefix}-[${value}]`;
};

export default function CssToTailwind() {
  const t = useTranslations('tools.css-to-tailwind');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const convert = () => {
    const lines = input.split('\n');
    const tailwindClasses: string[] = [];
    const unconverted: string[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('/*') || trimmed.startsWith('//') || trimmed === '{' || trimmed === '}') continue;

      const match = trimmed.match(/^([a-z-]+)\s*:\s*(.+?)\s*;?$/i);
      if (!match) continue;

      const [, property, value] = match;
      const prop = property.toLowerCase();
      const val = value.toLowerCase().trim();

      // Check direct mapping
      if (cssToTailwindMap[prop]) {
        const result = cssToTailwindMap[prop](val);
        if (result) {
          tailwindClasses.push(result);
          continue;
        }
      }

      // Size-based properties
      const sizeProps: Record<string, string> = {
        'width': 'w', 'height': 'h', 'min-width': 'min-w', 'min-height': 'min-h',
        'max-width': 'max-w', 'max-height': 'max-h', 'padding': 'p', 'padding-top': 'pt',
        'padding-right': 'pr', 'padding-bottom': 'pb', 'padding-left': 'pl',
        'margin': 'm', 'margin-top': 'mt', 'margin-right': 'mr', 'margin-bottom': 'mb',
        'margin-left': 'ml', 'gap': 'gap', 'top': 'top', 'right': 'right',
        'bottom': 'bottom', 'left': 'left', 'border-radius': 'rounded',
        'border-width': 'border', 'font-size': 'text', 'line-height': 'leading',
      };

      if (sizeProps[prop]) {
        const result = sizeToTailwind(val, sizeProps[prop]);
        if (result) {
          tailwindClasses.push(result);
          continue;
        }
      }

      // Color properties
      if (prop === 'color' || prop === 'background-color' || prop === 'border-color') {
        const prefix = prop === 'color' ? 'text' : prop === 'background-color' ? 'bg' : 'border';
        if (val.startsWith('#') || val.startsWith('rgb')) {
          tailwindClasses.push(`${prefix}-[${val}]`);
          continue;
        }
        const colorMap: Record<string, string> = {
          'white': 'white', 'black': 'black', 'red': 'red-500', 'blue': 'blue-500',
          'green': 'green-500', 'yellow': 'yellow-500', 'gray': 'gray-500',
          'transparent': 'transparent',
        };
        if (colorMap[val]) {
          tailwindClasses.push(`${prefix}-${colorMap[val]}`);
          continue;
        }
      }

      // Opacity
      if (prop === 'opacity') {
        const opacity = parseFloat(val) * 100;
        tailwindClasses.push(`opacity-${opacity}`);
        continue;
      }

      // Z-index
      if (prop === 'z-index') {
        tailwindClasses.push(`z-${val}`);
        continue;
      }

      unconverted.push(`${property}: ${value}`);
    }

    let result = tailwindClasses.join(' ');
    if (unconverted.length > 0) {
      result += '\n\n/* Could not convert:\n' + unconverted.map(u => `   ${u}`).join('\n') + '\n*/';
    }

    setOutput(result);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output.split('\n')[0]);
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 2000);
  };

  const loadExample = () => {
    setInput(`display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
padding: 16px;
margin: 8px;
background-color: #ffffff;
border-radius: 8px;
font-weight: bold;
text-align: center;`);
  };

  useEffect(() => {

    return () => {

      if (timerRef.current) clearTimeout(timerRef.current);

    };

  }, []);


  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('cssInput')}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('placeholder')}
            className="w-full h-80 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('tailwindOutput')}
          </label>
          <textarea
            value={output}
            readOnly
            placeholder={t('outputPlaceholder')}
            className="w-full h-80 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-sm"
          />
        </div>
      </div>

      <div className="flex gap-4 flex-wrap">
        <button
          onClick={convert}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          {t('convert')}
        </button>
        {output && (
          <button
            onClick={copyToClipboard}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            {copied ? t('copied') : t('copy')}
          </button>
        )}
        <button
          onClick={loadExample}
          className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
        >
          {t('loadExample')}
        </button>
      </div>
    </div>
  );
}
