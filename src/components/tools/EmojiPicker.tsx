'use client';

import { useState, useMemo, useCallback } from 'react';
import { useTranslations } from 'next-intl';

export type EmojiCategory = 'smileys' | 'people' | 'animals' | 'food' | 'travel' | 'activities' | 'objects' | 'symbols' | 'flags';

export interface Emoji {
  emoji: string;
  name: string;
  category: EmojiCategory;
}

// Emoji 数据 - 导出供测试使用
export const emojiData: Emoji[] = [
  // Smileys
  { emoji: '😀', name: 'grinning face', category: 'smileys' },
  { emoji: '😃', name: 'grinning face with big eyes', category: 'smileys' },
  { emoji: '😄', name: 'grinning face with smiling eyes', category: 'smileys' },
  { emoji: '😁', name: 'beaming face', category: 'smileys' },
  { emoji: '😅', name: 'grinning face with sweat', category: 'smileys' },
  { emoji: '🤣', name: 'rolling on the floor laughing', category: 'smileys' },
  { emoji: '😂', name: 'face with tears of joy', category: 'smileys' },
  { emoji: '🙂', name: 'slightly smiling face', category: 'smileys' },
  { emoji: '😉', name: 'winking face', category: 'smileys' },
  { emoji: '😊', name: 'smiling face with smiling eyes', category: 'smileys' },
  { emoji: '😇', name: 'smiling face with halo', category: 'smileys' },
  { emoji: '🥰', name: 'smiling face with hearts', category: 'smileys' },
  { emoji: '😍', name: 'heart eyes', category: 'smileys' },
  { emoji: '🤩', name: 'star struck', category: 'smileys' },
  { emoji: '😘', name: 'face blowing a kiss', category: 'smileys' },
  { emoji: '😋', name: 'face savoring food', category: 'smileys' },
  { emoji: '😎', name: 'smiling face with sunglasses', category: 'smileys' },
  { emoji: '🤔', name: 'thinking face', category: 'smileys' },
  { emoji: '🤗', name: 'hugging face', category: 'smileys' },
  { emoji: '😐', name: 'neutral face', category: 'smileys' },
  { emoji: '😑', name: 'expressionless face', category: 'smileys' },
  { emoji: '😶', name: 'face without mouth', category: 'smileys' },
  { emoji: '🙄', name: 'face with rolling eyes', category: 'smileys' },
  { emoji: '😏', name: 'smirking face', category: 'smileys' },
  { emoji: '😴', name: 'sleeping face', category: 'smileys' },
  { emoji: '😷', name: 'face with medical mask', category: 'smileys' },
  { emoji: '🤒', name: 'face with thermometer', category: 'smileys' },
  { emoji: '😢', name: 'crying face', category: 'smileys' },
  { emoji: '😭', name: 'loudly crying face', category: 'smileys' },
  { emoji: '😱', name: 'face screaming in fear', category: 'smileys' },
  { emoji: '😡', name: 'pouting face', category: 'smileys' },
  { emoji: '🥺', name: 'pleading face', category: 'smileys' },
  
  // People
  { emoji: '👋', name: 'waving hand', category: 'people' },
  { emoji: '🤚', name: 'raised back of hand', category: 'people' },
  { emoji: '✋', name: 'raised hand', category: 'people' },
  { emoji: '🖐️', name: 'hand with fingers splayed', category: 'people' },
  { emoji: '👌', name: 'OK hand', category: 'people' },
  { emoji: '✌️', name: 'victory hand', category: 'people' },
  { emoji: '🤞', name: 'crossed fingers', category: 'people' },
  { emoji: '🤟', name: 'love you gesture', category: 'people' },
  { emoji: '🤘', name: 'sign of the horns', category: 'people' },
  { emoji: '👍', name: 'thumbs up', category: 'people' },
  { emoji: '👎', name: 'thumbs down', category: 'people' },
  { emoji: '👏', name: 'clapping hands', category: 'people' },
  { emoji: '🙌', name: 'raising hands', category: 'people' },
  { emoji: '🤝', name: 'handshake', category: 'people' },
  { emoji: '🙏', name: 'folded hands', category: 'people' },
  { emoji: '💪', name: 'flexed biceps', category: 'people' },
  
  // Animals
  { emoji: '🐶', name: 'dog face', category: 'animals' },
  { emoji: '🐱', name: 'cat face', category: 'animals' },
  { emoji: '🐭', name: 'mouse face', category: 'animals' },
  { emoji: '🐹', name: 'hamster', category: 'animals' },
  { emoji: '🐰', name: 'rabbit face', category: 'animals' },
  { emoji: '🦊', name: 'fox', category: 'animals' },
  { emoji: '🐻', name: 'bear', category: 'animals' },
  { emoji: '🐼', name: 'panda', category: 'animals' },
  { emoji: '🐨', name: 'koala', category: 'animals' },
  { emoji: '🐯', name: 'tiger face', category: 'animals' },
  { emoji: '🦁', name: 'lion', category: 'animals' },
  { emoji: '🐮', name: 'cow face', category: 'animals' },
  { emoji: '🐷', name: 'pig face', category: 'animals' },
  { emoji: '🐸', name: 'frog', category: 'animals' },
  { emoji: '🐵', name: 'monkey face', category: 'animals' },
  { emoji: '🐔', name: 'chicken', category: 'animals' },
  { emoji: '🐧', name: 'penguin', category: 'animals' },
  { emoji: '🐦', name: 'bird', category: 'animals' },
  { emoji: '🦋', name: 'butterfly', category: 'animals' },
  { emoji: '🐛', name: 'bug', category: 'animals' },
  
  // Food
  { emoji: '🍎', name: 'red apple', category: 'food' },
  { emoji: '🍐', name: 'pear', category: 'food' },
  { emoji: '🍊', name: 'tangerine', category: 'food' },
  { emoji: '🍋', name: 'lemon', category: 'food' },
  { emoji: '🍌', name: 'banana', category: 'food' },
  { emoji: '🍉', name: 'watermelon', category: 'food' },
  { emoji: '🍇', name: 'grapes', category: 'food' },
  { emoji: '🍓', name: 'strawberry', category: 'food' },
  { emoji: '🍕', name: 'pizza', category: 'food' },
  { emoji: '🍔', name: 'hamburger', category: 'food' },
  { emoji: '🍟', name: 'french fries', category: 'food' },
  { emoji: '🌭', name: 'hot dog', category: 'food' },
  { emoji: '🍿', name: 'popcorn', category: 'food' },
  { emoji: '☕', name: 'hot beverage', category: 'food' },
  { emoji: '🍺', name: 'beer mug', category: 'food' },
  { emoji: '🍷', name: 'wine glass', category: 'food' },
  
  // Travel
  { emoji: '🚗', name: 'automobile', category: 'travel' },
  { emoji: '🚕', name: 'taxi', category: 'travel' },
  { emoji: '🚌', name: 'bus', category: 'travel' },
  { emoji: '🚎', name: 'trolleybus', category: 'travel' },
  { emoji: '🏎️', name: 'racing car', category: 'travel' },
  { emoji: '🚓', name: 'police car', category: 'travel' },
  { emoji: '🚑', name: 'ambulance', category: 'travel' },
  { emoji: '✈️', name: 'airplane', category: 'travel' },
  { emoji: '🚀', name: 'rocket', category: 'travel' },
  { emoji: '🏠', name: 'house', category: 'travel' },
  { emoji: '🏢', name: 'office building', category: 'travel' },
  { emoji: '🏥', name: 'hospital', category: 'travel' },
  { emoji: '🌍', name: 'globe showing Europe-Africa', category: 'travel' },
  { emoji: '🌎', name: 'globe showing Americas', category: 'travel' },
  { emoji: '🌏', name: 'globe showing Asia-Australia', category: 'travel' },
  
  // Activities
  { emoji: '⚽', name: 'soccer ball', category: 'activities' },
  { emoji: '🏀', name: 'basketball', category: 'activities' },
  { emoji: '🏈', name: 'american football', category: 'activities' },
  { emoji: '⚾', name: 'baseball', category: 'activities' },
  { emoji: '🎾', name: 'tennis', category: 'activities' },
  { emoji: '🏐', name: 'volleyball', category: 'activities' },
  { emoji: '🎮', name: 'video game', category: 'activities' },
  { emoji: '🎯', name: 'direct hit', category: 'activities' },
  { emoji: '🎲', name: 'game die', category: 'activities' },
  { emoji: '🎭', name: 'performing arts', category: 'activities' },
  { emoji: '🎨', name: 'artist palette', category: 'activities' },
  { emoji: '🎬', name: 'clapper board', category: 'activities' },
  { emoji: '🎤', name: 'microphone', category: 'activities' },
  { emoji: '🎧', name: 'headphone', category: 'activities' },
  { emoji: '🎵', name: 'musical note', category: 'activities' },
  { emoji: '🎶', name: 'musical notes', category: 'activities' },
  
  // Objects
  { emoji: '⌚', name: 'watch', category: 'objects' },
  { emoji: '📱', name: 'mobile phone', category: 'objects' },
  { emoji: '💻', name: 'laptop', category: 'objects' },
  { emoji: '⌨️', name: 'keyboard', category: 'objects' },
  { emoji: '🖥️', name: 'desktop computer', category: 'objects' },
  { emoji: '🖨️', name: 'printer', category: 'objects' },
  { emoji: '📷', name: 'camera', category: 'objects' },
  { emoji: '📹', name: 'video camera', category: 'objects' },
  { emoji: '💡', name: 'light bulb', category: 'objects' },
  { emoji: '🔦', name: 'flashlight', category: 'objects' },
  { emoji: '📚', name: 'books', category: 'objects' },
  { emoji: '📖', name: 'open book', category: 'objects' },
  { emoji: '✏️', name: 'pencil', category: 'objects' },
  { emoji: '📝', name: 'memo', category: 'objects' },
  { emoji: '📧', name: 'e-mail', category: 'objects' },
  { emoji: '📦', name: 'package', category: 'objects' },
  
  // Symbols
  { emoji: '❤️', name: 'red heart', category: 'symbols' },
  { emoji: '🧡', name: 'orange heart', category: 'symbols' },
  { emoji: '💛', name: 'yellow heart', category: 'symbols' },
  { emoji: '💚', name: 'green heart', category: 'symbols' },
  { emoji: '💙', name: 'blue heart', category: 'symbols' },
  { emoji: '💜', name: 'purple heart', category: 'symbols' },
  { emoji: '🖤', name: 'black heart', category: 'symbols' },
  { emoji: '💔', name: 'broken heart', category: 'symbols' },
  { emoji: '✨', name: 'sparkles', category: 'symbols' },
  { emoji: '⭐', name: 'star', category: 'symbols' },
  { emoji: '🌟', name: 'glowing star', category: 'symbols' },
  { emoji: '💫', name: 'dizzy', category: 'symbols' },
  { emoji: '🔥', name: 'fire', category: 'symbols' },
  { emoji: '💯', name: 'hundred points', category: 'symbols' },
  { emoji: '✅', name: 'check mark button', category: 'symbols' },
  { emoji: '❌', name: 'cross mark', category: 'symbols' },
  { emoji: '⚠️', name: 'warning', category: 'symbols' },
  { emoji: '🚫', name: 'prohibited', category: 'symbols' },
  { emoji: '❓', name: 'question mark', category: 'symbols' },
  { emoji: '❗', name: 'exclamation mark', category: 'symbols' },
  
  // Flags
  { emoji: '🏳️', name: 'white flag', category: 'flags' },
  { emoji: '🏴', name: 'black flag', category: 'flags' },
  { emoji: '🚩', name: 'triangular flag', category: 'flags' },
  { emoji: '🇺🇸', name: 'flag: United States', category: 'flags' },
  { emoji: '🇬🇧', name: 'flag: United Kingdom', category: 'flags' },
  { emoji: '🇨🇳', name: 'flag: China', category: 'flags' },
  { emoji: '🇯🇵', name: 'flag: Japan', category: 'flags' },
  { emoji: '🇰🇷', name: 'flag: South Korea', category: 'flags' },
  { emoji: '🇩🇪', name: 'flag: Germany', category: 'flags' },
  { emoji: '🇫🇷', name: 'flag: France', category: 'flags' },
  { emoji: '🇪🇸', name: 'flag: Spain', category: 'flags' },
  { emoji: '🇮🇹', name: 'flag: Italy', category: 'flags' },
  { emoji: '🇧🇷', name: 'flag: Brazil', category: 'flags' },
  { emoji: '🇷🇺', name: 'flag: Russia', category: 'flags' },
  { emoji: '🇮🇳', name: 'flag: India', category: 'flags' },
  { emoji: '🇦🇺', name: 'flag: Australia', category: 'flags' },
  { emoji: '🇨🇦', name: 'flag: Canada', category: 'flags' },
];


