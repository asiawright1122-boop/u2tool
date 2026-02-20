<script lang="ts">
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

  let results = $state([]);

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


              <div class="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-4">
                <div class="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">
                  {t('dnsLookup.records', { type })}
                </div>
                {#each typeResults as r, i (i)}
<div  class="flex justify-between items-center py-1 border-b border-gray-300 dark:border-gray-700 last:border-0">
                    <code class="text-sm font-mono text-gray-700 dark:text-gray-300">{r.value}</code>
                    {#if r.ttl}
<span class="text-xs text-gray-500 dark:text-gray-300">{t('dnsLookup.ttl', { ttl: r.ttl })}</span>
{/if}
                  </div>
{/each}
              </div>
            
