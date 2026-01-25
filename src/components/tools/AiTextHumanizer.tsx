'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

type Intensity = 'light' | 'medium' | 'strong';

// AI 模式词汇替换规则
const AI_PATTERNS: Record<Intensity, Array<[RegExp, string[]]>> = {
  light: [
    [/\bfurthermore\b/gi, ['also', 'plus', 'and']],
    [/\bmoreover\b/gi, ['also', 'besides', 'and']],
    [/\butilize\b/gi, ['use', 'apply']],
    [/\bleverage\b/gi, ['use', 'apply']],
    [/\bfacilitate\b/gi, ['help', 'enable', 'make easier']],
  ],
  medium: [
    [/\bfurthermore\b/gi, ['also', 'plus', 'and', "what's more"]],
    [/\bmoreover\b/gi, ['also', 'besides', 'and', 'on top of that']],
    [/\butilize\b/gi, ['use', 'apply', 'work with']],
    [/\bleverage\b/gi, ['use', 'apply', 'take advantage of']],
    [/\bfacilitate\b/gi, ['help', 'enable', 'make easier', 'support']],
    [/\bimplement\b/gi, ['set up', 'put in place', 'create']],
    [/\boptimize\b/gi, ['improve', 'make better', 'fine-tune']],
    [/\benhance\b/gi, ['improve', 'boost', 'make better']],
    [/\bcomprehensive\b/gi, ['complete', 'full', 'thorough']],
    [/\brobust\b/gi, ['strong', 'solid', 'reliable']],
  ],
  strong: [
    [/\bfurthermore\b/gi, ['also', 'plus', 'and', "what's more", 'on another note']],
    [/\bmoreover\b/gi, ['also', 'besides', 'and', 'on top of that', 'not only that']],
    [/\butilize\b/gi, ['use', 'apply', 'work with', 'put to use']],
    [/\bleverage\b/gi, ['use', 'apply', 'take advantage of', 'make use of']],
    [/\bfacilitate\b/gi, ['help', 'enable', 'make easier', 'support', 'assist with']],
    [/\bimplement\b/gi, ['set up', 'put in place', 'create', 'build', 'make']],
    [/\boptimize\b/gi, ['improve', 'make better', 'fine-tune', 'tweak']],
    [/\benhance\b/gi, ['improve', 'boost', 'make better', 'upgrade']],
    [/\bcomprehensive\b/gi, ['complete', 'full', 'thorough', 'all-around']],
    [/\brobust\b/gi, ['strong', 'solid', 'reliable', 'sturdy']],
    [/\bseamless\b/gi, ['smooth', 'easy', 'effortless', 'simple']],
    [/\binnovative\b/gi, ['new', 'creative', 'fresh', 'original']],
    [/\bcutting-edge\b/gi, ['latest', 'modern', 'advanced', 'new']],
    [/\bstate-of-the-art\b/gi, ['latest', 'modern', 'top-notch', 'best']],
    [/\bparadigm\b/gi, ['model', 'approach', 'way', 'method']],
  ],
};

const FILLER_WORDS = ['well', 'you know', 'basically', 'actually', 'honestly', 'I mean'];

export default function AiTextHumanizer() {
  const t = useTranslations('tools.ai-text-humanizer');
  const tg = useTranslations('tools');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [intensity, setIntensity] = useState<Intensity>('medium');
  const [addFillers, setAddFillers] = useState(false);
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const humanize = useCallback(() => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    let result = input;
    const patterns = AI_PATTERNS[intensity];

    patterns.forEach(([pattern, replacements]) => {
      result = result.replace(pattern, () => {
        const idx = Math.floor(Math.random() * replacements.length);
        return replacements[idx];
      });
    });

    if (addFillers) {
      const sentences = result.split(/(?<=[.!?])\s+/);
      result = sentences.map((sentence, i) => {
        if (i > 0 && Math.random() > 0.7) {
          const filler = FILLER_WORDS[Math.floor(Math.random() * FILLER_WORDS.length)];
          return filler.charAt(0).toUpperCase() + filler.slice(1) + ', ' + sentence.charAt(0).toLowerCase() + sentence.slice(1);
        }
        return sentence;
      }).join(' ');
    }

    setOutput(result);
  }, [input, intensity, addFillers]);

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

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-center">
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">{t('intensity')}</label>
          <select
            value={intensity}
            onChange={(e) => setIntensity(e.target.value as Intensity)}
            className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white"
          >
            <option value="light">{t('light')}</option>
            <option value="medium">{t('medium')}</option>
            <option value="strong">{t('strong')}</option>
          </select>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={addFillers}
            onChange={(e) => setAddFillers(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm text-gray-600 dark:text-gray-300">{t('addFillers')}</span>
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={humanize} className="btn-primary">
          {t('humanize')}
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
