'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface ClockCity {
  id: string;
  name: string;
  timezone: string;
  offset: string;
}

const DEFAULT_CITIES: ClockCity[] = [
  { id: '1', name: 'New York', timezone: 'America/New_York', offset: 'UTC-5' },
  { id: '2', name: 'London', timezone: 'Europe/London', offset: 'UTC+0' },
  { id: '3', name: 'Tokyo', timezone: 'Asia/Tokyo', offset: 'UTC+9' },
  { id: '4', name: 'Sydney', timezone: 'Australia/Sydney', offset: 'UTC+11' },
];

const AVAILABLE_TIMEZONES = [
  { name: 'New York', timezone: 'America/New_York' },
  { name: 'Los Angeles', timezone: 'America/Los_Angeles' },
  { name: 'Chicago', timezone: 'America/Chicago' },
  { name: 'London', timezone: 'Europe/London' },
  { name: 'Paris', timezone: 'Europe/Paris' },
  { name: 'Berlin', timezone: 'Europe/Berlin' },
  { name: 'Moscow', timezone: 'Europe/Moscow' },
  { name: 'Dubai', timezone: 'Asia/Dubai' },
  { name: 'Mumbai', timezone: 'Asia/Kolkata' },
  { name: 'Singapore', timezone: 'Asia/Singapore' },
  { name: 'Hong Kong', timezone: 'Asia/Hong_Kong' },
  { name: 'Shanghai', timezone: 'Asia/Shanghai' },
  { name: 'Tokyo', timezone: 'Asia/Tokyo' },
  { name: 'Seoul', timezone: 'Asia/Seoul' },
  { name: 'Sydney', timezone: 'Australia/Sydney' },
  { name: 'Auckland', timezone: 'Pacific/Auckland' },
  { name: 'São Paulo', timezone: 'America/Sao_Paulo' },
  { name: 'Mexico City', timezone: 'America/Mexico_City' },
  { name: 'Cairo', timezone: 'Africa/Cairo' },
  { name: 'Johannesburg', timezone: 'Africa/Johannesburg' },
];

export default function WorldClock() {
  const t = useTranslations('tools');
  const [cities, setCities] = useState<ClockCity[]>(DEFAULT_CITIES);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [is24Hour, setIs24Hour] = useState(true);
  const [showSeconds, setShowSeconds] = useState(true);
  const [selectedTimezone, setSelectedTimezone] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (timezone: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        ...(showSeconds && { second: '2-digit' }),
        hour12: !is24Hour,
      };
      return currentTime.toLocaleTimeString('en-US', options);
    } catch {
      return '--:--:--';
    }
  };

  const formatDate = (timezone: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: timezone,
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      };
      return currentTime.toLocaleDateString('en-US', options);
    } catch {
      return '---';
    }
  };

  const getTimezoneOffset = (timezone: string) => {
    try {
      const date = new Date();
      const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
      const tzDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
      const offset = (tzDate.getTime() - utcDate.getTime()) / (1000 * 60 * 60);
      const sign = offset >= 0 ? '+' : '';
      return `UTC${sign}${offset}`;
    } catch {
      return 'UTC';
    }
  };

  const addCity = () => {
    if (!selectedTimezone) return;
    const tz = AVAILABLE_TIMEZONES.find(t => t.timezone === selectedTimezone);
    if (!tz) return;
    if (cities.some(c => c.timezone === selectedTimezone)) return;
    
    const newCity: ClockCity = {
      id: Date.now().toString(),
      name: tz.name,
      timezone: tz.timezone,
      offset: getTimezoneOffset(tz.timezone),
    };
    setCities([...cities, newCity]);
    setSelectedTimezone('');
  };

  const removeCity = (id: string) => {
    setCities(cities.filter(c => c.id !== id));
  };

  const isDaytime = (timezone: string) => {
    try {
      const hour = parseInt(currentTime.toLocaleTimeString('en-US', { timeZone: timezone, hour: '2-digit', hour12: false }));
      return hour >= 6 && hour < 18;
    } catch {
      return true;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={is24Hour}
              onChange={(e) => setIs24Hour(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">{t('worldClock.format24h')}</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showSeconds}
              onChange={(e) => setShowSeconds(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">{t('worldClock.showSeconds')}</span>
          </label>
        </div>
      </div>

      <div className="flex gap-2">
        <select
          value={selectedTimezone}
          onChange={(e) => setSelectedTimezone(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
        >
          <option value="">{t('worldClock.selectCity')}</option>
          {AVAILABLE_TIMEZONES.filter(tz => !cities.some(c => c.timezone === tz.timezone)).map(tz => (
            <option key={tz.timezone} value={tz.timezone}>{tz.name}</option>
          ))}
        </select>
        <button
          onClick={addCity}
          disabled={!selectedTimezone}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {t('worldClock.addCity')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cities.map(city => (
          <div
            key={city.id}
            className={`relative p-4 rounded-xl border ${
              isDaytime(city.timezone)
                ? 'bg-gradient-to-br from-blue-50 to-yellow-50 dark:from-blue-900/20 dark:to-yellow-900/20 border-blue-200 dark:border-blue-800'
                : 'bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-200 dark:border-indigo-800'
            }`}
          >
            <button
              onClick={() => removeCity(city.id)}
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-lg"
            >
              ×
            </button>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{isDaytime(city.timezone) ? '☀️' : '🌙'}</span>
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">{city.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{getTimezoneOffset(city.timezone)}</p>
              </div>
            </div>
            <div className="text-3xl font-mono font-bold text-gray-900 dark:text-white">
              {formatTime(city.timezone)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {formatDate(city.timezone)}
            </div>
          </div>
        ))}
      </div>

      {cities.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          {t('worldClock.noCities')}
        </div>
      )}
    </div>
  );
}
