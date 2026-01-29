'use client';

import { useState, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';

interface Tag {
  name: string;
  type: 'lightweight' | 'annotated';
  message?: string;
  commit?: string;
}

interface SemverParts {
  major: number;
  minor: number;
  patch: number;
  prerelease?: string;
}

function parseSemver(version: string): SemverParts | null {
  const match = version.match(/^v?(\d+)\.(\d+)\.(\d+)(?:-(.+))?$/);
  if (!match) return null;
  return {
    major: parseInt(match[1]),
    minor: parseInt(match[2]),
    patch: parseInt(match[3]),
    prerelease: match[4],
  };
}

function formatSemver(parts: SemverParts, prefix: boolean = true): string {
  let version = `${parts.major}.${parts.minor}.${parts.patch}`;
  if (parts.prerelease) version += `-${parts.prerelease}`;
  return prefix ? `v${version}` : version;
}

function bumpVersion(current: string, type: 'major' | 'minor' | 'patch' | 'prerelease'): string {
  const parts = parseSemver(current);
  if (!parts) return current;
  
  switch (type) {
    case 'major':
      return formatSemver({ major: parts.major + 1, minor: 0, patch: 0 });
    case 'minor':
      return formatSemver({ major: parts.major, minor: parts.minor + 1, patch: 0 });
    case 'patch':
      return formatSemver({ major: parts.major, minor: parts.minor, patch: parts.patch + 1 });
    case 'prerelease':
      if (parts.prerelease) {
        const match = parts.prerelease.match(/^(.+?)\.?(\d+)?$/);
        if (match) {
          const prefix = match[1];
          const num = match[2] ? parseInt(match[2]) + 1 : 1;
          return formatSemver({ ...parts, prerelease: `${prefix}.${num}` });
        }
      }
      return formatSemver({ ...parts, prerelease: 'alpha.1' });
    default:
      return current;
  }
}

function generateCommands(tag: Tag): string[] {
  const commands: string[] = [];
  
  if (tag.type === 'annotated') {
    if (tag.commit) {
      commands.push(`git tag -a ${tag.name} ${tag.commit} -m "${tag.message || tag.name}"`);
    } else {
      commands.push(`git tag -a ${tag.name} -m "${tag.message || tag.name}"`);
    }
  } else {
    if (tag.commit) {
      commands.push(`git tag ${tag.name} ${tag.commit}`);
    } else {
      commands.push(`git tag ${tag.name}`);
    }
  }
  
  commands.push(`git push origin ${tag.name}`);
  
  return commands;
}

export default function GitTagManager() {
  const t = useTranslations('tools.git-tag-manager');
  const tCommon = useTranslations('tools');
  const [currentVersion, setCurrentVersion] = useState('v1.0.0');
  const [tag, setTag] = useState<Tag>({
    name: 'v1.0.1',
    type: 'annotated',
    message: 'Release v1.0.1',
    commit: '',
  });
  const [copied, setCopied] = useState<string | null>(null);

  const updateTag = useCallback(<K extends keyof Tag>(key: K, value: Tag[K]) => {
    setTag(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleBump = useCallback((type: 'major' | 'minor' | 'patch' | 'prerelease') => {
    const newVersion = bumpVersion(currentVersion, type);
    setCurrentVersion(newVersion);
    setTag(prev => ({
      ...prev,
      name: newVersion,
      message: `Release ${newVersion}`,
    }));
  }, [currentVersion]);

  const commands = useMemo(() => generateCommands(tag), [tag]);
  const allCommands = commands.join('\n');

  const handleCopy = useCallback((text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }, []);

  const semverParts = parseSemver(tag.name);
  const isValidSemver = semverParts !== null;

  return (
    <div className="space-y-6">
      <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Current Version
        </label>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={currentVersion}
            onChange={(e) => setCurrentVersion(e.target.value)}
            className="w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono"
          />
          <span className="text-gray-500">→</span>
          <div className="flex gap-1">
            <button onClick={() => handleBump('major')} className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded hover:bg-red-200">
              Major
            </button>
            <button onClick={() => handleBump('minor')} className="px-2 py-1 text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded hover:bg-yellow-200">
              Minor
            </button>
            <button onClick={() => handleBump('patch')} className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded hover:bg-green-200">
              Patch
            </button>
            <button onClick={() => handleBump('prerelease')} className="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded hover:bg-purple-200">
              Pre
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tag Name *
          </label>
          <input
            type="text"
            value={tag.name}
            onChange={(e) => updateTag('name', e.target.value)}
            placeholder={t("versionPlaceholder")}
            className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono ${
              isValidSemver ? 'border-green-500' : 'border-gray-300 dark:border-gray-600'
            }`}
          />
          {isValidSemver && (
            <p className="text-xs text-green-600 mt-1">
              ✓ Valid semver: {semverParts.major}.{semverParts.minor}.{semverParts.patch}
              {semverParts.prerelease && `-${semverParts.prerelease}`}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tag Type
          </label>
          <select
            value={tag.type}
            onChange={(e) => updateTag('type', e.target.value as Tag['type'])}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="annotated">Annotated (recommended)</option>
            <option value="lightweight">Lightweight</option>
          </select>
        </div>
      </div>

      {tag.type === 'annotated' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tag Message
          </label>
          <textarea
            value={tag.message}
            onChange={(e) => updateTag('message', e.target.value)}
            placeholder={t("notesPlaceholder")}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Commit Hash (optional)
        </label>
        <input
          type="text"
          value={tag.commit}
          onChange={(e) => updateTag('commit', e.target.value)}
          placeholder={t("commitPlaceholder")}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Git Commands
          </label>
          <button
            onClick={() => handleCopy(allCommands, 'all')}
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            {copied === 'all' ? tCommon('copied') : 'Copy All'}
          </button>
        </div>
        <div className="space-y-2">
          {commands.map((cmd, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <code className="flex-1 p-2 bg-gray-50 dark:bg-gray-900 rounded text-sm font-mono text-gray-800 dark:text-gray-200">
                {cmd}
              </code>
              <button
                onClick={() => handleCopy(cmd, `cmd-${idx}`)}
                className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                {copied === `cmd-${idx}` ? '✓' : tCommon('copy')}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">Useful Commands</h3>
          <div className="space-y-1 text-xs font-mono text-blue-700 dark:text-blue-300">
            <p>git tag -l &quot;v*&quot; # List tags</p>
            <p>git show {tag.name} # Show tag info</p>
            <p>git tag -d {tag.name} # Delete local</p>
            <p>git push origin :{tag.name} # Delete remote</p>
          </div>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Semver Guide</h3>
          <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
            <p><strong>Major:</strong> Breaking changes</p>
            <p><strong>Minor:</strong> New features (backward compatible)</p>
            <p><strong>Patch:</strong> Bug fixes</p>
            <p><strong>Pre:</strong> alpha, beta, rc versions</p>
          </div>
        </div>
      </div>
    </div>
  );
}
