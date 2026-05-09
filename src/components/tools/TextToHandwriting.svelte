<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string, fallback?: string): string {
    const scope = translations['tools']['text-to-handwriting'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : fallback ?? `MISSING: tools.text-to-handwriting.${key}`;
  }
  function tc(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  interface HandwritingStyle {
    name: string;
    fontFamily: string;
    slant: number;
  }

  interface PaperStyle {
    key: string;
    name: string;
    bg: string;
    lines: boolean;
    grid: boolean;
  }

  const handwritingStyles: HandwritingStyle[] = [
    { name: 'Casual', fontFamily: 'Comic Sans MS, Bradley Hand, cursive', slant: 4 },
    { name: 'Print', fontFamily: 'Verdana, sans-serif', slant: 1 },
    { name: 'Script', fontFamily: 'Brush Script MT, cursive', slant: 8 },
  ];

  const paperStyles: PaperStyle[] = [
    { key: 'blank', name: 'Plain', bg: '#fffdf7', lines: false, grid: false },
    { key: 'lined', name: 'Lined', bg: '#fffdf7', lines: true, grid: false },
    { key: 'grid', name: 'Grid', bg: '#ffffff', lines: false, grid: true },
  ];

  let text = $state('Hello, this is my handwriting!');

  let style = $state(handwritingStyles[0]);

  let paper = $state(paperStyles[0]);

  let inkColor = $state('#1a365d');

  let fontSize = $state(24);

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

    const padding = 40;
    const lineHeight = fontSize * 1.8;
    const lines = text.split('\n');
    
    canvas.width = 600;
    canvas.height = Math.max(400, lines.length * lineHeight + padding * 2);

    // Draw paper background
    ctx.fillStyle = paper.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw lines if needed
    if (paper.lines) {
      ctx.strokeStyle = '#ccc';
      ctx.lineWidth = 1;
      for (let y = padding + lineHeight; y < canvas.height; y += lineHeight) {
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(canvas.width - padding, y);
        ctx.stroke();
      }
    }

    // Draw grid if needed
    if (paper.grid) {
      ctx.strokeStyle = '#ddd';
      ctx.lineWidth = 0.5;
      const gridSize = 20;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    }

    // Draw text with handwriting effect
    ctx.fillStyle = inkColor;
    ctx.textBaseline = 'top';

    lines.forEach((line, lineIndex) => {
      const chars = line.split('');
      let x = padding;
      const y = padding + lineIndex * lineHeight;

      chars.forEach((char) => {
        ctx.save();
        
        // Add slight randomness for handwriting effect
        const offsetX = (Math.random() - 0.5) * 2;
        const offsetY = (Math.random() - 0.5) * 2;
        const rotation = ((Math.random() - 0.5) * style.slant * Math.PI) / 180;
        const sizeVariation = 1 + (Math.random() - 0.5) * 0.1;

        ctx.translate(x + offsetX, y + offsetY);
        ctx.rotate(rotation);
        ctx.font = `${fontSize * sizeVariation}px ${style.fontFamily}`;
        ctx.fillText(char, 0, 0);
        
        ctx.restore();
        
        ctx.font = `${fontSize}px ${style.fontFamily}`;
        x += ctx.measureText(char).width + (Math.random() - 0.5) * 2;
      });
    });
  }
  function downloadImage() {
    const canvas = canvasRef;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'handwriting.png';
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

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label class="tool-label">
            {t('style')}
          </label>
          <div class="space-y-1">
            {#each handwritingStyles as s (s.name)}
<button 
                onclick={() => style = s}
                class={`w-full px-3 py-2 rounded-lg text-left transition-colors ${
                  style.name === s.name
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {s.name}
              </button>
{/each}
          </div>
        </div>

        <div>
          <label class="tool-label">
            {t('paper')}
          </label>
          <div class="space-y-1">
            {#each paperStyles as p (p.name)}
<button 
                onclick={() => paper = p}
                class={`w-full px-3 py-2 rounded-lg text-left transition-colors ${
                  paper.name === p.name
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {t(p.key, p.name)}
              </button>
{/each}
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('inkColor')}
          </label>
          <input
            type="color"
            bind:value={inkColor}
            class="w-full h-10 rounded-lg cursor-pointer"
          />
          <div class="flex gap-1 mt-2">
            {#each ['#1a365d', '#000000', '#2d3748', '#744210', '#22543d'] as color (color)}
<button 
                onclick={() => inkColor = color}
                class="w-6 h-6 rounded-full border-2 border-gray-300"
                style="background-color: {color}"
              />
{/each}
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('fontSize')}: {fontSize}px
          </label>
          <input
            type="range"
            value={fontSize}
            oninput={(e) => fontSize = parseInt((e.currentTarget as HTMLInputElement).value)}
            min="16"
            max="48"
            class="w-full"
          />
        </div>
      </div>

      <div class="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-auto">
        <canvas bind:this={canvasRef} class="mx-auto shadow-lg"></canvas>
      </div>

      <button
        onclick={downloadImage}
        class="w-full px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
      >
        {tc('download')} PNG
      </button>
    </div>
  
