<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['social-media-size-guide'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.social-media-size-guide.${key}`;
  }
  function tc(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Imports
  import { socialMediaSizes, type PlatformSizes, type ImageSize } from '@/lib/data/social-media-sizes';

  // Types
  interface PlatformCardProps {
  platform: PlatformSizes;
  onCopy: (size: ImageSize) => void;
  t: (key: string) => string;
}

  let selectedPlatform = $state(null);

  let searchQuery = $state('');

  // Functions
  const filteredPlatforms = searchQuery
    ? socialMediaSizes.filter(p => 
        p.platform.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sizes.some(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : socialMediaSizes;
  async function copySize(size: ImageSize) {
    const text = `${size.width} x ${size.height}`;
    await navigator.clipboard.writeText(text);
  }

</script>

{#snippet PlatformCard(platform: PlatformSizes, onCopy: (size: ImageSize) => void, translate: (key: string) => string)}
  <div class="p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
    <div class="flex items-center gap-2 mb-3">
      <span class="text-2xl">{platform.icon}</span>
      <h3 class="font-semibold text-gray-900 dark:text-white">{platform.platform}</h3>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
      {#each platform.sizes as size (size.name)}
        <button
          onclick={() => onCopy(size)}
          class="flex items-center justify-between gap-3 p-3 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700 text-left hover:border-amber-500"
          title={translate('copy')}
        >
          <span class="text-sm text-gray-700 dark:text-gray-300">{size.name}</span>
          <span class="font-mono text-sm text-amber-600 dark:text-amber-400">{size.width} x {size.height}</span>
        </button>
      {/each}
    </div>
  </div>
{/snippet}


    <div class="space-y-6">
      <!-- Search -->
      <div>
        <input
          type="text"
          bind:value={searchQuery}
          placeholder={t('searchPlaceholder')}
          class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>

      <!-- Platform Tabs -->
      <div class="flex flex-wrap gap-2">
        <button
          onclick={() => selectedPlatform = null}
          class={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            !selectedPlatform
              ? 'bg-amber-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          {t('all')}
        </button>
        {#each socialMediaSizes as platform (platform.platform)}
<button 
            onclick={() => selectedPlatform = platform.platform}
            class={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
              selectedPlatform === platform.platform
                ? 'text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
            style={selectedPlatform === platform.platform ? { backgroundColor: platform.color } : {}}
          >
            <span>{platform.icon}</span>
            <span>{platform.platform}</span>
          </button>
{/each}
      </div>

      <!-- Platform Cards -->
      <div class="space-y-6">
        {#each filteredPlatforms
          .filter(p => !selectedPlatform || p.platform === selectedPlatform) as platform (platform.platform)}
          {@render PlatformCard(platform, copySize, t)}
{/each}
      </div>
    </div>
  
