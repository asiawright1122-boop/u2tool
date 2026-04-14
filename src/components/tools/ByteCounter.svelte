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

  let text = $state('');

  // Functions
  function getByteLength(str: string, encoding: string): number {
    if (encoding === 'utf8') {
      return new TextEncoder().encode(str).length;
    } else if (encoding === 'utf16') {
      return str.length * 2;
    } else if (encoding === 'ascii') {
      return str.length;
    }
    return 0;
  }
  const utf8Bytes = getByteLength(text, 'utf8');
  const utf16Bytes = getByteLength(text, 'utf16');
  const asciiBytes = getByteLength(text, 'ascii');
  const charCount = text.length;
  const lineCount = text ? text.split('\n').length : 0;

</script>


    <div class="space-y-4">
      <div>
        <label class="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('input')}</label>
        <textarea
          bind:value={text}
          class="w-full h-40 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded p-3 text-gray-900 dark:text-white font-mono text-sm"
          placeholder={t('byteCounter.placeholder')}></textarea>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div class="bg-gray-100 dark:bg-gray-800 rounded p-4 text-center">
          <div class="text-2xl font-bold text-amber-600 dark:text-amber-400">{charCount}</div>
          <div class="text-sm text-gray-600 dark:text-gray-300">{t('byteCounter.characters')}</div>
        </div>
        <div class="bg-gray-100 dark:bg-gray-800 rounded p-4 text-center">
          <div class="text-2xl font-bold text-green-600 dark:text-green-400">{utf8Bytes}</div>
          <div class="text-sm text-gray-600 dark:text-gray-300">UTF-8 {t('byteCounter.bytes')}</div>
        </div>
        <div class="bg-gray-100 dark:bg-gray-800 rounded p-4 text-center">
          <div class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{utf16Bytes}</div>
          <div class="text-sm text-gray-600 dark:text-gray-300">UTF-16 {t('byteCounter.bytes')}</div>
        </div>
        <div class="bg-gray-100 dark:bg-gray-800 rounded p-4 text-center">
          <div class="text-2xl font-bold text-slate-600 dark:text-slate-400">{asciiBytes}</div>
          <div class="text-sm text-gray-600 dark:text-gray-300">ASCII {t('byteCounter.bytes')}</div>
        </div>
        <div class="bg-gray-100 dark:bg-gray-800 rounded p-4 text-center">
          <div class="text-2xl font-bold text-pink-600 dark:text-pink-400">{lineCount}</div>
          <div class="text-sm text-gray-600 dark:text-gray-300">{t('byteCounter.lines')}</div>
        </div>
        <div class="bg-gray-100 dark:bg-gray-800 rounded p-4 text-center">
          <div class="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {utf8Bytes > 1024 ? (utf8Bytes / 1024).toFixed(2) + ' KB' : utf8Bytes + ' B'}
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-300">{t('byteCounter.size')}</div>
        </div>
      </div>
    </div>
  
