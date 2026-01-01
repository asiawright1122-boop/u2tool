'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import JSZip from 'jszip';

interface GridConfig {
  rows: number;
  cols: number;
}

export default function ImageSplitter() {
  const t = useTranslations('tools.image-splitter');
  const tg = useTranslations('tools');
  const [image, setImage] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [grid, setGrid] = useState<GridConfig>({ rows: 3, cols: 3 });
  const [parts, setParts] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const presets = [
    { label: '2×2', rows: 2, cols: 2 },
    { label: '3×3', rows: 3, cols: 3 },
    { label: '4×4', rows: 4, cols: 4 },
    { label: '2×3', rows: 2, cols: 3 },
    { label: '3×2', rows: 3, cols: 2 },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setImageSize({ width: img.width, height: img.height });
        setImage(event.target?.result as string);
        setParts([]);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const splitImage = () => {
    if (!image) return;
    setIsProcessing(true);

    const img = new Image();
    img.onload = () => {
      const partWidth = Math.floor(img.width / grid.cols);
      const partHeight = Math.floor(img.height / grid.rows);
      const newParts: string[] = [];

      for (let row = 0; row < grid.rows; row++) {
        for (let col = 0; col < grid.cols; col++) {
          const canvas = document.createElement('canvas');
          canvas.width = partWidth;
          canvas.height = partHeight;
          const ctx = canvas.getContext('2d');
          if (!ctx) continue;

          ctx.drawImage(
            img,
            col * partWidth,
            row * partHeight,
            partWidth,
            partHeight,
            0,
            0,
            partWidth,
            partHeight
          );

          newParts.push(canvas.toDataURL('image/png'));
        }
      }

      setParts(newParts);
      setIsProcessing(false);
    };
    img.src = image;
  };

  const downloadAll = async () => {
    if (parts.length === 0) return;

    const zip = new JSZip();
    parts.forEach((part, index) => {
      const base64Data = part.split(',')[1];
      const row = Math.floor(index / grid.cols) + 1;
      const col = (index % grid.cols) + 1;
      zip.file(`part_${row}_${col}.png`, base64Data, { base64: true });
    });

    const blob = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `split_${grid.rows}x${grid.cols}.zip`;
    link.click();
  };

  const downloadSingle = (dataUrl: string, index: number) => {
    const row = Math.floor(index / grid.cols) + 1;
    const col = (index % grid.cols) + 1;
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `part_${row}_${col}.png`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <canvas ref={canvasRef} className="hidden" />

      {/* Grid Settings */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex gap-2">
          {presets.map((preset) => (
            <button
              key={preset.label}
              onClick={() => { setGrid({ rows: preset.rows, cols: preset.cols }); setParts([]); }}
              className={`px-3 py-1.5 rounded text-sm ${
                grid.rows === preset.rows && grid.cols === preset.cols
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm">{t('rows')}:</label>
          <input
            type="number"
            min="1"
            max="10"
            value={grid.rows}
            onChange={(e) => { setGrid({ ...grid, rows: Number(e.target.value) }); setParts([]); }}
            className="w-16 tool-input"
          />
          <label className="text-sm">{t('cols')}:</label>
          <input
            type="number"
            min="1"
            max="10"
            value={grid.cols}
            onChange={(e) => { setGrid({ ...grid, cols: Number(e.target.value) }); setParts([]); }}
            className="w-16 tool-input"
          />
        </div>
      </div>

      {/* Upload Area */}
      {!image ? (
        <label className="block border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500">
          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          <div className="text-4xl mb-2">✂️</div>
          <p className="text-gray-600 dark:text-gray-300">{t('dropzone')}</p>
        </label>
      ) : (
        <div className="space-y-4">
          {/* Preview with Grid Overlay */}
          <div className="relative inline-block">
            <img src={image} alt="Original" className="max-w-full max-h-96 rounded-lg" />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                display: 'grid',
                gridTemplateRows: `repeat(${grid.rows}, 1fr)`,
                gridTemplateColumns: `repeat(${grid.cols}, 1fr)`,
              }}
            >
              {Array.from({ length: grid.rows * grid.cols }).map((_, i) => (
                <div key={i} className="border border-red-500 border-dashed" />
              ))}
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('originalSize')}: {imageSize.width}×{imageSize.height} → {t('partSize')}: {Math.floor(imageSize.width / grid.cols)}×{Math.floor(imageSize.height / grid.rows)}
          </p>

          {/* Actions */}
          <div className="flex gap-4">
            <button onClick={splitImage} disabled={isProcessing} className="btn-primary">
              {isProcessing ? t('processing') : t('split')}
            </button>
            <button onClick={() => { setImage(null); setParts([]); }} className="btn-secondary">
              {tg('clear')}
            </button>
          </div>
        </div>
      )}

      {/* Results */}
      {parts.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">{t('result')} ({parts.length} {t('parts')})</h3>
            <button onClick={downloadAll} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg">
              {t('downloadAll')}
            </button>
          </div>
          <div
            className="grid gap-2"
            style={{
              gridTemplateColumns: `repeat(${grid.cols}, 1fr)`,
            }}
          >
            {parts.map((part, index) => (
              <div key={index} className="relative group">
                <img src={part} alt={`Part ${index + 1}`} className="w-full rounded border border-gray-200 dark:border-gray-700" />
                <button
                  onClick={() => downloadSingle(part, index)}
                  className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white rounded"
                >
                  {tg('download')}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
