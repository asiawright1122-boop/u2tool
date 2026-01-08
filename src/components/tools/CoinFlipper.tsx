'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface FlipResult {
  result: 'heads' | 'tails';
  timestamp: number;
}

export default function CoinFlipper() {
  const t = useTranslations('tools.coin-flipper');
  const tc = useTranslations('tools');
  
  const [isFlipping, setIsFlipping] = useState(false);
  const [currentResult, setCurrentResult] = useState<'heads' | 'tails' | null>(null);
  const [history, setHistory] = useState<FlipResult[]>([]);
  const [flipCount, setFlipCount] = useState('1');

  const flip = () => {
    const count = Math.min(parseInt(flipCount) || 1, 100);
    setIsFlipping(true);

    setTimeout(() => {
      const results: FlipResult[] = [];
      for (let i = 0; i < count; i++) {
        results.push({
          result: Math.random() < 0.5 ? 'heads' : 'tails',
          timestamp: Date.now() + i,
        });
      }

      setCurrentResult(results[results.length - 1].result);
      setHistory(prev => [...results, ...prev].slice(0, 100));
      setIsFlipping(false);
    }, 500);
  };

  const clearHistory = () => {
    setHistory([]);
    setCurrentResult(null);
  };

  const headsCount = history.filter(h => h.result === 'heads').length;
  const tailsCount = history.filter(h => h.result === 'tails').length;
  const headsPercent = history.length > 0 ? (headsCount / history.length * 100).toFixed(1) : '0';
  const tailsPercent = history.length > 0 ? (tailsCount / history.length * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      {/* Coin Display */}
      <div className="flex justify-center">
        <div
          className={`w-40 h-40 rounded-full flex items-center justify-center text-6xl shadow-lg transition-transform duration-500 ${
            isFlipping ? 'animate-spin' : ''
          } ${
            currentResult === 'heads'
              ? 'bg-gradient-to-br from-yellow-400 to-yellow-600'
              : currentResult === 'tails'
              ? 'bg-gradient-to-br from-gray-400 to-gray-600'
              : 'bg-gradient-to-br from-gray-200 to-gray-400'
          }`}
        >
          {currentResult === 'heads' ? '👑' : currentResult === 'tails' ? '🦅' : '🪙'}
        </div>
      </div>

      {/* Result Text */}
      {currentResult && !isFlipping && (
        <div className="text-center">
          <span className="text-3xl font-bold text-gray-900 dark:text-white">
            {currentResult === 'heads' ? t('heads') : t('tails')}
          </span>
        </div>
      )}

      {/* Flip Count */}
      <div className="flex justify-center items-center gap-4">
        <label className="text-sm text-gray-600 dark:text-gray-400">{t('flipCount')}:</label>
        <input
          type="number"
          value={flipCount}
          onChange={(e) => setFlipCount(e.target.value)}
          min="1"
          max="100"
          className="w-20 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-center"
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-3">
        <button
          onClick={flip}
          disabled={isFlipping}
          className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-bold text-lg hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50"
        >
          {isFlipping ? '🪙 ...' : `🪙 ${t('flip')}`}
        </button>
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="px-6 py-4 bg-gray-600 text-white rounded-xl font-medium hover:bg-gray-700"
          >
            {tc('clear')}
          </button>
        )}
      </div>

      {/* Statistics */}
      {history.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">{t('statistics')}</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-yellow-600">{headsCount}</div>
              <div className="text-sm text-gray-500">{t('heads')} ({headsPercent}%)</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-600">{tailsCount}</div>
              <div className="text-sm text-gray-500">{t('tails')} ({tailsPercent}%)</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{history.length}</div>
              <div className="text-sm text-gray-500">{t('total')}</div>
            </div>
          </div>

          {/* Visual Bar */}
          <div className="mt-4 h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex">
            <div
              className="bg-yellow-500 transition-all"
              style={{ width: `${headsPercent}%` }}
            />
            <div
              className="bg-gray-500 transition-all"
              style={{ width: `${tailsPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Recent History */}
      {history.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('recentFlips')}</h4>
          <div className="flex flex-wrap gap-1">
            {history.slice(0, 50).map((flip, idx) => (
              <span
                key={flip.timestamp}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  flip.result === 'heads'
                    ? 'bg-yellow-200 text-yellow-800'
                    : 'bg-gray-300 text-gray-700'
                }`}
              >
                {flip.result === 'heads' ? 'H' : 'T'}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
