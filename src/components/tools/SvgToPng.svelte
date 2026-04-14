<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['svg-to-png'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.svg-to-png.${key}`;
  }

  let svgContent = $state('');

  let scale = $state(2);

  let backgroundColor = $state('#ffffff');

  let transparent = $state(true);

  let previewUrl = $state('');

  let canvasRef = $state(null);

  // Functions
  function handleFileUpload(e: Event) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        svgContent = content;
        generatePreview(content);
      };
      reader.readAsText(file);
    }
  }
  function handlePaste(e: Event) {
    const content = e.target.value;
    svgContent = content;
    if (content.trim().startsWith('<svg')) {
      generatePreview(content);
    }
  }
  function generatePreview(svg: string) {
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    previewUrl = url;
  }
  function convertToPng() {
    if (!svgContent) return;

    const canvas = canvasRef;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);

    img.onload = () => {
      const width = img.width * scale;
      const height = img.height * scale;
      
      canvas.width = width;
      canvas.height = height;

      if (!transparent) {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, height);
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob((blob) => {
        if (blob) {
          const downloadUrl = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = downloadUrl;
          a.download = 'converted.png';
          a.click();
          URL.revokeObjectURL(downloadUrl);
        }
      }, 'image/png');

      URL.revokeObjectURL(url);
    };

    img.src = url;
  }

</script>


    <div class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div>
            <label class="tool-label">
              {t('uploadSvg')}
            </label>
            <input
              type="file"
              accept=".svg"
              onchange={handleFileUpload}
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label class="tool-label">
              {t('orPasteSvg')}
            </label>
            <textarea
              value={svgContent}
              onchange={handlePaste}
              placeholder={t('placeholder')}
              class="w-full h-48 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm"></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="tool-label">
                {t('scale')}
              </label>
              <select
                value={scale}
                onchange={(e) => scale = Number(e.target.value)}
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value={1}>1x</option>
                <option value={2}>2x</option>
                <option value={3}>3x</option>
                <option value={4}>4x</option>
              </select>
            </div>
            <div>
              <label class="tool-label">
                {t('background')}
              </label>
              <div class="flex items-center gap-2">
                <input
                  type="color"
                  bind:value={backgroundColor}
                  disabled={transparent}
                  class="w-10 h-10 rounded cursor-pointer"
                />
                <label class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <input
                    type="checkbox"
                    bind:checked={transparent}
                    class="rounded"
                  />
                  {t('transparent')}
                </label>
              </div>
            </div>
          </div>

          <button
            onclick={convertToPng}
            disabled={!svgContent}
            class="w-full px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('download')}
          </button>
        </div>

        <div>
          <label class="tool-label">
            {t('preview')}
          </label>
          <div class="border border-gray-300 dark:border-gray-600 rounded-lg p-4 min-h-64 flex items-center justify-center bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAADFJREFUOE9jZGBg+M+ABRw9epQRm3QYGxvDJRgZGRmxKcamBpsabGqwqcGmBpsabGoAAPvfB/1uTd4UAAAAAElFTkSuQmCC')]">
            {#if previewUrl}
<img src={previewUrl} alt="SVG Preview" class="max-w-full max-h-64" style="aspect-ratio: auto" />
{:else}
<span class="text-gray-400">{t('noPreview')}</span>
{/if}
          </div>
        </div>
      </div>

      <canvas bind:this={canvasRef} class="hidden"></canvas>
    </div>
  
