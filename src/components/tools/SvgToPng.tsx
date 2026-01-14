'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';

export default function SvgToPng() {
  const t = useTranslations('tools.svg-to-png');
  const [svgContent, setSvgContent] = useState('');
  const [scale, setScale] = useState(2);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [transparent, setTransparent] = useState(true);
  const [previewUrl, setPreviewUrl] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setSvgContent(content);
        generatePreview(content);
      };
      reader.readAsText(file);
    }
  };

  const handlePaste = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    setSvgContent(content);
    if (content.trim().startsWith('<svg')) {
      generatePreview(content);
    }
  };

  const generatePreview = (svg: string) => {
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    setPreviewUrl(url);
  };

  const convertToPng = () => {
    if (!svgContent) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);

    img.onload = () => {
      const width = img.width * scale;
      const height = img.height * scale;
      
      canvas.width = width;
      canvas.height = height;

      if (!transparent) {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, height);
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob((blob) => {
        if (blob) {
          const downloadUrl = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = downloadUrl;
          a.download = 'converted.png';
          a.click();
          URL.revokeObjectURL(downloadUrl);
        }
      }, 'image/png');

      URL.revokeObjectURL(url);
    };

    img.src = url;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('uploadSvg')}
            </label>
            <input
              type="file"
              accept=".svg"
              onChange={handleFileUpload}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('orPasteSvg')}
            </label>
            <textarea
              value={svgContent}
              onChange={handlePaste}
              placeholder={t('placeholder')}
              className="w-full h-48 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('scale')}
              </label>
              <select
                value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value={1}>1x</option>
                <option value={2}>2x</option>
                <option value={3}>3x</option>
                <option value={4}>4x</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('background')}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  disabled={transparent}
                  className="w-10 h-10 rounded cursor-pointer"
                />
                <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <input
                    type="checkbox"
                    checked={transparent}
                    onChange={(e) => setTransparent(e.target.checked)}
                    className="rounded"
                  />
                  {t('transparent')}
                </label>
              </div>
            </div>
          </div>

          <button
            onClick={convertToPng}
            disabled={!svgContent}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('download')}
          </button>
        </div>

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
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
