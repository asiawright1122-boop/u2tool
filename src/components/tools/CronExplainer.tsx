'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';

type TranslateFunc = (key: string, values?: Record<string, string | number>) => string;

const monthKeys = ['', 'january', 'february', 'march', 'april', 'may', 'june', 
                   'july', 'august', 'september', 'october', 'november', 'december'];
const dayKeys = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

function parseCronExpression(cron: string, t: TranslateFunc): string {
  const parts = cron.trim().split(/\s+/);
  if (parts.length < 5 || parts.length > 6) {
    return t('invalidCronExpression') || 'Invalid cron expression. Expected 5 or 6 fields.';
  }

  const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;
  const descriptions: string[] = [];

  // Parse minute
  if (minute === '*') {
    descriptions.push(t('everyMinute'));
  } else if (minute.includes('/')) {
    const [, interval] = minute.split('/');
    descriptions.push(t('everyNMinutes', { n: interval }));
  } else if (minute.includes(',')) {
    descriptions.push(t('atMinute', { min: minute }));
  } else if (minute.includes('-')) {
    const [start, end] = minute.split('-');
    descriptions.push(t('fromMinuteToMinute', { start, end }));
  } else {
    descriptions.push(t('atMinute', { min: minute }));
  }

  // Parse hour
  if (hour === '*') {
    // Skip - implied by minute
  } else if (hour.includes('/')) {
    const [, interval] = hour.split('/');
    descriptions.push(t('everyNHours', { n: interval }));
  } else if (hour.includes('-')) {
    const [start, end] = hour.split('-');
    descriptions.push(t('fromHourToHour', { start, end }));
  } else {
    descriptions.push(t('atHour', { hr: hour }));
  }

  // Parse day of month
  if (dayOfMonth !== '*' && dayOfMonth !== '?') {
    if (dayOfMonth.includes('/')) {
      const [, interval] = dayOfMonth.split('/');
      descriptions.push(t('everyNDays', { n: interval }));
    } else if (dayOfMonth.includes('-')) {
      const [start, end] = dayOfMonth.split('-');
      descriptions.push(t('fromDayToDay', { start, end }));
    } else {
      descriptions.push(t('onDay', { day: dayOfMonth }));
    }
  }

  // Parse month
  if (month !== '*') {
    if (month.includes('-')) {
      const [start, end] = month.split('-');
      const startName = t(monthKeys[parseInt(start)] || 'january');
      const endName = t(monthKeys[parseInt(end)] || 'december');
      descriptions.push(t('fromMonthToMonth', { start: startName, end: endName }));
    } else {
      const monthName = t(monthKeys[parseInt(month)] || 'january');
      descriptions.push(t('inMonth', { month: monthName }));
    }
  }

  // Parse day of week
  if (dayOfWeek !== '*' && dayOfWeek !== '?') {
    if (dayOfWeek.includes('-')) {
      const [start, end] = dayOfWeek.split('-');
      const startName = t(dayKeys[parseInt(start)] || 'sunday');
      const endName = t(dayKeys[parseInt(end)] || 'saturday');
      descriptions.push(t('fromWeekdayToWeekday', { start: startName, end: endName }));
    } else {
      const dayName = t(dayKeys[parseInt(dayOfWeek)] || 'sunday');
      descriptions.push(t('onWeekday', { day: dayName }));
    }
  }

  return descriptions.join(', ');
}

function getNextRuns(cron: string, count: number = 5): Date[] {
  // Simplified next run calculation
  const dates: Date[] = [];
  const parts = cron.trim().split(/\s+/);
  if (parts.length < 5) return dates;

  const [minute, hour] = parts;
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const next = new Date(now);
    next.setDate(next.getDate() + i);
    
    if (minute !== '*' && !minute.includes('/')) {
      next.setMinutes(parseInt(minute) || 0);
    }
    if (hour !== '*' && !hour.includes('/')) {
      next.setHours(parseInt(hour) || 0);
    }
    next.setSeconds(0);
    
    if (next > now) {
      dates.push(next);
    }
  }
  
  return dates.slice(0, count);
}

