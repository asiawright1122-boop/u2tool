<script lang="ts">
  import { CHANGE_TYPES, generateChangelog } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['changelog-generator-advanced'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.changelog-generator-advanced.${key}`;
  }
  function tCommon(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  interface ChangeEntry {
  id: string;
  type: 'added' | 'changed' | 'deprecated' | 'removed' | 'fixed' | 'security';
  description: string;
  issue?: string;
  pr?: string;
}
  interface Release {
  version: string;
  date: string;
  entries: ChangeEntry[];
}

  let releases = $state([
    {
      version: '1.0.0',
      date: new Date().toISOString().split('T')[0],
      entries: [
        { id: '1', type: 'added', description: 'Initial release', issue: '', pr: '' },
      ],
    },
  ] as Release[]);

  let format = $state('keepachangelog');

  let copied = $state(false);

  function addRelease() {
    const lastVersion = releases[0]?.version || '0.0.0';
    const parts = lastVersion.split('.').map(Number);
    parts[1] = (parts[1] || 0) + 1;
    const newVersion = parts.join('.');
    
    releases = [{
      version: newVersion,
      date: new Date().toISOString().split('T')[0],
      entries: [],
    }, ...releases];
  }

  function updateRelease(idx: number, field: keyof Release, value: string) {
    releases = releases.map((r, i) => i === idx ? { ...r, [field]: value } : r);
  }

  function addEntry(releaseIdx: number) {
    releases = releases.map((r, i) => {
      if (i === releaseIdx) {
        return {
          ...r,
          entries: [...r.entries, {
            id: Date.now().toString(),
            type: 'added',
            description: '',
            issue: '',
            pr: '',
          }],
        };
      }
      return r;
    });
  }

  function updateEntry(releaseIdx: number, entryId: string, field: keyof ChangeEntry, value: string) {
    releases = releases.map((r, i) => {
      if (i === releaseIdx) {
        return {
          ...r,
          entries: r.entries.map(e => e.id === entryId ? { ...e, [field]: value } : e),
        };
      }
      return r;
    });
  }

  function removeEntry(releaseIdx: number, entryId: string) {
    releases = releases.map((r, i) => {
      if (i === releaseIdx) {
        return { ...r, entries: r.entries.filter(e => e.id !== entryId) };
      }
      return r;
    });
  }

  let changelog = $derived(generateChangelog(releases, format));

  function handleCopy() {
    navigator.clipboard.writeText(changelog);
    copied = true;
    setTimeout(() => copied = false, 2000);
  }

</script>


    <div class="space-y-6">
      <div class="flex flex-wrap gap-4 items-center justify-between">
        <div class="flex gap-2">
          {#each (['keepachangelog', 'conventional', 'simple'] as const) as f (f)}
<button 
              onclick={() => format = f}
              class={`px-3 py-1.5 text-sm rounded-lg ${
                format === f
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {f === 'keepachangelog' ? t('keepAChangelog') : f === 'conventional' ? t('conventional') : t('simple')}
            </button>
{/each}
        </div>
        <button
          onclick={addRelease}
          class="px-3 py-1.5 text-sm btn-success rounded-lg hover:bg-green-700"
        >
          {t('addRelease')}
        </button>
      </div>

      <div class="space-y-4 max-h-96 overflow-y-auto">
        {#each releases as release, releaseIdx (releaseIdx)}
<div  class="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            <div class="bg-gray-100 dark:bg-gray-800 px-4 py-2 flex gap-4 items-center">
              <input
                type="text"
                value={release.version}
                onchange={(e) => updateRelease(releaseIdx, 'version', e.target.value)}
                placeholder={t("versionPlaceholder")}
                class="w-24 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <input
                type="date"
                value={release.date}
                onchange={(e) => updateRelease(releaseIdx, 'date', e.target.value)}
                class="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <button
                onclick={() => addEntry(releaseIdx)}
                class="ml-auto text-xs px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded hover:bg-amber-200"
              >
                {t('addEntry')}
              </button>
            </div>
            
            <div class="p-3 space-y-2">
              {#if release.entries.length === 0}
<p class="text-sm text-gray-500 text-center py-2">{t('noEntriesYet')}</p>
{:else}
{#each release.entries as entry (entry.id)}
<div  class="flex gap-2 items-start">
                    <select
                      value={entry.type}
                      onchange={(e) => updateEntry(releaseIdx, entry.id, 'type', e.target.value)}
                      class="w-28 px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      {#each CHANGE_TYPES as type}
<option value={type.value}>{type.label}</option>
{/each}
                    </select>
                    <input
                      type="text"
                      value={entry.description}
                      onchange={(e) => updateEntry(releaseIdx, entry.id, 'description', e.target.value)}
                      placeholder={t("descriptionPlaceholder")}
                      class="flex-1 px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                    <input
                      type="text"
                      value={entry.issue || ''}
                      onchange={(e) => updateEntry(releaseIdx, entry.id, 'issue', e.target.value)}
                      placeholder={t("issuePlaceholder")}
                      class="w-20 px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                    <button
                      onclick={() => removeEntry(releaseIdx, entry.id)}
                      class="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                    >
                      ✕
                    </button>
                  </div>
{/each}
{/if}
            </div>
          </div>
{/each}
      </div>

      <div>
        <div class="flex justify-between items-center mb-2">
          <div class="tool-label">
            {t('generatedChangelog')}
          </div>
          <button
            onclick={handleCopy}
            class="text-sm text-amber-600 hover:text-amber-700 dark:text-amber-400"
          >
            {copied ? tCommon('copied') : tCommon('copy')}
          </button>
        </div>
        <pre class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-x-auto text-sm font-mono text-gray-800 dark:text-gray-200 max-h-64 whitespace-pre-wrap">
          {changelog}
        </pre>
      </div>
    </div>
  
