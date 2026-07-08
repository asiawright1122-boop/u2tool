<script lang="ts">
  import { SAMPLE_CONTENT, buildOutlineTree, extractHeadings, generateOutline } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['document-outline-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.document-outline-generator.${key}`;
  }
  function tCommon(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  interface OutlineItem {
  level: number;
  text: string;
  id: string;
  children: OutlineItem[];
}
  interface OutlineOptions {
  format: 'markdown' | 'html' | 'text';
  numbered: boolean;
  maxDepth: number;
  includeLinks: boolean;
}

  let content = $state(SAMPLE_CONTENT);

  let options = $state({
    format: 'markdown',
    numbered: false,
    maxDepth: 6,
    includeLinks: true,
  });

  let copied = $state(false);

  let headings = $derived(extractHeadings(content));

  let outlineTree = $derived(buildOutlineTree(headings));

  let outline = $derived(generateOutline(outlineTree, options));

  function handleCopy() {
    navigator.clipboard.writeText(outline);
    copied = true;
    setTimeout(() => copied = false, 2000);
  }

  function updateOption<Key extends keyof OutlineOptions>(key: Key, value: OutlineOptions[Key]) {
    options = ({ ...options, [key]: value });
  }

</script>


    <div class="space-y-6">
      <div class="flex flex-wrap gap-4 items-center">
        <div>
          <label for="document-outline-generator-field-7" class="block text-xs text-gray-500 dark:text-gray-400 mb-1">Format</label>
          <select
            value={options.format}
            onchange={(e) => updateOption('format', e.target.value as OutlineOptions['format'])}
            class="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" id="document-outline-generator-field-7">
            <option value="markdown">Markdown</option>
            <option value="html">HTML</option>
            <option value="text">Plain Text</option>
          </select>
        </div>
        <div>
          <label for="document-outline-generator-field-6" class="block text-xs text-gray-500 dark:text-gray-400 mb-1">Max Depth</label>
          <select
            value={options.maxDepth}
            onchange={(e) => updateOption('maxDepth', parseInt(e.target.value))}
            class="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" id="document-outline-generator-field-6">
            {#each [1, 2, 3, 4, 5, 6] as n (n)}
<option  value={n}>H1-H{n}</option>
{/each}
          </select>
        </div>
        <label class="flex items-center gap-2 mt-4">
          <input type="checkbox" checked={options.numbered} onchange={(e) => updateOption('numbered', e.target.checked)} class="rounded" />
          <span class="text-sm text-gray-700 dark:text-gray-300">Numbered</span>
        </label>
        <label class="flex items-center gap-2 mt-4">
          <input type="checkbox" checked={options.includeLinks} onchange={(e) => updateOption('includeLinks', e.target.checked)} class="rounded" />
          <span class="text-sm text-gray-700 dark:text-gray-300">Include Links</span>
        </label>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label for="document-outline-generator-field-5" class="tool-label">
            Document Content
          </label>
          <textarea
            bind:value={content}
            placeholder={t("inputPlaceholder")}
            rows={16}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm resize-none" id="document-outline-generator-field-5"></textarea>
        </div>

        <div>
          <div class="flex justify-between items-center mb-2">
            <div class="tool-label">
              Generated Outline ({headings.length} headings)
            </div>
            <button
              onclick={handleCopy}
              class="text-sm text-amber-600 hover:text-amber-700 dark:text-amber-400"
            >
              {copied ? tCommon('copied') : tCommon('copy')}
            </button>
          </div>
          <pre class="h-96 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-auto text-sm font-mono text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
            {outline || 'No headings found'}
          </pre>
        </div>
      </div>

      <div class="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
        <h3 class="text-sm font-medium text-amber-800 dark:text-amber-200 mb-2">Supported Formats</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-amber-700 dark:text-amber-300">
          <div>
            <strong>Markdown:</strong>
            <code class="block mt-1 bg-amber-100 dark:bg-amber-800/30 p-1 rounded"># Heading 1<br/>## Heading 2</code>
          </div>
          <div>
            <strong>HTML:</strong>
            <code class="block mt-1 bg-amber-100 dark:bg-amber-800/30 p-1 rounded">&lt;h1&gt;Heading&lt;/h1&gt;<br/>&lt;h2&gt;Heading&lt;/h2&gt;</code>
          </div>
        </div>
      </div>
    </div>
  
