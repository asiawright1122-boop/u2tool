'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

type DiceType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20' | 'd100';

interface RollResult {
  dice: DiceType;
  results: number[];
  total: number;
  timestamp: number;
}

const diceConfig: Record<DiceType, { sides: number; icon: string; color: string }> = {
  d4: { sides: 4, icon: '🔺', color: 'from-red-500 to-red-600' },
  d6: { sides: 6, icon: '🎲', color: 'from-blue-500 to-blue-600' },
  d8: { sides: 8, icon: '💎', color: 'from-green-500 to-green-600' },
  d10: { sides: 10, icon: '🔷', color: 'from-purple-500 to-purple-600' },
  d12: { sides: 12, icon: '⬡', color: 'from-yellow-500 to-yellow-600' },
  d20: { sides: 20, icon: '⚀', color: 'from-pink-500 to-pink-600' },
  d100: { sides: 100, icon: '%', color: 'from-gray-500 to-gray-600' },
};

export default function DiceRoller() {
  const t = useTranslations('tools.dice-roller');
  const tc = useTranslations('tools');
  
  const [selectedDice, setSelectedDice] = useState<DiceType>('d6');
  const [diceCount, setDiceCount] = useState('1');
  const [modifier, setModifier] = useState('0');
  const [isRolling, setIsRolling] = useState(false);
  const [currentResult, setCurrentResult] = useState<RollResult | null>(null);
  const [history, setHistory] = useState<RollResult[]>([]);

  const roll = () => {
    const count = Math.min(parseInt(diceCount) || 1, 20);
    const mod = parseInt(modifier) || 0;
    const config = diceConfig[selectedDice];
    
    setIsRolling(true);

    setTimeout(() => {
      const results: number[] = [];
      for (let i = 0; i < count; i++) {
        results.push(Math.floor(Math.random() * config.sides) + 1);
      }

      const total = results.reduce((a, b) => a + b, 0) + mod;
      const result: RollResult = {
        dice: selectedDice,
        results,
        total,
        timestamp: Date.now(),
      };

      setCurrentResult(result);
      setHistory(prev => [result, ...prev].slice(0, 50));
      setIsRolling(false);
    }, 300);
  };

  const clearHistory = () => {
    setHistory([]);
    setCurrentResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Dice Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('selectDice')}
        </label>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(diceConfig) as DiceType[]).map(dice => (
            <button
              key={dice}
              onClick={() => setSelectedDice(dice)}
              className={`px-4 py-3 rounded-lg font-bold transition-all ${
                selectedDice === dice
                  ? `bg-gradient-to-r ${diceConfig[dice].color} text-white scale-105`
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {diceConfig[dice].icon} {dice.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('numberOfDice')}
          </label>
          <input
            type="number"
            value={diceCount}
            onChange={(e) => setDiceCount(e.target.value)}
            min="1"
            max="20"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('modifier')}
          </label>
          <input
            type="number"
            value={modifier}
            onChange={(e) => setModifier(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
          />
        </div>
      </div>

      {/* Roll Button */}
      <div className="flex justify-center gap-3">
        <button
          onClick={roll}
          disabled={isRolling}
          className={`px-10 py-4 bg-gradient-to-r ${diceConfig[selectedDice].color} text-white rounded-xl font-bold text-xl hover:scale-105 disabled:opacity-50 transition-all`}
        >
          {isRolling ? '🎲 ...' : `🎲 ${t('roll')}`}
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

      {/* Current Result */}
      {currentResult && !isRolling && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center">
          <div className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {currentResult.total}
          </div>
          <div className="flex justify-center gap-2 flex-wrap">
            {currentResult.results.map((r, idx) => (
              <span
                key={idx}
                className={`w-10 h-10 rounded-lg bg-gradient-to-r ${diceConfig[currentResult.dice].color} text-white flex items-center justify-center font-bold`}
              >
                {r}
              </span>
            ))}
            {parseInt(modifier) !== 0 && (
              <span className="w-10 h-10 rounded-lg bg-gray-300 dark:bg-gray-600 flex items-center justify-center font-bold">
                {parseInt(modifier) > 0 ? '+' : ''}{modifier}
              </span>
            )}
          </div>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('history')}</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {history.slice(0, 10).map((roll, idx) => (
              <div key={roll.timestamp} className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">{roll.dice.toUpperCase()}</span>
                <span className="text-gray-400">[{roll.results.join(', ')}]</span>
                <span className="font-bold text-gray-900 dark:text-white">= {roll.total}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
