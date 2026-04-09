<script lang="ts">
  import { K, SAMPLE_MARKDOWN, convertMarkdownToHtml } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['markdown-to-html-converter'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.markdown-to-html-converter.${key}`;
  }
  function tCommon(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  interface ConversionOptions {
  sanitize: boolean;
  gfm: boolean;
  breaks: boolean;
  headerIds: boolean;
  codeHighlight: boolean;
}

  let markdown = $state(SAMPLE_MARKDOWN);

  let options = $state({
    sanitize: true,
    gfm: true,
    breaks: false,
    headerIds: true,
    codeHighlight: true,
  });

  let viewMode = $state('html');

  let copied = $state(false);

  let html = $derived(convertMarkdownToHtml(markdown, options));

  function handleCopy() {
    navigator.clipboard.writeText(html);
    copied = true;
    setTimeout(() => copied = false, 2000);
  }

  function updateOption(key: K, value: ConversionOptions[K]) {
    options = ({ ...options, [key]: value });
  }

</script>


    <div class="space-y-6">
      <div class="flex flex-wrap gap-4">
        <label class="flex items-center gap-2">
          <input type="checkbox" checked={options.gfm} onchange={(e) => updateOption('gfm', e.target.checked)} class="rounded" />
          <span class="text-sm text-gray-700 dark:text-gray-300">{t('gfm')}</span>
        </label>
        <label class="flex items-center gap-2">
          <input type="checkbox" checked={options.breaks} onchange={(e) => updateOption('breaks', e.target.checked)} class="rounded" />
          <span class="text-sm text-gray-700 dark:text-gray-300">{t('lineBreaks')}</span>
        </label>
        <label class="flex items-center gap-2">
          <input type="checkbox" checked={options.headerIds} onchange={(e) => updateOption('headerIds', e.target.checked)} class="rounded" />
          <span class="text-sm text-gray-700 dark:text-gray-300">{t('headerIds')}</span>
        </label>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('markdownInput')}
          </label>
          <textarea
            bind:value={markdown}
            placeholder={t("inputPlaceholder")}
            rows={16}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm resize-none"></textarea>
        </div>

        <div>
          <div class="flex justify-between items-center mb-2">
            <div class="flex gap-2">
              <button
                onclick={() => viewMode = 'html'}
                class={`px-3 py-1 text-sm rounded ${viewMode === 'html' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
              >
                HTML
              </button>
              <button
                onclick={() => viewMode = 'preview'}
                class={`px-3 py-1 text-sm rounded ${viewMode === 'preview' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
              >
                {t('preview')}
              </button>
            </div>
            <button
              onclick={handleCopy}
              class="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              {copied ? tCommon('copied') : tCommon('copy')}
            </button>
          </div>
          
          {#if viewMode === 'html'}
<pre class="h-96 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-auto text-xs font-mono text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
              {html}
            </pre>
{:else}
<div 
              class="h-96 p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg overflow-auto prose dark:prose-invert prose-sm max-w-none">{@html html}</div>
{/if}
        </div>
      </div>

      <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('supportedSyntax')}</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-600 dark:text-gray-400">
          <div># {t('headers')}</div>
          <div>**{t('bold')}** *{t('italic')}*</div>
          <div>[{t('links')}](url)</div>
          <div>![{t('images')}](url)</div>
          <div>- {t('lists')}</div>
          <div>1. {t('ordered')}</div>
          <div>&gt; {t('quotes')}</div>
          <div>`{t('code')}`</div>
        </div>
      </div>
    </div>
  
