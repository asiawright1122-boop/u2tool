<script lang="ts">
  import { COMMON_SPEEDS } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['data-transfer-calculator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.data-transfer-calculator.${key}`;
  }
  function common(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  let fileSize = $state('1');

  let fileSizeUnit = $state('GB');

  let speed = $state('100');

  let speedUnit = $state('Mbps');

  let copied = $state(false);

  let results = $derived.by(() => {
    const size = parseFloat(fileSize) || 0;
    const spd = parseFloat(speed) || 0;

    if (size <= 0 || spd <= 0) {
      return null;
    }

    // Convert file size to bits
    const sizeMultipliers: Record<string, number> = {
      'B': 8,
      'KB': 8 * 1024,
      'MB': 8 * 1024 * 1024,
      'GB': 8 * 1024 * 1024 * 1024,
      'TB': 8 * 1024 * 1024 * 1024 * 1024,
    };
    const sizeInBits = size * sizeMultipliers[fileSizeUnit];

    // Convert speed to bits per second
    const speedMultipliers: Record<string, number> = {
      'Kbps': 1000,
      'Mbps': 1000000,
      'Gbps': 1000000000,
    };
    const speedInBps = spd * speedMultipliers[speedUnit];

    // Calculate time in seconds
    const timeInSeconds = sizeInBits / speedInBps;

    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    const milliseconds = Math.round((timeInSeconds % 1) * 1000);

    return {
      totalSeconds: timeInSeconds,
      hours,
      minutes,
      seconds,
      milliseconds,
      formatted: formatTime(timeInSeconds),
    };
  });

  // Functions
  function formatTime(seconds: number): string {
    if (seconds < 1) {
      return `${Math.round(seconds * 1000)} ms`;
    }
    if (seconds < 60) {
      return `${seconds.toFixed(1)} ${t('seconds')}`;
    }
    if (seconds < 3600) {
      const mins = Math.floor(seconds / 60);
      const secs = Math.round(seconds % 60);
      return `${mins} ${t('minutes')} ${secs} ${t('seconds')}`;
    }
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hrs} ${t('hours')} ${mins} ${t('minutes')}`;
  }
  function handlePresetSpeed(preset: typeof COMMON_SPEEDS[0]) {
    speed = preset.speed.toString();
    speedUnit = preset.unit;
  }
  async function handleCopy() {
    if (!results) return;
    const text = `Transfer time: ${results.formatted}`;
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

        <!-- Connection Speed -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('connectionSpeed')}
          </label>
          <div class="flex gap-2">
            <input
              type="number"
              bind:value={speed}
              min="0"
              step="any"
              class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            <select
              bind:value={speedUnit}
              class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              {#each SPEED_UNITS as unit (unit)}
<option  value={unit}>{unit}</option>
{/each}
            </select>
          </div>
        </div>
      </div>

      <!-- Preset Speeds -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('presetSpeeds')}
        </label>
        <div class="flex flex-wrap gap-2">
          {#each COMMON_SPEEDS as preset (preset.name)}
<button 
              onclick={() => handlePresetSpeed(preset)}
              class="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {preset.name}
            </button>
{/each}
        </div>
      </div>

      <!-- Results -->
      {#if results}
<div class="p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium">{t('estimatedTime')}</h3>
            <button
              onclick={handleCopy}
              class="px-3 py-1 text-sm bg-white/20 rounded hover:bg-white/30 transition-colors"
            >
              {copied ? common('copied') : common('copy')}
            </button>
          </div>
          
          <div class="text-4xl font-bold mb-4">
            {results.formatted}
          </div>

          <div class="grid grid-cols-4 gap-4 text-center">
            <div>
              <div class="text-2xl font-semibold">{results.hours}</div>
              <div class="text-sm opacity-80">{t('hours')}</div>
            </div>
            <div>
              <div class="text-2xl font-semibold">{results.minutes}</div>
              <div class="text-sm opacity-80">{t('minutes')}</div>
            </div>
            <div>
              <div class="text-2xl font-semibold">{results.seconds}</div>
              <div class="text-sm opacity-80">{t('seconds')}</div>
            </div>
            <div>
              <div class="text-2xl font-semibold">{results.milliseconds}</div>
              <div class="text-sm opacity-80">ms</div>
            </div>
          </div>
        </div>
{/if}

      <!-- Info -->
      <div class="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
        <p class="text-sm text-yellow-800 dark:text-yellow-300">
          {t('note')}
        </p>
      </div>
    </div>
  
