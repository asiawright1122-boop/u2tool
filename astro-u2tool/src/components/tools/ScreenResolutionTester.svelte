<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['screen-resolution-tester'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.screen-resolution-tester.${key}`;
  }

  let screenWidth = $state(0);

  let screenHeight = $state(0);

  let viewportWidth = $state(0);

  let viewportHeight = $state(0);

  let devicePixelRatio = $state(1);

  let colorDepth = $state(0);

  let orientation = $state('');

  let customWidth = $state('');

  let customHeight = $state('');

  $effect(() => {
    const updateInfo = () => {
      screenWidth = window.screen.width;
      screenHeight = window.screen.height;
      viewportWidth = window.innerWidth;
      viewportHeight = window.innerHeight;
      devicePixelRatio = window.devicePixelRatio;
      colorDepth = window.screen.colorDepth;
      orientation = window.screen.orientation?.type || 'unknown';
    };

    updateInfo();
    window.addEventListener('resize', updateInfo);
    return () => window.removeEventListener('resize', updateInfo);
  });

  // Functions
  function openResolutionWindow(width: number, height: number) {
    window.open(
      window.location.href,
      '_blank',
      `width=${width},height=${height},menubar=no,toolbar=no,location=no,status=no`
    );
  }
  function openCustomResolution() {
    const w = parseInt(customWidth);
    const h = parseInt(customHeight);
    if (!isNaN(w) && !isNaN(h) && w > 0 && h > 0) {
      openResolutionWindow(w, h);
    }
  }

</script>


    <div class="space-y-6">
      <div class="p-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white">
        <h3 class="text-lg font-semibold mb-4">{t('currentScreen')}</h3>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <div class="text-sm opacity-80">{t('screenResolution')}</div>
            <div class="text-2xl font-bold">{screenWidth} × {screenHeight}</div>
          </div>
          <div>
            <div class="text-sm opacity-80">{t('viewportSize')}</div>
            <div class="text-2xl font-bold">{viewportWidth} × {viewportHeight}</div>
          </div>
          <div>
            <div class="text-sm opacity-80">{t('devicePixelRatio')}</div>
            <div class="text-2xl font-bold">{devicePixelRatio}x</div>
          </div>
          <div>
            <div class="text-sm opacity-80">{t('colorDepth')}</div>
            <div class="text-2xl font-bold">{colorDepth} bit</div>
          </div>
          <div>
            <div class="text-sm opacity-80">{t('orientation')}</div>
            <div class="text-2xl font-bold">{orientation.split('-')[0]}</div>
          </div>
          <div>
            <div class="text-sm opacity-80">{t('physicalResolution')}</div>
            <div class="text-2xl font-bold">
              {Math.round(screenWidth * devicePixelRatio)} × {Math.round(screenHeight * devicePixelRatio)}
            </div>
          </div>
        </div>
      </div>

      <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 class="font-semibold mb-3">{t('customResolution')}</h3>
        <div class="flex gap-2">
          <input
            type="number"
            bind:value={customWidth}
            class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder={t('width')}
          />
          <span class="flex items-center text-gray-500">×</span>
          <input
            type="number"
            bind:value={customHeight}
            class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder={t('height')}
          />
          <button
            onclick={openCustomResolution}
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('test')}
          </button>
        </div>
      </div>

      <div>
        <h3 class="font-semibold mb-3">{t('commonResolutions')}</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {#each commonResolutions as res (res.name)}
<button 
              onclick={() => openResolutionWindow(res.width, res.height)}
              class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
            >
              <div class="font-medium text-gray-900 dark:text-white">{res.name}</div>
              <div class="text-sm text-gray-500">{res.width} × {res.height}</div>
            </button>
{/each}
        </div>
      </div>

      <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 class="font-semibold mb-3">{t('viewportIndicator')}</h3>
        <div class="flex justify-center">
          <div
            class="border-2 border-blue-500 rounded relative"
            style="width: 300px; height: {300 * (viewportHeight / viewportWidth)}px; max-height: 200px"
          >
            <div class="absolute inset-0 flex items-center justify-center text-sm text-gray-500">
              {viewportWidth} × {viewportHeight}
            </div>
          </div>
        </div>
      </div>

      <div class="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
        <h3 class="font-semibold mb-2 text-yellow-800 dark:text-yellow-200">{t('note')}</h3>
        <p class="text-sm text-yellow-700 dark:text-yellow-300">
          {t('noteText')}
        </p>
      </div>
    </div>
  
