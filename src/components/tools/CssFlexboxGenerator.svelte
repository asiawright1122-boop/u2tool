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

  let flexDirection = $state('row');

  let justifyContent = $state('flex-start');

  let alignItems = $state('stretch');

  let flexWrap = $state('nowrap');

  let gap = $state(16);

  let itemCount = $state(5);

  let copied = $state(false);

  let timerRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function generateCSS() {
    return `.flex-container {
  display: flex;
  flex-direction: ${flexDirection};
  justify-content: ${justifyContent};
  align-items: ${alignItems};
  flex-wrap: ${flexWrap};
  gap: ${gap}px;
}

.flex-item {
  /* Add your item styles here */
}`;
  }
  const css = generateCSS();
  async function copyCSS() {
    await navigator.clipboard.writeText(css);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }

</script>


    <div class="space-y-6">
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <label for="css-flexbox-generator-field-14" class="block text-sm font-medium mb-2">{t('cssFlexboxGenerator.direction')}</label>
          <select bind:value={flexDirection} class="tool-input" id="css-flexbox-generator-field-14">
            <option value="row">{t('cssFlexboxGenerator.directionRow')}</option>
            <option value="row-reverse">{t('cssFlexboxGenerator.directionRowReverse')}</option>
            <option value="column">{t('cssFlexboxGenerator.directionColumn')}</option>
            <option value="column-reverse">{t('cssFlexboxGenerator.directionColumnReverse')}</option>
          </select>
        </div>
        <div>
          <label for="css-flexbox-generator-field-13" class="block text-sm font-medium mb-2">{t('cssFlexboxGenerator.justifyContent')}</label>
          <select bind:value={justifyContent} class="tool-input" id="css-flexbox-generator-field-13">
            <option value="flex-start">{t('cssFlexboxGenerator.justifyFlexStart')}</option>
            <option value="flex-end">{t('cssFlexboxGenerator.justifyFlexEnd')}</option>
            <option value="center">{t('cssFlexboxGenerator.justifyCenter')}</option>
            <option value="space-between">{t('cssFlexboxGenerator.justifySpaceBetween')}</option>
            <option value="space-around">{t('cssFlexboxGenerator.justifySpaceAround')}</option>
            <option value="space-evenly">{t('cssFlexboxGenerator.justifySpaceEvenly')}</option>
          </select>
        </div>
        <div>
          <label for="css-flexbox-generator-field-12" class="block text-sm font-medium mb-2">{t('cssFlexboxGenerator.alignItems')}</label>
          <select bind:value={alignItems} class="tool-input" id="css-flexbox-generator-field-12">
            <option value="stretch">{t('cssFlexboxGenerator.alignStretch')}</option>
            <option value="flex-start">{t('cssFlexboxGenerator.alignFlexStart')}</option>
            <option value="flex-end">{t('cssFlexboxGenerator.alignFlexEnd')}</option>
            <option value="center">{t('cssFlexboxGenerator.alignCenter')}</option>
            <option value="baseline">{t('cssFlexboxGenerator.alignBaseline')}</option>
          </select>
        </div>
        <div>
          <label for="css-flexbox-generator-field-11" class="block text-sm font-medium mb-2">{t('cssFlexboxGenerator.flexWrap')}</label>
          <select bind:value={flexWrap} class="tool-input" id="css-flexbox-generator-field-11">
            <option value="nowrap">{t('cssFlexboxGenerator.wrapNoWrap')}</option>
            <option value="wrap">{t('cssFlexboxGenerator.wrapWrap')}</option>
            <option value="wrap-reverse">{t('cssFlexboxGenerator.wrapWrapReverse')}</option>
          </select>
        </div>
        <div>
          <label for="css-flexbox-generator-field-10" class="block text-sm font-medium mb-2">{t('cssFlexboxGenerator.gap')}</label>
          <input
            type="number"
            min={0}
            value={gap}
            onchange={(e) => gap = parseInt(e.target.value) || 0}
            class="tool-input" id="css-flexbox-generator-field-10" />
        </div>
        <div>
          <label for="css-flexbox-generator-field-9" class="block text-sm font-medium mb-2">{t('cssFlexboxGenerator.items')}</label>
          <input
            type="number"
            min={1}
            max={12}
            value={itemCount}
            onchange={(e) => itemCount = parseInt(e.target.value) || 1}
            class="tool-input" id="css-flexbox-generator-field-9" />
        </div>
      </div>

      <!-- Preview -->
      <div>
        <div class="block text-sm font-medium text-gray-900 dark:text-white mb-2">{t('cssFlexboxGenerator.preview')}</div>
        <div
          class="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg min-h-[200px]"
          style="display: flex; flex-direction: flexDirection as 'row' | 'row-reverse' | 'column' | 'column-reverse'; flex-wrap: flexWrap as 'nowrap' | 'wrap' | 'wrap-reverse'; gap: {gap}px"
        >
          {#each Array.from({ length: itemCount }) as _, i (i)}
<div 
              class="bg-slate-600/50 border border-slate-400 rounded p-4 text-center text-gray-900 dark:text-white"
              style="min-width: 60px; min-height: 60px"
            >
              {i + 1}
            </div>
{/each}
        </div>
      </div>

      <!-- CSS Output -->
      <div>
        <div class="flex justify-between items-center mb-2">
          <div class="text-sm font-medium">{t('cssFlexboxGenerator.generatedCss')}</div>
          <button
            onclick={copyCSS}
            class={`text-sm px-3 py-1 rounded ${copied ? 'bg-emerald-500' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            {copied ? t('copied') : t('copy')}
          </button>
        </div>
        <pre class="tool-textarea font-mono text-sm">{css}</pre>
      </div>

      <!-- Quick Reference -->
      <div class="p-4 bg-gray-100 dark:bg-gray-800/50 rounded-lg">
        <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-3">{t('cssFlexboxGenerator.quickReference')}</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300">
          <div>
            <p class="font-medium text-gray-900 dark:text-white mb-1">justify-content</p>
            <p>{t('cssFlexboxGenerator.quickReferenceJustify')}</p>
          </div>
          <div>
            <p class="font-medium text-gray-900 dark:text-white mb-1">align-items</p>
            <p>{t('cssFlexboxGenerator.quickReferenceAlign')}</p>
          </div>
          <div>
            <p class="font-medium text-gray-900 dark:text-white mb-1">flex-direction</p>
            <p>{t('cssFlexboxGenerator.quickReferenceDirection')}</p>
          </div>
          <div>
            <p class="font-medium text-gray-900 dark:text-white mb-1">flex-wrap</p>
            <p>{t('cssFlexboxGenerator.quickReferenceWrap')}</p>
          </div>
        </div>
      </div>
    </div>
  
