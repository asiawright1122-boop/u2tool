<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['ip-address-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.ip-address-generator.${key}`;
  }

  let ipType = $state('ipv4');

  let count = $state(10);

  let generated = $state([]);

  // Functions
  function generateIPv4(): string {
    return Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join('.');
  }
  function generateIPv6(): string {
    return Array.from({ length: 8 }, () =>
      Math.floor(Math.random() * 65536).toString(16).padStart(4, '0')
    ).join(':');
  }
  function generatePrivateIPv4(): string {
    const ranges = [
      () => `10.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
      () => `172.${16 + Math.floor(Math.random() * 16)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
      () => `192.168.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
    ];
    return ranges[Math.floor(Math.random() * ranges.length)]();
  }
  function generatePublicIPv4(): string {
    let ip: string;
    while (true) {
      ip = generateIPv4();
      const parts = ip.split('.').map(Number);
      // Exclude private, loopback, and reserved ranges
      const isPrivate =
        parts[0] === 10 ||
        (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
        (parts[0] === 192 && parts[1] === 168) ||
        parts[0] === 127 ||
        parts[0] === 0 ||
        parts[0] >= 224;
      if (!isPrivate) break;
    }
    return ip;
  }
  function generate() {
    const generators: Record<string, () => string> = {
      ipv4: generateIPv4,
      ipv6: generateIPv6,
      private: generatePrivateIPv4,
      public: generatePublicIPv4,
    };

    const ips = Array.from({ length: count }, () => generators[ipType]());
    generated = ips;
  }
  function copyToClipboard() {
    navigator.clipboard.writeText(generated.join('\n'));
  }

</script>


    <div class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label for="ip-address-generator-field-5" class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{t('ipType')}</label>
          <select value={ipType} onchange={(e) => ipType = e.target.value as typeof ipType}
            class="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white" id="ip-address-generator-field-5">
            <option value="ipv4">{t('ipv4Random')}</option>
            <option value="ipv6">{t('ipv6')}</option>
            <option value="private">{t('privateIpv4')}</option>
            <option value="public">{t('publicIpv4')}</option>
          </select>
        </div>
        <div>
          <label for="ip-address-generator-field-4" class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{t('count')}: {count}</label>
          <input type="range" min="1" max="100" value={count}
            onchange={(e) => count = parseInt(e.target.value)}
            class="w-full mt-2" id="ip-address-generator-field-4" />
        </div>
        <div class="flex items-end gap-2">
          <button onclick={generate}
            class="flex-1 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors">
            {t('generate')}
          </button>
          <button onclick={copyToClipboard} disabled={generated.length === 0}
            class="px-4 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-900 dark:text-white disabled:opacity-50 rounded-lg font-medium transition-colors">
            {t('copy')}
          </button>
        </div>
      </div>

      {#if generated.length > 0}
<div>
          <div class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
            {t('generatedIps')} ({generated.length})
          </div>
          <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 max-h-96 overflow-y-auto">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {#each generated as ip, index (index)}
<div role="button" tabindex="0" onkeydown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); event.currentTarget.click(); } }}  onclick={() => navigator.clipboard.writeText(ip)}
                  class="px-3 py-2 bg-white dark:bg-gray-600 rounded font-mono text-sm text-green-600 dark:text-green-400 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-500">
                  {ip}
                </div>
{/each}
            </div>
          </div>
        </div>
{/if}
    </div>

