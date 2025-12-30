'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface PackageInfo {
  name: string;
  version: string;
  description: string;
  main: string;
  author: string;
  license: string;
  private: boolean;
  type: 'commonjs' | 'module';
}

interface Script {
  name: string;
  command: string;
}

const COMMON_SCRIPTS: Script[] = [
  { name: 'start', command: 'node index.js' },
  { name: 'dev', command: 'nodemon index.js' },
  { name: 'build', command: 'tsc' },
  { name: 'test', command: 'jest' },
  { name: 'lint', command: 'eslint .' },
  { name: 'format', command: 'prettier --write .' },
];

const LICENSES = [
  'MIT',
  'Apache-2.0',
  'GPL-3.0',
  'BSD-3-Clause',
  'ISC',
  'UNLICENSED',
];

export default function PackageJsonGenerator() {
  const t = useTranslations('tools.packageJson');
  const [packageInfo, setPackageInfo] = useState<PackageInfo>({
    name: 'my-project',
    version: '1.0.0',
    description: '',
    main: 'index.js',
    author: '',
    license: 'MIT',
    private: false,
    type: 'commonjs',
  });
  const [scripts, setScripts] = useState<Script[]>([
    { name: 'start', command: 'node index.js' },
    { name: 'test', command: 'echo "Error: no test specified" && exit 1' },
  ]);
  const [keywords, setKeywords] = useState('');
  const [output, setOutput] = useState('');

  const addScript = (script: Script) => {
    if (!scripts.find((s) => s.name === script.name)) {
      setScripts([...scripts, script]);
    }
  };

  const removeScript = (name: string) => {
    setScripts(scripts.filter((s) => s.name !== name));
  };

  const updateScript = (index: number, field: 'name' | 'command', value: string) => {
    const newScripts = [...scripts];
    newScripts[index] = { ...newScripts[index], [field]: value };
    setScripts(newScripts);
  };

  const generate = () => {
    const pkg: Record<string, unknown> = {
      name: packageInfo.name,
      version: packageInfo.version,
    };

    if (packageInfo.description) {
      pkg.description = packageInfo.description;
    }

    pkg.main = packageInfo.main;

    if (packageInfo.type === 'module') {
      pkg.type = 'module';
    }

    const scriptsObj: Record<string, string> = {};
    for (const script of scripts) {
      if (script.name && script.command) {
        scriptsObj[script.name] = script.command;
      }
    }
    if (Object.keys(scriptsObj).length > 0) {
      pkg.scripts = scriptsObj;
    }

    if (keywords.trim()) {
      pkg.keywords = keywords.split(',').map((k) => k.trim()).filter(Boolean);
    }

    if (packageInfo.author) {
      pkg.author = packageInfo.author;
    }

    pkg.license = packageInfo.license;

    if (packageInfo.private) {
      pkg.private = true;
    }

    setOutput(JSON.stringify(pkg, null, 2));
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
  };

  const downloadOutput = () => {
    const blob = new Blob([output], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'package.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('name')}</label>
          <input
            type="text"
            value={packageInfo.name}
            onChange={(e) => setPackageInfo({ ...packageInfo, name: e.target.value })}
            className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('version')}</label>
          <input
            type="text"
            value={packageInfo.version}
            onChange={(e) => setPackageInfo({ ...packageInfo, version: e.target.value })}
            className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('main')}</label>
          <input
            type="text"
            value={packageInfo.main}
            onChange={(e) => setPackageInfo({ ...packageInfo, main: e.target.value })}
            className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('author')}</label>
          <input
            type="text"
            value={packageInfo.author}
            onChange={(e) => setPackageInfo({ ...packageInfo, author: e.target.value })}
            className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('license')}</label>
          <select
            value={packageInfo.license}
            onChange={(e) => setPackageInfo({ ...packageInfo, license: e.target.value })}
            className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm text-gray-900 dark:text-white"
          >
            {LICENSES.map((license) => (
              <option key={license} value={license}>
                {license}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('type')}</label>
          <select
            value={packageInfo.type}
            onChange={(e) =>
              setPackageInfo({ ...packageInfo, type: e.target.value as 'commonjs' | 'module' })
            }
            className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm text-gray-900 dark:text-white"
          >
            <option value="commonjs">CommonJS</option>
            <option value="module">ES Module</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('description')}</label>
        <input
          type="text"
          value={packageInfo.description}
          onChange={(e) => setPackageInfo({ ...packageInfo, description: e.target.value })}
          className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm text-gray-900 dark:text-white"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('keywords')}</label>
        <input
          type="text"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder={t('keywordsPlaceholder')}
          className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm text-gray-900 dark:text-white"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="private"
          checked={packageInfo.private}
          onChange={(e) => setPackageInfo({ ...packageInfo, private: e.target.checked })}
          className="rounded bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
        />
        <label htmlFor="private" className="text-sm text-gray-600 dark:text-gray-300">
          {t('private')}
        </label>
      </div>

      {/* Scripts */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('scripts')}</label>
        <div className="space-y-2 mb-4">
          {scripts.map((script, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={script.name}
                onChange={(e) => updateScript(index, 'name', e.target.value)}
                placeholder={t('scriptName')}
                className="w-32 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm text-gray-900 dark:text-white"
              />
              <input
                type="text"
                value={script.command}
                onChange={(e) => updateScript(index, 'command', e.target.value)}
                placeholder={t('scriptCommand')}
                className="flex-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm text-gray-900 dark:text-white"
              />
              <button
                onClick={() => removeScript(script.name)}
                className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded text-sm text-white"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-300">{t('commonScripts')}:</span>
          {COMMON_SCRIPTS.map((script) => (
            <button
              key={script.name}
              onClick={() => addScript(script)}
              disabled={scripts.some((s) => s.name === script.name)}
              className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded text-xs"
            >
              + {script.name}
            </button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <div className="flex justify-center">
        <button
          onClick={generate}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium"
        >
          {t('generate')}
        </button>
      </div>

      {/* Output */}
      {output && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">package.json</label>
            <div className="flex gap-2">
              <button
                onClick={copyOutput}
                className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-xs"
              >
                {t('copy')}
              </button>
              <button
                onClick={downloadOutput}
                className="px-2 py-1 bg-green-600 hover:bg-green-700 rounded text-xs text-white"
              >
                {t('download')}
              </button>
            </div>
          </div>
          <textarea
            value={output}
            readOnly
            className="w-full h-64 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-4 font-mono text-sm text-gray-900 dark:text-gray-100 resize-none"
          />
        </div>
      )}
    </div>
  );
}
