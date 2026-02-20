<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['age-calculator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.age-calculator.${key}`;
  }
  function tc(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Imports
  import { calculateAge, AgeResult } from '@/lib/calculator-utils';

  let birthDate = $state('');

  let referenceDate = $state(new Date().toISOString().split('T')[0] as string);

  let result = $state(null);

  // Functions
  function calculate() {
    if (!birthDate) return;

    const birth = new Date(birthDate);
    const reference = referenceDate ? new Date(referenceDate) : new Date();

    if (isNaN(birth.getTime()) || birth > reference) {
      return;
    }

    const res = calculateAge({ birthDate: birth, referenceDate: reference });
    result = res;
  }
  function formatDate(date: Date) {
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

</script>


    <div class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('birthDate')}
          </label>
          <input
            type="date"
            bind:value={birthDate}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('referenceDate')}
          </label>
          <input
            type="date"
            bind:value={referenceDate}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      <button
        onclick={calculate}
        class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        {tc('calculate')}
      </button>

      {#if result}
<div class="space-y-4">
          <div class="p-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white text-center">
            <div class="text-5xl font-bold mb-2">
              {result.years} <span class="text-2xl">{t('years')}</span>
            </div>
            <div class="text-xl">
              {result.months} {t('months')}, {result.days} {t('days')}
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div class="text-sm text-gray-600 dark:text-gray-400">{t('totalDays')}</div>
              <div class="text-2xl font-bold text-gray-900 dark:text-white">
                {result.totalDays.toLocaleString()}
              </div>
            </div>

            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div class="text-sm text-gray-600 dark:text-gray-400">{t('totalWeeks')}</div>
              <div class="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.floor(result.totalDays / 7).toLocaleString()}
              </div>
            </div>

            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div class="text-sm text-gray-600 dark:text-gray-400">{t('totalMonths')}</div>
              <div class="text-2xl font-bold text-gray-900 dark:text-white">
                {(result.years * 12 + result.months).toLocaleString()}
              </div>
            </div>

            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div class="text-sm text-gray-600 dark:text-gray-400">{t('totalHours')}</div>
              <div class="text-2xl font-bold text-gray-900 dark:text-white">
                {(result.totalDays * 24).toLocaleString()}
              </div>
            </div>
          </div>

          <div class="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-2xl">🎂</span>
              <span class="font-semibold text-yellow-800 dark:text-yellow-200">
                {t('nextBirthday')}
              </span>
            </div>
            <div class="text-gray-700 dark:text-gray-300">
              {formatDate(result.nextBirthday)}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {t('daysUntilBirthday', { days: result.daysUntilBirthday })}
            </div>
          </div>
        </div>
{/if}
    </div>
  
