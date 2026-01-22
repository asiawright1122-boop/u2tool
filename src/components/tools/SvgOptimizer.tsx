'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { sanitizeSvg } from '@/lib/sanitize';

export default function SvgOptimizer() {
  const t = useTranslations('tools');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [stats, setStats] = useState({ original: 0, optimized: 0, saved: 0 });
  const [copied, setCopied] = useState(false);

  const optimize = () => {
    if (!input.trim()) return;

    let svg = input;
    const originalSize = new Blob([input]).size;

    // Remove comments
    svg = svg.replace(/<!--[\s\S]*?-->/g, '');

    // Remove unnecessary whitespace
    svg = svg.replace(/>\s+</g, '><');
    svg = svg.replace(/\s+/g, ' ');

    // Remove empty attributes
    svg = svg.replace(/\s+[a-zA-Z-]+=""/g, '');

    // Remove default values
    svg = svg.replace(/\s+fill-opacity="1"/g, '');
    svg = svg.replace(/\s+stroke-opacity="1"/g, '');
    svg = svg.replace(/\s+opacity="1"/g, '');

    // Remove metadata
    svg = svg.replace(/<metadata[\s\S]*?<\/metadata>/gi, '');

    // Remove title and desc if empty
    svg = svg.replace(/<title>\s*<\/title>/gi, '');
    svg = svg.replace(/<desc>\s*<\/desc>/gi, '');

    // Remove unnecessary xmlns
    svg = svg.replace(/\s+xmlns:xlink="[^"]*"/g, '');

    // Clean up numbers
    svg = svg.replace(/(\d+)\.0+([^\d])/g, '$1$2');
    svg = svg.replace(/0+(\.\d+)/g, '$1');

    // Trim
    svg = svg.trim();

    const optimizedSize = new Blob([svg]).size;
    const savedPercent = originalSize > 0 ? Math.round((1 - optimizedSize / originalSize) * 100) : 0;

    setOutput(svg);
    setStats({
      original: originalSize,
      optimized: optimizedSize,
      saved: savedPercent
    });
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    return (bytes / 1024).toFixed(2) + ' KB';
  };

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('input')} SVG</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded p-3 font-mono text-sm text-gray-900 dark:text-white"
            placeholder={t('svgOptimizer.placeholder')}
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm text-gray-600 dark:text-gray-300">{t('output')}</label>
            <button onClick={copyOutput} className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
              {copied ? t('copied') : t('copy')}
            </button>
          </div>
          <textarea
            value={output}
            readOnly
            className="w-full h-48 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded p-3 font-mono text-sm text-green-600 dark:text-green-400"
          />
        </div>
      </div>

      <button
        onClick={optimize}
        className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-medium text-white"
      >
        {t('svgOptimizer.optimize')}
      </button>

      {stats.original > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-3 text-center">
            <div className="text-lg font-bold text-gray-900 dark:text-white">{formatSize(stats.original)}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">{t('svgOptimizer.original')}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-3 text-center">
            <div className="text-lg font-bold text-green-600 dark:text-green-400">{formatSize(stats.optimized)}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">{t('svgOptimizer.optimized')}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-3 text-center">
            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{stats.saved}%</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">{t('svgOptimizer.saved')}</div>
          </div>
        </div>
      )}

      {output && (
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">{t('svgOptimizer.preview')}</label>
          {/* 净化 SVG 防止 XSS 攻击 */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-4 flex justify-center" dangerouslySetInnerHTML={{ __html: sanitizeSvg(output) }} />
        </div>
      )}
    </div>
  );
}
