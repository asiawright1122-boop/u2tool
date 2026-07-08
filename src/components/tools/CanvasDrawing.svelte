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

  let color = $state('#ffffff');

  let brushSize = $state(5);

  let tool = $state('brush');

  $effect(() => {
    const canvas = canvasRef;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  });

  // Functions
  function startDrawing(e: MouseEvent) {
    isDrawing = true;
    draw(e);
  }
  function stopDrawing() {
    isDrawing = false;
    const canvas = canvasRef;
    const ctx = canvas?.getContext('2d');
    if (ctx) ctx.beginPath();
  }
  function draw(e: MouseEvent) {
    if (!isDrawing) return;
    const canvas = canvasRef;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = tool === 'eraser' ? '#1f2937' : color;
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  }
  function clearCanvas() {
    const canvas = canvasRef;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  function downloadImage() {
    const canvas = canvasRef;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'drawing.png';
    link.href = canvas.toDataURL();
    link.click();
  }
  const colors = ['#ffffff', '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'];

</script>


    <div class="space-y-4">
      <div class="flex flex-wrap gap-4 items-center">
        <div class="flex gap-2">
          {#each colors as c (c)}
<button 
              onclick={() => color = c}
              class={`w-8 h-8 rounded-full border-2 ${color === c ? 'border-white' : 'border-transparent'}`}
              style="background-color: {c}"
            ></button>
{/each}
          <input type="color" bind:value={color} class="w-8 h-8 rounded cursor-pointer" />
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-600 dark:text-gray-300">{t('canvas.size')}:</span>
          <input
            type="range"
            min="1"
            max="50"
            value={brushSize}
            onchange={(e) => brushSize = Number(e.target.value)}
            class="w-24"
          />
          <span class="text-sm w-8 text-gray-900 dark:text-white">{brushSize}</span>
        </div>
        <div class="flex gap-2">
          <button
            onclick={() => tool = 'brush'}
            class={`px-3 py-1 rounded text-white ${tool === 'brush' ? 'bg-amber-600' : 'bg-gray-500 dark:bg-gray-700'}`}
          >
            {t('canvas.brush')}
          </button>
          <button
            onclick={() => tool = 'eraser'}
            class={`px-3 py-1 rounded text-white ${tool === 'eraser' ? 'bg-amber-600' : 'bg-gray-500 dark:bg-gray-700'}`}
          >
            {t('canvas.eraser')}
          </button>
        </div>
        <button onclick={clearCanvas} class="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 rounded">
          {t('clear')}
        </button>
        <button onclick={downloadImage} class="px-3 py-1 bg-emerald-500 hover:bg-green-700 text-white rounded">
          {t('download')}
        </button>
      </div>
      <canvas
        bind:this={canvasRef}
        width={800}
        height={500}
        onmousedown={startDrawing}
        onmouseup={stopDrawing}
        onmouseout={stopDrawing}
        onmousemove={draw}
        class="border border-gray-300 dark:border-gray-700 rounded-lg cursor-crosshair w-full"></canvas>
    </div>
  
