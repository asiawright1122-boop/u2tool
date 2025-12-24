'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';

export default function RegexTester() {
  const t = useTranslations('tools');
  const [pattern, setPattern] = useState('\\b\\w+@\\w+\\.\\w+\\b');
  const [flags, setFlags] = useState('gi');
  const [testString, setTestString] = useState('Contact us at hello@example.com or support@test.org for help.');
  const [error, setError] = useState('');

  const matches = useMemo(() => {
    if (!pattern) return [];
    try {
      const regex = new RegExp(pattern, flags);
      setError('');
      const results: { match: string; index: number; groups?: Record<string, string> }[] = [];
      let match;
      
      if (flags.includes('g')) {
        while ((match = regex.exec(testString)) !== null) {
          results.push({
            match: match[0],
            index: match.index,
            groups: match.groups,
          });
        }
      } else {
        match = regex.exec(testString);
        if (match) {
          results.push({
            match: match[0],
            index: match.index,
            groups: match.groups,
          });
        }
      }
      return results;
    } catch (_e) {
      setError((e as Error).message);
      return [];
    }
  }, [pattern, flags, testString]);

  const highlightedText = useMemo(() => {
    if (!pattern || error || matches.length === 0) return testString;
    
    try {
      const regex = new RegExp(pattern, flags);
      return testString.replace(regex, (match) => `<mark class="bg-yellow-500/50 text-white">${match}</mark>`);
    } catch {
      return testString;
    }
  }, [pattern, flags, testString, matches, error]);

  const toggleFlag = (flag: string) => {
    if (flags.includes(flag)) {
      setFlags(flags.replace(flag, ''));
    } else {
      setFlags(flags + flag);
    }
  };

  return (
    <div className="space-y-4">
      {/* Pattern Input */}
      <div>
        <label className="block text-sm font-medium mb-2">{t('regex.pattern')}</label>
        <div className="flex items-center gap-2">
          <span className="text-gray-300">/</span>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            className="flex-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded font-mono"
            placeholder={t('regex.pattern')}
          />
          <span className="text-gray-300">/</span>
          <input
            type="text"
            value={flags}
            onChange={(e) => setFlags(e.target.value)}
            className="w-16 px-3 py-2 bg-gray-900 border border-gray-700 rounded font-mono"
            placeholder="flags"
          />
        </div>
      </div>

      {/* Flags */}
      <div className="flex flex-wrap gap-2">
        {[
          { flag: 'g', label: t('regex.global') },
          { flag: 'i', label: t('regex.caseInsensitive') },
          { flag: 'm', label: t('regex.multiline') },
          { flag: 's', label: t('regex.dotall') },
        ].map(({ flag, label }) => (
          <button
            key={flag}
            onClick={() => toggleFlag(flag)}
            className={`px-3 py-1 text-sm rounded ${
              flags.includes(flag) ? 'bg-blue-600' : 'bg-gray-700'
            }`}
          >
            {flag} - {label}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Test String */}
      <div>
        <label className="block text-sm font-medium mb-2">{t('regex.testString')}</label>
        <textarea
          className="tool-textarea"
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          placeholder={t('regex.testString')}
        />
      </div>

      {/* Highlighted Result */}
      <div>
        <label className="block text-sm font-medium mb-2">
          {t('result')} ({matches.length} {t('match')}{matches.length !== 1 ? 'es' : ''})
        </label>
        <div
          className="p-4 bg-gray-900 border border-gray-700 rounded-lg font-mono text-sm whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: highlightedText }}
        />
      </div>

      {/* Matches List */}
      {matches.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-2">{t('matches')}</label>
          <div className="space-y-2">
            {matches.map((m, i) => (
              <div key={i} className="p-2 bg-gray-900 border border-gray-700 rounded text-sm">
                <span className="text-gray-300">#{i + 1}</span>
                <span className="mx-2 text-blue-400 font-mono">&quot;{m.match}&quot;</span>
                <span className="text-gray-300">{t('regex.atIndex')} {m.index}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
