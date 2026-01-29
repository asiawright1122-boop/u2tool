'use client';

import { useState, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';

interface AgendaItem {
  id: string;
  topic: string;
  duration: number;
  presenter: string;
  notes: string;
}

interface MeetingInfo {
  title: string;
  date: string;
  startTime: string;
  location: string;
  organizer: string;
  objective: string;
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

function calculateEndTime(startTime: string, durationMinutes: number): string {
  const [hours, minutes] = startTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + durationMinutes;
  const endHours = Math.floor(totalMinutes / 60) % 24;
  const endMinutes = totalMinutes % 60;
  return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
}

function generateAgenda(info: MeetingInfo, items: AgendaItem[], format: 'markdown' | 'text' | 'html'): string {
  const totalDuration = items.reduce((sum, item) => sum + item.duration, 0);
  const endTime = calculateEndTime(info.startTime, totalDuration);
  
  if (format === 'markdown') {
    let md = `# ${info.title}\n\n`;
    md += `**Date:** ${info.date}  \n`;
    md += `**Time:** ${info.startTime} - ${endTime} (${formatDuration(totalDuration)})  \n`;
    md += `**Location:** ${info.location}  \n`;
    md += `**Organizer:** ${info.organizer}\n\n`;
    if (info.objective) md += `**Objective:** ${info.objective}\n\n`;
    md += `## Agenda\n\n`;
    md += `| Time | Topic | Duration | Presenter |\n`;
    md += `|------|-------|----------|----------|\n`;
    let currentTime = info.startTime;
    items.forEach(item => {
      md += `| ${currentTime} | ${item.topic} | ${formatDuration(item.duration)} | ${item.presenter || '-'} |\n`;
      currentTime = calculateEndTime(currentTime, item.duration);
    });
    return md;
  } else if (format === 'html') {
    let html = `<h1>${info.title}</h1>\n`;
    html += `<p><strong>Date:</strong> ${info.date}<br>\n`;
    html += `<strong>Time:</strong> ${info.startTime} - ${endTime} (${formatDuration(totalDuration)})<br>\n`;
    html += `<strong>Location:</strong> ${info.location}<br>\n`;
    html += `<strong>Organizer:</strong> ${info.organizer}</p>\n`;
    if (info.objective) html += `<p><strong>Objective:</strong> ${info.objective}</p>\n`;
    html += `<h2>Agenda</h2>\n`;
    html += `<table border="1"><tr><th>Time</th><th>Topic</th><th>Duration</th><th>Presenter</th></tr>\n`;
    let currentTime = info.startTime;
    items.forEach(item => {
      html += `<tr><td>${currentTime}</td><td>${item.topic}</td><td>${formatDuration(item.duration)}</td><td>${item.presenter || '-'}</td></tr>\n`;
      currentTime = calculateEndTime(currentTime, item.duration);
    });
    html += `</table>`;
    return html;
  } else {
    let text = `${info.title.toUpperCase()}\n${'='.repeat(50)}\n\n`;
    text += `Date: ${info.date}\n`;
    text += `Time: ${info.startTime} - ${endTime} (${formatDuration(totalDuration)})\n`;
    text += `Location: ${info.location}\n`;
    text += `Organizer: ${info.organizer}\n`;
    if (info.objective) text += `Objective: ${info.objective}\n`;
    text += `\nAGENDA\n${'-'.repeat(50)}\n\n`;
    let currentTime = info.startTime;
    items.forEach((item, idx) => {
      text += `${idx + 1}. [${currentTime}] ${item.topic}\n`;
      text += `   Duration: ${formatDuration(item.duration)}`;
      if (item.presenter) text += ` | Presenter: ${item.presenter}`;
      text += '\n';
      if (item.notes) text += `   Notes: ${item.notes}\n`;
      text += '\n';
      currentTime = calculateEndTime(currentTime, item.duration);
    });
    return text;
  }
}

export default function MeetingAgendaBuilder() {
  const t = useTranslations('tools.meeting-agenda-builder');
  const tCommon = useTranslations('tools');
  const [info, setInfo] = useState<MeetingInfo>({
    title: 'Weekly Team Meeting',
    date: new Date().toISOString().split('T')[0],
    startTime: '10:00',
    location: 'Conference Room A',
    organizer: '',
    objective: 'Review progress and plan next week',
  });
  const [items, setItems] = useState<AgendaItem[]>([
    { id: '1', topic: 'Welcome & Introductions', duration: 5, presenter: '', notes: '' },
    { id: '2', topic: 'Review Action Items', duration: 10, presenter: '', notes: '' },
    { id: '3', topic: 'Project Updates', duration: 20, presenter: '', notes: '' },
    { id: '4', topic: 'Discussion & Q&A', duration: 15, presenter: '', notes: '' },
    { id: '5', topic: 'Next Steps & Wrap-up', duration: 10, presenter: '', notes: '' },
  ]);
  const [format, setFormat] = useState<'markdown' | 'text' | 'html'>('markdown');
  const [copied, setCopied] = useState(false);

  const updateInfo = useCallback(<K extends keyof MeetingInfo>(key: K, value: MeetingInfo[K]) => {
    setInfo(prev => ({ ...prev, [key]: value }));
  }, []);

  const addItem = useCallback(() => {
    setItems(prev => [...prev, {
      id: Date.now().toString(),
      topic: 'New Topic',
      duration: 10,
      presenter: '',
      notes: '',
    }]);
  }, []);

  const updateItem = useCallback((id: string, field: keyof AgendaItem, value: string | number) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const moveItem = useCallback((id: string, direction: 'up' | 'down') => {
    setItems(prev => {
      const idx = prev.findIndex(item => item.id === id);
      if (idx === -1) return prev;
      if (direction === 'up' && idx === 0) return prev;
      if (direction === 'down' && idx === prev.length - 1) return prev;
      const newItems = [...prev];
      const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
      [newItems[idx], newItems[swapIdx]] = [newItems[swapIdx], newItems[idx]];
      return newItems;
    });
  }, []);

  const totalDuration = useMemo(() => items.reduce((sum, item) => sum + item.duration, 0), [items]);
  const output = useMemo(() => generateAgenda(info, items, format), [info, items, format]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('meetingTitle')}</label>
          <input
            type="text"
            value={info.title}
            onChange={(e) => updateInfo('title', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('date')}</label>
          <input
            type="date"
            value={info.date}
            onChange={(e) => updateInfo('date', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('time')}</label>
          <input
            type="time"
            value={info.startTime}
            onChange={(e) => updateInfo('startTime', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('location')}</label>
          <input
            type="text"
            value={info.location}
            onChange={(e) => updateInfo('location', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('objectives')}</label>
          <input
            type="text"
            value={info.objective}
            onChange={(e) => updateInfo('objective', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('agendaItems')} ({formatDuration(totalDuration)} {t('totalDuration')})
          </h3>
          <button onClick={addItem} className="text-xs px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700">
            {t('addItem')}
          </button>
        </div>
        <div className="space-y-2">
          {items.map((item, idx) => (
            <div key={item.id} className="flex gap-2 items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="flex flex-col gap-1">
                <button onClick={() => moveItem(item.id, 'up')} disabled={idx === 0} className="text-gray-400 hover:text-gray-600 disabled:opacity-30">↑</button>
                <button onClick={() => moveItem(item.id, 'down')} disabled={idx === items.length - 1} className="text-gray-400 hover:text-gray-600 disabled:opacity-30">↓</button>
              </div>
              <span className="text-sm text-gray-500 w-6">{idx + 1}.</span>
              <input
                type="text"
                value={item.topic}
                onChange={(e) => updateItem(item.id, 'topic', e.target.value)}
                placeholder={t("topicPlaceholder")}
                className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <select
                value={item.duration}
                onChange={(e) => updateItem(item.id, 'duration', parseInt(e.target.value))}
                className="w-24 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                {[5, 10, 15, 20, 30, 45, 60, 90].map(d => (
                  <option key={d} value={d}>{formatDuration(d)}</option>
                ))}
              </select>
              <input
                type="text"
                value={item.presenter}
                onChange={(e) => updateItem(item.id, 'presenter', e.target.value)}
                placeholder={t("presenterPlaceholder")}
                className="w-28 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700">✕</button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <div className="flex gap-2">
            {(['markdown', 'text', 'html'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFormat(f)}
                className={`px-3 py-1 text-sm rounded ${format === f ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
              >
                {f.toUpperCase()}
              </button>
            ))}
          </div>
          <button onClick={handleCopy} className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
            {copied ? tCommon('copied') : tCommon('copy')}
          </button>
        </div>
        <pre className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-auto text-sm font-mono text-gray-800 dark:text-gray-200 max-h-64 whitespace-pre-wrap">
          {output}
        </pre>
      </div>
    </div>
  );
}
