'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';

export default function SignaturePad() {
  const t = useTranslations('tools');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [penColor, setPenColor] = useState('#000000');
  const [penWidth, setPenWidth] = useState(3);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [transparentBg, setTransparentBg] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  const getContext = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = penColor;
      ctx.lineWidth = penWidth;
    }
    return ctx;
  }, [penColor, penWidth]);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    
    if (transparentBg) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    setHasSignature(false);
  }, [backgroundColor, transparentBg]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = 300;
    clearCanvas();
  }, [clearCanvas]);

  useEffect(() => { clearCanvas(); }, [backgroundColor, transparentBg, clearCanvas]);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const ctx = getContext();
    if (!ctx) return;
    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasSignature(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const ctx = getContext();
    if (!ctx) return;
    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => { setIsDrawing(false); };

  const downloadSignature = (format: 'png' | 'svg') => {
    const canvas = canvasRef.current;
    if (!canvas || !hasSignature) return;
    
    if (format === 'png') {
      const link = document.createElement('a');
      link.download = 'signature.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } else {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const imageData = canvas.toDataURL('image/png');
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}">
        <image href="${imageData}" width="${canvas.width}" height="${canvas.height}"/>
      </svg>`;
      const blob = new Blob([svg], { type: 'image/svg+xml' });
      const link = document.createElement('a');
      link.download = 'signature.svg';
      link.href = URL.createObjectURL(blob);
      link.click();
    }
  };

  const colors = ['#000000', '#1e40af', '#dc2626', '#16a34a', '#9333ea', '#ea580c'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('signature.penColor')}</label>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <button key={color} onClick={() => setPenColor(color)}
                  className={`w-8 h-8 rounded-full border-2 ${penColor === color ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'}`}
                  style={{ backgroundColor: color }} />
              ))}
              <input type="color" value={penColor} onChange={(e) => setPenColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('signature.penWidth')}: {penWidth}px</label>
            <input type="range" min="1" max="10" value={penWidth} onChange={(e) => setPenWidth(parseInt(e.target.value))} className="w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('signature.backgroundColor')}</label>
            <div className="flex items-center gap-2">
              <input type="color" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} disabled={transparentBg} className="w-10 h-10 rounded cursor-pointer disabled:opacity-50" />
              <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <input type="checkbox" checked={transparentBg} onChange={(e) => setTransparentBg(e.target.checked)} className="w-4 h-4" />
                {t('signature.transparent')}
              </label>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="lg:col-span-3">
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden" style={{ backgroundColor: transparentBg ? 'transparent' : backgroundColor }}>
            <canvas ref={canvasRef} className="w-full cursor-crosshair touch-none"
              style={{ background: transparentBg ? 'repeating-conic-gradient(#e5e7eb 0% 25%, transparent 0% 50%) 50% / 20px 20px' : backgroundColor }}
              onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing}
              onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={stopDrawing} />
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <button onClick={clearCanvas} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
              {t('clear')}
            </button>
            <button onClick={() => downloadSignature('png')} disabled={!hasSignature}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
              {t('signature.downloadPng')}
            </button>
            <button onClick={() => downloadSignature('svg')} disabled={!hasSignature}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">
              {t('signature.downloadSvg')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
