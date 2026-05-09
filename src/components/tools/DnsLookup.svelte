<script lang="ts">
  import { isIpAddress } from '@/lib/tool-stubs';

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

  // Types
  interface DnsResult {
  type: string;
  value: string;
  ttl?: number;
}

  let domain = $state('');

  let results = $state<DnsResult[]>([]);

  let loading = $state(false);

  let error = $state('');

  // Functions
  const recordTypes = ['A', 'AAAA', 'CNAME', 'MX', 'NS', 'TXT'] as const;
  async function lookupDns() {
    if (!domain.trim()) return;
    if (isIpAddress(domain.trim())) {
      error = t('dnsLookup.ipError');
      return;
    }
    loading = true;
    error = '';
    results = [];

    try {
      const responses = await Promise.all(
        recordTypes.map(async (type) => {
          try {
            const res = await fetch(
              `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=${type}`,
              { headers: { 'Accept': 'application/dns-json' } }
            );
            const data = await res.json();
            return data.Answer?.map((a: { type: number; data: string; TTL: number }) => ({
              type,
              value: a.data,
              ttl: a.TTL
            })) || [];
          } catch {
            return [];
          }
        })
      );
      results = responses.flat();
    } catch {
      error = t('dnsLookup.error');
    }
    loading = false;
  }

</script>

<div class="space-y-6">
  <form
    class="flex flex-col gap-3 sm:flex-row"
    onsubmit={(event) => {
      event.preventDefault();
      lookupDns();
    }}
  >
    <input
      type="text"
      bind:value={domain}
      placeholder="example.com"
      class="flex-1 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100"
    />
    <button
      type="submit"
      disabled={loading || !domain.trim()}
      class="px-5 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium"
    >
      {loading ? t('loading') : t('dnsLookup.lookup')}
    </button>
  </form>

  {#if error}
    <div class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-300">
      {error}
    </div>
  {/if}

  {#if results.length > 0}
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {#each recordTypes as type (type)}
        {@const typeResults = results.filter((record) => record.type === type)}
        {#if typeResults.length > 0}
          <div class="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-4">
            <div class="text-sm font-medium text-amber-600 dark:text-amber-400 mb-2">
              {type} Records
            </div>
            {#each typeResults as record, i (i)}
              <div class="flex justify-between gap-3 items-center py-1 border-b border-gray-300 dark:border-gray-700 last:border-0">
                <code class="text-sm font-mono text-gray-700 dark:text-gray-300 break-all">{record.value}</code>
                {#if record.ttl}
                  <span class="text-xs text-gray-500 dark:text-gray-300 shrink-0">TTL {record.ttl}</span>
                {/if}
              </div>
            {/each}
          </div>
        {/if}
      {/each}
    </div>
  {:else if domain.trim() && !loading && !error}
    <div class="p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-300">
      {t('dnsLookup.noRecords')}
    </div>
  {/if}
</div>
