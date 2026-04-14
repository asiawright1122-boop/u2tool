<script lang="ts">
  import { onDestroy } from 'svelte';

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

  // Imports
  import { v4 as uuidv4 } from 'uuid';

  let uuids = $state([uuidv4()] as string[]);

  let count = $state(1);

  let copied = $state(false);

  let timerRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function generateUuids() {
    const newUuids = Array.from({ length: count }, () => uuidv4());
    uuids = newUuids;
  }
  async function copyAll() {
    await navigator.clipboard.writeText(uuids.join('\n'));
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }
  async function copySingle(uuid: string) {
    await navigator.clipboard.writeText(uuid);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }

</script>


    <div class="space-y-6">
      <div class="flex flex-wrap items-center gap-6">
        <div class="flex flex-col gap-2">
          <label for="uuid-count" class="tool-label !mb-0">{t('count')}</label>
          <input
            id="uuid-count"
            name="uuidCount"
            type="number"
            min="1"
            max="100"
            value={count}
            onchange={(e) => count = Math.min(100, Math.max(1, parseInt(e.target.value) || 1))}
            class="tool-input w-24 text-center !py-2.5"
          />
        </div>
        
        <div class="flex items-end gap-2 h-full pt-6">
          <button onclick={generateUuids} class="btn-primary">
            <div class="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>
              {t('generate')}
            </div>
          </button>
          
          <button 
            onclick={copyAll} 
            class={`btn-secondary transition-all duration-300 ${copied ? 'btn-success' : ''}`}
          >
            <div class="flex items-center gap-2">
              {#if copied}
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              {:else}
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
              {/if}
              {copied ? t('copied') : t('copy')} {t('all')}
            </div>
          </button>
        </div>
      </div>

      <div class="grid gap-2.5">
        {#each uuids as uuid, index (index)}
          <div 
            class="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl group transition-all hover:border-amber-500/30"
          >
            <span class="font-mono text-sm text-slate-700 dark:text-amber-100/90 select-all tracking-tight">{uuid}</span>
            <button
              onclick={() => copySingle(uuid)}
              class="opacity-0 group-hover:opacity-100 transition-opacity btn-sm btn-secondary !py-1 !text-[10px]"
            >
              {t('copy')}
            </button>
          </div>
        {/each}
      </div>
    </div>
  
