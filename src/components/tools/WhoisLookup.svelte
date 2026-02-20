<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['whois-lookup'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.whois-lookup.${key}`;
  }
  function tg(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  interface WhoisInfo {
  domain: string;
  registrar: string;
  createdDate: string;
  expiryDate: string;
  updatedDate: string;
  status: string[];
  nameServers: string[];
  dnssec: string;
}

  let domain = $state('');

  let loading = $state(false);

  let result = $state(null);

  let error = $state('');

  // Functions
  async function lookup() {
    if (!domain.trim()) return;
    
    loading = true;
    error = '';
    result = null;

    try {
      const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '').toLowerCase();
      
      // 模拟 WHOIS 查询结果
      const now = new Date();
      const created = new Date(now.getTime() - 5 * 365 * 24 * 60 * 60 * 1000);
      const expiry = new Date(now.getTime() + 2 * 365 * 24 * 60 * 60 * 1000);
      const updated = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      result = {
        domain: cleanDomain,
        registrar: 'Example Registrar, Inc.',
        createdDate: created.toISOString().split('T')[0],
        expiryDate: expiry.toISOString().split('T')[0],
        updatedDate: updated.toISOString().split('T')[0],
        status: ['clientTransferProhibited', 'clientUpdateProhibited'],
        nameServers: ['ns1.example.com', 'ns2.example.com'],
        dnssec: 'unsigned',
      };
    } catch (_err) {
      error = tg('errorProcessing');
    } finally {
      loading = false;
    }
  }

</script>


    <div class="space-y-6">
      <div class="flex gap-2">
        <input
          type="text"
          bind:value={domain}
          placeholder="example.com"
          class="flex-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500"
          onkeydown={(e) => e.key === 'Enter' && lookup()}
        />
        <button
          onclick={lookup}
          disabled={loading || !domain.trim()}
          class="btn-primary px-6 py-3 rounded-lg disabled:opacity-50"
        >
          {loading ? t('loading') : t('lookup')}
        </button>
      </div>

      {#if error}
<div class="p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-400">
          {error}
        </div>
{/if}

      {#if result}
<div class="space-y-4">
          <div class="p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg">
            <div class="text-lg font-semibold text-gray-900 dark:text-white">{result.domain}</div>
          </div>

          <div class="grid md:grid-cols-2 gap-4">
            <div class="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div class="text-sm text-gray-600 dark:text-gray-300 mb-1">{t('registrar')}</div>
              <div class="font-mono text-gray-900 dark:text-white">{result.registrar}</div>
            </div>
            <div class="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div class="text-sm text-gray-600 dark:text-gray-300 mb-1">{t('dnssec')}</div>
              <div class="font-mono text-gray-900 dark:text-white">{result.dnssec}</div>
            </div>
            <div class="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div class="text-sm text-gray-600 dark:text-gray-300 mb-1">{t('createdDate')}</div>
              <div class="font-mono text-gray-900 dark:text-white">{result.createdDate}</div>
            </div>
            <div class="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div class="text-sm text-gray-600 dark:text-gray-300 mb-1">{t('expiryDate')}</div>
              <div class="font-mono text-gray-900 dark:text-white">{result.expiryDate}</div>
            </div>
            <div class="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div class="text-sm text-gray-600 dark:text-gray-300 mb-1">{t('updatedDate')}</div>
              <div class="font-mono text-gray-900 dark:text-white">{result.updatedDate}</div>
            </div>
          </div>

          <div class="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div class="text-sm text-gray-600 dark:text-gray-300 mb-2">{t('nameServers')}</div>
            <div class="space-y-1">
              {#each result.nameServers as ns, i (i)}
<div  class="font-mono text-sm text-gray-900 dark:text-white">{ns}</div>
{/each}
            </div>
          </div>

          <div class="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div class="text-sm text-gray-600 dark:text-gray-300 mb-2">{t('domainStatus')}</div>
            <div class="flex flex-wrap gap-2">
              {#each result.status as status, i (i)}
<span  class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm font-mono text-gray-700 dark:text-white">
                  {status}
                </span>
{/each}
            </div>
          </div>
        </div>
{/if}

      <div class="p-4 bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-300">
        <p>{t('note')}</p>
      </div>
    </div>
  
