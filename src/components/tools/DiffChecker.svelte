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

  let text1 = $state('');

  let text2 = $state('');

  let diff = $state([]);

  let showDiff = $state(false);

  // Functions
  function computeDiff() {
    if (!text1.trim() && !text2.trim()) {
      diff = [];
      showDiff = false;
      return;
    }
    const lines1 = text1.split('\n');
    const lines2 = text2.split('\n');
    const result: { type: string; value: string }[] = [];
    
    const maxLen = Math.max(lines1.length, lines2.length);
    
    for (let i = 0; i < maxLen; i++) {
      const line1 = lines1[i] ?? '';
      const line2 = lines2[i] ?? '';
      
      if (line1 === line2) {
        result.push({ type: 'same', value: line1 });
      } else {
        if (line1) result.push({ type: 'removed', value: line1 });
        if (line2) result.push({ type: 'added', value: line2 });
      }
    }
    
    diff = result;
    showDiff = true;
  }
  function clearAll() {
    text1 = '';
    text2 = '';
    diff = [];
    showDiff = false;
  }
  const stats = {
    added: diff.filter(d => d.type === 'added').length,
    removed: diff.filter(d => d.type === 'removed').length,
    same: diff.filter(d => d.type === 'same').length,
  };

</script>


    <div class="space-y-4">
      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label for="diff-original" class="block text-sm font-medium mb-2">{t('diffChecker.original')}</label>
          <textarea
            id="diff-original"
            name="originalText"
            class="tool-textarea"
            bind:value={text1}
            placeholder={t('diffChecker.originalPlaceholder')}
            rows={10}></textarea>
        </div>
        <div>
          <label for="diff-modified" class="block text-sm font-medium mb-2">{t('diffChecker.modified')}</label>
          <textarea
            id="diff-modified"
            name="modifiedText"
            class="tool-textarea"
            bind:value={text2}
            placeholder={t('diffChecker.modifiedPlaceholder')}
            rows={10}></textarea>
        </div>
      </div>

      <div class="flex gap-2">
        <button onclick={computeDiff} class="btn-primary">
          {t('diffChecker.compare')}
        </button>
        <button onclick={clearAll} class="btn-secondary">
          {t('clear')}
        </button>
      </div>

      {#if showDiff}
<div>

          <div class="flex gap-4 text-sm">
            <span class="text-green-600 dark:text-green-400">+ {stats.added} {t('diffChecker.added')}</span>
            <span class="text-red-600 dark:text-red-400">- {stats.removed} {t('diffChecker.removed')}</span>
            <span class="text-gray-600 dark:text-gray-300">{stats.same} {t('diffChecker.unchanged')}</span>
          </div>

          <div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 font-mono text-sm overflow-x-auto">
            {#each diff as line, i (i)}
<div 
                class={`px-2 py-0.5 ${
                  line.type === 'added'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                    : line.type === 'removed'
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                <span class="inline-block w-6 text-gray-500 dark:text-gray-300">
                  {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
                </span>
                {line.value || ' '}
              </div>
{/each}
          </div>
        
</div>
{/if}
    </div>
  
