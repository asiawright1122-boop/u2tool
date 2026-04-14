<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['typing-time-calculator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.typing-time-calculator.${key}`;
  }
  function tg(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  let wordCount = $state(1000);

  let typingSpeed = $state(40);

  let results = $derived.by(() => {
    const minutes = wordCount / typingSpeed;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.round(minutes % 60);
    const breaks = Math.floor(minutes / 25); // 每25分钟休息一次
    const totalWithBreaks = minutes + (breaks * 5); // 每次休息5分钟

    return {
      minutes: Math.round(minutes),
      hours,
      remainingMinutes,
      breaks,
      totalWithBreaks: Math.round(totalWithBreaks),
      formatted: hours > 0 
        ? `${hours}h ${remainingMinutes}m`
        : `${Math.round(minutes)}m`,
    };
  });

  // Functions
  const speedLevels = [
    { label: t('beginner'), speed: 20 },
    { label: t('average'), speed: 40 },
    { label: t('professional'), speed: 60 },
    { label: t('expert'), speed: 80 },
  ];

</script>


    <div class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm text-gray-600 dark:text-gray-300 mb-1">
            {t('wordCount')}
          </label>
          <input
            type="number"
            min={1}
            value={wordCount}
            onchange={(e) => wordCount = Number(e.target.value) || 1}
            class="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label class="block text-sm text-gray-600 dark:text-gray-300 mb-1">
            {t('typingSpeed')}: {typingSpeed} WPM
          </label>
          <input
            type="range"
            min={10}
            max={120}
            value={typingSpeed}
            onchange={(e) => typingSpeed = Number(e.target.value)}
            class="w-full"
          />
        </div>
      </div>

      <div class="flex flex-wrap gap-2">
        {#each speedLevels as level (level.speed)}
<button 
            onclick={() => typingSpeed = level.speed}
            class={`px-3 py-1 rounded-lg text-sm transition-colors ${
              typingSpeed === level.speed
                ? 'bg-amber-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
            }`}
          >
            {level.label} ({level.speed} WPM)
          </button>
{/each}
      </div>

      <div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 text-center">
        <p class="text-sm text-gray-600 dark:text-gray-300 mb-2">{t('estimatedTime')}</p>
        <p class="text-4xl font-bold text-amber-600">{results.formatted}</p>
        <p class="text-sm text-gray-500 mt-2">
          ({results.minutes} {t('minutesTotal')})
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-center">
          <p class="text-sm text-gray-600 dark:text-gray-300">{t('pureTypingTime')}</p>
          <p class="text-xl font-bold text-amber-600">{results.formatted}</p>
        </div>
        <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-center">
          <p class="text-sm text-gray-600 dark:text-gray-300">{t('recommendedBreaks')}</p>
          <p class="text-xl font-bold text-green-600">{results.breaks}</p>
        </div>
        <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-center">
          <p class="text-sm text-gray-600 dark:text-gray-300">{t('totalWithBreaks')}</p>
          <p class="text-xl font-bold text-slate-600">{results.totalWithBreaks}m</p>
        </div>
      </div>

      <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
        <h3 class="font-medium text-green-800 dark:text-green-200 mb-2">{t('ergonomicTips')}</h3>
        <ul class="text-sm text-green-700 dark:text-green-300 space-y-1 list-disc list-inside">
          <li>{t('tip1')}</li>
          <li>{t('tip2')}</li>
          <li>{t('tip3')}</li>
        </ul>
      </div>
    </div>
  
