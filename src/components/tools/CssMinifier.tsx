'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function CssMinifier() {
  const t = useTranslations('tools.css-minifier');
  const [input, setInput] = useState(`.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  margin: 0 auto;
  max-width: 1200px;
}

/* Header styles */
.header {
  background-color: #333;
  color: white;
  padding: 15px 30px;
  width: 100%;
}

.header h1 {
  font-size: 24px;
  margin: 0;
}

/* Button styles */
.button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.button:hover {
  background-color: #0056b3;
}`);
  const [output, setOutput] = useState('');
  const [stats, setStats] = useState({ original: 0, minified: 0, saved: 0 });

  const minifyCss = (css: string): string => {
    let result = css;
    
    // Remove comments
    result = result.replace(/\/\*[\s\S]*?\*\//g, '');
    
    // Remove newlines and extra spaces
    result = result.replace(/\s+/g, ' ');
    
    // Remove spaces around special characters
    result = result.replace(/\s*([{}:;,>~+])\s*/g, '$1');
    
    // Remove trailing semicolons before closing braces
    result = result.replace(/;}/g, '}');
    
    // Remove leading/trailing whitespace
    result = result.trim();
    
    // Remove spaces after colons in properties (but keep one space for readability in some cases)
    result = result.replace(/:\s+/g, ':');
    
    // Remove unnecessary zeros
    result = result.replace(/(:|\s)0(px|em|rem|%|pt|pc|in|cm|mm|ex|ch|vw|vh|vmin|vmax)/g, '$10');
    
    // Shorten hex colors
    result = result.replace(/#([0-9a-fA-F])\1([0-9a-fA-F])\2([0-9a-fA-F])\3/g, '#$1$2$3');
    
    return result;
  };

  const minify = () => {
    const minified = minifyCss(input);
    setOutput(minified);
    
    const originalSize = new Blob([input]).size;
    const minifiedSize = new Blob([minified]).size;
    const savedPercent = originalSize > 0 ? Math.round((1 - minifiedSize / originalSize) * 100) : 0;
    
    setStats({
      original: originalSize,
      minified: minifiedSize,
      saved: savedPercent
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {stats.original > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-700 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">{formatBytes(stats.original)}</div>
            <div className="text-sm text-gray-300">Original Size</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{formatBytes(stats.minified)}</div>
            <div className="text-sm text-gray-300">Minified Size</div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{stats.saved}%</div>
            <div className="text-sm text-gray-300">Size Reduced</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t('input')}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-80 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white font-mono text-sm"
            placeholder={t('inputPlaceholder')}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t('output')}
          </label>
          <textarea
            value={output}
            readOnly
            className="w-full h-80 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white font-mono text-sm"
            placeholder={t('outputPlaceholder')}
          />
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={minify}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
        >
          {t('minify')}
        </button>
        <button
          onClick={copyToClipboard}
          disabled={!output}
          className="px-6 py-2 bg-gray-600 hover:bg-gray-9000 disabled:opacity-50 rounded-lg font-medium transition-colors"
        >
          {t('copy')}
        </button>
      </div>
    </div>
  );
}
