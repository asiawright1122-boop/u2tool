'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';

export default function PlaceholderImage() {
  const t = useTranslations('tools.placeholder');
  const tg = useTranslations('tools');
  const [width, setWidth] = useState(400);
  const [height, setHeight] = useState(300);
  const [bgColor, setBgColor] = useState('#374151');
  const [textColor, setTextColor] = useState('#9ca3af');
  const [text, setText] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const displayText = text || `${width} × ${height}`;

  const generateImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    // Text
    const fontSize = Math.min(width, height) / 8;
    ctx.fillStyle = textColor;
    ctx.font = `${fontSize}px Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(displayText, width / 2, height / 2);
  };

  const downloadImage = () => {
    generateImage();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `placeholder-${width}x${height}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const copyDataUrl = () => {
    generateImage();
    const canvas = canvasRef.current;
    if (!canvas) return;
    navigator.clipboard.writeText(canvas.toDataURL('image/png'));
  };

  // Generate preview on mount and changes
  useState(() => {
    generateImage();
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm text-gray-300 mb-1">{t('width')}</label>
          <input
            type="number"
            value={width}
            min={1}
            max={2000}
            onChange={(e) => setWidth(Math.min(2000, Math.max(1, Number(e.target.value))))}
            className="w-full bg-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">{t('height')}</label>
          <input
            type="number"
            value={height}
            min={1}
            max={2000}
            onChange={(e) => setHeight(Math.min(2000, Math.max(1, Number(e.target.value))))}
            className="w-full bg-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">{t('bgColor')}</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-10 h-10 rounded cursor-pointer"
            />
            <input
              type="text"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="flex-1 bg-gray-700 rounded-lg px-2 py-2 text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">{t('textColor')}</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="w-10 h-10 rounded cursor-pointer"
            />
            <input
              type="text"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="flex-1 bg-gray-700 rounded-lg px-2 py-2 text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-300 mb-1">{t('customText')}</label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`${width} × ${height}`}
          className="w-full bg-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={generateImage}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          {t('generate')}
        </button>
        <button
          onClick={downloadImage}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
        >
          {tg('download')} PNG
        </button>
        <button
          onClick={copyDataUrl}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
        >
          {tg('copy')} Data URL
        </button>
      </div>

      <div className="bg-gray-700 rounded-lg p-4 flex justify-center items-center overflow-auto">
        <canvas
          ref={canvasRef}
          className="max-w-full border border-gray-600 rounded"
          style={{ maxHeight: '400px' }}
        />
      </div>

      <div className="grid grid-cols-4 gap-2">
        {[
          [100, 100], [200, 200], [300, 200], [400, 300],
          [800, 600], [1200, 630], [1920, 1080], [300, 250]
        ].map(([w, h]) => (
          <button
            key={`${w}x${h}`}
            onClick={() => { setWidth(w); setHeight(h); }}
            className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
          >
            {w}×{h}
          </button>
        ))}
      </div>
    </div>
  );
}
