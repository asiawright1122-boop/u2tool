<script lang="ts">
  import { onDestroy } from 'svelte';

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
  function tz(key: string): string {
    const scope = translations['tools']['timezone-converter'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.timezone-converter.${key}`;
  }

  let sourceTimezone = $state('UTC');

  let targetTimezone = $state('Asia/Shanghai');

  let inputDate = $state('');

  let inputTime = $state('');

  let result = $state(null);

  let copied = $state(false);

  let timerRef = $state(null);

  $effect(() => {
    const now = new Date();
    inputDate = now.toISOString().split('T')[0];
    inputTime = now.toTimeString().slice(0, 5);
  });

  $effect(() => {
    convert();
  });  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function convert() {
    if (!inputDate || !inputTime) return;

    try {
      const sourceDate = new Date(`${inputDate}T${inputTime}:00`);
      
      // 格式化源时区时间（保留供调试使用）
      const _sourceFormatted = sourceDate.toLocaleString('en-US', {
        timeZone: sourceTimezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });

      const targetFormatted = sourceDate.toLocaleString('en-US', {
        timeZone: targetTimezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });

      const [datePart, timePart] = targetFormatted.split(', ');
      
      result = {
        date: datePart,
        time: timePart,
        full: targetFormatted
      };
    } catch (_e) {
      result = null;
    }
  }
  function useNow() {
    const now = new Date();
    inputDate = now.toISOString().split('T')[0];
    inputTime = now.toTimeString().slice(0, 5);
  }
  function swapTimezones() {
    const temp = sourceTimezone;
    sourceTimezone = targetTimezone;
    targetTimezone = temp;
  }
  async function copyResult() {
    if (result) {
      await navigator.clipboard.writeText(result.full);
      copied = true;
      if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
    }
  }

</script>


              <div class="text-center p-2 bg-white dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded">
                <div class="text-lg font-mono text-gray-900 dark:text-white">{time}</div>
                <div class="text-xs text-gray-600 dark:text-gray-300">{tzInfo?.name?.split(' ')[0]}</div>
              </div>
            
