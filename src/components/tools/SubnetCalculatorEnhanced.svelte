<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['subnet-calculator-enhanced'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.subnet-calculator-enhanced.${key}`;
  }
  function tCommon(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  interface SubnetInfo {
  networkAddress: string;
  broadcastAddress: string;
  firstHost: string;
  lastHost: string;
  totalHosts: number;
  usableHosts: number;
  subnetMask: string;
  wildcardMask: string;
  cidr: number;
  ipClass: string;
  isPrivate: boolean;
}

  let ipAddress = $state('192.168.1.0');

  let cidr = $state(24);

  let result = $state(null);

  let error = $state('');

  function calculate() {
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(ipAddress)) { error = t('invalidIp'); result = null; return; }
    const parts = ipAddress.split('.').map(Number);
    if (parts.some(p => p > 255)) { error = t('invalidIp'); result = null; return; }
    if (cidr < 0 || cidr > 32) { error = t('invalidCidr'); result = null; return; }
    error = '';

    const subnetMaskNum = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
    const wildcardMaskNum = ~subnetMaskNum >>> 0;
    const ipNum = ipToNumber(ipAddress);
    const networkNum = (ipNum & subnetMaskNum) >>> 0;
    const broadcastNum = (networkNum | wildcardMaskNum) >>> 0;
    const totalHosts = Math.pow(2, 32 - cidr);
    const usableHosts = cidr >= 31 ? (cidr === 32 ? 1 : 2) : totalHosts - 2;

    result = {
      networkAddress: numberToIp(networkNum),
      broadcastAddress: numberToIp(broadcastNum),
      firstHost: cidr >= 31 ? numberToIp(networkNum) : numberToIp(networkNum + 1),
      lastHost: cidr >= 31 ? numberToIp(broadcastNum) : numberToIp(broadcastNum - 1),
      totalHosts, usableHosts,
      subnetMask: numberToIp(subnetMaskNum),
      wildcardMask: numberToIp(wildcardMaskNum),
      cidr, ipClass: getIpClass(ipAddress), isPrivate: isPrivateIp(ipAddress)
    };
  }

  // Functions
  function ipToNumber(ip: string): number {
    const parts = ip.split('.').map(Number);
    return (parts[0] << 24) + (parts[1] << 16) + (parts[2] << 8) + parts[3];
  }
  function numberToIp(num: number): string {
    return [(num >>> 24) & 255, (num >>> 16) & 255, (num >>> 8) & 255, num & 255].join('.');
  }
  function getIpClass(ip: string): string {
    const firstOctet = parseInt(ip.split('.')[0]);
    if (firstOctet < 128) return 'A';
    if (firstOctet < 192) return 'B';
    if (firstOctet < 224) return 'C';
    if (firstOctet < 240) return 'D';
    return 'E';
  }
  function isPrivateIp(ip: string): boolean {
    const parts = ip.split('.').map(Number);
    return (parts[0] === 10) || (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) || (parts[0] === 192 && parts[1] === 168);
  }
  const commonSubnets = [
    { cidr: 8, name: '/8 (Class A)' }, { cidr: 16, name: '/16 (Class B)' }, { cidr: 24, name: '/24 (Class C)' },
    { cidr: 25, name: '/25 (128 hosts)' }, { cidr: 26, name: '/26 (64 hosts)' }, { cidr: 27, name: '/27 (32 hosts)' },
    { cidr: 28, name: '/28 (16 hosts)' }, { cidr: 29, name: '/29 (8 hosts)' }, { cidr: 30, name: '/30 (4 hosts)' }
  ];

</script>


    <div class="space-y-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border dark:border-gray-700">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="tool-label">{t('ipAddress')}</label>
            <input type="text" bind:value={ipAddress}
              class="w-full p-3 border rounded-lg font-mono dark:bg-gray-700 dark:border-gray-600"
              placeholder="192.168.1.0" />
          </div>
          <div>
            <label class="tool-label">CIDR: /{cidr}</label>
            <input type="range" min="0" max="32" bind:value={cidr} class="w-full" />
          </div>
        </div>
        <div class="mt-4 flex flex-wrap gap-2">
          {#each commonSubnets as s (s.cidr)}
<button  onclick={() => cidr = s.cidr}
              class={`px-3 py-1 text-sm rounded-lg ${cidr === s.cidr ? 'bg-amber-600 text-white' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
              {s.name}
            </button>
{/each}
        </div>
        {#if error}
<p class="mt-2 text-sm text-red-500">{error}</p>
{/if}
        <button onclick={calculate} class="mt-4 w-full py-2 px-4 bg-amber-600 text-white rounded-lg hover:bg-amber-700">{tCommon('convert')}</button>
      </div>

      {#if result}
<div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('results')}</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            {#each [
              { label: t('networkAddress'), value: result.networkAddress },
              { label: t('broadcastAddress'), value: result.broadcastAddress },
              { label: t('firstHost'), value: result.firstHost },
              { label: t('lastHost'), value: result.lastHost },
              { label: t('subnetMask'), value: result.subnetMask },
              { label: t('wildcardMask'), value: result.wildcardMask },
              { label: t('totalHosts'), value: result.totalHosts.toLocaleString() },
              { label: t('usableHosts'), value: result.usableHosts.toLocaleString() },
            ] as item, i (i)}
<div  class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div class="text-sm text-gray-500 dark:text-gray-400">{item.label}</div>
                <div class="font-mono text-lg text-gray-900 dark:text-white">{item.value}</div>
              </div>
{/each}
          </div>
          <div class="mt-4 flex gap-4">
            <span class={`px-3 py-1 rounded-full text-sm ${result.isPrivate ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}>
              {result.isPrivate ? t('privateIp') : t('publicIp')}
            </span>
            <span class="px-3 py-1 rounded-full text-sm bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
              {t('class')} {result.ipClass}
            </span>
          </div>
        </div>
{/if}
    </div>
  
