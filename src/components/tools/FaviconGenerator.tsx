'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

const FAVICON_SIZES = [16, 32, 48, 64, 128, 256];

interface GeneratedFavicon {
  size: number;
  dataUrl: string;
}

export default function FaviconGenerator() {
  const t = useTranslations('tools.favicon');
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [favicons, setFavicons] = useState<GeneratedFavicon[]>([]);
  const [fileName, setFileName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<number[]>([16, 32, 48, 64]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      return;
    }

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      setOriginalImage(event.target?.result as string);
      setFavicons([]);
    };
    reader.readAsDataURL(file);
  };

  const toggleSize = (size: number) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size].sort((a, b) => a - b)
    );
  };

  const generateFavicons = () => {
    if (!originalImage || selectedSizes.length === 0) return;

    setIsProcessing(true);

    const img = new Image();
    img.onload = () => {
      const generated: GeneratedFavicon[] = [];

      for (const size of selectedSizes) {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;

        const ctx = canvas.getContext('2d');
        if (!ctx) continue;

        // Draw image scaled to fit
        ctx.drawImage(img, 0, 0, size, size);

        generated.push({
          size,
          dataUrl: canvas.toDataURL('image/png'),
        });
      }

      setFavicons(generated);
      setIsProcessing(false);
    };
    img.src = originalImage;
  };

  const downloadFavicon = (favicon: GeneratedFavicon) => {
    const link = document.createElement('a');
    link.href = favicon.dataUrl;
    link.download = `favicon-${favicon.size}x${favicon.size}.png`;
    link.click();
  };

  const downloadAll = () => {
    favicons.forEach((favicon, index) => {
      setTimeout(() => downloadFavicon(favicon), index * 100);
    });
  };

  const clearAll = () => {
    setOriginalImage(null);
    setFavicons([]);
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const generateIcoHtml = () => {
    const links = favicons
      .map(
        (f) =>
          `<link rel="icon" type="image/png" sizes="${f.size}x${f.size}" href="/favicon-${f.size}x${f.size}.png">`
      )
      .join('\n');
    return links;
  };

  const copyHtml = () => {
    navigator.clipboard.writeText(generateIcoHtml());
  };

  useEffect(() => {

    return () => {

      if (timerRef.current) clearTimeout(timerRef.current);

    };

  }, []);


  return (
    <div className="space-y-6">
      {/* Size Selection */}
      <div className="flex flex-wrap items-center gap-4">
        <label className="text-sm text-gray-700 dark:text-gray-300">{t('sizes')}:</label>
        <div className="flex flex-wrap gap-2">
          {FAVICON_SIZES.map((size) => (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              className={`px-3 py-1 rounded text-sm ${
                selectedSizes.includes(size)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {size}x{size}
            </button>
          ))}
        </div>
        <button
          onClick={clearAll}
          className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-sm ml-auto text-gray-900 dark:text-gray-100"
        >
          {t('clear')}
        </button>
      </div>

      {/* File Input */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <div className="text-4xl mb-2">🎨</div>
        <p className="text-gray-700 dark:text-gray-300">{t('dropzone')}</p>
        <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">{t('hint')}</p>
        {fileName && <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{fileName}</p>}
      </div>

      {/* Original Preview */}
      {originalImage && (
        <div className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">{t('original')}</label>
          <div className="flex items-center justify-center min-h-[192px]">
            <img
              src={originalImage}
              alt="Original"
              className="max-w-full max-h-48 object-contain"
              style={{ aspectRatio: 'auto' }}
            />
          </div>
        </div>
      )}

      {/* Generate Button */}
      {originalImage && (
        <div className="flex justify-center">
          <button
            onClick={generateFavicons}
            disabled={isProcessing || selectedSizes.length === 0}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-medium text-white"
          >
            {isProcessing ? t('processing') : t('generate')}
          </button>
        </div>
      )}

      {/* Generated Favicons */}
      {favicons.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('generated')}</label>
            <button
              onClick={downloadAll}
              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded text-sm text-white"
            >
              {t('downloadAll')}
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {favicons.map((favicon) => (
              <div
                key={favicon.size}
                className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center"
              >
                <div className="flex items-center justify-center h-20 mb-2" style={{ aspectRatio: '1/1' }}>
                  <img
                    src={favicon.dataUrl}
                    alt={`${favicon.size}x${favicon.size}`}
                    width={Math.min(favicon.size, 64)}
                    height={Math.min(favicon.size, 64)}
                    style={{ width: Math.min(favicon.size, 64), height: Math.min(favicon.size, 64) }}
                    className="pixelated"
                  />
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  {favicon.size}x{favicon.size}
                </div>
                <button
                  onClick={() => downloadFavicon(favicon)}
                  className="px-2 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-xs w-full text-gray-900 dark:text-gray-100"
                >
                  {t('download')}
                </button>
              </div>
            ))}
          </div>

          {/* HTML Code */}
          <div className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('htmlCode')}</label>
              <button
                onClick={copyHtml}
                className="px-2 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-xs text-gray-900 dark:text-gray-100"
              >
                {t('copy')}
              </button>
            </div>
            <pre className="text-sm text-gray-700 dark:text-gray-300 overflow-x-auto">
              <code>{generateIcoHtml()}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
