'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

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

export default function PrettierConfigGenerator() {
  const t = useTranslations('tools.prettier-config-generator');
  const tCommon = useTranslations('tools');
  
  const [config, setConfig] = useState<PrettierConfig>({
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
  
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const generateConfig = () => {
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

    setOutput(JSON.stringify(prettierConfig, null, 2));
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
    link.download = '.prettierrc';
    link.click();
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setConfig({
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
    setOutput('');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Print Width */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('printWidth')}
          </label>
          <input
            type="number"
            value={config.printWidth}
            onChange={(e) => setConfig(prev => ({ ...prev, printWidth: parseInt(e.target.value) || 80 }))}
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Tab Width */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('tabWidth')}
          </label>
          <input
            type="number"
            value={config.tabWidth}
            onChange={(e) => setConfig(prev => ({ ...prev, tabWidth: parseInt(e.target.value) || 2 }))}
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Trailing Comma */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('trailingComma')}
          </label>
          <select
            value={config.trailingComma}
            onChange={(e) => setConfig(prev => ({ ...prev, trailingComma: e.target.value as 'none' | 'es5' | 'all' }))}
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="none">None</option>
            <option value="es5">ES5</option>
            <option value="all">All</option>
          </select>
        </div>

        {/* Arrow Parens */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('arrowParens')}
          </label>
          <select
            value={config.arrowParens}
            onChange={(e) => setConfig(prev => ({ ...prev, arrowParens: e.target.value as 'avoid' | 'always' }))}
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="always">Always</option>
            <option value="avoid">Avoid</option>
          </select>
        </div>

        {/* End of Line */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('endOfLine')}
          </label>
          <select
            value={config.endOfLine}
            onChange={(e) => setConfig(prev => ({ ...prev, endOfLine: e.target.value as 'lf' | 'crlf' | 'cr' | 'auto' }))}
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="lf">LF (Unix)</option>
            <option value="crlf">CRLF (Windows)</option>
            <option value="cr">CR</option>
            <option value="auto">Auto</option>
          </select>
        </div>

        {/* Prose Wrap */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('proseWrap')}
          </label>
          <select
            value={config.proseWrap}
            onChange={(e) => setConfig(prev => ({ ...prev, proseWrap: e.target.value as 'always' | 'never' | 'preserve' }))}
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="preserve">Preserve</option>
            <option value="always">Always</option>
            <option value="never">Never</option>
          </select>
        </div>
      </div>

      {/* Boolean Options */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <label className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <input
            type="checkbox"
            checked={config.useTabs}
            onChange={(e) => setConfig(prev => ({ ...prev, useTabs: e.target.checked }))}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">{t('useTabs')}</span>
        </label>

        <label className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <input
            type="checkbox"
            checked={config.semi}
            onChange={(e) => setConfig(prev => ({ ...prev, semi: e.target.checked }))}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">{t('semi')}</span>
        </label>

        <label className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <input
            type="checkbox"
            checked={config.singleQuote}
            onChange={(e) => setConfig(prev => ({ ...prev, singleQuote: e.target.checked }))}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">{t('singleQuote')}</span>
        </label>

        <label className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <input
            type="checkbox"
            checked={config.bracketSpacing}
            onChange={(e) => setConfig(prev => ({ ...prev, bracketSpacing: e.target.checked }))}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">{t('bracketSpacing')}</span>
        </label>

        <label className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <input
            type="checkbox"
            checked={config.bracketSameLine}
            onChange={(e) => setConfig(prev => ({ ...prev, bracketSameLine: e.target.checked }))}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">{t('bracketSameLine')}</span>
        </label>
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
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">.prettierrc</label>
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
