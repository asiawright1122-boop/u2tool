'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';

export default function LoremPicsum() {
  const t = useTranslations('tools.lorem-picsum');
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [grayscale, setGrayscale] = useState(false);
  const [blur, setBlur] = useState(0);
  const [seed, setSeed] = useState('');
  const [imageId, setImageId] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const generateUrl = useCallback(() => {
    let url = 'https://picsum.photos';
    
    if (seed) {
      url += `/seed/${seed}`;
    } else if (imageId) {
      url += `/id/${imageId}`;
    }
    
    url += `/${width}/${height}`;
    
    const params: string[] = [];
    if (grayscale) params.push('grayscale');
    if (blur > 0) params.push(`blur=${blur}`);
    
    if (params.length > 0) {
      url += '?' + params.join('&');
    }
    
    setImageUrl(url);
  }, [width, height, grayscale, blur, seed, imageId]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const generateHtmlCode = (): string => {
    return `<img src="${imageUrl}" alt="Random image" width="${width}" height="${height}" />`;
  };

  const generateMarkdownCode = (): string => {
    return `![Random image](${imageUrl})`;
  };

  const presetSizes = [
    { label: '1920×1080 (HD)', width: 1920, height: 1080 },
    { label: '1280×720 (720p)', width: 1280, height: 720 },
    { label: '800×600', width: 800, height: 600 },
    { label: '400×300', width: 400, height: 300 },
    { label: '200×200', width: 200, height: 200 },
    { label: '150×150', width: 150, height: 150 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="tool-label">
                {t('width')} (px)
              </label>
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(parseInt(e.target.value) || 0)}
                min="1"
                max="5000"
                className="tool-input"
              />
            </div>
            <div className="space-y-2">
              <label className="tool-label">
                {t('height')} (px)
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(parseInt(e.target.value) || 0)}
                min="1"
                max="5000"
                className="tool-input"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {presetSizes.map((preset) => (
              <button
                key={preset.label}
                onClick={() => { setWidth(preset.width); setHeight(preset.height); }}
                className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="tool-label">
                {t('seed')} ({t('optional')})
              </label>
              <input
                type="text"
                value={seed}
                onChange={(e) => { setSeed(e.target.value); setImageId(''); }}
                placeholder={t('seedPlaceholder')}
                className="tool-input"
              />
            </div>
            <div className="space-y-2">
              <label className="tool-label">
                {t('imageId')} ({t('optional')})
              </label>
              <input
                type="text"
                value={imageId}
                onChange={(e) => { setImageId(e.target.value); setSeed(''); }}
                placeholder="0-1084"
                className="tool-input"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={grayscale}
                onChange={(e) => setGrayscale(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm text-gray-600 dark:text-gray-300">{t('grayscale')}</span>
            </label>

            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 dark:text-gray-300">{t('blur')}:</label>
              <input
                type="range"
                value={blur}
                onChange={(e) => setBlur(parseInt(e.target.value))}
                min="0"
                max="10"
                className="w-24"
              />
              <span className="text-sm text-gray-600 dark:text-gray-300">{blur}</span>
            </div>
          </div>

          <button
            onClick={generateUrl}
            className="btn-primary w-full"
          >
            {t('generate')}
          </button>

          {imageUrl && (
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="tool-label mb-0">{t('imageUrl')}</label>
                  <button onClick={() => handleCopy(imageUrl)} className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                    {t('copy')}
                  </button>
                </div>
                <input
                  type="text"
                  value={imageUrl}
                  readOnly
                  className="tool-input font-mono text-sm"
                />
              </div>

              <div className="grid grid-cols-1 gap-2">
                <div className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded">
                  <code className="text-xs text-gray-600 dark:text-gray-300 truncate flex-1">{generateHtmlCode()}</code>
                  <button onClick={() => handleCopy(generateHtmlCode())} className="ml-2 text-xs text-blue-600 dark:text-blue-400">HTML</button>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded">
                  <code className="text-xs text-gray-600 dark:text-gray-300 truncate flex-1">{generateMarkdownCode()}</code>
                  <button onClick={() => handleCopy(generateMarkdownCode())} className="ml-2 text-xs text-blue-600 dark:text-blue-400">Markdown</button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="font-medium text-gray-900 dark:text-gray-100">{t('preview')}</h3>
          <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center min-h-[300px]">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Generated placeholder"
                className="max-w-full max-h-[400px] object-contain"
              />
            ) : (
              <p className="text-gray-500 dark:text-gray-300">{t('noPreview')}</p>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg">
        <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">{t('info')}</h3>
        <p className="text-sm text-blue-700 dark:text-blue-400">{t('infoText')}</p>
      </div>
    </div>
  );
}
