'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';

type SizeUnit = 'KB' | 'MB' | 'GB' | 'TB';
type SpeedUnit = 'Kbps' | 'Mbps' | 'Gbps';

interface SpeedPreset {
  name: string;
  speed: number;
  unit: SpeedUnit;
}

const SPEED_PRESETS: SpeedPreset[] = [
  { name: '3G', speed: 3, unit: 'Mbps' },
  { name: '4G LTE', speed: 20, unit: 'Mbps' },
  { name: '5G', speed: 100, unit: 'Mbps' },
  { name: 'WiFi', speed: 50, unit: 'Mbps' },
  { name: 'Fiber 100', speed: 100, unit: 'Mbps' },
  { name: 'Fiber 1G', speed: 1, unit: 'Gbps' },
];

export default function DownloadTimeCalculator() {
  const t = useTranslations('tools.download-time-calculator');
  const tg = useTranslations('tools');
  const [fileSize, setFileSize] = useState(100);
  const [sizeUnit, setSizeUnit] = useState<SizeUnit>('MB');
  const [speed, setSpeed] = useState(50);
  const [speedUnit, setSpeedUnit] = useState<SpeedUnit>('Mbps');

  const results = useMemo(() => {
    // 转换为字节
    const sizeMultipliers: Record<SizeUnit, number> = {
      'KB': 1024,
      'MB': 1024 * 1024,
      'GB': 1024 * 1024 * 1024,
      'TB': 1024 * 1024 * 1024 * 1024,
    };
    const bytes = fileSize * sizeMultipliers[sizeUnit];

    // 转换为 bits per second
    const speedMultipliers: Record<SpeedUnit, number> = {
      'Kbps': 1000,
      'Mbps': 1000 * 1000,
      'Gbps': 1000 * 1000 * 1000,
    };
    const bps = speed * speedMultipliers[speedUnit];

    // 计算时间（秒）
    const bits = bytes * 8;
    const seconds = bits / bps;

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.round(seconds % 60);

    let formatted = '';
    if (hours > 0) formatted += `${hours}h `;
    if (minutes > 0 || hours > 0) formatted += `${minutes}m `;
    formatted += `${secs}s`;

    return {
      seconds: Math.round(seconds),
      formatted: formatted.trim(),
      hours,
      minutes,
      secs,
    };
  }, [fileSize, sizeUnit, speed, speedUnit]);

  const applyPreset = (preset: SpeedPreset) => {
    setSpeed(preset.speed);
    setSpeedUnit(preset.unit);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('fileSize')}</label>
          <div className="flex gap-2">
            <input
              type="number"
              min={0.1}
              step={0.1}
              value={fileSize}
              onChange={(e) => setFileSize(Number(e.target.value) || 0.1)}
              className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white"
            />
            <select
              value={sizeUnit}
              onChange={(e) => setSizeUnit(e.target.value as SizeUnit)}
              className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white"
            >
              <option value="KB">KB</option>
              <option value="MB">MB</option>
              <option value="GB">GB</option>
              <option value="TB">TB</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('downloadSpeed')}</label>
          <div className="flex gap-2">
            <input
              type="number"
              min={0.1}
              step={0.1}
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value) || 0.1)}
              className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white"
            />
            <select
              value={speedUnit}
              onChange={(e) => setSpeedUnit(e.target.value as SpeedUnit)}
              className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white"
            >
              <option value="Kbps">Kbps</option>
              <option value="Mbps">Mbps</option>
              <option value="Gbps">Gbps</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {SPEED_PRESETS.map((preset) => (
          <button
            key={preset.name}
            onClick={() => applyPreset(preset)}
            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
              speed === preset.speed && speedUnit === preset.unit
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
            }`}
          >
            {preset.name}
          </button>
        ))}
      </div>

      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{t('estimatedTime')}</p>
        <p className="text-4xl font-bold text-blue-600">{results.formatted}</p>
        <p className="text-sm text-gray-500 mt-2">
          ({results.seconds.toLocaleString()} {t('seconds')})
        </p>
      </div>

      <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
        <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3">{t('comparisonTable')}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-300 dark:border-gray-600">
                <th className="text-left py-2">{t('connection')}</th>
                <th className="text-right py-2">{t('time')}</th>
              </tr>
            </thead>
            <tbody>
              {SPEED_PRESETS.map((preset) => {
                const sizeMultipliers: Record<SizeUnit, number> = {
                  'KB': 1024, 'MB': 1024 * 1024, 'GB': 1024 * 1024 * 1024, 'TB': 1024 * 1024 * 1024 * 1024,
                };
                const speedMultipliers: Record<SpeedUnit, number> = {
                  'Kbps': 1000, 'Mbps': 1000 * 1000, 'Gbps': 1000 * 1000 * 1000,
                };
                const bytes = fileSize * sizeMultipliers[sizeUnit];
                const bps = preset.speed * speedMultipliers[preset.unit];
                const secs = (bytes * 8) / bps;
                const h = Math.floor(secs / 3600);
                const m = Math.floor((secs % 3600) / 60);
                const s = Math.round(secs % 60);
                let time = '';
                if (h > 0) time += `${h}h `;
                if (m > 0 || h > 0) time += `${m}m `;
                time += `${s}s`;

                return (
                  <tr key={preset.name} className="border-b border-gray-200 dark:border-gray-600">
                    <td className="py-2">{preset.name} ({preset.speed} {preset.unit})</td>
                    <td className="text-right py-2 font-mono">{time.trim()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
