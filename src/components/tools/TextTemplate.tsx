'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

function processTemplate(template: string, variables: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
    result = result.replace(regex, value);
  }
  return result;
}

function extractVariables(template: string): string[] {
  const regex = /\{\{\s*(\w+)\s*\}\}/g;
  const variables: string[] = [];
  let match;
  while ((match = regex.exec(template)) !== null) {
    if (!variables.includes(match[1])) {
      variables.push(match[1]);
    }
  }
  return variables;
}

export default function TextTemplate() {
  const t = useTranslations('tools.text-template');
  const [template, setTemplate] = useState('Hello, {{ name }}!\n\nWelcome to {{ company }}.\nYour role is {{ role }}.');
  const [variables, setVariables] = useState<Record<string, string>>({
    name: 'John',
    company: 'Acme Inc',
    role: 'Developer'
  });
  const [output, setOutput] = useState('');

  const detectedVars = extractVariables(template);

  const handleProcess = () => {
    setOutput(processTemplate(template, variables));
  };

  const handleVariableChange = (key: string, value: string) => {
    setVariables(prev => ({ ...prev, [key]: value }));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('template')}
        </label>
        <textarea
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
          className="w-full h-32 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white font-mono text-sm focus:outline-none focus:border-blue-500"
          placeholder={t('templatePlaceholder')}
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('syntaxHint')}</p>
      </div>

      {detectedVars.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('variables')} ({detectedVars.length})
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {detectedVars.map(varName => (
              <div key={varName} className="flex items-center gap-2">
                <span className="text-sm text-blue-600 dark:text-blue-400 font-mono min-w-[100px]">
                  {`{{ ${varName} }}`}
                </span>
                <input
                  type="text"
                  value={variables[varName] || ''}
                  onChange={(e) => handleVariableChange(varName, e.target.value)}
                  className="flex-1 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded px-3 py-1 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-blue-500"
                  placeholder={t('valuePlaceholder')}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleProcess}
        className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        {t('process')}
      </button>

      {output && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('result')}</label>
            <button
              onClick={handleCopy}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
            >
              {t('copy')}
            </button>
          </div>
          <pre className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 text-green-600 dark:text-green-400 font-mono text-sm whitespace-pre-wrap">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}
