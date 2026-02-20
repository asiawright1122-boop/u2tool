<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['box-shadow-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.box-shadow-generator.${key}`;
  }

  // Types
  interface Shadow {
  id: number;
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
  color: string;
  opacity: number;
  inset: boolean;
}

  let shadows = $state([
    { id: 1, offsetX: 5, offsetY: 5, blur: 15, spread: 0, color: '#000000', opacity: 30, inset: false }
  ]);

  let boxColor = $state('#3b82f6');

  let boxRadius = $state(8);

  // Functions
  function addShadow() {
    const newId = Math.max(...shadows.map(s => s.id), 0) + 1;
    shadows = [...shadows, { 
      id: newId, offsetX: 5, offsetY: 5, blur: 15, spread: 0, 
      color: '#000000', opacity: 30, inset: false 
    }];
  }
  function removeShadow(id: number) {
    if (shadows.length > 1) {
      shadows = shadows.filter(s => s.id !== id);
    }
  }
  function updateShadow(id: number, field: keyof Shadow, value: number | string | boolean) {
    shadows = shadows.map(s => s.id === id ? { ...s, [field]: value } : s);
  }
  function hexToRgba(hex: string, opacity: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
  }
  function generateCss(): string {
    const shadowStrings = shadows.map(s => {
      const insetStr = s.inset ? 'inset ' : '';
      const colorStr = hexToRgba(s.color, s.opacity);
      return `${insetStr}${s.offsetX}px ${s.offsetY}px ${s.blur}px ${s.spread}px ${colorStr}`;
    });
    return shadowStrings.join(', ');
  }
  function copyToClipboard() {
    navigator.clipboard.writeText(`box-shadow: ${generateCss()};`);
  }

</script>


    <div class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">{t('shadowLayers')}</h3>
            <button
              onclick={addShadow}
              class="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
            >
              {t('addLayer')}
            </button>
          </div>
          
          {#each shadows as shadow, index (shadow.id)}
<div  class="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-4 space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-gray-700 dark:text-gray-300 font-medium">{t('layer', { index: index + 1 })}</span>
                {#if shadows.length > 1}
<button onclick={() => removeShadow(shadow.id)} class="text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 text-sm">
                    {t('remove')}
                  </button>
{/if}
              </div>
              
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs text-gray-600 dark:text-gray-300 mb-1">{t('offsetX')}: {shadow.offsetX}px</label>
                  <input type="range" min="-50" max="50" value={shadow.offsetX}
                    onchange={(e) => updateShadow(shadow.id, 'offsetX', parseInt(e.target.value))}
                    class="w-full" />
                </div>
                <div>
                  <label class="block text-xs text-gray-600 dark:text-gray-300 mb-1">{t('offsetY')}: {shadow.offsetY}px</label>
                  <input type="range" min="-50" max="50" value={shadow.offsetY}
                    onchange={(e) => updateShadow(shadow.id, 'offsetY', parseInt(e.target.value))}
                    class="w-full" />
                </div>
                <div>
                  <label class="block text-xs text-gray-600 dark:text-gray-300 mb-1">{t('blur')}: {shadow.blur}px</label>
                  <input type="range" min="0" max="100" value={shadow.blur}
                    onchange={(e) => updateShadow(shadow.id, 'blur', parseInt(e.target.value))}
                    class="w-full" />
                </div>
                <div>
                  <label class="block text-xs text-gray-600 dark:text-gray-300 mb-1">{t('spread')}: {shadow.spread}px</label>
                  <input type="range" min="-50" max="50" value={shadow.spread}
                    onchange={(e) => updateShadow(shadow.id, 'spread', parseInt(e.target.value))}
                    class="w-full" />
                </div>
              </div>
              
              <div class="flex gap-4 items-center">
                <div class="flex items-center gap-2">
                  <label class="text-xs text-gray-600 dark:text-gray-300">{t('color')}</label>
                  <input type="color" value={shadow.color}
                    onchange={(e) => updateShadow(shadow.id, 'color', e.target.value)}
                    class="w-8 h-8 rounded cursor-pointer" />
                </div>
                <div class="flex-1">
                  <label class="block text-xs text-gray-600 dark:text-gray-300 mb-1">{t('opacity')}: {shadow.opacity}%</label>
                  <input type="range" min="0" max="100" value={shadow.opacity}
                    onchange={(e) => updateShadow(shadow.id, 'opacity', parseInt(e.target.value))}
                    class="w-full" />
                </div>
                <label class="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                  <input type="checkbox" checked={shadow.inset}
                    onchange={(e) => updateShadow(shadow.id, 'inset', e.target.checked)}
                    class="rounded" />
                  {t('inset')}
                </label>
              </div>
            </div>
{/each}
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-gray-600 dark:text-gray-300 mb-2">{t('boxColor')}</label>
              <input type="color" bind:value={boxColor}
                class="w-full h-10 rounded cursor-pointer" />
            </div>
            <div>
              <label class="block text-sm text-gray-600 dark:text-gray-300 mb-2">{t('borderRadius')}: {boxRadius}px</label>
              <input type="range" min="0" max="50" value={boxRadius}
                onchange={(e) => boxRadius = parseInt(e.target.value)}
                class="w-full mt-2" />
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">{t('preview')}</h3>
          <div class="bg-gray-200 dark:bg-gray-600 rounded-lg p-8 flex items-center justify-center min-h-[300px]">
            <div
              class="w-48 h-48 transition-all duration-200"
              style="background-color: boxColor; border-radius: {boxRadius}px; box-shadow: generateCss()"></div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{t('output')}</label>
            <div class="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-4 font-mono text-sm text-green-600 dark:text-green-400 break-all">
              box-shadow: {generateCss()};
            </div>
          </div>
          
          <button onclick={copyToClipboard}
            class="w-full px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
            {t('copy')}
          </button>
        </div>
      </div>
    </div>
  
