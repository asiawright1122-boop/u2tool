<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['bandwidth-calculator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.bandwidth-calculator.${key}`;
  }
  function common(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  let fileSize = $state('100');

  let fileSizeUnit = $state('MB');

  let transferTime = $state('10');

  let timeUnit = $state('seconds');

  let copied = $state(false);

  const FILE_SIZE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB'] as const;
  const TIME_UNITS = ['seconds', 'minutes', 'hours'] as const;
  const BANDWIDTH_UNITS = ['bps', 'Kbps', 'Mbps', 'Gbps'] as const;

  let results = $derived.by(() => {
    const size = parseFloat(fileSize) || 0;
    const time = parseFloat(transferTime) || 0;

    if (size <= 0 || time <= 0) {
      return null;
    }

    // Convert file size to bytes
    const sizeMultipliers: Record<string, number> = {
      'B': 1,
      'KB': 1024,
      'MB': 1024 * 1024,
      'GB': 1024 * 1024 * 1024,
      'TB': 1024 * 1024 * 1024 * 1024,
    };
    const sizeInBytes = size * sizeMultipliers[fileSizeUnit];
    const sizeInBits = sizeInBytes * 8;

    // Convert time to seconds
    const timeMultipliers: Record<string, number> = {
      'seconds': 1,
      'minutes': 60,
      'hours': 3600,
    };
    const timeInSeconds = time * timeMultipliers[timeUnit];

    // Calculate bandwidth in bits per second
    const bps = sizeInBits / timeInSeconds;

    return {
      bps: bps,
      Kbps: bps / 1000,
      Mbps: bps / 1000000,
      Gbps: bps / 1000000000,
      Bps: bps / 8,
      KBps: bps / 8 / 1024,
      MBps: bps / 8 / 1024 / 1024,
    };
  });

  // Functions
  function formatNumber(num: number) {
    if (num >= 1000000) {
      return num.toExponential(2);
    }
    if (num < 0.01) {
      return num.toExponential(2);
    }
    return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
  }
  async function handleCopy() {
    if (!results) return;
    const text = `Bandwidth: ${formatNumber(results.Mbps)} Mbps (${formatNumber(results.MBps)} MB/s)`;
    await navigator.clipboard.writeText(text);
    copied = true;
    setTimeout(() => copied = false, 2000);
  }

</script>


    <div class="space-y-6">
      <!-- Input Section -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- File Size -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('fileSize')}
          </label>
          <div class="flex gap-2">
            <input
              type="number"
              bind:value={fileSize}
              min="0"
              step="any"
              class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            <select
              bind:value={fileSizeUnit}
              class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              {#each FILE_SIZE_UNITS as unit (unit)}
<option  value={unit}>{unit}</option>
{/each}
            </select>
          </div>
        </div>

        <!-- Transfer Time -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('transferTime')}
          </label>
          <div class="flex gap-2">
            <input
              type="number"
              bind:value={transferTime}
              min="0"
              step="any"
              class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            <select
              bind:value={timeUnit}
              class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              {#each TIME_UNITS as unit (unit)}
<option  value={unit}>{t(`timeUnits.${unit}`)}</option>
{/each}
            </select>
          </div>
        </div>
      </div>

      <!-- Results -->
      {#if results}
<div class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              {t('requiredBandwidth')}
            </h3>
            <button
              onclick={handleCopy}
              class="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              {copied ? common('copied') : common('copy')}
            </button>
          </div>

          <!-- Bits per second -->
          <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
              {t('bitsPerSecond')}
            </h4>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              {#each BANDWIDTH_UNITS as unit (unit)}
<div  class="text-center">
                  <div class="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatNumber(results[unit as keyof typeof results])}
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">{unit}</div>
                </div>
{/each}
            </div>
          </div>

          <!-- Bytes per second -->
          <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
              {t('bytesPerSecond')}
            </h4>
            <div class="grid grid-cols-3 gap-4">
              <div class="text-center">
                <div class="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatNumber(results.Bps)}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">B/s</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatNumber(results.KBps)}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">KB/s</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatNumber(results.MBps)}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">MB/s</div>
              </div>
            </div>
          </div>
        </div>
{/if}

      <!-- Common Bandwidth Reference -->
      <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h4 class="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
          {t('commonBandwidths')}
        </h4>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-blue-700 dark:text-blue-400">
          <div>3G: ~1-5 Mbps</div>
          <div>4G LTE: ~10-50 Mbps</div>
          <div>5G: ~100-1000 Mbps</div>
          <div>WiFi 5: ~100-400 Mbps</div>
          <div>WiFi 6: ~500-1000 Mbps</div>
          <div>Ethernet: 100-1000 Mbps</div>
          <div>Fiber: 100-10000 Mbps</div>
          <div>USB 3.0: ~5 Gbps</div>
        </div>
      </div>
    </div>
  
