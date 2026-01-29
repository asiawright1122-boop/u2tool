'use client';

import { useState, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';

interface CommitConfig {
  type: string;
  scope: string;
  subject: string;
  body: string;
  breaking: boolean;
  breakingDescription: string;
  issues: string;
}

// Commit types with translation keys
const COMMIT_TYPE_KEYS = [
  'feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'build', 'ci', 'chore', 'revert'
] as const;

function generateCommitMessage(config: CommitConfig): string {
  let message = '';
  
  // Header: type(scope): subject
  message += config.type;
  if (config.scope) {
    message += `(${config.scope})`;
  }
  if (config.breaking) {
    message += '!';
  }
  message += `: ${config.subject}`;
  
  // Body
  if (config.body) {
    message += `\n\n${config.body}`;
  }
  
  // Breaking change footer
  if (config.breaking && config.breakingDescription) {
    message += `\n\nBREAKING CHANGE: ${config.breakingDescription}`;
  }
  
  // Issues footer
  if (config.issues) {
    const issueRefs = config.issues.split(',').map(i => i.trim()).filter(Boolean);
    if (issueRefs.length > 0) {
      const closes = issueRefs.map(ref => {
        if (ref.startsWith('#')) return `Closes ${ref}`;
        if (/^\d+$/.test(ref)) return `Closes #${ref}`;
        return `Closes ${ref}`;
      }).join('\n');
      message += `\n\n${closes}`;
    }
  }
  
  return message;
}

export default function GitCommitMessageGenerator() {
  const t = useTranslations('tools.git-commit-message-generator');
  const tCommon = useTranslations('tools');
  const [config, setConfig] = useState<CommitConfig>({
    type: 'feat',
    scope: '',
    subject: '',
    body: '',
    breaking: false,
    breakingDescription: '',
    issues: '',
  });
  const [copied, setCopied] = useState(false);

  const updateConfig = useCallback(<K extends keyof CommitConfig>(key: K, value: CommitConfig[K]) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  }, []);

  const commitMessage = useMemo(() => generateCommitMessage(config), [config]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(commitMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [commitMessage]);

  const isValid = config.type && config.subject.length > 0 && config.subject.length <= 72;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('commitType')} *
          </label>
          <select
            value={config.type}
            onChange={(e) => updateConfig('type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            {COMMIT_TYPE_KEYS.map(type => (
              <option key={type} value={type}>
                {type} - {t(`types.${type}`)}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('scope')}
          </label>
          <input
            type="text"
            value={config.scope}
            onChange={(e) => updateConfig('scope', e.target.value)}
            placeholder={t('scopePlaceholder')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('subject')} * <span className="text-xs text-gray-500">({config.subject.length}/72)</span>
        </label>
        <input
          type="text"
          value={config.subject}
          onChange={(e) => updateConfig('subject', e.target.value)}
          placeholder={t('subjectPlaceholder')}
          maxLength={72}
          className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${
            config.subject.length > 72 ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          }`}
        />
        <p className="text-xs text-gray-500 mt-1">{t('subjectHint')}</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('body')}
        </label>
        <textarea
          value={config.body}
          onChange={(e) => updateConfig('body', e.target.value)}
          placeholder={t('bodyPlaceholder')}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
        />
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={config.breaking}
            onChange={(e) => updateConfig('breaking', e.target.checked)}
            className="rounded"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">{t('breakingChange')}</span>
        </label>
      </div>

      {config.breaking && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('breakingDescription')}
          </label>
          <textarea
            value={config.breakingDescription}
            onChange={(e) => updateConfig('breakingDescription', e.target.value)}
            placeholder={t('breakingPlaceholder')}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('relatedIssues')}
        </label>
        <input
          type="text"
          value={config.issues}
          onChange={(e) => updateConfig('issues', e.target.value)}
          placeholder={t('issuesPlaceholder')}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('generatedMessage')}
          </label>
          <button
            onClick={handleCopy}
            disabled={!isValid}
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 disabled:opacity-50"
          >
            {copied ? tCommon('copied') : tCommon('copy')}
          </button>
        </div>
        <pre className={`p-4 rounded-lg overflow-x-auto text-sm font-mono whitespace-pre-wrap ${
          isValid 
            ? 'bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200' 
            : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
        }`}>
          {commitMessage || t('emptyMessage')}
        </pre>
      </div>

      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">{t('formatTitle')}</h3>
        <code className="text-xs text-blue-700 dark:text-blue-300">
          &lt;type&gt;[optional scope][!]: &lt;description&gt;<br/>
          [optional body]<br/>
          [optional footer(s)]
        </code>
      </div>
    </div>
  );
}
