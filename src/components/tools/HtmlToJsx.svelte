<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['html-to-jsx'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.html-to-jsx.${key}`;
  }

  let html = $state('');

  let jsx = $state('');

  let copied = $state(false);

  let timerRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function convert() {
    let result = html
      .replace(/class=/g, 'className=')
      .replace(/for=/g, 'htmlFor=')
      .replace(/tabindex=/g, 'tabIndex=')
      .replace(/readonly/g, 'readOnly')
      .replace(/maxlength=/g, 'maxLength=')
      .replace(/cellpadding=/g, 'cellPadding=')
      .replace(/cellspacing=/g, 'cellSpacing=')
      .replace(/colspan=/g, 'colSpan=')
      .replace(/rowspan=/g, 'rowSpan=')
      .replace(/frameborder=/g, 'frameBorder=')
      .replace(/allowfullscreen/g, 'allowFullScreen')
      .replace(/autocomplete=/g, 'autoComplete=')
      .replace(/autofocus/g, 'autoFocus')
      .replace(/<!--[\s\S]*?-->/g, '{/* $& */}')
      .replace(/style="([^"]*)"/g, (_, styles) => {
        const obj = styles.split(';').filter(Boolean).map((s: string) => {
          const [key, val] = s.split(':').map((x: string) => x.trim());
          const camelKey = key.replace(/-([a-z])/g, (_: string, c: string) => c.toUpperCase());
          return `${camelKey}: '${val}'`;
        }).join(', ');
        return `style=""}`;
      });
    // Self-closing tags
    result = result.replace(/<(img|input|br|hr|meta|link)([^>]*)>/gi, '<$1$2 />');
    jsx = result;
  }
  async function copy() {
    await navigator.clipboard.writeText(jsx);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }

</script>


    <div class="space-y-4">
      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label for="html-to-jsx-field-4" class="block text-sm font-medium mb-2 text-gray-900 dark:text-white">{t('htmlInput')}</label>
          <textarea bind:value={html} class="w-full h-64 p-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg font-mono text-sm text-gray-900 dark:text-white" placeholder={t('placeholder')} id="html-to-jsx-field-4"></textarea>
        </div>
        <div>
          <label for="html-to-jsx-field-3" class="block text-sm font-medium mb-2 text-gray-900 dark:text-white">{t('jsxOutput')}</label>
          <textarea value={jsx} readOnly class="w-full h-64 p-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg font-mono text-sm text-gray-900 dark:text-white" id="html-to-jsx-field-3"></textarea>
        </div>
      </div>
      <div class="flex gap-2">
        <button onclick={convert} class="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700">{t('convert')}</button>
        <button onclick={copy} class="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-700">{copied ? t('copy') : t('copy')}</button>
      </div>
    </div>
  
