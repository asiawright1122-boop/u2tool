'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function PngToSvg() {
  const t = useTranslations('tools.png-to-svg');
  const [imageUrl, setImageUrl] = useState('');
  const [svgOutput, setSvgOutput] = useState('');
  const [threshold, setThreshold] = useState(128);
  const [mode, setMode] = useState<'embed' | 'trace'>('embed');
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageUrl(event.target?.result as string);
        setSvgOutput('');
      };
      reader.readAsDataURL(file);
    }
  };

  const embedAsSvg = () => {
    if (!imageUrl) return;

    const img = new Image();
    img.onload = () => {
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${img.width}" height="${img.height}">
  <image href="${imageUrl}" width="${img.width}" height="${img.height}"/>
</svg>`;
      setSvgOutput(svg);
    };
    img.src = imageUrl;
  };

  const traceToSvg = () => {
    if (!imageUrl) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Simple edge detection and path generation
      const paths: string[] = [];
      const visited = new Set<string>();

      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const idx = (y * canvas.width + x) * 4;
          const brightness = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
          
          if (brightness < threshold && !visited.has(`${x},${y}`)) {
            visited.add(`${x},${y}`);
            paths.push(`M${x},${y}h1v1h-1z`);
          }
        }
      }

      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${canvas.width} ${canvas.height}" width="${canvas.width}" height="${canvas.height}">
  <path d="${paths.join('')}" fill="black"/>
</svg>`;
      setSvgOutput(svg);
    };
    img.src = imageUrl;
  };

  const convert = () => {
    if (mode === 'embed') {
      embedAsSvg();
    } else {
      traceToSvg();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(svgOutput);
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 2000);
  };

  const downloadSvg = () => {
    const blob = new Blob([svgOutput], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted.svg';
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
      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center">
        {imageUrl ? (
          <div className="space-y-4">
            <img
              src={imageUrl}
              alt="Preview"
              className="max-w-full max-h-48 mx-auto rounded-lg"
            />
            <button
              onClick={() => {
                setImageUrl('');
                setSvgOutput('');
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="text-sm text-red-500 hover:text-red-600"
            >
              {t('removeImage')}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-6xl">🖼️</div>
            <p className="text-gray-600 dark:text-gray-400">{t('dropzone')}</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/gif"
              onChange={handleFileUpload}
              className="hidden"
              id="png-upload"
            />
            <label
              htmlFor="png-upload"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              {t('selectFile')}
            </label>
          </div>
        )}
      </div>

      {imageUrl && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('conversionMode')}
              </label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as 'embed' | 'trace')}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="embed">{t('embedMode')}</option>
                <option value="trace">{t('traceMode')}</option>
              </select>
            </div>
            {mode === 'trace' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('threshold')}: {threshold}
                </label>
                <input
                  type="range"
                  min="0"
                  max="255"
                  value={threshold}
                  onChange={(e) => setThreshold(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            )}
          </div>

          <button
            onClick={convert}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {t('convert')}
          </button>
        </div>
      )}

      {svgOutput && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('svgOutput')}
            </label>
            <textarea
              value={svgOutput}
              readOnly
              className="w-full h-48 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-sm"
            />
          </div>
          <div className="flex gap-4">
            <button
              onClick={copyToClipboard}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              {copied ? t('copied') : t('copy')}
            </button>
            <button
              onClick={downloadSvg}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              {t('download')}
            </button>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
