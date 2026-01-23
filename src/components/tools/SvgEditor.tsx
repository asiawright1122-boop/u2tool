'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function SvgEditor() {
  const t = useTranslations('tools.svg-editor');
  const [svgCode, setSvgCode] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [width, setWidth] = useState(200);
  const [height, setHeight] = useState(200);
  const [fill, setFill] = useState('#3b82f6');
  const [stroke, setStroke] = useState('#1e40af');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const defaultSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="40" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>
</svg>`;

  const updatePreview = (code: string) => {
    try {
      const blob = new Blob([code], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
    } catch {
      setPreviewUrl('');
    }
  };

  const handleCodeChange = (code: string) => {
    setSvgCode(code);
    updatePreview(code);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setSvgCode(content);
        updatePreview(content);
      };
      reader.readAsText(file);
    }
  };

  const applyChanges = () => {
    let code = svgCode;
    
    // Update fill
    code = code.replace(/fill="[^"]*"/g, `fill="${fill}"`);
    if (!code.includes('fill=')) {
      code = code.replace(/<(circle|rect|path|polygon|ellipse)/g, `<$1 fill="${fill}"`);
    }
    
    // Update stroke
    code = code.replace(/stroke="[^"]*"/g, `stroke="${stroke}"`);
    if (!code.includes('stroke=')) {
      code = code.replace(/<(circle|rect|path|polygon|ellipse)/g, `<$1 stroke="${stroke}"`);
    }
    
    // Update stroke-width
    code = code.replace(/stroke-width="[^"]*"/g, `stroke-width="${strokeWidth}"`);
    
    // Update dimensions
    code = code.replace(/width="[^"]*"/, `width="${width}"`);
    code = code.replace(/height="[^"]*"/, `height="${height}"`);
    
    if (!code.includes('width=')) {
      code = code.replace(/<svg/, `<svg width="${width}" height="${height}"`);
    }
    
    setSvgCode(code);
    updatePreview(code);
  };

  const loadExample = () => {
    handleCodeChange(defaultSvg);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(svgCode);
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 2000);
  };

  const downloadSvg = () => {
    const blob = new Blob([svgCode], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'edited.svg';
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {

    return () => {

      if (timerRef.current) clearTimeout(timerRef.current);

    };

  }, []);


  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('svgCode')}
            </label>
            <textarea
              value={svgCode}
              onChange={(e) => handleCodeChange(e.target.value)}
              placeholder={t('placeholder')}
              className="w-full h-64 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm"
            />
          </div>

          <div className="flex gap-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".svg"
              onChange={handleFileUpload}
              className="hidden"
              id="svg-upload"
            />
            <label
              htmlFor="svg-upload"
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors cursor-pointer text-sm"
            >
              {t('uploadSvg')}
            </label>
            <button
              onClick={loadExample}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm"
            >
              {t('loadExample')}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('width')}
              </label>
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('height')}
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('fill')}
              </label>
              <input
                type="color"
                value={fill}
                onChange={(e) => setFill(e.target.value)}
                className="w-full h-10 rounded cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('stroke')}
              </label>
              <input
                type="color"
                value={stroke}
                onChange={(e) => setStroke(e.target.value)}
                className="w-full h-10 rounded cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('strokeWidth')}
              </label>
              <input
                type="number"
                value={strokeWidth}
                onChange={(e) => setStrokeWidth(Number(e.target.value))}
                min="0"
                max="20"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <button
            onClick={applyChanges}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {t('applyChanges')}
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('preview')}
            </label>
            <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 min-h-64 flex items-center justify-center bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAADFJREFUOE9jZGBg+M+ABRw9epQRm3QYGxvDJRgZGRmxKcamBpsabGqwqcGmBpsabGoAAPvfB/1uTd4UAAAAAElFTkSuQmCC')]">
              {previewUrl ? (
                <img src={previewUrl} alt="SVG Preview" className="max-w-full max-h-64" />
              ) : (
                <span className="text-gray-400">{t('noPreview')}</span>
              )}
            </div>
          </div>

          {svgCode && (
            <div className="flex gap-4">
              <button
                onClick={copyToClipboard}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                {copied ? t('copied') : t('copy')}
              </button>
              <button
                onClick={downloadSvg}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                {t('download')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
