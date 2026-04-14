<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['ipLookup'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.ipLookup.${key}`;
  }

  // Types
  interface IpInfo {
  ip: string;
  country?: string;
  region?: string;
  city?: string;
  isp?: string;
  timezone?: string;
  lat?: number;
  lon?: number;
}

  let ip = $state('');

  let info = $state(null);

  let loading = $state(false);

  let error = $state('');

  // Functions
  async function lookupIp(targetIp?: string) {
    loading = true;
    error = '';
    try {
      const url = targetIp 
        ? `http://ip-api.com/json/${targetIp}`
        : 'http://ip-api.com/json/';
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.status === 'success') {
        info = {
          ip: data.query,
          country: data.country,
          region: data.regionName,
          city: data.city,
          isp: data.isp,
          timezone: data.timezone,
          lat: data.lat,
          lon: data.lon,
        };
      } else {
        error = data.message || t('error');
      }
    } catch {
      error = t('error');
    }
    loading = false;
  }
  function getMyIp() {
    lookupIp();
  }
  function lookupCustomIp() {
    if (!ip.trim()) return;
    lookupIp(ip.trim());
  }

</script>


    <div class="space-y-4">
      <div class="flex gap-2">
        <input
          type="text"
          bind:value={ip}
          placeholder={t('placeholder')}
          class="flex-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
        />
        <button
          onclick={lookupCustomIp}
          disabled={loading || !ip.trim()}
          class="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white disabled:bg-gray-400 dark:disabled:bg-gray-600 rounded-lg transition-colors"
        >
          {t('lookup')}
        </button>
        <button
          onclick={getMyIp}
          disabled={loading}
          class="px-4 py-2 bg-emerald-500 hover:bg-green-700 text-white disabled:bg-gray-400 dark:disabled:bg-gray-600 rounded-lg transition-colors"
        >
          {t('myIp')}
        </button>
      </div>

      {#if error}
<div class="p-4 bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-500 rounded-lg text-red-700 dark:text-red-300">
          {error}
        </div>
{/if}

      {#if loading}
<div class="text-center text-gray-500 dark:text-gray-300 py-8">
          {t('loading')}
        </div>
{/if}

      {#if info}
{#if !loading}
        <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 space-y-3">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <span class="text-gray-500 dark:text-gray-300">{t('ipAddress')}:</span>
              <span class="ml-2 text-gray-900 dark:text-white font-mono">{info.ip}</span>
            </div>
            <div>
              <span class="text-gray-500 dark:text-gray-300">{t('country')}:</span>
              <span class="ml-2 text-gray-900 dark:text-white">{info.country || '-'}</span>
            </div>
            <div>
              <span class="text-gray-500 dark:text-gray-300">{t('region')}:</span>
              <span class="ml-2 text-gray-900 dark:text-white">{info.region || '-'}</span>
            </div>
            <div>
              <span class="text-gray-500 dark:text-gray-300">{t('city')}:</span>
              <span class="ml-2 text-gray-900 dark:text-white">{info.city || '-'}</span>
            </div>
            <div>
              <span class="text-gray-500 dark:text-gray-300">{t('isp')}:</span>
              <span class="ml-2 text-gray-900 dark:text-white">{info.isp || '-'}</span>
            </div>
            <div>
              <span class="text-gray-500 dark:text-gray-300">{t('timezone')}:</span>
              <span class="ml-2 text-gray-900 dark:text-white">{info.timezone || '-'}</span>
            </div>
            {#if info.lat}
{#if info.lon}
              <div class="col-span-2">
                <span class="text-gray-500 dark:text-gray-300">{t('coordinates')}:</span>
                <span class="ml-2 text-gray-900 dark:text-white font-mono">
                  {info.lat.toFixed(4)}, {info.lon.toFixed(4)}
                </span>
              </div>
            {/if}
{/if}
          </div>
        </div>
      {/if}
{/if}
    </div>
  
