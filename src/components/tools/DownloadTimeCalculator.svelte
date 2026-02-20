<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['download-time-calculator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.download-time-calculator.${key}`;
  }
  function tg(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  type SizeUnit = 'KB' | 'MB' | 'GB' | 'TB';
  type SpeedUnit = 'Kbps' | 'Mbps' | 'Gbps';
  interface SpeedPreset {
  name: string;
  speed: number;
  unit: SpeedUnit;
}

  let fileSize = $state(100);

  let sizeUnit = $state('MB');

  let speed = $state(50);

  let speedUnit = $state('Mbps');

  let results = $derived.by(() => {
    // 转换为字节
    const sizeMultipliers: Record<SizeUnit, number> = {
      'KB': 1024,
      'MB': 1024 * 1024,
      'GB': 1024 * 1024 * 1024,
      'TB': 1024 * 1024 * 1024 * 1024,
    };
    const bytes = fileSize * sizeMultipliers[sizeUnit];

    // 转换为 bits per second
    const speedMultipliers: Record<SpeedUnit, number> = {
      'Kbps': 1000,
      'Mbps': 1000 * 1000,
      'Gbps': 1000 * 1000 * 1000,
    };
    const bps = speed * speedMultipliers[speedUnit];

    // 计算时间（秒）
    const bits = bytes * 8;
    const seconds = bits / bps;

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.round(seconds % 60);

    let formatted = '';
    if (hours > 0) formatted += `${hours}h `;
    if (minutes > 0 || hours > 0) formatted += `${minutes}m `;
    formatted += `${secs}s`;

    return {
      seconds: Math.round(seconds),
      formatted: formatted.trim(),
      hours,
      minutes,
      secs,
    };
  });

  // Functions
  function applyPreset(preset: SpeedPreset) {
    speed = preset.speed;
    speedUnit = preset.unit;
  }

</script>


                  <tr class="border-b border-gray-200 dark:border-gray-600">
                    <td class="py-2">{preset.name} ({preset.speed} {preset.unit})</td>
                    <td class="text-right py-2 font-mono">{time.trim()}</td>
                  </tr>
                
