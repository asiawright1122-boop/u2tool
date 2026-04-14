<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['text-diff-patch'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.text-diff-patch.${key}`;
  }

  let original = $state('Hello World\nThis is line 2\nThis is line 3\nThis is line 4');

  let modified = $state('Hello World\nThis is modified line 2\nThis is line 3\nNew line inserted\nThis is line 4');

  let patch = $state('');

  let mode = $state('create');

  let patchInput = $state('');

  let patchResult = $state('');

  // Functions
  function createPatch() {
    const origLines = original.split('\n');
    const modLines = modified.split('\n');
    const patches: string[] = [];
    
    patches.push('--- original');
    patches.push('+++ modified');
    
    let i = 0, j = 0;
    while (i < origLines.length || j < modLines.length) {
      if (i >= origLines.length) {
        patches.push(`@@ -${i + 1},0 +${j + 1},1 @@`);
        patches.push(`+${modLines[j]}`);
        j++;
      } else if (j >= modLines.length) {
        patches.push(`@@ -${i + 1},1 +${j + 1},0 @@`);
        patches.push(`-${origLines[i]}`);
        i++;
      } else if (origLines[i] === modLines[j]) {
        i++; j++;
      } else {
        patches.push(`@@ -${i + 1},1 +${j + 1},1 @@`);
        patches.push(`-${origLines[i]}`);
        patches.push(`+${modLines[j]}`);
        i++; j++;
      }
    }
    
    patch = patches.join('\n');
  }
  function applyPatch() {
    try {
      const lines = original.split('\n');
      const patchLines = patchInput.split('\n');
      const result = [...lines];
      let offset = 0;
      
      for (let i = 0; i < patchLines.length; i++) {
        const line = patchLines[i];
        if (line.startsWith('@@')) {
          const match = line.match(/@@ -(\d+),?\d* \+(\d+),?\d* @@/);
          if (match) {
            const origLine = parseInt(match[1]) - 1 + offset;
            const nextLine = patchLines[i + 1];
            if (nextLine?.startsWith('-')) {
              result.splice(origLine, 1);
              offset--;
              if (patchLines[i + 2]?.startsWith('+')) {
                result.splice(origLine, 0, patchLines[i + 2].slice(1));
                offset++;
                i += 2;
              } else { i++; }
            } else if (nextLine?.startsWith('+')) {
              result.splice(origLine, 0, nextLine.slice(1));
              offset++;
              i++;
            }
          }
        }
      }
      patchResult = result.join('\n');
    } catch { patchResult = t('errorApply'); }
  }

</script>


    <div class="space-y-6">
      <div class="flex gap-4">
        <button onclick={() => mode = 'create'}
          class={`px-4 py-2 rounded-lg font-medium transition-colors ${mode === 'create' ? 'bg-amber-600 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white'}`}>
          {t('createPatch')}
        </button>
        <button onclick={() => mode = 'apply'}
          class={`px-4 py-2 rounded-lg font-medium transition-colors ${mode === 'apply' ? 'bg-amber-600 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white'}`}>
          {t('applyPatch')}
        </button>
      </div>

      {#if mode === 'create'}

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{t('originalText')}</label>
              <textarea bind:value={original}
                class="w-full h-48 px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white font-mono text-sm"></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{t('modifiedText')}</label>
              <textarea bind:value={modified}
                class="w-full h-48 px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white font-mono text-sm"></textarea>
            </div>
          </div>
          <button onclick={createPatch}
            class="px-6 py-2 bg-amber-600 hover:bg-amber-700 rounded-lg font-medium transition-colors text-white">
            {t('createPatch')}
          </button>
          {#if patch}
<div>
              <label class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{t('generatedPatch')}</label>
              <pre class="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                {#each patch.split('\n') as line, i (i)}
<div  class={line.startsWith('+') ? 'text-green-600 dark:text-green-400' : line.startsWith('-') ? 'text-red-600 dark:text-red-400' : line.startsWith('@@') ? 'text-amber-600 dark:text-amber-400' : 'text-gray-600 dark:text-gray-300'}>
                    {line}
                  </div>
{/each}
              </pre>
            </div>
{/if}
        
{:else}

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{t('originalText')}</label>
              <textarea bind:value={original}
                class="w-full h-40 px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white font-mono text-sm"></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{t('patch')}</label>
              <textarea bind:value={patchInput}
                class="w-full h-40 px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white font-mono text-sm"
                placeholder={t('patchPlaceholder')}></textarea>
            </div>
          </div>
          <button onclick={applyPatch}
            class="px-6 py-2 bg-emerald-500 hover:bg-green-700 rounded-lg font-medium transition-colors text-white">
            {t('applyPatch')}
          </button>
          {#if patchResult}
<div>
              <label class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{t('result')}</label>
              <textarea value={patchResult} readOnly
                class="w-full h-40 px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white font-mono text-sm"></textarea>
            </div>
{/if}
        
{/if}
    </div>
  
