<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['meeting-agenda-builder'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.meeting-agenda-builder.${key}`;
  }
  function tCommon(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
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
    if (minutes < 60) return `${minutes}m`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m === 0 ? `${h}h` : `${h}h ${m}m`;
  }

  function formatTimeWithOffset(startTime: string, offsetMinutes: number): string {
    const [h, m] = startTime.split(':').map((value) => parseInt(value, 10) || 0);
    const total = h * 60 + m + offsetMinutes;
    const normalized = ((total % (24 * 60)) + 24 * 60) % (24 * 60);
    const nextH = Math.floor(normalized / 60);
    const nextM = normalized % 60;
    return `${String(nextH).padStart(2, '0')}:${String(nextM).padStart(2, '0')}`;
  }

  function buildAgendaOutput(
    meeting: MeetingInfo,
    agendaItems: AgendaItem[],
    outputFormat: 'markdown' | 'text' | 'html'
  ): string {
    const total = agendaItems.reduce((sum, item) => sum + item.duration, 0);

    if (outputFormat === 'text') {
      const lines: string[] = [
        `${meeting.title}`,
        `${meeting.date} ${meeting.startTime} @ ${meeting.location}`,
        `Objective: ${meeting.objective}`,
        `Total Duration: ${formatDuration(total)}`,
        '',
        'Agenda:',
      ];

      let elapsed = 0;
      agendaItems.forEach((item, index) => {
        const start = formatTimeWithOffset(meeting.startTime, elapsed);
        elapsed += item.duration;
        const end = formatTimeWithOffset(meeting.startTime, elapsed);
        lines.push(
          `${index + 1}. [${start}-${end}] ${item.topic} (${formatDuration(item.duration)})` +
          (item.presenter ? ` - ${item.presenter}` : '')
        );
      });

      return lines.join('\n');
    }

    if (outputFormat === 'html') {
      let elapsed = 0;
      const itemsHtml = agendaItems.map((item, index) => {
        const start = formatTimeWithOffset(meeting.startTime, elapsed);
        elapsed += item.duration;
        const end = formatTimeWithOffset(meeting.startTime, elapsed);
        return `<li><strong>${index + 1}. ${item.topic}</strong> (${start}-${end}, ${formatDuration(item.duration)})${item.presenter ? ` - ${item.presenter}` : ''}</li>`;
      }).join('\n');

      return `<h2>${meeting.title}</h2>\n<p>${meeting.date} ${meeting.startTime} @ ${meeting.location}</p>\n<p><strong>Objective:</strong> ${meeting.objective}</p>\n<p><strong>Total Duration:</strong> ${formatDuration(total)}</p>\n<ol>\n${itemsHtml}\n</ol>`;
    }

    let elapsed = 0;
    const mdItems = agendaItems.map((item, index) => {
      const start = formatTimeWithOffset(meeting.startTime, elapsed);
      elapsed += item.duration;
      const end = formatTimeWithOffset(meeting.startTime, elapsed);
      return `${index + 1}. **${item.topic}** (${start}-${end}, ${formatDuration(item.duration)})${item.presenter ? ` - ${item.presenter}` : ''}`;
    }).join('\n');

    return `# ${meeting.title}\n\n- Date: ${meeting.date}\n- Time: ${meeting.startTime}\n- Location: ${meeting.location}\n- Objective: ${meeting.objective}\n- Total Duration: ${formatDuration(total)}\n\n## Agenda\n${mdItems}`;
  }

  let info = $state({
    title: 'Weekly Team Meeting',
    date: new Date().toISOString().split('T')[0],
    startTime: '10:00',
    location: 'Conference Room A',
    organizer: '',
    objective: 'Review progress and plan next week',
  });

  let items = $state([
    { id: '1', topic: 'Welcome & Introductions', duration: 5, presenter: '', notes: '' },
    { id: '2', topic: 'Review Action Items', duration: 10, presenter: '', notes: '' },
    { id: '3', topic: 'Project Updates', duration: 20, presenter: '', notes: '' },
    { id: '4', topic: 'Discussion & Q&A', duration: 15, presenter: '', notes: '' },
    { id: '5', topic: 'Next Steps & Wrap-up', duration: 10, presenter: '', notes: '' },
  ]);

  let format = $state<'markdown' | 'text' | 'html'>('markdown');

  let copied = $state(false);

  function updateInfo<K extends keyof MeetingInfo>(key: K, value: MeetingInfo[K]) {
    info = ({ ...info, [key]: value });
  }

  function addItem() {
    items = [...items, {
      id: Date.now().toString(),
      topic: 'New Topic',
      duration: 10,
      presenter: '',
      notes: '',
    }];
  }

  function updateItem(id: string, field: keyof AgendaItem, value: string | number) {
    items = items.map(item => item.id === id ? { ...item, [field]: value } : item);
  }

  function removeItem(id: string) {
    items = items.filter(item => item.id !== id);
  }

  function moveItem(id: string, direction: 'up' | 'down') {
    const idx = items.findIndex(item => item.id === id);
    if (idx === -1) return;
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === items.length - 1) return;
    const newItems = [...items];
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    [newItems[idx], newItems[swapIdx]] = [newItems[swapIdx], newItems[idx]];
    items = newItems;
  }

  let totalDuration = $derived.by(() => items.reduce((sum, item) => sum + item.duration, 0));

  let output = $derived.by(() => buildAgendaOutput(info, items, format));

  function handleCopy() {
    navigator.clipboard.writeText(output);
    copied = true;
    setTimeout(() => copied = false, 2000);
  }

