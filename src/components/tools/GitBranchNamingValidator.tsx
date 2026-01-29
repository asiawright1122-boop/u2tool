'use client';

import { useState, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';

interface ValidationRule {
  name: string;
  pattern: RegExp;
  description: string;
  valid: boolean;
}

interface NamingConvention {
  name: string;
  pattern: RegExp;
  example: string;
  description: string;
}

const NAMING_CONVENTIONS: NamingConvention[] = [
  {
    name: 'Git Flow',
    pattern: /^(feature|bugfix|hotfix|release|support)\/[a-z0-9-]+$/,
    example: 'feature/user-authentication',
    description: 'feature/, bugfix/, hotfix/, release/, support/ prefixes',
  },
  {
    name: 'GitHub Flow',
    pattern: /^[a-z0-9-]+$/,
    example: 'add-user-login',
    description: 'Simple lowercase with hyphens',
  },
  {
    name: 'Jira Integration',
    pattern: /^(feature|bugfix|hotfix)\/[A-Z]+-\d+-[a-z0-9-]+$/,
    example: 'feature/PROJ-123-add-login',
    description: 'Includes Jira ticket number',
  },
  {
    name: 'Custom',
    pattern: /^.+$/,
    example: 'any-branch-name',
    description: 'Custom validation rules',
  },
];

const GIT_RULES: Omit<ValidationRule, 'valid'>[] = [
  { name: 'No spaces', pattern: /^\S+$/, description: 'Branch names cannot contain spaces' },
  { name: 'No consecutive dots', pattern: /^(?!.*\.\.).*$/, description: 'Cannot contain ".."' },
  { name: 'No leading/trailing dots', pattern: /^(?!\.).*(?<!\.)$/, description: 'Cannot start or end with "."' },
  { name: 'No special chars', pattern: /^[^~^:?*\[\]\\@{}\s]+$/, description: 'Cannot contain ~ ^ : ? * [ ] \\ @ { }' },
  { name: 'No @{', pattern: /^(?!.*@\{).*$/, description: 'Cannot contain "@{"' },
  { name: 'No trailing slash', pattern: /^.*[^/]$/, description: 'Cannot end with "/"' },
  { name: 'No consecutive slashes', pattern: /^(?!.*\/\/).*$/, description: 'Cannot contain "//"' },
  { name: 'No trailing .lock', pattern: /^(?!.*\.lock$).*$/, description: 'Cannot end with ".lock"' },
];

function validateBranch(name: string, convention: NamingConvention): { rules: ValidationRule[]; matchesConvention: boolean } {
  const rules = GIT_RULES.map(rule => ({
    ...rule,
    valid: rule.pattern.test(name),
  }));
  
  const matchesConvention = convention.pattern.test(name);
  
  return { rules, matchesConvention };
}

function suggestBranchName(input: string, convention: NamingConvention): string {
  let suggestion = input
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[~^:?*\[\]\\@{}]/g, '')
    .replace(/\.{2,}/g, '.')
    .replace(/^\.+|\.+$/g, '')
    .replace(/\/+/g, '/')
    .replace(/\/$/g, '')
    .replace(/\.lock$/g, '');
  
  if (convention.name === 'Git Flow' && !suggestion.match(/^(feature|bugfix|hotfix|release|support)\//)) {
    suggestion = `feature/${suggestion}`;
  }
  
  return suggestion;
}

export default function GitBranchNamingValidator() {
  const t = useTranslations('tools.git-branch-naming-validator');
  const tCommon = useTranslations('tools');
  const [branchName, setBranchName] = useState('');
  const [selectedConvention, setSelectedConvention] = useState(NAMING_CONVENTIONS[0]);
  const [copied, setCopied] = useState(false);

  const validation = useMemo(() => {
    if (!branchName) return null;
    return validateBranch(branchName, selectedConvention);
  }, [branchName, selectedConvention]);

  const suggestion = useMemo(() => {
    if (!branchName) return '';
    return suggestBranchName(branchName, selectedConvention);
  }, [branchName, selectedConvention]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(suggestion);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [suggestion]);

  const allRulesPass = validation?.rules.every(r => r.valid) ?? false;
  const isValid = allRulesPass && (validation?.matchesConvention ?? false);

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('namingConvention')}
        </label>
        <select
          value={selectedConvention.name}
          onChange={(e) => setSelectedConvention(NAMING_CONVENTIONS.find(c => c.name === e.target.value) || NAMING_CONVENTIONS[0])}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          {NAMING_CONVENTIONS.map(conv => (
            <option key={conv.name} value={conv.name}>
              {conv.name} - {conv.description}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">Example: <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">{selectedConvention.example}</code></p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('branchName')}
        </label>
        <input
          type="text"
          value={branchName}
          onChange={(e) => setBranchName(e.target.value)}
          placeholder={t("inputPlaceholder")}
          className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${
            branchName && !isValid ? 'border-red-500' : branchName && isValid ? 'border-green-500' : 'border-gray-300 dark:border-gray-600'
          }`}
        />
      </div>

      {validation && (
        <>
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{t('gitRules')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {validation.rules.map((rule, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <span className={rule.valid ? 'text-green-500' : 'text-red-500'}>
                    {rule.valid ? '✓' : '✗'}
                  </span>
                  <span className={rule.valid ? 'text-gray-600 dark:text-gray-400' : 'text-red-600 dark:text-red-400'}>
                    {rule.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className={`p-4 rounded-lg ${validation.matchesConvention ? 'bg-green-50 dark:bg-green-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'}`}>
            <div className="flex items-center gap-2">
              <span className={validation.matchesConvention ? 'text-green-500' : 'text-yellow-500'}>
                {validation.matchesConvention ? '✓' : '⚠'}
              </span>
              <span className={validation.matchesConvention ? 'text-green-700 dark:text-green-300' : 'text-yellow-700 dark:text-yellow-300'}>
                {validation.matchesConvention 
                  ? `Matches ${selectedConvention.name} convention` 
                  : `Does not match ${selectedConvention.name} convention`}
              </span>
            </div>
          </div>

          {!isValid && suggestion && suggestion !== branchName && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">{t('suggestedName')}</h3>
                <button
                  onClick={handleCopy}
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  {copied ? tCommon('copied') : tCommon('copy')}
                </button>
              </div>
              <code className="text-sm text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-800/30 px-2 py-1 rounded">
                {suggestion}
              </code>
            </div>
          )}
        </>
      )}

      <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('commonBranchPrefixes')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
          <div><code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">feature/</code> {t('newFeatures')}</div>
          <div><code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">bugfix/</code> {t('bugFixes')}</div>
          <div><code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">hotfix/</code> {t('urgentFixes')}</div>
          <div><code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">release/</code> {t('releasePrep')}</div>
          <div><code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">docs/</code> {t('documentation')}</div>
          <div><code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">test/</code> {t('testing')}</div>
        </div>
      </div>
    </div>
  );
}
