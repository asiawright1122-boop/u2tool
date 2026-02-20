<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['screen-time-calculator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.screen-time-calculator.${key}`;
  }
  function tg(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  let hoursPerDay = $state(6);

  let wakeHours = $state(16);

  let results = $derived.by(() => {
    const daily = hoursPerDay;
    const weekly = daily * 7;
    const monthly = daily * 30;
    const yearly = daily * 365;
    const percentOfWake = ((daily / wakeHours) * 100).toFixed(1);

    return {
      daily,
      weekly,
      monthly,
      yearly,
      percentOfWake,
      weeklyDays: (weekly / 24).toFixed(1),
      monthlyDays: (monthly / 24).toFixed(1),
      yearlyDays: (yearly / 24).toFixed(1),
    };
  });

  // Functions
  function getHealthStatus() {
    if (hoursPerDay <= 2) return { status: t('excellent'), color: 'text-green-600' };
    if (hoursPerDay <= 4) return { status: t('good'), color: 'text-blue-600' };
    if (hoursPerDay <= 6) return { status: t('moderate'), color: 'text-yellow-600' };
    if (hoursPerDay <= 8) return { status: t('high'), color: 'text-orange-600' };
    return { status: t('excessive'), color: 'text-red-600' };
  }
  const health = getHealthStatus();

</script>


    <div class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm text-gray-600 dark:text-gray-300 mb-1">
            {t('hoursPerDay')}: {hoursPerDay}h
          </label>
          <input
            type="range"
            min={0}
            max={24}
            step={0.5}
            value={hoursPerDay}
            onchange={(e) => hoursPerDay = Number(e.target.value)}
            class="w-full"
          />
        </div>
        <div>
          <label class="block text-sm text-gray-600 dark:text-gray-300 mb-1">
            {t('wakeHours')}: {wakeHours}h
          </label>
          <input
            type="range"
            min={12}
            max={20}
            step={0.5}
            value={wakeHours}
            onchange={(e) => wakeHours = Number(e.target.value)}
            class="w-full"
          />
        </div>
      </div>

      <div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-center">
        <p class="text-sm text-gray-600 dark:text-gray-300 mb-2">{t('healthStatus')}</p>
        <p class={`text-2xl font-bold ${health.color}`}>{health.status}</p>
        <p class="text-sm text-gray-500 mt-2">
          {t('percentOfWake')}: <span class="font-bold">{results.percentOfWake}%</span>
        </p>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-center">
          <p class="text-sm text-gray-600 dark:text-gray-300">{t('daily')}</p>
          <p class="text-2xl font-bold text-blue-600">{results.daily}h</p>
        </div>
        <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-center">
          <p class="text-sm text-gray-600 dark:text-gray-300">{t('weekly')}</p>
          <p class="text-2xl font-bold text-blue-600">{results.weekly}h</p>
          <p class="text-xs text-gray-500">({results.weeklyDays} {t('days')})</p>
        </div>
        <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-center">
          <p class="text-sm text-gray-600 dark:text-gray-300">{t('monthly')}</p>
          <p class="text-2xl font-bold text-blue-600">{results.monthly}h</p>
          <p class="text-xs text-gray-500">({results.monthlyDays} {t('days')})</p>
        </div>
        <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-center">
          <p class="text-sm text-gray-600 dark:text-gray-300">{t('yearly')}</p>
          <p class="text-2xl font-bold text-blue-600">{results.yearly}h</p>
          <p class="text-xs text-gray-500">({results.yearlyDays} {t('days')})</p>
        </div>
      </div>

      <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
        <h3 class="font-medium text-blue-800 dark:text-blue-200 mb-2">{t('recommendations')}</h3>
        <ul class="text-sm text-blue-700 dark:text-blue-300 space-y-1 list-disc list-inside">
          <li>{t('tip1')}</li>
          <li>{t('tip2')}</li>
          <li>{t('tip3')}</li>
          <li>{t('tip4')}</li>
        </ul>
      </div>
    </div>
  
