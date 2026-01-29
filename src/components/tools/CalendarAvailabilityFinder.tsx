'use client';

import { useState, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';

interface TimeSlot {
  start: number;
  end: number;
}

interface Person {
  id: string;
  name: string;
  busySlots: TimeSlot[];
}

function parseTimeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function formatMinutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

function findAvailableSlots(people: Person[], workStart: number, workEnd: number, duration: number): TimeSlot[] {
  const allBusy: TimeSlot[] = [];
  
  people.forEach(person => {
    person.busySlots.forEach(slot => {
      allBusy.push(slot);
    });
  });
  
  allBusy.sort((a, b) => a.start - b.start);
  
  const merged: TimeSlot[] = [];
  for (const slot of allBusy) {
    if (merged.length === 0 || merged[merged.length - 1].end < slot.start) {
      merged.push({ ...slot });
    } else {
      merged[merged.length - 1].end = Math.max(merged[merged.length - 1].end, slot.end);
    }
  }
  
  const available: TimeSlot[] = [];
  let current = workStart;
  
  for (const busy of merged) {
    if (busy.start > current && busy.start - current >= duration) {
      available.push({ start: current, end: busy.start });
    }
    current = Math.max(current, busy.end);
  }
  
  if (workEnd > current && workEnd - current >= duration) {
    available.push({ start: current, end: workEnd });
  }
  
  return available;
}

export default function CalendarAvailabilityFinder() {
  const t = useTranslations('tools.calendar-availability-finder');
  const tCommon = useTranslations('tools');
  const [people, setPeople] = useState<Person[]>([
    { id: '1', name: 'Alice', busySlots: [{ start: 540, end: 600 }, { start: 780, end: 840 }] },
    { id: '2', name: 'Bob', busySlots: [{ start: 600, end: 660 }, { start: 900, end: 960 }] },
    { id: '3', name: 'Carol', busySlots: [{ start: 540, end: 570 }, { start: 720, end: 780 }] },
  ]);
  const [workStart, setWorkStart] = useState(540);
  const [workEnd, setWorkEnd] = useState(1020);
  const [duration, setDuration] = useState(30);
  const [newSlotStart, setNewSlotStart] = useState('09:00');
  const [newSlotEnd, setNewSlotEnd] = useState('10:00');
  const [selectedPerson, setSelectedPerson] = useState('');
  const [copied, setCopied] = useState(false);

  const addPerson = useCallback(() => {
    setPeople(prev => [...prev, {
      id: Date.now().toString(),
      name: `Person ${prev.length + 1}`,
      busySlots: [],
    }]);
  }, []);

  const updatePersonName = useCallback((id: string, name: string) => {
    setPeople(prev => prev.map(p => p.id === id ? { ...p, name } : p));
  }, []);

  const removePerson = useCallback((id: string) => {
    setPeople(prev => prev.filter(p => p.id !== id));
  }, []);

  const addBusySlot = useCallback(() => {
    if (!selectedPerson) return;
    const start = parseTimeToMinutes(newSlotStart);
    const end = parseTimeToMinutes(newSlotEnd);
    if (start >= end) return;
    
    setPeople(prev => prev.map(p => {
      if (p.id === selectedPerson) {
        return { ...p, busySlots: [...p.busySlots, { start, end }].sort((a, b) => a.start - b.start) };
      }
      return p;
    }));
  }, [selectedPerson, newSlotStart, newSlotEnd]);

  const removeBusySlot = useCallback((personId: string, slotIdx: number) => {
    setPeople(prev => prev.map(p => {
      if (p.id === personId) {
        return { ...p, busySlots: p.busySlots.filter((_, i) => i !== slotIdx) };
      }
      return p;
    }));
  }, []);

  const availableSlots = useMemo(() => 
    findAvailableSlots(people, workStart, workEnd, duration),
    [people, workStart, workEnd, duration]
  );

  const handleCopy = useCallback(() => {
    const text = availableSlots.map(slot => 
      `${formatMinutesToTime(slot.start)} - ${formatMinutesToTime(slot.end)}`
    ).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [availableSlots]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('workHoursStart')}</label>
          <select
            value={workStart}
            onChange={(e) => setWorkStart(parseInt(e.target.value))}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            {Array.from({ length: 24 }, (_, i) => i * 60).map(m => (
              <option key={m} value={m}>{formatMinutesToTime(m)}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('workHoursEnd')}</label>
          <select
            value={workEnd}
            onChange={(e) => setWorkEnd(parseInt(e.target.value))}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            {Array.from({ length: 24 }, (_, i) => i * 60).map(m => (
              <option key={m} value={m}>{formatMinutesToTime(m)}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('minDuration')}</label>
          <select
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            {[15, 30, 45, 60, 90, 120].map(d => (
              <option key={d} value={d}>{d} min</option>
            ))}
          </select>
        </div>
        <button onClick={addPerson} className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          {t('addPerson')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{t('participantsBusyTimes')}</h3>
          <div className="space-y-3">
            {people.map(person => (
              <div key={person.id} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="flex gap-2 items-center mb-2">
                  <input
                    type="text"
                    value={person.name}
                    onChange={(e) => updatePersonName(person.id, e.target.value)}
                    className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                  <button onClick={() => removePerson(person.id)} className="text-red-500 hover:text-red-700">✕</button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {person.busySlots.map((slot, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded">
                      {formatMinutesToTime(slot.start)} - {formatMinutesToTime(slot.end)}
                      <button onClick={() => removeBusySlot(person.id, idx)} className="hover:text-red-900">×</button>
                    </span>
                  ))}
                  {person.busySlots.length === 0 && (
                    <span className="text-xs text-gray-400">{t('noBusyTimes')}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-2">{t('addBusyTime')}</h4>
            <div className="flex flex-wrap gap-2 items-center">
              <select
                value={selectedPerson}
                onChange={(e) => setSelectedPerson(e.target.value)}
                className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="">{t('selectPerson')}</option>
                {people.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <input
                type="time"
                value={newSlotStart}
                onChange={(e) => setNewSlotStart(e.target.value)}
                className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <span className="text-gray-500">{t('to')}</span>
              <input
                type="time"
                value={newSlotEnd}
                onChange={(e) => setNewSlotEnd(e.target.value)}
                className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <button
                onClick={addBusySlot}
                disabled={!selectedPerson}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {tCommon('add')}
              </button>
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('availableSlots')} ({availableSlots.length})
            </h3>
            <button onClick={handleCopy} className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
              {copied ? tCommon('copied') : tCommon('copy')}
            </button>
          </div>
          
          {availableSlots.length > 0 ? (
            <div className="space-y-2">
              {availableSlots.map((slot, idx) => {
                const slotDuration = slot.end - slot.start;
                return (
                  <div key={idx} className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-green-700 dark:text-green-300">
                        {formatMinutesToTime(slot.start)} - {formatMinutesToTime(slot.end)}
                      </span>
                      <span className="text-sm text-green-600 dark:text-green-400">
                        {slotDuration >= 60 ? `${Math.floor(slotDuration / 60)}h ${slotDuration % 60}m` : `${slotDuration}m`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-center">
              <p className="text-yellow-700 dark:text-yellow-300">{t('noAvailableSlots')}</p>
              <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">{t('tryAdjusting')}</p>
            </div>
          )}

          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">{t('timeline')}</h4>
            <div className="relative h-8 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
              {people.map((person, pIdx) => 
                person.busySlots.map((slot, sIdx) => {
                  const left = ((slot.start - workStart) / (workEnd - workStart)) * 100;
                  const width = ((slot.end - slot.start) / (workEnd - workStart)) * 100;
                  return (
                    <div
                      key={`${pIdx}-${sIdx}`}
                      className="absolute h-full bg-red-400 dark:bg-red-600 opacity-50"
                      style={{ left: `${Math.max(0, left)}%`, width: `${Math.min(100 - left, width)}%` }}
                      title={`${person.name}: ${formatMinutesToTime(slot.start)} - ${formatMinutesToTime(slot.end)}`}
                    />
                  );
                })
              )}
              {availableSlots.map((slot, idx) => {
                const left = ((slot.start - workStart) / (workEnd - workStart)) * 100;
                const width = ((slot.end - slot.start) / (workEnd - workStart)) * 100;
                return (
                  <div
                    key={idx}
                    className="absolute h-full bg-green-400 dark:bg-green-600 opacity-70"
                    style={{ left: `${left}%`, width: `${width}%` }}
                  />
                );
              })}
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{formatMinutesToTime(workStart)}</span>
              <span>{formatMinutesToTime(workEnd)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
