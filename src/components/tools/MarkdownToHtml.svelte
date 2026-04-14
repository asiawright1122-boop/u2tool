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

  // Imports
  import { sanitizeMarkdownHtml } from '@/lib/sanitize';

  let markdown = $state('');

  let copied = $state(false);

  let timerRef = $state(null);

  let html = $derived(sanitizeMarkdownHtml(convertToHtml(markdown)));  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function convertToHtml(md: string): string {
    let html = md;

    // Headers
    html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');

    // Italic
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/_(.*?)_/g, '<em>$1</em>');

    // Code blocks
    html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

    // Inline code
    html = html.replace(/`(.*?)`/g, '<code>$1</code>');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

    // Images
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');

    // Unordered lists
    html = html.replace(/^\* (.*$)/gm, '<li>$1</li>');
    html = html.replace(/^- (.*$)/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');

    // Ordered lists
    html = html.replace(/^\d+\. (.*$)/gm, '<li>$1</li>');

    // Blockquotes
    html = html.replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>');

    // Horizontal rule
    html = html.replace(/^---$/gm, '<hr />');

    // Line breaks
    html = html.replace(/\n\n/g, '</p><p>');
    html = html.replace(/\n/g, '<br />');

    // Wrap in paragraph if not already wrapped
    if (!html.startsWith('<')) {
      html = '<p>' + html + '</p>';
    }

    return html;
  }
  function copyHtml() {
    navigator.clipboard.writeText(html);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }

</script>


    <div class="space-y-4">
      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm text-gray-600 dark:text-gray-300 mb-1">Markdown</label>
          <textarea
            bind:value={markdown}
            class="w-full h-64 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded p-3 font-mono text-sm text-gray-900 dark:text-gray-100"
            placeholder={t('mdToHtml.mdPlaceholder')}></textarea>
        </div>
        <div>
          <div class="flex justify-between items-center mb-1">
            <label class="text-sm text-gray-600 dark:text-gray-300">HTML</label>
            <button onclick={copyHtml} class="text-sm text-amber-600 dark:text-amber-400 hover:text-amber-500 dark:hover:text-amber-300">
              {copied ? t('copied') : t('copy')}
            </button>
          </div>
          <textarea
            value={html}
            readOnly
            class="w-full h-64 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded p-3 font-mono text-sm text-green-600 dark:text-green-400"></textarea>
        </div>
      </div>

      <div>
        <label class="block text-sm text-gray-600 dark:text-gray-300 mb-2">{t('mdToHtml.preview')}</label>
        <div
          class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded p-4 prose prose-sm max-w-none">{@html html}</div>
      </div>
    </div>
  
