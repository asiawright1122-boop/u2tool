'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface CspDirective {
  name: string;
  description: string;
  values: string[];
  enabled: boolean;
}

const defaultDirectives: CspDirective[] = [
  { name: 'default-src', description: 'Default policy for all resource types', values: ["'self'"], enabled: true },
  { name: 'script-src', description: 'Valid sources for JavaScript', values: ["'self'"], enabled: true },
  { name: 'style-src', description: 'Valid sources for stylesheets', values: ["'self'", "'unsafe-inline'"], enabled: true },
  { name: 'img-src', description: 'Valid sources for images', values: ["'self'", 'data:', 'https:'], enabled: true },
  { name: 'font-src', description: 'Valid sources for fonts', values: ["'self'"], enabled: false },
  { name: 'connect-src', description: 'Valid sources for fetch, XHR, WebSocket', values: ["'self'"], enabled: false },
  { name: 'media-src', description: 'Valid sources for audio and video', values: ["'self'"], enabled: false },
  { name: 'object-src', description: 'Valid sources for plugins', values: ["'none'"], enabled: true },
  { name: 'frame-src', description: 'Valid sources for frames', values: ["'self'"], enabled: false },
  { name: 'frame-ancestors', description: 'Valid parents that can embed this page', values: ["'self'"], enabled: true },
  { name: 'base-uri', description: 'Valid sources for base element', values: ["'self'"], enabled: true },
  { name: 'form-action', description: 'Valid endpoints for form submissions', values: ["'self'"], enabled: true },
  { name: 'upgrade-insecure-requests', description: 'Upgrade HTTP to HTTPS', values: [], enabled: false },
  { name: 'block-all-mixed-content', description: 'Block mixed content', values: [], enabled: false },
];

const commonValues = [
  "'self'",
  "'none'",
  "'unsafe-inline'",
  "'unsafe-eval'",
  "'strict-dynamic'",
  "'unsafe-hashes'",
  "data:",
  "blob:",
  "https:",
  "http:",
  "*.googleapis.com",
  "*.gstatic.com",
  "*.cloudflare.com",
  "*.jsdelivr.net",
  "*.unpkg.com",
];

export default function CspGenerator() {
  const t = useTranslations('tools.csp-generator');
  const [directives, setDirectives] = useState<CspDirective[]>(defaultDirectives);
  const [copied, setCopied] = useState(false);
  const [outputFormat, setOutputFormat] = useState<'header' | 'meta'>('header');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const toggleDirective = (index: number) => {
    const newDirectives = [...directives];
    newDirectives[index].enabled = !newDirectives[index].enabled;
    setDirectives(newDirectives);
  };

  const updateValues = (index: number, values: string[]) => {
    const newDirectives = [...directives];
    newDirectives[index].values = values;
    setDirectives(newDirectives);
  };

  const addValue = (index: number, value: string) => {
    if (!value.trim()) return;
    const newDirectives = [...directives];
    if (!newDirectives[index].values.includes(value)) {
      newDirectives[index].values.push(value);
      setDirectives(newDirectives);
    }
  };

  const removeValue = (directiveIndex: number, valueIndex: number) => {
    const newDirectives = [...directives];
    newDirectives[directiveIndex].values.splice(valueIndex, 1);
    setDirectives(newDirectives);
  };

  const generateCsp = (): string => {
    const parts = directives
      .filter(d => d.enabled)
      .map(d => {
        if (d.values.length === 0) {
          return d.name;
        }
        return `${d.name} ${d.values.join(' ')}`;
      });

    return parts.join('; ');
  };

  const getOutput = (): string => {
    const csp = generateCsp();
    if (outputFormat === 'meta') {
      return `<meta http-equiv="Content-Security-Policy" content="${csp}">`;
    }
    return `Content-Security-Policy: ${csp}`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getOutput());
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 2000);
  };

  const resetToDefaults = () => {
    setDirectives(defaultDirectives.map(d => ({ ...d, values: [...d.values] })));
  };

  useEffect(() => {

    return () => {

      if (timerRef.current) clearTimeout(timerRef.current);

    };

  }, []);


  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {t('directives')}
          </h3>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
            {directives.map((directive, index) => (
              <div
                key={directive.name}
                className={`p-4 border rounded-lg ${directive.enabled
                    ? 'border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800'
                  }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={directive.enabled}
                      onChange={() => toggleDirective(index)}
                      className="rounded"
                    />
                    <span className="font-mono font-medium text-gray-900 dark:text-white">
                      {directive.name}
                    </span>
                  </label>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  {directive.description}
                </p>

                {directive.enabled && directive.name !== 'upgrade-insecure-requests' && directive.name !== 'block-all-mixed-content' && (
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1">
                      {directive.values.map((value, valueIndex) => (
                        <span
                          key={valueIndex}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-white dark:bg-gray-700 rounded text-xs font-mono"
                        >
                          {value}
                          <button
                            onClick={() => removeValue(index, valueIndex)}
                            className="text-red-500 hover:text-red-600"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <select
                      onChange={(e) => {
                        addValue(index, e.target.value);
                        e.target.value = '';
                      }}
                      className="tool-select py-1 text-sm h-9"
                      defaultValue=""
                    >
                      <option value="">{t('addValue')}</option>
                      {commonValues.map(v => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={resetToDefaults}
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            {t('resetDefaults')}
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {t('output')}
            </h3>
            <select
              value={outputFormat}
              onChange={(e) => setOutputFormat(e.target.value as 'header' | 'meta')}
              className="tool-select w-auto py-1 px-3 text-sm h-9"
            >
              <option value="header">{t('httpHeader')}</option>
              <option value="meta">{t('metaTag')}</option>
            </select>
          </div>

          <div className="tool-result bg-gray-900 dark:bg-black border-gray-800">
            <pre className="text-sm font-mono text-green-400 whitespace-pre-wrap break-all">
              {getOutput()}
            </pre>
          </div>

          <button
            onClick={copyToClipboard}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {copied ? t('copied') : t('copy')}
          </button>

          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
              {t('testingTip')}
            </h4>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              {t('testingTipText')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
