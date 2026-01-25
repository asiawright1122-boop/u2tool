'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface ChangelogEntry {
  version: string;
  date: string;
  added: string[];
  changed: string[];
  fixed: string[];
  removed: string[];
  deprecated: string[];
  security: string[];
}

const EMPTY_ENTRY: ChangelogEntry = {
  version: '',
  date: new Date().toISOString().split('T')[0],
  added: [],
  changed: [],
  fixed: [],
  removed: [],
  deprecated: [],
  security: [],
};

export default function ChangelogGenerator() {
  const t = useTranslations('tools.changelog-generator');
  const tCommon = useTranslations('tools');
  
  const [entries, setEntries] = useState<ChangelogEntry[]>([{ ...EMPTY_ENTRY, version: '1.0.0' }]);
  const [projectName, setProjectName] = useState('');
  const [projectUrl, setProjectUrl] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const addEntry = () => {
    const lastVersion = entries[0]?.version || '1.0.0';
    const parts = lastVersion.split('.').map(Number);
    parts[1] = (parts[1] || 0) + 1;
    const newVersion = parts.join('.');
    
    setEntries([{ ...EMPTY_ENTRY, version: newVersion }, ...entries]);
  };

  const removeEntry = (index: number) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  const updateEntry = (index: number, field: keyof ChangelogEntry, value: string | string[]) => {
    setEntries(entries.map((entry, i) => 
      i === index ? { ...entry, [field]: value } : entry
    ));
  };

  const addItem = (entryIndex: number, category: keyof Omit<ChangelogEntry, 'version' | 'date'>) => {
    const entry = entries[entryIndex];
    updateEntry(entryIndex, category, [...entry[category], '']);
  };

  const updateItem = (entryIndex: number, category: keyof Omit<ChangelogEntry, 'version' | 'date'>, itemIndex: number, value: string) => {
    const entry = entries[entryIndex];
    const items = [...entry[category]];
    items[itemIndex] = value;
    updateEntry(entryIndex, category, items);
  };

  const removeItem = (entryIndex: number, category: keyof Omit<ChangelogEntry, 'version' | 'date'>, itemIndex: number) => {
    const entry = entries[entryIndex];
    updateEntry(entryIndex, category, entry[category].filter((_, i) => i !== itemIndex));
  };

  const generateChangelog = () => {
    const lines: string[] = [];
    
    // Header
    lines.push('# Changelog');
    lines.push('');
    lines.push('All notable changes to this project will be documented in this file.');
    lines.push('');
    lines.push('The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),');
    lines.push('and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).');
    lines.push('');
    
    // Entries
    for (const entry of entries) {
      if (!entry.version) continue;
      
      // Version header
      if (projectUrl) {
        lines.push(`## [${entry.version}](${projectUrl}/releases/tag/v${entry.version}) - ${entry.date}`);
      } else {
        lines.push(`## [${entry.version}] - ${entry.date}`);
      }
      lines.push('');
      
      // Categories
      const categories: { key: keyof Omit<ChangelogEntry, 'version' | 'date'>; label: string }[] = [
        { key: 'added', label: 'Added' },
        { key: 'changed', label: 'Changed' },
        { key: 'deprecated', label: 'Deprecated' },
        { key: 'removed', label: 'Removed' },
        { key: 'fixed', label: 'Fixed' },
        { key: 'security', label: 'Security' },
      ];
      
      for (const { key, label } of categories) {
        const items = entry[key].filter(item => item.trim());
        if (items.length > 0) {
          lines.push(`### ${label}`);
          lines.push('');
          for (const item of items) {
            lines.push(`- ${item}`);
          }
          lines.push('');
        }
      }
    }
    
    setOutput(lines.join('\n'));
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = () => {
    const blob = new Blob([output], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'CHANGELOG.md';
    link.click();
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setEntries([{ ...EMPTY_ENTRY, version: '1.0.0' }]);
    setProjectName('');
    setProjectUrl('');
    setOutput('');
  };

  const categories: { key: keyof Omit<ChangelogEntry, 'version' | 'date'>; label: string; color: string }[] = [
    { key: 'added', label: t('added'), color: 'bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700' },
    { key: 'changed', label: t('changed'), color: 'bg-yellow-100 dark:bg-yellow-900 border-yellow-300 dark:border-yellow-700' },
    { key: 'fixed', label: t('fixed'), color: 'bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700' },
    { key: 'removed', label: t('removed'), color: 'bg-red-100 dark:bg-red-900 border-red-300 dark:border-red-700' },
    { key: 'deprecated', label: t('deprecated'), color: 'bg-orange-100 dark:bg-orange-900 border-orange-300 dark:border-orange-700' },
    { key: 'security', label: t('security'), color: 'bg-purple-100 dark:bg-purple-900 border-purple-300 dark:border-purple-700' },
  ];

  return (
    <div className="space-y-6">
      {/* Project Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('projectName')}
          </label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder={t('projectNamePlaceholder')}
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('projectUrl')}
          </label>
          <input
            type="text"
            value={projectUrl}
            onChange={(e) => setProjectUrl(e.target.value)}
            placeholder={t('projectUrlPlaceholder')}
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Add Entry Button */}
      <button
        onClick={addEntry}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm"
      >
        + {t('addVersion')}
      </button>

      {/* Entries */}
      <div className="space-y-6">
        {entries.map((entry, entryIndex) => (
          <div key={entryIndex} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-4">
            {/* Version Header */}
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('version')}</label>
                <input
                  type="text"
                  value={entry.version}
                  onChange={(e) => updateEntry(entryIndex, 'version', e.target.value)}
                  placeholder={t('versionPlaceholder')}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-gray-100"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('date')}</label>
                <input
                  type="date"
                  value={entry.date}
                  onChange={(e) => updateEntry(entryIndex, 'date', e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-gray-100"
                />
              </div>
              {entries.length > 1 && (
                <button
                  onClick={() => removeEntry(entryIndex)}
                  className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded text-sm mt-5"
                >
                  {t('removeVersion')}
                </button>
              )}
            </div>

            {/* Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map(({ key, label, color }) => (
                <div key={key} className={`p-3 rounded-lg border ${color}`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
                    <button
                      onClick={() => addItem(entryIndex, key)}
                      className="px-2 py-1 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded text-xs text-gray-700 dark:text-gray-300"
                    >
                      +
                    </button>
                  </div>
                  <div className="space-y-2">
                    {entry[key].map((item, itemIndex) => (
                      <div key={itemIndex} className="flex gap-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => updateItem(entryIndex, key, itemIndex, e.target.value)}
                          placeholder={t('itemPlaceholder')}
                          className="flex-1 px-2 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-xs text-gray-900 dark:text-gray-100"
                        />
                        <button
                          onClick={() => removeItem(entryIndex, key, itemIndex)}
                          className="px-2 py-1 bg-red-400 hover:bg-red-500 text-white rounded text-xs"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-4">
        <button
          onClick={generateChangelog}
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
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">CHANGELOG.md</label>
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
          <pre className="w-full p-4 bg-gray-900 dark:bg-gray-950 border border-gray-700 rounded-lg font-mono text-sm text-green-400 overflow-x-auto whitespace-pre-wrap max-h-96 overflow-y-auto">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}
