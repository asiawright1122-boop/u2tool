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
  import { sanitizeSvg } from '@/lib/sanitize';

  let input = $state('');

  let output = $state('');

  let stats = $state({ original: 0, optimized: 0, saved: 0 });

  let copied = $state(false);

  let timerRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function optimize() {
    if (!input.trim()) return;

    let svg = input;
    const originalSize = new Blob([input]).size;

    // Remove comments
    svg = svg.replace(/<!--[\s\S]*?-->/g, '');

    // Remove unnecessary whitespace
    svg = svg.replace(/>\s+</g, '><');
    svg = svg.replace(/\s+/g, ' ');

    // Remove empty attributes
    svg = svg.replace(/\s+[a-zA-Z-]+=""/g, '');

    // Remove default values
    svg = svg.replace(/\s+fill-opacity="1"/g, '');
    svg = svg.replace(/\s+stroke-opacity="1"/g, '');
    svg = svg.replace(/\s+opacity="1"/g, '');

    // Remove metadata
    svg = svg.replace(/<metadata[\s\S]*?<\/metadata>/gi, '');

    // Remove title and desc if empty
    svg = svg.replace(/<title>\s*<\/title>/gi, '');
    svg = svg.replace(/<desc>\s*<\/desc>/gi, '');

    // Remove unnecessary xmlns
    svg = svg.replace(/\s+xmlns:xlink="[^"]*"/g, '');

    // Clean up numbers
    svg = svg.replace(/(\d+)\.0+([^\d])/g, '$1$2');
    svg = svg.replace(/0+(\.\d+)/g, '$1');

    // Trim
    svg = svg.trim();

    const optimizedSize = new Blob([svg]).size;
    const savedPercent = originalSize > 0 ? Math.round((1 - optimizedSize / originalSize) * 100) : 0;

    output = svg;
    stats = {
      original: originalSize,
      optimized: optimizedSize,
      saved: savedPercent
    };
  }

  function copyOutput() {
    navigator.clipboard.writeText(output);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }

  function formatSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(2)} KB`;
  }

</script>


    <div class="space-y-4">
      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('input')} SVG</label>
          <textarea
            bind:value={input}
            class="w-full h-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded p-3 font-mono text-sm text-gray-900 dark:text-white"
            placeholder={t('svgOptimizer.placeholder')}></textarea>
        </div>
        <div>
          <div class="flex justify-between items-center mb-1">
            <label class="text-sm text-gray-600 dark:text-gray-300">{t('output')}</label>
            <button onclick={copyOutput} class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
              {copied ? t('copied') : t('copy')}
            </button>
          </div>
          <textarea
            value={output}
            readOnly
            class="w-full h-48 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded p-3 font-mono text-sm text-green-600 dark:text-green-400"></textarea>
        </div>
      </div>

      <button
        onclick={optimize}
        class="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-medium text-white"
      >
        {t('svgOptimizer.optimize')}
      </button>

      {#if stats.original > 0}
<div class="grid grid-cols-3 gap-4">
          <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-3 text-center">
            <div class="text-lg font-bold text-gray-900 dark:text-white">{formatSize(stats.original)}</div>
            <div class="text-sm text-gray-600 dark:text-gray-300">{t('svgOptimizer.original')}</div>
          </div>
          <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-3 text-center">
            <div class="text-lg font-bold text-green-600 dark:text-green-400">{formatSize(stats.optimized)}</div>
            <div class="text-sm text-gray-600 dark:text-gray-300">{t('svgOptimizer.optimized')}</div>
          </div>
          <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-3 text-center">
            <div class="text-lg font-bold text-blue-600 dark:text-blue-400">{stats.saved}%</div>
            <div class="text-sm text-gray-600 dark:text-gray-300">{t('svgOptimizer.saved')}</div>
          </div>
        </div>
{/if}

      {#if output}
<div>
          <label class="block text-sm text-gray-600 dark:text-gray-300 mb-2">{t('svgOptimizer.preview')}</label>
          <!-- 净化 SVG 防止 XSS 攻击 -->
          <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-4 flex justify-center">{@html sanitizeSvg(output)}</div>
        </div>
{/if}
    </div>
  
