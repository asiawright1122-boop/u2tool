'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';

const COMMIT_TYPES = [
  { value: 'feat', label: 'feat', description: 'A new feature' },
  { value: 'fix', label: 'fix', description: 'A bug fix' },
  { value: 'docs', label: 'docs', description: 'Documentation only changes' },
  { value: 'style', label: 'style', description: 'Code style changes (formatting, etc)' },
  { value: 'refactor', label: 'refactor', description: 'Code refactoring' },
  { value: 'perf', label: 'perf', description: 'Performance improvements' },
  { value: 'test', label: 'test', description: 'Adding or updating tests' },
  { value: 'build', label: 'build', description: 'Build system or dependencies' },
  { value: 'ci', label: 'ci', description: 'CI configuration changes' },
  { value: 'chore', label: 'chore', description: 'Other changes' },
  { value: 'revert', label: 'revert', description: 'Revert a previous commit' },
];

export default function CommitMessageGenerator() {
  const t = useTranslations('tools.commit-message-generator');
  const common = useTranslations('tools');

  const [type, setType] = useState('feat');
  const [scope, setScope] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [footer, setFooter] = useState('');
  const [isBreaking, setIsBreaking] = useState(false);
  const [copied, setCopied] = useState(false);

  const commitMessage = useMemo(() => {
    let message = type;
    
    if (scope) {
      message += `(${scope})`;
    }
    
    if (isBreaking) {
      message += '!';
    }
    
    message += `: ${subject}`;
    
    if (body) {
      message += `\n\n${body}`;
    }
    
    if (isBreaking && !footer.includes('BREAKING CHANGE')) {
      message += `\n\nBREAKING CHANGE: ${subject}`;
    }
    
    if (footer) {
      message += `\n\n${footer}`;
    }
    
    return message;
  }, [type, scope, subject, body, footer, isBreaking]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(commitMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const subjectLength = subject.length;
  const isSubjectTooLong = subjectLength > 50;

  return (
    <div className="space-y-6">
      {/* Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('type')} *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {COMMIT_TYPES.map((ct) => (
            <button
              key={ct.value}
              onClick={() => setType(ct.value)}
              className={`px-3 py-2 text-sm rounded-lg border transition-colors text-left ${
                type === ct.value
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-400'
              }`}
              title={ct.description}
            >
              <span className="font-mono">{ct.label}</span>
            </button>
          ))}
        </div>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {COMMIT_TYPES.find(ct => ct.value === type)?.description}
        </p>
      </div>

      {/* Scope */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('scope')} ({t('optional')})
        </label>
        <input
          type="text"
          value={scope}
          onChange={(e) => setScope(e.target.value)}
          placeholder={t('scopePlaceholder')}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400"
        />
      </div>

      {/* Subject */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('subject')} *
        </label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder={t('subjectPlaceholder')}
          className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 ${
            isSubjectTooLong 
              ? 'border-yellow-500 dark:border-yellow-500' 
              : 'border-gray-300 dark:border-gray-600'
          }`}
        />
        <p className={`mt-1 text-xs ${isSubjectTooLong ? 'text-yellow-500' : 'text-gray-500 dark:text-gray-400'}`}>
          {subjectLength}/50 {t('characters')} {isSubjectTooLong && `(${t('recommended50')})`}
        </p>
      </div>

      {/* Breaking Change */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="breaking"
          checked={isBreaking}
          onChange={(e) => setIsBreaking(e.target.checked)}
          className="w-4 h-4 text-blue-500 rounded border-gray-300 focus:ring-blue-500"
        />
        <label htmlFor="breaking" className="text-sm text-gray-700 dark:text-gray-300">
          {t('breakingChange')}
        </label>
      </div>

      {/* Body */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('body')} ({t('optional')})
        </label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={t('bodyPlaceholder')}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 resize-y"
        />
      </div>

      {/* Footer */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('footer')} ({t('optional')})
        </label>
        <textarea
          value={footer}
          onChange={(e) => setFooter(e.target.value)}
          placeholder={t('footerPlaceholder')}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 resize-y"
        />
      </div>

      {/* Output */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('commitMessage')}
          </label>
          <button
            onClick={handleCopy}
            disabled={!subject}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {copied ? common('copied') : common('copy')}
          </button>
        </div>
        <pre className="p-4 bg-gray-900 text-green-400 rounded-lg overflow-x-auto text-sm font-mono whitespace-pre-wrap">
          {commitMessage || t('preview')}
        </pre>
      </div>

      {/* Tips */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
          {t('tips')}
        </h4>
        <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-1 list-disc list-inside">
          <li>{t('tip1')}</li>
          <li>{t('tip2')}</li>
          <li>{t('tip3')}</li>
        </ul>
      </div>
    </div>
  );
}
