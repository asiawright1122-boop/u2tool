'use client';

import { useState, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';

interface ChangeEntry {
  id: string;
  type: 'added' | 'changed' | 'deprecated' | 'removed' | 'fixed' | 'security';
  description: string;
  issue?: string;
  pr?: string;
}

interface Release {
  version: string;
  date: string;
  entries: ChangeEntry[];
}

const CHANGE_TYPES = [
  { value: 'added', label: 'Added', color: 'bg-green-500' },
  { value: 'changed', label: 'Changed', color: 'bg-blue-500' },
  { value: 'deprecated', label: 'Deprecated', color: 'bg-yellow-500' },
  { value: 'removed', label: 'Removed', color: 'bg-red-500' },
  { value: 'fixed', label: 'Fixed', color: 'bg-purple-500' },
  { value: 'security', label: 'Security', color: 'bg-orange-500' },
];

function generateChangelog(releases: Release[], format: 'keepachangelog' | 'conventional' | 'simple'): string {
  let output = '';
  
  if (format === 'keepachangelog') {
    output = `# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

`;
  } else if (format === 'conventional') {
    output = `# Changelog\n\n`;
  } else {
    output = `# Release Notes\n\n`;
  }
  
  for (const release of releases) {
    if (format === 'keepachangelog') {
      output += `## [${release.version}] - ${release.date}\n\n`;
      
      const grouped = CHANGE_TYPES.reduce((acc, type) => {
        acc[type.value] = release.entries.filter(e => e.type === type.value);
        return acc;
      }, {} as Record<string, ChangeEntry[]>);
      
      for (const type of CHANGE_TYPES) {
        const entries = grouped[type.value];
        if (entries.length > 0) {
          output += `### ${type.label}\n\n`;
          for (const entry of entries) {
            let line = `- ${entry.description}`;
            if (entry.issue) line += ` (#${entry.issue})`;
            if (entry.pr) line += ` (PR #${entry.pr})`;
            output += line + '\n';
          }
          output += '\n';
        }
      }
    } else if (format === 'conventional') {
      output += `## ${release.version} (${release.date})\n\n`;
      
      const typeMap: Record<string, string> = {
        added: 'Features',
        changed: 'Changes',
        deprecated: 'Deprecations',
        removed: 'Removals',
        fixed: 'Bug Fixes',
        security: 'Security',
      };
      
      const grouped = CHANGE_TYPES.reduce((acc, type) => {
        acc[type.value] = release.entries.filter(e => e.type === type.value);
        return acc;
      }, {} as Record<string, ChangeEntry[]>);
      
      for (const type of CHANGE_TYPES) {
        const entries = grouped[type.value];
        if (entries.length > 0) {
          output += `### ${typeMap[type.value]}\n\n`;
          for (const entry of entries) {
            let line = `* ${entry.description}`;
            const refs = [];
            if (entry.issue) refs.push(`#${entry.issue}`);
            if (entry.pr) refs.push(`PR #${entry.pr}`);
            if (refs.length > 0) line += ` (${refs.join(', ')})`;
            output += line + '\n';
          }
          output += '\n';
        }
      }
    } else {
      output += `## Version ${release.version}\n`;
      output += `Released: ${release.date}\n\n`;
      
      for (const entry of release.entries) {
        output += `- [${entry.type.toUpperCase()}] ${entry.description}\n`;
      }
      output += '\n';
    }
  }
  
  return output.trim();
}

export default function ChangelogGeneratorAdvanced() {
  const t = useTranslations('tools.changelog-generator-advanced');
  const tCommon = useTranslations('tools');
  const [releases, setReleases] = useState<Release[]>([
    {
      version: '1.0.0',
      date: new Date().toISOString().split('T')[0],
      entries: [
        { id: '1', type: 'added', description: 'Initial release', issue: '', pr: '' },
      ],
    },
  ]);
  const [format, setFormat] = useState<'keepachangelog' | 'conventional' | 'simple'>('keepachangelog');
  const [copied, setCopied] = useState(false);

  const addRelease = useCallback(() => {
    const lastVersion = releases[0]?.version || '0.0.0';
    const parts = lastVersion.split('.').map(Number);
    parts[1] = (parts[1] || 0) + 1;
    const newVersion = parts.join('.');
    
    setReleases(prev => [{
      version: newVersion,
      date: new Date().toISOString().split('T')[0],
      entries: [],
    }, ...prev]);
  }, [releases]);

  const updateRelease = useCallback((idx: number, field: keyof Release, value: string) => {
    setReleases(prev => prev.map((r, i) => i === idx ? { ...r, [field]: value } : r));
  }, []);

  const addEntry = useCallback((releaseIdx: number) => {
    setReleases(prev => prev.map((r, i) => {
      if (i === releaseIdx) {
        return {
          ...r,
          entries: [...r.entries, {
            id: Date.now().toString(),
            type: 'added',
            description: '',
            issue: '',
            pr: '',
          }],
        };
      }
      return r;
    }));
  }, []);

  const updateEntry = useCallback((releaseIdx: number, entryId: string, field: keyof ChangeEntry, value: string) => {
    setReleases(prev => prev.map((r, i) => {
      if (i === releaseIdx) {
        return {
          ...r,
          entries: r.entries.map(e => e.id === entryId ? { ...e, [field]: value } : e),
        };
      }
      return r;
    }));
  }, []);

  const removeEntry = useCallback((releaseIdx: number, entryId: string) => {
    setReleases(prev => prev.map((r, i) => {
      if (i === releaseIdx) {
        return { ...r, entries: r.entries.filter(e => e.id !== entryId) };
      }
      return r;
    }));
  }, []);

  const changelog = useMemo(() => generateChangelog(releases, format), [releases, format]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(changelog);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [changelog]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          {(['keepachangelog', 'conventional', 'simple'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFormat(f)}
              className={`px-3 py-1.5 text-sm rounded-lg ${
                format === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {f === 'keepachangelog' ? 'Keep a Changelog' : f === 'conventional' ? 'Conventional' : 'Simple'}
            </button>
          ))}
        </div>
        <button
          onClick={addRelease}
          className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          {t('addRelease')}
        </button>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {releases.map((release, releaseIdx) => (
          <div key={releaseIdx} className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 flex gap-4 items-center">
              <input
                type="text"
                value={release.version}
                onChange={(e) => updateRelease(releaseIdx, 'version', e.target.value)}
                placeholder={t("versionPlaceholder")}
                className="w-24 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <input
                type="date"
                value={release.date}
                onChange={(e) => updateRelease(releaseIdx, 'date', e.target.value)}
                className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <button
                onClick={() => addEntry(releaseIdx)}
                className="ml-auto text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200"
              >
                {t('addEntry')}
              </button>
            </div>
            
            <div className="p-3 space-y-2">
              {release.entries.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-2">{t('noEntriesYet')}</p>
              ) : (
                release.entries.map(entry => (
                  <div key={entry.id} className="flex gap-2 items-start">
                    <select
                      value={entry.type}
                      onChange={(e) => updateEntry(releaseIdx, entry.id, 'type', e.target.value)}
                      className="w-28 px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      {CHANGE_TYPES.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={entry.description}
                      onChange={(e) => updateEntry(releaseIdx, entry.id, 'description', e.target.value)}
                      placeholder={t("descriptionPlaceholder")}
                      className="flex-1 px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                    <input
                      type="text"
                      value={entry.issue || ''}
                      onChange={(e) => updateEntry(releaseIdx, entry.id, 'issue', e.target.value)}
                      placeholder={t("issuePlaceholder")}
                      className="w-20 px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                    <button
                      onClick={() => removeEntry(releaseIdx, entry.id)}
                      className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('generatedChangelog')}
          </label>
          <button
            onClick={handleCopy}
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            {copied ? tCommon('copied') : tCommon('copy')}
          </button>
        </div>
        <pre className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-x-auto text-sm font-mono text-gray-800 dark:text-gray-200 max-h-64 whitespace-pre-wrap">
          {changelog}
        </pre>
      </div>
    </div>
  );
}
