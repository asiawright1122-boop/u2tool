<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['bionic-reading-converter'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.bionic-reading-converter.${key}`;
  }

  let input = $state('');

  let fixationStrength = $state(50);

  let copied = $state(false);

  let timerRef = $state(null);  onDestroy(() => {
    if (timerRef) clearTimeout(timerRef);
  });

  // Functions
  function convertToBionic(text: string): string {
    const words = text.split(/(\s+)/);
    return words.map(word => {
      if (/^\s+$/.test(word)) return word;
      if (word.length <= 1) return `<b>${word}</b>`;
      
      const boldLength = Math.ceil(word.length * (fixationStrength / 100));
      const boldPart = word.slice(0, boldLength);
      const normalPart = word.slice(boldLength);
      
      return `<b>${boldPart}</b>${normalPart}`;
    }).join('');
  }
  const bionicHtml = convertToBionic(input);
  function copyHtml() {
    navigator.clipboard.writeText(bionicHtml);
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }
  function copyPlainText() {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = bionicHtml;
    navigator.clipboard.writeText(tempDiv.textContent || '');
    copied = true;
    if (timerRef) clearTimeout(timerRef);
    timerRef = setTimeout(() => copied = false, 2000);
  }

</script>


    <div class="space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('inputLabel')}
        </label>
        <textarea
          bind:value={input}
          placeholder={t('inputPlaceholder')}
          class="w-full h-40 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"></textarea>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('fixationStrength')}: {fixationStrength}%
        </label>
        <input
          type="range"
          min="20"
          max="80"
          value={fixationStrength}
          onchange={(e) => fixationStrength = Number(e.target.value)}
          class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />
        <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>{t('light')}</span>
          <span>{t('medium')}</span>
          <span>{t('strong')}</span>
        </div>
      </div>

      <div class="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-medium text-gray-900 dark:text-white">{t('preview')}</h3>
          <div class="flex gap-2">
            <button
              onclick={copyHtml}
              disabled={!input}
              class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {copied ? t('copied') : t('copyHtml')}
            </button>
          </div>
        </div>
        <div
          class="prose dark:prose-invert max-w-none text-lg leading-relaxed"
          dangerouslySetInnerHTML={{ __html: bionicHtml || `<span class="text-gray-400">${t('previewPlaceholder')}</span>` }}
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <h3 class="font-medium text-yellow-800 dark:text-yellow-300 mb-2">{t('whatIsBionic')}</h3>
          <p class="text-sm text-yellow-700 dark:text-yellow-400">{t('bionicDescription')}</p>
        </div>
        <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <h3 class="font-medium text-green-800 dark:text-green-300 mb-2">{t('benefits')}</h3>
          <ul class="text-sm text-green-700 dark:text-green-400 space-y-1">
            <li>• {t('benefit1')}</li>
            <li>• {t('benefit2')}</li>
            <li>• {t('benefit3')}</li>
          </ul>
        </div>
      </div>

      <div class="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h3 class="font-medium text-gray-900 dark:text-white mb-2">{t('htmlOutput')}</h3>
        <pre class="text-xs text-gray-600 dark:text-gray-400 overflow-x-auto whitespace-pre-wrap break-all">
          {bionicHtml || t('noOutput')}
        </pre>
      </div>
    </div>
  
