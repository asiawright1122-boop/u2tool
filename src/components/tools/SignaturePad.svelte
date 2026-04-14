<script lang="ts">
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

  let canvasRef = $state(null);

  let isDrawing = $state(false);

  let penColor = $state('#000000');

  let penWidth = $state(3);

  let backgroundColor = $state('#ffffff');

  let transparentBg = $state(false);

  let hasSignature = $state(false);

  function getContext() {
    const canvas = canvasRef;
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = penColor;
      ctx.lineWidth = penWidth;
    }
    return ctx;
  }

  function clearCanvas() {
    const canvas = canvasRef;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    
    if (transparentBg) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    hasSignature = false;
  }

  $effect(() => {
    const canvas = canvasRef;
    if (!canvas) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = 300;
    clearCanvas();
  });

  $effect(() => { clearCanvas(); });

  // Functions
  function getCoordinates(e: MouseEvent | TouchEvent) {
    const canvas = canvasRef;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }
  function startDrawing(e: MouseEvent | TouchEvent) {
    e.preventDefault();
    const ctx = getContext();
    if (!ctx) return;
    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    isDrawing = true;
    hasSignature = true;
  }
  function draw(e: MouseEvent | TouchEvent) {
    if (!isDrawing) return;
    e.preventDefault();
    const ctx = getContext();
    if (!ctx) return;
    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  }
  function stopDrawing() { isDrawing = false; }
  function downloadSignature(format: 'png' | 'svg') {
    const canvas = canvasRef;
    if (!canvas || !hasSignature) return;
    
    if (format === 'png') {
      const link = document.createElement('a');
      link.download = 'signature.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } else {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const imageData = canvas.toDataURL('image/png');
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}">
        <image href="${imageData}" width="${canvas.width}" height="${canvas.height}"/>
      </svg>`;
      const blob = new Blob([svg], { type: 'image/svg+xml' });
      const link = document.createElement('a');
      link.download = 'signature.svg';
      link.href = URL.createObjectURL(blob);
      link.click();
    }
  }
  const colors = ['#000000', '#1e40af', '#dc2626', '#16a34a', '#9333ea', '#ea580c'];

</script>


    <div class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Settings -->
        <div class="space-y-4">
          <div>
            <label class="tool-label">{t('signature.penColor')}</label>
            <div class="flex flex-wrap gap-2">
              {#each colors as color (color)}
<button  onclick={() => penColor = color}
                  class={`w-8 h-8 rounded-full border-2 ${penColor === color ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-gray-300'}`}
                  style="background-color: {color}" />
{/each}
              <input type="color" bind:value={penColor} class="w-8 h-8 rounded cursor-pointer" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('signature.penWidth')}: {penWidth}px</label>
            <input type="range" min="1" max="10" bind:value={penWidth} class="w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('signature.backgroundColor')}</label>
            <div class="flex items-center gap-2">
              <input type="color" bind:value={backgroundColor} disabled={transparentBg} class="w-10 h-10 rounded cursor-pointer disabled:opacity-50" />
              <label class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <input type="checkbox" bind:checked={transparentBg} class="w-4 h-4" />
                {t('signature.transparent')}
              </label>
            </div>
          </div>
        </div>

        <!-- Canvas -->
        <div class="lg:col-span-3">
          <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden" style="background-color: {transparentBg ? 'transparent' : backgroundColor}">
            <canvas bind:this={canvasRef} class="w-full cursor-crosshair touch-none"
              style="background: {transparentBg ? 'repeating-conic-gradient(#e5e7eb 0% 25%, transparent 0% 50%) 50% / 20px 20px' : backgroundColor}"
              onmousedown={startDrawing} onmousemove={draw} onmouseup={stopDrawing} onmouseleave={stopDrawing}
              ontouchstart={startDrawing} ontouchmove={draw} ontouchend={stopDrawing}></canvas>
          </div>
          <div class="flex flex-wrap gap-2 mt-4">
            <button onclick={clearCanvas} class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
              {t('clear')}
            </button>
            <button onclick={() => downloadSignature('png')} disabled={!hasSignature}
              class="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed">
              {t('signature.downloadPng')}
            </button>
            <button onclick={() => downloadSignature('svg')} disabled={!hasSignature}
              class="px-4 py-2 btn-success rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">
              {t('signature.downloadSvg')}
            </button>
          </div>
        </div>
      </div>
    </div>
  
