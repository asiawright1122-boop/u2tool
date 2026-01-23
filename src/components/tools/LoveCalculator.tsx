'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Heart, Share2, RefreshCw } from 'lucide-react';

interface LoveResult {
  percentage: number;
  message: string;
  emoji: string;
}

export default function LoveCalculator() {
  const t = useTranslations('tools.love-calculator');
  const tCommon = useTranslations('tools');

  const [name1, setName1] = useState<string>('');
  const [name2, setName2] = useState<string>('');
  const [result, setResult] = useState<LoveResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const calculateLove = useCallback(() => {
    if (!name1.trim() || !name2.trim()) return;

    setIsCalculating(true);
    setResult(null);

    // Simulate calculation animation
    setTimeout(() => {
      // Generate consistent percentage based on names
      const combinedNames = (name1.toLowerCase() + name2.toLowerCase()).split('').sort().join('');
      let hash = 0;
      for (let i = 0; i < combinedNames.length; i++) {
        const char = combinedNames.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
      }
      
      // Generate percentage between 50-100 for fun results
      const percentage = 50 + Math.abs(hash % 51);

      let message: string;
      let emoji: string;

      if (percentage >= 90) {
        message = t('result90');
        emoji = '💕';
      } else if (percentage >= 80) {
        message = t('result80');
        emoji = '❤️';
      } else if (percentage >= 70) {
        message = t('result70');
        emoji = '💖';
      } else if (percentage >= 60) {
        message = t('result60');
        emoji = '💗';
      } else {
        message = t('result50');
        emoji = '💝';
      }

      setResult({ percentage, message, emoji });
      setIsCalculating(false);
    }, 1500);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name1, name2]);

  const reset = () => {
    setName1('');
    setName2('');
    setResult(null);
  };

  const share = () => {
    if (!result) return;
    const text = `${name1} ❤️ ${name2}: ${result.percentage}% ${t('compatibility')}! ${result.emoji}`;
    if (navigator.share) {
      navigator.share({ text });
    } else {
      navigator.clipboard.writeText(text);
    }
  };

  useEffect(() => {

    return () => {

      if (timerRef.current) clearTimeout(timerRef.current);

    };

  }, []);


  return (
    <div className="space-y-6">
      {/* Names Input */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('yourName')}
          </label>
          <input
            type="text"
            value={name1}
            onChange={(e) => setName1(e.target.value)}
            placeholder={t('enterName')}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-center text-lg"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('partnerName')}
          </label>
          <input
            type="text"
            value={name2}
            onChange={(e) => setName2(e.target.value)}
            placeholder={t('enterName')}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-center text-lg"
          />
        </div>
      </div>

      {/* Heart Animation */}
      <div className="flex justify-center">
        <div className={`relative ${isCalculating ? 'animate-pulse' : ''}`}>
          <Heart
            className={`w-32 h-32 ${
              result
                ? 'text-red-500 fill-red-500'
                : 'text-pink-300 dark:text-pink-700'
            } transition-all duration-500`}
          />
          {result && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white font-bold text-2xl">{result.percentage}%</span>
            </div>
          )}
        </div>
      </div>

      {/* Calculate Button */}
      <div className="flex justify-center gap-3">
        <button
          onClick={calculateLove}
          disabled={!name1.trim() || !name2.trim() || isCalculating}
          className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg hover:from-pink-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
        >
          <Heart className={`w-5 h-5 ${isCalculating ? 'animate-bounce' : ''}`} />
          {isCalculating ? t('calculating') : t('calculate')}
        </button>

        {result && (
          <>
            <button
              onClick={share}
              className="flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <Share2 className="w-5 h-5" />
              {t('share')}
            </button>
            <button
              onClick={reset}
              className="flex items-center gap-2 px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <RefreshCw className="w-5 h-5" />
              {tCommon('clear')}
            </button>
          </>
        )}
      </div>

      {/* Result */}
      {result && (
        <div className="p-6 bg-gradient-to-r from-pink-50 to-red-50 dark:from-pink-900/20 dark:to-red-900/20 rounded-xl border border-pink-200 dark:border-pink-800 text-center">
          <div className="text-6xl mb-4">{result.emoji}</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {name1} & {name2}
          </div>
          <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-red-500 mb-4">
            {result.percentage}%
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {result.message}
          </p>
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-center text-sm text-gray-500">
        {t('disclaimer')}
      </p>
    </div>
  );
}
