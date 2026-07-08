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

  let input = $state('');

  let output = $state('');

  let mode = $state('encode');

  let copied = $state(false);

  let timerRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  const entities: Record<string, string> = {
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;',
    '©': '&copy;', '®': '&reg;', '™': '&trade;', '€': '&euro;', '£': '&pound;',
    '¥': '&yen;', '¢': '&cent;', '§': '&sect;', '°': '&deg;', '±': '&plusmn;',
    '×': '&times;', '÷': '&divide;', '≠': '&ne;', '≤': '&le;', '≥': '&ge;',
    '∞': '&infin;', '←': '&larr;', '→': '&rarr;', '↑': '&uarr;', '↓': '&darr;',
    '♠': '&spades;', '♣': '&clubs;', '♥': '&hearts;', '♦': '&diams;',
    ' ': '&nbsp;', '—': '&mdash;', '–': '&ndash;', '…': '&hellip;'
  };
  const reverseEntities = Object.fromEntries(Object.entries(entities).map(([k, v]) => [v, k]));
  function convert() {
    if (mode === 'encode') {
      let result = input;
      for (const [char, entity] of Object.entries(entities)) {
        result = result.split(char).join(entity);
      }
      output = result;
    } else {
      let result = input;
      for (const [entity, char] of Object.entries(reverseEntities)) {
        result = result.split(entity).join(char);
      }
      result = result.replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code)));
      result = result.replace(/&#x([0-9a-fA-F]+);/g, (_, code) => String.fromCharCode(parseInt(code, 16)));
      output = result;
    }
  }
  async function copy() {
    await navigator.clipboard.writeText(output);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }

</script>


    <div class="space-y-4">
      <div class="flex gap-2">
        <button onclick={() => mode = 'encode'} class={`px-4 py-2 rounded ${mode === 'encode' ? 'bg-amber-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'}`}>{t('encode')}</button>
        <button onclick={() => mode = 'decode'} class={`px-4 py-2 rounded ${mode === 'decode' ? 'bg-amber-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'}`}>{t('decode')}</button>
      </div>
      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label for="html-entity-converter-field-4" class="tool-label">{t('input')}</label>
          <textarea bind:value={input} class="tool-textarea" placeholder={mode === 'encode' ? '<div>Hello & World</div>' : '&lt;div&gt;Hello &amp; World&lt;/div&gt;'} id="html-entity-converter-field-4"></textarea>
        </div>
        <div>
          <label for="html-entity-converter-field-3" class="tool-label">{t('output')}</label>
          <textarea value={output} readOnly class="tool-textarea" id="html-entity-converter-field-3"></textarea>
        </div>
      </div>
      <div class="flex gap-2">
        <button onclick={convert} class="btn-primary">{t('convert')}</button>
        <button onclick={copy} class="btn-secondary">{copied ? t('copied') : t('copy')}</button>
      </div>
      <div class="tool-panel">
        <h3 class="font-medium mb-2 text-gray-900 dark:text-white">{t('htmlEntity.common')}</h3>
        <div class="grid grid-cols-4 md:grid-cols-8 gap-2 text-sm">
          {#each Object.entries(entities).slice(0, 24) as [char, entity] (entity)}
<div  class="bg-gray-200 dark:bg-gray-700 rounded p-2 text-center">
              <span class="text-lg text-gray-900 dark:text-white">{char}</span>
              <p class="text-xs text-gray-600 dark:text-gray-300 truncate">{entity}</p>
            </div>
{/each}
        </div>
      </div>
    </div>
  
