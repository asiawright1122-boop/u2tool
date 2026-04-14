<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['sitemap-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.sitemap-generator.${key}`;
  }

  // Types
  interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: string;
}

  let baseUrl = $state('https://example.com');

  let urls = $state([
    { loc: '/', lastmod: new Date().toISOString().split('T')[0], changefreq: 'weekly', priority: '1.0' },
    { loc: '/about', lastmod: new Date().toISOString().split('T')[0], changefreq: 'monthly', priority: '0.8' },
    { loc: '/contact', lastmod: new Date().toISOString().split('T')[0], changefreq: 'monthly', priority: '0.5' },
  ] as SitemapUrl[]);

  let output = $state('');

  // Functions
  function addUrl() {
    urls = [...urls, {
      loc: '/new-page',
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'monthly',
      priority: '0.5'
    }];
  }
  function removeUrl(index: number) {
    urls = urls.filter((_, i) => i !== index);
  }
  function updateUrl(index: number, field: keyof SitemapUrl, value: string) {
    const newUrls = [...urls];
    newUrls[index] = { ...newUrls[index], [field]: value };
    urls = newUrls;
  }
  function generate() {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${baseUrl}${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
    output = xml;
  }
  function copyToClipboard() {
    navigator.clipboard.writeText(output);
  }
  function downloadFile() {
    const blob = new Blob([output], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    a.click();
    URL.revokeObjectURL(url);
  }

</script>


    <div class="space-y-6">
      <div>
        <label class="tool-label">{t('baseUrl')}</label>
        <input type="text" bind:value={baseUrl}
          class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
          placeholder="https://example.com" />
      </div>

      <div>
        <div class="flex justify-between items-center mb-2">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">{t('urls')}</label>
          <button onclick={addUrl} class="px-3 py-1 bg-emerald-500 hover:bg-green-700 rounded text-sm text-white">
            {t('addUrl')}
          </button>
        </div>
        
        <div class="space-y-2 max-h-64 overflow-y-auto">
          {#each urls as url, index (index)}
<div  class="grid grid-cols-12 gap-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-2">
              <input type="text" bind:value={url.loc}
                class="col-span-4 px-2 py-1 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded text-gray-900 dark:text-white text-sm"
                placeholder="/path" />
              <input type="date" bind:value={url.lastmod}
                class="col-span-2 px-2 py-1 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded text-gray-900 dark:text-white text-sm" />
              <select bind:value={url.changefreq}
                class="col-span-2 px-2 py-1 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded text-gray-900 dark:text-white text-sm">
                <option value="always">always</option>
                <option value="hourly">hourly</option>
                <option value="daily">daily</option>
                <option value="weekly">weekly</option>
                <option value="monthly">monthly</option>
                <option value="yearly">yearly</option>
                <option value="never">never</option>
              </select>
              <select bind:value={url.priority}
                class="col-span-2 px-2 py-1 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded text-gray-900 dark:text-white text-sm">
                {#each ['1.0', '0.9', '0.8', '0.7', '0.6', '0.5', '0.4', '0.3', '0.2', '0.1'] as p (p)}
<option  value={p}>{p}</option>
{/each}
              </select>
              <button onclick={() => removeUrl(index)}
                class="col-span-2 px-2 py-1 bg-rose-500 hover:bg-red-700 rounded text-sm text-white">{t('remove')}</button>
            </div>
{/each}
        </div>
      </div>

      <div class="flex gap-4">
        <button onclick={generate} class="px-6 py-2 bg-amber-600 hover:bg-amber-700 rounded-lg font-medium transition-colors text-white">
          {t('generate')}
        </button>
        <button onclick={copyToClipboard} disabled={!output}
          class="px-6 py-2 bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50 rounded-lg font-medium transition-colors">
          {t('copy')}
        </button>
        <button onclick={downloadFile} disabled={!output}
          class="px-6 py-2 bg-emerald-500 hover:bg-green-700 disabled:opacity-50 rounded-lg font-medium transition-colors text-white">
          {t('download')}
        </button>
      </div>

      {#if output}
<div>
          <label class="tool-label">{t('output')}</label>
          <pre class="bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 font-mono text-sm text-green-600 dark:text-green-400 overflow-x-auto max-h-64">
            {output}
          </pre>
        </div>
{/if}
    </div>
  
