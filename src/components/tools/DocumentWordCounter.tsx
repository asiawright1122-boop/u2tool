'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';

interface DocumentStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  pages: number;
  readingTime: number;
  speakingTime: number;
  uniqueWords: number;
  avgWordLength: number;
  avgSentenceLength: number;
  longestWord: string;
  mostFrequentWords: { word: string; count: number }[];
}

function analyzeDocument(text: string): DocumentStats {
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, '').length;
  
  // Words (handle multiple languages)
  const words = text.trim() ? text.trim().split(/\s+/).filter(w => w.length > 0) : [];
  const wordCount = words.length;
  
  // Sentences
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  
  // Paragraphs
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length || (text.trim() ? 1 : 0);
  
  // Lines
  const lines = text.split('\n').length;
  
  // Pages (assuming ~250 words per page)
  const pages = Math.ceil(wordCount / 250);
  
  // Reading time (200 words per minute)
  const readingTime = Math.ceil(wordCount / 200);
  
  // Speaking time (150 words per minute)
  const speakingTime = Math.ceil(wordCount / 150);
  
  // Unique words
  const wordLower = words.map(w => w.toLowerCase().replace(/[^\w]/g, ''));
  const uniqueWords = new Set(wordLower.filter(w => w.length > 0)).size;
  
  // Average word length
  const avgWordLength = wordCount > 0 
    ? words.reduce((sum, w) => sum + w.replace(/[^\w]/g, '').length, 0) / wordCount 
    : 0;
  
  // Average sentence length
  const avgSentenceLength = sentences > 0 ? wordCount / sentences : 0;
  
  // Longest word
  const longestWord = words.reduce((longest, w) => {
    const clean = w.replace(/[^\w]/g, '');
    return clean.length > longest.length ? clean : longest;
  }, '');
  
  // Most frequent words
  const wordFreq: Record<string, number> = {};
  for (const w of wordLower) {
    if (w.length > 2) {
      wordFreq[w] = (wordFreq[w] || 0) + 1;
    }
  }
  const mostFrequentWords = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word, count]) => ({ word, count }));
  
  return {
    characters,
    charactersNoSpaces,
    words: wordCount,
    sentences,
    paragraphs,
    lines,
    pages,
    readingTime,
    speakingTime,
    uniqueWords,
    avgWordLength: Math.round(avgWordLength * 10) / 10,
    avgSentenceLength: Math.round(avgSentenceLength * 10) / 10,
    longestWord,
    mostFrequentWords,
  };
}

const SAMPLE_TEXT = `The quick brown fox jumps over the lazy dog. This is a sample text to demonstrate the document word counter tool.

It can analyze various statistics about your text, including word count, character count, reading time, and more. The tool is useful for writers, students, and anyone who needs to track document length.

Try pasting your own text to see detailed statistics!`;

export default function DocumentWordCounter() {
  const t = useTranslations('tools.document-word-counter');
  const tCommon = useTranslations('tools');
  const [text, setText] = useState(SAMPLE_TEXT);

  const stats = useMemo(() => analyzeDocument(text), [text]);

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('documentText')}
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={tCommon('inputPlaceholder')}
          rows={10}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.words.toLocaleString()}</div>
          <div className="text-sm text-blue-700 dark:text-blue-300">{t('words')}</div>
        </div>
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.characters.toLocaleString()}</div>
          <div className="text-sm text-green-700 dark:text-green-300">{t('characters')}</div>
        </div>
        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.sentences}</div>
          <div className="text-sm text-purple-700 dark:text-purple-300">{t('sentences')}</div>
        </div>
        <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-center">
          <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{stats.paragraphs}</div>
          <div className="text-sm text-orange-700 dark:text-orange-300">{t('paragraphs')}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{t('detailedStatistics')}</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">{t('charactersNoSpaces')}</span>
              <span className="font-medium text-gray-900 dark:text-white">{stats.charactersNoSpaces.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">{t('lines')}</span>
              <span className="font-medium text-gray-900 dark:text-white">{stats.lines}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">{t('pages')}</span>
              <span className="font-medium text-gray-900 dark:text-white">{stats.pages}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">{t('uniqueWords')}</span>
              <span className="font-medium text-gray-900 dark:text-white">{stats.uniqueWords}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">{t('avgWordLength')}</span>
              <span className="font-medium text-gray-900 dark:text-white">{stats.avgWordLength} {t('chars')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">{t('avgSentenceLength')}</span>
              <span className="font-medium text-gray-900 dark:text-white">{stats.avgSentenceLength} {t('words')}</span>
            </div>
            {stats.longestWord && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">{t('longestWord')}</span>
                <span className="font-medium text-gray-900 dark:text-white">{stats.longestWord}</span>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{t('timeEstimates')}</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600 dark:text-gray-400">{t('readingTime')}</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{stats.readingTime} {t('min')}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${Math.min(100, stats.readingTime * 5)}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600 dark:text-gray-400">{t('speakingTime')}</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{stats.speakingTime} {t('min')}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: `${Math.min(100, stats.speakingTime * 5)}%` }} />
              </div>
            </div>
          </div>

          {stats.mostFrequentWords.length > 0 && (
            <div className="mt-4">
              <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">{t('topWords')}</h4>
              <div className="flex flex-wrap gap-1">
                {stats.mostFrequentWords.slice(0, 5).map(({ word, count }) => (
                  <span key={word} className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-gray-700 dark:text-gray-300">
                    {word} ({count})
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
