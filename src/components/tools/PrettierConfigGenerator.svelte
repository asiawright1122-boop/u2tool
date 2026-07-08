<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['prettier-config-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.prettier-config-generator.${key}`;
  }
  function tCommon(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  interface PrettierConfig {
  printWidth: number;
  tabWidth: number;
  useTabs: boolean;
  semi: boolean;
  singleQuote: boolean;
  trailingComma: 'none' | 'es5' | 'all';
  bracketSpacing: boolean;
  bracketSameLine: boolean;
  arrowParens: 'avoid' | 'always';
  endOfLine: 'lf' | 'crlf' | 'cr' | 'auto';
  proseWrap: 'always' | 'never' | 'preserve';
  htmlWhitespaceSensitivity: 'css' | 'strict' | 'ignore';
}

  let config = $state({
    printWidth: 80,
    tabWidth: 2,
    useTabs: false,
    semi: true,
    singleQuote: false,
    trailingComma: 'es5',
    bracketSpacing: true,
    bracketSameLine: false,
    arrowParens: 'always',
    endOfLine: 'lf',
    proseWrap: 'preserve',
    htmlWhitespaceSensitivity: 'css',
  });

  let output = $state('');

  let copied = $state(false);

  // Functions
  function generateConfig() {
    const prettierConfig: Record<string, unknown> = {};
    
    // Only include non-default values
    if (config.printWidth !== 80) prettierConfig.printWidth = config.printWidth;
    if (config.tabWidth !== 2) prettierConfig.tabWidth = config.tabWidth;
    if (config.useTabs) prettierConfig.useTabs = config.useTabs;
    if (!config.semi) prettierConfig.semi = config.semi;
    if (config.singleQuote) prettierConfig.singleQuote = config.singleQuote;
    if (config.trailingComma !== 'es5') prettierConfig.trailingComma = config.trailingComma;
    if (!config.bracketSpacing) prettierConfig.bracketSpacing = config.bracketSpacing;
    if (config.bracketSameLine) prettierConfig.bracketSameLine = config.bracketSameLine;
    if (config.arrowParens !== 'always') prettierConfig.arrowParens = config.arrowParens;
    if (config.endOfLine !== 'lf') prettierConfig.endOfLine = config.endOfLine;
    if (config.proseWrap !== 'preserve') prettierConfig.proseWrap = config.proseWrap;
    if (config.htmlWhitespaceSensitivity !== 'css') prettierConfig.htmlWhitespaceSensitivity = config.htmlWhitespaceSensitivity;

    // If all defaults, show full config
    if (Object.keys(prettierConfig).length === 0) {
      prettierConfig.printWidth = config.printWidth;
      prettierConfig.tabWidth = config.tabWidth;
      prettierConfig.useTabs = config.useTabs;
      prettierConfig.semi = config.semi;
      prettierConfig.singleQuote = config.singleQuote;
      prettierConfig.trailingComma = config.trailingComma;
      prettierConfig.bracketSpacing = config.bracketSpacing;
      prettierConfig.bracketSameLine = config.bracketSameLine;
      prettierConfig.arrowParens = config.arrowParens;
      prettierConfig.endOfLine = config.endOfLine;
      prettierConfig.proseWrap = config.proseWrap;
      prettierConfig.htmlWhitespaceSensitivity = config.htmlWhitespaceSensitivity;
    }

    output = JSON.stringify(prettierConfig, null, 2);
  }
  async function copyToClipboard() {
    await navigator.clipboard.writeText(output);
    copied = true;
    setTimeout(() => copied = false, 2000);
  }
  function downloadFile() {
    const blob = new Blob([output], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = '.prettierrc';
    link.click();
    URL.revokeObjectURL(url);
  }
  function clearAll() {
    config = {
      printWidth: 80,
      tabWidth: 2,
      useTabs: false,
      semi: true,
      singleQuote: false,
      trailingComma: 'es5',
      bracketSpacing: true,
      bracketSameLine: false,
      arrowParens: 'always',
      endOfLine: 'lf',
      proseWrap: 'preserve',
      htmlWhitespaceSensitivity: 'css',
    };
    output = '';
  }

</script>


    <div class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Print Width -->
        <div>
          <label for="prettier-print-width" class="tool-label">
            {t('printWidth')}
          </label>
          <input
            id="prettier-print-width"
            name="printWidth"
            type="number"
            value={config.printWidth}
            onchange={(e) => config = ({ ...config, printWidth: parseInt(e.target.value) || 80 })}
            class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>

        <!-- Tab Width -->
        <div>
          <label for="prettier-tab-width" class="tool-label">
            {t('tabWidth')}
          </label>
          <input
            id="prettier-tab-width"
            name="tabWidth"
            type="number"
            value={config.tabWidth}
            onchange={(e) => config = ({ ...config, tabWidth: parseInt(e.target.value) || 2 })}
            class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>

        <!-- Trailing Comma -->
        <div>
          <label for="prettier-trailing-comma" class="tool-label">
            {t('trailingComma')}
          </label>
          <select
            id="prettier-trailing-comma"
            name="trailingComma"
            value={config.trailingComma}
            onchange={(e) => config = ({ ...config, trailingComma: e.target.value as 'none' | 'es5' | 'all' })}
            class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            <option value="none">None</option>
            <option value="es5">ES5</option>
            <option value="all">All</option>
          </select>
        </div>

        <!-- Arrow Parens -->
        <div>
          <label for="prettier-arrow-parens" class="tool-label">
            {t('arrowParens')}
          </label>
          <select
            id="prettier-arrow-parens"
            name="arrowParens"
            value={config.arrowParens}
            onchange={(e) => config = ({ ...config, arrowParens: e.target.value as 'avoid' | 'always' })}
            class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            <option value="always">Always</option>
            <option value="avoid">Avoid</option>
          </select>
        </div>

        <!-- End of Line -->
        <div>
          <label for="prettier-end-of-line" class="tool-label">
            {t('endOfLine')}
          </label>
          <select
            id="prettier-end-of-line"
            name="endOfLine"
            value={config.endOfLine}
            onchange={(e) => config = ({ ...config, endOfLine: e.target.value as 'lf' | 'crlf' | 'cr' | 'auto' })}
            class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            <option value="lf">LF (Unix)</option>
            <option value="crlf">CRLF (Windows)</option>
            <option value="cr">CR</option>
            <option value="auto">Auto</option>
          </select>
        </div>

        <!-- Prose Wrap -->
        <div>
          <label for="prettier-prose-wrap" class="tool-label">
            {t('proseWrap')}
          </label>
          <select
            id="prettier-prose-wrap"
            name="proseWrap"
            value={config.proseWrap}
            onchange={(e) => config = ({ ...config, proseWrap: e.target.value as 'always' | 'never' | 'preserve' })}
            class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            <option value="preserve">Preserve</option>
            <option value="always">Always</option>
            <option value="never">Never</option>
          </select>
        </div>

        <!-- HTML Whitespace Sensitivity -->
        <div>
          <label for="prettier-html-whitespace-sensitivity" class="tool-label">
            {t('htmlWhitespaceSensitivity')}
          </label>
          <select
            id="prettier-html-whitespace-sensitivity"
            name="htmlWhitespaceSensitivity"
            value={config.htmlWhitespaceSensitivity}
            onchange={(e) => config = ({ ...config, htmlWhitespaceSensitivity: e.target.value as 'css' | 'strict' | 'ignore' })}
            class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            <option value="css">CSS</option>
            <option value="strict">Strict</option>
            <option value="ignore">Ignore</option>
          </select>
        </div>
      </div>

      <!-- Boolean Options -->
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
        <label for="prettier-use-tabs" class="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <input
            id="prettier-use-tabs"
            name="useTabs"
            type="checkbox"
            checked={config.useTabs}
            onchange={(e) => config = ({ ...config, useTabs: e.target.checked })}
            class="w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500"
          />
          <span class="text-sm text-gray-700 dark:text-gray-300">{t('useTabs')}</span>
        </label>

        <label for="prettier-semi" class="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <input
            id="prettier-semi"
            name="semi"
            type="checkbox"
            checked={config.semi}
            onchange={(e) => config = ({ ...config, semi: e.target.checked })}
            class="w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500"
          />
          <span class="text-sm text-gray-700 dark:text-gray-300">{t('semi')}</span>
        </label>

        <label for="prettier-single-quote" class="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <input
            id="prettier-single-quote"
            name="singleQuote"
            type="checkbox"
            checked={config.singleQuote}
            onchange={(e) => config = ({ ...config, singleQuote: e.target.checked })}
            class="w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500"
          />
          <span class="text-sm text-gray-700 dark:text-gray-300">{t('singleQuote')}</span>
        </label>

        <label for="prettier-bracket-spacing" class="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <input
            id="prettier-bracket-spacing"
            name="bracketSpacing"
            type="checkbox"
            checked={config.bracketSpacing}
            onchange={(e) => config = ({ ...config, bracketSpacing: e.target.checked })}
            class="w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500"
          />
          <span class="text-sm text-gray-700 dark:text-gray-300">{t('bracketSpacing')}</span>
        </label>

        <label for="prettier-bracket-same-line" class="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <input
            id="prettier-bracket-same-line"
            name="bracketSameLine"
            type="checkbox"
            checked={config.bracketSameLine}
            onchange={(e) => config = ({ ...config, bracketSameLine: e.target.checked })}
            class="w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500"
          />
          <span class="text-sm text-gray-700 dark:text-gray-300">{t('bracketSameLine')}</span>
        </label>
      </div>

      <!-- Actions -->
      <div class="flex justify-center gap-4">
        <button
          onclick={generateConfig}
          class="px-6 py-2 bg-amber-600 hover:bg-amber-700 rounded-lg font-medium text-white"
        >
          {t('generate')}
        </button>
        <button
          onclick={clearAll}
          class="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg font-medium text-gray-900 dark:text-gray-100"
        >
          {tCommon('clear')}
        </button>
      </div>

      <!-- Output -->
      {#if output}
<div>
          <div class="flex justify-between items-center mb-2">
            <div class="text-sm font-medium text-gray-700 dark:text-gray-300">.prettierrc</div>
            <div class="flex gap-2">
              <button
                onclick={copyToClipboard}
                class="px-3 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-sm text-gray-900 dark:text-gray-100"
              >
                {copied ? tCommon('copied') : tCommon('copy')}
              </button>
              <button
                onclick={downloadFile}
                class="px-3 py-1 bg-emerald-500 hover:bg-green-700 rounded text-sm text-white"
              >
                {t('download')}
              </button>
            </div>
          </div>
          <pre class="w-full p-4 bg-gray-900 dark:bg-gray-950 border border-gray-700 rounded-lg font-mono text-sm text-green-400 overflow-x-auto whitespace-pre-wrap">
            {output}
          </pre>
        </div>
{/if}
    </div>
  
