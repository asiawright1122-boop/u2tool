<script lang="ts">
  import { escapeHtmlAttribute, sanitizeHtml } from '@/lib/sanitize';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const toolTranslations = translations['tool'] as Record<string, unknown> | undefined;
    const scope = (toolTranslations?.['wordToHtml'] as Record<string, unknown> | undefined) || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tool.wordToHtml.${key}`;
  }
  function tc(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  let html = $state('');

  let loading = $state(false);

  let error = $state('');

  let fileName = $state('');

  let showPreview = $state(true);

  async function convertToHtml(file: File) {
    loading = true;
    error = '';
    html = '';
    fileName = file.name;

    try {
      const mammoth = await import('mammoth');
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.default.convertToHtml({ arrayBuffer });
      html = sanitizeHtml(result.value, { forceBody: true });
    } catch {
      error = t('errorParsing');
    } finally {
      loading = false;
    }
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.name.endsWith('.docx')) {
      convertToHtml(file);
    } else {
      error = t('errorInvalidFile');
    }
  }

  // Functions
  function handleFileChange(e: Event) {
    const file = e.target.files?.[0];
    if (file) convertToHtml(file);
  }
  function copyToClipboard() { return navigator.clipboard.writeText(html); }
  function downloadHtml() {
    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>${escapeHtmlAttribute(fileName)}</title></head>
<body>${html}</body>
</html>`;
    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName.replace('.docx', '.html');
    a.click();
    URL.revokeObjectURL(url);
  }

</script>


    <div class="space-y-6">
      <div
        ondrop={handleDrop}
        ondragover={(e) => e.preventDefault()}
        class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-amber-500 transition-colors"
      >
        <input
          type="file"
          accept=".docx"
          onchange={handleFileChange}
          class="hidden"
          id="word-html-input"
        />
        <label for="word-html-input" class="cursor-pointer">
          <div class="text-4xl mb-4"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg></div>
          <p class="text-gray-600 dark:text-gray-400">{t('dropzone')}</p>
          <p class="text-sm text-gray-500 mt-2">DOCX → HTML</p>
        </label>
      </div>

      {#if loading}
<div class="text-center py-4">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto"></div>
          <p class="mt-2 text-gray-600 dark:text-gray-400">{t('converting')}</p>
        </div>
{/if}

      {#if error}
<div class="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
          {error}
        </div>
{/if}

      {#if html}
<div class="space-y-4">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-600 dark:text-gray-400">{fileName}</div>
            <div class="flex gap-2">
              <button
                onclick={() => showPreview = !showPreview}
                class="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {showPreview ? t('showCode') : t('showPreview')}
              </button>
              <button
                onclick={copyToClipboard}
                class="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {tc('copy')}
              </button>
              <button
                onclick={downloadHtml}
                class="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
              >
                {tc('download')} HTML
              </button>
            </div>
          </div>
          {#if showPreview}
<div
              class="w-full min-h-96 p-4 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 prose dark:prose-invert max-w-none">{@html html}</div>
{:else}
<textarea
              value={html}
              readOnly
              class="w-full h-96 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700 font-mono text-sm"></textarea>
{/if}
        </div>
{/if}
    </div>
  
