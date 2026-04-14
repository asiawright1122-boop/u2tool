<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['glassmorphism-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.glassmorphism-generator.${key}`;
  }
  function common(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  let blur = $state(10);

  let transparency = $state(0.25);

  let borderOpacity = $state(0.18);

  let bgColor = $state('#ffffff');

  let shadowOpacity = $state(0.1);

  let copied = $state(false);

  let cssCode = $derived.by(() => {
    return `/* Glassmorphism Effect */
background: ${hexToRgba(bgColor, transparency)};
backdrop-filter: blur(${blur}px);
-webkit-backdrop-filter: blur(${blur}px);
border-radius: 16px;
border: 1px solid ${hexToRgba(bgColor, borderOpacity)};
box-shadow: 0 4px 30px rgba(0, 0, 0, ${shadowOpacity});`;
  });

  let previewStyle = $derived(({
    background: hexToRgba(bgColor, transparency),
    backdropFilter: `blur(${blur}px)`,
    WebkitBackdropFilter: `blur(${blur}px)`,
    borderRadius: '16px',
    border: `1px solid ${hexToRgba(bgColor, borderOpacity)}`,
    boxShadow: `0 4px 30px rgba(0, 0, 0, ${shadowOpacity})`,
  }));

  // Functions
  function hexToRgba(hex: string, alpha: number) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  async function handleCopy() {
    await navigator.clipboard.writeText(cssCode);
    copied = true;
    setTimeout(() => copied = false, 2000);
  }

</script>


    <div class="space-y-6">
      <!-- Preview -->
      <div 
        class="relative h-64 rounded-lg overflow-hidden"
        style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      >
        <div class="absolute inset-0 flex items-center justify-center p-8">
          <div 
            style={previewStyle}
            class="w-full max-w-md p-6 text-center"
          >
            <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Glassmorphism
            </h3>
            <p class="text-gray-600 dark:text-gray-300 text-sm">
              {t('previewText')}
            </p>
          </div>
        </div>
      </div>

      <!-- Controls -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div>
            <label class="tool-label">
              {t('blur')}: {blur}px
            </label>
            <input
              type="range"
              min="0"
              max="30"
              value={blur}
              onchange={(e) => blur = Number(e.target.value)}
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </div>

          <div>
            <label class="tool-label">
              {t('transparency')}: {(transparency * 100).toFixed(0)}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={transparency * 100}
              onchange={(e) => transparency = Number(e.target.value) / 100}
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </div>

          <div>
            <label class="tool-label">
              {t('borderOpacity')}: {(borderOpacity * 100).toFixed(0)}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={borderOpacity * 100}
              onchange={(e) => borderOpacity = Number(e.target.value) / 100}
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </div>
        </div>

        <div class="space-y-4">
          <div>
            <label class="tool-label">
              {t('shadowOpacity')}: {(shadowOpacity * 100).toFixed(0)}%
            </label>
            <input
              type="range"
              min="0"
              max="50"
              value={shadowOpacity * 100}
              onchange={(e) => shadowOpacity = Number(e.target.value) / 100}
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </div>

          <div>
            <label class="tool-label">
              {t('backgroundColor')}
            </label>
            <div class="flex items-center gap-3">
              <input
                type="color"
                bind:value={bgColor}
                class="w-12 h-10 rounded cursor-pointer"
              />
              <input
                type="text"
                bind:value={bgColor}
                class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- CSS Output -->
      <div>
        <div class="flex items-center justify-between mb-2">
          <label class="tool-label">
            CSS {common('output')}
          </label>
          <button
            onclick={handleCopy}
            class="px-3 py-1 text-sm bg-amber-500 text-white rounded hover:bg-amber-600 transition-colors"
          >
            {copied ? common('copied') : common('copy')}
          </button>
        </div>
        <pre class="p-4 bg-gray-900 text-green-400 rounded-lg overflow-x-auto text-sm font-mono">
          {cssCode}
        </pre>
      </div>
    </div>
  
