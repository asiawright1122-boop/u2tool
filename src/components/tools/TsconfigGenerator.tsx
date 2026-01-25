'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface TsconfigOptions {
  target: string;
  module: string;
  lib: string[];
  strict: boolean;
  jsx: string;
  declaration: boolean;
  declarationMap: boolean;
  sourceMap: boolean;
  outDir: string;
  rootDir: string;
  esModuleInterop: boolean;
  skipLibCheck: boolean;
  forceConsistentCasingInFileNames: boolean;
  resolveJsonModule: boolean;
  isolatedModules: boolean;
  noEmit: boolean;
  moduleResolution: string;
  baseUrl: string;
  paths: boolean;
}

const TARGETS = ['ES5', 'ES6', 'ES2017', 'ES2020', 'ES2021', 'ES2022', 'ESNext'];
const MODULES = ['CommonJS', 'ESNext', 'NodeNext', 'AMD', 'UMD', 'System', 'None'];
const LIBS = ['ES5', 'ES6', 'ES2015', 'ES2016', 'ES2017', 'ES2018', 'ES2019', 'ES2020', 'ES2021', 'ES2022', 'ESNext', 'DOM', 'DOM.Iterable', 'WebWorker'];
const JSX_OPTIONS = ['none', 'preserve', 'react', 'react-jsx', 'react-jsxdev', 'react-native'];
const MODULE_RESOLUTIONS = ['node', 'node16', 'nodenext', 'bundler', 'classic'];

const PRESETS = [
  { name: 'Node.js', target: 'ES2022', module: 'NodeNext', moduleResolution: 'nodenext', libs: ['ES2022'] },
  { name: 'React', target: 'ES2020', module: 'ESNext', moduleResolution: 'bundler', libs: ['ES2020', 'DOM', 'DOM.Iterable'], jsx: 'react-jsx' },
  { name: 'Next.js', target: 'ES2017', module: 'ESNext', moduleResolution: 'bundler', libs: ['DOM', 'DOM.Iterable', 'ESNext'], jsx: 'preserve' },
  { name: 'Library', target: 'ES2020', module: 'ESNext', moduleResolution: 'node', libs: ['ES2020'], declaration: true },
];

