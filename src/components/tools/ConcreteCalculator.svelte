<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['concrete-calculator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.concrete-calculator.${key}`;
  }
  function tc(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  type Shape = 'slab' | 'column' | 'stairs' | 'footing';
  type Unit = 'metric' | 'imperial';
  interface ConcreteResult {
  volume: number;
  bags40lb: number;
  bags60lb: number;
  bags80lb: number;
  yards: number;
}

  let shape = $state('slab');

  let unit = $state('metric');

  let length = $state('');

  let width = $state('');

  let depth = $state('');

  let diameter = $state('');

  let height = $state('');

  let quantity = $state('1');

  let stairWidth = $state('');

  let riseHeight = $state('');

  let runDepth = $state('');

  let numSteps = $state('');

  // Functions
  const shapes: { id: Shape; icon: string }[] = [
    { id: 'slab', icon: '⬜' },
    { id: 'column', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>' },
    { id: 'stairs', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20h.01"/><path d="M7 20v-4"/><path d="M12 20v-8"/><path d="M17 20V8"/><path d="M22 4v16"/></svg>' },
    { id: 'footing', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="8" x2="16" y1="10" y2="10"/><line x1="8" x2="16" y1="14" y2="14"/><line x1="8" x2="16" y1="18" y2="18"/></svg>' },
  ];
  function calculateVolume(): ConcreteResult | null {
    let volumeCubicMeters = 0;
    const qty = parseInt(quantity) || 1;
    
    // Convert to meters if imperial
    const toMeters = (val: string, isDepth = false) => {
      const num = parseFloat(val);
      if (isNaN(num)) return 0;
      if (unit === 'imperial') {
        return isDepth ? num * 0.0254 : num * 0.3048; // inches to m for depth, feet to m for length
      }
      return isDepth ? num / 100 : num; // cm to m for depth, m for length
    };

    switch (shape) {
      case 'slab':
      case 'footing': {
        const l = toMeters(length);
        const w = toMeters(width);
        const d = toMeters(depth, true);
        if (l && w && d) {
          volumeCubicMeters = l * w * d * qty;
        }
        break;
      }
      case 'column': {
        const d = toMeters(diameter, true);
        const h = toMeters(height);
        if (d && h) {
          const radius = d / 2;
          volumeCubicMeters = Math.PI * radius * radius * h * qty;
        }
        break;
      }
      case 'stairs': {
        const sw = toMeters(stairWidth);
        const rh = toMeters(riseHeight, true);
        const rd = toMeters(runDepth, true);
        const steps = parseInt(numSteps) || 0;
        if (sw && rh && rd && steps) {
          // Volume of stairs = sum of each step
          // Each step is a rectangular prism
          volumeCubicMeters = sw * rh * rd * steps;
          // Add the triangular portion
          volumeCubicMeters += (sw * rh * rd * steps * (steps - 1)) / 2;
        }
        break;
      }
    }

    if (volumeCubicMeters <= 0) return null;

    // Convert to cubic yards
    const cubicYards = volumeCubicMeters * 1.30795;
    
    // Calculate bags needed (approximate)
    // 40lb bag = 0.011 cubic yards
    // 60lb bag = 0.017 cubic yards
    // 80lb bag = 0.022 cubic yards
    const bags40lb = Math.ceil(cubicYards / 0.011);
    const bags60lb = Math.ceil(cubicYards / 0.017);
    const bags80lb = Math.ceil(cubicYards / 0.022);

    return {
      volume: volumeCubicMeters,
      bags40lb,
      bags60lb,
      bags80lb,
      yards: cubicYards,
    };
  }
  const result = calculateVolume();

</script>


    <div class="space-y-6">
      <!-- Shape Selection -->
      <div>
        <label class="tool-label">
          {t('selectShape')}
        </label>
        <div class="flex flex-wrap gap-2">
          {#each shapes as s (s.id)}
<button 
              onclick={() => shape = s.id}
              class={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                shape === s.id
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <span>{s.icon}</span>
              <span>{t(s.id)}</span>
            </button>
{/each}
        </div>
      </div>

      <!-- Unit Selection -->
      <div class="flex gap-2">
        <button
          onclick={() => unit = 'metric'}
          class={`px-3 py-1 rounded text-sm ${
            unit === 'metric' ? 'bg-orange-600 text-white' : 'bg-gray-200 dark:bg-gray-700'
          }`}
        >
          {t('metric')} (m, cm)
        </button>
        <button
          onclick={() => unit = 'imperial'}
          class={`px-3 py-1 rounded text-sm ${
            unit === 'imperial' ? 'bg-orange-600 text-white' : 'bg-gray-200 dark:bg-gray-700'
          }`}
        >
          {t('imperial')} (ft, in)
        </button>
      </div>

      <!-- Dimension Inputs -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {#if shape === 'slab' || shape === 'footing'}

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('length')} ({unit === 'metric' ? 'm' : 'ft'})
              </label>
              <input
                type="number"
                bind:value={length}
                class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('width')} ({unit === 'metric' ? 'm' : 'ft'})
              </label>
              <input
                type="number"
                bind:value={width}
                class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('depth')} ({unit === 'metric' ? 'cm' : 'in'})
              </label>
              <input
                type="number"
                bind:value={depth}
                class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('quantity')}
              </label>
              <input
                type="number"
                bind:value={quantity}
                min="1"
                class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              />
            </div>
          
{/if}

        {#if shape === 'column'}

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('diameter')} ({unit === 'metric' ? 'cm' : 'in'})
              </label>
              <input
                type="number"
                bind:value={diameter}
                class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('height')} ({unit === 'metric' ? 'm' : 'ft'})
              </label>
              <input
                type="number"
                bind:value={height}
                class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('quantity')}
              </label>
              <input
                type="number"
                bind:value={quantity}
                min="1"
                class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              />
            </div>
          
{/if}

        {#if shape === 'stairs'}

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('stairWidth')} ({unit === 'metric' ? 'm' : 'ft'})
              </label>
              <input
                type="number"
                bind:value={stairWidth}
                class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('riseHeight')} ({unit === 'metric' ? 'cm' : 'in'})
              </label>
              <input
                type="number"
                bind:value={riseHeight}
                class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('runDepth')} ({unit === 'metric' ? 'cm' : 'in'})
              </label>
              <input
                type="number"
                bind:value={runDepth}
                class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('numSteps')}
              </label>
              <input
                type="number"
                bind:value={numSteps}
                min="1"
                class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              />
            </div>
          
