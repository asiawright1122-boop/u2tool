<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['text-to-image'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.text-to-image.${key}`;
  }
  function tc(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  let text = $state('Hello World');

  let fontSize = $state(48);

  let fontFamily = $state('Arial');

  let textColor = $state('#000000');

  let bgColor = $state('#ffffff');

  let padding = $state(20);

  let textAlign = $state('center');

  let canvasRef = $state(null);

  $effect(() => {
    renderCanvas();
  });

  // Functions
  function renderCanvas() {
    const canvas = canvasRef;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.font = `${fontSize}px ${fontFamily}`;
    const lines = text.split('\n');
    const lineHeight = fontSize * 1.2;
    
    let maxWidth = 0;
    lines.forEach(line => {
      const metrics = ctx.measureText(line);
      maxWidth = Math.max(maxWidth, metrics.width);
    });

    const width = maxWidth + padding * 2;
    const height = lines.length * lineHeight + padding * 2;

    canvas.width = width;
    canvas.height = height;

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.fillStyle = textColor;
    ctx.textBaseline = 'top';

    lines.forEach((line, index) => {
      let x = padding;
      if (textAlign === 'center') {
        x = (width - ctx.measureText(line).width) / 2;
      } else if (textAlign === 'right') {
        x = width - ctx.measureText(line).width - padding;
      }
      ctx.fillText(line, x, padding + index * lineHeight);
    });
  }
  function downloadImage() {
    const canvas = canvasRef;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'text-image.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

</script>


    <div class="space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t('text')}
        </label>
        <textarea
          bind:value={text}
          class="w-full h-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
          placeholder={tc('inputPlaceholder')}></textarea>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('fontSize')}
          </label>
          <input
            type="number"
            value={fontSize}
            onchange={(e) => fontSize = parseInt(e.target.value) || 48}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            min="8"
            max="200"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('fontFamily')}
          </label>
          <select
            bind:value={fontFamily}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            {#each fonts as font (font)}
<option  value={font} style="font-family: {font}">
                {font}
              </option>
{/each}
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('padding')}
          </label>
          <input
            type="number"
            value={padding}
            onchange={(e) => padding = parseInt(e.target.value) || 20}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            min="0"
            max="100"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('textColor')}
          </label>
          <input
            type="color"
            bind:value={textColor}
            class="w-full h-10 rounded-lg cursor-pointer"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('backgroundColor')}
          </label>
          <input
            type="color"
            bind:value={bgColor}
            class="w-full h-10 rounded-lg cursor-pointer"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('textAlign')}
          </label>
          <select
            value={textAlign}
            onchange={(e) => textAlign = e.target.value as 'left' | 'center' | 'right'}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="left">{t('left')}</option>
            <option value="center">{t('center')}</option>
            <option value="right">{t('right')}</option>
          </select>
        </div>
      </div>

      <div class="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-auto">
        <canvas bind:this={canvasRef} class="mx-auto"></canvas>
      </div>

      <button
        onclick={downloadImage}
        class="w-full px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
      >
        {tc('download')} PNG
      </button>
    </div>
  
