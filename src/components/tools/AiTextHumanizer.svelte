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
      <div class="flex flex-wrap gap-6 items-center glass-card p-6 !rounded-2xl">
        <div class="flex items-center gap-3">
          <label class="tool-label !mb-0">{t('intensity')}</label>
          <select
            value={intensity}
            onchange={(e) => intensity = e.target.value as Intensity}
            class="tool-select !py-2 !px-4 min-w-[140px]"
          >
            <option value="light">{t('light')}</option>
            <option value="medium">{t('medium')}</option>
            <option value="strong">{t('strong')}</option>
          </select>
        </div>
        <label class="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            bind:checked={addFillers}
            class="w-5 h-5 rounded border-slate-300 dark:border-white/10 text-amber-500 focus:ring-amber-500/20 transition-all cursor-pointer"
          />
          <span class="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 group-hover:text-amber-500 transition-colors">{t('addFillers')}</span>
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

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-3">
          <label class="tool-label">{tg('input')}</label>
          <textarea
            bind:value={input}
            class="tool-textarea h-80 resize-none"
            placeholder={t('inputPlaceholder')}></textarea>
        </div>
        <div class="space-y-3">
          <label class="tool-label">{tg('output')}</label>
          <textarea
            value={output}
            readOnly
            class="tool-textarea h-80 resize-none bg-slate-50/30 dark:bg-white/5 border-amber-500/10"
            placeholder={t('outputPlaceholder')}></textarea>
        </div>
      </div>
    </div>
  