const categoryIcons: Record<EmojiCategory, string> = {
  smileys: '😀',
  people: '👋',
  animals: '🐶',
  food: '🍎',
  travel: '🚗',
  activities: '⚽',
  objects: '💻',
  symbols: '❤️',
  flags: '🏳️',
};

export function searchEmojis(query: string): Emoji[] {
  if (!query.trim()) return emojiData;
  const lowerQuery = query.toLowerCase();
  return emojiData.filter(e => 
    e.name.toLowerCase().includes(lowerQuery) || 
    e.emoji.includes(query)
  );
}

export function getEmojisByCategory(category: EmojiCategory): Emoji[] {
  return emojiData.filter(e => e.category === category);
}

export default function EmojiPicker() {
  const t = useTranslations('tools');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<EmojiCategory | 'all'>('all');
  const [copied, setCopied] = useState<string | null>(null);
  const [recentEmojis, setRecentEmojis] = useState<string[]>([]);

  const filteredEmojis = useMemo(() => {
    let emojis = search ? searchEmojis(search) : emojiData;
    if (selectedCategory !== 'all') {
      emojis = emojis.filter(e => e.category === selectedCategory);
    }
    return emojis;
  }, [search, selectedCategory]);

  const handleCopy = useCallback(async (emoji: string) => {
    await navigator.clipboard.writeText(emoji);
    setCopied(emoji);
    setTimeout(() => setCopied(null), 1500);
    
    // 添加到最近使用
    setRecentEmojis(prev => {
      const filtered = prev.filter(e => e !== emoji);
      return [emoji, ...filtered].slice(0, 16);
    });
  }, []);


  const categories: EmojiCategory[] = ['smileys', 'people', 'animals', 'food', 'travel', 'activities', 'objects', 'symbols', 'flags'];

  return (
    <div className="space-y-4">
      {/* 搜索框 */}
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('emoji.searchPlaceholder')}
          className="w-full px-4 py-3 pl-10 bg-gray-800 border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-blue-500"
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300">🔍</span>
      </div>

      {/* 分类标签 */}
      <div className="flex gap-1 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-2 rounded-lg text-sm whitespace-nowrap ${
            selectedCategory === 'all' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          {t('all')}
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-2 rounded-lg text-sm whitespace-nowrap flex items-center gap-1 ${
              selectedCategory === cat ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            <span>{categoryIcons[cat]}</span>
            <span className="hidden sm:inline">{t(`emoji.${cat}`)}</span>
          </button>
        ))}
      </div>

      {/* 最近使用 */}
      {recentEmojis.length > 0 && !search && (
        <div className="p-3 bg-gray-800 rounded-lg">
          <div className="text-xs text-gray-300 mb-2">{t('emoji.recent')}</div>
          <div className="flex flex-wrap gap-1">
            {recentEmojis.map((emoji, index) => (
              <button
                key={index}
                onClick={() => handleCopy(emoji)}
                className={`w-10 h-10 text-2xl rounded hover:bg-gray-700 transition-colors ${
                  copied === emoji ? 'bg-green-600/30' : ''
                }`}
                title={copied === emoji ? t('copied') : t('emoji.clickToCopy')}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}


      {/* Emoji 网格 */}
      <div className="p-4 bg-gray-800 rounded-lg">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-gray-300">
            {filteredEmojis.length} {t('emoji.emojis')}
          </span>
          {copied && (
            <span className="text-xs text-green-400">{copied} {t('copied')}</span>
          )}
        </div>
        
        {filteredEmojis.length > 0 ? (
          <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 gap-1 max-h-80 overflow-y-auto">
            {filteredEmojis.map((item, index) => (
              <button
                key={index}
                onClick={() => handleCopy(item.emoji)}
                className={`w-10 h-10 text-2xl rounded hover:bg-gray-700 transition-colors ${
                  copied === item.emoji ? 'bg-green-600/30' : ''
                }`}
                title={item.name}
              >
                {item.emoji}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-300 py-8">
            {t('emoji.noResults')}
          </div>
        )}
      </div>

      {/* 使用说明 */}
      <div className="p-3 bg-gray-800/50 rounded-lg text-xs text-gray-300">
        <div className="font-medium mb-1">{t('emoji.howToUse')}</div>
        <ul className="list-disc list-inside space-y-1">
          <li>{t('emoji.tip1')}</li>
          <li>{t('emoji.tip2')}</li>
          <li>{t('emoji.tip3')}</li>
        </ul>
      </div>
    </div>
  );
}
