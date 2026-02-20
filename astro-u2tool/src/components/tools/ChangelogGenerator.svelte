<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['changelog-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.changelog-generator.${key}`;
  }
  function tCommon(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  interface ChangelogEntry {
  version: string;
  date: string;
  added: string[];
  changed: string[];
  fixed: string[];
  removed: string[];
  deprecated: string[];
  security: string[];
}

  let entries = $state([{ ...EMPTY_ENTRY, version: '1.0.0' }]);

  let projectName = $state('');

  let projectUrl = $state('');

  let output = $state('');

  let copied = $state(false);

  // Functions
  function addEntry() {
    const lastVersion = entries[0]?.version || '1.0.0';
    const parts = lastVersion.split('.').map(Number);
    parts[1] = (parts[1] || 0) + 1;
    const newVersion = parts.join('.');
    
    entries = [{ ...EMPTY_ENTRY, version: newVersion }, ...entries];
  }
  function removeEntry(index: number) {
    entries = entries.filter((_, i) => i !== index);
  }
  function updateEntry(index: number, field: keyof ChangelogEntry, value: string | string[]) {
    entries = entries.map((entry, i) => 
      i === index ? { ...entry, [field]: value } : entry
    );
  }
  function addItem(entryIndex: number, category: keyof Omit<ChangelogEntry, 'version' | 'date'>) {
    const entry = entries[entryIndex];
    updateEntry(entryIndex, category, [...entry[category], '']);
  }
  function updateItem(entryIndex: number, category: keyof Omit<ChangelogEntry, 'version' | 'date'>, itemIndex: number, value: string) {
    const entry = entries[entryIndex];
    const items = [...entry[category]];
    items[itemIndex] = value;
    updateEntry(entryIndex, category, items);
  }
  function removeItem(entryIndex: number, category: keyof Omit<ChangelogEntry, 'version' | 'date'>, itemIndex: number) {
    const entry = entries[entryIndex];
    updateEntry(entryIndex, category, entry[category].filter((_, i) => i !== itemIndex));
  }
  function generateChangelog() {
    const lines: string[] = [];
    
    // Header
    lines.push('# Changelog');
    lines.push('');
    lines.push('All notable changes to this project will be documented in this file.');
    lines.push('');
    lines.push('The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),');
    lines.push('and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).');
    lines.push('');
    
    // Entries
    for (const entry of entries) {
      if (!entry.version) continue;
      
      // Version header
      if (projectUrl) {
        lines.push(`## [${entry.version}](${projectUrl}/releases/tag/v${entry.version}) - ${entry.date}`);
      } else {
        lines.push(`## [${entry.version}] - ${entry.date}`);
      }
      lines.push('');
      
      // Categories
      const categories: { key: keyof Omit<ChangelogEntry, 'version' | 'date'>; label: string }[] = [
        { key: 'added', label: 'Added' },
        { key: 'changed', label: 'Changed' },
        { key: 'deprecated', label: 'Deprecated' },
        { key: 'removed', label: 'Removed' },
        { key: 'fixed', label: 'Fixed' },
        { key: 'security', label: 'Security' },
      ];
      
      for (const { key, label } of categories) {
        const items = entry[key].filter(item => item.trim());
        if (items.length > 0) {
          lines.push(`### ${label}`);
          lines.push('');
          for (const item of items) {
            lines.push(`- ${item}`);
          }
          lines.push('');
        }
      }
    }
    
    output = lines.join('\n');
  }
  async function copyToClipboard() {
    await navigator.clipboard.writeText(output);
    copied = true;
    setTimeout(() => copied = false, 2000);
  }
  function downloadFile() {
    const blob = new Blob([output], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'CHANGELOG.md';
    link.click();
    URL.revokeObjectURL(url);
  }
  function clearAll() {
    entries = [{ ...EMPTY_ENTRY, version: '1.0.0' }];
    projectName = '';
    projectUrl = '';
    output = '';
  }
  const categories: { key: keyof Omit<ChangelogEntry, 'version' | 'date'>; label: string; color: string }[] = [
    { key: 'added', label: t('added'), color: 'bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700' },
    { key: 'changed', label: t('changed'), color: 'bg-yellow-100 dark:bg-yellow-900 border-yellow-300 dark:border-yellow-700' },
    { key: 'fixed', label: t('fixed'), color: 'bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700' },
    { key: 'removed', label: t('removed'), color: 'bg-red-100 dark:bg-red-900 border-red-300 dark:border-red-700' },
    { key: 'deprecated', label: t('deprecated'), color: 'bg-orange-100 dark:bg-orange-900 border-orange-300 dark:border-orange-700' },
    { key: 'security', label: t('security'), color: 'bg-purple-100 dark:bg-purple-900 border-purple-300 dark:border-purple-700' },
  ];

</script>


    <div class="space-y-6">
      <!-- Project Info -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('projectName')}
          </label>
          <input
            type="text"
            bind:value={projectName}
            placeholder={t('projectNamePlaceholder')}
            class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('projectUrl')}
          </label>
          <input
            type="text"
            bind:value={projectUrl}
            placeholder={t('projectUrlPlaceholder')}
            class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <!-- Add Entry Button -->
      <button
        onclick={addEntry}
        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm"
      >
        + {t('addVersion')}
      </button>

      <!-- Entries -->
      <div class="space-y-6">
        {#each entries as entry, entryIndex (entryIndex)}
<div  class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-4">
            <!-- Version Header -->
            <div class="flex items-center gap-4">
              <div class="flex-1">
                <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('version')}</label>
                <input
                  type="text"
                  value={entry.version}
                  onchange={(e) => updateEntry(entryIndex, 'version', e.target.value)}
                  placeholder={t('versionPlaceholder')}
                  class="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-gray-100"
                />
              </div>
              <div class="flex-1">
                <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('date')}</label>
                <input
                  type="date"
                  value={entry.date}
                  onchange={(e) => updateEntry(entryIndex, 'date', e.target.value)}
                  class="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-gray-100"
                />
              </div>
              {#if entries.length > 1}
<button
                  onclick={() => removeEntry(entryIndex)}
                  class="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded text-sm mt-5"
                >
                  {t('removeVersion')}
                </button>
{/if}
            </div>

            <!-- Categories -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              {#each categories as { key, label, color } (key)}
<div  class={`p-3 rounded-lg border ${color}`}>
                  <div class="flex justify-between items-center mb-2">
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
                    <button
                      onclick={() => addItem(entryIndex, key)}
                      class="px-2 py-1 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded text-xs text-gray-700 dark:text-gray-300"
                    >
                      +
                    </button>
                  </div>
                  <div class="space-y-2">
                    {#each entry[key] as item, itemIndex (itemIndex)}
                      <div class="flex gap-2">
                        <input
                          type="text"
                          value={item}
                          onchange={(e) => updateItem(entryIndex, key, itemIndex, e.target.value)}
                          placeholder={t('itemPlaceholder')}
                          class="flex-1 px-2 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-xs text-gray-900 dark:text-gray-100"
                        />
                        <button
                          onclick={() => removeItem(entryIndex, key, itemIndex)}
                          class="px-2 py-1 bg-red-400 hover:bg-red-500 text-white rounded text-xs"
                        >
                          ✕
                        </button>
                      </div>
{/each}
                  </div>
                </div>
{/each}
            </div>
          </div>
{/each}
      </div>

      <!-- Actions -->
      <div class="flex justify-center gap-4">
        <button
          onclick={generateChangelog}
          class="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-white"
        >
          {t('generate')}
        </button>
        <button
          onclick={clearAll}
          class="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg font-medium text-gray-900 dark:text-gray-100"
        >
          {tCommon('clear')}
        </button>
      </div>

      <!-- Output -->
      {#if output}
<div>
          <div class="flex justify-between items-center mb-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">CHANGELOG.md</label>
            <div class="flex gap-2">
              <button
                onclick={copyToClipboard}
                class="px-3 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-sm text-gray-900 dark:text-gray-100"
              >
                {copied ? tCommon('copied') : tCommon('copy')}
              </button>
              <button
                onclick={downloadFile}
                class="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm text-white"
              >
                {t('download')}
              </button>
            </div>
          </div>
          <pre class="w-full p-4 bg-gray-900 dark:bg-gray-950 border border-gray-700 rounded-lg font-mono text-sm text-green-400 overflow-x-auto whitespace-pre-wrap max-h-96 overflow-y-auto">
            {output}
          </pre>
        </div>
{/if}
    </div>
  
