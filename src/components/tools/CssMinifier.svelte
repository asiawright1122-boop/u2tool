<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['css-minifier'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.css-minifier.${key}`;
  }

  let input = $state(`.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  margin: 0 auto;
  max-width: 1200px;
}

/* Header styles */
.header {
  background-color: #333;
  color: white;
  padding: 15px 30px;
  width: 100%;
}

.header h1 {
  font-size: 24px;
  margin: 0;
}

/* Button styles */
.button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.button:hover {
  background-color: #0056b3;
}`);

  let output = $state('');

  let stats = $state({ original: 0, minified: 0, saved: 0 });

  // Functions
  function minifyCss(css: string): string {
    let result = css;
    
    // Remove comments
    result = result.replace(/\/\*[\s\S]*?\*\//g, '');
    
    // Remove newlines and extra spaces
    result = result.replace(/\s+/g, ' ');
    
    // Remove spaces around special characters
    result = result.replace(/\s*([{}:;,>~+])\s*/g, '$1');
    
    // Remove trailing semicolons before closing braces
    result = result.replace(/;}/g, '}');
    
    // Remove leading/trailing whitespace
    result = result.trim();
    
    // Remove spaces after colons in properties (but keep one space for readability in some cases)
    result = result.replace(/:\s+/g, ':');
    
    // Remove unnecessary zeros
    result = result.replace(/(:|\s)0(px|em|rem|%|pt|pc|in|cm|mm|ex|ch|vw|vh|vmin|vmax)/g, '$10');
    
    // Shorten hex colors
    result = result.replace(/#([0-9a-fA-F])\1([0-9a-fA-F])\2([0-9a-fA-F])\3/g, '#$1$2$3');
    
    return result;
  }
  function minify() {
    const minified = minifyCss(input);
    output = minified;
    
    const originalSize = new Blob([input]).size;
    const minifiedSize = new Blob([minified]).size;
    const savedPercent = originalSize > 0 ? Math.round((1 - minifiedSize / originalSize) * 100) : 0;
    
    stats = {
      original: originalSize,
      minified: minifiedSize,
      saved: savedPercent
    };
  }
  function copyToClipboard() {
    navigator.clipboard.writeText(output);
  }
  function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

</script>


    <div class="space-y-6">
      {#if stats.original > 0}
<div class="grid grid-cols-3 gap-4">
          <div class="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
            <div class="text-2xl font-bold text-gray-900 dark:text-white">{formatBytes(stats.original)}</div>
            <div class="text-sm text-gray-600 dark:text-gray-300">Original Size</div>
          </div>
          <div class="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
            <div class="text-2xl font-bold text-green-600 dark:text-green-400">{formatBytes(stats.minified)}</div>
            <div class="text-sm text-gray-600 dark:text-gray-300">Minified Size</div>
          </div>
          <div class="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
            <div class="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.saved}%</div>
            <div class="text-sm text-gray-600 dark:text-gray-300">Size Reduced</div>
          </div>
        </div>
{/if}

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
            {t('input')}
          </label>
          <textarea
            bind:value={input}
            class="w-full h-80 px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white font-mono text-sm"
            placeholder={t('inputPlaceholder')}></textarea>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
            {t('output')}
          </label>
          <textarea
            value={output}
            readOnly
            class="w-full h-80 px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white font-mono text-sm"
            placeholder={t('outputPlaceholder')}></textarea>
        </div>
      </div>

      <div class="flex gap-4">
        <button
          onclick={minify}
          class="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors"
        >
          {t('minify')}
        </button>
        <button
          onclick={copyToClipboard}
          disabled={!output}
          class="px-6 py-2 bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50 rounded-lg font-medium transition-colors"
        >
          {t('copy')}
        </button>
      </div>
    </div>
  
