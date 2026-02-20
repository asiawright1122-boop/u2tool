<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  interface ActionItem {
  id: string;
  task: string;
  assignee: string;
  dueDate: string;
  completed: boolean;
}

  let title = $state('');

  let date = $state(() => new Date().toISOString().split('T')[0]);

  let time = $state(() => new Date().toTimeString().slice(0, 5));

  let attendees = $state([]);

  let newAttendee = $state('');

  let agenda = $state([]);

  let newAgendaItem = $state('');

  let notes = $state('');

  let actionItems = $state([]);

  let newAction = $state({ task: '', assignee: '', dueDate: '' });

  // Functions
  function addAttendee() {
    if (newAttendee.trim()) {
      attendees = [...attendees, newAttendee.trim()];
      newAttendee = '';
    }
  }
  function removeAttendee(index: number) {
    attendees = attendees.filter((_, i) => i !== index);
  }
  function addAgendaItem() {
    if (newAgendaItem.trim()) {
      agenda = [...agenda, newAgendaItem.trim()];
      newAgendaItem = '';
    }
  }
  function removeAgendaItem(index: number) {
    agenda = agenda.filter((_, i) => i !== index);
  }
  function addActionItem() {
    if (newAction.task.trim()) {
      actionItems = [...actionItems, { ...newAction, id: Date.now().toString(), completed: false }];
      newAction = { task: '', assignee: '', dueDate: '' };
    }
  }
  function toggleActionItem(id: string) {
    actionItems = actionItems.map(item => item.id === id ? { ...item, completed: !item.completed } : item);
  }
  function removeActionItem(id: string) {
    actionItems = actionItems.filter(item => item.id !== id);
  }
  function exportToMarkdown() {
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
  }
  function exportToText() {
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
  }

</script>


    <div class="space-y-6">
      <!-- Header -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('meeting.title')}</label>
          <input type="text" bind:value={title} placeholder={t('meeting.titlePlaceholder')}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800" />
        </div>
        <div class="flex gap-2">
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('meeting.date')}</label>
            <input type="date" bind:value={date}
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800" />
          </div>
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('meeting.time')}</label>
            <input type="time" bind:value={time}
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800" />
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Attendees -->
        <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <h3 class="font-medium text-gray-900 dark:text-gray-100 mb-3">{t('meeting.attendees')}</h3>
          <div class="flex gap-2 mb-3">
            <input type="text" bind:value={newAttendee} placeholder={t('meeting.addAttendee')}
              onkeypress={(e) => e.key === 'Enter' && addAttendee()}
              class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm" />
            <button onclick={addAttendee} class="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">{t('add')}</button>
          </div>
          <div class="flex flex-wrap gap-2">
            {#each attendees as attendee, index (index)}
<span  class="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm">
                {attendee}
                <button onclick={() => removeAttendee(index)} class="text-blue-600 hover:text-blue-800">×</button>
              </span>
{/each}
          </div>
        </div>

        <!-- Agenda -->
        <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <h3 class="font-medium text-gray-900 dark:text-gray-100 mb-3">{t('meeting.agenda')}</h3>
          <div class="flex gap-2 mb-3">
            <input type="text" bind:value={newAgendaItem} placeholder={t('meeting.addAgendaItem')}
              onkeypress={(e) => e.key === 'Enter' && addAgendaItem()}
              class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm" />
            <button onclick={addAgendaItem} class="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">{t('add')}</button>
          </div>
          <ol class="list-decimal list-inside space-y-1">
            {#each agenda as item, index (index)}
<li  class="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300">
                <span>{item}</span>
                <button onclick={() => removeAgendaItem(index)} class="text-red-500 hover:text-red-700">×</button>
              </li>
{/each}
          </ol>
        </div>
      </div>

      <!-- Notes -->
      <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h3 class="font-medium text-gray-900 dark:text-gray-100 mb-3">{t('meeting.notes')}</h3>
        <textarea bind:value={notes} placeholder={t('meeting.notesPlaceholder')} rows={6}
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 resize-y"></textarea>
      </div>

      <!-- Action Items -->
      <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h3 class="font-medium text-gray-900 dark:text-gray-100 mb-3">{t('meeting.actionItems')}</h3>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
          <input type="text" value={newAction.task} onchange={(e) => newAction = { ...newAction, task: e.target.value }} placeholder={t('meeting.task')}
            class="md:col-span-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm" />
          <input type="text" value={newAction.assignee} onchange={(e) => newAction = { ...newAction, assignee: e.target.value }} placeholder={t('meeting.assignee')}
            class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm" />
          <div class="flex gap-2">
            <input type="date" value={newAction.dueDate} onchange={(e) => newAction = { ...newAction, dueDate: e.target.value }}
              class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm" />
            <button onclick={addActionItem} class="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">{t('add')}</button>
          </div>
        </div>
        <div class="space-y-2">
          {#each actionItems as item (item.id)}
<div  class={`flex items-center gap-3 p-3 rounded-lg ${item.completed ? 'bg-green-50 dark:bg-green-900/20' : 'bg-gray-50 dark:bg-gray-800'}`}>
              <input type="checkbox" checked={item.completed} onchange={() => toggleActionItem(item.id)} class="w-4 h-4" />
              <span class={`flex-1 text-sm ${item.completed ? 'line-through text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>{item.task}</span>
              {#if item.assignee}
<span class="text-xs text-blue-600 dark:text-blue-400">@{item.assignee}</span>
{/if}
              {#if item.dueDate}
<span class="text-xs text-gray-500">{item.dueDate}</span>
{/if}
              <button onclick={() => removeActionItem(item.id)} class="text-red-500 hover:text-red-700">×</button>
            </div>
{/each}
        </div>
      </div>

      <!-- Export Buttons -->
      <div class="flex gap-3">
        <button onclick={exportToMarkdown} class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">{t('meeting.exportMarkdown')}</button>
        <button onclick={exportToText} class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">{t('meeting.exportText')}</button>
      </div>
    </div>
  
