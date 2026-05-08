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
    card: 'summary_large_image',
    site: '',
    creator: '',
    title: '',
    description: '',
    image: '',
    alt: ''
  });

  // Functions
  function handleChange(e: Event) {
    const { name, value } = e.target;
    data = ({ ...data, [name]: value });
  }
  function generateMetaTags() {
    return `<!-- Twitter -->
<meta name="twitter:card" content="${escapeHtmlAttribute(data.card)}" />
<meta name="twitter:site" content="${escapeHtmlAttribute(data.site)}" />
<meta name="twitter:creator" content="${escapeHtmlAttribute(data.creator)}" />
<meta name="twitter:title" content="${escapeHtmlAttribute(data.title)}" />
<meta name="twitter:description" content="${escapeHtmlAttribute(data.description)}" />
<meta name="twitter:image" content="${escapeHtmlAttribute(data.image)}" />
<meta name="twitter:image:alt" content="${escapeHtmlAttribute(data.alt)}" />`;
  }

</script>


    <div class="max-w-4xl mx-auto space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{t('twitterCardGenerator.cardType')}</label>
            <select
              name="card"
              value={data.card}
              onchange={handleChange}
              class="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500"
            >
              <option value="summary">{t('twitterCardGenerator.cardSummary')}</option>
              <option value="summary_large_image">{t('twitterCardGenerator.cardSummaryLargeImage')}</option>
              <option value="app">{t('twitterCardGenerator.cardApp')}</option>
              <option value="player">{t('twitterCardGenerator.cardPlayer')}</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{t('twitterCardGenerator.title')}</label>
            <input
              type="text"
              name="title"
              value={data.title}
              onchange={handleChange}
              class="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500"
              placeholder={t('twitterCardGenerator.titlePlaceholder')}
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{t('twitterCardGenerator.description')}</label>
            <textarea
              name="description"
              value={data.description}
              onchange={handleChange}
              rows={3}
              class="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500"
              placeholder={t('twitterCardGenerator.descriptionPlaceholder')}
              maxLength={200}></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{t('twitterCardGenerator.imageUrl')}</label>
            <input
              type="url"
              name="image"
              value={data.image}
              onchange={handleChange}
              class="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500"
              placeholder={t('twitterCardGenerator.imageUrlPlaceholder')}
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{t('twitterCardGenerator.imageAltText')}</label>
            <input
              type="text"
              name="alt"
              value={data.alt}
              onchange={handleChange}
              class="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500"
              placeholder={t('twitterCardGenerator.imageAltTextPlaceholder')}
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{t('twitterCardGenerator.siteUsername')}</label>
              <input
                type="text"
                name="site"
                value={data.site}
                onchange={handleChange}
                class="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                placeholder={t('twitterCardGenerator.siteUsernamePlaceholder')}
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{t('twitterCardGenerator.creatorUsername')}</label>
              <input
                type="text"
                name="creator"
                value={data.creator}
                onchange={handleChange}
                class="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                placeholder={t('twitterCardGenerator.creatorUsernamePlaceholder')}
              />
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{t('twitterCardGenerator.preview')}</label>
            <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden max-w-sm mx-auto">
              {#if data.card === 'summary_large_image'}
<div class="aspect-[2/1] bg-gray-100 dark:bg-gray-700 relative">
                  {#if data.image}
<img src={data.image} alt={data.alt} class="w-full h-full object-cover" />
{:else}
<div class="flex items-center justify-center h-full text-gray-500 dark:text-gray-300">{t('twitterCardGenerator.previewImageFallback')}</div>
{/if}
                </div>
{:else}
<div class="flex border-b border-gray-200 dark:border-gray-700">
                  <div class="w-1/3 aspect-square bg-gray-100 dark:bg-gray-700 relative">
                    {#if data.image}
<img src={data.image} alt={data.alt} class="w-full h-full object-cover" />
{:else}
<div class="flex items-center justify-center h-full text-gray-500 dark:text-gray-300 text-xs">{t('twitterCardGenerator.previewImageFallback')}</div>
{/if}
                  </div>
                  <div class="w-2/3 p-3 bg-gray-50 dark:bg-gray-900 flex flex-col justify-center">
                     <div class="font-bold text-gray-900 dark:text-white mb-1 line-clamp-1 text-sm">{data.title || t('twitterCardGenerator.previewTitleFallback')}</div>
                     <div class="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">{data.description || t('twitterCardGenerator.previewDescriptionFallback')}</div>
                  </div>
                </div>
{/if}
              {#if data.card === 'summary_large_image'}
<div class="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                  <div class="font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">{data.title || t('twitterCardGenerator.previewTitleFallback')}</div>
                  <div class="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{data.description || t('twitterCardGenerator.previewDescriptionFallback')}</div>
                  <div class="text-xs text-gray-500 dark:text-gray-300 mt-2">example.com</div>
                </div>
{/if}
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{t('twitterCardGenerator.generatedHtml')}</label>
            <div class="relative">
              <textarea
                readOnly
                value={generateMetaTags()}
                rows={8}
                class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-700 dark:text-gray-300 font-mono text-sm"></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  