</script>


    <div class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('meetingTitle')}</label>
          <input
            type="text"
            value={info.title}
            onchange={(e) => updateInfo('title', e.target.value)}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('date')}</label>
          <input
            type="date"
            value={info.date}
            onchange={(e) => updateInfo('date', e.target.value)}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('time')}</label>
          <input
            type="time"
            value={info.startTime}
            onchange={(e) => updateInfo('startTime', e.target.value)}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('location')}</label>
          <input
            type="text"
            value={info.location}
            onchange={(e) => updateInfo('location', e.target.value)}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <div class="md:col-span-2">
          <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('objectives')}</label>
          <input
            type="text"
            value={info.objective}
            onchange={(e) => updateInfo('objective', e.target.value)}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      <div>
        <div class="flex justify-between items-center mb-3">
          <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('agendaItems')} ({formatDuration(totalDuration)} {t('totalDuration')})
          </h3>
          <button onclick={addItem} class="text-xs px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700">
            {t('addItem')}
          </button>
        </div>
        <div class="space-y-2">
          {#each items as item, idx (item.id)}
<div  class="flex gap-2 items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div class="flex flex-col gap-1">
                <button onclick={() => moveItem(item.id, 'up')} disabled={idx === 0} class="text-gray-400 hover:text-gray-600 disabled:opacity-30">↑</button>
                <button onclick={() => moveItem(item.id, 'down')} disabled={idx === items.length - 1} class="text-gray-400 hover:text-gray-600 disabled:opacity-30">↓</button>
              </div>
              <span class="text-sm text-gray-500 w-6">{idx + 1}.</span>
              <input
                type="text"
                value={item.topic}
                onchange={(e) => updateItem(item.id, 'topic', e.target.value)}
                placeholder={t("topicPlaceholder")}
                class="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <select
                value={item.duration}
                onchange={(e) => updateItem(item.id, 'duration', parseInt(e.target.value))}
                class="w-24 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                {#each [5, 10, 15, 20, 30, 45, 60, 90] as d (d)}
<option  value={d}>{formatDuration(d)}</option>
{/each}
              </select>
              <input
                type="text"
                value={item.presenter}
                onchange={(e) => updateItem(item.id, 'presenter', e.target.value)}
                placeholder={t("presenterPlaceholder")}
                class="w-28 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <button onclick={() => removeItem(item.id)} class="text-red-500 hover:text-red-700">✕</button>
            </div>
{/each}
        </div>
      </div>

      <div>
        <div class="flex justify-between items-center mb-2">
          <div class="flex gap-2">
            {#each (['markdown', 'text', 'html'] as const) as f (f)}
<button 
                onclick={() => format = f}
                class={`px-3 py-1 text-sm rounded ${format === f ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
              >
                {f.toUpperCase()}
              </button>
{/each}
          </div>
          <button onclick={handleCopy} class="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
            {copied ? tCommon('copied') : tCommon('copy')}
          </button>
        </div>
        <pre class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-auto text-sm font-mono text-gray-800 dark:text-gray-200 max-h-64 whitespace-pre-wrap">
          {output}
        </pre>
      </div>
    </div>
  
