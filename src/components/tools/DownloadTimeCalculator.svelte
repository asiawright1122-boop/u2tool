<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  type SizeUnit = 'KB' | 'MB' | 'GB' | 'TB';
  type SpeedUnit = 'Kbps' | 'Mbps' | 'Gbps';

  interface SpeedPreset {
    name: string;
    speed: number;
    unit: SpeedUnit;
  }

  const SPEED_PRESETS: SpeedPreset[] = [
    { name: '3G', speed: 8, unit: 'Mbps' },
    { name: '4G', speed: 25, unit: 'Mbps' },
    { name: '5G', speed: 150, unit: 'Mbps' },
    { name: 'Fiber', speed: 1, unit: 'Gbps' },
  ];

  let { locale, translations }: Props = $props();

  function t(key: string): string {
    const scope =
      (translations['tools']['download-time-calculator'] as Record<string, unknown>) || {};
    const keys = key.split('.');
    let value: unknown = scope;

    for (const part of keys) {
      value = (value as Record<string, unknown>)?.[part];
    }

    return typeof value === 'string'
      ? value
      : `MISSING: tools.download-time-calculator.${key}`;
  }

  function tCommon(key: string): string {
    const scope = (translations['tools'] as Record<string, unknown>) || {};
    const keys = key.split('.');
    let value: unknown = scope;

    for (const part of keys) {
      value = (value as Record<string, unknown>)?.[part];
    }

    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  function formatDuration(totalSeconds: number): string {
    const safeSeconds = Math.max(0, Math.round(totalSeconds));
    const days = Math.floor(safeSeconds / 86400);
    const hours = Math.floor((safeSeconds % 86400) / 3600);
    const minutes = Math.floor((safeSeconds % 3600) / 60);
    const seconds = safeSeconds % 60;

    const parts: string[] = [];
    if (days > 0) {
      parts.push(`${days} ${t('days')}`);
    }
    if (hours > 0) {
      parts.push(`${hours}h`);
    }
    if (minutes > 0) {
      parts.push(`${minutes} ${t('minutes')}`);
    }
    if (seconds > 0 || parts.length === 0) {
      parts.push(`${seconds} ${t('seconds')}`);
    }

    return parts.join(' ');
  }

  function calculateSeconds(size: number, sizeUnit: SizeUnit, speed: number, speedUnit: SpeedUnit): number {
    const sizeMultipliers: Record<SizeUnit, number> = {
      KB: 1024,
      MB: 1024 * 1024,
      GB: 1024 * 1024 * 1024,
      TB: 1024 * 1024 * 1024 * 1024,
    };
    const speedMultipliers: Record<SpeedUnit, number> = {
      Kbps: 1000,
      Mbps: 1000 * 1000,
      Gbps: 1000 * 1000 * 1000,
    };

    const bytes = Math.max(Number(size) || 0, 0) * sizeMultipliers[sizeUnit];
    const bitsPerSecond = Math.max(Number(speed) || 0, 0) * speedMultipliers[speedUnit];

    if (bitsPerSecond === 0) {
      return 0;
    }

    return (bytes * 8) / bitsPerSecond;
  }

  let fileSize = $state(100);
  let sizeUnit = $state<SizeUnit>('MB');
  let speed = $state(50);
  let speedUnit = $state<SpeedUnit>('Mbps');

  let results = $derived.by(() => {
    const seconds = calculateSeconds(fileSize, sizeUnit, speed, speedUnit);

    return {
      seconds: Math.round(seconds),
      formatted: formatDuration(seconds),
      minutes: Math.round((seconds / 60) * 10) / 10,
      hours: Math.round((seconds / 3600) * 10) / 10,
    };
  });

  let comparisonRows = $derived.by(() =>
    SPEED_PRESETS.map((preset) => ({
      ...preset,
      time: formatDuration(calculateSeconds(fileSize, sizeUnit, preset.speed, preset.unit)),
    }))
  );

  function applyPreset(preset: SpeedPreset) {
    speed = preset.speed;
    speedUnit = preset.unit;
  }
</script>

<div class="space-y-6">
  <div class="grid gap-4 md:grid-cols-2">
    <label class="space-y-2">
      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{t('fileSize')}</span>
      <div class="grid grid-cols-[minmax(0,1fr),120px] gap-3">
        <input
          bind:value={fileSize}
          type="number"
          min="0"
          step="0.1"
          class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        />
        <select
          bind:value={sizeUnit}
          class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        >
          <option value="KB">KB</option>
          <option value="MB">MB</option>
          <option value="GB">GB</option>
          <option value="TB">TB</option>
        </select>
      </div>
    </label>

    <label class="space-y-2">
      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{t('downloadSpeed')}</span>
      <div class="grid grid-cols-[minmax(0,1fr),120px] gap-3">
        <input
          bind:value={speed}
          type="number"
          min="0"
          step="0.1"
          class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        />
        <select
          bind:value={speedUnit}
          class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        >
          <option value="Kbps">Kbps</option>
          <option value="Mbps">Mbps</option>
          <option value="Gbps">Gbps</option>
        </select>
      </div>
    </label>
  </div>

  <div class="flex flex-wrap gap-2">
    {#each SPEED_PRESETS as preset (preset.name)}
      <button
        onclick={() => applyPreset(preset)}
        class={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
          speed === preset.speed && speedUnit === preset.unit
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
        }`}
      >
        {preset.name}
      </button>
    {/each}
  </div>

  <section class="grid gap-4 md:grid-cols-3">
    <div class="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 p-5 text-white shadow-lg">
      <div class="text-sm opacity-80">{t('estimatedTime')}</div>
      <div class="mt-2 text-3xl font-bold">{results.formatted}</div>
    </div>
    <div class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900/40">
      <div class="text-sm text-gray-500 dark:text-gray-400">{t('minutes')}</div>
      <div class="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">{results.minutes}</div>
    </div>
    <div class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900/40">
      <div class="text-sm text-gray-500 dark:text-gray-400">Hours</div>
      <div class="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">{results.hours}</div>
    </div>
  </section>

  <section class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900/40">
    <div class="mb-4 flex items-center justify-between gap-3">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{t('comparisonTable')}</h3>
      <button
        onclick={() => {
          fileSize = 100;
          sizeUnit = 'MB';
          speed = 50;
          speedUnit = 'Mbps';
        }}
        class="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
      >
        {tCommon('clear')}
      </button>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full text-sm">
        <thead>
          <tr class="border-b border-gray-200 text-left text-gray-500 dark:border-gray-700 dark:text-gray-400">
            <th class="py-2 pr-4">{t('connection')}</th>
            <th class="py-2 pr-4">{t('downloadSpeed')}</th>
            <th class="py-2 text-right">{t('time')}</th>
          </tr>
        </thead>
        <tbody>
          {#each comparisonRows as row (row.name)}
            <tr class="border-b border-gray-200 dark:border-gray-700">
              <td class="py-3 pr-4 font-medium text-gray-900 dark:text-white">{row.name}</td>
              <td class="py-3 pr-4 text-gray-600 dark:text-gray-300">{row.speed} {row.unit}</td>
              <td class="py-3 text-right font-mono text-gray-700 dark:text-gray-200">{row.time}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </section>
</div>
