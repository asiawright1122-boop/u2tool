'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';

type TimestampFormat = 'seconds' | 'milliseconds' | 'iso8601' | 'unknown';

interface TimestampEntry {
  input: string;
  detected: TimestampFormat;
  output: string;
  isValid: boolean;
}

// Detect timestamp format
function detectFormat(input: string): TimestampFormat {
  const trimmed = input.trim();
  
  // ISO 8601 format
  if (/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})?/.test(trimmed)) {
    return 'iso8601';
  }
  
  // Unix timestamp
  if (/^\d+$/.test(trimmed)) {
    const num = parseInt(trimmed, 10);
    // Milliseconds (13+ digits, or value > year 3000 in seconds)
    if (trimmed.length >= 13 || num > 32503680000) {
      return 'milliseconds';
    }
    // Seconds (10 digits or less)
    return 'seconds';
  }
  
  return 'unknown';
}

// Convert timestamp to Date
function parseTimestamp(input: string, format: TimestampFormat): Date | null {
  const trimmed = input.trim();
  
  try {
    switch (format) {
      case 'seconds':
        return new Date(parseInt(trimmed, 10) * 1000);
      case 'milliseconds':
        return new Date(parseInt(trimmed, 10));
      case 'iso8601':
        return new Date(trimmed);
      default:
        return null;
    }
  } catch {
    return null;
  }
}

// Format date with timezone
function formatDate(date: Date, timezone: string, outputFormat: string): string {
  try {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    };
    
    if (outputFormat === 'iso') {
      return date.toISOString();
    }
    
    return new Intl.DateTimeFormat('en-CA', options).format(date).replace(',', '');
  } catch {
    return 'Invalid';
  }
}

// Common timezones
const TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Los_Angeles',
  'America/Chicago',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Asia/Singapore',
  'Australia/Sydney',
];

export default function BatchTimestampConverter() {
  const t = useTranslations('tools.batch-timestamp-converter');
  const tg = useTranslations('tools');
  
  const [input, setInput] = useState('');
  const [entries, setEntries] = useState<TimestampEntry[]>([]);
  const [timezone, setTimezone] = useState('UTC');
  const [outputFormat, setOutputFormat] = useState('local');
  const [copied, setCopied] = useState(false);

  const handleConvert = useCallback(() => {
    if (!input.trim()) {
      setEntries([]);
      return;
    }

    const lines = input.split('\n').filter(line => line.trim());
    const results: TimestampEntry[] = lines.map(line => {
      const trimmed = line.trim();
      const detected = detectFormat(trimmed);
      const date = parseTimestamp(trimmed, detected);
      
      return {
        input: trimmed,
        detected,
        output: date ? formatDate(date, timezone, outputFormat) : 'Invalid',
        isValid: date !== null && !isNaN(date.getTime()),
      };
    });

    setEntries(results);
  }, [input, timezone, outputFormat]);

  const handleClear = () => {
    setInput('');
    setEntries([]);
  };

  const exportCsv = () => {
    const header = 'Input,Detected Format,Output\n';
    const rows = entries.map(e => `"${e.input}","${e.detected}","${e.output}"`).join('\n');
    const csv = header + rows;
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'timestamps.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportJson = () => {
    const json = JSON.stringify(entries, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'timestamps.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyAll = async () => {
    const text = entries.map(e => `${e.input} → ${e.output}`).join('\n');
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Input Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {tg('input')}
        </label>
        <textarea
          className="tool-textarea font-mono"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('inputPlaceholder')}
          rows={6}
        />
      </div>

      {/* Options Section */}
      <div className="flex flex-wrap gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('timezone')}
          </label>
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            {TIMEZONES.map(tz => (
              <option key={tz} value={tz}>{tz}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('outputFormat')}
          </label>
          <select
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="local">Local Format</option>
            <option value="iso">ISO 8601</option>
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <button onClick={handleConvert} className="btn-primary">
          {t('convert')}
        </button>
        <button onClick={handleClear} className="btn-secondary">
          {tg('clear')}
        </button>
      </div>

      {/* Results Table */}
      {entries.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {tg('output')} ({entries.length})
            </h3>
            <div className="flex gap-2">
              <button
                onClick={handleCopyAll}
                className={`text-sm px-3 py-1 rounded ${
                  copied 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100'
                }`}
              >
                {copied ? tg('copied') : tg('copy')}
              </button>
              <button
                onClick={exportCsv}
                className="text-sm px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100"
              >
                {t('exportCsv')}
              </button>
              <button
                onClick={exportJson}
                className="text-sm px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100"
              >
                {t('exportJson')}
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">{t('input')}</th>
                  <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">{t('detected')}</th>
                  <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">{t('output')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {entries.map((entry, index) => (
                  <tr 
                    key={index}
                    className={!entry.isValid ? 'bg-red-50 dark:bg-red-900/20' : ''}
                  >
                    <td className="px-4 py-2 font-mono text-gray-900 dark:text-gray-100">
                      {entry.input}
                    </td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        entry.detected === 'unknown' 
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                          : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      }`}>
                        {t(entry.detected)}
                      </span>
                    </td>
                    <td className="px-4 py-2 font-mono text-gray-900 dark:text-gray-100">
                      {entry.isValid ? entry.output : (
                        <span className="text-red-600 dark:text-red-400">{t('invalid')}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
