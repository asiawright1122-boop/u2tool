<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['html-to-text'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.html-to-text.${key}`;
  }

  let html = $state('');

  let text = $state('');

  let preserveLinks = $state(false);

  let preserveLineBreaks = $state(true);

  let preserveLists = $state(true);

  function htmlToText(input: string) {
    if (!input) return '';

    let result = input;

    // Handle links
    if (preserveLinks) {
      result = result.replace(/<a[^>]*href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi, '$2 ($1)');
    } else {
      result = result.replace(/<a[^>]*>(.*?)<\/a>/gi, '$1');
    }

    // Handle lists
    if (preserveLists) {
      result = result.replace(/<li[^>]*>/gi, '• ');
      result = result.replace(/<\/li>/gi, '\n');
      result = result.replace(/<ol[^>]*>/gi, '\n');
      result = result.replace(/<\/ol>/gi, '\n');
      result = result.replace(/<ul[^>]*>/gi, '\n');
      result = result.replace(/<\/ul>/gi, '\n');
    }

    // Handle line breaks
    if (preserveLineBreaks) {
      result = result.replace(/<br\s*\/?>/gi, '\n');
      result = result.replace(/<\/p>/gi, '\n\n');
      result = result.replace(/<\/div>/gi, '\n');
      result = result.replace(/<\/h[1-6]>/gi, '\n\n');
      result = result.replace(/<\/tr>/gi, '\n');
      result = result.replace(/<\/td>/gi, '\t');
      result = result.replace(/<\/th>/gi, '\t');
    }

    // Handle common block elements
    result = result.replace(/<(p|div|h[1-6]|blockquote|pre)[^>]*>/gi, '\n');
    
    // Handle horizontal rules
    result = result.replace(/<hr\s*\/?>/gi, '\n---\n');

    // Remove script and style content
    result = result.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
    result = result.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

    // Remove all remaining HTML tags
    result = result.replace(/<[^>]+>/g, '');

    // Decode HTML entities
    const entities: Record<string, string> = {
      '&nbsp;': ' ',
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#39;': "'",
      '&apos;': "'",
      '&copy;': '©',
      '&reg;': '®',
      '&trade;': '™',
      '&mdash;': '—',
      '&ndash;': '–',
      '&hellip;': '…',
      '&lsquo;': '\u2018',
      '&rsquo;': '\u2019',
      '&ldquo;': '\u201C',
      '&rdquo;': '\u201D',
    };

    for (const [entity, char] of Object.entries(entities)) {
      result = result.replace(new RegExp(entity, 'gi'), char);
    }

    // Decode numeric entities
    result = result.replace(/&#(\d+);/g, (_, num) => String.fromCharCode(parseInt(num)));
    result = result.replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)));

    // Clean up whitespace
    result = result.replace(/[ \t]+/g, ' ');
    result = result.replace(/\n\s*\n\s*\n/g, '\n\n');
    result = result.trim();

    return result;
  }

  // Functions
  function handleConvert() {
    text = htmlToText(html);
  }
  function handleCopy() {
    navigator.clipboard.writeText(text);
  }
  function loadSample() {
    html = `<!DOCTYPE html>
<html>
<head>
  <title>Sample Page</title>
</head>
<body>
  <h1>Welcome to My Website</h1>
  <p>This is a <strong>sample</strong> paragraph with <em>formatted</em> text.</p>
  <p>Visit our <a href="https://example.com">website</a> for more information.</p>
  <h2>Features</h2>
  <ul>
    <li>Easy to use</li>
    <li>Fast and reliable</li>
    <li>Free forever</li>
  </ul>
  <p>Contact us at: info@example.com</p>
  <hr>
  <p>&copy; 2024 Example Company. All rights reserved.</p>
</body>
</html>`;
    text = '';
  }

</script>


    <div class="space-y-6">
      <div class="flex flex-wrap gap-4 items-center">
        <label for="preserve-links" class="flex items-center gap-2 cursor-pointer">
          <input
            id="preserve-links"
            name="preserveLinks"
            type="checkbox"
            bind:checked={preserveLinks}
            class="w-4 h-4 text-amber-600 rounded"
          />
          <span class="text-sm text-gray-600 dark:text-gray-300">{t('preserveLinks')}</span>
        </label>

        <label for="preserve-line-breaks" class="flex items-center gap-2 cursor-pointer">
          <input
            id="preserve-line-breaks"
            name="preserveLineBreaks"
            type="checkbox"
            bind:checked={preserveLineBreaks}
            class="w-4 h-4 text-amber-600 rounded"
          />
          <span class="text-sm text-gray-600 dark:text-gray-300">{t('preserveLineBreaks')}</span>
        </label>

        <label for="preserve-lists" class="flex items-center gap-2 cursor-pointer">
          <input
            id="preserve-lists"
            name="preserveLists"
            type="checkbox"
            bind:checked={preserveLists}
            class="w-4 h-4 text-amber-600 rounded"
          />
          <span class="text-sm text-gray-600 dark:text-gray-300">{t('preserveLists')}</span>
        </label>

        <button
          onclick={loadSample}
          class="text-sm text-amber-600 hover:text-amber-800"
        >
          {t('loadSample')}
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-2">
          <label for="html-input" class="block text-sm font-medium text-gray-600 dark:text-gray-300">
            {t('htmlInput')}
          </label>
          <textarea
            id="html-input"
            name="htmlValue"
            placeholder={t('htmlPlaceholder')}
            class="w-full h-64 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-sm"></textarea>
        </div>

        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <label for="text-output" class="block text-sm font-medium text-gray-600 dark:text-gray-300">
              {t('textOutput')}
            </label>
            {#if text}
<button
                onclick={handleCopy}
                class="text-sm text-amber-600 hover:text-amber-800"
              >
                {t('copy')}
              </button>
{/if}
          </div>
          <textarea
            id="text-output"
            name="textValue"
            readOnly
            placeholder={t('textPlaceholder')}
            class="w-full h-64 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"></textarea>
        </div>
      </div>

      <div class="flex justify-center">
        <button
          onclick={handleConvert}
          class="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
        >
          {t('convert')}
        </button>
      </div>

      <div class="p-4 bg-amber-50 dark:bg-amber-900/30 rounded-lg">
        <h3 class="font-medium text-amber-800 dark:text-amber-300 mb-2">{t('features')}</h3>
        <ul class="text-sm text-amber-700 dark:text-amber-400 space-y-1">
          <li>• {t('feature1')}</li>
          <li>• {t('feature2')}</li>
          <li>• {t('feature3')}</li>
          <li>• {t('feature4')}</li>
        </ul>
      </div>
    </div>
  
