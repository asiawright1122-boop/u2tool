'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

// Tailwind to CSS mapping
const tailwindToCssMap: Record<string, string> = {
  // Display
  'flex': 'display: flex;',
  'block': 'display: block;',
  'inline': 'display: inline;',
  'inline-block': 'display: inline-block;',
  'grid': 'display: grid;',
  'hidden': 'display: none;',
  'inline-flex': 'display: inline-flex;',
  
  // Position
  'relative': 'position: relative;',
  'absolute': 'position: absolute;',
  'fixed': 'position: fixed;',
  'sticky': 'position: sticky;',
  'static': 'position: static;',
  
  // Flex direction
  'flex-row': 'flex-direction: row;',
  'flex-col': 'flex-direction: column;',
  'flex-row-reverse': 'flex-direction: row-reverse;',
  'flex-col-reverse': 'flex-direction: column-reverse;',
  
  // Justify content
  'justify-start': 'justify-content: flex-start;',
  'justify-end': 'justify-content: flex-end;',
  'justify-center': 'justify-content: center;',
  'justify-between': 'justify-content: space-between;',
  'justify-around': 'justify-content: space-around;',
  'justify-evenly': 'justify-content: space-evenly;',
  
  // Align items
  'items-start': 'align-items: flex-start;',
  'items-end': 'align-items: flex-end;',
  'items-center': 'align-items: center;',
  'items-baseline': 'align-items: baseline;',
  'items-stretch': 'align-items: stretch;',
  
  // Flex wrap
  'flex-wrap': 'flex-wrap: wrap;',
  'flex-nowrap': 'flex-wrap: nowrap;',
  'flex-wrap-reverse': 'flex-wrap: wrap-reverse;',
  
  // Text align
  'text-left': 'text-align: left;',
  'text-center': 'text-align: center;',
  'text-right': 'text-align: right;',
  'text-justify': 'text-align: justify;',
  
  // Font weight
  'font-thin': 'font-weight: 100;',
  'font-extralight': 'font-weight: 200;',
  'font-light': 'font-weight: 300;',
  'font-normal': 'font-weight: 400;',
  'font-medium': 'font-weight: 500;',
  'font-semibold': 'font-weight: 600;',
  'font-bold': 'font-weight: 700;',
  'font-extrabold': 'font-weight: 800;',
  'font-black': 'font-weight: 900;',
  
  // Overflow
  'overflow-hidden': 'overflow: hidden;',
  'overflow-auto': 'overflow: auto;',
  'overflow-scroll': 'overflow: scroll;',
  'overflow-visible': 'overflow: visible;',
  
  // Cursor
  'cursor-pointer': 'cursor: pointer;',
  'cursor-default': 'cursor: default;',
  'cursor-not-allowed': 'cursor: not-allowed;',
  'cursor-wait': 'cursor: wait;',
  'cursor-text': 'cursor: text;',
  'cursor-move': 'cursor: move;',
  
  // Text decoration
  'underline': 'text-decoration: underline;',
  'line-through': 'text-decoration: line-through;',
  'no-underline': 'text-decoration: none;',
  
  // Text transform
  'uppercase': 'text-transform: uppercase;',
  'lowercase': 'text-transform: lowercase;',
  'capitalize': 'text-transform: capitalize;',
  'normal-case': 'text-transform: none;',
  
  // Border style
  'border-solid': 'border-style: solid;',
  'border-dashed': 'border-style: dashed;',
  'border-dotted': 'border-style: dotted;',
  'border-none': 'border-style: none;',
  
  // Whitespace
  'whitespace-nowrap': 'white-space: nowrap;',
  'whitespace-normal': 'white-space: normal;',
  'whitespace-pre': 'white-space: pre;',
  'whitespace-pre-line': 'white-space: pre-line;',
  'whitespace-pre-wrap': 'white-space: pre-wrap;',
  
  // Visibility
  'invisible': 'visibility: hidden;',
  'visible': 'visibility: visible;',
};

const sizeMap: Record<string, string> = {
  '0': '0px', '0.5': '0.125rem', '1': '0.25rem', '1.5': '0.375rem', '2': '0.5rem',
  '2.5': '0.625rem', '3': '0.75rem', '3.5': '0.875rem', '4': '1rem', '5': '1.25rem',
  '6': '1.5rem', '7': '1.75rem', '8': '2rem', '9': '2.25rem', '10': '2.5rem',
  '11': '2.75rem', '12': '3rem', '14': '3.5rem', '16': '4rem', '20': '5rem',
  '24': '6rem', '28': '7rem', '32': '8rem', '36': '9rem', '40': '10rem',
  '44': '11rem', '48': '12rem', '52': '13rem', '56': '14rem', '60': '15rem',
  '64': '16rem', '72': '18rem', '80': '20rem', '96': '24rem',
  'px': '1px', 'full': '100%', 'auto': 'auto', '1/2': '50%', '1/3': '33.333333%',
  '2/3': '66.666667%', '1/4': '25%', '3/4': '75%', 'screen': '100vh',
};

