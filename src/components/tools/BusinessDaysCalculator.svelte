<script lang="ts">
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

  // Types
  interface Holiday {
  date: string;
  name: string;
}

  let startDate = $state(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  let endDate = $state(() => {
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return nextMonth.toISOString().split('T')[0];
  });

  let excludeWeekends = $state(true);

  let holidays = $state([]);

  let newHolidayDate = $state('');

  let newHolidayName = $state('');

  let reverseMode = $state(false);

  let businessDaysToAdd = $state(10);

  let calculateBusinessDays = $derived.by(() => {
    if (!startDate || !endDate) return null;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start > end) return null;
    
    let totalDays = 0;
    let businessDays = 0;
    let weekendDays = 0;
    let holidayDays = 0;
    
    const current = new Date(start);
    while (current <= end) {
      totalDays++;
      const isWeekendDay = isWeekend(current);
      const isHolidayDay = isHoliday(current);
      
      if (isWeekendDay && excludeWeekends) {
        weekendDays++;
      } else if (isHolidayDay) {
        holidayDays++;
      } else {
        businessDays++;
      }
      
      current.setDate(current.getDate() + 1);
    }
    
    return { totalDays, businessDays, weekendDays, holidayDays };
  });

  let calculateEndDateFromBusinessDays = $derived.by(() => {
    if (!startDate || businessDaysToAdd <= 0) return null;
    
    const start = new Date(startDate);
    let addedDays = 0;
    const current = new Date(start);
    
    while (addedDays < businessDaysToAdd) {
      current.setDate(current.getDate() + 1);
      const isWeekendDay = isWeekend(current);
      const isHolidayDay = isHoliday(current);
      
      if (excludeWeekends && isWeekendDay) continue;
      if (isHolidayDay) continue;
      
      addedDays++;
    }
    
    return current.toISOString().split('T')[0];
  });

  // Functions
  function isWeekend(date: Date): boolean {
    const day = date.getDay();
    return day === 0 || day === 6;
  }
  function isHoliday(date: Date): boolean {
    const dateStr = date.toISOString().split('T')[0];
    return holidays.some(h => h.date === dateStr);
  }
  function addHoliday() {
    if (newHolidayDate && newHolidayName) {
      holidays = [...holidays, { date: newHolidayDate, name: newHolidayName }];
      newHolidayDate = '';
      newHolidayName = '';
    }
  }
  function removeHoliday(index: number) {
    holidays = holidays.filter((_, i) => i !== index);
  }

</script>


    <div class="space-y-6">
      <!-- Mode Toggle -->
      <div class="flex gap-2">
        <button
          onclick={() => reverseMode = false}
          class={`px-4 py-2 rounded-lg font-medium transition-colors ${
            !reverseMode
              ? 'bg-amber-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          {t('businessDays.calculateDays')}
        </button>
        <button
          onclick={() => reverseMode = true}
          class={`px-4 py-2 rounded-lg font-medium transition-colors ${
            reverseMode
              ? 'bg-amber-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          {t('businessDays.calculateEndDate')}
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Input Section -->
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('businessDays.startDate')}
            </label>
            <input
              type="date"
              bind:value={startDate}
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          {#if !reverseMode}
<div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('businessDays.endDate')}
              </label>
              <input
                type="date"
                bind:value={endDate}
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>
{:else}
<div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('businessDays.businessDaysToAdd')}
              </label>
              <input
                type="number"
                min="1"
                value={businessDaysToAdd}
                onchange={(e) => businessDaysToAdd = parseInt(e.target.value) || 1}
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>
{/if}

          <div class="flex items-center gap-2">
            <input
              type="checkbox"
              id="excludeWeekends"
              bind:checked={excludeWeekends}
              class="w-4 h-4 text-amber-600 rounded"
            />
            <label for="excludeWeekends" class="text-sm text-gray-700 dark:text-gray-300">
              {t('businessDays.excludeWeekends')}
            </label>
          </div>

          <!-- Holidays Section -->
          <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 class="font-medium text-gray-900 dark:text-gray-100 mb-3">
              {t('businessDays.customHolidays')}
            </h3>
            
            <div class="flex gap-2 mb-3">
              <input
                type="date"
                bind:value={newHolidayDate}
                class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
              />
              <input
                type="text"
                bind:value={newHolidayName}
                placeholder={t('businessDays.holidayName')}
                class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
              />
              <button
                onclick={addHoliday}
                disabled={!newHolidayDate || !newHolidayName}
                class="px-3 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {t('add')}
              </button>
            </div>

            {#if holidays.length > 0}
<div class="space-y-2">
                {#each holidays as holiday, index (index)}
<div 
                    class="flex items-center justify-between bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded"
                  >
                    <span class="text-sm text-gray-700 dark:text-gray-300">
                      {holiday.date} - {holiday.name}
                    </span>
                    <button
                      onclick={() => removeHoliday(index)}
                      class="text-red-500 hover:text-red-700 text-sm"
                    >
                      ✕
                    </button>
                  </div>
{/each}
              </div>
{/if}
          </div>
        </div>

        <!-- Results Section -->
        <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h3 class="font-medium text-gray-900 dark:text-gray-100 mb-4">
            {t('result')}
          </h3>

          {#if !reverseMode}
{#if calculateBusinessDays}
<div class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                  <div class="bg-white dark:bg-gray-700 p-4 rounded-lg text-center">
                    <div class="text-3xl font-bold text-amber-600 dark:text-amber-400">
                      {calculateBusinessDays.businessDays}
                    </div>
                    <div class="text-sm text-gray-600 dark:text-gray-400">
                      {t('businessDays.businessDays')}
                    </div>
                  </div>
                  <div class="bg-white dark:bg-gray-700 p-4 rounded-lg text-center">
                    <div class="text-3xl font-bold text-gray-600 dark:text-gray-400">
                      {calculateBusinessDays.totalDays}
                    </div>
                    <div class="text-sm text-gray-600 dark:text-gray-400">
                      {t('businessDays.totalDays')}
                    </div>
                  </div>
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                  <div class="bg-white dark:bg-gray-700 p-3 rounded-lg text-center">
                    <div class="text-xl font-semibold text-orange-500">
                      {calculateBusinessDays.weekendDays}
                    </div>
                    <div class="text-xs text-gray-600 dark:text-gray-400">
                      {t('businessDays.weekendDays')}
                    </div>
                  </div>
                  <div class="bg-white dark:bg-gray-700 p-3 rounded-lg text-center">
                    <div class="text-xl font-semibold text-red-500">
                      {calculateBusinessDays.holidayDays}
                    </div>
                    <div class="text-xs text-gray-600 dark:text-gray-400">
                      {t('businessDays.holidayDays')}
                    </div>
                  </div>
                </div>
              </div>
{:else}
<p class="text-gray-500 dark:text-gray-400">
                {t('businessDays.invalidDateRange')}
              </p>
{/if}
{:else}
{#if calculateEndDateFromBusinessDays}
<div class="bg-white dark:bg-gray-700 p-6 rounded-lg text-center">
                <div class="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {t('businessDays.calculatedEndDate')}
                </div>
                <div class="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {calculateEndDateFromBusinessDays}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {new Date(calculateEndDateFromBusinessDays).toLocaleDateString(undefined, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
{/if}
{/if}
        </div>
      </div>
    </div>
  
