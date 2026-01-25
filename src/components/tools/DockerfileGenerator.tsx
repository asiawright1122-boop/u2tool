'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface EnvVar {
  key: string;
  value: string;
}

interface DockerfileConfig {
  baseImage: string;
  workdir: string;
  copyCommands: string[];
  runCommands: string[];
  exposePort: string;
  envVars: EnvVar[];
  entrypoint: string;
  cmd: string;
}

const BASE_IMAGES = [
  { value: 'node:20-alpine', label: 'Node.js 20 (Alpine)' },
  { value: 'node:18-alpine', label: 'Node.js 18 (Alpine)' },
  { value: 'python:3.12-slim', label: 'Python 3.12 (Slim)' },
  { value: 'python:3.11-slim', label: 'Python 3.11 (Slim)' },
  { value: 'golang:1.22-alpine', label: 'Go 1.22 (Alpine)' },
  { value: 'rust:1.75-slim', label: 'Rust 1.75 (Slim)' },
  { value: 'openjdk:21-slim', label: 'OpenJDK 21 (Slim)' },
  { value: 'nginx:alpine', label: 'Nginx (Alpine)' },
  { value: 'ubuntu:22.04', label: 'Ubuntu 22.04' },
  { value: 'debian:bookworm-slim', label: 'Debian Bookworm (Slim)' },
  { value: 'alpine:3.19', label: 'Alpine 3.19' },
];

