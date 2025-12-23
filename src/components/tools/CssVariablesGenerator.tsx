'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface CssVariable {
  id: string;
  name: string;
  value: string;
  type: 'color' | 'size' | 'font' | 'other';
}

export default function CssVariablesGenerator() {
  const t = useTranslations('tools.css-variables-generator');
  const [variables, setVariables] = useState<CssVariable[]>([
    { id: '1', name: 'primary-color', value: '#3b82f6', type: 'color' },
    { id: '2', name: 'secondary-color', value: '#10b981', type: 'color' },
    { id: '3', name: 'font-size-base', value: '16px', type: 'size' },
  ]);
  const [prefix, setPrefix] = useState('');
  const [scope, setScope] = useState(':root');

  const addVariable = () => {
    const newId = Date.now().toString();
    setVariables([...variables, { id: newId, name: '', value: '', type: 'other' }]);
  };

  const removeVariable = (id: string) => {
    setVariables(variables.filter(v => v.id !== id));
  };

  const updateVariable = (id: string, field: keyof CssVariable, value: string) => {
    setVariables(variables.map(v => 
      v.id === id ? { ...v, [field]: value } : v
    ));
  };

  const generateCss = (): string => {
    if (variables.length === 0) return '';

    const varLines = variables
      .filter(v => v.name && v.value)
      .map(v => {
        const varName = prefix ? `--${prefix}-${v.name}` : `--${v.name}`;
        return `  ${varName}: ${v.value};`;
      })
      .join('\n');

    return `${scope} {\n${varLines}\n}`;
  };

  const generateScss = (): string => {
    return variables
      .filter(v => v.name && v.value)
      .map(v => {
        const varName = prefix ? `$${prefix}-${v.name}` : `$${v.name}`;
        return `${varName}: ${v.value};`;
      })
      .join('\n');
  };

  const generateJs = (): string => {
    const obj: Record<string, string> = {};
    variables
      .filter(v => v.name && v.value)
      .forEach(v => {
        const key = prefix ? `${prefix}${v.name.charAt(0).toUpperCase() + v.name.slice(1).replace(/-([a-z])/g, (_, c) => c.toUpperCase())}` : v.name.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
        obj[key] = v.value;
      });
    return `const cssVariables = ${JSON.stringify(obj, null, 2)};`;
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const loadPreset = (preset: 'light' | 'dark' | 'brand') => {
    const presets: Record<string, CssVariable[]> = {
      light: [
        { id: '1', name: 'bg-primary', value: '#ffffff', type: 'color' },
        { id: '2', name: 'bg-secondary', value: '#f3f4f6', type: 'color' },
        { id: '3', name: 'text-primary', value: '#111827', type: 'color' },
        { id: '4', name: 'text-secondary', value: '#6b7280', type: 'color' },
        { id: '5', name: 'border-color', value: '#e5e7eb', type: 'color' },
      ],
      dark: [
        { id: '1', name: 'bg-primary', value: '#111827', type: 'color' },
        { id: '2', name: 'bg-secondary', value: '#1f2937', type: 'color' },
        { id: '3', name: 'text-primary', value: '#f9fafb', type: 'color' },
        { id: '4', name: 'text-secondary', value: '#9ca3af', type: 'color' },
        { id: '5', name: 'border-color', value: '#374151', type: 'color' },
      ],
      brand: [
        { id: '1', name: 'primary', value: '#3b82f6', type: 'color' },
        { id: '2', name: 'primary-hover', value: '#2563eb', type: 'color' },
        { id: '3', name: 'secondary', value: '#10b981', type: 'color' },
        { id: '4', name: 'accent', value: '#f59e0b', type: 'color' },
        { id: '5', name: 'danger', value: '#ef4444', type: 'color' },
      ],
    };
    setVariables(presets[preset]);
  };

  const cssOutput = generateCss();
  const scssOutput = generateScss();
  const jsOutput = generateJs();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-300">{t('prefix')}:</label>
          <input
            type="text"
            value={prefix}
            onChange={(e) => setPrefix(e.target.value)}
            placeholder={t('prefixPlaceholder')}
            className="w-24 p-2 border border-gray-600 rounded-lg bg-gray-800 text-gray-100"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-300">{t('scope')}:</label>
          <select
            value={scope}
            onChange={(e) => setScope(e.target.value)}
            className="p-2 border border-gray-600 rounded-lg bg-gray-800 text-gray-100"
          >
            <option value=":root">:root</option>
            <option value="body">body</option>
            <option value=".theme-light">.theme-light</option>
            <option value=".theme-dark">.theme-dark</option>
          </select>
        </div>

        <div className="flex gap-2">
          <span className="text-sm text-gray-300">{t('presets')}:</span>
          <button onClick={() => loadPreset('light')} className="text-sm px-2 py-1 bg-gray-700 rounded hover:bg-gray-600">
            {t('presetLight')}
          </button>
          <button onClick={() => loadPreset('dark')} className="text-sm px-2 py-1 bg-gray-800 text-white rounded hover:bg-gray-700">
            {t('presetDark')}
          </button>
          <button onClick={() => loadPreset('brand')} className="text-sm px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
            {t('presetBrand')}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-100">{t('variables')}</h3>
          <button
            onClick={addVariable}
            className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
          >
            + {t('addVariable')}
          </button>
        </div>

        <div className="space-y-2">
          {variables.map((variable) => (
            <div key={variable.id} className="flex items-center gap-2 p-2 bg-gray-900 rounded-lg">
              <select
                value={variable.type}
                onChange={(e) => updateVariable(variable.id, 'type', e.target.value)}
                className="w-24 p-2 text-sm border border-gray-600 rounded bg-gray-800 text-gray-100"
              >
                <option value="color">{t('typeColor')}</option>
                <option value="size">{t('typeSize')}</option>
                <option value="font">{t('typeFont')}</option>
                <option value="other">{t('typeOther')}</option>
              </select>
              <input
                type="text"
                value={variable.name}
                onChange={(e) => updateVariable(variable.id, 'name', e.target.value)}
                placeholder={t('varNamePlaceholder')}
                className="flex-1 p-2 text-sm border border-gray-600 rounded bg-gray-800 text-gray-100 font-mono"
              />
              {variable.type === 'color' ? (
                <div className="flex items-center gap-1">
                  <input
                    type="color"
                    value={variable.value || '#000000'}
                    onChange={(e) => updateVariable(variable.id, 'value', e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={variable.value}
                    onChange={(e) => updateVariable(variable.id, 'value', e.target.value)}
                    className="w-28 p-2 text-sm border border-gray-600 rounded bg-gray-800 text-gray-100 font-mono"
                  />
                </div>
              ) : (
                <input
                  type="text"
                  value={variable.value}
                  onChange={(e) => updateVariable(variable.id, 'value', e.target.value)}
                  placeholder={t('varValuePlaceholder')}
                  className="w-40 p-2 text-sm border border-gray-600 rounded bg-gray-800 text-gray-100 font-mono"
                />
              )}
              <button
                onClick={() => removeVariable(variable.id)}
                className="p-2 text-red-600 hover:text-red-800"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-300">{t('cssLabel')}</label>
            <button onClick={() => handleCopy(cssOutput)} className="text-sm text-blue-600 hover:text-blue-800">
              {t('copy')}
            </button>
          </div>
          <pre className="h-48 p-3 bg-gray-900 text-green-400 rounded-lg overflow-auto text-xs font-mono">
            {cssOutput || t('noOutput')}
          </pre>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-300">{t('scssLabel')}</label>
            <button onClick={() => handleCopy(scssOutput)} className="text-sm text-blue-600 hover:text-blue-800">
              {t('copy')}
            </button>
          </div>
          <pre className="h-48 p-3 bg-gray-900 text-pink-400 rounded-lg overflow-auto text-xs font-mono">
            {scssOutput || t('noOutput')}
          </pre>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-300">{t('jsLabel')}</label>
            <button onClick={() => handleCopy(jsOutput)} className="text-sm text-blue-600 hover:text-blue-800">
              {t('copy')}
            </button>
          </div>
          <pre className="h-48 p-3 bg-gray-900 text-yellow-400 rounded-lg overflow-auto text-xs font-mono">
            {jsOutput || t('noOutput')}
          </pre>
        </div>
      </div>
    </div>
  );
}
