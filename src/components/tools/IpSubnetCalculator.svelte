<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['ip-subnet-calculator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.ip-subnet-calculator.${key}`;
  }
  function tc(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Imports
  import { calculateSubnet, validateIpAddress, validateSubnetMask, type SubnetResult } from '@/lib/calculator-utils';

  let ipAddress = $state('192.168.1.100');

  let subnetMask = $state('24');

  let maskType = $state('cidr');

  let result = $state(null);

  let error = $state('');

  // Functions
  const commonCidrs = [8, 16, 24, 25, 26, 27, 28, 29, 30];
  function calculate() {
    error = '';

    if (!validateIpAddress(ipAddress)) {
      error = t('invalidIp');
      return;
    }

    const mask = maskType === 'cidr' ? parseInt(subnetMask) : subnetMask;
    if (!validateSubnetMask(mask)) {
      error = t('invalidMask');
      return;
    }

    try {
      const res = calculateSubnet({ ipAddress, subnetMask: mask });
      result = res;
    } catch {
      error = t('calculationError');
    }
  }
  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
  }

</script>


    <div class="space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t('ipAddress')}
        </label>
        <input
          type="text"
          bind:value={ipAddress}
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono"
          placeholder="192.168.1.100"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('subnetMask')}
        </label>
        <div class="flex gap-2 mb-2">
          <button
            onclick={() => maskType = 'cidr'}
            class={`px-4 py-2 rounded-lg transition-colors ${
              maskType === 'cidr'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            CIDR
          </button>
          <button
            onclick={() => maskType = 'dotted'}
            class={`px-4 py-2 rounded-lg transition-colors ${
              maskType === 'dotted'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            {t('dottedDecimal')}
          </button>
        </div>

        {#if maskType === 'cidr'}
<div class="flex flex-wrap gap-2 mb-2">
            {#each commonCidrs as cidr (cidr)}
<button 
                onclick={() => subnetMask = cidr.toString()}
                class={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  subnetMask === cidr.toString()
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                /{cidr}
              </button>
{/each}
          </div>
{/if}

        <div class="flex items-center">
          {#if maskType === 'cidr'}
<span class="px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-r-0 border-gray-300 dark:border-gray-600 rounded-l-lg text-gray-500">
              /
            </span>
{/if}
          <input
            type="text"
            bind:value={subnetMask}
            class={`flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono ${
              maskType === 'cidr' ? 'rounded-r-lg' : 'rounded-lg'
            }`}
            placeholder={maskType === 'cidr' ? '24' : '255.255.255.0'}
          />
        </div>
      </div>

      <button
        onclick={calculate}
        class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        {tc('calculate')}
      </button>

      {#if error}
<div class="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
          {error}
        </div>
{/if}

      {#if result}
{#if !error}
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultCard
              label={t('networkAddress')}
              value={result.networkAddress}
              oncopy={() => copyToClipboard(result.networkAddress)}
            />
            <ResultCard
              label={t('broadcastAddress')}
              value={result.broadcastAddress}
              oncopy={() => copyToClipboard(result.broadcastAddress)}
            />
            <ResultCard
              label={t('firstHost')}
              value={result.firstHost}
              oncopy={() => copyToClipboard(result.firstHost)}
            />
            <ResultCard
              label={t('lastHost')}
              value={result.lastHost}
              oncopy={() => copyToClipboard(result.lastHost)}
            />
            <ResultCard
              label={t('subnetMask')}
              value={result.subnetMask}
              oncopy={() => copyToClipboard(result.subnetMask)}
            />
            <ResultCard
              label={t('wildcardMask')}
              value={result.wildcardMask}
              oncopy={() => copyToClipboard(result.wildcardMask)}
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div class="text-sm text-gray-600 dark:text-gray-400">{t('cidr')}</div>
              <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
                /{result.cidr}
              </div>
            </div>
            <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div class="text-sm text-gray-600 dark:text-gray-400">{t('usableHosts')}</div>
              <div class="text-2xl font-bold text-green-600 dark:text-green-400">
                {result.usableHosts.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      {/if}
{/if}
    </div>
  