export default function DockerfileGenerator() {
  const t = useTranslations('tools.dockerfile-generator');
  const tCommon = useTranslations('tools');
  
  const [config, setConfig] = useState<DockerfileConfig>({
    baseImage: 'node:20-alpine',
    workdir: '/app',
    copyCommands: ['package*.json ./'],
    runCommands: ['npm install'],
    exposePort: '3000',
    envVars: [{ key: 'NODE_ENV', value: 'production' }],
    entrypoint: '',
    cmd: 'npm start',
  });
  
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const addCopyCommand = () => {
    setConfig(prev => ({
      ...prev,
      copyCommands: [...prev.copyCommands, ''],
    }));
  };

  const updateCopyCommand = (index: number, value: string) => {
    setConfig(prev => ({
      ...prev,
      copyCommands: prev.copyCommands.map((cmd, i) => i === index ? value : cmd),
    }));
  };

  const removeCopyCommand = (index: number) => {
    setConfig(prev => ({
      ...prev,
      copyCommands: prev.copyCommands.filter((_, i) => i !== index),
    }));
  };

  const addRunCommand = () => {
    setConfig(prev => ({
      ...prev,
      runCommands: [...prev.runCommands, ''],
    }));
  };

  const updateRunCommand = (index: number, value: string) => {
    setConfig(prev => ({
      ...prev,
      runCommands: prev.runCommands.map((cmd, i) => i === index ? value : cmd),
    }));
  };

  const removeRunCommand = (index: number) => {
    setConfig(prev => ({
      ...prev,
      runCommands: prev.runCommands.filter((_, i) => i !== index),
    }));
  };

  const addEnvVar = () => {
    setConfig(prev => ({
      ...prev,
      envVars: [...prev.envVars, { key: '', value: '' }],
    }));
  };

  const updateEnvVar = (index: number, field: 'key' | 'value', value: string) => {
    setConfig(prev => ({
      ...prev,
      envVars: prev.envVars.map((env, i) => 
        i === index ? { ...env, [field]: value } : env
      ),
    }));
  };

  const removeEnvVar = (index: number) => {
    setConfig(prev => ({
      ...prev,
      envVars: prev.envVars.filter((_, i) => i !== index),
    }));
  };

  const generateDockerfile = () => {
    const lines: string[] = [];
    
    // FROM
    lines.push(`FROM ${config.baseImage}`);
    lines.push('');
    
    // WORKDIR
    if (config.workdir) {
      lines.push(`WORKDIR ${config.workdir}`);
      lines.push('');
    }
    
    // ENV
    const validEnvVars = config.envVars.filter(env => env.key.trim());
    if (validEnvVars.length > 0) {
      for (const env of validEnvVars) {
        lines.push(`ENV ${env.key}=${env.value}`);
      }
      lines.push('');
    }
    
    // COPY
    const validCopyCommands = config.copyCommands.filter(cmd => cmd.trim());
    for (const cmd of validCopyCommands) {
      lines.push(`COPY ${cmd}`);
    }
    if (validCopyCommands.length > 0) {
      lines.push('');
    }
    
    // RUN
    const validRunCommands = config.runCommands.filter(cmd => cmd.trim());
    for (const cmd of validRunCommands) {
      lines.push(`RUN ${cmd}`);
    }
    if (validRunCommands.length > 0) {
      lines.push('');
    }
    
    // EXPOSE
    if (config.exposePort) {
      lines.push(`EXPOSE ${config.exposePort}`);
      lines.push('');
    }
    
    // ENTRYPOINT
    if (config.entrypoint) {
      const parts = config.entrypoint.split(' ').map(p => `"${p}"`).join(', ');
      lines.push(`ENTRYPOINT [${parts}]`);
    }
    
    // CMD
    if (config.cmd) {
      const parts = config.cmd.split(' ').map(p => `"${p}"`).join(', ');
      lines.push(`CMD [${parts}]`);
    }
    
    setOutput(lines.join('\n'));
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = () => {
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Dockerfile';
    link.click();
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setConfig({
      baseImage: 'node:20-alpine',
      workdir: '/app',
      copyCommands: [''],
      runCommands: [''],
      exposePort: '',
      envVars: [{ key: '', value: '' }],
      entrypoint: '',
      cmd: '',
    });
    setOutput('');
  };

  return (
    <div className="space-y-6">
      {/* Base Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('baseImage')}
        </label>
        <select
          value={config.baseImage}
          onChange={(e) => setConfig(prev => ({ ...prev, baseImage: e.target.value }))}
          className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {BASE_IMAGES.map(img => (
            <option key={img.value} value={img.value}>{img.label}</option>
          ))}
        </select>
      </div>

      {/* Working Directory */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('workdir')}
        </label>
        <input
          type="text"
          value={config.workdir}
          onChange={(e) => setConfig(prev => ({ ...prev, workdir: e.target.value }))}
          placeholder="/app"
          className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Environment Variables */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('envVars')}
        </label>
        <div className="space-y-2">
          {config.envVars.map((env, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={env.key}
                onChange={(e) => updateEnvVar(index, 'key', e.target.value)}
                placeholder={t('envKey')}
                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                value={env.value}
                onChange={(e) => updateEnvVar(index, 'value', e.target.value)}
                placeholder={t('envValue')}
                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={() => removeEnvVar(index)}
                className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            onClick={addEnvVar}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg text-gray-900 dark:text-gray-100 text-sm"
          >
            + {t('addEnvVar')}
          </button>
        </div>
      </div>

      {/* COPY Commands */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('copyCommands')}
        </label>
        <div className="space-y-2">
          {config.copyCommands.map((cmd, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={cmd}
                onChange={(e) => updateCopyCommand(index, e.target.value)}
                placeholder="package*.json ./"
                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              />
              <button
                onClick={() => removeCopyCommand(index)}
                className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            onClick={addCopyCommand}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg text-gray-900 dark:text-gray-100 text-sm"
          >
            + {t('addCopy')}
          </button>
        </div>
      </div>

      {/* RUN Commands */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('runCommands')}
        </label>
        <div className="space-y-2">
          {config.runCommands.map((cmd, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={cmd}
                onChange={(e) => updateRunCommand(index, e.target.value)}
                placeholder="npm install"
                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              />
              <button
                onClick={() => removeRunCommand(index)}
                className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            onClick={addRunCommand}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg text-gray-900 dark:text-gray-100 text-sm"
          >
            + {t('addRun')}
          </button>
        </div>
      </div>

      {/* Expose Port */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('exposePort')}
        </label>
        <input
          type="text"
          value={config.exposePort}
          onChange={(e) => setConfig(prev => ({ ...prev, exposePort: e.target.value }))}
          placeholder="3000"
          className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Entrypoint */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('entrypoint')}
        </label>
        <input
          type="text"
          value={config.entrypoint}
          onChange={(e) => setConfig(prev => ({ ...prev, entrypoint: e.target.value }))}
          placeholder="node server.js"
          className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
        />
      </div>

      {/* CMD */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('cmd')}
        </label>
        <input
          type="text"
          value={config.cmd}
          onChange={(e) => setConfig(prev => ({ ...prev, cmd: e.target.value }))}
          placeholder="npm start"
          className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-4">
        <button
          onClick={generateDockerfile}
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
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Dockerfile</label>
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
