'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';

export default function SvgToImage() {
  const t = useTranslations('tools.svg-to-image');
  const tg = useTranslations('tools');
  const [svgCode, setSvgCode] = useState('');
  const [format, setFormat] = useState<'png' | 'jpeg' | 'webp'>('png');
  const [scale, setScale] = useState(1);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [transparent, setTransparent] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const formats = [
    { value: 'png', label: 'PNG' },
    { value: 'jpeg', label: 'JPEG' },
    { value: 'webp', label: 'WebP' },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setSvgCode(event.target?.result as string);
    };
    reader.readAsText(file);
  };

  const convert = () => {
    if (!svgCode.trim() || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Create SVG blob
    const svgBlob = new Blob([svgCode], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      // Set canvas size
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      // Fill background
      if (!transparent || format === 'jpeg') {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }

      // Draw SVG
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Generate preview
      const dataUrl = canvas.toDataURL(`image/${format}`, 0.92);
      setPreviewUrl(dataUrl);

      URL.revokeObjectURL(url);
    };

    img.onerror = () => {
      console.error('Failed to load SVG');
      URL.revokeObjectURL(url);
    };

    img.src = url;
  };

  const download = () => {
    if (!previewUrl) return;
    const link = document.createElement('a');
    link.download = `converted-image.${format}`;
    link.href = previewUrl;
    link.click();
  };

  const loadSample = () => {
    setSvgCode(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="200" height="200" rx="20" fill="url(#grad1)"/>
  <circle cx="100" cy="80" r="40" fill="white" opacity="0.9"/>
  <rect x="60" y="130" width="80" height="50" rx="10" fill="white" opacity="0.9"/>
  <text x="100" y="170" text-anchor="middle" fill="#667eea" font-size="14" font-family="Arial">SVG Demo</text>
</svg>`);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">{t('uploadSvg')}</label>
            <input
              type="file"
              accept=".svg"
              onChange={handleFileUpload}
              className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={loadSample}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm"
            >
              {t('loadSample')}
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{t('svgCode')}</label>
            <textarea
              value={svgCode}
              onChange={(e) => setSvgCode(e.target.value)}
              className="tool-textarea h-48 font-mono text-sm"
              placeholder={t('placeholder')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">{t('format')}</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as typeof format)}
                className="tool-input"
              >
                {formats.map((f) => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t('scale')}: {scale}x</label>
              <input
                type="range"
                min="0.5"
                max="4"
                step="0.5"
                value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          {format !== 'png' || !transparent ? (
            <div>
              <label className="block text-sm font-medium mb-2">{t('backgroundColor')}</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-12 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="tool-input flex-1"
                />
              </div>
            </div>
          ) : null}

          {format === 'png' && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={transparent}
                onChange={(e) => setTransparent(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm">{t('transparentBackground')}</span>
            </label>
          )}

          <div className="flex gap-3">
            <button
              onClick={convert}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
            >
              {tg('convert')}
            </button>
            <button
              onClick={download}
              disabled={!previewUrl}
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg"
            >
              {tg('download')}
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-4">
          <label className="block text-sm font-medium">{t('preview')}</label>
          <div className="p-4 bg-gray-800 rounded-lg min-h-[300px] flex items-center justify-center"
               style={{ backgroundImage: 'linear-gradient(45deg, #333 25%, transparent 25%), linear-gradient(-45deg, #333 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #333 75%), linear-gradient(-45deg, transparent 75%, #333 75%)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px' }}>
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="max-w-full max-h-[400px] object-contain" />
            ) : svgCode ? (
              <div dangerouslySetInnerHTML={{ __html: svgCode }} className="max-w-full max-h-[400px]" />
            ) : (
              <div className="text-gray-300 text-center">
                <p className="text-4xl mb-2">📷</p>
                <p>{t('noPreview')}</p>
              </div>
            )}
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </div>
      </div>
    </div>
  );
}
