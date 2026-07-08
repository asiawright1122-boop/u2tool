<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['js-minifier'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.js-minifier.${key}`;
  }

  let input = $state(`// Calculate the sum of an array
function calculateSum(numbers) {
  let sum = 0;
  
  for (let i = 0; i < numbers.length; i++) {
    sum += numbers[i];
  }
  
  return sum;
}

// Find the maximum value
function findMax(arr) {
  if (arr.length === 0) {
    return null;
  }
  
  let max = arr[0];
  
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i];
    }
  }
  
  return max;
}

// Example usage
const numbers = [1, 5, 3, 9, 2];
console.log("Sum:", calculateSum(numbers));
console.log("Max:", findMax(numbers));`);

  let output = $state('');

  let stats = $state({ original: 0, minified: 0, saved: 0 });

  // Functions
  function minifyJs(js: string): string {
    let result = js;
    
    // Remove single-line comments (but not URLs)
    result = result.replace(/(?<!:)\/\/.*$/gm, '');
    
    // Remove multi-line comments
    result = result.replace(/\/\*[\s\S]*?\*\//g, '');
    
    // Remove newlines and multiple spaces
    result = result.replace(/\s+/g, ' ');
    
    // Remove spaces around operators and punctuation
    result = result.replace(/\s*([{}();,=+\-*/<>!&|?:])\s*/g, '$1');
    
    // Add back necessary spaces
    result = result.replace(/\b(return|var|let|const|if|else|for|while|function|new|typeof|instanceof|in|of)\b/g, ' $1 ');
    
    // Clean up extra spaces
    result = result.replace(/\s+/g, ' ');
    result = result.replace(/\s*([{}();,])\s*/g, '$1');
    
    // Remove space after function keyword when followed by (
    result = result.replace(/function\s+\(/g, 'function(');
    
    // Trim
    result = result.trim();
    
    return result;
  }
  function minify() {
    const minified = minifyJs(input);
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
          <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-center">
            <div class="text-2xl font-bold text-gray-900 dark:text-white">{formatBytes(stats.original)}</div>
            <div class="text-sm text-gray-600 dark:text-gray-300">Original Size</div>
          </div>
          <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-center">
            <div class="text-2xl font-bold text-green-600 dark:text-green-400">{formatBytes(stats.minified)}</div>
            <div class="text-sm text-gray-600 dark:text-gray-300">Minified Size</div>
          </div>
          <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-center">
            <div class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.saved}%</div>
            <div class="text-sm text-gray-600 dark:text-gray-300">Size Reduced</div>
          </div>
        </div>
{/if}

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label for="js-minifier-field-4" class="tool-label">
            {t('input')}
          </label>
          <textarea
            bind:value={input}
            class="w-full h-80 px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white font-mono text-sm"
            placeholder={t('inputPlaceholder')} id="js-minifier-field-4"></textarea>
        </div>
        <div>
          <label for="js-minifier-field-3" class="tool-label">
            {t('output')}
          </label>
          <textarea
            value={output}
            readOnly
            class="w-full h-80 px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white font-mono text-sm"
            placeholder={t('outputPlaceholder')} id="js-minifier-field-3"></textarea>
        </div>
      </div>

      <div class="flex gap-4">
        <button
          onclick={minify}
          class="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg font-medium transition-colors text-white"
        >
          {t('minify')}
        </button>
        <button
          onclick={copyToClipboard}
          disabled={!output}
          class="px-6 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50 rounded-lg font-medium transition-colors text-gray-900 dark:text-white"
        >
          {t('copy')}
        </button>
      </div>
    </div>
  
