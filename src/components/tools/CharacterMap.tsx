'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

const characterCategories = {
  arrows: ['←', '→', '↑', '↓', '↔', '↕', '⇐', '⇒', '⇑', '⇓', '⇔', '⇕', '➔', '➜', '➡', '⬅', '⬆', '⬇', '↩', '↪', '↰', '↱', '↲', '↳', '↴', '↵', '⤴', '⤵'],
  math: ['±', '×', '÷', '≠', '≈', '≤', '≥', '∞', '∑', '∏', '√', '∛', '∜', '∫', '∂', '∆', '∇', '∈', '∉', '∋', '∌', '⊂', '⊃', '⊆', '⊇', '∪', '∩', '∧', '∨', '¬', '∀', '∃', '∅', 'π', 'Ω', 'µ'],
  currency: ['$', '€', '£', '¥', '₹', '₽', '₿', '¢', '₩', '₪', '₫', '₭', '₮', '₱', '₲', '₴', '₵', '₸', '₺', '₼', '₾', '฿', '៛', '﷼'],
  punctuation: ['•', '·', '…', '‐', '–', '—', '―', '‖', '†', '‡', '§', '¶', '©', '®', '™', '°', '′', '″', '‴', '⁗', '※', '⁂', '⁑', '⁎', '⁕'],
  shapes: ['■', '□', '▪', '▫', '▬', '▭', '▮', '▯', '▰', '▱', '▲', '△', '▴', '▵', '▶', '▷', '▸', '▹', '►', '▻', '▼', '▽', '▾', '▿', '◀', '◁', '◂', '◃', '◄', '◅', '◆', '◇', '◈', '◉', '◊', '○', '◌', '◍', '◎', '●', '◐', '◑', '◒', '◓', '◔', '◕', '◖', '◗', '★', '☆', '✦', '✧', '✩', '✪', '✫', '✬', '✭', '✮', '✯', '✰'],
  emoji: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '☺', '😚', '😙', '🥲', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '🥸', '😎', '🤓', '🧐'],
  hands: ['👍', '👎', '👊', '✊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✌', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '👇', '☝', '✋', '🤚', '🖐', '🖖', '👋', '🤏', '✍', '🖕', '💪'],
  hearts: ['❤', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '♥', '♡'],
  weather: ['☀', '🌤', '⛅', '🌥', '☁', '🌦', '🌧', '⛈', '🌩', '🌨', '❄', '☃', '⛄', '🌬', '💨', '🌪', '🌫', '🌈', '☔', '💧', '💦', '🌊'],
  music: ['♩', '♪', '♫', '♬', '🎵', '🎶', '🎼', '🎹', '🎸', '🎺', '🎻', '🥁', '🎷', '🪗', '🎤', '🎧', '📻', '🔊', '🔉', '🔈', '🔇'],
  tech: ['⌨', '🖥', '💻', '🖱', '🖨', '📱', '📲', '☎', '📞', '📟', '📠', '💾', '💿', '📀', '🔌', '🔋', '📡', '🛰', '⚙', '🔧', '🔨', '⛏', '🔩', '🗜'],
};

export default function CharacterMap() {
  const t = useTranslations('tools.character-map');
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof characterCategories>('arrows');
  const [copied, setCopied] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [recentlyUsed, setRecentlyUsed] = useState<string[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const copyChar = (char: string) => {
    navigator.clipboard.writeText(char);
    setCopied(char);
    setTimeout(() => setCopied(null), 1000);
    
    setRecentlyUsed(prev => {
      const filtered = prev.filter(c => c !== char);
      return [char, ...filtered].slice(0, 20);
    });
  };

  const allChars = Object.values(characterCategories).flat();
  const filteredChars = search
    ? allChars.filter(char => char.includes(search))
    : characterCategories[selectedCategory];

  const categoryNames: Record<keyof typeof characterCategories, string> = {
    arrows: t('arrows'),
    math: t('math'),
    currency: t('currency'),
    punctuation: t('punctuation'),
    shapes: t('shapes'),
    emoji: t('emoji'),
    hands: t('hands'),
    hearts: t('hearts'),
    weather: t('weather'),
    music: t('music'),
    tech: t('tech'),
  };

  useEffect(() => {

    return () => {

      if (timerRef.current) clearTimeout(timerRef.current);

    };

  }, []);


  return (
    <div className="space-y-6">
      <div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('searchPlaceholder')}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>

      {!search && (
        <div className="flex flex-wrap gap-2">
          {(Object.keys(characterCategories) as Array<keyof typeof characterCategories>).map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {categoryNames[category]}
            </button>
          ))}
        </div>
      )}

      {recentlyUsed.length > 0 && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{t('recentlyUsed')}</h3>
          <div className="flex flex-wrap gap-2">
            {recentlyUsed.map((char, i) => (
              <button
                key={i}
                onClick={() => copyChar(char)}
                className="w-10 h-10 flex items-center justify-center text-xl bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
              >
                {char}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
          {search ? t('searchResults') : categoryNames[selectedCategory]} ({filteredChars.length})
        </h3>
        <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-16 gap-1">
          {filteredChars.map((char, i) => (
            <button
              key={i}
              onClick={() => copyChar(char)}
              className={`aspect-square flex items-center justify-center text-xl rounded transition-all ${
                copied === char
                  ? 'bg-green-500 text-white scale-110'
                  : 'bg-gray-50 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:scale-110'
              }`}
              title={`Click to copy: ${char}`}
            >
              {char}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
        <p className="text-sm text-blue-700 dark:text-blue-400">
          💡 {t('tip')}
        </p>
      </div>
    </div>
  );
}
