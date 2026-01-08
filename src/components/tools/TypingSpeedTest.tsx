'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { calculateTypingStats, TypingTestResult } from '@/lib/calculator-utils';

export default function TypingSpeedTest() {
  const t = useTranslations('tools.typing-speed-test');
  
  // Get sample texts from translations
  const sampleTexts = useMemo(() => ({
    easy: [
      t('sampleTexts.easy.0'),
      t('sampleTexts.easy.1'),
      t('sampleTexts.easy.2'),
    ],
    medium: [
      t('sampleTexts.medium.0'),
      t('sampleTexts.medium.1'),
      t('sampleTexts.medium.2'),
    ],
    hard: [
      t('sampleTexts.hard.0'),
      t('sampleTexts.hard.1'),
      t('sampleTexts.hard.2'),
    ],
  }), [t]);

  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [targetText, setTargetText] = useState<string>('');
  const [typedText, setTypedText] = useState<string>('');
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [result, setResult] = useState<TypingTestResult | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const getRandomText = useCallback(() => {
    const texts = sampleTexts[difficulty];
    return texts[Math.floor(Math.random() * texts.length)];
  }, [difficulty]);

  useEffect(() => {
    setTargetText(getRandomText());
  }, [difficulty, getRandomText]);

  const startTest = () => {
    setTargetText(getRandomText());
    setTypedText('');
    setIsStarted(false);
    setIsFinished(false);
    setResult(null);
    inputRef.current?.focus();
  };

  const handleInput = (value: string) => {
    if (!isStarted && value.length > 0) {
      setIsStarted(true);
      setStartTime(Date.now());
    }

    setTypedText(value);

    if (value.length >= targetText.length) {
      const duration = Date.now() - startTime;
      const stats = calculateTypingStats(targetText, value, duration);
      setResult(stats);
      setIsFinished(true);
    }
  };

  const renderText = () => {
    return targetText.split('').map((char, index) => {
      let className = 'text-gray-400';
      if (index < typedText.length) {
        className = typedText[index] === char
          ? 'text-green-600 dark:text-green-400'
          : 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
      } else if (index === typedText.length) {
        className = 'bg-blue-200 dark:bg-blue-800 text-gray-900 dark:text-white';
      }
      return (
        <span key={index} className={className}>
          {char}
        </span>
      );
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {(['easy', 'medium', 'hard'] as const).map((level) => (
          <button
            key={level}
            onClick={() => {
              setDifficulty(level);
              startTest();
            }}
            className={`px-4 py-2 rounded-lg transition-colors ${
              difficulty === level
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            {t(level)}
          </button>
        ))}
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="text-lg font-mono leading-relaxed">
          {renderText()}
        </div>
      </div>

      <textarea
        ref={inputRef}
        value={typedText}
        onChange={(e) => handleInput(e.target.value)}
        disabled={isFinished}
        className="w-full h-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono resize-none"
        placeholder={t('startTyping')}
      />

      <button
        onClick={startTest}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        {isFinished ? t('tryAgain') : t('newText')}
      </button>

      {isStarted && !isFinished && (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-center">
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {t('typing')}...
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {typedText.length} / {targetText.length} {t('characters')}
          </div>
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg text-white text-center">
              <div className="text-sm opacity-80">{t('wpm')}</div>
              <div className="text-4xl font-bold">{result.wpm}</div>
            </div>
            <div className="p-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg text-white text-center">
              <div className="text-sm opacity-80">{t('accuracy')}</div>
              <div className="text-4xl font-bold">{result.accuracy}%</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
              <div className="text-sm text-gray-600 dark:text-gray-400">{t('correctChars')}</div>
              <div className="text-xl font-bold text-green-600 dark:text-green-400">
                {result.correctChars}
              </div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
              <div className="text-sm text-gray-600 dark:text-gray-400">{t('incorrectChars')}</div>
              <div className="text-xl font-bold text-red-600 dark:text-red-400">
                {result.incorrectChars}
              </div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
              <div className="text-sm text-gray-600 dark:text-gray-400">{t('duration')}</div>
              <div className="text-xl font-bold text-gray-900 dark:text-white">
                {result.duration.toFixed(1)}s
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">{t('rating')}</div>
            <div className="text-lg font-semibold">
              {result.wpm < 20 && t('beginner')}
              {result.wpm >= 20 && result.wpm < 40 && t('average')}
              {result.wpm >= 40 && result.wpm < 60 && t('aboveAverage')}
              {result.wpm >= 60 && result.wpm < 80 && t('fast')}
              {result.wpm >= 80 && t('professional')}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
