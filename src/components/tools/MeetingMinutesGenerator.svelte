<script lang="ts">
  import { generateMinutes } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['meeting-minutes-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.meeting-minutes-generator.${key}`;
  }
  function tCommon(key: string): string {
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

  let data = $state<MeetingData>({
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

  let format = $state<'markdown' | 'text' | 'html'>('markdown');

  let copied = $state(false);

  function updateData<Key extends keyof MeetingData>(key: Key, value: MeetingData[Key]) {
    data = ({ ...data, [key]: value });
  }

  function addActionItem() {
    data = ({
      ...data,
      actionItems: [...data.actionItems, {
        id: Date.now().toString(),
        task: '',
        assignee: '',
        dueDate: '',
      }],
    });
  }

  function updateActionItem(id: string, field: keyof ActionItem, value: string) {
    data = ({
      ...data,
      actionItems: data.actionItems.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      ),
    });
  }

  function removeActionItem(id: string) {
    data = ({
      ...data,
      actionItems: data.actionItems.filter(item => item.id !== id),
    });
  }

  let output = $derived(generateMinutes(data, format));

  function handleCopy() {
    navigator.clipboard.writeText(output);
    copied = true;
    setTimeout(() => copied = false, 2000);
  }

</script>


    <div class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('meetingTitle')}</label>
          <input
            type="text"
            value={data.title}
            onchange={(e) => updateData('title', e.target.value)}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('date')}</label>
            <input
              type="date"
              value={data.date}
              onchange={(e) => updateData('date', e.target.value)}
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('time')}</label>
            <input
              type="text"
              value={data.time}
              onchange={(e) => updateData('time', e.target.value)}
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
        </div>
        <div>
          <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('location')}</label>
          <input
            type="text"
            value={data.location}
            onchange={(e) => updateData('location', e.target.value)}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('attendees')} ({t('attendeesHint')})</label>
          <input
            type="text"
            value={data.attendees}
            onchange={(e) => updateData('attendees', e.target.value)}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('agenda')}</label>
          <textarea
            value={data.agenda}
            onchange={(e) => updateData('agenda', e.target.value)}
            rows={3}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
          />
        </div>
        <div>
          <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('discussionNotes')}</label>
          <textarea
            value={data.discussion}
            onchange={(e) => updateData('discussion', e.target.value)}
            rows={3}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
          />
        </div>
        <div>
          <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('decisionsMade')}</label>
          <textarea
            value={data.decisions}
            onchange={(e) => updateData('decisions', e.target.value)}
            rows={3}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
          />
        </div>
        <div>
          <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('nextMeeting')}</label>
          <input
            type="text"
            value={data.nextMeeting}
            onchange={(e) => updateData('nextMeeting', e.target.value)}
            placeholder={t("detailsPlaceholder")}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      <div>
        <div class="flex justify-between items-center mb-2">
          <label class="tool-label">{t('actionItems')}</label>
          <button onclick={addActionItem} class="text-xs px-2 py-1 btn-success rounded hover:bg-green-700">
            {t('addItem')}
          </button>
        </div>
        <div class="space-y-2">
          {#each data.actionItems as item (item.id)}
<div  class="flex gap-2">
              <input
                type="text"
                value={item.task}
                onchange={(e) => updateActionItem(item.id, 'task', e.target.value)}
                placeholder={t("taskPlaceholder")}
                class="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <input
                type="text"
                value={item.assignee}
                onchange={(e) => updateActionItem(item.id, 'assignee', e.target.value)}
                placeholder={t("assigneePlaceholder")}
                class="w-28 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <input
                type="date"
                value={item.dueDate}
                onchange={(e) => updateActionItem(item.id, 'dueDate', e.target.value)}
                class="w-36 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <button onclick={() => removeActionItem(item.id)} class="text-red-500 hover:text-red-700">✕</button>
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
                class={`px-3 py-1 text-sm rounded ${format === f ? 'bg-amber-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
              >
                {f.toUpperCase()}
              </button>
{/each}
          </div>
          <button onclick={handleCopy} class="text-sm text-amber-600 hover:text-amber-700 dark:text-amber-400">
            {copied ? tCommon('copied') : tCommon('copy')}
          </button>
        </div>
        <pre class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-auto text-sm font-mono text-gray-800 dark:text-gray-200 max-h-64 whitespace-pre-wrap">
          {output}
        </pre>
      </div>
    </div>
  
