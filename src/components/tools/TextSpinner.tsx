'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

// 同义词词典
const SYNONYMS: Record<string, string[]> = {
  'good': ['great', 'excellent', 'fine', 'wonderful', 'superb'],
  'bad': ['poor', 'terrible', 'awful', 'dreadful', 'horrible'],
  'big': ['large', 'huge', 'enormous', 'massive', 'giant'],
  'small': ['tiny', 'little', 'miniature', 'compact', 'petite'],
  'fast': ['quick', 'rapid', 'swift', 'speedy', 'hasty'],
  'slow': ['sluggish', 'gradual', 'leisurely', 'unhurried'],
  'happy': ['joyful', 'cheerful', 'delighted', 'pleased', 'content'],
  'sad': ['unhappy', 'sorrowful', 'melancholy', 'gloomy', 'dejected'],
  'important': ['significant', 'crucial', 'vital', 'essential', 'key'],
  'easy': ['simple', 'effortless', 'straightforward', 'uncomplicated'],
  'hard': ['difficult', 'challenging', 'tough', 'demanding'],
  'new': ['fresh', 'novel', 'recent', 'modern', 'latest'],
  'old': ['ancient', 'aged', 'vintage', 'antique', 'dated'],
  'beautiful': ['gorgeous', 'stunning', 'lovely', 'attractive', 'pretty'],
  'ugly': ['unattractive', 'hideous', 'unsightly', 'grotesque'],
  'smart': ['intelligent', 'clever', 'bright', 'brilliant', 'wise'],
  'help': ['assist', 'aid', 'support', 'facilitate'],
  'make': ['create', 'produce', 'build', 'construct', 'generate'],
  'use': ['utilize', 'employ', 'apply', 'leverage'],
  'get': ['obtain', 'acquire', 'receive', 'gain', 'fetch'],
  'show': ['display', 'demonstrate', 'present', 'exhibit', 'reveal'],
  'think': ['believe', 'consider', 'suppose', 'assume', 'reckon'],
  'say': ['state', 'mention', 'express', 'declare', 'assert'],
};

type Level = 'conservative' | 'moderate' | 'aggressive';

export default function TextSpinner() {
  const t = useTranslations('tools.text-spinner');
  const tg = useTranslations('tools');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [level, setLevel] = useState<Level>('moderate');
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const getReplacementChance = (level: Level): number => {
    switch (level) {
      case 'conservative': return 0.3;
      case 'moderate': return 0.5;
      case 'aggressive': return 0.8;
    }
  };

  const spin = useCallback(() => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    const chance = getReplacementChance(level);
    const words = input.split(/(\s+)/);
    
    const result = words.map(word => {
      const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
      if (SYNONYMS[cleanWord] && Math.random() < chance) {
        const synonyms = SYNONYMS[cleanWord];
        const synonym = synonyms[Math.floor(Math.random() * synonyms.length)];
        // 保持原始大小写
        if (word[0] === word[0].toUpperCase()) {
          return synonym.charAt(0).toUpperCase() + synonym.slice(1);
        }
        return synonym;
      }
      return word;
    }).join('');

    setOutput(result);
  }, [input, level]);

  const copyOutput = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 2000);
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
  };

  // 计算唯一性评分
  const calculateUniqueness = (): number => {
    if (!input || !output) return 0;
    const inputWords = input.toLowerCase().split(/\s+/);
    const outputWords = output.toLowerCase().split(/\s+/);
    let different = 0;
    inputWords.forEach((word, i) => {
      if (outputWords[i] && word !== outputWords[i]) different++;
    });
    return Math.round((different / inputWords.length) * 100);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-center">
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('level')}</label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value as Level)}
            className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white"
          >
            <option value="conservative">{t('conservative')}</option>
            <option value="moderate">{t('moderate')}</option>
            <option value="aggressive">{t('aggressive')}</option>
          </select>
        </div>
        {output && (
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {t('uniqueness')}: <span className="font-bold text-blue-600">{calculateUniqueness()}%</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={spin} className="btn-primary">
          {t('spin')}
        </button>
        <button onClick={copyOutput} disabled={!output} className="btn-secondary">
          {copied ? tg('copied') : tg('copy')}
        </button>
        <button onClick={clearAll} className="btn-secondary">
          {tg('clear')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">{tg('input')}</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-64 bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
            placeholder={t('inputPlaceholder')}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">{tg('output')}</label>
          <textarea
            value={output}
            readOnly
            className="w-full h-64 bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
          />
        </div>
      </div>
    </div>
  );
}
