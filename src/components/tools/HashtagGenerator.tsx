'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';

interface HashtagResult {
  hashtags: string[];
  popular: string[];
  niche: string[];
}

// Common hashtag patterns by category
const HASHTAG_PATTERNS: Record<string, string[]> = {
  general: ['trending', 'viral', 'fyp', 'foryou', 'explore', 'instagood', 'photooftheday', 'love', 'beautiful', 'happy'],
  business: ['entrepreneur', 'business', 'success', 'motivation', 'startup', 'marketing', 'smallbusiness', 'hustle', 'goals', 'mindset'],
  tech: ['technology', 'tech', 'coding', 'programming', 'developer', 'software', 'ai', 'innovation', 'digital', 'webdev'],
  food: ['foodie', 'food', 'yummy', 'delicious', 'foodporn', 'instafood', 'cooking', 'recipe', 'homemade', 'tasty'],
  travel: ['travel', 'wanderlust', 'adventure', 'explore', 'vacation', 'travelgram', 'instatravel', 'travelphotography', 'trip', 'tourism'],
  fitness: ['fitness', 'gym', 'workout', 'health', 'fit', 'training', 'motivation', 'exercise', 'healthy', 'bodybuilding'],
  fashion: ['fashion', 'style', 'ootd', 'outfit', 'fashionista', 'streetstyle', 'instafashion', 'fashionblogger', 'trendy', 'lookoftheday'],
  photography: ['photography', 'photo', 'photographer', 'photooftheday', 'picoftheday', 'camera', 'portrait', 'landscape', 'naturephotography', 'streetphotography'],
  art: ['art', 'artist', 'artwork', 'creative', 'design', 'illustration', 'drawing', 'painting', 'digitalart', 'artistsoninstagram'],
  music: ['music', 'musician', 'song', 'singer', 'newmusic', 'hiphop', 'rap', 'rock', 'pop', 'musicproducer'],
};

const PLATFORM_LIMITS: Record<string, number> = {
  instagram: 30,
  twitter: 10,
  tiktok: 5,
  linkedin: 5,
  all: 30,
};

function generateHashtags(topic: string, platform: string, count: number): HashtagResult {
  const words = topic.toLowerCase().split(/\s+/).filter(w => w.length > 0);
  const hashtags: Set<string> = new Set();
  
  // Add topic-based hashtags
  words.forEach(word => {
    const cleanWord = word.replace(/[^a-zA-Z0-9]/g, '');
    if (cleanWord.length > 0) {
      hashtags.add(`#${cleanWord}`);
    }
  });
  
  // Add combined hashtags
  if (words.length > 1) {
    const combined = words.map(w => w.replace(/[^a-zA-Z0-9]/g, '')).join('');
    if (combined.length > 0) {
      hashtags.add(`#${combined}`);
    }
  }
  
  // Find matching categories and add related hashtags
  const matchedCategories: string[] = [];
  Object.entries(HASHTAG_PATTERNS).forEach(([category, patterns]) => {
    if (words.some(word => patterns.some(p => p.includes(word) || word.includes(p)))) {
      matchedCategories.push(category);
    }
  });
  
  // If no category matched, use general
  if (matchedCategories.length === 0) {
    matchedCategories.push('general');
  }
  
  // Add category-specific hashtags
  matchedCategories.forEach(category => {
    HASHTAG_PATTERNS[category]?.forEach(tag => {
      hashtags.add(`#${tag}`);
    });
  });
  
  // Add variations
  words.forEach(word => {
    const cleanWord = word.replace(/[^a-zA-Z0-9]/g, '');
    if (cleanWord.length > 0) {
      hashtags.add(`#${cleanWord}life`);
      hashtags.add(`#${cleanWord}lover`);
      hashtags.add(`#${cleanWord}daily`);
      hashtags.add(`#insta${cleanWord}`);
    }
  });
  
  // Convert to array and limit
  const limit = PLATFORM_LIMITS[platform] || 30;
  const allHashtags = Array.from(hashtags).slice(0, Math.min(count, limit));
  
  // Split into popular and niche
  const popular = allHashtags.slice(0, Math.ceil(allHashtags.length / 2));
  const niche = allHashtags.slice(Math.ceil(allHashtags.length / 2));
  
  return {
    hashtags: allHashtags,
    popular,
    niche,
  };
}

