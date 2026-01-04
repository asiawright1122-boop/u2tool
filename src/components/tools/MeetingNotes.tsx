'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface ActionItem {
  id: string;
  task: string;
  assignee: string;
  dueDate: string;
  completed: boolean;
}

export default function MeetingNotes() {
  const t = useTranslations('tools');
  
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(() => new Date().toTimeString().slice(0, 5));
  const [attendees, setAttendees] = useState<string[]>([]);
  const [newAttendee, setNewAttendee] = useState('');
  const [agenda, setAgenda] = useState<string[]>([]);
  const [newAgendaItem, setNewAgendaItem] = useState('');
  const [notes, setNotes] = useState('');
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [newAction, setNewAction] = useState({ task: '', assignee: '', dueDate: '' });

  const addAttendee = () => {
    if (newAttendee.trim()) {
      setAttendees([...attendees, newAttendee.trim()]);
      setNewAttendee('');
    }
  };

  const removeAttendee = (index: number) => {
    setAttendees(attendees.filter((_, i) => i !== index));
  };

  const addAgendaItem = () => {
    if (newAgendaItem.trim()) {
      setAgenda([...agenda, newAgendaItem.trim()]);
      setNewAgendaItem('');
    }
  };

  const removeAgendaItem = (index: number) => {
    setAgenda(agenda.filter((_, i) => i !== index));
  };

  const addActionItem = () => {
    if (newAction.task.trim()) {
      setActionItems([...actionItems, { ...newAction, id: Date.now().toString(), completed: false }]);
      setNewAction({ task: '', assignee: '', dueDate: '' });
    }
  };

  const toggleActionItem = (id: string) => {
    setActionItems(actionItems.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
  };

  const removeActionItem = (id: string) => {
    setActionItems(actionItems.filter(item => item.id !== id));
  };

  const exportToMarkdown = () => {
    let md = `# ${title || t('meeting.untitled')}\n\n`;
    md += `**${t('meeting.date')}:** ${date} ${time}\n\n`;
    if (attendees.length > 0) {
      md += `## ${t('meeting.attendees')}\n`;
      attendees.forEach(a => { md += `- ${a}\n`; });
      md += '\n';
    }
    if (agenda.length > 0) {
      md += `## ${t('meeting.agenda')}\n`;
      agenda.forEach((item, i) => { md += `${i + 1}. ${item}\n`; });
      md += '\n';
    }
    if (notes) {
      md += `## ${t('meeting.notes')}\n${notes}\n\n`;
    }
    if (actionItems.length > 0) {
      md += `## ${t('meeting.actionItems')}\n`;
      actionItems.forEach(item => {
        md += `- [${item.completed ? 'x' : ' '}] ${item.task}`;
        if (item.assignee) md += ` (@${item.assignee})`;
        if (item.dueDate) md += ` - Due: ${item.dueDate}`;
        md += '\n';
      });
    }
    const blob = new Blob([md], { type: 'text/markdown' });
    const link = document.createElement('a');
    link.download = `${title || 'meeting-notes'}.md`;
    link.href = URL.createObjectURL(blob);
    link.click();
  };

  const exportToText = () => {
    let text = `${title || t('meeting.untitled')}\n${'='.repeat(50)}\n\n`;
    text += `${t('meeting.date')}: ${date} ${time}\n\n`;
    if (attendees.length > 0) {
      text += `${t('meeting.attendees')}:\n`;
      attendees.forEach(a => { text += `  • ${a}\n`; });
      text += '\n';
    }
    if (agenda.length > 0) {
      text += `${t('meeting.agenda')}:\n`;
      agenda.forEach((item, i) => { text += `  ${i + 1}. ${item}\n`; });
      text += '\n';
    }
    if (notes) {
      text += `${t('meeting.notes')}:\n${notes}\n\n`;
    }
    if (actionItems.length > 0) {
      text += `${t('meeting.actionItems')}:\n`;
      actionItems.forEach(item => {
        text += `  [${item.completed ? '✓' : ' '}] ${item.task}`;
        if (item.assignee) text += ` (${item.assignee})`;
        if (item.dueDate) text += ` - Due: ${item.dueDate}`;
        text += '\n';
      });
    }
    const blob = new Blob([text], { type: 'text/plain' });
    const link = document.createElement('a');
    link.download = `${title || 'meeting-notes'}.txt`;
    link.href = URL.createObjectURL(blob);
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('meeting.title')}</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t('meeting.titlePlaceholder')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800" />
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('meeting.date')}</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800" />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('meeting.time')}</label>
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendees */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">{t('meeting.attendees')}</h3>
          <div className="flex gap-2 mb-3">
            <input type="text" value={newAttendee} onChange={(e) => setNewAttendee(e.target.value)} placeholder={t('meeting.addAttendee')}
              onKeyPress={(e) => e.key === 'Enter' && addAttendee()}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm" />
            <button onClick={addAttendee} className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">{t('add')}</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {attendees.map((attendee, index) => (
              <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm">
                {attendee}
                <button onClick={() => removeAttendee(index)} className="text-blue-600 hover:text-blue-800">×</button>
              </span>
            ))}
          </div>
        </div>

        {/* Agenda */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">{t('meeting.agenda')}</h3>
          <div className="flex gap-2 mb-3">
            <input type="text" value={newAgendaItem} onChange={(e) => setNewAgendaItem(e.target.value)} placeholder={t('meeting.addAgendaItem')}
              onKeyPress={(e) => e.key === 'Enter' && addAgendaItem()}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm" />
            <button onClick={addAgendaItem} className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">{t('add')}</button>
          </div>
          <ol className="list-decimal list-inside space-y-1">
            {agenda.map((item, index) => (
              <li key={index} className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300">
                <span>{item}</span>
                <button onClick={() => removeAgendaItem(index)} className="text-red-500 hover:text-red-700">×</button>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Notes */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">{t('meeting.notes')}</h3>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={t('meeting.notesPlaceholder')} rows={6}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 resize-y" />
      </div>

      {/* Action Items */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">{t('meeting.actionItems')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
          <input type="text" value={newAction.task} onChange={(e) => setNewAction({ ...newAction, task: e.target.value })} placeholder={t('meeting.task')}
            className="md:col-span-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm" />
          <input type="text" value={newAction.assignee} onChange={(e) => setNewAction({ ...newAction, assignee: e.target.value })} placeholder={t('meeting.assignee')}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm" />
          <div className="flex gap-2">
            <input type="date" value={newAction.dueDate} onChange={(e) => setNewAction({ ...newAction, dueDate: e.target.value })}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm" />
            <button onClick={addActionItem} className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">{t('add')}</button>
          </div>
        </div>
        <div className="space-y-2">
          {actionItems.map((item) => (
            <div key={item.id} className={`flex items-center gap-3 p-3 rounded-lg ${item.completed ? 'bg-green-50 dark:bg-green-900/20' : 'bg-gray-50 dark:bg-gray-800'}`}>
              <input type="checkbox" checked={item.completed} onChange={() => toggleActionItem(item.id)} className="w-4 h-4" />
              <span className={`flex-1 text-sm ${item.completed ? 'line-through text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>{item.task}</span>
              {item.assignee && <span className="text-xs text-blue-600 dark:text-blue-400">@{item.assignee}</span>}
              {item.dueDate && <span className="text-xs text-gray-500">{item.dueDate}</span>}
              <button onClick={() => removeActionItem(item.id)} className="text-red-500 hover:text-red-700">×</button>
            </div>
          ))}
        </div>
      </div>

      {/* Export Buttons */}
      <div className="flex gap-3">
        <button onClick={exportToMarkdown} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">{t('meeting.exportMarkdown')}</button>
        <button onClick={exportToText} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">{t('meeting.exportText')}</button>
      </div>
    </div>
  );
}
