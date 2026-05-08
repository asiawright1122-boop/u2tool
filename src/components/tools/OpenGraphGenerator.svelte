<script lang="ts">
  import { escapeHtmlAttribute } from '@/lib/sanitize';

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

  let data = $state({
    title: '',
    description: '',
    url: '',
    image: '',
    siteName: '',
    type: 'website'
  });

  // Functions
  function handleChange(e: Event) {
    const { name, value } = e.target;
    data = ({ ...data, [name]: value });
  }
  function generateMetaTags() {
    return `<!-- Open Graph / Facebook -->
<meta property="og:type" content="${escapeHtmlAttribute(data.type)}" />
<meta property="og:url" content="${escapeHtmlAttribute(data.url)}" />
<meta property="og:title" content="${escapeHtmlAttribute(data.title)}" />
<meta property="og:description" content="${escapeHtmlAttribute(data.description)}" />
<meta property="og:image" content="${escapeHtmlAttribute(data.image)}" />
<meta property="og:site_name" content="${escapeHtmlAttribute(data.siteName)}" />`;
  }
  const previewHostname = (() => {
    if (!data.url) return 'example.com';
    try {
      return new URL(data.url).hostname;
    } catch {
      return data.url;
    }
  })();

</script>


    <div class="max-w-4xl mx-auto space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div>
            <label class="tool-label">{t('openGraphGenerator.siteTitle')}</label>
            <input
              type="text"
              name="title"
              value={data.title}
              onchange={handleChange}
              class="tool-input"
              placeholder={t('openGraphGenerator.siteTitlePlaceholder')}
            />
          </div>

          <div>
            <label class="tool-label">{t('openGraphGenerator.siteDescription')}</label>
            <textarea
              name="description"
              value={data.description}
              onchange={handleChange}
              rows={3}
              class="tool-textarea h-auto"
              placeholder={t('openGraphGenerator.siteDescriptionPlaceholder')}></textarea>
          </div>

          <div>
            <label class="tool-label">{t('openGraphGenerator.url')}</label>
            <input
              type="url"
              name="url"
              value={data.url}
              onchange={handleChange}
              class="tool-input"
              placeholder={t('openGraphGenerator.urlPlaceholder')}
            />
          </div>

          <div>
            <label class="tool-label">{t('openGraphGenerator.imageUrl')}</label>
            <input
              type="url"
              name="image"
              value={data.image}
              onchange={handleChange}
              class="tool-input"
              placeholder={t('openGraphGenerator.imageUrlPlaceholder')}
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="tool-label">{t('openGraphGenerator.siteName')}</label>
              <input
                type="text"
                name="siteName"
                value={data.siteName}
                onchange={handleChange}
                class="tool-input"
                placeholder={t('openGraphGenerator.siteNamePlaceholder')}
              />
            </div>
            <div>
              <label class="tool-label">{t('openGraphGenerator.type')}</label>
              <select
                name="type"
                value={data.type}
                onchange={handleChange}
                class="tool-input"
              >
                <option value="website">{t('openGraphGenerator.typeWebsite')}</option>
                <option value="article">{t('openGraphGenerator.typeArticle')}</option>
                <option value="profile">{t('openGraphGenerator.typeProfile')}</option>
                <option value="video.movie">{t('openGraphGenerator.typeVideo')}</option>
                <option value="music.song">{t('openGraphGenerator.typeMusic')}</option>
              </select>
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <div>
            <label class="tool-label">{t('openGraphGenerator.preview')}</label>
            <div class="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden max-w-sm mx-auto">
              <div class="aspect-[1.91/1] bg-gray-200 dark:bg-gray-700 relative">
                {#if data.image}
<img src={data.image} alt={t('openGraphGenerator.ogPreviewAlt')} class="w-full h-full object-cover" />
{:else}
<div class="flex items-center justify-center h-full text-gray-500 dark:text-gray-300">
                    {t('openGraphGenerator.noImage')}
                  </div>
{/if}
              </div>
              <div class="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                <div class="text-xs text-gray-500 dark:text-gray-300 uppercase mb-1">{previewHostname}</div>
                <div class="font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">{data.title || t('openGraphGenerator.previewTitleFallback')}</div>
                <div class="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{data.description || t('openGraphGenerator.previewDescriptionFallback')}</div>
              </div>
            </div>
          </div>

          <div>
            <label class="tool-label">{t('openGraphGenerator.generatedHtml')}</label>
            <div class="relative">
              <textarea
                readOnly
                value={generateMetaTags()}
                rows={8}
                class="tool-textarea h-auto"></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  
