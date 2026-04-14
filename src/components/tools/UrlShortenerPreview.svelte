<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['url-shortener-preview'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.url-shortener-preview.${key}`;
  }

  // Types
  interface ExpandedUrl {
  shortUrl: string;
  expandedUrl: string;
  status: 'pending' | 'success' | 'error';
  error?: string;
}

  let input = $state('');

  let results = $state([]);

  let loading = $state(false);

  // Functions
  const shortenerDomains = [
    'bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'is.gd', 'buff.ly',
    'adf.ly', 'bit.do', 'mcaf.ee', 'su.pr', 'tiny.cc', 'tr.im', 'cli.gs',
    'short.to', 'budurl.com', 'ping.fm', 'post.ly', 'just.as', 'bkite.com',
    'snipr.com', 'fic.kr', 'loopt.us', 'doiop.com', 'short.ie', 'kl.am',
    'wp.me', 'rubyurl.com', 'om.ly', 'to.ly', 'bit.do', 'lnkd.in', 'db.tt',
    'qr.ae', 'adf.ly', 'bitly.com', 'cur.lv', 'ity.im', 'q.gs', 'po.st',
    'bc.vc', 'twitthis.com', 'u.teleportme.com', 'v.gd', 'vzturl.com'
  ];
  function isShortUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return shortenerDomains.some(domain => urlObj.hostname.includes(domain));
    } catch {
      return false;
    }
  }
  function extractUrls(text: string) {
    const urlRegex = /https?:\/\/[^\s<>"{}|\\^`[\]]+/g;
    return text.match(urlRegex) || [];
  }
  function analyzeUrls() {
    const urls = extractUrls(input);
    const shortUrls = urls.filter(isShortUrl);
    
    if (shortUrls.length === 0) {
      results = [{
        shortUrl: t('noShortUrls'),
        expandedUrl: '',
        status: 'error',
        error: t('noShortUrlsError')
      }];
      return;
    }

    loading = true;
    const newResults: ExpandedUrl[] = shortUrls.map(url => ({
      shortUrl: url,
      expandedUrl: t('unableToExpand'),
      status: 'success' as const
    }));
    results = newResults;
    loading = false;
  }
  function copyResults() {
    const text = results.map(r => `${r.shortUrl} → ${r.expandedUrl}`).join('\n');
    navigator.clipboard.writeText(text);
  }

</script>


    <div class="space-y-6">
      <div class="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-600 rounded-lg p-4">
        <p class="text-yellow-700 dark:text-yellow-400 text-sm">
          {t('note')}
        </p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{t('input')}</label>
        <textarea bind:value={input}
          class="w-full h-40 px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
          placeholder={t('placeholder')}></textarea>
      </div>

      <div class="flex gap-4">
        <button onclick={analyzeUrls} disabled={loading || !input}
          class="px-6 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 rounded-lg font-medium transition-colors text-white">
          {loading ? t('analyzing') : t('analyzeUrls')}
        </button>
        <button onclick={copyResults} disabled={results.length === 0}
          class="px-6 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50 rounded-lg font-medium transition-colors text-gray-700 dark:text-white">
          {t('copy')}
        </button>
      </div>

      {#if results.length > 0}
<div>
          <label class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{t('results')}</label>
          <div class="space-y-2">
            {#each results as result, index (index)}
<div  class={`p-4 rounded-lg ${result.status === 'error' ? 'bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700' : 'bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600'}`}>
                <div class="font-mono text-sm text-amber-600 dark:text-amber-400 break-all">{result.shortUrl}</div>
                {#if result.expandedUrl}
<div class="font-mono text-sm text-green-600 dark:text-green-400 break-all mt-1">→ {result.expandedUrl}</div>
{/if}
                {#if result.error}
<div class="text-sm text-red-600 dark:text-red-400 mt-1">{result.error}</div>
{/if}
              </div>
{/each}
          </div>
        </div>
{/if}

      <div>
        <label class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{t('supportedServices')}</label>
        <div class="flex flex-wrap gap-2">
          {#each shortenerDomains.slice(0, 20) as domain (domain)}
<span  class="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-300">{domain}</span>
{/each}
          <span class="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-300">{t('moreServices', { count: shortenerDomains.length - 20 })}</span>
        </div>
      </div>
    </div>
  
