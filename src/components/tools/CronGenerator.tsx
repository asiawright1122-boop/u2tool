'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';

export default function CronGenerator() {
  const t = useTranslations('tools');
  const tc = useTranslations('tools.cron-generator');
  const [minute, setMinute] = useState('*');
  const [hour, setHour] = useState('*');
  const [dayOfMonth, setDayOfMonth] = useState('*');
  const [month, setMonth] = useState('*');
  const [dayOfWeek, setDayOfWeek] = useState('*');
  const [expression, setExpression] = useState('* * * * *');
  const [description, setDescription] = useState('');
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const cron = `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
    setExpression(cron);
    setDescription(describeCron(cron));
  }, [minute, hour, dayOfMonth, month, dayOfWeek]);

  const describeCron = (cron: string): string => {
    const [min, hr, dom, mon, dow] = cron.split(' ');
    const parts: string[] = [];

    if (min === '*' && hr === '*' && dom === '*' && mon === '*' && dow === '*') {
      return tc('everyMinute');
    }

    if (min !== '*') parts.push(tc('atMinute', { min }));
    if (hr !== '*') parts.push(tc('atHour', { hr }));
    if (dom !== '*') parts.push(tc('onDay', { dom }));
    if (mon !== '*') parts.push(tc('inMonth', { mon }));
    if (dow !== '*') {
      const days = [tc('sunday'), tc('monday'), tc('tuesday'), tc('wednesday'), tc('thursday'), tc('friday'), tc('saturday')];
      const dayNum = parseInt(dow);
      parts.push(tc('onWeekday', { day: days[dayNum] || dow }));
    }

    return parts.join(', ') || tc('everyMinute');
  };

  const presets = [
    { label: tc('everyMinute'), value: '* * * * *' },
    { label: tc('everyHour'), value: '0 * * * *' },
    { label: tc('everyDayMidnight'), value: '0 0 * * *' },
    { label: tc('everyDayNoon'), value: '0 12 * * *' },
    { label: tc('everyMonday'), value: '0 0 * * 1' },
    { label: tc('everyWeekday'), value: '0 0 * * 1-5' },
    { label: tc('firstDayOfMonth'), value: '0 0 1 * *' },
    { label: tc('every5Minutes'), value: '*/5 * * * *' },
    { label: tc('every30Minutes'), value: '*/30 * * * *' },
  ];

  const applyPreset = (value: string) => {
    const [min, hr, dom, mon, dow] = value.split(' ');
    setMinute(min);
    setHour(hr);
    setDayOfMonth(dom);
    setMonth(mon);
    setDayOfWeek(dow);
  };

  const copyExpression = async () => {
    await navigator.clipboard.writeText(expression);
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {

    return () => {

      if (timerRef.current) clearTimeout(timerRef.current);

    };

  }, []);


  return (
    <div className="space-y-6">
      {/* Presets */}
      <div>
        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">{tc('presets')}</label>
        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => (
            <button
              key={preset.value}
              onClick={() => applyPreset(preset.value)}
              className="px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Fields */}
      <div className="grid grid-cols-5 gap-4">
        <div>
          <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">{tc('minute')}</label>
          <input
            type="text"
            value={minute}
            onChange={(e) => setMinute(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-center text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">{tc('hour')}</label>
          <input
            type="text"
            value={hour}
            onChange={(e) => setHour(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-center text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">{tc('day')}</label>
          <input
            type="text"
            value={dayOfMonth}
            onChange={(e) => setDayOfMonth(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-center text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">{tc('month')}</label>
          <input
            type="text"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-center text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">{tc('weekday')}</label>
          <input
            type="text"
            value={dayOfWeek}
            onChange={(e) => setDayOfWeek(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-center text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Result */}
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-600 dark:text-gray-300">{tc('expression')}</span>
          <button
            onClick={copyExpression}
            className={`text-sm px-3 py-1 rounded text-white ${copied ? 'bg-green-600' : 'bg-gray-600 dark:bg-gray-700 hover:bg-gray-500 dark:hover:bg-gray-600'}`}
          >
            {copied ? t('copied') : t('copy')}
          </button>
        </div>
        <div className="text-2xl font-mono text-center mb-4 text-gray-900 dark:text-white">{expression}</div>
        <div className="text-center text-gray-600 dark:text-gray-300">{description}</div>
      </div>

      {/* Reference */}
      <div className="text-xs text-gray-600 dark:text-gray-300">
        <p className="mb-2">{tc('specialChars')}:</p>
        <ul className="list-disc list-inside space-y-1">
          <li><code className="bg-gray-200 dark:bg-gray-800 px-1 text-gray-900 dark:text-white">*</code> - {tc('anyValue')}</li>
          <li><code className="bg-gray-200 dark:bg-gray-800 px-1 text-gray-900 dark:text-white">,</code> - {tc('valueList')}</li>
          <li><code className="bg-gray-200 dark:bg-gray-800 px-1 text-gray-900 dark:text-white">-</code> - {tc('range')}</li>
          <li><code className="bg-gray-200 dark:bg-gray-800 px-1 text-gray-900 dark:text-white">/</code> - {tc('step')}</li>
        </ul>
      </div>
    </div>
  );
}