export default function TailwindToCss() {
  const t = useTranslations('tools.tailwind-to-css');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const convertClass = (className: string): string | null => {
    // Direct mapping
    if (tailwindToCssMap[className]) {
      return tailwindToCssMap[className];
    }

    // Size-based classes
    const sizePatterns = [
      { regex: /^w-(.+)$/, prop: 'width' },
      { regex: /^h-(.+)$/, prop: 'height' },
      { regex: /^min-w-(.+)$/, prop: 'min-width' },
      { regex: /^min-h-(.+)$/, prop: 'min-height' },
      { regex: /^max-w-(.+)$/, prop: 'max-width' },
      { regex: /^max-h-(.+)$/, prop: 'max-height' },
      { regex: /^p-(.+)$/, prop: 'padding' },
      { regex: /^pt-(.+)$/, prop: 'padding-top' },
      { regex: /^pr-(.+)$/, prop: 'padding-right' },
      { regex: /^pb-(.+)$/, prop: 'padding-bottom' },
      { regex: /^pl-(.+)$/, prop: 'padding-left' },
      { regex: /^px-(.+)$/, prop: 'padding-left|padding-right' },
      { regex: /^py-(.+)$/, prop: 'padding-top|padding-bottom' },
      { regex: /^m-(.+)$/, prop: 'margin' },
      { regex: /^mt-(.+)$/, prop: 'margin-top' },
      { regex: /^mr-(.+)$/, prop: 'margin-right' },
      { regex: /^mb-(.+)$/, prop: 'margin-bottom' },
      { regex: /^ml-(.+)$/, prop: 'margin-left' },
      { regex: /^mx-(.+)$/, prop: 'margin-left|margin-right' },
      { regex: /^my-(.+)$/, prop: 'margin-top|margin-bottom' },
      { regex: /^gap-(.+)$/, prop: 'gap' },
      { regex: /^top-(.+)$/, prop: 'top' },
      { regex: /^right-(.+)$/, prop: 'right' },
      { regex: /^bottom-(.+)$/, prop: 'bottom' },
      { regex: /^left-(.+)$/, prop: 'left' },
    ];

    for (const { regex, prop } of sizePatterns) {
      const match = className.match(regex);
      if (match) {
        const value = match[1];
        let cssValue = sizeMap[value];
        
        if (!cssValue && value.startsWith('[') && value.endsWith(']')) {
          cssValue = value.slice(1, -1);
        }
        
        if (cssValue) {
          if (prop.includes('|')) {
            return prop.split('|').map(p => `${p}: ${cssValue};`).join('\n');
          }
          return `${prop}: ${cssValue};`;
        }
      }
    }

    // Border radius
    const roundedMatch = className.match(/^rounded(?:-(.+))?$/);
    if (roundedMatch) {
      const value = roundedMatch[1];
      const radiusMap: Record<string, string> = {
        'none': '0px', 'sm': '0.125rem', undefined: '0.25rem', 'md': '0.375rem',
        'lg': '0.5rem', 'xl': '0.75rem', '2xl': '1rem', '3xl': '1.5rem', 'full': '9999px',
      };
      return `border-radius: ${radiusMap[value] || value};`;
    }

    // Border width
    const borderMatch = className.match(/^border(?:-(\d+))?$/);
    if (borderMatch) {
      const value = borderMatch[1] || '1';
      return `border-width: ${value}px;`;
    }

    // Opacity
    const opacityMatch = className.match(/^opacity-(\d+)$/);
    if (opacityMatch) {
      return `opacity: ${parseInt(opacityMatch[1]) / 100};`;
    }

    // Z-index
    const zMatch = className.match(/^z-(\d+)$/);
    if (zMatch) {
      return `z-index: ${zMatch[1]};`;
    }

    // Colors
    const colorPatterns = [
      { regex: /^text-\[(.+)\]$/, prop: 'color' },
      { regex: /^bg-\[(.+)\]$/, prop: 'background-color' },
      { regex: /^border-\[(.+)\]$/, prop: 'border-color' },
    ];

    for (const { regex, prop } of colorPatterns) {
      const match = className.match(regex);
      if (match) {
        return `${prop}: ${match[1]};`;
      }
    }

    return null;
  };

  const convert = () => {
    const classes = input.trim().split(/\s+/);
    const cssLines: string[] = [];
    const unconverted: string[] = [];

    for (const className of classes) {
      if (!className) continue;
      const css = convertClass(className);
      if (css) {
        cssLines.push(css);
      } else {
        unconverted.push(className);
      }
    }

    let result = cssLines.join('\n');
    if (unconverted.length > 0) {
      result += '\n\n/* Could not convert: ' + unconverted.join(', ') + ' */';
    }

    setOutput(result);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadExample = () => {
    setInput('flex flex-col justify-center items-center p-4 m-2 bg-[#ffffff] rounded-lg font-bold text-center');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('tailwindInput')}
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
            {t('cssOutput')}
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
