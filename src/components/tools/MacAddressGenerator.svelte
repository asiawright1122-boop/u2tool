<script lang="ts">
  import { applyBitFlags, formatMac, normalizePrefix, randomByte } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['mac-address-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.mac-address-generator.${key}`;
  }

  // Types
  type Separator = ':' | '-' | '';
  type MacOptions = {
  uppercase: boolean;
  separator: Separator;
  locallyAdministered: boolean;
  multicast: boolean;
  prefix: string;
};

  let count = $state(5);

  let uppercase = $state(true);

  let separator = $state(':');

  let locallyAdministered = $state(true);

  let multicast = $state(false);

  let prefix = $state('');

  let output = $state('');

  let error = $state('');

  let prefixBytes = $derived(normalizePrefix(prefix));

  function generate() {
    error = '';

    if (prefixBytes === null) {
      error = t('errorInvalidPrefix');
      return;
    }

    const safeCount = Math.max(1, Math.min(100, count || 1));

    const options: MacOptions = {
      uppercase,
      separator,
      locallyAdministered,
      multicast,
      prefix,
    };

    const results: string[] = [];

    for (let i = 0; i < safeCount; i++) {
      const bytes = [randomByte(), randomByte(), randomByte(), randomByte(), randomByte(), randomByte()];

      if (prefixBytes && prefixBytes.length > 0) {
        for (let j = 0; j < Math.min(prefixBytes.length, 6); j++) {
          bytes[j] = prefixBytes[j];
        }
      }

      bytes[0] = applyBitFlags(bytes[0], locallyAdministered, multicast);

      results.push(formatMac(bytes, options));
    }

    output = results.join('\n');
  }

  // Functions
  function handleCopy() {
    navigator.clipboard.writeText(output);
  }
  function loadSample() {
    count = 5;
    uppercase = true;
    separator = ':';
    locallyAdministered = true;
    multicast = false;
    prefix = '';
    output = '';
    error = '';
  }

</script>


    <div class="space-y-6">
      <div class="flex flex-wrap gap-4 items-center">
        <div class="flex items-center gap-2">
          <label class="text-sm text-gray-600 dark:text-gray-300">{t('count')}:</label>
          <input
            type="number"
            value={count}
            onchange={(e) => count = parseInt(e.target.value) || 1}
            min="1"
            max="100"
            class="w-20 h-10 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>

        <div class="flex items-center gap-2">
          <label class="text-sm text-gray-600 dark:text-gray-300">{t('separator')}:</label>
          <select
            value={separator}
            onchange={(e) => separator = e.target.value as Separator}
            class="w-32 h-10 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value=":">{t('sepColon')}</option>
            <option value="-">{t('sepHyphen')}</option>
            <option value="">{t('sepNone')}</option>
          </select>
        </div>

        <label class="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            bind:checked={uppercase}
            class="w-4 h-4 text-blue-600 rounded"
          />
          <span class="text-sm text-gray-600 dark:text-gray-300">{t('uppercase')}</span>
        </label>

        <button
          onclick={loadSample}
          class="text-sm text-blue-400 hover:text-blue-300"
        >
          {t('reset')}
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
              {t('prefix')}
            </label>
            <input
              type="text"
              bind:value={prefix}
              placeholder={t('prefixPlaceholder')}
              class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono placeholder-gray-500"
            />
            <p class="text-xs text-gray-600 dark:text-gray-300">{t('prefixHint')}</p>
          </div>

          <div class="space-y-3">
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                bind:checked={locallyAdministered}
                class="w-4 h-4 text-blue-600 rounded"
              />
              <span class="text-sm text-gray-600 dark:text-gray-300">{t('locallyAdministered')}</span>
            </label>

            <label class="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                bind:checked={multicast}
                class="w-4 h-4 text-blue-600 rounded"
              />
              <span class="text-sm text-gray-600 dark:text-gray-300">{t('multicast')}</span>
            </label>
          </div>

          {#if error}
<div class="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
              {error}
            </div>
{/if}

          <button
            onclick={generate}
            class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('generate')}
          </button>
        </div>

        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
              {t('output')}
            </label>
            {#if output}
<button
                onclick={handleCopy}
                class="text-sm text-blue-400 hover:text-blue-300"
              >
                {t('copyAll')}
              </button>
{/if}
          </div>
          <textarea
            value={output}
            readOnly
            placeholder={t('outputPlaceholder')}
            class="w-full h-72 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-mono placeholder-gray-500"></textarea>
        </div>
      </div>

      <div class="p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h3 class="font-medium text-blue-700 dark:text-blue-300 mb-2">{t('info')}</h3>
        <p class="text-sm text-blue-600 dark:text-blue-400">{t('infoText')}</p>
      </div>
    </div>
  
