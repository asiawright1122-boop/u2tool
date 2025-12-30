'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function JsBeautifier() {
  const t = useTranslations('tools.jsBeautifier');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [indentSize, setIndentSize] = useState(2);

  const beautify = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    try {
      const indent = ' '.repeat(indentSize);
      const js = input;
      let level = 0;
      let result = '';
      let inString = false;
      let stringChar = '';
      let i = 0;

      while (i < js.length) {
        const char = js[i];
        const nextChar = js[i + 1];

        // Handle strings
        if ((char === '"' || char === "'" || char === '`') && js[i - 1] !== '\\') {
          if (!inString) {
            inString = true;
            stringChar = char;
          } else if (char === stringChar) {
            inString = false;
          }
          result += char;
          i++;
          continue;
        }

        if (inString) {
          result += char;
          i++;
          continue;
        }

        // Handle brackets
        if (char === '{' || char === '[' || char === '(') {
          result += char + '\n' + indent.repeat(level + 1);
          level++;
          i++;
          continue;
        }

        if (char === '}' || char === ']' || char === ')') {
          level = Math.max(0, level - 1);
          result += '\n' + indent.repeat(level) + char;
          i++;
          continue;
        }

        // Handle semicolons
        if (char === ';') {
          result += ';\n' + indent.repeat(level);
          i++;
          // Skip whitespace after semicolon
          while (js[i] === ' ' || js[i] === '\n' || js[i] === '\t') i++;
          continue;
        }

        // Handle commas
        if (char === ',') {
          result += ',\n' + indent.repeat(level);
          i++;
          while (js[i] === ' ' || js[i] === '\n' || js[i] === '\t') i++;
          continue;
        }

        // Handle colons (for objects)
        if (char === ':' && nextChar !== ':') {
          result += ': ';
          i++;
          while (js[i] === ' ') i++;
          continue;
        }

        result += char;
        i++;
      }

      // Clean up extra whitespace
      result = result.replace(/\n\s*\n\s*\n/g, '\n\n');
      result = result.replace(/\(\s*\n\s*/g, '(');
      result = result.replace(/\s*\n\s*\)/g, ')');
      
      setOutput(result.trim());
    } catch {
      setOutput(t('error'));
    }
  };

  const minify = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    try {
      let js = input;
      // Remove single-line comments
      js = js.replace(/\/\/.*$/gm, '');
      // Remove multi-line comments
      js = js.replace(/\/\*[\s\S]*?\*\//g, '');
      // Remove whitespace but preserve strings
      let result = '';
      let inString = false;
      let stringChar = '';
      
      for (let i = 0; i < js.length; i++) {
        const char = js[i];
        
        if ((char === '"' || char === "'" || char === '`') && js[i - 1] !== '\\') {
          if (!inString) {
            inString = true;
            stringChar = char;
          } else if (char === stringChar) {
            inString = false;
          }
          result += char;
          continue;
        }

        if (inString) {
          result += char;
          continue;
        }

        if (char === ' ' || char === '\n' || char === '\t' || char === '\r') {
          // Add space only if needed between identifiers
          const lastChar = result[result.length - 1];
          const nextChar = js[i + 1];
          if (lastChar && nextChar && /\w/.test(lastChar) && /\w/.test(nextChar)) {
            result += ' ';
          }
          continue;
        }

        result += char;
      }
      
      setOutput(result.trim());
    } catch {
      setOutput(t('error'));
    }
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-700 dark:text-gray-300">{t('indent')}:</label>
          <select
            value={indentSize}
            onChange={(e) => setIndentSize(Number(e.target.value))}
            className="bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded px-2 py-1 text-sm text-gray-900 dark:text-gray-100"
          >
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
          </select>
        </div>
        <button
          onClick={beautify}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-white"
        >
          {t('beautify')}
        </button>
        <button
          onClick={minify}
          className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors text-white"
        >
          {t('minify')}
        </button>
        <button
          onClick={copyOutput}
          disabled={!output}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-700 disabled:opacity-50 rounded-lg transition-colors text-gray-900 dark:text-gray-100"
        >
          {t('copy')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">{t('input')}</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-80 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
            placeholder={t('placeholder')}
            spellCheck={false}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">{t('output')}</label>
          <textarea
            value={output}
            readOnly
            className="w-full h-80 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
            placeholder={t('outputPlaceholder')}
          />
        </div>
      </div>
    </div>
  );
}
