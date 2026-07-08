<script lang="ts">
  import { onDestroy } from 'svelte';
  import { escapeHtmlAttribute } from '@/lib/sanitize';
  import { normalizeHttpUrl, resolveHttpUrl } from '@/lib/url-safety';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  let mode = $state('manual');

  let fetchUrl = $state('');

  let loading = $state(false);

  let fetchError = $state('');

  let isInitialized = $state(false);

  let imageError = $state(false);

  let copied = $state(false);

  let title = $state('');

  let description = $state('');

  let image = $state('');

  let url = $state('');

  let siteName = $state('');

  let previewType = $state('facebook');

  let timerRef = $state(null);

  $effect(() => {
    if (!isInitialized) {
      title = t('openGraphPreview.defaultTitle');
      description = t('openGraphPreview.defaultDescription');
      siteName = t('openGraphPreview.defaultSiteName');
      url = 'https://example.com/page';
      isInitialized = true;
    }
  });

  $effect(() => {
    imageError = false;
  });  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  async function fetchOgTags() {
    if (!fetchUrl.trim()) return;

    const normalizedFetchUrl = normalizeHttpUrl(fetchUrl);
    if (!normalizedFetchUrl.ok) {
      fetchError = normalizedFetchUrl.error;
      return;
    }
    fetchUrl = normalizedFetchUrl.url;
    
    loading = true;
    fetchError = '';
    
    try {
      // 使用 allorigins 代理来绕过 CORS
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(normalizedFetchUrl.url)}`;
      const response = await fetch(proxyUrl);
      
      if (!response.ok) {
        throw new Error('Failed to fetch URL');
      }
      
      const html = await response.text();
      
      // 解析 HTML 获取 OG 标签
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // 获取 OG 标签
      const ogTitle = doc.querySelector('meta[property="og:title"]')?.getAttribute('content') 
        || doc.querySelector('title')?.textContent || '';
      const ogDescription = doc.querySelector('meta[property="og:description"]')?.getAttribute('content')
        || doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';
      const ogImage = doc.querySelector('meta[property="og:image"]')?.getAttribute('content') || '';
      const ogSiteName = doc.querySelector('meta[property="og:site_name"]')?.getAttribute('content') || '';
      const ogUrl = doc.querySelector('meta[property="og:url"]')?.getAttribute('content') || normalizedFetchUrl.url;
      
      // 处理相对路径的图片 URL
      const finalImage = ogImage ? resolveHttpUrl(ogImage, normalizedFetchUrl.url) : '';
      const finalUrl = resolveHttpUrl(ogUrl, normalizedFetchUrl.url) || normalizedFetchUrl.url;
      
      title = ogTitle;
      description = ogDescription;
      image = finalImage;
      siteName = ogSiteName;
      url = finalUrl;
      imageError = false;
      
    } catch (err) {
      fetchError = t('openGraphPreview.fetchError');
      console.error('Error fetching OG tags:', err);
    } finally {
      loading = false;
    }
  }
  function truncate(str: string, len: number) {
    return str.length > len ? str.substring(0, len) + '...' : str;
  }
  function getHostname(urlStr: string) {
    if (!urlStr) return 'example.com';
    try {
      return new URL(urlStr).hostname;
    } catch {
      return 'example.com';
    }
  }
  function generateOgTags() {
    const tags = [
      `<meta property="og:title" content="${escapeHtmlAttribute(title)}" />`,
      `<meta property="og:description" content="${escapeHtmlAttribute(description)}" />`,
      `<meta property="og:url" content="${escapeHtmlAttribute(url)}" />`,
      `<meta property="og:type" content="website" />`,
    ];
    
    if (siteName) {
      tags.push(`<meta property="og:site_name" content="${escapeHtmlAttribute(siteName)}" />`);
    }
    
    if (image) {
      tags.push(`<meta property="og:image" content="${escapeHtmlAttribute(image)}" />`);
      tags.push(`<meta property="og:image:width" content="1200" />`);
      tags.push(`<meta property="og:image:height" content="630" />`);
    }
    
    // Twitter Card 标签
    tags.push('');
    tags.push(`<meta name="twitter:card" content="summary_large_image" />`);
    tags.push(`<meta name="twitter:title" content="${escapeHtmlAttribute(title)}" />`);
    tags.push(`<meta name="twitter:description" content="${escapeHtmlAttribute(description)}" />`);
    if (image) {
      tags.push(`<meta name="twitter:image" content="${escapeHtmlAttribute(image)}" />`);
    }
    
    return tags.join('\n');
  }
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(generateOgTags());
      copied = true;
      if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
    } catch {
      // 复制失败
    }
  }

</script>

{#snippet renderImage(aspectClass)}
<div class={`${aspectClass} bg-gray-700 relative`}>
        {#if imageError}
<div class="w-full h-full flex items-center justify-center text-gray-400">
            <div class="text-center">
              <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <span class="text-sm">{t('openGraphPreview.imageLoadError')}</span>
            </div>
          </div>
{:else}
<img 
            src={image} 
            alt={title || 'Open Graph preview image'} 
            class="w-full h-full object-cover"
            width={1200}
            height={630}
            style="aspect-ratio: 1.91/1"
            onerror={() => imageError = true} 
          />
{/if}
      </div>
{/snippet}


    <div class="space-y-6">
      <!-- 模式选择 -->
      <div class="flex gap-4 p-4 bg-gray-100 dark:bg-gray-800/50 rounded-lg">
        <label class="flex items-center gap-2 cursor-pointer text-gray-700 dark:text-gray-200">
          <input
            type="radio"
            name="mode"
            checked={mode === 'fetch'}
            onchange={() => mode = 'fetch'}
            class="w-4 h-4"
          />
          <span>{t('openGraphPreview.modeFetch')}</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer text-gray-700 dark:text-gray-200">
          <input
            type="radio"
            name="mode"
            checked={mode === 'manual'}
            onchange={() => mode = 'manual'}
            class="w-4 h-4"
          />
          <span>{t('openGraphPreview.modeManual')}</span>
        </label>
      </div>

      <!-- URL 抓取模式 -->
      {#if mode === 'fetch'}
<div class="space-y-4">
          <div>
            <label for="open-graph-preview-field-14" class="block text-sm font-medium mb-2">{t('openGraphPreview.fetchUrlLabel')}</label>
            <div class="flex gap-2">
              <input
                type="text"
                bind:value={fetchUrl}
                class="tool-input flex-1"
                placeholder="https://example.com/article"
                onkeydown={(e) => e.key === 'Enter' && fetchOgTags()} id="open-graph-preview-field-14" />
              <button
                onclick={fetchOgTags}
                disabled={loading || !fetchUrl.trim()}
                class="px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded transition-colors"
              >
                {loading ? t('openGraphPreview.fetching') : t('openGraphPreview.fetchButton')}
              </button>
            </div>
            {#if fetchError}
<p class="text-red-400 text-sm mt-2">{fetchError}</p>
{/if}
          </div>
        </div>
{/if}

      <!-- 手动输入模式 -->
      {#if mode === 'manual'}

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="open-graph-preview-field-13" class="block text-sm font-medium mb-2">{t('openGraphPreview.title')}</label>
              <input
                type="text"
                bind:value={title}
                class="tool-input"
                placeholder={t('openGraphPreview.titlePlaceholder')} id="open-graph-preview-field-13" />
            </div>
            <div>
              <label for="open-graph-preview-field-12" class="block text-sm font-medium mb-2">{t('openGraphPreview.siteName')}</label>
              <input
                type="text"
                bind:value={siteName}
                class="tool-input"
                placeholder={t('openGraphPreview.siteNamePlaceholder')} id="open-graph-preview-field-12" />
            </div>
          </div>

          <div>
            <label for="open-graph-preview-field-11" class="block text-sm font-medium mb-2">{t('openGraphPreview.description')}</label>
            <textarea
              bind:value={description}
              class="tool-input"
              rows={2}
              placeholder={t('openGraphPreview.descriptionPlaceholder')} id="open-graph-preview-field-11"></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="open-graph-preview-field-10" class="block text-sm font-medium mb-2">{t('openGraphPreview.imageUrl')}</label>
              <input
                type="text"
                bind:value={image}
                class="tool-input"
                placeholder={t('openGraphPreview.imageUrlPlaceholder')} id="open-graph-preview-field-10" />
            </div>
            <div>
              <label for="open-graph-preview-field-9" class="block text-sm font-medium mb-2">{t('openGraphPreview.pageUrl')}</label>
              <input
                type="text"
                bind:value={url}
                class="tool-input"
                placeholder={t('openGraphPreview.pageUrlPlaceholder')} id="open-graph-preview-field-9" />
            </div>
          </div>
        
{/if}

      <!-- 抓取模式下显示获取到的信息（只读） -->
      {#if mode === 'fetch'}
{#if title}
        <div class="p-4 bg-gray-100 dark:bg-gray-800/30 rounded-lg space-y-2 text-sm">
          <div><span class="text-gray-500 dark:text-gray-400">{t('openGraphPreview.title')}:</span> <span class="text-gray-900 dark:text-gray-100">{title}</span></div>
          <div><span class="text-gray-500 dark:text-gray-400">{t('openGraphPreview.description')}:</span> <span class="text-gray-900 dark:text-gray-100">{description || '-'}</span></div>
          <div><span class="text-gray-500 dark:text-gray-400">{t('openGraphPreview.siteName')}:</span> <span class="text-gray-900 dark:text-gray-100">{siteName || '-'}</span></div>
          <div><span class="text-gray-500 dark:text-gray-400">{t('openGraphPreview.imageUrl')}:</span> <span class="text-gray-900 dark:text-gray-100">{image || '-'}</span></div>
        </div>
      {/if}
{/if}

      <!-- Preview Type Selector -->
      <div class="flex gap-2">
        <button
          onclick={() => previewType = 'facebook'}
          class={`px-4 py-2 rounded ${previewType === 'facebook' ? 'bg-amber-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'}`}
        >
          {t('openGraphPreview.platform.facebook')}
        </button>
        <button
          onclick={() => previewType = 'twitter'}
          class={`px-4 py-2 rounded ${previewType === 'twitter' ? 'bg-amber-400 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'}`}
        >
          {t('openGraphPreview.platform.twitter')}
        </button>
        <button
          onclick={() => previewType = 'linkedin'}
          class={`px-4 py-2 rounded ${previewType === 'linkedin' ? 'bg-amber-700 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'}`}
        >
          {t('openGraphPreview.platform.linkedin')}
        </button>
      </div>

      <!-- Preview -->
      <div>
        <div class="block text-sm font-medium mb-2">{t('openGraphPreview.preview')}</div>
        
        {#if previewType === 'facebook'}
<div class="max-w-[500px] bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
            {@render renderImage('aspect-[1.91/1]')}
            <div class="p-3 border-t border-gray-200 dark:border-gray-700">
              <div class="text-xs text-gray-500 dark:text-gray-300 uppercase">{getHostname(url)}</div>
              <div class="text-gray-900 dark:text-gray-100 font-semibold mt-1">{truncate(title, 60)}</div>
              <div class="text-gray-600 dark:text-gray-300 text-sm mt-1">{truncate(description, 150)}</div>
            </div>
          </div>
{/if}

        {#if previewType === 'twitter'}
<div class="max-w-[500px] bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
            {@render renderImage('aspect-[2/1]')}
            <div class="p-3">
              <div class="text-gray-900 dark:text-gray-100 font-bold">{truncate(title, 70)}</div>
              <div class="text-gray-600 dark:text-gray-300 text-sm mt-1">{truncate(description, 125)}</div>
              <div class="text-gray-500 dark:text-gray-300 text-sm mt-2 flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                </svg>
                {getHostname(url)}
              </div>
            </div>
          </div>
{/if}

        {#if previewType === 'linkedin'}
<div class="max-w-[500px] bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
            {@render renderImage('aspect-[1.91/1]')}
            <div class="p-3">
              <div class="text-gray-900 dark:text-gray-100 font-semibold">{truncate(title, 100)}</div>
              <div class="text-gray-500 dark:text-gray-300 text-xs mt-1">{getHostname(url)}</div>
            </div>
          </div>
{/if}
      </div>

      <!-- Generated Code -->
      <div>
        <div class="flex items-center justify-between mb-2">
          <div class="block text-sm font-medium">{t('openGraphPreview.generatedCode')}</div>
          <button
            onclick={handleCopy}
            class="px-3 py-1 text-sm bg-amber-600 hover:bg-amber-700 rounded transition-colors"
          >
            {copied ? t('copied') : t('copy')}
          </button>
        </div>
        <pre class="tool-input font-mono text-sm overflow-x-auto whitespace-pre-wrap">
          {generateOgTags()}
        </pre>
      </div>

      <!-- Recommendations -->
      <div class="p-4 bg-gray-100 dark:bg-gray-800/50 rounded-lg text-sm">
        <h3 class="font-medium mb-2 text-gray-900 dark:text-gray-100">{t('openGraphPreview.recommendations.title')}</h3>
        <ul class="space-y-1 text-gray-600 dark:text-gray-300">
          <li>• {t('openGraphPreview.recommendations.imageSize')}</li>
          <li>• {t('openGraphPreview.recommendations.titleLength')}</li>
          <li>• {t('openGraphPreview.recommendations.descriptionLength')}</li>
          <li>• {t('openGraphPreview.recommendations.highQuality')}</li>
          <li>• {t('openGraphPreview.recommendations.testDebugger')}</li>
        </ul>
      </div>
    </div>
  
