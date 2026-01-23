'use client';

import { useState, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';

interface CronField {
  values: number[];
  all: boolean;
}

interface ParsedCron {
  minute: CronField;
  hour: CronField;
  dayOfMonth: CronField;
  month: CronField;
  dayOfWeek: CronField;
}

// Parse a single cron field
function parseField(field: string, min: number, max: number): CronField {
  if (field === '*') {
    return { values: [], all: true };
  }

  const values: Set<number> = new Set();
  const parts = field.split(',');

  for (const part of parts) {
    // Handle step values (*/2, 1-10/2)
    if (part.includes('/')) {
      const [range, stepStr] = part.split('/');
      const step = parseInt(stepStr, 10);
      let start = min;
      let end = max;

      if (range !== '*') {
        if (range.includes('-')) {
          [start, end] = range.split('-').map(n => parseInt(n, 10));
        } else {
          start = parseInt(range, 10);
        }
      }

      for (let i = start; i <= end; i += step) {
        values.add(i);
      }
    }
    // Handle ranges (1-5)
    else if (part.includes('-')) {
      const [start, end] = part.split('-').map(n => parseInt(n, 10));
      for (let i = start; i <= end; i++) {
        values.add(i);
      }
    }
    // Handle single values
    else {
      values.add(parseInt(part, 10));
    }
  }

  return { values: Array.from(values).sort((a, b) => a - b), all: false };
}

// Parse cron expression
function parseCron(expression: string): ParsedCron | null {
  const parts = expression.trim().split(/\s+/);
  
  if (parts.length !== 5 && parts.length !== 6) {
    return null;
  }

  // Skip seconds field if 6 parts
  const offset = parts.length === 6 ? 1 : 0;

  try {
    return {
      minute: parseField(parts[offset], 0, 59),
      hour: parseField(parts[offset + 1], 0, 23),
      dayOfMonth: parseField(parts[offset + 2], 1, 31),
      month: parseField(parts[offset + 3], 1, 12),
      dayOfWeek: parseField(parts[offset + 4], 0, 6),
    };
  } catch {
    return null;
  }
}

// Check if a date matches the cron expression
function matchesCron(date: Date, cron: ParsedCron): boolean {
  const minute = date.getMinutes();
  const hour = date.getHours();
  const dayOfMonth = date.getDate();
  const month = date.getMonth() + 1;
  const dayOfWeek = date.getDay();

  const matchMinute = cron.minute.all || cron.minute.values.includes(minute);
  const matchHour = cron.hour.all || cron.hour.values.includes(hour);
  const matchDayOfMonth = cron.dayOfMonth.all || cron.dayOfMonth.values.includes(dayOfMonth);
  const matchMonth = cron.month.all || cron.month.values.includes(month);
  const matchDayOfWeek = cron.dayOfWeek.all || cron.dayOfWeek.values.includes(dayOfWeek);

  return matchMinute && matchHour && matchDayOfMonth && matchMonth && matchDayOfWeek;
}

// Get next N execution times
function getNextRuns(cron: ParsedCron, count: number, from: Date = new Date()): Date[] {
  const runs: Date[] = [];
  const current = new Date(from);
  current.setSeconds(0);
  current.setMilliseconds(0);
  
  // Start from next minute
  current.setMinutes(current.getMinutes() + 1);

  const maxIterations = 365 * 24 * 60; // Max 1 year of minutes
  let iterations = 0;

  while (runs.length < count && iterations < maxIterations) {
    if (matchesCron(current, cron)) {
      runs.push(new Date(current));
    }
    current.setMinutes(current.getMinutes() + 1);
    iterations++;
  }

  return runs;
}

// Get runs for a specific month
function getMonthRuns(cron: ParsedCron, year: number, month: number): Date[] {
  const runs: Date[] = [];
  const start = new Date(year, month, 1, 0, 0, 0);
  const end = new Date(year, month + 1, 0, 23, 59, 59);
  
  const current = new Date(start);
  
  while (current <= end) {
    if (matchesCron(current, cron)) {
      runs.push(new Date(current));
    }
    current.setMinutes(current.getMinutes() + 1);
  }

  return runs;
}

export default function CrontabCalendar() {
  const t = useTranslations('tools.crontab-calendar');
  const tg = useTranslations('tools');
  
  const [expression, setExpression] = useState('');
  const [parsedCron, setParsedCron] = useState<ParsedCron | null>(null);
  const [error, setError] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  const handleParse = useCallback(() => {
    if (!expression.trim()) {
      setParsedCron(null);
      setError('');
      return;
    }

    const parsed = parseCron(expression);
    if (parsed) {
      setParsedCron(parsed);
      setError('');
    } else {
      setParsedCron(null);
      setError(t('invalidCron'));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expression]);

  const handleClear = () => {
    setExpression('');
    setParsedCron(null);
    setError('');
  };

  const nextRuns = useMemo(() => {
    if (!parsedCron) return [];
    return getNextRuns(parsedCron, 10);
  }, [parsedCron]);

  const monthRuns = useMemo(() => {
    if (!parsedCron) return new Set<number>();
    const runs = getMonthRuns(parsedCron, selectedMonth.getFullYear(), selectedMonth.getMonth());
    return new Set(runs.map(d => d.getDate()));
  }, [parsedCron, selectedMonth]);

  // Calendar helpers
  const daysInMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1).getDay();
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === selectedMonth.getFullYear() && today.getMonth() === selectedMonth.getMonth();

  const prevMonth = () => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 1));
  };

  const formatDate = (date: Date) => {
    return date.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-4">
      {/* Expression Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('expression')}
        </label>
        <input
          type="text"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-mono"
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          placeholder={t('expressionPlaceholder')}
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {t('formatHint')}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <button onClick={handleParse} className="btn-primary">
          {t('parse')}
        </button>
        <button onClick={handleClear} className="btn-secondary">
          {tg('clear')}
        </button>
      </div>

      {/* Error Section */}
      {error && (
        <div className="tool-error">
          {error}
        </div>
      )}

      {/* Results */}
      {parsedCron && (
        <>
          {/* View Mode Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {t('listView')}
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'calendar'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {t('calendarView')}
            </button>
          </div>

          {/* List View */}
          {viewMode === 'list' && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('nextRuns')}
              </h3>
              <div className="space-y-2">
                {nextRuns.map((run, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center gap-3"
                  >
                    <span className="w-6 h-6 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium">
                      {index + 1}
                    </span>
                    <span className="font-mono text-gray-900 dark:text-gray-100">
                      {formatDate(run)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Calendar View */}
          {viewMode === 'calendar' && (
            <div>
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={prevMonth}
                  className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
                >
                  {t('prevMonth')}
                </button>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  {selectedMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h3>
                <button
                  onClick={nextMonth}
                  className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
                >
                  {t('nextMonth')}
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {/* Day headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                    {day}
                  </div>
                ))}
                
                {/* Empty cells for days before first of month */}
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                  <div key={`empty-${i}`} className="p-2" />
                ))}
                
                {/* Days of month */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const hasRun = monthRuns.has(day);
                  const isToday = isCurrentMonth && today.getDate() === day;
                  
                  return (
                    <div
                      key={day}
                      className={`p-2 text-center rounded-lg ${
                        hasRun
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium'
                          : 'text-gray-700 dark:text-gray-300'
                      } ${
                        isToday ? 'ring-2 ring-blue-500' : ''
                      }`}
                    >
                      {day}
                      {hasRun && (
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mx-auto mt-1" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="mt-4 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-100 dark:bg-blue-900/30 rounded" />
                  <span>{t('scheduledRun')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-blue-500 rounded" />
                  <span>{t('today')}</span>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
