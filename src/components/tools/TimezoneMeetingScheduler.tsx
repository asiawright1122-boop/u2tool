'use client';

import { useState, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';

interface Participant {
  id: string;
  name: string;
  timezone: string;
  workStart: number;
  workEnd: number;
}

const TIMEZONES = [
  { value: 'America/Los_Angeles', label: 'Los Angeles (PST/PDT)', offset: -8 },
  { value: 'America/Denver', label: 'Denver (MST/MDT)', offset: -7 },
  { value: 'America/Chicago', label: 'Chicago (CST/CDT)', offset: -6 },
  { value: 'America/New_York', label: 'New York (EST/EDT)', offset: -5 },
  { value: 'America/Sao_Paulo', label: 'São Paulo (BRT)', offset: -3 },
  { value: 'Europe/London', label: 'London (GMT/BST)', offset: 0 },
  { value: 'Europe/Paris', label: 'Paris (CET/CEST)', offset: 1 },
  { value: 'Europe/Berlin', label: 'Berlin (CET/CEST)', offset: 1 },
  { value: 'Asia/Dubai', label: 'Dubai (GST)', offset: 4 },
  { value: 'Asia/Kolkata', label: 'Mumbai (IST)', offset: 5.5 },
  { value: 'Asia/Singapore', label: 'Singapore (SGT)', offset: 8 },
  { value: 'Asia/Shanghai', label: 'Shanghai (CST)', offset: 8 },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)', offset: 9 },
  { value: 'Australia/Sydney', label: 'Sydney (AEST/AEDT)', offset: 10 },
];

function getOffset(timezone: string): number {
  const tz = TIMEZONES.find(t => t.value === timezone);
  return tz?.offset || 0;
}

function convertTime(hour: number, fromTz: string, toTz: string): number {
  const fromOffset = getOffset(fromTz);
  const toOffset = getOffset(toTz);
  let converted = hour - fromOffset + toOffset;
  if (converted < 0) converted += 24;
  if (converted >= 24) converted -= 24;
  return converted;
}

