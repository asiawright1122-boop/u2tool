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
      prettierConfig.arrowParens = config.arrowParens;
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
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('printWidth')}
          </label>
          <input
            type="number"
            value={config.printWidth}
            onchange={(e) => config = ({ ...config, printWidth: parseInt(e.target.value) || 80 })}
            class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <!-- Tab Width -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('tabWidth')}
          </label>
          <input
            type="number"
            value={config.tabWidth}
            onchange={(e) => config = ({ ...config, tabWidth: parseInt(e.target.value) || 2 })}
            class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <!-- Trailing Comma -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('trailingComma')}
          </label>
          <select
            value={config.trailingComma}
            onchange={(e) => config = ({ ...config, trailingComma: e.target.value as 'none' | 'es5' | 'all' })}
            class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="none">None</option>
            <option value="es5">ES5</option>
            <option value="all">All</option>
          </select>
        </div>

        <!-- Arrow Parens -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('arrowParens')}
          </label>
          <select
            value={config.arrowParens}
            onchange={(e) => config = ({ ...config, arrowParens: e.target.value as 'avoid' | 'always' })}
            class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="always">Always</option>
            <option value="avoid">Avoid</option>
          </select>
        </div>

        <!-- End of Line -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('endOfLine')}
          </label>
          <select
            value={config.endOfLine}
            onchange={(e) => config = ({ ...config, endOfLine: e.target.value as 'lf' | 'crlf' | 'cr' | 'auto' })}
            class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="lf">LF (Unix)</option>
            <option value="crlf">CRLF (Windows)</option>
            <option value="cr">CR</option>
            <option value="auto">Auto</option>
          </select>
        </div>

        <!-- Prose Wrap -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('proseWrap')}
          </label>
          <select
            value={config.proseWrap}
            onchange={(e) => config = ({ ...config, proseWrap: e.target.value as 'always' | 'never' | 'preserve' })}
            class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="preserve">Preserve</option>
            <option value="always">Always</option>
            <option value="never">Never</option>
          </select>
        </div>
      </div>

      <!-- Boolean Options -->
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
        <label class="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <input
            type="checkbox"
            checked={config.useTabs}
            onchange={(e) => config = ({ ...config, useTabs: e.target.checked })}
            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          />
          <span class="text-sm text-gray-700 dark:text-gray-300">{t('useTabs')}</span>
        </label>

        <label class="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <input
            type="checkbox"
            checked={config.semi}
            onchange={(e) => config = ({ ...config, semi: e.target.checked })}
            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          />
          <span class="text-sm text-gray-700 dark:text-gray-300">{t('semi')}</span>
        </label>

        <label class="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <input
            type="checkbox"
            checked={config.singleQuote}
            onchange={(e) => config = ({ ...config, singleQuote: e.target.checked })}
            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          />
          <span class="text-sm text-gray-700 dark:text-gray-300">{t('singleQuote')}</span>
        </label>

        <label class="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <input
            type="checkbox"
            checked={config.bracketSpacing}
            onchange={(e) => config = ({ ...config, bracketSpacing: e.target.checked })}
            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          />
          <span class="text-sm text-gray-700 dark:text-gray-300">{t('bracketSpacing')}</span>
        </label>

        <label class="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <input
            type="checkbox"
            checked={config.bracketSameLine}
            onchange={(e) => config = ({ ...config, bracketSameLine: e.target.checked })}
            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          />
          <span class="text-sm text-gray-700 dark:text-gray-300">{t('bracketSameLine')}</span>
        </label>
      </div>

      <!-- Actions -->
      <div class="flex justify-center gap-4">
        <button
          onclick={generateConfig}
          class="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-white"
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
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">.prettierrc</label>
            <div class="flex gap-2">
              <button
                onclick={copyToClipboard}
                class="px-3 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-sm text-gray-900 dark:text-gray-100"
              >
                {copied ? tCommon('copied') : tCommon('copy')}
              </button>
              <button
                onclick={downloadFile}
                class="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm text-white"
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
  
