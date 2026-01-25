'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';

const FILE_SIZE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB'];
const SPEED_UNITS = ['Kbps', 'Mbps', 'Gbps'];

const COMMON_SPEEDS = [
  { name: '3G', speed: 3, unit: 'Mbps' },
  { name: '4G LTE', speed: 30, unit: 'Mbps' },
  { name: '5G', speed: 300, unit: 'Mbps' },
  { name: 'WiFi 5', speed: 200, unit: 'Mbps' },
  { name: 'WiFi 6', speed: 600, unit: 'Mbps' },
  { name: '100 Mbps Ethernet', speed: 100, unit: 'Mbps' },
  { name: 'Gigabit Ethernet', speed: 1, unit: 'Gbps' },
  { name: 'USB 2.0', speed: 480, unit: 'Mbps' },
  { name: 'USB 3.0', speed: 5, unit: 'Gbps' },
];

export default function DataTransferCalculator() {
  const t = useTranslations('tools.data-transfer-calculator');
  const common = useTranslations('tools');

  const [fileSize, setFileSize] = useState('1');
  const [fileSizeUnit, setFileSizeUnit] = useState('GB');
  const [speed, setSpeed] = useState('100');
  const [speedUnit, setSpeedUnit] = useState('Mbps');
  const [copied, setCopied] = useState(false);

  const results = useMemo(() => {
    const size = parseFloat(fileSize) || 0;
    const spd = parseFloat(speed) || 0;

    if (size <= 0 || spd <= 0) {
      return null;
    }

    // Convert file size to bits
    const sizeMultipliers: Record<string, number> = {
      'B': 8,
      'KB': 8 * 1024,
      'MB': 8 * 1024 * 1024,
      'GB': 8 * 1024 * 1024 * 1024,
      'TB': 8 * 1024 * 1024 * 1024 * 1024,
    };
    const sizeInBits = size * sizeMultipliers[fileSizeUnit];

    // Convert speed to bits per second
    const speedMultipliers: Record<string, number> = {
      'Kbps': 1000,
      'Mbps': 1000000,
      'Gbps': 1000000000,
    };
    const speedInBps = spd * speedMultipliers[speedUnit];

    // Calculate time in seconds
    const timeInSeconds = sizeInBits / speedInBps;

    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    const milliseconds = Math.round((timeInSeconds % 1) * 1000);

    return {
      totalSeconds: timeInSeconds,
      hours,
      minutes,
      seconds,
      milliseconds,
      formatted: formatTime(timeInSeconds),
    };
  }, [fileSize, fileSizeUnit, speed, speedUnit]);

  function formatTime(seconds: number): string {
    if (seconds < 1) {
      return `${Math.round(seconds * 1000)} ms`;
    }
    if (seconds < 60) {
      return `${seconds.toFixed(1)} ${t('seconds')}`;
    }
    if (seconds < 3600) {
      const mins = Math.floor(seconds / 60);
      const secs = Math.round(seconds % 60);
      return `${mins} ${t('minutes')} ${secs} ${t('seconds')}`;
    }
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hrs} ${t('hours')} ${mins} ${t('minutes')}`;
  }

  const handlePresetSpeed = (preset: typeof COMMON_SPEEDS[0]) => {
    setSpeed(preset.speed.toString());
    setSpeedUnit(preset.unit);
  };

  const handleCopy = async () => {
    if (!results) return;
    const text = `Transfer time: ${results.formatted}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* File Size */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('fileSize')}
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={fileSize}
              onChange={(e) => setFileSize(e.target.value)}
              min="0"
              step="any"
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            <select
              value={fileSizeUnit}
              onChange={(e) => setFileSizeUnit(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              {FILE_SIZE_UNITS.map((unit) => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Connection Speed */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('connectionSpeed')}
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={speed}
              onChange={(e) => setSpeed(e.target.value)}
              min="0"
              step="any"
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            <select
              value={speedUnit}
              onChange={(e) => setSpeedUnit(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              {SPEED_UNITS.map((unit) => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Preset Speeds */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('presetSpeeds')}
        </label>
        <div className="flex flex-wrap gap-2">
          {COMMON_SPEEDS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => handlePresetSpeed(preset)}
              className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {results && (
        <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">{t('estimatedTime')}</h3>
            <button
              onClick={handleCopy}
              className="px-3 py-1 text-sm bg-white/20 rounded hover:bg-white/30 transition-colors"
            >
              {copied ? common('copied') : common('copy')}
            </button>
          </div>
          
          <div className="text-4xl font-bold mb-4">
            {results.formatted}
          </div>

          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-semibold">{results.hours}</div>
              <div className="text-sm opacity-80">{t('hours')}</div>
            </div>
            <div>
              <div className="text-2xl font-semibold">{results.minutes}</div>
              <div className="text-sm opacity-80">{t('minutes')}</div>
            </div>
            <div>
              <div className="text-2xl font-semibold">{results.seconds}</div>
              <div className="text-sm opacity-80">{t('seconds')}</div>
            </div>
            <div>
              <div className="text-2xl font-semibold">{results.milliseconds}</div>
              <div className="text-sm opacity-80">ms</div>
            </div>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
        <p className="text-sm text-yellow-800 dark:text-yellow-300">
          {t('note')}
        </p>
      </div>
    </div>
  );
}
