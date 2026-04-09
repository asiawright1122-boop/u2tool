<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['eslint-config-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.eslint-config-generator.${key}`;
  }
  function tCommon(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  interface EslintConfig {
  framework: string;
  styleGuide: string;
  typescript: boolean;
  env: {
    browser: boolean;
    node: boolean;
    es2021: boolean;
  };
  rules: Record<string, string>;
}

  const FRAMEWORKS = [
    { value: 'none', label: 'Vanilla JavaScript' },
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
    { value: 'next', label: 'Next.js' },
  ] as const;

  const STYLE_GUIDES = [
    { value: 'none', label: 'ESLint Recommended' },
    { value: 'airbnb', label: 'Airbnb' },
    { value: 'standard', label: 'Standard' },
    { value: 'google', label: 'Google' },
  ] as const;

  const COMMON_RULES = [
    {
      key: 'no-console',
      label: 'no-console',
      description: 'Disallow console logs in production code',
    },
    {
      key: 'no-debugger',
      label: 'no-debugger',
      description: 'Disallow debugger statements',
    },
    {
      key: 'eqeqeq',
      label: 'eqeqeq',
      description: 'Require strict equality checks',
    },
    {
      key: 'curly',
      label: 'curly',
      description: 'Require curly braces for all control statements',
    },
    {
      key: 'semi',
      label: 'semi',
      description: 'Require semicolons',
    },
  ] as const;

  let config = $state({
    framework: 'none',
    styleGuide: 'none',
    typescript: false,
    env: {
      browser: true,
      node: false,
      es2021: true,
    },
    rules: {},
  });

  let output = $state('');

  let copied = $state(false);

  // Functions
  function toggleEnv(key: keyof typeof config.env) {
    config = ({
      ...config,
      env: { ...config.env, [key]: !config.env[key] },
    });
  }
  function setRule(key: string, value: string) {
    config = ({
      ...config,
      rules: { ...config.rules, [key]: value },
    });
  }
  function generateConfig() {
    const eslintConfig: Record<string, unknown> = {
      env: config.env,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      extends: [] as string[],
      plugins: [] as string[],
      rules: {} as Record<string, unknown>,
    };

    // Add extends based on style guide
    if (config.styleGuide === 'airbnb') {
      (eslintConfig.extends as string[]).push('airbnb');
    } else if (config.styleGuide === 'standard') {
      (eslintConfig.extends as string[]).push('standard');
    } else if (config.styleGuide === 'google') {
      (eslintConfig.extends as string[]).push('google');
    } else {
      (eslintConfig.extends as string[]).push('eslint:recommended');
    }

    // Add framework-specific config
    if (config.framework === 'react' || config.framework === 'next') {
      (eslintConfig.extends as string[]).push('plugin:react/recommended');
      (eslintConfig.plugins as string[]).push('react');
      (eslintConfig.parserOptions as Record<string, unknown>).ecmaFeatures = { jsx: true };
      (eslintConfig.rules as Record<string, unknown>)['react/react-in-jsx-scope'] = 'off';
    }

    if (config.framework === 'vue') {
      (eslintConfig.extends as string[]).push('plugin:vue/vue3-recommended');
      (eslintConfig.plugins as string[]).push('vue');
    }

    if (config.framework === 'next') {
      (eslintConfig.extends as string[]).push('next/core-web-vitals');
    }

    // Add TypeScript config
    if (config.typescript) {
      eslintConfig.parser = '@typescript-eslint/parser';
      (eslintConfig.extends as string[]).push('plugin:@typescript-eslint/recommended');
      (eslintConfig.plugins as string[]).push('@typescript-eslint');
    }

    // Add custom rules
    for (const [key, value] of Object.entries(config.rules)) {
      if (value !== 'off') {
        (eslintConfig.rules as Record<string, unknown>)[key] = value;
      }
    }

    // Clean up empty arrays
    if ((eslintConfig.plugins as string[]).length === 0) {
      delete eslintConfig.plugins;
    }

    output = JSON.stringify(eslintConfig, null, 2);
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
    link.download = '.eslintrc.json';
    link.click();
    URL.revokeObjectURL(url);
  }
  function clearAll() {
    config = {
      framework: 'none',
      styleGuide: 'none',
      typescript: false,
      env: {
        browser: true,
        node: false,
        es2021: true,
      },
      rules: {},
    };
    output = '';
  }

</script>


    <div class="space-y-6">
      <!-- Framework -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('framework')}
        </label>
        <select
          value={config.framework}
          onchange={(e) => config = ({ ...config, framework: e.target.value })}
          class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {#each FRAMEWORKS as fw (fw.value)}
<option  value={fw.value}>{fw.label}</option>
{/each}
        </select>
      </div>

      <!-- Style Guide -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('styleGuide')}
        </label>
        <select
          value={config.styleGuide}
          onchange={(e) => config = ({ ...config, styleGuide: e.target.value })}
          class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {#each STYLE_GUIDES as sg (sg.value)}
<option  value={sg.value}>{sg.label}</option>
{/each}
        </select>
      </div>

      <!-- TypeScript -->
      <div class="flex items-center gap-2">
        <input
          type="checkbox"
          id="typescript"
          checked={config.typescript}
          onchange={(e) => config = ({ ...config, typescript: e.target.checked })}
          class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
        />
        <label for="typescript" class="text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('typescript')}
        </label>
      </div>

      <!-- Environment -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('environment')}
        </label>
        <div class="flex flex-wrap gap-4">
          <label class="flex items-center gap-2">
            <input
              type="checkbox"
              checked={config.env.browser}
              onchange={() => toggleEnv('browser')}
              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <span class="text-sm text-gray-700 dark:text-gray-300">Browser</span>
          </label>
          <label class="flex items-center gap-2">
            <input
              type="checkbox"
              checked={config.env.node}
              onchange={() => toggleEnv('node')}
              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <span class="text-sm text-gray-700 dark:text-gray-300">Node.js</span>
          </label>
          <label class="flex items-center gap-2">
            <input
              type="checkbox"
              checked={config.env.es2021}
              onchange={() => toggleEnv('es2021')}
              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <span class="text-sm text-gray-700 dark:text-gray-300">ES2021</span>
          </label>
        </div>
      </div>

      <!-- Rules -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('rules')}
        </label>
        <div class="space-y-2">
          {#each COMMON_RULES as rule (rule.key)}
<div  class="flex items-center gap-4 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div class="flex-1">
                <code class="text-sm font-mono text-blue-600 dark:text-blue-400">{rule.label}</code>
                <p class="text-xs text-gray-500 dark:text-gray-400">{rule.description}</p>
              </div>
              <select
                value={config.rules[rule.key] || 'off'}
                onchange={(e) => setRule(rule.key, e.target.value)}
                class="px-3 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-gray-100"
              >
                <option value="off">Off</option>
                <option value="warn">Warn</option>
                <option value="error">Error</option>
              </select>
            </div>
{/each}
        </div>
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
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">.eslintrc.json</label>
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
  
