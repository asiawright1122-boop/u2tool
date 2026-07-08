<script lang="ts">
  import { onDestroy } from 'svelte';
  import { toPinyin } from '@/lib/tool-stubs';

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

  let input = $state('');

  let withTone = $state(true);

  let output = $state('');

  let copied = $state(false);

  let timerRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function convert() {
    if (!input.trim()) {
      output = '';
      return;
    }
    output = toPinyin(input, withTone);
  }
  async function copyOutput() {
    await navigator.clipboard.writeText(output);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }

</script>


    <div class="space-y-4">
      <div>
        <label for="pinyin-converter-field-3" class="block text-sm font-medium mb-2">{t('input')}</label>
        <textarea
          class="tool-textarea"
          bind:value={input}
          placeholder={t('pinyin.placeholder')}
          rows={4} id="pinyin-converter-field-3"></textarea>
      </div>

      <div class="flex items-center gap-4">
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            bind:checked={withTone}
            class="w-4 h-4 rounded"
          />
          <span class="text-sm">{t('pinyin.withTone')}</span>
        </label>
      </div>

      <div class="flex flex-wrap gap-2">
        <button onclick={convert} class="btn-primary">
          {t('convert')}
        </button>
        <button onclick={() => { input = ''; output = ''; }} class="btn-secondary">
          {t('clear')}
        </button>
      </div>

      {#if output}
<div>
          <div class="flex justify-between items-center mb-2">
            <div class="text-sm font-medium">{t('output')}</div>
            <button
              onclick={copyOutput}
              class={`text-sm px-3 py-1 rounded text-white ${copied ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600'}`}
            >
              {copied ? t('copied') : t('copy')}
            </button>
          </div>
          <textarea
            class="tool-textarea"
            value={output}
            readOnly
            rows={4}></textarea>
        </div>
{/if}

      <div class="text-xs text-gray-600 dark:text-gray-300">
        {t('pinyin.note')}
      </div>
    </div>
  
