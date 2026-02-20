<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['lorem-picsum'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.lorem-picsum.${key}`;
  }

  let width = $state(800);

  let height = $state(600);

  let grayscale = $state(false);

  let blur = $state(0);

  let seed = $state('');

  let imageId = $state('');

  let imageUrl = $state('');

  function generateUrl() {
    let url = 'https://picsum.photos';
    
    if (seed) {
      url += `/seed/${seed}`;
    } else if (imageId) {
      url += `/id/${imageId}`;
    }
    
    url += `/${width}/${height}`;
    
    const params: string[] = [];
    if (grayscale) params.push('grayscale');
    if (blur > 0) params.push(`blur=${blur}`);
    
    if (params.length > 0) {
      url += '?' + params.join('&');
    }
    
    imageUrl = url;
  }

  // Functions
  function handleCopy(text: string) {
    navigator.clipboard.writeText(text);
  }
  function generateHtmlCode(): string {
    return `<img src="${imageUrl}" alt="Random image" width="${width}" height="${height}" />`;
  }
  function generateMarkdownCode(): string {
    return `![Random image](${imageUrl})`;
  }
  const presetSizes = [
    { label: '1920×1080 (HD)', width: 1920, height: 1080 },
    { label: '1280×720 (720p)', width: 1280, height: 720 },
    { label: '800×600', width: 800, height: 600 },
    { label: '400×300', width: 400, height: 300 },
    { label: '200×200', width: 200, height: 200 },
    { label: '150×150', width: 150, height: 150 },
  ];

</script>


    <div class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="tool-label">
                {t('width')} (px)
              </label>
              <input
                type="number"
                value={width}
                onchange={(e) => width = parseInt(e.target.value) || 0}
                min="1"
                max="5000"
                class="tool-input"
              />
            </div>
            <div class="space-y-2">
              <label class="tool-label">
                {t('height')} (px)
              </label>
              <input
                type="number"
                value={height}
                onchange={(e) => height = parseInt(e.target.value) || 0}
                min="1"
                max="5000"
                class="tool-input"
              />
            </div>
          </div>

          <div class="flex flex-wrap gap-2">
            {#each presetSizes as preset (preset.label)}
<button 
                onclick={() => { width = preset.width; height = preset.height; }}
                class="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                {preset.label}
              </button>
{/each}
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="tool-label">
                {t('seed')} ({t('optional')})
              </label>
              <input
                type="text"
                value={seed}
                onchange={(e) => { seed = e.target.value; imageId = ''; }}
                placeholder={t('seedPlaceholder')}
                class="tool-input"
              />
            </div>
            <div class="space-y-2">
              <label class="tool-label">
                {t('imageId')} ({t('optional')})
              </label>
              <input
                type="text"
                value={imageId}
                onchange={(e) => { imageId = e.target.value; seed = ''; }}
                placeholder="0-1084"
                class="tool-input"
              />
            </div>
          </div>

          <div class="flex items-center gap-6">
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                bind:checked={grayscale}
                class="w-4 h-4 text-blue-600 rounded"
              />
              <span class="text-sm text-gray-600 dark:text-gray-300">{t('grayscale')}</span>
            </label>

            <div class="flex items-center gap-2">
              <label class="text-sm text-gray-600 dark:text-gray-300">{t('blur')}:</label>
              <input
                type="range"
                value={blur}
                onchange={(e) => blur = parseInt(e.target.value)}
                min="0"
                max="10"
                class="w-24"
              />
              <span class="text-sm text-gray-600 dark:text-gray-300">{blur}</span>
            </div>
          </div>

          <button
            onclick={generateUrl}
            class="btn-primary w-full"
          >
            {t('generate')}
          </button>

          {#if imageUrl}
<div class="space-y-3">
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <label class="tool-label mb-0">{t('imageUrl')}</label>
                  <button onclick={() => handleCopy(imageUrl)} class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                    {t('copy')}
                  </button>
                </div>
                <input
                  type="text"
                  value={imageUrl}
                  readOnly
                  class="tool-input font-mono text-sm"
                />
              </div>

              <div class="grid grid-cols-1 gap-2">
                <div class="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded">
                  <code class="text-xs text-gray-600 dark:text-gray-300 truncate flex-1">{generateHtmlCode()}</code>
                  <button onclick={() => handleCopy(generateHtmlCode())} class="ml-2 text-xs text-blue-600 dark:text-blue-400">HTML</button>
                </div>
                <div class="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded">
                  <code class="text-xs text-gray-600 dark:text-gray-300 truncate flex-1">{generateMarkdownCode()}</code>
                  <button onclick={() => handleCopy(generateMarkdownCode())} class="ml-2 text-xs text-blue-600 dark:text-blue-400">Markdown</button>
                </div>
              </div>
            </div>
{/if}
        </div>

        <div class="space-y-4">
          <h3 class="font-medium text-gray-900 dark:text-gray-100">{t('preview')}</h3>
          <div 
            class="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center min-h-[300px]"
            style="aspect-ratio: {width}/{height}"
          >
            {#if imageUrl}
<img
                src={imageUrl}
                alt="Generated placeholder"
                width={width}
                height={height}
                class="max-w-full max-h-[400px] object-contain"
                style="aspect-ratio: {width}/{height}"
              />
{:else}
<p class="text-gray-500 dark:text-gray-300">{t('noPreview')}</p>
{/if}
          </div>
        </div>
      </div>

      <div class="p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg">
        <h3 class="font-medium text-blue-800 dark:text-blue-300 mb-2">{t('info')}</h3>
        <p class="text-sm text-blue-700 dark:text-blue-400">{t('infoText')}</p>
      </div>
    </div>
  
