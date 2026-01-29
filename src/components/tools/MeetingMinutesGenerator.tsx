'use client';

import { useState, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';

interface ActionItem {
  id: string;
  task: string;
  assignee: string;
  dueDate: string;
}

interface MeetingData {
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: string;
  absentees: string;
  agenda: string;
  discussion: string;
  decisions: string;
  actionItems: ActionItem[];
  nextMeeting: string;
}

function generateMinutes(data: MeetingData, format: 'markdown' | 'text' | 'html'): string {
  const attendeeList = data.attendees.split(',').map(a => a.trim()).filter(Boolean);
  const absenteeList = data.absentees.split(',').map(a => a.trim()).filter(Boolean);
  
  if (format === 'markdown') {
    let md = `# Meeting Minutes: ${data.title}\n\n`;
    md += `**Date:** ${data.date}  \n`;
    md += `**Time:** ${data.time}  \n`;
    md += `**Location:** ${data.location}\n\n`;
    md += `## Attendees\n${attendeeList.map(a => `- ${a}`).join('\n')}\n\n`;
    if (absenteeList.length > 0) {
      md += `## Absent\n${absenteeList.map(a => `- ${a}`).join('\n')}\n\n`;
    }
    md += `## Agenda\n${data.agenda}\n\n`;
    md += `## Discussion\n${data.discussion}\n\n`;
    md += `## Decisions\n${data.decisions}\n\n`;
    if (data.actionItems.length > 0) {
      md += `## Action Items\n`;
      md += `| Task | Assignee | Due Date |\n`;
      md += `|------|----------|----------|\n`;
      data.actionItems.forEach(item => {
        md += `| ${item.task} | ${item.assignee} | ${item.dueDate} |\n`;
      });
      md += '\n';
    }
    if (data.nextMeeting) {
      md += `## Next Meeting\n${data.nextMeeting}\n`;
    }
    return md;
  } else if (format === 'html') {
    let html = `<h1>Meeting Minutes: ${data.title}</h1>\n`;
    html += `<p><strong>Date:</strong> ${data.date}<br>\n`;
    html += `<strong>Time:</strong> ${data.time}<br>\n`;
    html += `<strong>Location:</strong> ${data.location}</p>\n`;
    html += `<h2>Attendees</h2>\n<ul>${attendeeList.map(a => `<li>${a}</li>`).join('')}</ul>\n`;
    if (absenteeList.length > 0) {
      html += `<h2>Absent</h2>\n<ul>${absenteeList.map(a => `<li>${a}</li>`).join('')}</ul>\n`;
    }
    html += `<h2>Agenda</h2>\n<p>${data.agenda.replace(/\n/g, '<br>')}</p>\n`;
    html += `<h2>Discussion</h2>\n<p>${data.discussion.replace(/\n/g, '<br>')}</p>\n`;
    html += `<h2>Decisions</h2>\n<p>${data.decisions.replace(/\n/g, '<br>')}</p>\n`;
    if (data.actionItems.length > 0) {
      html += `<h2>Action Items</h2>\n<table border="1"><tr><th>Task</th><th>Assignee</th><th>Due Date</th></tr>`;
      data.actionItems.forEach(item => {
        html += `<tr><td>${item.task}</td><td>${item.assignee}</td><td>${item.dueDate}</td></tr>`;
      });
      html += `</table>\n`;
    }
    if (data.nextMeeting) {
      html += `<h2>Next Meeting</h2>\n<p>${data.nextMeeting}</p>\n`;
    }
    return html;
  } else {
    let text = `MEETING MINUTES: ${data.title.toUpperCase()}\n`;
    text += `${'='.repeat(50)}\n\n`;
    text += `Date: ${data.date}\n`;
    text += `Time: ${data.time}\n`;
    text += `Location: ${data.location}\n\n`;
    text += `ATTENDEES:\n${attendeeList.map(a => `  • ${a}`).join('\n')}\n\n`;
    if (absenteeList.length > 0) {
      text += `ABSENT:\n${absenteeList.map(a => `  • ${a}`).join('\n')}\n\n`;
    }
    text += `AGENDA:\n${data.agenda}\n\n`;
    text += `DISCUSSION:\n${data.discussion}\n\n`;
    text += `DECISIONS:\n${data.decisions}\n\n`;
    if (data.actionItems.length > 0) {
      text += `ACTION ITEMS:\n`;
      data.actionItems.forEach((item, idx) => {
        text += `  ${idx + 1}. ${item.task}\n     Assignee: ${item.assignee} | Due: ${item.dueDate}\n`;
      });
      text += '\n';
    }
    if (data.nextMeeting) {
      text += `NEXT MEETING:\n${data.nextMeeting}\n`;
    }
    return text;
  }
}

export default function MeetingMinutesGenerator() {
  const t = useTranslations('tools.meeting-minutes-generator');
  const tCommon = useTranslations('tools');
  const [data, setData] = useState<MeetingData>({
    title: 'Weekly Team Standup',
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM',
    location: 'Conference Room A / Zoom',
    attendees: 'Alice, Bob, Carol, David',
    absentees: '',
    agenda: '1. Project status updates\n2. Blockers discussion\n3. Sprint planning',
    discussion: '',
    decisions: '',
    actionItems: [],
    nextMeeting: '',
  });
  const [format, setFormat] = useState<'markdown' | 'text' | 'html'>('markdown');
  const [copied, setCopied] = useState(false);

  const updateData = useCallback(<K extends keyof MeetingData>(key: K, value: MeetingData[K]) => {
    setData(prev => ({ ...prev, [key]: value }));
  }, []);

  const addActionItem = useCallback(() => {
    setData(prev => ({
      ...prev,
      actionItems: [...prev.actionItems, {
        id: Date.now().toString(),
        task: '',
        assignee: '',
        dueDate: '',
      }],
    }));
  }, []);

  const updateActionItem = useCallback((id: string, field: keyof ActionItem, value: string) => {
    setData(prev => ({
      ...prev,
      actionItems: prev.actionItems.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  }, []);

  const removeActionItem = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      actionItems: prev.actionItems.filter(item => item.id !== id),
    }));
  }, []);

  const output = useMemo(() => generateMinutes(data, format), [data, format]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('meetingTitle')}</label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => updateData('title', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('date')}</label>
            <input
              type="date"
              value={data.date}
              onChange={(e) => updateData('date', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('time')}</label>
            <input
              type="text"
              value={data.time}
              onChange={(e) => updateData('time', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('location')}</label>
          <input
            type="text"
            value={data.location}
            onChange={(e) => updateData('location', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('attendees')} ({t('attendeesHint')})</label>
          <input
            type="text"
            value={data.attendees}
            onChange={(e) => updateData('attendees', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('agenda')}</label>
          <textarea
            value={data.agenda}
            onChange={(e) => updateData('agenda', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('discussionNotes')}</label>
          <textarea
            value={data.discussion}
            onChange={(e) => updateData('discussion', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('decisionsMade')}</label>
          <textarea
            value={data.decisions}
            onChange={(e) => updateData('decisions', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('nextMeeting')}</label>
          <input
            type="text"
            value={data.nextMeeting}
            onChange={(e) => updateData('nextMeeting', e.target.value)}
            placeholder={t("detailsPlaceholder")}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('actionItems')}</label>
          <button onClick={addActionItem} className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700">
            {t('addItem')}
          </button>
        </div>
        <div className="space-y-2">
          {data.actionItems.map(item => (
            <div key={item.id} className="flex gap-2">
              <input
                type="text"
                value={item.task}
                onChange={(e) => updateActionItem(item.id, 'task', e.target.value)}
                placeholder={t("taskPlaceholder")}
                className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <input
                type="text"
                value={item.assignee}
                onChange={(e) => updateActionItem(item.id, 'assignee', e.target.value)}
                placeholder={t("assigneePlaceholder")}
                className="w-28 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <input
                type="date"
                value={item.dueDate}
                onChange={(e) => updateActionItem(item.id, 'dueDate', e.target.value)}
                className="w-36 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <button onClick={() => removeActionItem(item.id)} className="text-red-500 hover:text-red-700">✕</button>
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
