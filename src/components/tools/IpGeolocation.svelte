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
  interface GeoData {
  ip: string;
  country: string;
  countryCode: string;
  region: string;
  regionName: string;
  city: string;
  zip: string;
  lat: number;
  lon: number;
  timezone: string;
  isp: string;
  org: string;
  as: string;
}

  let ip = $state('');

  let geoData = $state(null);

  let loading = $state(false);

  let error = $state('');

  async function lookupIp(targetIp?: string) {
    loading = true;
    error = '';
    geoData = null;

    // 尝试多个 API，如果一个失败就尝试下一个
    const apis = [
      // 主 API: ipapi.co (支持 HTTPS，每天 1000 次)
      {
        url: targetIp 
          ? `https://ipapi.co/${encodeURIComponent(targetIp)}/json/`
          : `https://ipapi.co/json/`,
        parse: (data: any) => {
          if (data.error) throw new Error(data.reason || 'Invalid IP');
          return {
            ip: data.ip,
            country: data.country_name,
            countryCode: data.country_code,
            region: data.region_code || '',
            regionName: data.region || '',
            city: data.city || '',
            zip: data.postal || '',
            lat: data.latitude,
            lon: data.longitude,
            timezone: data.timezone || '',
            isp: data.org || '',
            org: data.org || '',
            as: data.asn ? `${data.asn} ${data.org || ''}` : '',
          };
        }
      },
      // 备用 API: ipwho.is (支持 HTTPS，无限制)
      {
        url: targetIp 
          ? `https://ipwho.is/${encodeURIComponent(targetIp)}`
          : `https://ipwho.is/`,
        parse: (data: any) => {
          if (!data.success) throw new Error(data.message || 'Invalid IP');
          return {
            ip: data.ip,
            country: data.country,
            countryCode: data.country_code,
            region: data.region_code || '',
            regionName: data.region || '',
            city: data.city || '',
            zip: data.postal || '',
            lat: data.latitude,
            lon: data.longitude,
            timezone: data.timezone?.id || '',
            isp: data.connection?.isp || '',
            org: data.connection?.org || '',
            as: data.connection?.asn ? `AS${data.connection.asn} ${data.connection.org || ''}` : '',
          };
        }
      },
    ];

    try {
      for (const api of apis) {
        try {
          const response = await fetch(api.url, {
            headers: {
              'Accept': 'application/json',
            },
          });
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }
          
          const data = await response.json();
          const result = api.parse(data);
          geoData = result;
          return; // 成功，退出循环
        } catch (err) {
          console.warn('API failed:', api.url, err);
          continue; // 尝试下一个 API
        }
      }
      
      // 所有 API 都失败了
      error = t('ip-geolocation.lookupError');
    } finally {
      loading = false;
    }
  }

  // Functions
  function handleSubmit(e: Event) {
    e.preventDefault();
    lookupIp(ip.trim() || undefined);
  }
  function handleMyIp() {
    ip = '';
    lookupIp();
  }

</script>


    <div class="space-y-6">
      <!-- 输入区域 -->
      <form onsubmit={handleSubmit} class="space-y-4">
        <div>
          <label class="tool-label">
            {t('ip-geolocation.ipAddress')}
          </label>
          <div class="flex gap-2">
            <input
              type="text"
              bind:value={ip}
              placeholder={t('ip-geolocation.placeholder')}
              class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={loading}
              class="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? t('ip-geolocation.loading') : t('ip-geolocation.lookup')}
            </button>
          </div>
        </div>
        
        <button
          type="button"
          onclick={handleMyIp}
          disabled={loading}
          class="px-4 py-2 btn-success rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {t('ip-geolocation.myIp')}
        </button>
      </form>

      <!-- 错误提示 -->
      {#if error}
<div class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
          {error}
        </div>
{/if}

      <!-- 结果显示 -->
      {#if geoData}
<div class="space-y-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {t('ip-geolocation.results')}
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard label={t('ip-geolocation.ipAddress')} value={geoData.ip} />
            <InfoCard label={t('ip-geolocation.country')} value={`${geoData.country} (${geoData.countryCode})`} />
            <InfoCard label={t('ip-geolocation.region')} value={geoData.regionName || geoData.region} />
            <InfoCard label={t('ip-geolocation.city')} value={geoData.city} />
            <InfoCard label={t('ip-geolocation.zipCode')} value={geoData.zip || '-'} />
            <InfoCard label={t('ip-geolocation.timezone')} value={geoData.timezone} />
            <InfoCard label={t('ip-geolocation.coordinates')} value={`${geoData.lat}, ${geoData.lon}`} />
            <InfoCard label={t('ip-geolocation.isp')} value={geoData.isp} />
            <InfoCard label={t('ip-geolocation.organization')} value={geoData.org || '-'} />
            <InfoCard label={t('ip-geolocation.asn')} value={geoData.as || '-'} />
          </div>

          <!-- 地图链接 -->
          <div class="pt-4">
            <a
              href={`https://www.google.com/maps?q=${geoData.lat},${geoData.lon}`}
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"/><path d="M15 5.764v15"/><path d="M9 3.236v15"/></svg> {t('ip-geolocation.viewOnMap')}
            </a>
          </div>
        </div>
{/if}
    </div>
  
