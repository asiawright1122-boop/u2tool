<script lang="ts">
  import { onDestroy } from 'svelte';
  import { synonyms } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['paraphrase-tool'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.paraphrase-tool.${key}`;
  }
  function tc(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  type Style = 'formal' | 'casual' | 'simple' | 'creative';

  let input = $state('');

  let style = $state('formal');

  let output = $state('');

  let copied = $state(false);

  let timerRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  const styles: { id: Style; icon: string }[] = [
    { id: 'formal', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>' },
    { id: 'casual', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/></svg>' },
    { id: 'simple', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>' },
    { id: 'creative', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>' },
  ];
  function paraphrase() {
    if (!input.trim()) return;

    let result = input;
    const words = input.split(/\b/);
    
    result = words.map(word => {
      const lowerWord = word.toLowerCase();
      const syns = synonyms[lowerWord];
      
      if (syns && Math.random() > 0.5) {
        // Pick synonym based on style
        let idx = 0;
        switch (style) {
          case 'formal': idx = 0; break;
          case 'casual': idx = Math.min(1, syns.length - 1); break;
          case 'simple': idx = Math.min(2, syns.length - 1); break;
          case 'creative': idx = Math.floor(Math.random() * syns.length); break;
        }
        
        const replacement = syns[idx];
        // Preserve capitalization
        if (word[0] === word[0].toUpperCase()) {
          return replacement.charAt(0).toUpperCase() + replacement.slice(1);
        }
        return replacement;
      }
      return word;
    }).join('');

    // Style-specific transformations
    if (style === 'formal') {
      result = result.replace(/don't/gi, 'do not');
      result = result.replace(/can't/gi, 'cannot');
      result = result.replace(/won't/gi, 'will not');
      result = result.replace(/isn't/gi, 'is not');
    } else if (style === 'casual') {
      result = result.replace(/do not/gi, "don't");
      result = result.replace(/cannot/gi, "can't");
      result = result.replace(/will not/gi, "won't");
    }

    output = result;
  }
  async function copyToClipboard() {
    await navigator.clipboard.writeText(output);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }

</script>


    <div class="space-y-6">
      <!-- Style Selection -->
      <div>
        <label class="tool-label">
          {t('selectStyle')}
        </label>
        <div class="flex flex-wrap gap-2">
          {#each styles as s (s.id)}
<button 
              onclick={() => style = s.id}
              class={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                style === s.id
                  ? 'bg-slate-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <span>{@html s.icon}</span>
              <span>{t(s.id)}</span>
            </button>
{/each}
        </div>
      </div>

      <!-- Input -->
      <div>
        <label class="tool-label">
          {t('originalText')}
        </label>
        <textarea
          bind:value={input}
          placeholder={tc('inputPlaceholder')}
          rows={5}
          class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"></textarea>
      </div>

      <!-- Paraphrase Button -->
      <button
        onclick={paraphrase}
        disabled={!input.trim()}
        class="w-full py-3 bg-slate-600 text-white rounded-lg font-medium hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {t('paraphrase')}
      </button>

      <!-- Output -->
      {#if output}
<div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
          <div class="flex justify-between items-center mb-3">
            <h3 class="font-semibold text-gray-900 dark:text-white">{t('paraphrasedText')}</h3>
            <button
              onclick={copyToClipboard}
              class={`px-3 py-1 rounded text-sm font-medium ${
                copied
                  ? 'btn-success'
                  : 'bg-slate-600 text-white hover:bg-slate-700'
              }`}
            >
              {copied ? tc('copied') : tc('copy')}
            </button>
          </div>
          <p class="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
            {output}
          </p>
        </div>
{/if}

      <!-- Tips -->
      <div class="bg-slate-50 dark:bg-slate-900/20 rounded-xl p-4">
        <h4 class="font-medium text-slate-800 dark:text-slate-200 mb-2">{t('tips')}</h4>
        <ul class="text-sm text-slate-700 dark:text-slate-300 space-y-1 list-disc list-inside">
          <li>{t('tip1')}</li>
          <li>{t('tip2')}</li>
          <li>{t('tip3')}</li>
        </ul>
      </div>
    </div>
  
