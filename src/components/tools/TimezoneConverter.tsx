'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

const timezones = [
  { id: 'UTC', name: 'UTC', offset: 0 },
  { id: 'America/New_York', name: 'New York (EST/EDT)', offset: -5 },
  { id: 'America/Los_Angeles', name: 'Los Angeles (PST/PDT)', offset: -8 },
  { id: 'America/Chicago', name: 'Chicago (CST/CDT)', offset: -6 },
  { id: 'America/Denver', name: 'Denver (MST/MDT)', offset: -7 },
  { id: 'America/Sao_Paulo', name: 'São Paulo (BRT)', offset: -3 },
  { id: 'Europe/London', name: 'London (GMT/BST)', offset: 0 },
  { id: 'Europe/Paris', name: 'Paris (CET/CEST)', offset: 1 },
  { id: 'Europe/Berlin', name: 'Berlin (CET/CEST)', offset: 1 },
  { id: 'Europe/Moscow', name: 'Moscow (MSK)', offset: 3 },
  { id: 'Asia/Dubai', name: 'Dubai (GST)', offset: 4 },
  { id: 'Asia/Kolkata', name: 'India (IST)', offset: 5.5 },
  { id: 'Asia/Bangkok', name: 'Bangkok (ICT)', offset: 7 },
  { id: 'Asia/Shanghai', name: 'Shanghai (CST)', offset: 8 },
  { id: 'Asia/Hong_Kong', name: 'Hong Kong (HKT)', offset: 8 },
  { id: 'Asia/Singapore', name: 'Singapore (SGT)', offset: 8 },
  { id: 'Asia/Tokyo', name: 'Tokyo (JST)', offset: 9 },
  { id: 'Asia/Seoul', name: 'Seoul (KST)', offset: 9 },
  { id: 'Australia/Sydney', name: 'Sydney (AEST/AEDT)', offset: 10 },
  { id: 'Pacific/Auckland', name: 'Auckland (NZST/NZDT)', offset: 12 },
];

export default function TimezoneConverter() {
  const t = useTranslations('tools');
  const tz = useTranslations('tools.timezone-converter');
  const [sourceTimezone, setSourceTimezone] = useState('UTC');
  const [targetTimezone, setTargetTimezone] = useState('Asia/Shanghai');
  const [inputDate, setInputDate] = useState('');
  const [inputTime, setInputTime] = useState('');
  const [result, setResult] = useState<{ date: string; time: string; full: string } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const now = new Date();
    setInputDate(now.toISOString().split('T')[0]);
    setInputTime(now.toTimeString().slice(0, 5));
  }, []);

  const convert = () => {
    if (!inputDate || !inputTime) return;

    try {
      const sourceDate = new Date(`${inputDate}T${inputTime}:00`);
      
      // 格式化源时区时间（保留供调试使用）
      const _sourceFormatted = sourceDate.toLocaleString('en-US', {
        timeZone: sourceTimezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });

      const targetFormatted = sourceDate.toLocaleString('en-US', {
        timeZone: targetTimezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });

      const [datePart, timePart] = targetFormatted.split(', ');
      
      setResult({
        date: datePart,
        time: timePart,
        full: targetFormatted
      });
    } catch (_e) {
      setResult(null);
    }
  };

  useEffect(() => {
    convert();
  }, [sourceTimezone, targetTimezone, inputDate, inputTime]);

  const useNow = () => {
    const now = new Date();
    setInputDate(now.toISOString().split('T')[0]);
    setInputTime(now.toTimeString().slice(0, 5));
  };

  const swapTimezones = () => {
    const temp = sourceTimezone;
    setSourceTimezone(targetTimezone);
    setTargetTimezone(temp);
  };

  const copyResult = async () => {
    if (result) {
      await navigator.clipboard.writeText(result.full);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">{tz('date')}</label>
          <input
            type="date"
            value={inputDate}
            onChange={(e) => setInputDate(e.target.value)}
            className="tool-input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">{tz('time')}</label>
          <div className="flex gap-2">
            <input
              type="time"
              value={inputTime}
              onChange={(e) => setInputTime(e.target.value)}
              className="tool-input flex-1"
            />
            <button onClick={useNow} className="btn-secondary px-3">
              {tz('now')}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 items-end">
        <div>
          <label className="block text-sm font-medium mb-2">{tz('fromTimezone')}</label>
          <select
            value={sourceTimezone}
            onChange={(e) => setSourceTimezone(e.target.value)}
            className="tool-input"
          >
            {timezones.map((tz) => (
              <option key={tz.id} value={tz.id}>
                {tz.name} (UTC{tz.offset >= 0 ? '+' : ''}{tz.offset})
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={swapTimezones}
          className="btn-secondary p-2 self-end mb-1"
          title={tz('swapTimezones')}
        >
          ⇄
        </button>

        <div>
          <label className="block text-sm font-medium mb-2">{tz('toTimezone')}</label>
          <select
            value={targetTimezone}
            onChange={(e) => setTargetTimezone(e.target.value)}
            className="tool-input"
          >
            {timezones.map((tz) => (
              <option key={tz.id} value={tz.id}>
                {tz.name} (UTC{tz.offset >= 0 ? '+' : ''}{tz.offset})
              </option>
            ))}
          </select>
        </div>
      </div>

      {result && (
        <div className="p-6 bg-gray-800 rounded-lg">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-medium">{tz('convertedTime')}</h3>
            <button
              onClick={copyResult}
              className={`text-sm px-3 py-1 rounded ${copied ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
              {copied ? t('copied') : t('copy')}
            </button>
          </div>
          <div className="text-3xl font-bold text-blue-400 mb-2">{result.time}</div>
          <div className="text-xl text-gray-300">{result.date}</div>
          <div className="text-sm text-gray-300 mt-2">
            {timezones.find(tz => tz.id === targetTimezone)?.name}
          </div>
        </div>
      )}

      <div className="p-4 bg-gray-800/50 rounded-lg">
        <h3 className="text-sm font-medium mb-3">{tz('worldClock')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['UTC', 'America/New_York', 'Europe/London', 'Asia/Tokyo'].map((tz) => {
            const now = new Date();
            const time = now.toLocaleTimeString('en-US', {
              timeZone: tz,
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            });
            const tzInfo = timezones.find(t => t.id === tz);
            return (
              <div key={tz} className="text-center p-2 bg-gray-700/50 rounded">
                <div className="text-lg font-mono">{time}</div>
                <div className="text-xs text-gray-300">{tzInfo?.name?.split(' ')[0]}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
