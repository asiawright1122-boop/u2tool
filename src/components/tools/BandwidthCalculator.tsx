'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';

const FILE_SIZE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB'];
const TIME_UNITS = ['seconds', 'minutes', 'hours'];
const BANDWIDTH_UNITS = ['bps', 'Kbps', 'Mbps', 'Gbps'];

export default function BandwidthCalculator() {
  const t = useTranslations('tools.bandwidth-calculator');
  const common = useTranslations('tools');

  const [fileSize, setFileSize] = useState('100');
  const [fileSizeUnit, setFileSizeUnit] = useState('MB');
  const [transferTime, setTransferTime] = useState('10');
  const [timeUnit, setTimeUnit] = useState('seconds');
  const [copied, setCopied] = useState(false);

  const results = useMemo(() => {
    const size = parseFloat(fileSize) || 0;
    const time = parseFloat(transferTime) || 0;

    if (size <= 0 || time <= 0) {
      return null;
    }

    // Convert file size to bytes
    const sizeMultipliers: Record<string, number> = {
      'B': 1,
      'KB': 1024,
      'MB': 1024 * 1024,
      'GB': 1024 * 1024 * 1024,
      'TB': 1024 * 1024 * 1024 * 1024,
    };
    const sizeInBytes = size * sizeMultipliers[fileSizeUnit];
    const sizeInBits = sizeInBytes * 8;

    // Convert time to seconds
    const timeMultipliers: Record<string, number> = {
      'seconds': 1,
      'minutes': 60,
      'hours': 3600,
    };
    const timeInSeconds = time * timeMultipliers[timeUnit];

    // Calculate bandwidth in bits per second
    const bps = sizeInBits / timeInSeconds;

    return {
      bps: bps,
      Kbps: bps / 1000,
      Mbps: bps / 1000000,
      Gbps: bps / 1000000000,
      Bps: bps / 8,
      KBps: bps / 8 / 1024,
      MBps: bps / 8 / 1024 / 1024,
    };
  }, [fileSize, fileSizeUnit, transferTime, timeUnit]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return num.toExponential(2);
    }
    if (num < 0.01) {
      return num.toExponential(2);
    }
    return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  const handleCopy = async () => {
    if (!results) return;
    const text = `Bandwidth: ${formatNumber(results.Mbps)} Mbps (${formatNumber(results.MBps)} MB/s)`;
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

        {/* Transfer Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('transferTime')}
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={transferTime}
              onChange={(e) => setTransferTime(e.target.value)}
              min="0"
              step="any"
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            <select
              value={timeUnit}
              onChange={(e) => setTimeUnit(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              {TIME_UNITS.map((unit) => (
                <option key={unit} value={unit}>{t(`timeUnits.${unit}`)}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      {results && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {t('requiredBandwidth')}
            </h3>
            <button
              onClick={handleCopy}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              {copied ? common('copied') : common('copy')}
            </button>
          </div>

          {/* Bits per second */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
              {t('bitsPerSecond')}
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {BANDWIDTH_UNITS.map((unit) => (
                <div key={unit} className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatNumber(results[unit as keyof typeof results])}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{unit}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Bytes per second */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
              {t('bytesPerSecond')}
            </h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatNumber(results.Bps)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">B/s</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatNumber(results.KBps)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">KB/s</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatNumber(results.MBps)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">MB/s</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Common Bandwidth Reference */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
          {t('commonBandwidths')}
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-blue-700 dark:text-blue-400">
          <div>3G: ~1-5 Mbps</div>
          <div>4G LTE: ~10-50 Mbps</div>
          <div>5G: ~100-1000 Mbps</div>
          <div>WiFi 5: ~100-400 Mbps</div>
          <div>WiFi 6: ~500-1000 Mbps</div>
          <div>Ethernet: 100-1000 Mbps</div>
          <div>Fiber: 100-10000 Mbps</div>
          <div>USB 3.0: ~5 Gbps</div>
        </div>
      </div>
    </div>
  );
}
