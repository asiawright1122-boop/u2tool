<script lang="ts">
  import { onDestroy } from 'svelte';
  import { AI_PATTERNS, FILLER_WORDS } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['ai-text-humanizer'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.ai-text-humanizer.${key}`;
  }
  function tg(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  type Intensity = 'light' | 'medium' | 'strong';

  let input = $state('');

  let output = $state('');

  let intensity = $state('medium');

  let addFillers = $state(false);

  let copied = $state(false);

  let timerRef = $state(null);

  function humanize() {
    if (!input.trim()) {
      output = '';
      return;
    }

    let result = input;
    const patterns = AI_PATTERNS[intensity];

    patterns.forEach(([pattern, replacements]) => {
      result = result.replace(pattern, () => {
        const idx = Math.floor(Math.random() * replacements.length);
        return replacements[idx];
      });
    });

    if (addFillers) {
      const sentences = result.split(/(?<=[.!?])\s+/);
      result = sentences.map((sentence, i) => {
        if (i > 0 && Math.random() > 0.7) {
          const filler = FILLER_WORDS[Math.floor(Math.random() * FILLER_WORDS.length)];
          return filler.charAt(0).toUpperCase() + filler.slice(1) + ', ' + sentence.charAt(0).toLowerCase() + sentence.slice(1);
        }
        return sentence;
      }).join(' ');
    }

    output = result;
  }  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  async function copyOutput() {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }
  function clearAll() {
    input = '';
    output = '';
  }

</script>


    <div class="space-y-4">
      <div class="flex flex-wrap gap-4 items-center">
        <div>
          <label class="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('intensity')}</label>
          <select
            value={intensity}
            onchange={(e) => intensity = e.target.value as Intensity}
            class="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white"
          >
            <option value="light">{t('light')}</option>
            <option value="medium">{t('medium')}</option>
            <option value="strong">{t('strong')}</option>
          </select>
        </div>
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            bind:checked={addFillers}
            class="w-4 h-4"
          />
          <span class="text-sm text-gray-600 dark:text-gray-300">{t('addFillers')}</span>
        </label>
      </div>

      <div class="flex flex-wrap gap-2">
        <button onclick={humanize} class="btn-primary">
          {t('humanize')}
        </button>
        <button onclick={copyOutput} disabled={!output} class="btn-secondary">
          {copied ? tg('copied') : tg('copy')}
        </button>
        <button onclick={clearAll} class="btn-secondary">
          {tg('clear')}
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm text-gray-600 dark:text-gray-300 mb-2">{tg('input')}</label>
          <textarea
            bind:value={input}
            class="w-full h-64 bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
            placeholder={t('inputPlaceholder')}></textarea>
        </div>
        <div>
          <label class="block text-sm text-gray-600 dark:text-gray-300 mb-2">{tg('output')}</label>
          <textarea
            value={output}
            readOnly
            class="w-full h-64 bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"></textarea>
        </div>
      </div>
    </div>
  
