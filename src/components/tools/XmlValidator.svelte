<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string, vars?: Record<string, string | number>): string {
    const scope = translations['tools']['xml-validator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    if (typeof value !== 'string') return `MISSING: tools.xml-validator.${key}`;
    if (!vars) return value;
    return Object.entries(vars).reduce(
      (result, [varKey, varValue]) => result.replace(`{${varKey}}`, String(varValue)),
      value
    );
  }

  let input = $state('');

  let result = $state(null);

  // Functions
  function validate() {
    if (!input.trim()) {
      result = { valid: false, error: 'Input is empty' };
      return;
    }

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(input, 'application/xml');
      const parseError = doc.querySelector('parsererror');

      if (parseError) {
        const errorText = parseError.textContent || '';
        const lineMatch = errorText.match(/line (\d+)/i);
        const columnMatch = errorText.match(/column (\d+)/i);

        result = {
          valid: false,
          error: errorText.split('\n')[0],
          lineNumber: lineMatch ? parseInt(lineMatch[1]) : undefined,
          columnNumber: columnMatch ? parseInt(columnMatch[1]) : undefined,
        };
      } else {
        result = { valid: true };
      }
    } catch (e) {
      result = {
        valid: false,
        error: (e as Error).message,
      };
    }
  }
  function formatXml() {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(input, 'application/xml');
      const parseError = doc.querySelector('parsererror');

      if (parseError) {
        validate();
        return;
      }

      const serializer = new XMLSerializer();
      let formatted = serializer.serializeToString(doc);

      // Simple formatting
      formatted = formatted
        .replace(/></g, '>\n<')
        .split('\n')
        .map((line, i, arr) => {
          const indent = (line.match(/<\//) ? -1 : 0) + (arr.slice(0, i).filter(l => l.match(/<[^/!?]/) && !l.match(/\/>/)).length - arr.slice(0, i).filter(l => l.match(/<\//)).length);
          return '  '.repeat(Math.max(0, indent)) + line.trim();
        })
        .join('\n');

      input = formatted;
      result = { valid: true };
    } catch (e) {
      result = {
        valid: false,
        error: (e as Error).message,
      };
    }
  }
  function loadExample() {
    const example = `<?xml version="1.0" encoding="UTF-8"?>
<catalog>
  <book id="bk101">
    <author>Gambardella, Matthew</author>
    <title>XML Developer's Guide</title>
    <genre>Computer</genre>
    <price>44.95</price>
    <publish_date>2000-10-01</publish_date>
    <description>An in-depth look at creating applications with XML.</description>
  </book>
  <book id="bk102">
    <author>Ralls, Kim</author>
    <title>Midnight Rain</title>
    <genre>Fantasy</genre>
    <price>5.95</price>
    <publish_date>2000-12-16</publish_date>
    <description>A former architect battles corporate zombies.</description>
  </book>
</catalog>`;
    input = example;
    result = null;
  }

</script>


    <div class="space-y-6">
      <div>
        <label for="xml-validator-field-2" class="tool-label">
          {t('xmlInput')}
        </label>
        <textarea
          value={input}
          onchange={(e) => {
            input = e.target.value;
            result = null;
          }}
          placeholder={t('placeholder')}
          class="w-full h-80 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm" id="xml-validator-field-2"></textarea>
      </div>

      <div class="flex gap-4 flex-wrap">
        <button
          onclick={validate}
          class="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
        >
          {t('validate')}
        </button>
        <button
          onclick={formatXml}
          class="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
        >
          {t('format')}
        </button>
        <button
          onclick={loadExample}
          class="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
        >
          {t('loadExample')}
        </button>
      </div>

      {#if result}
<div class={`p-6 rounded-xl ${
          result.valid
            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
            : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
        }`}>
          <div class="flex items-center gap-3 mb-4">
            <span class={`text-3xl ${result.valid ? 'text-green-500' : 'text-red-500'}`}>
              {result.valid ? '✓' : '✗'}
            </span>
            <span class={`text-xl font-semibold ${
              result.valid ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
            }`}>
              {result.valid ? t('valid') : t('invalid')}
            </span>
          </div>

          {#if result.error}
<div class="space-y-2">
              <p class="text-red-600 dark:text-red-400 font-mono text-sm">{result.error}</p>
              {#if result.lineNumber || result.columnNumber}
<p class="text-sm text-red-500 dark:text-red-400">
                  {#if result.lineNumber}
{t('errorLine', { line: result.lineNumber })}
{/if}
                  {#if result.lineNumber}
{result.columnNumber ? ', ' : ''}
{/if}
                  {#if result.columnNumber}
{t('errorColumn', { column: result.columnNumber })}
{/if}
                </p>
{/if}
            </div>
{/if}

          {#if result.valid}
<p class="text-green-600 dark:text-green-400">
              {t('validMessage')}
            </p>
{/if}
        </div>
{/if}
    </div>
  
