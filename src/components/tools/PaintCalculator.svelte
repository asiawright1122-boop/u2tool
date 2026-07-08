<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['paint-calculator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.paint-calculator.${key}`;
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
  interface Wall {
  id: number;
  width: string;
  height: string;
}
  interface Opening {
  id: number;
  width: string;
  height: string;
  quantity: string;
}

  let unit = $state('metric');

  let walls = $state([{ id: 1, width: '', height: '' }]);

  let openings = $state([]);

  let coats = $state('2');

  let coverage = $state('10');

  // Functions
  function addWall() {
    walls = [...walls, { id: Date.now(), width: '', height: '' }];
  }
  function removeWall(id: number) {
    if (walls.length > 1) {
      walls = walls.filter(w => w.id !== id);
    }
  }
  function updateWall(id: number, field: 'width' | 'height', value: string) {
    walls = walls.map(w => w.id === id ? { ...w, [field]: value } : w);
  }
  function addOpening() {
    openings = [...openings, { id: Date.now(), width: '', height: '', quantity: '1' }];
  }
  function removeOpening(id: number) {
    openings = openings.filter(o => o.id !== id);
  }
  function updateOpening(id: number, field: 'width' | 'height' | 'quantity', value: string) {
    openings = openings.map(o => o.id === id ? { ...o, [field]: value } : o);
  }
  function calculate() {
    // Convert to meters if imperial
    const toMeters = (val: string) => {
      const num = parseFloat(val);
      if (isNaN(num)) return 0;
      return unit === 'imperial' ? num * 0.3048 : num;
    };

    // Calculate total wall area
    let totalWallArea = 0;
    walls.forEach(wall => {
      const w = toMeters(wall.width);
      const h = toMeters(wall.height);
      if (w && h) {
        totalWallArea += w * h;
      }
    });

    // Calculate opening area to subtract
    let openingArea = 0;
    openings.forEach(opening => {
      const w = toMeters(opening.width);
      const h = toMeters(opening.height);
      const qty = parseInt(opening.quantity) || 1;
      if (w && h) {
        openingArea += w * h * qty;
      }
    });

    const paintableArea = totalWallArea - openingArea;
    if (paintableArea <= 0) return null;

    const numCoats = parseInt(coats) || 2;
    const coverageRate = parseFloat(coverage) || 10;
    
    const totalArea = paintableArea * numCoats;
    const litersNeeded = totalArea / coverageRate;
    const gallonsNeeded = litersNeeded * 0.264172;

    return {
      wallArea: totalWallArea,
      openingArea,
      paintableArea,
      totalArea,
      liters: litersNeeded,
      gallons: gallonsNeeded,
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
            unit === 'metric' ? 'btn-success' : 'bg-gray-200 dark:bg-gray-700'
          }`}
        >
          {t('metric')} (m)
        </button>
        <button
          onclick={() => unit = 'imperial'}
          class={`px-3 py-1 rounded text-sm ${
            unit === 'imperial' ? 'btn-success' : 'bg-gray-200 dark:bg-gray-700'
          }`}
        >
          {t('imperial')} (ft)
        </button>
      </div>

      <!-- Walls -->
      <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-semibold text-gray-900 dark:text-white">{t('walls')}</h3>
          <button
            onclick={addWall}
            class="px-3 py-1 btn-success rounded-lg text-sm hover:bg-green-700"
          >
            + {t('addWall')}
          </button>
        </div>
        <div class="space-y-3">
          {#each walls as wall, idx (wall.id)}
<div  class="flex gap-2 items-center">
              <span class="text-sm text-gray-500 w-8">{idx + 1}.</span>
              <input
                type="number"
                value={wall.width}
                onchange={(e) => updateWall(wall.id, 'width', e.target.value)}
                placeholder={t('width')}
                class="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
              />
              <span class="text-gray-500">×</span>
              <input
                type="number"
                value={wall.height}
                onchange={(e) => updateWall(wall.id, 'height', e.target.value)}
                placeholder={t('height')}
                class="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
              />
              <span class="text-sm text-gray-500">{unit === 'metric' ? 'm' : 'ft'}</span>
              {#if walls.length > 1}
<button
                  onclick={() => removeWall(wall.id)}
                  class="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                >
                  ✕
                </button>
{/if}
            </div>
{/each}
        </div>
      </div>

      <!-- Openings (Doors/Windows) -->
      <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-semibold text-gray-900 dark:text-white">{t('openings')}</h3>
          <button
            onclick={addOpening}
            class="px-3 py-1 bg-amber-600 text-white rounded-lg text-sm hover:bg-amber-700"
          >
            + {t('addOpening')}
          </button>
        </div>
        {#if openings.length === 0}
<p class="text-sm text-gray-500">{t('noOpenings')}</p>
{:else}
<div class="space-y-3">
            {#each openings as opening, idx (opening.id)}
<div  class="flex gap-2 items-center flex-wrap">
                <span class="text-sm text-gray-500 w-8">{idx + 1}.</span>
                <input
                  type="number"
                  value={opening.width}
                  onchange={(e) => updateOpening(opening.id, 'width', e.target.value)}
                  placeholder={t('width')}
                  class="w-20 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                />
                <span class="text-gray-500">×</span>
                <input
                  type="number"
                  value={opening.height}
                  onchange={(e) => updateOpening(opening.id, 'height', e.target.value)}
                  placeholder={t('height')}
                  class="w-20 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                />
                <span class="text-gray-500">×</span>
                <input
                  type="number"
                  value={opening.quantity}
                  onchange={(e) => updateOpening(opening.id, 'quantity', e.target.value)}
                  placeholder={t('qty')}
                  min="1"
                  class="w-16 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                />
                <button
                  onclick={() => removeOpening(opening.id)}
                  class="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                >
                  ✕
                </button>
              </div>
{/each}
          </div>
{/if}
      </div>

      <!-- Settings -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="paint-calculator-field-4" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('coats')}
          </label>
          <select
            bind:value={coats}
            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700" id="paint-calculator-field-4">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
        </div>
        <div>
          <label for="paint-calculator-field-3" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('coverage')} (m²/L)
          </label>
          <input
            type="number"
            bind:value={coverage}
            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700" id="paint-calculator-field-3" />
        </div>
      </div>

      <!-- Results -->
      {#if result}
{#if result.paintableArea > 0}
        <div class="bg-green-50 dark:bg-green-900/20 rounded-xl p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('results')}
          </h3>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div class="p-4 rounded-lg bg-white dark:bg-gray-700 text-center">
              <div class="text-xs text-gray-500 mb-1">{t('wallArea')}</div>
              <div class="text-lg font-bold text-gray-900 dark:text-white">
                {result.wallArea.toFixed(1)} m²
              </div>
            </div>
            <div class="p-4 rounded-lg bg-white dark:bg-gray-700 text-center">
              <div class="text-xs text-gray-500 mb-1">{t('openingArea')}</div>
              <div class="text-lg font-bold text-red-600">
                -{result.openingArea.toFixed(1)} m²
              </div>
            </div>
            <div class="p-4 rounded-lg bg-white dark:bg-gray-700 text-center">
              <div class="text-xs text-gray-500 mb-1">{t('paintableArea')}</div>
              <div class="text-lg font-bold text-gray-900 dark:text-white">
                {result.paintableArea.toFixed(1)} m²
              </div>
            </div>
            <div class="p-4 rounded-lg bg-green-100 dark:bg-green-800 text-center col-span-2 sm:col-span-1">
              <div class="text-xs text-gray-500 mb-1">{t('paintNeeded')}</div>
              <div class="text-2xl font-bold text-green-700 dark:text-green-300">
                {result.liters.toFixed(1)} L
              </div>
              <div class="text-sm text-gray-500">
                ({result.gallons.toFixed(1)} gal)
              </div>
            </div>
          </div>
        </div>
      {/if}
{/if}
    </div>
  
