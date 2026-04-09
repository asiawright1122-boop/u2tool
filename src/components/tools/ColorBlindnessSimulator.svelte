<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['color-blindness-simulator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.color-blindness-simulator.${key}`;
  }

  // Types
  type ColorBlindnessType = 'normal' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';
  interface SimulationInfo {
  type: ColorBlindnessType;
  name: string;
  description: string;
  percentage: string;
}

  const simulations: SimulationInfo[] = [
    { type: 'normal', name: 'Normal', description: 'Normal vision', percentage: '92%' },
    { type: 'protanopia', name: 'Protanopia', description: 'Red-blind', percentage: '1%' },
    { type: 'deuteranopia', name: 'Deuteranopia', description: 'Green-blind', percentage: '5%' },
    { type: 'tritanopia', name: 'Tritanopia', description: 'Blue-blind', percentage: '0.1%' },
    { type: 'achromatopsia', name: 'Achromatopsia', description: 'Monochrome', percentage: '0.003%' },
  ];

  let color = $state('#3B82F6');

  let selectedType = $state<ColorBlindnessType>('normal');

  let image = $state<string | null>(null);

  // Functions
  function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  }
  function rgbToHex(r: number, g: number, b: number): string {
    return '#' + [r, g, b].map(x => {
      const hex = Math.round(Math.max(0, Math.min(255, x))).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  }
  function simulateColorBlindness(r: number, g: number, b: number, type: ColorBlindnessType) {
    const matrices: Record<ColorBlindnessType, number[][]> = {
      normal: [[1, 0, 0], [0, 1, 0], [0, 0, 1]],
      protanopia: [[0.567, 0.433, 0], [0.558, 0.442, 0], [0, 0.242, 0.758]],
      deuteranopia: [[0.625, 0.375, 0], [0.7, 0.3, 0], [0, 0.3, 0.7]],
      tritanopia: [[0.95, 0.05, 0], [0, 0.433, 0.567], [0, 0.475, 0.525]],
      achromatopsia: [[0.299, 0.587, 0.114], [0.299, 0.587, 0.114], [0.299, 0.587, 0.114]],
    };

    const m = matrices[type];
    return {
      r: m[0][0] * r + m[0][1] * g + m[0][2] * b,
      g: m[1][0] * r + m[1][1] * g + m[1][2] * b,
      b: m[2][0] * r + m[2][1] * g + m[2][2] * b,
    };
  }
  function getSimulatedColor(type: ColorBlindnessType): string {
    const rgb = hexToRgb(color);
    const simulated = simulateColorBlindness(rgb.r, rgb.g, rgb.b, type);
    return rgbToHex(simulated.r, simulated.g, simulated.b);
  }
  function handleImageUpload(e: Event) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        image = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
  function getFilterStyle(type: ColorBlindnessType): Record<string, string> {
    const filters: Record<ColorBlindnessType, string> = {
      normal: 'none',
      protanopia: 'url(#protanopia)',
      deuteranopia: 'url(#deuteranopia)',
      tritanopia: 'url(#tritanopia)',
      achromatopsia: 'grayscale(100%)',
    };
    return { filter: filters[type] };
  }

</script>


    <div class="space-y-6">
      <svg class="absolute w-0 h-0">
        <defs>
          <filter id="protanopia">
            <feColorMatrix type="matrix" values="0.567 0.433 0 0 0 0.558 0.442 0 0 0 0 0.242 0.758 0 0 0 0 0 1 0"></feColorMatrix>
          </filter>
          <filter id="deuteranopia">
            <feColorMatrix type="matrix" values="0.625 0.375 0 0 0 0.7 0.3 0 0 0 0 0.3 0.7 0 0 0 0 0 1 0"></feColorMatrix>
          </filter>
          <filter id="tritanopia">
            <feColorMatrix type="matrix" values="0.95 0.05 0 0 0 0 0.433 0.567 0 0 0 0.475 0.525 0 0 0 0 0 1 0"></feColorMatrix>
          </filter>
        </defs>
      </svg>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('selectColor')}
          </label>
          <div class="flex gap-3">
            <input
              type="color"
              bind:value={color}
              class="w-16 h-12 rounded cursor-pointer"
            />
            <input
              type="text"
              bind:value={color}
              class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('uploadImage')}
          </label>
          <input
            type="file"
            accept="image/*"
            onchange={handleImageUpload}
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
        {#each simulations as sim (sim.type)}
<button 
            onclick={() => selectedType = sim.type}
            class={`p-3 rounded-lg border-2 transition-colors ${
              selectedType === sim.type
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
            }`}
          >
            <div class="text-sm font-medium text-gray-900 dark:text-white">{t(`types.${sim.type}`)}</div>
            <div class="text-xs text-gray-500 dark:text-gray-400">{sim.percentage}</div>
          </button>
{/each}
      </div>

      <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 class="font-medium text-gray-900 dark:text-white mb-3">{t('colorComparison')}</h3>
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
          {#each simulations as sim (sim.type)}
<div  class="text-center">
              <div
                class="w-full h-20 rounded-lg mb-2 border border-gray-200 dark:border-gray-700"
                style="background-color: {getSimulatedColor(sim.type)}"></div>
              <div class="text-xs text-gray-600 dark:text-gray-400">{t(`types.${sim.type}`)}</div>
              <div class="text-xs font-mono text-gray-500">{getSimulatedColor(sim.type)}</div>
            </div>
{/each}
        </div>
      </div>

      {#if image}
<div class="space-y-4">
          <h3 class="font-medium text-gray-900 dark:text-white">{t('imagePreview')}</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div class="text-sm text-gray-600 dark:text-gray-400 mb-2">{t('original')}</div>
              <div class="relative min-h-[200px]" style="aspect-ratio: auto">
                <img 
                  src={image} 
                  alt="Original" 
                  class="w-full rounded-lg"
                  style="aspect-ratio: auto"
                />
              </div>
            </div>
            <div>
              <div class="text-sm text-gray-600 dark:text-gray-400 mb-2">{t(`types.${selectedType}`)}</div>
              <div class="relative min-h-[200px]" style="aspect-ratio: auto">
                <img 
                  src={image} 
                  alt="Simulated" 
                  class="w-full rounded-lg" 
                  style={`filter: ${(getFilterStyle(selectedType).filter ?? 'none')}; aspect-ratio: auto`} 
                />
              </div>
            </div>
          </div>
        </div>
{/if}

      <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 class="font-medium text-blue-800 dark:text-blue-300 mb-2">{t('aboutTitle')}</h3>
        <p class="text-sm text-blue-700 dark:text-blue-400">{t('aboutDescription')}</p>
      </div>
    </div>
  
