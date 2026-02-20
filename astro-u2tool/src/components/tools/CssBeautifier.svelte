<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['cssBeautifier'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.cssBeautifier.${key}`;
  }

  let input = $state('');

  let output = $state('');

  let indentSize = $state(2);

  // Functions
  function beautify() {
    if (!input.trim()) {
      output = '';
      return;
    }

    try {
      let css = input;
      const indent = ' '.repeat(indentSize);
      
      // Remove existing formatting
      css = css.replace(/\s+/g, ' ');
      css = css.replace(/\s*{\s*/g, ' {\n');
      css = css.replace(/\s*}\s*/g, '\n}\n\n');
      css = css.replace(/\s*;\s*/g, ';\n');
      
      // Add proper indentation
      const lines = css.split('\n');
      let level = 0;
      const formatted: string[] = [];
      
      for (let line of lines) {
        line = line.trim();
        if (!line) continue;
        
        if (line.includes('}')) {
          level = Math.max(0, level - 1);
        }
        
        if (line.includes('{')) {
          formatted.push(indent.repeat(level) + line);
          level++;
        } else if (line === '}') {
          formatted.push(indent.repeat(level) + line);
        } else {
          formatted.push(indent.repeat(level) + line);
        }
      }
      
      output = formatted.join('\n').replace(/\n{3,}/g, '\n\n').trim();
    } catch {
      output = t('error');
    }
  }
  function minify() {
    if (!input.trim()) {
      output = '';
      return;
    }

    try {
      let css = input;
      // Remove comments
      css = css.replace(/\/\*[\s\S]*?\*\//g, '');
      // Remove whitespace
      css = css.replace(/\s+/g, ' ');
      css = css.replace(/\s*([{}:;,])\s*/g, '$1');
      css = css.replace(/;}/g, '}');
      output = css.trim();
    } catch {
      output = t('error');
    }
  }
  function copyOutput() {
    navigator.clipboard.writeText(output);
  }

</script>


    <div class="space-y-4">
      <div class="flex flex-wrap gap-2 items-center">
        <div class="flex items-center gap-2">
          <label class="text-sm text-gray-600 dark:text-gray-300">{t('indent')}:</label>
          <select
            value={indentSize}
            onchange={(e) => indentSize = Number(e.target.value)}
            class="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded px-2 py-1 text-sm"
          >
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
            <option value={1}>1 tab</option>
          </select>
        </div>
        <button
          onclick={beautify}
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          {t('beautify')}
        </button>
        <button
          onclick={minify}
          class="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
        >
          {t('minify')}
        </button>
        <button
          onclick={copyOutput}
          disabled={!output}
          class="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 disabled:opacity-50 rounded-lg transition-colors"
        >
          {t('copy')}
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm text-gray-600 dark:text-gray-300 mb-2">{t('input')}</label>
          <textarea
            bind:value={input}
            class="w-full h-80 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
            placeholder={t('placeholder')}
            spellCheck={false}></textarea>
        </div>

        <div>
          <label class="block text-sm text-gray-600 dark:text-gray-300 mb-2">{t('output')}</label>
          <textarea
            value={output}
            readOnly
            class="w-full h-80 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
            placeholder={t('outputPlaceholder')}></textarea>
        </div>
      </div>
    </div>
  
