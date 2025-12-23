'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface PatternOption {
  id: string;
  labelKey: string;
  pattern: string;
  descKey: string;
}

const COMMON_PATTERNS: PatternOption[] = [
  { id: 'email', labelKey: 'email', pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$', descKey: 'emailDesc' },
  { id: 'phone', labelKey: 'phone', pattern: '^\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}$', descKey: 'phoneDesc' },
  { id: 'url', labelKey: 'url', pattern: '^https?:\\/\\/[\\w\\-]+(\\.[\\w\\-]+)+[/#?]?.*$', descKey: 'urlDesc' },
  { id: 'ip', labelKey: 'ip', pattern: '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$', descKey: 'ipDesc' },
  { id: 'date', labelKey: 'date', pattern: '^\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])$', descKey: 'dateDesc' },
  { id: 'time', labelKey: 'time', pattern: '^(?:[01]\\d|2[0-3]):[0-5]\\d$', descKey: 'timeDesc' },
  { id: 'hex', labelKey: 'hex', pattern: '^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$', descKey: 'hexDesc' },
  { id: 'username', labelKey: 'username', pattern: '^[a-zA-Z0-9_]{3,16}$', descKey: 'usernameDesc' },
  { id: 'password', labelKey: 'password', pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$', descKey: 'passwordDesc' },
  { id: 'zip', labelKey: 'zip', pattern: '^\\d{5}(-\\d{4})?$', descKey: 'zipDesc' },
  { id: 'creditcard', labelKey: 'creditcard', pattern: '^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13})$', descKey: 'creditcardDesc' },
  { id: 'slug', labelKey: 'slug', pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$', descKey: 'slugDesc' },
];

export default function RegexGenerator() {
  const t = useTranslations('tools.regex-generator');
  const [selectedPattern, setSelectedPattern] = useState<string>('');
  const [customPattern, setCustomPattern] = useState('');
  const [testString, setTestString] = useState('');
  const [flags, setFlags] = useState({ g: true, i: false, m: false });
  const [matches, setMatches] = useState<string[]>([]);

  const currentPattern = selectedPattern 
    ? COMMON_PATTERNS.find(p => p.id === selectedPattern)?.pattern || ''
    : customPattern;

  const testPattern = () => {
    if (!currentPattern || !testString) {
      setMatches([]);
      return;
    }
    
    try {
      const flagStr = Object.entries(flags).filter(([, v]) => v).map(([k]) => k).join('');
      const regex = new RegExp(currentPattern, flagStr);
      const found = testString.match(regex);
      setMatches(found || []);
    } catch {
      setMatches([]);
    }
  };

  const copyPattern = () => {
    navigator.clipboard.writeText(currentPattern);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">{t('commonPatterns')}</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {COMMON_PATTERNS.map((pattern) => (
            <button key={pattern.id}
              onClick={() => { setSelectedPattern(pattern.id); setCustomPattern(''); }}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedPattern === pattern.id ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
              }`}>
              {t(`patterns.${pattern.labelKey}`)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {selectedPattern ? t(`patterns.${COMMON_PATTERNS.find(p => p.id === selectedPattern)?.descKey}`) : t('customPattern')}
        </label>
        <input type="text" value={currentPattern}
          onChange={(e) => { setCustomPattern(e.target.value); setSelectedPattern(''); }}
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white font-mono"
          placeholder={t('placeholder')} />
      </div>

      <div className="flex gap-4">
        <label className="flex items-center gap-2 text-gray-300">
          <input type="checkbox" checked={flags.g} onChange={(e) => setFlags({...flags, g: e.target.checked})} /> {t('flagGlobal')}
        </label>
        <label className="flex items-center gap-2 text-gray-300">
          <input type="checkbox" checked={flags.i} onChange={(e) => setFlags({...flags, i: e.target.checked})} /> {t('flagCaseInsensitive')}
        </label>
        <label className="flex items-center gap-2 text-gray-300">
          <input type="checkbox" checked={flags.m} onChange={(e) => setFlags({...flags, m: e.target.checked})} /> {t('flagMultiline')}
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">{t('testString')}</label>
        <textarea value={testString} onChange={(e) => setTestString(e.target.value)}
          className="w-full h-32 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
          placeholder={t('testPlaceholder')} />
      </div>

      <div className="flex gap-4">
        <button onClick={testPattern}
          className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors">
          {t('testPattern')}
        </button>
        <button onClick={copyPattern} disabled={!currentPattern}
          className="px-6 py-2 bg-gray-600 hover:bg-gray-9000 disabled:opacity-50 rounded-lg font-medium transition-colors">
          {t('copy')}
        </button>
      </div>

      {matches.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">{t('matches')} ({matches.length})</label>
          <div className="bg-gray-700 rounded-lg p-4 space-y-2">
            {matches.map((match, i) => (
              <div key={i} className="px-3 py-2 bg-gray-600 rounded font-mono text-green-400">{match}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
