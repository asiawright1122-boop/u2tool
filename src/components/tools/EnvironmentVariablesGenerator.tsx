'use client';

import { useState, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';

interface EnvVar {
  id: string;
  key: string;
  value: string;
  description: string;
  required: boolean;
  secret: boolean;
}

type OutputFormat = 'env' | 'json' | 'yaml' | 'docker' | 'shell';

const PRESETS = {
  nodejs: [
    { key: 'NODE_ENV', value: 'development', description: 'Node environment', required: true, secret: false },
    { key: 'PORT', value: '3000', description: 'Server port', required: true, secret: false },
    { key: 'DATABASE_URL', value: 'postgresql://user:pass@localhost:5432/db', description: 'Database connection string', required: true, secret: true },
    { key: 'JWT_SECRET', value: '', description: 'JWT signing secret', required: true, secret: true },
    { key: 'LOG_LEVEL', value: 'info', description: 'Logging level', required: false, secret: false },
  ],
  nextjs: [
    { key: 'NEXT_PUBLIC_API_URL', value: 'http://localhost:3000/api', description: 'Public API URL', required: true, secret: false },
    { key: 'DATABASE_URL', value: 'postgresql://user:pass@localhost:5432/db', description: 'Database connection', required: true, secret: true },
    { key: 'NEXTAUTH_SECRET', value: '', description: 'NextAuth secret', required: true, secret: true },
    { key: 'NEXTAUTH_URL', value: 'http://localhost:3000', description: 'NextAuth URL', required: true, secret: false },
  ],
  django: [
    { key: 'DEBUG', value: 'True', description: 'Debug mode', required: true, secret: false },
    { key: 'SECRET_KEY', value: '', description: 'Django secret key', required: true, secret: true },
    { key: 'DATABASE_URL', value: 'postgres://user:pass@localhost:5432/db', description: 'Database URL', required: true, secret: true },
    { key: 'ALLOWED_HOSTS', value: 'localhost,127.0.0.1', description: 'Allowed hosts', required: true, secret: false },
  ],
  aws: [
    { key: 'AWS_ACCESS_KEY_ID', value: '', description: 'AWS access key', required: true, secret: true },
    { key: 'AWS_SECRET_ACCESS_KEY', value: '', description: 'AWS secret key', required: true, secret: true },
    { key: 'AWS_REGION', value: 'us-east-1', description: 'AWS region', required: true, secret: false },
    { key: 'AWS_S3_BUCKET', value: '', description: 'S3 bucket name', required: false, secret: false },
  ],
};

function generateOutput(vars: EnvVar[], format: OutputFormat): string {
  const filtered = vars.filter(v => v.key.trim());
  
  switch (format) {
    case 'env':
      return filtered.map(v => {
        const comment = v.description ? `# ${v.description}${v.required ? ' (required)' : ''}${v.secret ? ' [secret]' : ''}\n` : '';
        return `${comment}${v.key}=${v.value}`;
      }).join('\n\n');
    
    case 'json':
      const obj: Record<string, string> = {};
      filtered.forEach(v => { obj[v.key] = v.value; });
      return JSON.stringify(obj, null, 2);
    
    case 'yaml':
      return filtered.map(v => {
        const comment = v.description ? `# ${v.description}\n` : '';
        return `${comment}${v.key}: "${v.value}"`;
      }).join('\n');
    
    case 'docker':
      return filtered.map(v => `-e ${v.key}="${v.value}"`).join(' \\\n');
    
    case 'shell':
      return filtered.map(v => `export ${v.key}="${v.value}"`).join('\n');
    
    default:
      return '';
  }
}

function generateExampleFile(vars: EnvVar[]): string {
  return vars.filter(v => v.key.trim()).map(v => {
    const comment = v.description ? `# ${v.description}${v.required ? ' (required)' : ''}\n` : '';
    const value = v.secret ? '' : v.value;
    return `${comment}${v.key}=${value}`;
  }).join('\n\n');
}

export default function EnvironmentVariablesGenerator() {
  const t = useTranslations('tools.environment-variables-generator');
  const tCommon = useTranslations('tools');
  const [vars, setVars] = useState<EnvVar[]>([
    { id: '1', key: 'NODE_ENV', value: 'development', description: 'Node environment', required: true, secret: false },
    { id: '2', key: 'PORT', value: '3000', description: 'Server port', required: true, secret: false },
  ]);
  const [format, setFormat] = useState<OutputFormat>('env');
  const [copied, setCopied] = useState<string | null>(null);

  const addVar = useCallback(() => {
    setVars(prev => [...prev, { id: Date.now().toString(), key: '', value: '', description: '', required: false, secret: false }]);
  }, []);

  const removeVar = useCallback((id: string) => {
    setVars(prev => prev.filter(v => v.id !== id));
  }, []);

  const updateVar = useCallback((id: string, field: keyof EnvVar, value: string | boolean) => {
    setVars(prev => prev.map(v => v.id === id ? { ...v, [field]: value } : v));
  }, []);

  const applyPreset = useCallback((preset: keyof typeof PRESETS) => {
    setVars(PRESETS[preset].map((v, i) => ({ ...v, id: Date.now().toString() + i })));
  }, []);

  const output = useMemo(() => generateOutput(vars, format), [vars, format]);
  const exampleOutput = useMemo(() => generateExampleFile(vars), [vars]);

  const handleCopy = useCallback((text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }, []);

  return (
    <div className="space-y-6">
      {/* Presets */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quick Presets</label>
        <div className="flex flex-wrap gap-2">
          {Object.keys(PRESETS).map(preset => (
            <button
              key={preset}
              onClick={() => applyPreset(preset as keyof typeof PRESETS)}
              className="px-3 py-1.5 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50"
            >
              {preset.charAt(0).toUpperCase() + preset.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Variables */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Environment Variables</label>
          <button onClick={addVar} className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">+ Add Variable</button>
        </div>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {vars.map((v) => (
            <div key={v.id} className="flex items-start gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex-1 grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={v.key}
                  onChange={(e) => updateVar(v.id, 'key', e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, '_'))}
                  placeholder={t("keyNamePlaceholder")}
                  className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm font-mono"
                />
                <input
                  type={v.secret ? 'password' : 'text'}
                  value={v.value}
                  onChange={(e) => updateVar(v.id, 'value', e.target.value)}
                  placeholder={t("valuePlaceholder")}
                  className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </div>
              <input
                type="text"
                value={v.description}
                onChange={(e) => updateVar(v.id, 'description', e.target.value)}
                placeholder={t("descriptionPlaceholder")}
                className="w-32 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-xs"
              />
              <label className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                <input type="checkbox" checked={v.required} onChange={(e) => updateVar(v.id, 'required', e.target.checked)} className="rounded" />
                Req
              </label>
              <label className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                <input type="checkbox" checked={v.secret} onChange={(e) => updateVar(v.id, 'secret', e.target.checked)} className="rounded" />
                Secret
              </label>
              <button onClick={() => removeVar(v.id)} className="text-red-500 hover:text-red-600">✕</button>
            </div>
          ))}
        </div>
      </div>

      {/* Format Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{tCommon('output')} Format</label>
        <div className="flex flex-wrap gap-2">
          {(['env', 'json', 'yaml', 'docker', 'shell'] as const).map(fmt => (
            <button
              key={fmt}
              onClick={() => setFormat(fmt)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                format === fmt
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {fmt === 'env' ? '.env' : fmt.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Output */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{tCommon('output')}</label>
            <button onClick={() => handleCopy(output, 'output')} className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
              {copied === 'output' ? tCommon('copied') : tCommon('copy')}
            </button>
          </div>
          <pre className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-x-auto text-sm font-mono text-gray-800 dark:text-gray-200 h-48">
            {output}
          </pre>
        </div>
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">.env.example</label>
            <button onClick={() => handleCopy(exampleOutput, 'example')} className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
              {copied === 'example' ? tCommon('copied') : tCommon('copy')}
            </button>
          </div>
          <pre className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-x-auto text-sm font-mono text-gray-800 dark:text-gray-200 h-48">
            {exampleOutput}
          </pre>
        </div>
      </div>
    </div>
  );
}
