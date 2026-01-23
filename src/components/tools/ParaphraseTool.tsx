'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

type Style = 'formal' | 'casual' | 'simple' | 'creative';

// Simple word replacements for demonstration
const synonyms: Record<string, string[]> = {
  good: ['excellent', 'great', 'fine', 'wonderful', 'superb'],
  bad: ['poor', 'terrible', 'awful', 'dreadful', 'unpleasant'],
  big: ['large', 'huge', 'enormous', 'massive', 'substantial'],
  small: ['tiny', 'little', 'compact', 'miniature', 'modest'],
  fast: ['quick', 'rapid', 'swift', 'speedy', 'prompt'],
  slow: ['gradual', 'unhurried', 'leisurely', 'sluggish', 'steady'],
  happy: ['joyful', 'pleased', 'delighted', 'content', 'cheerful'],
  sad: ['unhappy', 'sorrowful', 'melancholy', 'gloomy', 'dejected'],
  important: ['significant', 'crucial', 'vital', 'essential', 'key'],
  help: ['assist', 'aid', 'support', 'facilitate', 'enable'],
  make: ['create', 'produce', 'generate', 'develop', 'construct'],
  use: ['utilize', 'employ', 'apply', 'leverage', 'implement'],
  show: ['demonstrate', 'display', 'reveal', 'present', 'exhibit'],
  get: ['obtain', 'acquire', 'receive', 'gain', 'secure'],
  give: ['provide', 'offer', 'supply', 'deliver', 'present'],
  think: ['believe', 'consider', 'suppose', 'assume', 'reckon'],
  say: ['state', 'mention', 'express', 'declare', 'articulate'],
  very: ['extremely', 'highly', 'remarkably', 'exceptionally', 'particularly'],
  also: ['additionally', 'furthermore', 'moreover', 'besides', 'likewise'],
  but: ['however', 'nevertheless', 'yet', 'although', 'though'],
};

export default function ParaphraseTool() {
  const t = useTranslations('tools.paraphrase-tool');
  const tc = useTranslations('tools');
  
  const [input, setInput] = useState('');
  const [style, setStyle] = useState<Style>('formal');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const styles: { id: Style; icon: string }[] = [
    { id: 'formal', icon: '👔' },
    { id: 'casual', icon: '😊' },
    { id: 'simple', icon: '📝' },
    { id: 'creative', icon: '🎨' },
  ];

  const paraphrase = () => {
    if (!input.trim()) return;

    let result = input;
    const words = input.split(/\b/);
    
    result = words.map(word => {
      const lowerWord = word.toLowerCase();
      const syns = synonyms[lowerWord];
      
      if (syns && Math.random() > 0.5) {
        // Pick synonym based on style
        let idx = 0;
        switch (style) {
          case 'formal': idx = 0; break;
          case 'casual': idx = Math.min(1, syns.length - 1); break;
          case 'simple': idx = Math.min(2, syns.length - 1); break;
          case 'creative': idx = Math.floor(Math.random() * syns.length); break;
        }
        
        const replacement = syns[idx];
        // Preserve capitalization
        if (word[0] === word[0].toUpperCase()) {
          return replacement.charAt(0).toUpperCase() + replacement.slice(1);
        }
        return replacement;
      }
      return word;
    }).join('');

    // Style-specific transformations
    if (style === 'formal') {
      result = result.replace(/don't/gi, 'do not');
      result = result.replace(/can't/gi, 'cannot');
      result = result.replace(/won't/gi, 'will not');
      result = result.replace(/isn't/gi, 'is not');
    } else if (style === 'casual') {
      result = result.replace(/do not/gi, "don't");
      result = result.replace(/cannot/gi, "can't");
      result = result.replace(/will not/gi, "won't");
    }

    setOutput(result);
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {

    return () => {

      if (timerRef.current) clearTimeout(timerRef.current);

    };

  }, []);


  return (
    <div className="space-y-6">
      {/* Style Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('selectStyle')}
        </label>
        <div className="flex flex-wrap gap-2">
          {styles.map(s => (
            <button
              key={s.id}
              onClick={() => setStyle(s.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                style === s.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <span>{s.icon}</span>
              <span>{t(s.id)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('originalText')}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={tc('inputPlaceholder')}
          rows={5}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>

      {/* Paraphrase Button */}
      <button
        onClick={paraphrase}
        disabled={!input.trim()}
        className="w-full py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {t('paraphrase')}
      </button>

      {/* Output */}
      {output && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-900 dark:text-white">{t('paraphrasedText')}</h3>
            <button
              onClick={copyToClipboard}
              className={`px-3 py-1 rounded text-sm font-medium ${
                copied
                  ? 'bg-green-600 text-white'
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
            >
              {copied ? tc('copied') : tc('copy')}
            </button>
          </div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
            {output}
          </p>
        </div>
      )}

      {/* Tips */}
      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
        <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-2">{t('tips')}</h4>
        <ul className="text-sm text-purple-700 dark:text-purple-300 space-y-1 list-disc list-inside">
          <li>{t('tip1')}</li>
          <li>{t('tip2')}</li>
          <li>{t('tip3')}</li>
        </ul>
      </div>
    </div>
  );
}
