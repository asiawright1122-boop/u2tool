<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['dateCalc'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.dateCalc.${key}`;
  }

  let date1 = $state(new Date().toISOString().split('T')[0]);

  let date2 = $state(new Date().toISOString().split('T')[0]);

  let baseDate = $state(new Date().toISOString().split('T')[0]);

  let days = $state(0);

  let operation = $state('add');

  let diff = $derived.by(() => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);
    
    return { days: diffDays, weeks: diffWeeks, months: diffMonths, years: diffYears };
  });

  let resultDate = $derived.by(() => {
    const base = new Date(baseDate);
    const offset = operation === 'add' ? days : -days;
    base.setDate(base.getDate() + offset);
    return base.toISOString().split('T')[0];
  });

</script>


    <div class="space-y-6">
      <!-- Date Difference -->
      <div class="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-4">
        <h3 class="text-lg font-medium mb-4 text-gray-900 dark:text-white">{t('dateDiff')}</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label for="date-calc-start" class="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('startDate')}</label>
            <input
              id="date-calc-start"
              name="startDate"
              type="date"
              bind:value={date1}
              class="w-full bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>
          <div>
            <label for="date-calc-end" class="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('endDate')}</label>
            <input
              id="date-calc-end"
              name="endDate"
              type="date"
              bind:value={date2}
              class="w-full bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg p-3 text-center">
            <div class="text-2xl font-bold text-amber-600 dark:text-amber-400">{diff.days}</div>
            <div class="text-sm text-gray-600 dark:text-gray-300">{t('days')}</div>
          </div>
          <div class="bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg p-3 text-center">
            <div class="text-2xl font-bold text-green-600 dark:text-green-400">{diff.weeks}</div>
            <div class="text-sm text-gray-600 dark:text-gray-300">{t('weeks')}</div>
          </div>
          <div class="bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg p-3 text-center">
            <div class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{diff.months}</div>
            <div class="text-sm text-gray-600 dark:text-gray-300">{t('months')}</div>
          </div>
          <div class="bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg p-3 text-center">
            <div class="text-2xl font-bold text-slate-600 dark:text-slate-400">{diff.years}</div>
            <div class="text-sm text-gray-600 dark:text-gray-300">{t('years')}</div>
          </div>
        </div>
      </div>

      <!-- Add/Subtract Days -->
      <div class="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-4">
        <h3 class="text-lg font-medium mb-4 text-gray-900 dark:text-white">{t('addSubtract')}</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label for="date-calc-base" class="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('baseDate')}</label>
            <input
              id="date-calc-base"
              name="baseDate"
              type="date"
              bind:value={baseDate}
              class="w-full bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>
          <div>
            <label for="date-calc-operation" class="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('operation')}</label>
            <select
              id="date-calc-operation"
              name="operation"
              value={operation}
              onchange={(e) => operation = e.target.value as 'add' | 'subtract'}
              class="w-full bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
            >
              <option value="add">{t('add')}</option>
              <option value="subtract">{t('subtract')}</option>
            </select>
          </div>
          <div>
            <label for="date-calc-days" class="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('days')}</label>
            <input
              id="date-calc-days"
              name="daysValue"
              type="number"
              value={days}
              onchange={(e) => days = Number(e.target.value)}
              class="w-full bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>
        </div>
        <div class="bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg p-4 text-center">
          <div class="text-sm text-gray-600 dark:text-gray-300 mb-1">{t('result')}</div>
          <div class="text-2xl font-bold text-amber-600 dark:text-amber-400">{resultDate}</div>
        </div>
      </div>
    </div>
  
