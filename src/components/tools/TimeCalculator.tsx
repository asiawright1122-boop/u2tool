'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';

interface TimeValue {
  hours: number;
  minutes: number;
  seconds: number;
}

type Operation = 'add' | 'subtract' | 'difference';

// Convert time to total seconds
function toSeconds(time: TimeValue): number {
  return time.hours * 3600 + time.minutes * 60 + time.seconds;
}

// Convert seconds to time value
function fromSeconds(totalSeconds: number): TimeValue {
  const isNegative = totalSeconds < 0;
  const absSeconds = Math.abs(totalSeconds);
  
  const hours = Math.floor(absSeconds / 3600);
  const minutes = Math.floor((absSeconds % 3600) / 60);
  const seconds = absSeconds % 60;
  
  return {
    hours: isNegative ? -hours : hours,
    minutes,
    seconds,
  };
}

// Format time for display
function formatTime(time: TimeValue, format: '12h' | '24h'): string {
  const absHours = Math.abs(time.hours);
  const sign = time.hours < 0 ? '-' : '';
  
  if (format === '12h') {
    const period = absHours >= 12 ? 'PM' : 'AM';
    const displayHours = absHours % 12 || 12;
    return `${sign}${displayHours}:${String(time.minutes).padStart(2, '0')}:${String(time.seconds).padStart(2, '0')} ${period}`;
  }
  
  return `${sign}${String(absHours).padStart(2, '0')}:${String(time.minutes).padStart(2, '0')}:${String(time.seconds).padStart(2, '0')}`;
}

export default function TimeCalculator() {
  const t = useTranslations('tools.time-calculator');
  const tg = useTranslations('tools');
  
  const [time1, setTime1] = useState<TimeValue>({ hours: 0, minutes: 0, seconds: 0 });
  const [time2, setTime2] = useState<TimeValue>({ hours: 0, minutes: 0, seconds: 0 });
  const [operation, setOperation] = useState<Operation>('add');
  const [result, setResult] = useState<TimeValue | null>(null);
  const [format, setFormat] = useState<'12h' | '24h'>('24h');
  const [copied, setCopied] = useState(false);

  const handleCalculate = useCallback(() => {
    const seconds1 = toSeconds(time1);
    const seconds2 = toSeconds(time2);
    
    let resultSeconds: number;
    
    switch (operation) {
      case 'add':
        resultSeconds = seconds1 + seconds2;
        break;
      case 'subtract':
        resultSeconds = seconds1 - seconds2;
        break;
      case 'difference':
        resultSeconds = Math.abs(seconds1 - seconds2);
        break;
    }
    
    setResult(fromSeconds(resultSeconds));
  }, [time1, time2, operation]);

  const handleCopy = async () => {
    if (result) {
      const text = formatTime(result, format);
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClear = () => {
    setTime1({ hours: 0, minutes: 0, seconds: 0 });
    setTime2({ hours: 0, minutes: 0, seconds: 0 });
    setResult(null);
  };

  const TimeInput = ({ 
    value, 
    onChange, 
    label 
  }: { 
    value: TimeValue; 
    onChange: (v: TimeValue) => void; 
    label: string;
  }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div className="flex gap-2 items-center">
        <div className="flex-1">
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('hours')}</label>
          <input
            type="number"
            min="0"
            max="999"
            value={value.hours}
            onChange={(e) => onChange({ ...value, hours: parseInt(e.target.value) || 0 })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
        <span className="text-2xl text-gray-400 mt-5">:</span>
        <div className="flex-1">
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('minutes')}</label>
          <input
            type="number"
            min="0"
            max="59"
            value={value.minutes}
            onChange={(e) => onChange({ ...value, minutes: Math.min(59, parseInt(e.target.value) || 0) })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
        <span className="text-2xl text-gray-400 mt-5">:</span>
        <div className="flex-1">
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('seconds')}</label>
          <input
            type="number"
            min="0"
            max="59"
            value={value.seconds}
            onChange={(e) => onChange({ ...value, seconds: Math.min(59, parseInt(e.target.value) || 0) })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Time Inputs */}
      <div className="grid md:grid-cols-2 gap-6">
        <TimeInput value={time1} onChange={setTime1} label={t('time1')} />
        <TimeInput value={time2} onChange={setTime2} label={t('time2')} />
      </div>

      {/* Operation Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('operation')}
        </label>
        <div className="flex gap-2">
          {(['add', 'subtract', 'difference'] as Operation[]).map((op) => (
            <button
              key={op}
              onClick={() => setOperation(op)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                operation === op
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {t(op)}
            </button>
          ))}
        </div>
      </div>

      {/* Format Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('format')}
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => setFormat('24h')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              format === '24h'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {t('format24h')}
          </button>
          <button
            onClick={() => setFormat('12h')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              format === '12h'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {t('format12h')}
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <button onClick={handleCalculate} className="btn-primary">
          {t('calculate')}
        </button>
        <button onClick={handleClear} className="btn-secondary">
          {tg('clear')}
        </button>
      </div>

      {/* Result Section */}
      {result && (
        <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {t('result')}
            </h3>
            <button
              onClick={handleCopy}
              className={`text-sm px-3 py-1 rounded ${
                copied 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100'
              }`}
            >
              {copied ? tg('copied') : tg('copy')}
            </button>
          </div>
          
          <div className="text-3xl font-mono text-center text-blue-600 dark:text-blue-400 mb-4">
            {formatTime(result, format)}
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-white dark:bg-gray-700 rounded-lg">
              <div className="text-gray-500 dark:text-gray-400">{t('totalMinutes')}</div>
              <div className="text-lg font-medium text-gray-900 dark:text-gray-100">
                {Math.floor(toSeconds(result) / 60)}
              </div>
            </div>
            <div className="p-3 bg-white dark:bg-gray-700 rounded-lg">
              <div className="text-gray-500 dark:text-gray-400">{t('totalSeconds')}</div>
              <div className="text-lg font-medium text-gray-900 dark:text-gray-100">
                {toSeconds(result)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
