'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';

export default function RandomPicker() {
  const t = useTranslations('tools.random-picker');
  const tc = useTranslations('tools');
  
  const [input, setInput] = useState('');
  const [winnerCount, setWinnerCount] = useState('1');
  const [winners, setWinners] = useState<string[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentDisplay, setCurrentDisplay] = useState('');
  const animationRef = useRef<NodeJS.Timeout | null>(null);

  const items = input
    .split('\n')
    .map(item => item.trim())
    .filter(item => item.length > 0);

  const pickWinners = () => {
    if (items.length === 0) return;

    const count = Math.min(parseInt(winnerCount) || 1, items.length);
    setIsAnimating(true);
    setWinners([]);

    // Animation
    let iterations = 0;
    const maxIterations = 20;
    
    const animate = () => {
      const randomItem = items[Math.floor(Math.random() * items.length)];
      setCurrentDisplay(randomItem);
      iterations++;

      if (iterations < maxIterations) {
        animationRef.current = setTimeout(animate, 50 + iterations * 10);
      } else {
        // Final selection
        const shuffled = [...items].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, count);
        setWinners(selected);
        setCurrentDisplay('');
        setIsAnimating(false);
      }
    };

    animate();
  };

  const reset = () => {
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
    setWinners([]);
    setCurrentDisplay('');
    setIsAnimating(false);
  };

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('enterItems')}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('itemsPlaceholder')}
          rows={6}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
        <p className="text-sm text-gray-500 mt-1">
          {t('itemCount')}: {items.length}
        </p>
      </div>

      {/* Winner Count */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('numberOfWinners')}
        </label>
        <input
          type="number"
          value={winnerCount}
          onChange={(e) => setWinnerCount(e.target.value)}
          min="1"
          max={items.length || 1}
          className="w-32 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
        />
      </div>

      {/* Pick Button */}
      <div className="flex gap-3">
        <button
          onClick={pickWinners}
          disabled={items.length === 0 || isAnimating}
          className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 transition-all"
        >
          {isAnimating ? '🎰 ...' : `🎲 ${t('pick')}`}
        </button>
        {(winners.length > 0 || isAnimating) && (
          <button
            onClick={reset}
            className="px-6 py-4 bg-gray-600 text-white rounded-xl font-medium hover:bg-gray-700"
          >
            {tc('clear')}
          </button>
        )}
      </div>

      {/* Animation Display */}
      {isAnimating && currentDisplay && (
        <div className="text-center py-8">
          <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 animate-pulse">
            {currentDisplay}
          </div>
        </div>
      )}

      {/* Winners Display */}
      {winners.length > 0 && !isAnimating && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            🏆 {t('winners')}
          </h3>
          <div className="space-y-3">
            {winners.map((winner, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
              >
                <span className="w-8 h-8 rounded-full bg-yellow-500 text-white flex items-center justify-center font-bold">
                  {idx + 1}
                </span>
                <span className="text-lg font-medium text-gray-900 dark:text-white">
                  {winner}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
