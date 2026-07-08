<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['name-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.name-generator.${key}`;
  }
  function tCommon(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Imports
  import { RefreshCw, Copy, Check, User, Users } from 'lucide-svelte';
  import { generateNames, getAvailableOrigins, type Gender, type Origin } from '@/lib/data/names';

  let gender = $state('any');

  let origin = $state('any');

  let count = $state(5);

  let names = $state([]);

  let copiedIndex = $state(null);

  let copiedAll = $state(false);

  let timerRef = $state(null);

  function generate() {
    const newNames = generateNames(count, gender, origin);
    names = newNames;
  }  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function copyName(name: string, index: number) {
    navigator.clipboard.writeText(name);
    copiedIndex = index;
    setTimeout(() => copiedIndex = null, 2000);
  }
  function copyAll() {
    navigator.clipboard.writeText(names.join('\n'));
    copiedAll = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copiedAll = false, 2000);
  }
  const origins = getAvailableOrigins();

</script>


    <div class="space-y-6">
      <!-- Options -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Gender -->
        <div class="space-y-2">
          <label for="name-generator-field-6" class="tool-label">
            {t('gender')}
          </label>
          <select
            value={gender}
            onchange={(e) => gender = e.target.value as Gender}
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" id="name-generator-field-6">
            <option value="any">{t('anyGender')}</option>
            <option value="male">{t('male')}</option>
            <option value="female">{t('female')}</option>
            <option value="neutral">{t('neutral')}</option>
          </select>
        </div>

        <!-- Origin -->
        <div class="space-y-2">
          <label for="name-generator-field-5" class="tool-label">
            {t('origin')}
          </label>
          <select
            value={origin}
            onchange={(e) => origin = e.target.value as Origin}
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" id="name-generator-field-5">
            {#each origins as o (o)}
<option  value={o}>
                {t(`origins.${o}`)}
              </option>
{/each}
          </select>
        </div>

        <!-- Count -->
        <div class="space-y-2">
          <label for="name-generator-field-4" class="tool-label">
            {t('count')}
          </label>
          <select
            value={count}
            onchange={(e) => count = parseInt(e.target.value)}
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" id="name-generator-field-4">
            {#each [1, 5, 10, 20, 50] as n (n)}
<option  value={n}>{n}</option>
{/each}
          </select>
        </div>
      </div>

      <!-- Generate Button -->
      <div class="flex gap-3">
        <button
          onclick={generate}
          class="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-slate-500 to-pink-500 text-white rounded-lg hover:from-slate-600 hover:to-pink-600 transition-all font-medium"
        >
          <RefreshCw class="w-5 h-5" />
          {t('generate')}
        </button>

        {#if names.length > 0}
<button
            onclick={copyAll}
            class="flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {#if copiedAll}
<Check class="w-5 h-5" />
{:else}
<Copy class="w-5 h-5" />
{/if}
            {copiedAll ? tCommon('copied') : t('copyAll')}
          </button>
{/if}
      </div>

      <!-- Results -->
      {#if names.length > 0}
<div class="space-y-2">
          <div class="flex items-center justify-between">
            <h3 class="font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <Users class="w-5 h-5" />
              {t('generatedNames')} ({names.length})
            </h3>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {#each names as name, index (index)}
<div 
                class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
              >
                <div class="flex items-center gap-2">
                  <User class="w-4 h-4 text-gray-400" />
                  <span class="text-gray-900 dark:text-white">{name}</span>
                </div>
                <button
                  onclick={() => copyName(name, index)}
                  class="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {#if copiedIndex === index}
<Check class="w-4 h-4 text-green-500" />
{:else}
<Copy class="w-4 h-4" />
{/if}
                </button>
              </div>
{/each}
          </div>
        </div>
{/if}

      <!-- Empty State -->
      {#if names.length === 0}
<div class="text-center py-12 text-gray-500">
          <Users class="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>{t('clickToGenerate')}</p>
        </div>
{/if}
    </div>
  
