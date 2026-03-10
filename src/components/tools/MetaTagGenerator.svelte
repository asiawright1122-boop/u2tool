<script lang="ts">
  import { onDestroy } from 'svelte';

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

  let title = $state('');

  let description = $state('');

  let keywords = $state('');

  let author = $state('');

  let ogImage = $state('');

  let ogUrl = $state('');

  let twitterCard = $state('summary_large_image');

  let twitterSite = $state('');

  let robots = $state('index, follow');

  let viewport = $state('width=device-width, initial-scale=1');

  let copied = $state(false);

  let timerRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function generateMetaTags() {
    const tags: string[] = [];
    tags.push('<meta charset="UTF-8">');
    if (viewport) tags.push(`<meta name="viewport" content="${viewport}">`);
    if (title) tags.push(`<title>${title}</title>`);
    if (description) tags.push(`<meta name="description" content="${description}">`);
    if (keywords) tags.push(`<meta name="keywords" content="${keywords}">`);
    if (author) tags.push(`<meta name="author" content="${author}">`);
    if (robots) tags.push(`<meta name="robots" content="${robots}">`);
    
    // Open Graph
    if (title) tags.push(`<meta property="og:title" content="${title}">`);
    if (description) tags.push(`<meta property="og:description" content="${description}">`);
    if (ogImage) tags.push(`<meta property="og:image" content="${ogImage}">`);
    if (ogUrl) tags.push(`<meta property="og:url" content="${ogUrl}">`);
    tags.push('<meta property="og:type" content="website">');
    
    // Twitter
    tags.push(`<meta name="twitter:card" content="${twitterCard}">`);
    if (title) tags.push(`<meta name="twitter:title" content="${title}">`);
    if (description) tags.push(`<meta name="twitter:description" content="${description}">`);
    if (ogImage) tags.push(`<meta name="twitter:image" content="${ogImage}">`);
    if (twitterSite) tags.push(`<meta name="twitter:site" content="${twitterSite}">`);
    
    return tags.join('\n');
  }
  const output = generateMetaTags();
  async function copyOutput() {
    await navigator.clipboard.writeText(output);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }

</script>


    <div class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="meta-title" class="block text-sm font-medium mb-2">{t('metaTagGenerator.pageTitle')}</label>
          <input
            id="meta-title"
            name="pageTitle"
            type="text"
            bind:value={title}
            class="tool-input"
            placeholder={t('metaTagGenerator.pageTitlePlaceholder')}
          />
        </div>
        <div>
          <label for="meta-author" class="block text-sm font-medium mb-2">{t('metaTagGenerator.author')}</label>
          <input
            id="meta-author"
            name="authorName"
            type="text"
            bind:value={author}
            class="tool-input"
            placeholder={t('metaTagGenerator.authorPlaceholder')}
          />
        </div>
      </div>

      <div>
        <label for="meta-description" class="block text-sm font-medium mb-2">{t('metaTagGenerator.description')}</label>
        <textarea
          id="meta-description"
          name="pageDescription"
          bind:value={description}
          class="tool-input"
          rows={2}
          placeholder={t('metaTagGenerator.descriptionPlaceholder')}></textarea>
        <div class="text-xs text-gray-600 dark:text-gray-300 mt-1">{description.length} {t('metaTagGenerator.characters')}</div>
      </div>

      <div>
        <label for="meta-keywords" class="block text-sm font-medium mb-2">{t('metaTagGenerator.keywords')}</label>
        <input
          id="meta-keywords"
          name="keywords"
          type="text"
          bind:value={keywords}
          class="tool-input"
          placeholder={t('metaTagGenerator.keywordsPlaceholder')}
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="meta-og-image" class="block text-sm font-medium mb-2">{t('metaTagGenerator.ogImageUrl')}</label>
          <input
            id="meta-og-image"
            name="ogImageUrl"
            type="text"
            bind:value={ogImage}
            class="tool-input"
            placeholder={t('metaTagGenerator.ogImageUrlPlaceholder')}
          />
        </div>
        <div>
          <label for="meta-og-url" class="block text-sm font-medium mb-2">{t('metaTagGenerator.pageUrl')}</label>
          <input
            id="meta-og-url"
            name="pageUrl"
            type="text"
            bind:value={ogUrl}
            class="tool-input"
            placeholder={t('metaTagGenerator.pageUrlPlaceholder')}
          />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="meta-twitter-card" class="block text-sm font-medium mb-2">{t('metaTagGenerator.twitterCardType')}</label>
          <select
            id="meta-twitter-card"
            name="twitterCardType"
            bind:value={twitterCard}
            class="tool-input"
          >
            <option value="summary">{t('metaTagGenerator.twitterCardSummary')}</option>
            <option value="summary_large_image">{t('metaTagGenerator.twitterCardSummaryLargeImage')}</option>
            <option value="app">{t('metaTagGenerator.twitterCardApp')}</option>
            <option value="player">{t('metaTagGenerator.twitterCardPlayer')}</option>
          </select>
        </div>
        <div>
          <label for="meta-twitter-site" class="block text-sm font-medium mb-2">{t('metaTagGenerator.twitterUsername')}</label>
          <input
            id="meta-twitter-site"
            name="twitterUsername"
            type="text"
            bind:value={twitterSite}
            class="tool-input"
            placeholder={t('metaTagGenerator.twitterUsernamePlaceholder')}
          />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="meta-robots" class="block text-sm font-medium mb-2">{t('metaTagGenerator.robots')}</label>
          <select
            id="meta-robots"
            name="robotsSetting"
            bind:value={robots}
            class="tool-input"
          >
            <option value="index, follow">{t('metaTagGenerator.robotsIndexFollow')}</option>
            <option value="noindex, follow">{t('metaTagGenerator.robotsNoindexFollow')}</option>
            <option value="index, nofollow">{t('metaTagGenerator.robotsIndexNofollow')}</option>
            <option value="noindex, nofollow">{t('metaTagGenerator.robotsNoindexNofollow')}</option>
          </select>
        </div>
        <div>
          <label for="meta-viewport" class="block text-sm font-medium mb-2">{t('metaTagGenerator.viewport')}</label>
          <input
            id="meta-viewport"
            name="viewportSetting"
            type="text"
            bind:value={viewport}
            class="tool-input"
          />
        </div>
      </div>

      <div>
        <div class="flex justify-between items-center mb-2">
          <label class="text-sm font-medium">{t('metaTagGenerator.generatedMetaTags')}</label>
          <button
            onclick={copyOutput}
            class={`text-sm px-3 py-1 rounded text-white ${copied ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600'}`}
          >
            {copied ? t('copied') : t('copy')}
          </button>
        </div>
        <pre class="tool-textarea font-mono text-sm whitespace-pre-wrap">{output}</pre>
      </div>
    </div>
  
