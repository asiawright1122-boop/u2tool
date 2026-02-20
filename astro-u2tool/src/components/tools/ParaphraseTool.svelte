<script lang="ts">
  import { onDestroy } from 'svelte';

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
    { id: 'formal', icon: '👔' },
    { id: 'casual', icon: '😊' },
    { id: 'simple', icon: '📝' },
    { id: 'creative', icon: '🎨' },
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
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('selectStyle')}
        </label>
        <div class="flex flex-wrap gap-2">
          {#each styles as s (s.id)}
<button 
              onclick={() => style = s.id}
              class={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                style === s.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <span>{s.icon}</span>
              <span>{t(s.id)}</span>
            </button>
{/each}
        </div>
      </div>

      <!-- Input -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
        class="w-full py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  ? 'bg-green-600 text-white'
                  : 'bg-purple-600 text-white hover:bg-purple-700'
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
      <div class="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
        <h4 class="font-medium text-purple-800 dark:text-purple-200 mb-2">{t('tips')}</h4>
        <ul class="text-sm text-purple-700 dark:text-purple-300 space-y-1 list-disc list-inside">
          <li>{t('tip1')}</li>
          <li>{t('tip2')}</li>
          <li>{t('tip3')}</li>
        </ul>
      </div>
    </div>
  
