'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';

type ColorBlindnessType = 'normal' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';

interface SimulationInfo {
  type: ColorBlindnessType;
  name: string;
  description: string;
  percentage: string;
}

const simulations: SimulationInfo[] = [
  { type: 'normal', name: 'Normal Vision', description: 'No color blindness', percentage: '~92%' },
  { type: 'protanopia', name: 'Protanopia', description: 'Red-blind (no red cones)', percentage: '~1%' },
  { type: 'deuteranopia', name: 'Deuteranopia', description: 'Green-blind (no green cones)', percentage: '~6%' },
  { type: 'tritanopia', name: 'Tritanopia', description: 'Blue-blind (no blue cones)', percentage: '~0.01%' },
  { type: 'achromatopsia', name: 'Achromatopsia', description: 'Complete color blindness', percentage: '~0.003%' },
];

export default function ColorBlindnessSimulator() {
  const t = useTranslations('tools.color-blindness-simulator');
  const [color, setColor] = useState('#3B82F6');
  const [selectedType, setSelectedType] = useState<ColorBlindnessType>('normal');
  const [image, setImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  const rgbToHex = (r: number, g: number, b: number): string => {
    return '#' + [r, g, b].map(x => {
      const hex = Math.round(Math.max(0, Math.min(255, x))).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  };

  const simulateColorBlindness = (r: number, g: number, b: number, type: ColorBlindnessType): { r: number; g: number; b: number } => {
    const matrices: Record<ColorBlindnessType, number[][]> = {
      normal: [[1, 0, 0], [0, 1, 0], [0, 0, 1]],
      protanopia: [[0.567, 0.433, 0], [0.558, 0.442, 0], [0, 0.242, 0.758]],
      deuteranopia: [[0.625, 0.375, 0], [0.7, 0.3, 0], [0, 0.3, 0.7]],
      tritanopia: [[0.95, 0.05, 0], [0, 0.433, 0.567], [0, 0.475, 0.525]],
      achromatopsia: [[0.299, 0.587, 0.114], [0.299, 0.587, 0.114], [0.299, 0.587, 0.114]],
    };

    const m = matrices[type];
    return {
      r: m[0][0] * r + m[0][1] * g + m[0][2] * b,
      g: m[1][0] * r + m[1][1] * g + m[1][2] * b,
      b: m[2][0] * r + m[2][1] * g + m[2][2] * b,
    };
  };

  const getSimulatedColor = (type: ColorBlindnessType): string => {
    const rgb = hexToRgb(color);
    const simulated = simulateColorBlindness(rgb.r, rgb.g, rgb.b, type);
    return rgbToHex(simulated.r, simulated.g, simulated.b);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getFilterStyle = (type: ColorBlindnessType): React.CSSProperties => {
    const filters: Record<ColorBlindnessType, string> = {
      normal: 'none',
      protanopia: 'url(#protanopia)',
      deuteranopia: 'url(#deuteranopia)',
      tritanopia: 'url(#tritanopia)',
      achromatopsia: 'grayscale(100%)',
    };
    return { filter: filters[type] };
  };

  return (
    <div className="space-y-6">
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="protanopia">
            <feColorMatrix type="matrix" values="0.567 0.433 0 0 0 0.558 0.442 0 0 0 0 0.242 0.758 0 0 0 0 0 1 0" />
          </filter>
          <filter id="deuteranopia">
            <feColorMatrix type="matrix" values="0.625 0.375 0 0 0 0.7 0.3 0 0 0 0 0.3 0.7 0 0 0 0 0 1 0" />
          </filter>
          <filter id="tritanopia">
            <feColorMatrix type="matrix" values="0.95 0.05 0 0 0 0 0.433 0.567 0 0 0 0.475 0.525 0 0 0 0 0 1 0" />
          </filter>
        </defs>
      </svg>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('selectColor')}
          </label>
          <div className="flex gap-3">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-16 h-12 rounded cursor-pointer"
            />
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('uploadImage')}
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {simulations.map((sim) => (
          <button
            key={sim.type}
            onClick={() => setSelectedType(sim.type)}
            className={`p-3 rounded-lg border-2 transition-colors ${
              selectedType === sim.type
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="text-sm font-medium text-gray-900 dark:text-white">{t(`types.${sim.type}`)}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{sim.percentage}</div>
          </button>
        ))}
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="font-medium text-gray-900 dark:text-white mb-3">{t('colorComparison')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {simulations.map((sim) => (
            <div key={sim.type} className="text-center">
              <div
                className="w-full h-20 rounded-lg mb-2 border border-gray-200 dark:border-gray-700"
                style={{ backgroundColor: getSimulatedColor(sim.type) }}
              />
              <div className="text-xs text-gray-600 dark:text-gray-400">{t(`types.${sim.type}`)}</div>
              <div className="text-xs font-mono text-gray-500">{getSimulatedColor(sim.type)}</div>
            </div>
          ))}
        </div>
      </div>

      {image && (
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900 dark:text-white">{t('imagePreview')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">{t('original')}</div>
              <div className="relative min-h-[200px]" style={{ aspectRatio: 'auto' }}>
                <img 
                  src={image} 
                  alt="Original" 
                  className="w-full rounded-lg"
                  style={{ aspectRatio: 'auto' }}
                />
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">{t(`types.${selectedType}`)}</div>
              <div className="relative min-h-[200px]" style={{ aspectRatio: 'auto' }}>
                <img 
                  src={image} 
                  alt="Simulated" 
                  className="w-full rounded-lg" 
                  style={{ ...getFilterStyle(selectedType), aspectRatio: 'auto' }} 
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />

      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">{t('aboutTitle')}</h3>
        <p className="text-sm text-blue-700 dark:text-blue-400">{t('aboutDescription')}</p>
      </div>
    </div>
  );
}
