'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

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
  { value: 'none', label: 'None' },
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue.js' },
  { value: 'angular', label: 'Angular' },
  { value: 'node', label: 'Node.js' },
  { value: 'next', label: 'Next.js' },
];

const STYLE_GUIDES = [
  { value: 'none', label: 'None' },
  { value: 'airbnb', label: 'Airbnb' },
  { value: 'standard', label: 'Standard' },
  { value: 'google', label: 'Google' },
];

const COMMON_RULES = [
  { key: 'no-console', label: 'no-console', description: 'Disallow console statements' },
  { key: 'no-unused-vars', label: 'no-unused-vars', description: 'Disallow unused variables' },
  { key: 'semi', label: 'semi', description: 'Require semicolons' },
  { key: 'quotes', label: 'quotes', description: 'Enforce quote style' },
  { key: 'indent', label: 'indent', description: 'Enforce indentation' },
  { key: 'eqeqeq', label: 'eqeqeq', description: 'Require === and !==' },
  { key: 'no-var', label: 'no-var', description: 'Require let or const' },
  { key: 'prefer-const', label: 'prefer-const', description: 'Prefer const over let' },
];

export default function EslintConfigGenerator() {
  const t = useTranslations('tools.eslint-config-generator');
  const tCommon = useTranslations('tools');
  
  const [config, setConfig] = useState<EslintConfig>({
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
  
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const toggleEnv = (key: keyof typeof config.env) => {
    setConfig(prev => ({
      ...prev,
      env: { ...prev.env, [key]: !prev.env[key] },
    }));
  };

  const setRule = (key: string, value: string) => {
    setConfig(prev => ({
      ...prev,
      rules: { ...prev.rules, [key]: value },
    }));
  };

  const generateConfig = () => {
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

    setOutput(JSON.stringify(eslintConfig, null, 2));
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = () => {
    const blob = new Blob([output], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = '.eslintrc.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setConfig({
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
    setOutput('');
  };

  return (
    <div className="space-y-6">
      {/* Framework */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('framework')}
        </label>
        <select
          value={config.framework}
          onChange={(e) => setConfig(prev => ({ ...prev, framework: e.target.value }))}
          className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {FRAMEWORKS.map(fw => (
            <option key={fw.value} value={fw.value}>{fw.label}</option>
          ))}
        </select>
      </div>

      {/* Style Guide */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('styleGuide')}
        </label>
        <select
          value={config.styleGuide}
          onChange={(e) => setConfig(prev => ({ ...prev, styleGuide: e.target.value }))}
          className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {STYLE_GUIDES.map(sg => (
            <option key={sg.value} value={sg.value}>{sg.label}</option>
          ))}
        </select>
      </div>

      {/* TypeScript */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="typescript"
          checked={config.typescript}
          onChange={(e) => setConfig(prev => ({ ...prev, typescript: e.target.checked }))}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="typescript" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('typescript')}
        </label>
      </div>

      {/* Environment */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('environment')}
        </label>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={config.env.browser}
              onChange={() => toggleEnv('browser')}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Browser</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={config.env.node}
              onChange={() => toggleEnv('node')}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Node.js</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={config.env.es2021}
              onChange={() => toggleEnv('es2021')}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">ES2021</span>
          </label>
        </div>
      </div>

      {/* Rules */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('rules')}
        </label>
        <div className="space-y-2">
          {COMMON_RULES.map(rule => (
            <div key={rule.key} className="flex items-center gap-4 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex-1">
                <code className="text-sm font-mono text-blue-600 dark:text-blue-400">{rule.label}</code>
                <p className="text-xs text-gray-500 dark:text-gray-400">{rule.description}</p>
              </div>
              <select
                value={config.rules[rule.key] || 'off'}
                onChange={(e) => setRule(rule.key, e.target.value)}
                className="px-3 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-gray-100"
              >
                <option value="off">Off</option>
                <option value="warn">Warn</option>
                <option value="error">Error</option>
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-4">
        <button
          onClick={generateConfig}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-white"
        >
          {t('generate')}
        </button>
        <button
          onClick={clearAll}
          className="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg font-medium text-gray-900 dark:text-gray-100"
        >
          {tCommon('clear')}
        </button>
      </div>

      {/* Output */}
      {output && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">.eslintrc.json</label>
            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-sm text-gray-900 dark:text-gray-100"
              >
                {copied ? tCommon('copied') : tCommon('copy')}
              </button>
              <button
                onClick={downloadFile}
                className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm text-white"
              >
                {t('download')}
              </button>
            </div>
          </div>
          <pre className="w-full p-4 bg-gray-900 dark:bg-gray-950 border border-gray-700 rounded-lg font-mono text-sm text-green-400 overflow-x-auto whitespace-pre-wrap">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}
