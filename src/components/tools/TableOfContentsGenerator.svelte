<script lang="ts">
  import { K, SAMPLE_INPUT, generateHtmlToc, generateToc, parseTocInput } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['table-of-contents-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.table-of-contents-generator.${key}`;
  }
  function tCommon(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  interface TocEntry {
  title: string;
  page?: string;
  children: TocEntry[];
}
  interface TocOptions {
  style: 'dotted' | 'lined' | 'simple' | 'numbered';
  showPageNumbers: boolean;
  indentSize: number;
}

  let input = $state(SAMPLE_INPUT);

  let options = $state({
    style: 'dotted',
    showPageNumbers: true,
    indentSize: 4,
  });

  let outputFormat = $state('text');

  let copied = $state(false);

  let entries = $derived(parseTocInput(input));

  let output = $derived.by(() => {
    if (outputFormat === 'html') {
      return generateHtmlToc(entries, options);
    }
    return generateToc(entries, options);
  });

  function handleCopy() {
    navigator.clipboard.writeText(output);
    copied = true;
    setTimeout(() => copied = false, 2000);
  }

  function updateOption(key: K, value: TocOptions[K]) {
    options = ({ ...options, [key]: value });
  }

</script>


    <div class="space-y-6">
      <div class="flex flex-wrap gap-4 items-center">
        <div>
          <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">Style</label>
          <select
            value={options.style}
            onchange={(e) => updateOption('style', e.target.value as TocOptions['style'])}
            class="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="dotted">Dotted</option>
            <option value="lined">Lined</option>
            <option value="simple">Simple</option>
            <option value="numbered">Numbered</option>
          </select>
        </div>
        <div>
          <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">Output</label>
          <select
            value={outputFormat}
            onchange={(e) => outputFormat = e.target.value as 'text' | 'html'}
            class="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="text">Plain Text</option>
            <option value="html">HTML</option>
          </select>
        </div>
        <div>
          <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">Indent</label>
          <select
            value={options.indentSize}
            onchange={(e) => updateOption('indentSize', parseInt(e.target.value))}
            class="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
            <option value={6}>6 spaces</option>
          </select>
        </div>
        <label class="flex items-center gap-2 mt-4">
          <input type="checkbox" checked={options.showPageNumbers} onchange={(e) => updateOption('showPageNumbers', e.target.checked)} class="rounded" />
          <span class="text-sm text-gray-700 dark:text-gray-300">Page Numbers</span>
        </label>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            TOC Entries (use indentation for hierarchy)
          </label>
          <textarea
            bind:value={input}
            placeholder={t("inputPlaceholder")}
            rows={14}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm resize-none"></textarea>
          <p class="text-xs text-gray-500 mt-1">Format: Title | Page (page is optional)</p>
        </div>

        <div>
          <div class="flex justify-between items-center mb-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Generated Table of Contents
            </label>
            <button
              onclick={handleCopy}
              class="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              {copied ? tCommon('copied') : tCommon('copy')}
            </button>
          </div>
          <pre class="h-80 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-auto text-sm font-mono text-gray-800 dark:text-gray-200 whitespace-pre">
            {output || 'Enter entries to generate TOC'}
          </pre>
        </div>
      </div>

      <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 class="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">Input Format</h3>
        <div class="text-xs text-blue-700 dark:text-blue-300 font-mono">
          <p>Chapter Title | 1</p>
          <p>&nbsp;&nbsp;Section | 3 &nbsp;&nbsp;&nbsp;← 2 spaces = level 1</p>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;Subsection | 5 &nbsp;← 4 spaces = level 2</p>
        </div>
      </div>
    </div>
  
