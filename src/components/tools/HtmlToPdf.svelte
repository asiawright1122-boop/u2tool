<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['html-to-pdf'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.html-to-pdf.${key}`;
  }

  let html = $state('');

  let pageSize = $state('a4');

  let orientation = $state('portrait');

  let margin = $state(20);

  let timerRef = $state(null);

  let iframeRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  const defaultHtml = `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; }
    h1 { color: #333; }
    p { line-height: 1.6; }
  </style>
</head>
<body>
  <h1>Hello World</h1>
  <p>This is a sample HTML document that will be converted to PDF.</p>
</body>
</html>`;
  function generatePdf() {
    const content = html || defaultHtml;
    const iframe = iframeRef;
    if (!iframe) return;

    const doc = iframe.contentDocument;
    if (!doc) return;

    doc.open();
    doc.write(content);
    doc.close();

    setTimeout(() => {
      iframe.contentWindow?.print();
    }, 500);
  }
  function previewHtml() {
    const iframe = iframeRef;
    if (!iframe) return;

    const doc = iframe.contentDocument;
    if (!doc) return;

    doc.open();
    doc.write(html || defaultHtml);
    doc.close();
  }

</script>


    <div class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div>
            <label class="tool-label">
              {t('htmlInput')}
            </label>
            <textarea
              bind:value={html}
              placeholder={t('placeholder')}
              class="w-full h-80 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm"></textarea>
          </div>

          <div class="grid grid-cols-3 gap-4">
            <div>
              <label class="tool-label">
                {t('pageSize')}
              </label>
              <select
                bind:value={pageSize}
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="a4">A4</option>
                <option value="letter">Letter</option>
                <option value="legal">Legal</option>
              </select>
            </div>
            <div>
              <label class="tool-label">
                {t('orientation')}
              </label>
              <select
                value={orientation}
                onchange={(e) => orientation = e.target.value as 'portrait' | 'landscape'}
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="portrait">{t('portrait')}</option>
                <option value="landscape">{t('landscape')}</option>
              </select>
            </div>
            <div>
              <label class="tool-label">
                {t('margin')} (mm)
              </label>
              <input
                type="number"
                value={margin}
                onchange={(e) => margin = Number(e.target.value)}
                min="0"
                max="50"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div class="flex gap-4">
            <button
              onclick={previewHtml}
              class="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              {t('preview')}
            </button>
            <button
              onclick={generatePdf}
              class="flex-1 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
            >
              {t('generatePdf')}
            </button>
          </div>

          <button
            onclick={() => html = defaultHtml}
            class="w-full px-4 py-2 text-sm text-amber-600 hover:text-amber-700 dark:text-amber-400"
          >
            {t('loadExample')}
          </button>
        </div>

        <div>
          <label class="tool-label">
            {t('previewLabel')}
          </label>
          <div class="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white">
            <iframe
              bind:this={iframeRef}
              class="w-full h-96"
              title="HTML Preview"></iframe>
          </div>
        </div>
      </div>

      <div class="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <p class="text-sm text-yellow-700 dark:text-yellow-300">
          {t('printNote')}
        </p>
      </div>
    </div>
  
