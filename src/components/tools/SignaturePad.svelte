<script lang="ts">
  import { onMount } from 'svelte';

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
    for (const k of keys) {
      value = (value as Record<string, unknown>)?.[k];
    }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  interface Point {
    x: number;
    y: number;
  }

  interface Stroke {
    points: Point[];
    color: string;
    width: number;
  }

  // Refs
  let canvasRef = $state<HTMLCanvasElement | null>(null);

  // States
  let isDrawing = $state(false);
  let penColor = $state('#000000');
  let penWidth = $state(3);
  let backgroundColor = $state('#ffffff');
  let transparentBg = $state(false);

  // Stroke history stack for Redraw and Undo
  let strokes = $state<Stroke[]>([]);
  const hasSignature = $derived(strokes.length > 0);

  // Last pointer coordinates to avoid drawing from (0,0) on move
  let lastX = 0;
  let lastY = 0;

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

  function redraw() {
    const canvas = canvasRef;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!transparentBg) {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Redraw all strokes in history
    for (const stroke of strokes) {
      if (stroke.points.length === 0) continue;
      ctx.beginPath();
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);

      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }
      ctx.stroke();
    }
  }

  function clearCanvas() {
    strokes = [];
    redraw();
  }

  function undo() {
    if (strokes.length > 0) {
      strokes = strokes.slice(0, -1);
      redraw();
    }
  }

  // Handle canvas size changes gracefully
  $effect(() => {
    const canvas = canvasRef;
    if (!canvas) return;

    const handleResize = () => {
      // Keep signature content scaled or intact on resize
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = 350; // Standard heights
      redraw();
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  });

  // Redraw when background configuration changes
  $effect(() => {
    void backgroundColor;
    void transparentBg;
    redraw();
  });

  function getCoordinates(e: MouseEvent | TouchEvent): Point {
    const canvas = canvasRef;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ('touches' in e) {
      if (e.touches.length === 0) return { x: 0, y: 0 };
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  function startDrawing(e: MouseEvent | TouchEvent) {
    e.preventDefault();
    const ctx = getContext();
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);

    // Initialize new stroke
    strokes = [
      ...strokes,
      {
        points: [{ x, y }],
        color: penColor,
        width: penWidth
      }
    ];

    isDrawing = true;
    lastX = x;
    lastY = y;
  }

  function draw(e: MouseEvent | TouchEvent) {
    if (!isDrawing) return;
    e.preventDefault();

    const ctx = getContext();
    if (!ctx) return;

    const { x, y } = getCoordinates(e);

    // Perform continuous line draw on canvas for immediate response
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();

    // Push coordinates to the current stroke
    const currentStroke = strokes[strokes.length - 1];
    if (currentStroke) {
      currentStroke.points.push({ x, y });
    }

    lastX = x;
    lastY = y;
  }

  function stopDrawing() {
    isDrawing = false;
  }

  function downloadSignature(format: 'png' | 'svg') {
    const canvas = canvasRef;
    if (!canvas || !hasSignature) return;

    if (format === 'png') {
      const link = document.createElement('a');
      link.download = `signature-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } else {
      // Export genuine vector SVG using strokes history
      let pathsSvg = '';
      for (const stroke of strokes) {
        if (stroke.points.length === 0) continue;
        let pathD = `M ${stroke.points[0].x.toFixed(1)} ${stroke.points[0].y.toFixed(1)}`;
        for (let i = 1; i < stroke.points.length; i++) {
          pathD += ` L ${stroke.points[i].x.toFixed(1)} ${stroke.points[i].y.toFixed(1)}`;
        }
        pathsSvg += `  <path d="${pathD}" fill="none" stroke="${stroke.color}" stroke-width="${stroke.width}" stroke-linecap="round" stroke-linejoin="round" />\n`;
      }

      const svgBackground = transparentBg
        ? ''
        : `  <rect width="100%" height="100%" fill="${backgroundColor}" />\n`;

      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}" viewBox="0 0 ${canvas.width} ${canvas.height}">\n${svgBackground}${pathsSvg}</svg>`;
      
      const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `signature-${Date.now()}.svg`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    }
  }

  const colors = ['#000000', '#1e40af', '#dc2626', '#16a34a', '#9333ea', '#ea580c'];
</script>

<div class="space-y-6">
  <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
    <!-- Settings Panel -->
    <div class="space-y-5 bg-gray-50 dark:bg-gray-800/40 p-6 rounded-2xl border border-gray-200/60 dark:border-gray-700/50">
      <h3 class="text-base font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700/60 pb-2">
        {t('signature.settings')}
      </h3>
      
      <!-- Pen Color -->
      <div>
        <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          {t('signature.penColor')}
        </label>
        <div class="flex flex-wrap gap-2 mb-2">
          {#each colors as color (color)}
            <button onclick={() => penColor = color}
              class="w-7 h-7 rounded-full border border-gray-200 dark:border-gray-700 transition-transform hover:scale-105 active:scale-95"
              class:ring-2={penColor === color}
              class:ring-amber-500={penColor === color}
              style="background-color: {color}"
              aria-label={color} ></button>
          {/each}
          
          <div class="relative w-7 h-7 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700 focus-within:ring-2 focus-within:ring-amber-500">
            <input type="color" bind:value={penColor}
              class="absolute inset-[-4px] w-12 h-12 cursor-pointer border-0 p-0 bg-transparent" />
          </div>
        </div>
      </div>

      <!-- Pen Width -->
      <div>
        <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          {t('signature.penWidth')}: <span class="text-gray-900 dark:text-white font-bold">{penWidth}px</span>
        </label>
        <input type="range" min="1" max="15" bind:value={penWidth}
          class="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-amber-600" />
      </div>

      <!-- Background Config -->
      <div>
        <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          {t('signature.backgroundColor')}
        </label>
        <div class="flex items-center gap-3">
          <div class="relative w-8 h-8 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
            <input type="color" bind:value={backgroundColor} disabled={transparentBg}
              class="absolute inset-[-4px] w-14 h-14 cursor-pointer border-0 p-0 bg-transparent disabled:opacity-40 disabled:cursor-not-allowed" />
          </div>
          <label class="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-400 select-none cursor-pointer">
            <input type="checkbox" bind:checked={transparentBg}
              class="w-4 h-4 rounded text-amber-600 border-gray-300 focus:ring-amber-500" />
            {t('signature.transparent')}
          </label>
        </div>
      </div>
    </div>

    <!-- Drawing Canvas -->
    <div class="lg:col-span-3 flex flex-col">
      <div class="border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm relative shrink-0"
        style="height: 350px;">
        <canvas bind:this={canvasRef} class="w-full h-full cursor-crosshair touch-none"
          style="background: {transparentBg ? 'repeating-conic-gradient(#e5e7eb 0% 25%, transparent 0% 50%) 50% / 16px 16px' : backgroundColor}"
          onmousedown={startDrawing} onmousemove={draw} onmouseup={stopDrawing} onmouseleave={stopDrawing}
          ontouchstart={startDrawing} ontouchmove={draw} ontouchend={stopDrawing}></canvas>
      </div>

      <div class="flex flex-wrap gap-2 mt-4">
        <button onclick={undo} disabled={!hasSignature}
          class="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm">
          {t('signature.undo')}
        </button>
        <button onclick={clearCanvas} disabled={!hasSignature}
          class="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm">
          {t('clear')}
        </button>
        <div class="flex-1"></div>
        <button onclick={() => downloadSignature('png')} disabled={!hasSignature}
          class="px-4 py-2 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm">
          {t('signature.downloadPng')}
        </button>
        <button onclick={() => downloadSignature('svg')} disabled={!hasSignature}
          class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm">
          {t('signature.downloadSvg')}
        </button>
      </div>
    </div>
  </div>
</div>