export default function HashtagGenerator() {
  const t = useTranslations('tools.hashtag-generator');
  const tCommon = useTranslations('tools');
  
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('instagram');
  const [count, setCount] = useState(20);
  const [result, setResult] = useState<HashtagResult | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = useCallback(() => {
    if (!topic.trim()) return;
    setResult(generateHashtags(topic, platform, count));
  }, [topic, platform, count]);

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyAll = () => {
    if (result) {
      copyToClipboard(result.hashtags.join(' '));
    }
  };

  const clearAll = () => {
    setTopic('');
    setResult(null);
  };

  const platforms = [
    { id: 'instagram', name: 'Instagram', limit: 30 },
    { id: 'twitter', name: 'Twitter/X', limit: 10 },
    { id: 'tiktok', name: 'TikTok', limit: 5 },
    { id: 'linkedin', name: 'LinkedIn', limit: 5 },
    { id: 'all', name: t('allPlatforms'), limit: 30 },
  ];

  return (
    <div className="space-y-6">
      {/* Topic Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('topic')}
        </label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder={t('topicPlaceholder')}
          className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
        />
      </div>

      {/* Platform Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('platform')}
        </label>
        <div className="flex flex-wrap gap-2">
          {platforms.map(p => (
            <button
              key={p.id}
              onClick={() => {
                setPlatform(p.id);
                setCount(Math.min(count, p.limit));
              }}
              className={`px-4 py-2 rounded-lg text-sm ${
                platform === p.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {p.name}
              <span className="ml-1 text-xs opacity-75">({p.limit})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Count Slider */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('count')}: {count}
        </label>
        <input
          type="range"
          min="5"
          max={PLATFORM_LIMITS[platform]}
          value={count}
          onChange={(e) => setCount(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      {/* Quick Topics */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('quickTopics')}
        </label>
        <div className="flex flex-wrap gap-2">
          {['travel', 'food', 'fitness', 'fashion', 'tech', 'business', 'photography', 'art', 'music'].map(quickTopic => (
            <button
              key={quickTopic}
              onClick={() => setTopic(quickTopic)}
              className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-sm capitalize"
            >
              {quickTopic}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-4">
        <button
          onClick={handleGenerate}
          disabled={!topic.trim()}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg font-medium text-white"
        >
          {t('generate')}
        </button>
        <button
          onClick={clearAll}
          className="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg font-medium text-gray-900 dark:text-gray-100"
        >
          {tCommon('clear')}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* All Hashtags */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('allHashtags')} ({result.hashtags.length})
              </h3>
              <button
                onClick={copyAll}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm text-white"
              >
                {copied ? tCommon('copied') : t('copyAll')}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {result.hashtags.map(tag => (
                <button
                  key={tag}
                  onClick={() => copyToClipboard(tag)}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm hover:bg-blue-200 dark:hover:bg-blue-900/50"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Popular Hashtags */}
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium text-green-700 dark:text-green-300">
                {t('popularHashtags')} ({result.popular.length})
              </h3>
              <button
                onClick={() => copyToClipboard(result.popular.join(' '))}
                className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm text-white"
              >
                {tCommon('copy')}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {result.popular.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Niche Hashtags */}
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium text-purple-700 dark:text-purple-300">
                {t('nicheHashtags')} ({result.niche.length})
              </h3>
              <button
                onClick={() => copyToClipboard(result.niche.join(' '))}
                className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-sm text-white"
              >
                {tCommon('copy')}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {result.niche.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Copy Box */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('copyBox')}
            </label>
            <textarea
              value={result.hashtags.join(' ')}
              readOnly
              rows={4}
              className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 text-sm resize-none"
            />
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <h3 className="text-sm font-medium text-yellow-700 dark:text-yellow-300 mb-2">{t('tips')}</h3>
        <ul className="text-sm text-yellow-600 dark:text-yellow-400 space-y-1 list-disc list-inside">
          <li>{t('tip1')}</li>
          <li>{t('tip2')}</li>
          <li>{t('tip3')}</li>
        </ul>
      </div>
    </div>
  );
}