function formatHour(hour: number): string {
  const h = Math.floor(hour);
  const m = Math.round((hour - h) * 60);
  const period = h >= 12 ? 'PM' : 'AM';
  const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${displayHour}:${m.toString().padStart(2, '0')} ${period}`;
}

function isWorkingHour(hour: number, workStart: number, workEnd: number): boolean {
  if (workStart <= workEnd) {
    return hour >= workStart && hour < workEnd;
  }
  return hour >= workStart || hour < workEnd;
}

export default function TimezoneMeetingScheduler() {
  const t = useTranslations('tools.timezone-meeting-scheduler');
  const tCommon = useTranslations('tools');
  const [participants, setParticipants] = useState<Participant[]>([
    { id: '1', name: 'Alice', timezone: 'America/New_York', workStart: 9, workEnd: 17 },
    { id: '2', name: 'Bob', timezone: 'Europe/London', workStart: 9, workEnd: 17 },
    { id: '3', name: 'Carol', timezone: 'Asia/Tokyo', workStart: 9, workEnd: 18 },
  ]);
  const [baseTimezone, setBaseTimezone] = useState('America/New_York');
  const [meetingDuration, setMeetingDuration] = useState(1);
  const [copied, setCopied] = useState(false);

  const addParticipant = useCallback(() => {
    setParticipants(prev => [...prev, {
      id: Date.now().toString(),
      name: `Person ${prev.length + 1}`,
      timezone: 'America/New_York',
      workStart: 9,
      workEnd: 17,
    }]);
  }, []);

  const updateParticipant = useCallback((id: string, field: keyof Participant, value: string | number) => {
    setParticipants(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  }, []);

  const removeParticipant = useCallback((id: string) => {
    setParticipants(prev => prev.filter(p => p.id !== id));
  }, []);

  const availableSlots = useMemo(() => {
    const slots: { hour: number; score: number; times: { name: string; time: string; isWorking: boolean }[] }[] = [];
    
    for (let hour = 0; hour < 24; hour++) {
      let score = 0;
      const times = participants.map(p => {
        const localHour = convertTime(hour, baseTimezone, p.timezone);
        const isWorking = isWorkingHour(localHour, p.workStart, p.workEnd);
        if (isWorking) score += 2;
        else if (localHour >= 7 && localHour <= 22) score += 1;
        return { name: p.name, time: formatHour(localHour), isWorking };
      });
      
      slots.push({ hour, score, times });
    }
    
    return slots.sort((a, b) => b.score - a.score);
  }, [participants, baseTimezone]);

  const bestSlots = availableSlots.slice(0, 5);

  const handleCopy = useCallback(() => {
    const best = bestSlots[0];
    if (!best) return;
    const text = `Best meeting time: ${formatHour(best.hour)} (${TIMEZONES.find(t => t.value === baseTimezone)?.label})\n\nLocal times:\n${best.times.map(t => `${t.name}: ${t.time}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [bestSlots, baseTimezone]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('baseTimezone')}</label>
          <select
            value={baseTimezone}
            onChange={(e) => setBaseTimezone(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            {TIMEZONES.map(tz => (
              <option key={tz.value} value={tz.value}>{tz.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('duration')}</label>
          <select
            value={meetingDuration}
            onChange={(e) => setMeetingDuration(parseFloat(e.target.value))}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value={0.5}>30 min</option>
            <option value={1}>1 hour</option>
            <option value={1.5}>1.5 hours</option>
            <option value={2}>2 hours</option>
          </select>
        </div>
        <button onClick={addParticipant} className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          {t('addParticipant')}
        </button>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('participants')}</h3>
        {participants.map(p => (
          <div key={p.id} className="flex flex-wrap gap-2 items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <input
              type="text"
              value={p.name}
              onChange={(e) => updateParticipant(p.id, 'name', e.target.value)}
              className="w-28 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            <select
              value={p.timezone}
              onChange={(e) => updateParticipant(p.id, 'timezone', e.target.value)}
              className="flex-1 min-w-48 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              {TIMEZONES.map(tz => (
                <option key={tz.value} value={tz.value}>{tz.label}</option>
              ))}
            </select>
            <span className="text-xs text-gray-500">{t('work')}:</span>
            <select
              value={p.workStart}
              onChange={(e) => updateParticipant(p.id, 'workStart', parseInt(e.target.value))}
              className="w-20 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={i}>{formatHour(i)}</option>
              ))}
            </select>
            <span className="text-xs text-gray-500">to</span>
            <select
              value={p.workEnd}
              onChange={(e) => updateParticipant(p.id, 'workEnd', parseInt(e.target.value))}
              className="w-20 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={i}>{formatHour(i)}</option>
              ))}
            </select>
            <button onClick={() => removeParticipant(p.id)} className="text-red-500 hover:text-red-700">✕</button>
          </div>
        ))}
      </div>

      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('bestMeetingTimes')}</h3>
          <button onClick={handleCopy} className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
            {copied ? tCommon('copied') : t('copyBestTime')}
          </button>
        </div>
        <div className="space-y-2">
          {bestSlots.map((slot, idx) => {
            const allWorking = slot.times.every(t => t.isWorking);
            return (
              <div key={slot.hour} className={`p-3 rounded-lg border ${
                idx === 0 ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' :
                allWorking ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' :
                'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700'
              }`}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatHour(slot.hour)} ({TIMEZONES.find(tz => tz.value === baseTimezone)?.label.split(' ')[0]})
                  </span>
                  {idx === 0 && <span className="text-xs px-2 py-0.5 bg-green-500 text-white rounded">{t('best')}</span>}
                  {allWorking && idx !== 0 && <span className="text-xs px-2 py-0.5 bg-blue-500 text-white rounded">{t('allWorking')}</span>}
                </div>
                <div className="flex flex-wrap gap-3 text-sm">
                  {slot.times.map(time => (
                    <span key={time.name} className={time.isWorking ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}>
                      {time.name}: {time.time} {time.isWorking ? '✓' : ''}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
