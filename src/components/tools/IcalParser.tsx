'use client';

import { useState, useCallback, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { parseICal, type ICalEvent } from '@/lib/ical-parser';

export default function IcalParser() {
  const t = useTranslations('tools.ical-parser');
  const tg = useTranslations('tools');
  const [input, setInput] = useState('');
  const [events, setEvents] = useState<ICalEvent[]>([]);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parse = useCallback(() => {
    if (!input.trim()) {
      setEvents([]);
      setError('');
      return;
    }

    try {
      const result = parseICal(input);
      setEvents(result.events);
      setError('');
    } catch (e) {
      setError((e as Error).message);
      setEvents([]);
    }
  }, [input]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setInput(content);
    };
    reader.readAsText(file);
  };

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return '-';
    return date.toLocaleString();
  };

  const exportToJSON = () => {
    const json = JSON.stringify(events, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'events.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button onClick={parse} className="btn-primary">
          {t('parse')}
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="btn-secondary"
        >
          {t('uploadFile')}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".ics,.ical"
          onChange={handleFileUpload}
          className="hidden"
        />
        {events.length > 0 && (
          <button onClick={exportToJSON} className="btn-secondary">
            {t('exportJSON')}
          </button>
        )}
        <button onClick={() => { setInput(''); setEvents([]); setError(''); }} className="btn-secondary">
          {tg('clear')}
        </button>
      </div>

      <div>
        <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">{t('icsContent')}</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
          placeholder={t('inputPlaceholder')}
        />
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg p-3 text-sm">
          {error}
        </div>
      )}

      {events.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium text-gray-700 dark:text-gray-300">
            {t('foundEvents')}: {events.length}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="text-left p-2">{t('summary')}</th>
                  <th className="text-left p-2">{t('start')}</th>
                  <th className="text-left p-2">{t('end')}</th>
                  <th className="text-left p-2">{t('location')}</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event, index) => (
                  <tr key={index} className="border-b border-gray-200 dark:border-gray-600">
                    <td className="p-2">{event.summary || '-'}</td>
                    <td className="p-2 whitespace-nowrap">{formatDate(event.dtstart)}</td>
                    <td className="p-2 whitespace-nowrap">{formatDate(event.dtend)}</td>
                    <td className="p-2">{event.location || '-'}</td>
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
