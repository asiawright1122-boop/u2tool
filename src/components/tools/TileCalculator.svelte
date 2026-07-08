<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['tile-calculator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.tile-calculator.${key}`;
  }
  function tc(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  type Unit = 'metric' | 'imperial';
  type Pattern = 'straight' | 'diagonal' | 'herringbone';

  let unit = $state('metric');

  let pattern = $state('straight');

  let roomLength = $state('');

  let roomWidth = $state('');

  let tileLength = $state('');

  let tileWidth = $state('');

  let groutWidth = $state('3');

  let wastePercent = $state('10');

  let tilesPerBox = $state('');

  // Functions
  const patterns: { id: Pattern; icon: string }[] = [
    { id: 'straight', icon: '▦' },
    { id: 'diagonal', icon: '◇' },
    { id: 'herringbone', icon: '⋈' },
  ];
  function calculate() {
    // Convert to meters
    const toMeters = (val: string, isTile = false) => {
      const num = parseFloat(val);
      if (isNaN(num)) return 0;
      if (unit === 'imperial') {
        return isTile ? num * 0.0254 : num * 0.3048;
      }
      return isTile ? num / 100 : num;
    };

    const rL = toMeters(roomLength);
    const rW = toMeters(roomWidth);
    const tL = toMeters(tileLength, true);
    const tW = toMeters(tileWidth, true);
    const grout = parseFloat(groutWidth) / 1000 || 0.003;
    const waste = parseFloat(wastePercent) / 100 || 0.1;

    if (!rL || !rW || !tL || !tW) return null;

    const roomArea = rL * rW;
    const tileArea = (tL + grout) * (tW + grout);
    
    // Pattern waste factor
    let patternFactor = 1;
    if (pattern === 'diagonal') patternFactor = 1.15;
    if (pattern === 'herringbone') patternFactor = 1.2;

    const tilesNeeded = Math.ceil((roomArea / tileArea) * patternFactor * (1 + waste));
    const boxesNeeded = tilesPerBox ? Math.ceil(tilesNeeded / parseInt(tilesPerBox)) : null;

    return {
      roomArea,
      tileArea: tL * tW,
      tilesNeeded,
      boxesNeeded,
      totalTileArea: tilesNeeded * tL * tW,
    };
  }
  const result = calculate();

</script>


    <div class="space-y-6">
      <!-- Unit Selection -->
      <div class="flex gap-2">
        <button
          onclick={() => unit = 'metric'}
          class={`px-3 py-1 rounded text-sm ${
            unit === 'metric' ? 'bg-amber-600 text-white' : 'bg-gray-200 dark:bg-gray-700'
          }`}
        >
          {t('metric')} (m, cm)
        </button>
        <button
          onclick={() => unit = 'imperial'}
          class={`px-3 py-1 rounded text-sm ${
            unit === 'imperial' ? 'bg-amber-600 text-white' : 'bg-gray-200 dark:bg-gray-700'
          }`}
        >
          {t('imperial')} (ft, in)
        </button>
      </div>

      <!-- Pattern Selection -->
      <div>
        <div class="tool-label">
          {t('pattern')}
        </div>
        <div class="flex gap-2">
          {#each patterns as p (p.id)}
<button 
              onclick={() => pattern = p.id}
              class={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                pattern === p.id
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <span>{p.icon}</span>
              <span>{t(p.id)}</span>
            </button>
{/each}
        </div>
      </div>

      <!-- Room Dimensions -->
      <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
        <h3 class="font-semibold text-gray-900 dark:text-white mb-3">{t('roomDimensions')}</h3>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="tile-calculator-field-15" class="block text-sm text-gray-600 dark:text-gray-400 mb-1">
              {t('length')} ({unit === 'metric' ? 'm' : 'ft'})
            </label>
            <input
              type="number"
              bind:value={roomLength}
              class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700" id="tile-calculator-field-15" />
          </div>
          <div>
            <label for="tile-calculator-field-14" class="block text-sm text-gray-600 dark:text-gray-400 mb-1">
              {t('width')} ({unit === 'metric' ? 'm' : 'ft'})
            </label>
            <input
              type="number"
              bind:value={roomWidth}
              class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700" id="tile-calculator-field-14" />
          </div>
        </div>
      </div>

      <!-- Tile Dimensions -->
      <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
        <h3 class="font-semibold text-gray-900 dark:text-white mb-3">{t('tileDimensions')}</h3>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="tile-calculator-field-13" class="block text-sm text-gray-600 dark:text-gray-400 mb-1">
              {t('tileLength')} ({unit === 'metric' ? 'cm' : 'in'})
            </label>
            <input
              type="number"
              bind:value={tileLength}
              class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700" id="tile-calculator-field-13" />
          </div>
          <div>
            <label for="tile-calculator-field-12" class="block text-sm text-gray-600 dark:text-gray-400 mb-1">
              {t('tileWidth')} ({unit === 'metric' ? 'cm' : 'in'})
            </label>
            <input
              type="number"
              bind:value={tileWidth}
              class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700" id="tile-calculator-field-12" />
          </div>
        </div>
      </div>

      <!-- Settings -->
      <div class="grid grid-cols-3 gap-4">
        <div>
          <label for="tile-calculator-field-11" class="block text-sm text-gray-600 dark:text-gray-400 mb-1">
            {t('groutWidth')} (mm)
          </label>
          <input
            type="number"
            bind:value={groutWidth}
            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700" id="tile-calculator-field-11" />
        </div>
        <div>
          <label for="tile-calculator-field-10" class="block text-sm text-gray-600 dark:text-gray-400 mb-1">
            {t('waste')} (%)
          </label>
          <input
            type="number"
            bind:value={wastePercent}
            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700" id="tile-calculator-field-10" />
        </div>
        <div>
          <label for="tile-calculator-field-9" class="block text-sm text-gray-600 dark:text-gray-400 mb-1">
            {t('tilesPerBox')}
          </label>
          <input
            type="number"
            bind:value={tilesPerBox}
            placeholder={t('optional')}
            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700" id="tile-calculator-field-9" />
        </div>
      </div>

      <!-- Results -->
      {#if result}
<div class="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('results')}
          </h3>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div class="p-4 rounded-lg bg-white dark:bg-gray-700 text-center">
              <div class="text-xs text-gray-500 mb-1">{t('roomArea')}</div>
              <div class="text-lg font-bold text-gray-900 dark:text-white">
                {result.roomArea.toFixed(2)} m²
              </div>
            </div>
            <div class="p-4 rounded-lg bg-white dark:bg-gray-700 text-center">
              <div class="text-xs text-gray-500 mb-1">{t('tileArea')}</div>
              <div class="text-lg font-bold text-gray-900 dark:text-white">
                {(result.tileArea * 10000).toFixed(0)} cm²
              </div>
            </div>
            <div class="p-4 rounded-lg bg-amber-100 dark:bg-amber-800 text-center">
              <div class="text-xs text-gray-500 mb-1">{t('tilesNeeded')}</div>
              <div class="text-2xl font-bold text-amber-700 dark:text-amber-300">
                {result.tilesNeeded}
              </div>
            </div>
            {#if result.boxesNeeded}
<div class="p-4 rounded-lg bg-green-100 dark:bg-green-800 text-center">
                <div class="text-xs text-gray-500 mb-1">{t('boxesNeeded')}</div>
                <div class="text-2xl font-bold text-green-700 dark:text-green-300">
                  {result.boxesNeeded}
                </div>
              </div>
{/if}
          </div>
        </div>
{/if}
    </div>
  
