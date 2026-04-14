<script lang="ts">
  import { onDestroy } from 'svelte';
  import { nameData } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['fake-name-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.fake-name-generator.${key}`;
  }

  // Types
  type Country = keyof typeof nameData;
  type Gender = 'male' | 'female' | 'random';

  let country = $state('en');

  let gender = $state('random');

  let count = $state(10);

  let names = $state([]);

  let copied = $state(false);

  let timerRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function generateNames() {
    const data = nameData[country];
    const generated: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const useGender = gender === 'random' 
        ? (Math.random() > 0.5 ? 'male' : 'female')
        : gender;
      
      const firstNames = data[useGender];
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = data.last[Math.floor(Math.random() * data.last.length)];
      
      if (country === 'zh' || country === 'ja' || country === 'ko') {
        generated.push(`${lastName}${firstName}`);
      } else {
        generated.push(`${firstName} ${lastName}`);
      }
    }
    
    names = generated;
  }
  function copyNames() {
    navigator.clipboard.writeText(names.join('\n'));
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }
  const countryLabels: Record<Country, string> = {
    en: t('english'),
    zh: t('chinese'),
    ja: t('japanese'),
    ko: t('korean'),
    de: t('german'),
    es: t('spanish'),
  };

</script>


    <div class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="tool-label">
            {t('country')}
          </label>
          <select
            value={country}
            onchange={(e) => country = e.target.value as Country}
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            {#each Object.keys(nameData) as c (c)}
<option  value={c}>{countryLabels[c as Country]}</option>
{/each}
          </select>
        </div>
        <div>
          <label class="tool-label">
            {t('gender')}
          </label>
          <select
            value={gender}
            onchange={(e) => gender = e.target.value as Gender}
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="random">{t('random')}</option>
            <option value="male">{t('male')}</option>
            <option value="female">{t('female')}</option>
          </select>
        </div>
        <div>
          <label class="tool-label">
            {t('count')}
          </label>
          <input
            type="number"
            value={count}
            onchange={(e) => count = Math.max(1, Math.min(100, parseInt(e.target.value) || 1))}
            min="1"
            max="100"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      <div class="flex justify-center">
        <button
          onclick={generateNames}
          class="px-8 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M16 8h.01"/><path d="M8 8h.01"/><path d="M8 16h.01"/><path d="M16 16h.01"/><path d="M12 12h.01"/></svg> {t('generate')}
        </button>
      </div>

      {#if names.length > 0}
<div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-medium text-gray-900 dark:text-white">
              {t('generatedNames')} ({names.length})
            </h3>
            <button
              onclick={copyNames}
              class="px-4 py-2 btn-success rounded-lg hover:bg-green-700 text-sm"
            >
              {copied ? t('copied') : t('copyAll')}
            </button>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {#each names as name, i (i)}
<div 
                class="px-3 py-2 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
              >
                {name}
              </div>
{/each}
          </div>
        </div>
{/if}

      <div class="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
        <h3 class="font-medium text-yellow-800 dark:text-yellow-300 mb-2">{t('disclaimer')}</h3>
        <p class="text-sm text-yellow-700 dark:text-yellow-400">{t('disclaimerText')}</p>
      </div>
    </div>
  
