<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['htmlPreview'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.htmlPreview.${key}`;
  }

  let html = $state(`<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; }
    h1 { color: #3b82f6; }
    .box { background: #f0f0f0; padding: 15px; border-radius: 8px; }
  </style>
</head>
<body>
  <h1>Hello World!</h1>
  <div class="box">
    <p>This is a preview of your HTML code.</p>
  </div>
</body>
</html>`);

  let previewKey = $state(0);

  // Functions
  function refreshPreview() {
    previewKey = previewKey + 1;
  }
  function clearAll() {
    html = '';
    previewKey = previewKey + 1;
  }

</script>

<div class="space-y-4">
  <div class="flex gap-2 mb-2">
    <button
      onclick={refreshPreview}
      class="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
    >
      {t('refresh')}
    </button>
    <button
      onclick={clearAll}
      class="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 rounded-lg transition-colors"
    >
      {t('clear')}
    </button>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
    <div>
      <label for="html-preview-field-3" class="block text-sm text-gray-600 dark:text-gray-300 mb-2">{t('htmlCode')}</label>
      <textarea
        bind:value={html}
        class="w-full h-96 bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white font-mono text-sm border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-amber-500 focus:outline-none resize-none"
        placeholder={t('placeholder')}
        spellCheck={false} id="html-preview-field-3"></textarea>
    </div>

    <div>
      <div class="block text-sm text-gray-600 dark:text-gray-300 mb-2">{t('preview')}</div>
      <div class="w-full h-96 bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
        {#key previewKey}
          <iframe
            srcDoc={html}
            class="w-full h-full border-0"
            sandbox="allow-same-origin"
            title="HTML Preview"></iframe>
        {/key}
      </div>
    </div>
  </div>
</div>
