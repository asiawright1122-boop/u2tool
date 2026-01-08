'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';

export default function TextSummarizer() {
  const t = useTranslations('tools.text-summarizer');
  const tc = useTranslations('tools');
  
  const [text, setText] = useState('');
  const [summaryLength, setSummaryLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [copied, setCopied] = useState(false);

  const summary = useMemo(() => {
    if (!text.trim()) return null;

    // Split into sentences
    const sentences = text
      .replace(/([.!?])\s+/g, '$1|')
      .split('|')
      .map(s => s.trim())
      .filter(s => s.length > 10);

    if (sentences.length === 0) return null;

    // Score sentences based on various factors
    const wordFreq: Record<string, number> = {};
    const allWords = text.toLowerCase().match(/\b[a-z]+\b/g) || [];
    allWords.forEach(word => {
      if (word.length > 3) {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      }
    });

    const scoredSentences = sentences.map((sentence, index) => {
      let score = 0;
      const words = sentence.toLowerCase().match(/\b[a-z]+\b/g) || [];
      
      // Word frequency score
      words.forEach(word => {
        score += wordFreq[word] || 0;
      });
      
      // Position score (first and last sentences are important)
      if (index === 0) score *= 1.5;
      if (index === sentences.length - 1) score *= 1.2;
      
      // Length penalty (too short or too long)
      if (words.length < 5) score *= 0.5;
      if (words.length > 30) score *= 0.8;
      
      // Normalize by length
      score = score / Math.max(words.length, 1);
      
      return { sentence, score, index };
    });

    // Determine number of sentences based on length setting
    const targetCount = {
      short: Math.max(1, Math.floor(sentences.length * 0.2)),
      medium: Math.max(2, Math.floor(sentences.length * 0.35)),
      long: Math.max(3, Math.floor(sentences.length * 0.5)),
    }[summaryLength];

    // Select top sentences and sort by original order
    const selected = scoredSentences
      .sort((a, b) => b.score - a.score)
      .slice(0, targetCount)
      .sort((a, b) => a.index - b.index)
      .map(s => s.sentence);

    const summaryText = selected.join(' ');
    const reduction = Math.round((1 - summaryText.length / text.length) * 100);

    return {
      text: summaryText,
      originalWords: allWords.length,
      summaryWords: summaryText.match(/\b[a-z]+\b/gi)?.length || 0,
      sentences: selected.length,
      reduction,
    };
  }, [text, summaryLength]);

  const copyToClipboard = async () => {
    if (summary) {
      await navigator.clipboard.writeText(summary.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('enterText')}
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={tc('inputPlaceholder')}
          rows={8}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>

      {/* Length Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('summaryLength')}
        </label>
        <div className="flex gap-2">
          {(['short', 'medium', 'long'] as const).map(len => (
            <button
              key={len}
              onClick={() => setSummaryLength(len)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                summaryLength === len
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {t(len)}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Output */}
      {summary && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{summary.originalWords}</div>
              <div className="text-xs text-gray-500">{t('originalWords')}</div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">{summary.summaryWords}</div>
              <div className="text-xs text-gray-500">{t('summaryWords')}</div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{summary.sentences}</div>
              <div className="text-xs text-gray-500">{t('sentences')}</div>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">{summary.reduction}%</div>
              <div className="text-xs text-gray-500">{t('reduction')}</div>
            </div>
          </div>

          {/* Summary Text */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-900 dark:text-white">{t('summary')}</h3>
              <button
                onClick={copyToClipboard}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  copied
                    ? 'bg-green-600 text-white'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {copied ? tc('copied') : tc('copy')}
              </button>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {summary.text}
            </p>
          </div>
        </>
      )}

      {/* Tips */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
        <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">{t('tips')}</h4>
        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1 list-disc list-inside">
          <li>{t('tip1')}</li>
          <li>{t('tip2')}</li>
          <li>{t('tip3')}</li>
        </ul>
      </div>
    </div>
  );
}
