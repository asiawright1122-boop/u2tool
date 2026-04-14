<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['decision-wheel'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.decision-wheel.${key}`;
  }
  function tCommon(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Imports
  import { Plus, Trash2, RotateCcw, Volume2, VolumeX } from 'lucide-svelte';
  import { COLORS } from '@/lib/tool-stubs';

  // Types
  interface WheelOption {
  id: string;
  label: string;
  color: string;
}

  let options = $state([
    { id: '1', label: 'Option 1', color: COLORS[0] },
    { id: '2', label: 'Option 2', color: COLORS[1] },
    { id: '3', label: 'Option 3', color: COLORS[2] },
  ]);

  let isSpinning = $state(false);

  let rotation = $state(0);

  let winner = $state(null);

  let soundEnabled = $state(true);

  let canvasRef = $state(null);

  let audioRef = $state(null);

  function drawWheel() {
    const canvas = canvasRef;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const sliceAngle = (2 * Math.PI) / options.length;

    options.forEach((option, index) => {
      const startAngle = index * sliceAngle + (rotation * Math.PI / 180);
      const endAngle = startAngle + sliceAngle;

      // Draw slice
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = option.color;
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw text
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 14px sans-serif';
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 2;
      
      const text = option.label.length > 15 ? option.label.substring(0, 15) + '...' : option.label;
      ctx.fillText(text, radius - 20, 5);
      ctx.restore();
    });

    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw pointer
    ctx.beginPath();
    ctx.moveTo(centerX + radius + 5, centerY);
    ctx.lineTo(centerX + radius - 15, centerY - 15);
    ctx.lineTo(centerX + radius - 15, centerY + 15);
    ctx.closePath();
    ctx.fillStyle = '#333';
    ctx.fill();
  }

  function spin() {
    if (isSpinning || options.length < 2) return;

    isSpinning = true;
    winner = null;

    // Random spin amount (5-10 full rotations + random angle)
    const spins = 5 + Math.random() * 5;
    const extraAngle = Math.random() * 360;
    const totalRotation = spins * 360 + extraAngle;

    // Animate the spin
    const startRotation = rotation;
    const duration = 4000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease out cubic)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      const currentRotation = startRotation + totalRotation * easeOut;
      rotation = currentRotation % 360;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Determine winner
        const finalAngle = (360 - (currentRotation % 360)) % 360;
        const sliceAngle = 360 / options.length;
        const winnerIndex = Math.floor(finalAngle / sliceAngle);
        winner = options[winnerIndex].label;
        isSpinning = false;

        // Play sound
        if (soundEnabled && audioRef) {
          audioRef.play().catch(() => {});
        }
      }
    };

    requestAnimationFrame(animate);
  }

  $effect(() => {
    drawWheel();
  });

  // Functions
  function addOption() {
    const newId = Date.now().toString();
    const colorIndex = options.length % COLORS.length;
    options = [...options, { id: newId, label: `Option ${options.length + 1}`, color: COLORS[colorIndex] }];
  }
  function removeOption(id: string) {
    if (options.length > 2) {
      options = options.filter(o => o.id !== id);
    }
  }
  function updateOption(id: string, label: string) {
    options = options.map(o => o.id === id ? { ...o, label } : o);
  }
  function reset() {
    rotation = 0;
    winner = null;
    options = [
      { id: '1', label: 'Option 1', color: COLORS[0] },
      { id: '2', label: 'Option 2', color: COLORS[1] },
      { id: '3', label: 'Option 3', color: COLORS[2] },
    ];
  }

</script>


    <div class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Wheel -->
        <div class="flex flex-col items-center">
          <canvas
            bind:this={canvasRef}
            width={350}
            height={350}
            class="max-w-full"></canvas>
          
          <!-- Winner Display -->
          {#if winner}
<div class="mt-4 p-4 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-lg border border-yellow-300 dark:border-yellow-700 text-center">
              <div class="text-sm text-gray-600 dark:text-gray-400">{t('winner')}</div>
              <div class="text-2xl font-bold text-gray-900 dark:text-white">{winner}</div>
            </div>
{/if}

          <!-- Controls -->
          <div class="flex gap-3 mt-4">
            <button
              onclick={spin}
              disabled={isSpinning || options.length < 2}
              class="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-slate-500 to-pink-500 text-white rounded-lg hover:from-slate-600 hover:to-pink-600 disabled:opacity-50 transition-all font-medium"
            >
              {t('spin')}
            </button>
            <button
              onclick={() => soundEnabled = !soundEnabled}
              class="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {#if soundEnabled}
<Volume2 class="w-5 h-5" />
{:else}
<VolumeX class="w-5 h-5" />
{/if}
            </button>
            <button
              onclick={reset}
              class="p-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <RotateCcw class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Options List -->
        <div class="space-y-3">
          <label class="tool-label">
            {t('options')} ({options.length})
          </label>
          
          <div class="space-y-2 max-h-80 overflow-y-auto">
            {#each options as option, index (option.id)}
<div  class="flex items-center gap-2">
                <div
                  class="w-6 h-6 rounded-full flex-shrink-0"
                  style="background-color: {option.color}"></div>
                <input
                  type="text"
                  value={option.label}
                  onchange={(e) => updateOption(option.id, e.target.value)}
                  class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                <button
                  onclick={() => removeOption(option.id)}
                  disabled={options.length <= 2}
                  class="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg disabled:opacity-30"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
{/each}
          </div>

          <button
            onclick={addOption}
            class="flex items-center gap-2 px-4 py-2 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg w-full justify-center"
          >
            <Plus class="w-4 h-4" />
            {t('addOption')}
          </button>
        </div>
      </div>

    </div>
  
