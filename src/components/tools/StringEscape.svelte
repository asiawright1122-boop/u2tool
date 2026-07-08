<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['stringEscape'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.stringEscape.${key}`;
  }
  function tg(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  let input = $state('');

  let output = $state('');

  let format = $state('json');

  // Functions
  function escape() {
    if (!input) {
      output = '';
      return;
    }

    let result = '';
    switch (format) {
      case 'json':
        result = JSON.stringify(input).slice(1, -1);
        break;
      case 'html':
        result = input
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;');
        break;
      case 'url':
        result = encodeURIComponent(input);
        break;
      case 'js':
        result = input
          .replace(/\\/g, '\\\\')
          .replace(/'/g, "\\'")
          .replace(/"/g, '\\"')
          .replace(/\n/g, '\\n')
          .replace(/\r/g, '\\r')
          .replace(/\t/g, '\\t');
        break;
    }
    output = result;
  }
  function unescape() {
    if (!input) {
      output = '';
      return;
    }

    let result = '';
    try {
      switch (format) {
        case 'json':
          result = JSON.parse(`"${input}"`);
          break;
        case 'html':
          const doc = new DOMParser().parseFromString(input, 'text/html');
          result = doc.documentElement.textContent || '';
          break;
        case 'url':
          result = decodeURIComponent(input);
          break;
        case 'js':
          result = input
            .replace(/\\n/g, '\n')
            .replace(/\\r/g, '\r')
            .replace(/\\t/g, '\t')
            .replace(/\\"/g, '"')
            .replace(/\\'/g, "'")
            .replace(/\\\\/g, '\\');
          break;
      }
    } catch {
      result = t('error');
    }
    output = result;
  }
  function copyOutput() {
    navigator.clipboard.writeText(output);
  }

</script>


    <div class="space-y-4">
      <div class="flex gap-2 flex-wrap items-center">
        <select
          value={format}
          onchange={(e) => format = e.target.value as typeof format}
          class="bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
        >
          <option value="json">JSON</option>
          <option value="html">HTML</option>
          <option value="url">URL</option>
          <option value="js">JavaScript</option>
        </select>
        <button
          onclick={escape}
          class="px-4 py-2 bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors text-white"
        >
          {t('escape')}
        </button>
        <button
          onclick={unescape}
          class="px-4 py-2 bg-emerald-500 hover:bg-green-700 rounded-lg transition-colors text-white"
        >
          {t('unescape')}
        </button>
        <button
          onclick={copyOutput}
          disabled={!output}
          class="px-4 py-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-700 disabled:opacity-50 rounded-lg transition-colors text-gray-900 dark:text-white"
        >
          {tg('copy')}
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label for="string-escape-field-4" class="block text-sm text-gray-600 dark:text-gray-300 mb-2">{tg('input')}</label>
          <textarea
            bind:value={input}
            class="w-full h-64 bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none resize-none"
            placeholder={t('placeholder')} id="string-escape-field-4"></textarea>
        </div>

        <div>
          <label for="string-escape-field-3" class="block text-sm text-gray-600 dark:text-gray-300 mb-2">{tg('output')}</label>
          <textarea
            value={output}
            readOnly
            class="w-full h-64 bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none resize-none" id="string-escape-field-3"></textarea>
        </div>
      </div>
    </div>
  
