'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function TimestampConverter() {
  const t = useTranslations('tools');
  const [timestamp, setTimestamp] = useState(Math.floor(Date.now() / 1000));
  const [dateString, setDateString] = useState('');
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [copied, setCopied] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const date = new Date(timestamp * 1000);
    setDateString(date.toISOString().slice(0, 16));
  }, [timestamp]);

  const updateFromDate = (dateStr: string) => {
    setDateString(dateStr);
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      setTimestamp(Math.floor(date.getTime() / 1000));
    }
  };

  const setNow = () => {
    setTimestamp(Math.floor(Date.now() / 1000));
  };

  const copyValue = async (type: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000);
  };

  const formatDate = (ts: number) => {
    const date = new Date(ts * 1000);
    return {
      iso: date.toISOString(),
      local: date.toLocaleString(),
      utc: date.toUTCString(),
    };
  };

  const formatted = formatDate(timestamp);

  return (
    <div className="space-y-6">
      {/* Current Time */}
      <div className="p-4 bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 rounded-lg text-center">
        <div className="text-sm text-blue-600 dark:text-blue-400 mb-1">{t('timestamp.currentTime')}</div>
        <div className="text-3xl font-mono font-bold text-gray-900 dark:text-gray-100">{Math.floor(currentTime / 1000)}</div>
      </div>

      {/* Unix Timestamp Input */}
      <div className="p-4 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">{t('timestamp.unixTimestamp')}</label>
        <div className="flex gap-2">
          <input
            type="number"
            value={timestamp}
            onChange={(e) => setTimestamp(parseInt(e.target.value) || 0)}
            className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded font-mono text-gray-900 dark:text-gray-100"
          />
          <button onClick={setNow} className="btn-secondary">
            {t('timestamp.currentTime')}
          </button>
        </div>
      </div>

      {/* Date Input */}
      <div className="p-4 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">{t('timestamp.dateTime')}</label>
        <input
          type="datetime-local"
          value={dateString}
          onChange={(e) => updateFromDate(e.target.value)}
          className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100"
        />
      </div>

      {/* Formatted Outputs */}
      <div className="space-y-3">
        {Object.entries(formatted).map(([key, value]) => (
          <div key={key} className="p-3 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-300 uppercase">{key}</span>
              <button
                onClick={() => copyValue(key, value)}
                className={`text-xs px-2 py-1 rounded ${copied === key ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'}`}
              >
                {copied === key ? t('copied') : t('copy')}
              </button>
            </div>
            <div className="font-mono text-sm break-all text-gray-900 dark:text-gray-100">{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