{/if}
      </div>

      <!-- Results -->
      {#if result}
<div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('results')}
          </h3>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div class="p-4 rounded-lg bg-white dark:bg-gray-700 text-center">
              <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">{t('volume')}</div>
              <div class="text-xl font-bold text-gray-900 dark:text-white">
                {result.volume.toFixed(2)} m³
              </div>
              <div class="text-sm text-gray-500">
                {result.yards.toFixed(2)} yd³
              </div>
            </div>
            <div class="p-4 rounded-lg bg-white dark:bg-gray-700 text-center">
              <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">40 lb {t('bags')}</div>
              <div class="text-xl font-bold text-orange-600">{result.bags40lb}</div>
            </div>
            <div class="p-4 rounded-lg bg-white dark:bg-gray-700 text-center">
              <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">60 lb {t('bags')}</div>
              <div class="text-xl font-bold text-orange-600">{result.bags60lb}</div>
            </div>
            <div class="p-4 rounded-lg bg-white dark:bg-gray-700 text-center">
              <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">80 lb {t('bags')}</div>
              <div class="text-xl font-bold text-orange-600">{result.bags80lb}</div>
            </div>
          </div>
          <p class="text-xs text-gray-500 mt-4">{t('note')}</p>
        </div>
{/if}
    </div>
  
