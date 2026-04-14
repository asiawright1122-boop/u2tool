<script lang="ts">
  import { K, SAMPLE_TEXT, formatDocument } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['document-formatter'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.document-formatter.${key}`;
  }
  function tCommon(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  interface FormatOptions {
  trimLines: boolean;
  removeExtraSpaces: boolean;
  removeBlankLines: boolean;
  normalizeLineBreaks: boolean;
  capitalizeFirst: boolean;
  fixPunctuation: boolean;
  lineWidth: number;
  indentStyle: 'none' | 'spaces' | 'tabs';
  indentSize: number;
}

  let input = $state(SAMPLE_TEXT);

  let options = $state({
    trimLines: true,
    removeExtraSpaces: true,
    removeBlankLines: true,
    normalizeLineBreaks: true,
    capitalizeFirst: true,
    fixPunctuation: true,
    lineWidth: 0,
    indentStyle: 'none',
    indentSize: 4,
  });

  let copied = $state(false);

  let output = $derived(formatDocument(input, options));

  function handleCopy() {
    navigator.clipboard.writeText(output);
    copied = true;
    setTimeout(() => copied = false, 2000);
  }

  function updateOption(key: K, value: FormatOptions[K]) {
    options = ({ ...options, [key]: value });
  }

</script>


    <div class="space-y-6">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <label class="flex items-center gap-2">
          <input type="checkbox" checked={options.trimLines} onchange={(e) => updateOption('trimLines', e.target.checked)} class="rounded" />
          <span class="text-sm text-gray-700 dark:text-gray-300">{t('trimLines')}</span>
        </label>
        <label class="flex items-center gap-2">
          <input type="checkbox" checked={options.removeExtraSpaces} onchange={(e) => updateOption('removeExtraSpaces', e.target.checked)} class="rounded" />
          <span class="text-sm text-gray-700 dark:text-gray-300">{t('removeExtraSpaces')}</span>
        </label>
        <label class="flex items-center gap-2">
          <input type="checkbox" checked={options.removeBlankLines} onchange={(e) => updateOption('removeBlankLines', e.target.checked)} class="rounded" />
          <span class="text-sm text-gray-700 dark:text-gray-300">{t('removeBlankLines')}</span>
        </label>
        <label class="flex items-center gap-2">
          <input type="checkbox" checked={options.normalizeLineBreaks} onchange={(e) => updateOption('normalizeLineBreaks', e.target.checked)} class="rounded" />
          <span class="text-sm text-gray-700 dark:text-gray-300">{t('normalizeLineBreaks')}</span>
        </label>
        <label class="flex items-center gap-2">
          <input type="checkbox" checked={options.capitalizeFirst} onchange={(e) => updateOption('capitalizeFirst', e.target.checked)} class="rounded" />
          <span class="text-sm text-gray-700 dark:text-gray-300">{t('capitalizeSentences')}</span>
        </label>
        <label class="flex items-center gap-2">
          <input type="checkbox" checked={options.fixPunctuation} onchange={(e) => updateOption('fixPunctuation', e.target.checked)} class="rounded" />
          <span class="text-sm text-gray-700 dark:text-gray-300">{t('fixPunctuation')}</span>
        </label>
        <div>
          <label class="block text-xs text-gray-500 mb-1">{t('lineWidth')}</label>
          <input
            type="number"
            value={options.lineWidth}
            onchange={(e) => updateOption('lineWidth', parseInt(e.target.value) || 0)}
            min={0}
            max={200}
            class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-1">{t('indentStyle')}</label>
          <select
            value={options.indentStyle}
            onchange={(e) => updateOption('indentStyle', e.target.value as FormatOptions['indentStyle'])}
            class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="none">{t('none')}</option>
            <option value="spaces">{t('spaces')}</option>
            <option value="tabs">{t('tabs')}</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label class="tool-label">
            {t('inputText')}
          </label>
          <textarea
            bind:value={input}
            placeholder={t("inputPlaceholder")}
            rows={14}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm resize-none"></textarea>
        </div>

        <div>
          <div class="flex justify-between items-center mb-2">
            <label class="tool-label">
              {t('formattedOutput')}
            </label>
            <button
              onclick={handleCopy}
              class="text-sm text-amber-600 hover:text-amber-700 dark:text-amber-400"
            >
              {copied ? tCommon('copied') : tCommon('copy')}
            </button>
          </div>
          <textarea
            value={output}
            readOnly
            rows={14}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-sm resize-none"></textarea>
        </div>
      </div>
    </div>
  