export default function CronExplainer() {
  const t = useTranslations('tools');
  const tc = useTranslations('tools.cron-explainer');
  const [cron, setCron] = useState('0 9 * * 1-5');
  const [explanation, setExplanation] = useState('');
  const [nextRuns, setNextRuns] = useState<Date[]>([]);

  useEffect(() => {
    setExplanation(parseCronExpression(cron, tc));
    setNextRuns(getNextRuns(cron));
  }, [cron, tc]);

  const examples = [
    { cron: '* * * * *', descKey: 'everyMinute' },
    { cron: '0 * * * *', descKey: 'everyHour' },
    { cron: '0 0 * * *', descKey: 'everyDayMidnight' },
    { cron: '0 9 * * 1-5', descKey: 'weekdays9am' },
    { cron: '0 0 1 * *', descKey: 'firstDayMonth' },
    { cron: '*/15 * * * *', descKey: 'every15min' },
    { cron: '0 0 * * 0', descKey: 'everySunday' },
    { cron: '0 6,18 * * *', descKey: 'at6amAnd6pm' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">{tc('expression')}</label>
        <input
          type="text"
          value={cron}
          onChange={(e) => setCron(e.target.value)}
          className="tool-input font-mono text-lg"
          placeholder="* * * * *"
        />
      </div>

      {/* Field Labels */}
      <div className="grid grid-cols-5 gap-2 text-center text-sm">
        <div className="p-2 bg-gray-800 rounded">
          <div className="font-mono text-blue-400">{cron.split(/\s+/)[0] || '*'}</div>
          <div className="text-gray-300 text-xs mt-1">{tc('minute')}</div>
          <div className="text-gray-300 text-xs">0-59</div>
        </div>
        <div className="p-2 bg-gray-800 rounded">
          <div className="font-mono text-green-400">{cron.split(/\s+/)[1] || '*'}</div>
          <div className="text-gray-300 text-xs mt-1">{tc('hour')}</div>
          <div className="text-gray-300 text-xs">0-23</div>
        </div>
        <div className="p-2 bg-gray-800 rounded">
          <div className="font-mono text-yellow-400">{cron.split(/\s+/)[2] || '*'}</div>
          <div className="text-gray-300 text-xs mt-1">{tc('day')}</div>
          <div className="text-gray-300 text-xs">1-31</div>
        </div>
        <div className="p-2 bg-gray-800 rounded">
          <div className="font-mono text-purple-400">{cron.split(/\s+/)[3] || '*'}</div>
          <div className="text-gray-300 text-xs mt-1">{tc('month')}</div>
          <div className="text-gray-300 text-xs">1-12</div>
        </div>
        <div className="p-2 bg-gray-800 rounded">
          <div className="font-mono text-red-400">{cron.split(/\s+/)[4] || '*'}</div>
          <div className="text-gray-300 text-xs mt-1">{tc('weekday')}</div>
          <div className="text-gray-300 text-xs">0-6</div>
        </div>
      </div>

      {/* Explanation */}
      <div className="p-4 bg-blue-900/20 border border-blue-800 rounded-lg">
        <h3 className="text-sm font-medium text-blue-400 mb-2">{tc('explanation')}</h3>
        <p className="text-lg">{explanation}</p>
      </div>

      {/* Next Runs */}
      {nextRuns.length > 0 && (
        <div className="p-4 bg-gray-800 rounded-lg">
          <h3 className="text-sm font-medium mb-3">{tc('nextRuns')}</h3>
          <div className="space-y-2">
            {nextRuns.map((date, i) => (
              <div key={i} className="text-sm text-gray-300 font-mono">
                {date.toLocaleString()}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Examples */}
      <div>
        <h3 className="text-sm font-medium mb-3">{tc('examples')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {examples.map((ex, i) => (
            <button
              key={i}
              onClick={() => setCron(ex.cron)}
              className="p-3 bg-gray-800 rounded-lg text-left hover:bg-gray-700 transition-colors"
            >
              <code className="text-blue-400">{ex.cron}</code>
              <div className="text-sm text-gray-300 mt-1">{tc(ex.descKey)}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Special Characters */}
      <div className="p-4 bg-gray-800/50 rounded-lg text-sm">
        <h3 className="font-medium mb-2">{tc('specialChars')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-gray-300">
          <div><code className="text-blue-400">*</code> - {tc('anyValue')}</div>
          <div><code className="text-blue-400">,</code> - {tc('valueList')}</div>
          <div><code className="text-blue-400">-</code> - {tc('range')}</div>
          <div><code className="text-blue-400">/</code> - {tc('stepValues')}</div>
        </div>
      </div>
    </div>
  );
}
