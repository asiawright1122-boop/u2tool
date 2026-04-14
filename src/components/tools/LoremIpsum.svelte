<script lang="ts">
  import { onDestroy } from 'svelte';
  import { generateParagraph, generateSentence, generateWords } from '@/lib/tool-stubs';

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

  let type = $state('paragraphs');

  let count = $state(3);

  let output = $state('');

  let copied = $state(false);

  let timerRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function generate() {
    let result = '';
    switch (type) {
      case 'paragraphs':
        const paragraphs: string[] = [];
        for (let i = 0; i < count; i++) {
          paragraphs.push(generateParagraph());
        }
        result = paragraphs.join('\n\n');
        break;
      case 'sentences':
        const sentences: string[] = [];
        for (let i = 0; i < count; i++) {
          sentences.push(generateSentence());
        }
        result = sentences.join(' ');
        break;
      case 'words':
        result = generateWords(count);
        break;
    }
    output = result;
  }
  async function copyOutput() {
    await navigator.clipboard.writeText(output);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }

</script>


    <div class="space-y-4">
      <div class="flex flex-wrap gap-4 items-end">
        <div>
          <label for="lorem-type" class="tool-label">{t('lorem.type')}</label>
          <select
            id="lorem-type"
            name="loremType"
            value={type}
            onchange={(e) => type = e.target.value as typeof type}
            class="tool-input h-[42px]"
          >
            <option value="paragraphs">{t('lorem.paragraphs')}</option>
            <option value="sentences">{t('lorem.sentences')}</option>
            <option value="words">{t('lorem.words')}</option>
          </select>
        </div>

        <div>
          <label for="lorem-count" class="tool-label">{t('count')}</label>
          <input
            id="lorem-count"
            name="loremCount"
            type="number"
            min="1"
            max="100"
            value={count}
            onchange={(e) => count = Math.min(100, Math.max(1, parseInt(e.target.value) || 1))}
            class="w-24 tool-input h-[42px]"
          />
        </div>

        <button onclick={generate} class="btn-primary h-[42px]">
          {t('generate')}
        </button>
      </div>

      {#if output}
<div>
          <div class="flex justify-between items-center mb-2">
            <label class="tool-label mb-0">{t('output')}</label>
            <button
              onclick={copyOutput}
              class={`text-sm px-3 py-1 rounded text-white ${copied ? 'bg-emerald-500' : 'bg-gray-600 dark:bg-gray-700 hover:bg-gray-500 dark:hover:bg-gray-600'}`}
            >
              {copied ? t('copied') : t('copy')}
            </button>
          </div>
          <textarea
            class="tool-textarea h-64"
            value={output}
            readOnly></textarea>
        </div>
{/if}
    </div>
  
