'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

const invisibleChars = [
  { name: 'Zero Width Space', code: '\u200B', unicode: 'U+200B', description: 'Most common invisible character' },
  { name: 'Zero Width Non-Joiner', code: '\u200C', unicode: 'U+200C', description: 'Prevents ligatures' },
  { name: 'Zero Width Joiner', code: '\u200D', unicode: 'U+200D', description: 'Creates ligatures, used in emoji' },
  { name: 'Word Joiner', code: '\u2060', unicode: 'U+2060', description: 'Prevents line breaks' },
  { name: 'Zero Width No-Break Space', code: '\uFEFF', unicode: 'U+FEFF', description: 'BOM character' },
  { name: 'Soft Hyphen', code: '\u00AD', unicode: 'U+00AD', description: 'Optional hyphenation point' },
  { name: 'Hair Space', code: '\u200A', unicode: 'U+200A', description: 'Very thin space' },
  { name: 'Six-Per-Em Space', code: '\u2006', unicode: 'U+2006', description: '1/6 em space' },
  { name: 'Thin Space', code: '\u2009', unicode: 'U+2009', description: '1/5 em space' },
  { name: 'Narrow No-Break Space', code: '\u202F', unicode: 'U+202F', description: 'Narrow non-breaking space' },
  { name: 'Medium Mathematical Space', code: '\u205F', unicode: 'U+205F', description: '4/18 em space' },
  { name: 'Ideographic Space', code: '\u3000', unicode: 'U+3000', description: 'Full-width space' },
];

export default function InvisibleCharacterGenerator() {
  const t = useTranslations('tools.invisible-character-generator');
  const [selectedChar, setSelectedChar] = useState(invisibleChars[0]);
  const [count, setCount] = useState(1);
  const [copied, setCopied] = useState<string | null>(null);
  const [testInput, setTestInput] = useState('');

  const generateChars = (): string => {
    return selectedChar.code.repeat(count);
  };

  const copyChar = (char: typeof invisibleChars[0], times: number = 1) => {
    navigator.clipboard.writeText(char.code.repeat(times));
    setCopied(char.unicode);
    setTimeout(() => setCopied(null), 2000);
  };

  const copyGenerated = () => {
    navigator.clipboard.writeText(generateChars());
    setCopied('generated');
    setTimeout(() => setCopied(null), 2000);
  };

  const detectInvisible = (text: string): { char: string; count: number; name: string }[] => {
    const found: { char: string; count: number; name: string }[] = [];
    invisibleChars.forEach(ic => {
      const matches = text.split(ic.code).length - 1;
      if (matches > 0) {
        found.push({ char: ic.unicode, count: matches, name: ic.name });
      }
    });
    return found;
  };

  const detectedChars = detectInvisible(testInput);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('selectCharacter')}
          </label>
          <select
            value={selectedChar.unicode}
            onChange={(e) => setSelectedChar(invisibleChars.find(c => c.unicode === e.target.value) || invisibleChars[0])}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            {invisibleChars.map(char => (
              <option key={char.unicode} value={char.unicode}>
                {char.name} ({char.unicode})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('repeatCount')}
          </label>
          <input
            type="number"
            value={count}
            onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
            min="1"
            max="100"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{selectedChar.description}</p>
        <div className="flex items-center gap-4">
          <div className="flex-1 px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg font-mono">
            <span className="text-gray-400">[</span>
            <span className="bg-yellow-200 dark:bg-yellow-800">{generateChars()}</span>
            <span className="text-gray-400">]</span>
            <span className="ml-2 text-sm text-gray-500">({count} {t('characters')})</span>
          </div>
          <button
            onClick={copyGenerated}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {copied === 'generated' ? t('copied') : t('copy')}
          </button>
        </div>
      </div>

      <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
        <h3 className="font-medium text-gray-900 dark:text-white mb-3">{t('allCharacters')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {invisibleChars.map(char => (
            <button
              key={char.unicode}
              onClick={() => copyChar(char)}
              className={`p-3 text-left rounded-lg border transition-colors ${
                copied === char.unicode
                  ? 'bg-green-100 dark:bg-green-900/30 border-green-500'
                  : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-blue-500'
              }`}
            >
              <div className="font-mono text-sm text-blue-600 dark:text-blue-400">{char.unicode}</div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">{char.name}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{char.description}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
        <h3 className="font-medium text-purple-800 dark:text-purple-300 mb-3">{t('detectTitle')}</h3>
        <textarea
          value={testInput}
          onChange={(e) => setTestInput(e.target.value)}
          placeholder={t('detectPlaceholder')}
          className="w-full h-24 px-4 py-3 border border-purple-200 dark:border-purple-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white mb-3"
        />
        {detectedChars.length > 0 ? (
          <div className="space-y-1">
            {detectedChars.map((d, i) => (
              <div key={i} className="text-sm text-purple-700 dark:text-purple-400">
                ✓ {d.name} ({d.char}): {d.count} {t('found')}
              </div>
            ))}
          </div>
        ) : testInput ? (
          <p className="text-sm text-purple-600 dark:text-purple-400">{t('noInvisibleFound')}</p>
        ) : null}
      </div>

      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
        <h3 className="font-medium text-yellow-800 dark:text-yellow-300 mb-2">{t('useCases')}</h3>
        <ul className="text-sm text-yellow-700 dark:text-yellow-400 space-y-1">
          <li>• {t('useCase1')}</li>
          <li>• {t('useCase2')}</li>
          <li>• {t('useCase3')}</li>
        </ul>
      </div>
    </div>
  );
}
