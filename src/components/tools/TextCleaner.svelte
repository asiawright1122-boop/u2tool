<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['text-cleaner'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.text-cleaner.${key}`;
  }

  let input = $state('');

  let options = $state({
    trim: true,
    removeEmptyLines: true,
    removeDuplicateLines: false,
    removeExtraSpaces: true,
    removeHtml: false,
    removePunctuation: false,
    lowercase: false,
    uppercase: false,
  });

  // Functions
  function clean() {
    let result = input;

    if (options.removeHtml) {
      result = result.replace(/<[^>]*>/g, '');
    }

    if (options.removePunctuation) {
      result = result.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '');
    }

    if (options.removeExtraSpaces) {
      result = result.replace(/\s+/g, ' ');
    }

    let lines = result.split('\n');

    if (options.trim) {
      lines = lines.map((line: string) => line.trim());
    }

    if (options.removeEmptyLines) {
      lines = lines.filter((line: string) => line.length > 0);
    }

    if (options.removeDuplicateLines) {
      lines = [...new Set(lines)];
    }

    result = lines.join('\n');

    if (options.lowercase) {
      result = result.toLowerCase();
    } else if (options.uppercase) {
      result = result.toUpperCase();
    }

    return result;
  }
  function handleOptionChange(key: keyof typeof options) {
    options = (prev: typeof options) => {
      const newOptions = { ...prev, [key]: !prev[key] };
      // Ensure lowercase and uppercase are mutually exclusive
      if (key === 'lowercase' && newOptions.lowercase) newOptions.uppercase = false;
      if (key === 'uppercase' && newOptions.uppercase) newOptions.lowercase = false;
      return newOptions;
    };
  }
  const output = clean();

</script>


    <div class="max-w-4xl mx-auto space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="md:col-span-2 space-y-6">
          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="block text-sm font-medium text-gray-600 dark:text-gray-300">{t('input')}</label>
              <button
                onclick={() => input = ''}
                class="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
              >
                {t('clear')}
              </button>
            </div>
            <textarea
              bind:value={input}
              rows={8}
              class="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 font-mono"
              placeholder={t('placeholder')}></textarea>
          </div>

          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="block text-sm font-medium text-gray-600 dark:text-gray-300">{t('cleanedText')}</label>
              <button
                onclick={() => navigator.clipboard.writeText(output)}
                class="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                {t('copyResult')}
              </button>
            </div>
            <textarea
              readOnly
              value={output}
              rows={8}
              class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-green-600 dark:text-green-400 font-mono"></textarea>
          </div>
        </div>

        <div class="space-y-4">
          <div class="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">{t('options')}</h3>
            <div class="space-y-3">
              <label class="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.trim}
                  onchange={() => handleOptionChange('trim')}
                  class="form-checkbox h-4 w-4 text-blue-600 rounded bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                />
                <span class="text-gray-600 dark:text-gray-300 text-sm">{t('trimLines')}</span>
              </label>
              <label class="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.removeEmptyLines}
                  onchange={() => handleOptionChange('removeEmptyLines')}
                  class="form-checkbox h-4 w-4 text-blue-600 rounded bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                />
                <span class="text-gray-600 dark:text-gray-300 text-sm">{t('removeEmptyLines')}</span>
              </label>
              <label class="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.removeDuplicateLines}
                  onchange={() => handleOptionChange('removeDuplicateLines')}
                  class="form-checkbox h-4 w-4 text-blue-600 rounded bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                />
                <span class="text-gray-600 dark:text-gray-300 text-sm">{t('removeDuplicateLines')}</span>
              </label>
              <label class="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.removeExtraSpaces}
                  onchange={() => handleOptionChange('removeExtraSpaces')}
                  class="form-checkbox h-4 w-4 text-blue-600 rounded bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                />
                <span class="text-gray-600 dark:text-gray-300 text-sm">{t('removeExtraSpaces')}</span>
              </label>
              <label class="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.removeHtml}
                  onchange={() => handleOptionChange('removeHtml')}
                  class="form-checkbox h-4 w-4 text-blue-600 rounded bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                />
                <span class="text-gray-600 dark:text-gray-300 text-sm">{t('removeHtmlTags')}</span>
              </label>
              <label class="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.removePunctuation}
                  onchange={() => handleOptionChange('removePunctuation')}
                  class="form-checkbox h-4 w-4 text-blue-600 rounded bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                />
                <span class="text-gray-600 dark:text-gray-300 text-sm">{t('removePunctuation')}</span>
              </label>
              <div class="pt-2 border-t border-gray-200 dark:border-gray-700">
                <label class="flex items-center space-x-3 cursor-pointer mb-2">
                  <input
                    type="checkbox"
                    checked={options.lowercase}
                    onchange={() => handleOptionChange('lowercase')}
                    class="form-checkbox h-4 w-4 text-blue-600 rounded bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                  />
                  <span class="text-gray-600 dark:text-gray-300 text-sm">{t('lowercase')}</span>
                </label>
                <label class="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={options.uppercase}
                    onchange={() => handleOptionChange('uppercase')}
                    class="form-checkbox h-4 w-4 text-blue-600 rounded bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                  />
                  <span class="text-gray-600 dark:text-gray-300 text-sm">{t('uppercase')}</span>
                </label>
              </div>
            </div>
          </div>
          
          <div class="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
             <div class="text-sm text-gray-600 dark:text-gray-300">
                <div class="flex justify-between mb-1">
                  <span>{t('characters')}:</span>
                  <span class="text-gray-900 dark:text-white">{output.length}</span>
                </div>
                <div class="flex justify-between">
                  <span>{t('lines')}:</span>
                  <span class="text-gray-900 dark:text-white">{output ? output.split('\n').length : 0}</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  
