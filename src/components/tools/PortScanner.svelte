<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['port-scanner'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.port-scanner.${key}`;
  }

  // Types
  interface PortInfo {
  port: number;
  service: string;
  descKey: string;
}

  let searchTerm = $state('');

  let customPort = $state('');

  // Functions
  const filteredPorts = commonPorts.filter(p => 
    p.port.toString().includes(searchTerm) ||
    p.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t(p.descKey).toLowerCase().includes(searchTerm.toLowerCase())
  );
  function getPortInfo(port: number): PortInfo | null {
    return commonPorts.find(p => p.port === port) || null;
  }
  const customPortInfo = customPort ? getPortInfo(parseInt(customPort)) : null;

</script>


    <div class="space-y-6">
      <div class="p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg">
        <p class="text-sm text-blue-700 dark:text-blue-300">
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg> {t('note')}
        </p>
      </div>

      <div class="grid md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm text-gray-600 dark:text-gray-300 mb-2">{t('searchPorts')}</label>
          <input
            type="text"
            bind:value={searchTerm}
            placeholder={t('searchPlaceholder')}
            class="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label class="block text-sm text-gray-600 dark:text-gray-300 mb-2">{t('lookupPort')}</label>
          <input
            type="number"
            bind:value={customPort}
            placeholder={t('portPlaceholder')}
            class="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500"
            min="1"
            max="65535"
          />
        </div>
      </div>

      {#if customPort}
<div class="p-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div class="text-lg font-semibold mb-2 text-gray-900 dark:text-white">{t('port')} {customPort}</div>
          {#if customPortInfo}
<div class="space-y-2">
              <div><span class="text-gray-600 dark:text-gray-300">{t('service')}:</span> <span class="text-gray-900 dark:text-white">{customPortInfo.service}</span></div>
              <div><span class="text-gray-600 dark:text-gray-300">{t('descriptionLabel')}:</span> <span class="text-gray-900 dark:text-white">{t(customPortInfo.descKey)}</span></div>
            </div>
{:else}
<div class="text-gray-600 dark:text-gray-300">
             {parseInt(customPort) >= 1 && parseInt(customPort) <= 65535 ? t('unknownPort') : t('invalidPort')}
            </div>
{/if}
        </div>
{/if}

      <div>
        <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">{t('commonPorts')}</h3>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-gray-300 dark:border-gray-700">
                <th class="text-left py-3 px-4 text-gray-900 dark:text-white">{t('port')}</th>
                <th class="text-left py-3 px-4 text-gray-900 dark:text-white">{t('service')}</th>
                <th class="text-left py-3 px-4 text-gray-900 dark:text-white">{t('descriptionLabel')}</th>
              </tr>
            </thead>
            <tbody>
              {#each filteredPorts as port (port.port)}
<tr  class="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td class="py-3 px-4 font-mono text-blue-600 dark:text-blue-400">{port.port}</td>
                  <td class="py-3 px-4 font-semibold text-gray-900 dark:text-white">{port.service}</td>
                  <td class="py-3 px-4 text-gray-600 dark:text-gray-300">{t(port.descKey)}</td>
                </tr>
{/each}
            </tbody>
          </table>
        </div>
        {#if filteredPorts.length === 0}
<div class="text-center py-8 text-gray-600 dark:text-gray-300">
            {t('noResults')}
          </div>
{/if}
      </div>

      <div class="p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg">
        <h4 class="font-semibold mb-2 text-gray-900 dark:text-white">{t('portRanges')}</h4>
        <div class="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <span class="text-blue-600 dark:text-blue-400">0-1023:</span>
            <span class="text-gray-600 dark:text-gray-300 ml-2">{t('wellKnown')}</span>
          </div>
          <div>
            <span class="text-blue-600 dark:text-blue-400">1024-49151:</span>
            <span class="text-gray-600 dark:text-gray-300 ml-2">{t('registered')}</span>
          </div>
          <div>
            <span class="text-blue-600 dark:text-blue-400">49152-65535:</span>
            <span class="text-gray-600 dark:text-gray-300 ml-2">{t('dynamic')}</span>
          </div>
        </div>
      </div>
    </div>
  
