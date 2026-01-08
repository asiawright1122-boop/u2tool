'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

const handwritingStyles = [
  { name: 'Casual', fontFamily: 'cursive', slant: 5 },
  { name: 'Elegant', fontFamily: 'Georgia', slant: 10 },
  { name: 'Messy', fontFamily: 'Comic Sans MS', slant: -3 },
  { name: 'Neat', fontFamily: 'Palatino', slant: 0 },
];

const paperStyles = [
  { name: 'White', bg: '#ffffff', lines: false },
  { name: 'Lined', bg: '#fffef0', lines: true },
  { name: 'Grid', bg: '#f5f5f5', grid: true },
  { name: 'Vintage', bg: '#f4e4bc', lines: false },
];

export default function TextToHandwriting() {
  const t = useTranslations('tools.text-to-handwriting');
  const tc = useTranslations('tools');

  const [text, setText] = useState<string>('Hello, this is my handwriting!');
  const [style, setStyle] = useState(handwritingStyles[0]);
  const [paper, setPaper] = useState(paperStyles[0]);
  const [inkColor, setInkColor] = useState<string>('#1a365d');
  const [fontSize, setFontSize] = useState<number>(24);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    renderCanvas();
  }, [text, style, paper, inkColor, fontSize]);

  const renderCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const padding = 40;
    const lineHeight = fontSize * 1.8;
    const lines = text.split('\n');
    
    canvas.width = 600;
    canvas.height = Math.max(400, lines.length * lineHeight + padding * 2);

    // Draw paper background
    ctx.fillStyle = paper.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw lines if needed
    if (paper.lines) {
      ctx.strokeStyle = '#ccc';
      ctx.lineWidth = 1;
      for (let y = padding + lineHeight; y < canvas.height; y += lineHeight) {
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(canvas.width - padding, y);
        ctx.stroke();
      }
    }

    // Draw grid if needed
    if (paper.grid) {
      ctx.strokeStyle = '#ddd';
      ctx.lineWidth = 0.5;
      const gridSize = 20;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    }

    // Draw text with handwriting effect
    ctx.fillStyle = inkColor;
    ctx.textBaseline = 'top';

    lines.forEach((line, lineIndex) => {
      const chars = line.split('');
      let x = padding;
      const y = padding + lineIndex * lineHeight;

      chars.forEach((char) => {
        ctx.save();
        
        // Add slight randomness for handwriting effect
        const offsetX = (Math.random() - 0.5) * 2;
        const offsetY = (Math.random() - 0.5) * 2;
        const rotation = ((Math.random() - 0.5) * style.slant * Math.PI) / 180;
        const sizeVariation = 1 + (Math.random() - 0.5) * 0.1;

        ctx.translate(x + offsetX, y + offsetY);
        ctx.rotate(rotation);
        ctx.font = `${fontSize * sizeVariation}px ${style.fontFamily}`;
        ctx.fillText(char, 0, 0);
        
        ctx.restore();
        
        ctx.font = `${fontSize}px ${style.fontFamily}`;
        x += ctx.measureText(char).width + (Math.random() - 0.5) * 2;
      });
    });
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'handwriting.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t('text')}
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
          placeholder={tc('inputPlaceholder')}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('style')}
          </label>
          <div className="space-y-1">
            {handwritingStyles.map((s) => (
              <button
                key={s.name}
                onClick={() => setStyle(s)}
                className={`w-full px-3 py-2 rounded-lg text-left transition-colors ${
                  style.name === s.name
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('paper')}
          </label>
          <div className="space-y-1">
            {paperStyles.map((p) => (
              <button
                key={p.name}
                onClick={() => setPaper(p)}
                className={`w-full px-3 py-2 rounded-lg text-left transition-colors ${
                  paper.name === p.name
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('inkColor')}
          </label>
          <input
            type="color"
            value={inkColor}
            onChange={(e) => setInkColor(e.target.value)}
            className="w-full h-10 rounded-lg cursor-pointer"
          />
          <div className="flex gap-1 mt-2">
            {['#1a365d', '#000000', '#2d3748', '#744210', '#22543d'].map((color) => (
              <button
                key={color}
                onClick={() => setInkColor(color)}
                className="w-6 h-6 rounded-full border-2 border-gray-300"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('fontSize')}: {fontSize}px
          </label>
          <input
            type="range"
            value={fontSize}
            onChange={(e) => setFontSize(parseInt(e.target.value))}
            min="16"
            max="48"
            className="w-full"
          />
        </div>
      </div>

      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-auto">
        <canvas ref={canvasRef} className="mx-auto shadow-lg" />
      </div>

      <button
        onClick={downloadImage}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        {tc('download')} PNG
      </button>
    </div>
  );
}
