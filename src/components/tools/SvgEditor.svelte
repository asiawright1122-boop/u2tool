<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['svg-editor'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.svg-editor.${key}`;
  }

  let svgCode = $state('');

  let previewUrl = $state('');

  let width = $state(200);

  let height = $state(200);

  let fill = $state('#3b82f6');

  let stroke = $state('#1e40af');

  let strokeWidth = $state(2);

  let copied = $state(false);

  let timerRef = $state(null);

  let fileInputRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  const defaultSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="40" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>
</svg>`;
  function updatePreview(code: string) {
    try {
      const blob = new Blob([code], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      previewUrl = url;
    } catch {
      previewUrl = '';
    }
  }
  function handleCodeChange(code: string) {
    svgCode = code;
    updatePreview(code);
  }
  function handleFileUpload(e: Event) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        svgCode = content;
        updatePreview(content);
      };
      reader.readAsText(file);
    }
  }
  function applyChanges() {
    let code = svgCode;
    
    // Update fill
    code = code.replace(/fill="[^"]*"/g, `fill="${fill}"`);
    if (!code.includes('fill=')) {
      code = code.replace(/<(circle|rect|path|polygon|ellipse)/g, `<$1 fill="${fill}"`);
    }
    
    // Update stroke
    code = code.replace(/stroke="[^"]*"/g, `stroke="${stroke}"`);
    if (!code.includes('stroke=')) {
      code = code.replace(/<(circle|rect|path|polygon|ellipse)/g, `<$1 stroke="${stroke}"`);
    }
    
    // Update stroke-width
    code = code.replace(/stroke-width="[^"]*"/g, `stroke-width="${strokeWidth}"`);
    
    // Update dimensions
    code = code.replace(/width="[^"]*"/, `width="${width}"`);
    code = code.replace(/height="[^"]*"/, `height="${height}"`);
    
    if (!code.includes('width=')) {
      code = code.replace(/<svg/, `<svg width="${width}" height="${height}"`);
    }
    
    svgCode = code;
    updatePreview(code);
  }
  function loadExample() {
    handleCodeChange(defaultSvg);
  }
  function copyToClipboard() {
    navigator.clipboard.writeText(svgCode);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }
  function downloadSvg() {
    const blob = new Blob([svgCode], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'edited.svg';
    a.click();
    URL.revokeObjectURL(url);
  }

</script>


    <div class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div>
            <label class="tool-label">
              {t('svgCode')}
            </label>
            <textarea
              value={svgCode}
              onchange={(e) => handleCodeChange(e.target.value)}
              placeholder={t('placeholder')}
              class="w-full h-64 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm"
            />
          </div>

          <div class="flex gap-4">
            <input
              bind:this={fileInputRef}
              type="file"
              accept=".svg"
              onchange={handleFileUpload}
              class="hidden"
              id="svg-upload"
            />
            <label
              for="svg-upload"
              class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors cursor-pointer text-sm"
            >
              {t('uploadSvg')}
            </label>
            <button
              onclick={loadExample}
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm"
            >
              {t('loadExample')}
            </button>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="tool-label">
                {t('width')}
              </label>
              <input
                type="number"
                value={width}
                onchange={(e) => width = Number(e.target.value)}
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label class="tool-label">
                {t('height')}
              </label>
              <input
                type="number"
                value={height}
                onchange={(e) => height = Number(e.target.value)}
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div class="grid grid-cols-3 gap-4">
            <div>
              <label class="tool-label">
                {t('fill')}
              </label>
              <input
                type="color"
                bind:value={fill}
                class="w-full h-10 rounded cursor-pointer"
              />
            </div>
            <div>
              <label class="tool-label">
                {t('stroke')}
              </label>
              <input
                type="color"
                bind:value={stroke}
                class="w-full h-10 rounded cursor-pointer"
              />
            </div>
            <div>
              <label class="tool-label">
                {t('strokeWidth')}
              </label>
              <input
                type="number"
                value={strokeWidth}
                onchange={(e) => strokeWidth = Number(e.target.value)}
                min="0"
                max="20"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <button
            onclick={applyChanges}
            class="w-full px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
          >
            {t('applyChanges')}
          </button>
        </div>

        <div class="space-y-4">
          <div>
            <label class="tool-label">
              {t('preview')}
            </label>
            <div class="border border-gray-300 dark:border-gray-600 rounded-lg p-4 min-h-64 flex items-center justify-center bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAADFJREFUOE9jZGBg+M+ABRw9epQRm3QYGxvDJRgZGRmxKcamBpsabGqwqcGmBpsabGoAAPvfB/1uTd4UAAAAAElFTkSuQmCC')]">
              {#if previewUrl}
<img src={previewUrl} alt="SVG Preview" class="max-w-full max-h-64" />
{:else}
<span class="text-gray-400">{t('noPreview')}</span>
{/if}
            </div>
          </div>

          {#if svgCode}
<div class="flex gap-4">
              <button
                onclick={copyToClipboard}
                class="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                {copied ? t('copied') : t('copy')}
              </button>
              <button
                onclick={downloadSvg}
                class="flex-1 px-4 py-2 btn-success rounded-lg hover:bg-green-700 transition-colors"
              >
                {t('download')}
              </button>
            </div>
{/if}
        </div>
      </div>
    </div>
  