export default function TsconfigGenerator() {
  const t = useTranslations('tools.tsconfig-generator');
  const tCommon = useTranslations('tools');
  
  const [config, setConfig] = useState<TsconfigOptions>({
    target: 'ES2020',
    module: 'ESNext',
    lib: ['ES2020', 'DOM', 'DOM.Iterable'],
    strict: true,
    jsx: 'none',
    declaration: false,
    declarationMap: false,
    sourceMap: true,
    outDir: './dist',
    rootDir: './src',
    esModuleInterop: true,
    skipLibCheck: true,
    forceConsistentCasingInFileNames: true,
    resolveJsonModule: true,
    isolatedModules: true,
    noEmit: false,
    moduleResolution: 'bundler',
    baseUrl: '.',
    paths: false,
  });
  
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const applyPreset = (presetName: string) => {
    const preset = PRESETS.find(p => p.name === presetName);
    if (preset) {
      setConfig(prev => ({
        ...prev,
        target: preset.target,
        module: preset.module,
        moduleResolution: preset.moduleResolution,
        lib: preset.libs,
        jsx: preset.jsx || 'none',
        declaration: preset.declaration || false,
      }));
    }
  };

  const toggleLib = (lib: string) => {
    setConfig(prev => ({
      ...prev,
      lib: prev.lib.includes(lib) 
        ? prev.lib.filter(l => l !== lib)
        : [...prev.lib, lib],
    }));
  };

  const generateConfig = () => {
    const compilerOptions: Record<string, unknown> = {
      target: config.target,
      module: config.module,
      lib: config.lib,
      strict: config.strict,
      esModuleInterop: config.esModuleInterop,
      skipLibCheck: config.skipLibCheck,
      forceConsistentCasingInFileNames: config.forceConsistentCasingInFileNames,
      moduleResolution: config.moduleResolution,
    };

    if (config.jsx !== 'none') {
      compilerOptions.jsx = config.jsx;
    }

    if (config.declaration) {
      compilerOptions.declaration = true;
      if (config.declarationMap) {
        compilerOptions.declarationMap = true;
      }
    }

    if (config.sourceMap) {
      compilerOptions.sourceMap = true;
    }

    if (config.outDir && !config.noEmit) {
      compilerOptions.outDir = config.outDir;
    }

    if (config.rootDir) {
      compilerOptions.rootDir = config.rootDir;
    }

    if (config.resolveJsonModule) {
      compilerOptions.resolveJsonModule = true;
    }

    if (config.isolatedModules) {
      compilerOptions.isolatedModules = true;
    }

    if (config.noEmit) {
      compilerOptions.noEmit = true;
    }

    if (config.baseUrl) {
      compilerOptions.baseUrl = config.baseUrl;
    }

    if (config.paths) {
      compilerOptions.paths = {
        '@/*': ['./src/*'],
      };
    }

    const tsconfig = {
      compilerOptions,
      include: ['src/**/*'],
      exclude: ['node_modules', 'dist'],
    };

    setOutput(JSON.stringify(tsconfig, null, 2));
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
    link.download = 'tsconfig.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setConfig({
      target: 'ES2020',
      module: 'ESNext',
      lib: ['ES2020'],
      strict: true,
      jsx: 'none',
      declaration: false,
      declarationMap: false,
      sourceMap: true,
      outDir: './dist',
      rootDir: './src',
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      resolveJsonModule: true,
      isolatedModules: true,
      noEmit: false,
      moduleResolution: 'bundler',
      baseUrl: '.',
      paths: false,
    });
    setOutput('');
  };

  return (
    <div className="space-y-6">
      {/* Presets */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('presets')}
        </label>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map(preset => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset.name)}
              className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-sm text-gray-900 dark:text-gray-100"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Target */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('target')}
          </label>
          <select
            value={config.target}
            onChange={(e) => setConfig(prev => ({ ...prev, target: e.target.value }))}
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {TARGETS.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Module */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('module')}
          </label>
          <select
            value={config.module}
            onChange={(e) => setConfig(prev => ({ ...prev, module: e.target.value }))}
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {MODULES.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        {/* Module Resolution */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('moduleResolution')}
          </label>
          <select
            value={config.moduleResolution}
            onChange={(e) => setConfig(prev => ({ ...prev, moduleResolution: e.target.value }))}
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {MODULE_RESOLUTIONS.map(mr => (
              <option key={mr} value={mr}>{mr}</option>
            ))}
          </select>
        </div>

        {/* JSX */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            JSX
          </label>
          <select
            value={config.jsx}
            onChange={(e) => setConfig(prev => ({ ...prev, jsx: e.target.value }))}
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {JSX_OPTIONS.map(j => (
              <option key={j} value={j}>{j}</option>
            ))}
          </select>
        </div>

        {/* Out Dir */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('outDir')}
          </label>
          <input
            type="text"
            value={config.outDir}
            onChange={(e) => setConfig(prev => ({ ...prev, outDir: e.target.value }))}
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Root Dir */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('rootDir')}
          </label>
          <input
            type="text"
            value={config.rootDir}
            onChange={(e) => setConfig(prev => ({ ...prev, rootDir: e.target.value }))}
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Lib */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('lib')}
        </label>
        <div className="flex flex-wrap gap-2">
          {LIBS.map(lib => (
            <button
              key={lib}
              onClick={() => toggleLib(lib)}
              className={`px-3 py-1.5 rounded text-sm ${
                config.lib.includes(lib)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {lib}
            </button>
          ))}
        </div>
      </div>

      {/* Boolean Options */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { key: 'strict', label: t('strict') },
          { key: 'declaration', label: t('declaration') },
          { key: 'declarationMap', label: t('declarationMap') },
          { key: 'sourceMap', label: t('sourceMap') },
          { key: 'esModuleInterop', label: 'esModuleInterop' },
          { key: 'skipLibCheck', label: 'skipLibCheck' },
          { key: 'forceConsistentCasingInFileNames', label: 'forceConsistentCasingInFileNames' },
          { key: 'resolveJsonModule', label: 'resolveJsonModule' },
          { key: 'isolatedModules', label: 'isolatedModules' },
          { key: 'noEmit', label: 'noEmit' },
          { key: 'paths', label: t('paths') },
        ].map(({ key, label }) => (
          <label key={key} className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <input
              type="checkbox"
              checked={config[key as keyof TsconfigOptions] as boolean}
              onChange={(e) => setConfig(prev => ({ ...prev, [key]: e.target.checked }))}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-xs text-gray-700 dark:text-gray-300">{label}</span>
          </label>
        ))}
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
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">tsconfig.json</label>
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
