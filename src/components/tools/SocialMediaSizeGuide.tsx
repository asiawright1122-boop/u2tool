'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { socialMediaSizes, type PlatformSizes, type ImageSize } from '@/lib/data/social-media-sizes';

export default function SocialMediaSizeGuide() {
  const t = useTranslations('tools.social-media-size-guide');
  const tc = useTranslations('tools');
  
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPlatforms = searchQuery
    ? socialMediaSizes.filter(p => 
        p.platform.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sizes.some(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : socialMediaSizes;

  const copySize = async (size: ImageSize) => {
    const text = `${size.width} x ${size.height}`;
    await navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('searchPlaceholder')}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>

      {/* Platform Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedPlatform(null)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            !selectedPlatform
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          {t('all')}
        </button>
        {socialMediaSizes.map(platform => (
          <button
            key={platform.platform}
            onClick={() => setSelectedPlatform(platform.platform)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
              selectedPlatform === platform.platform
                ? 'text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
            style={selectedPlatform === platform.platform ? { backgroundColor: platform.color } : {}}
          >
            <span>{platform.icon}</span>
            <span>{platform.platform}</span>
          </button>
        ))}
      </div>

      {/* Platform Cards */}
      <div className="space-y-6">
        {filteredPlatforms
          .filter(p => !selectedPlatform || p.platform === selectedPlatform)
          .map(platform => (
            <PlatformCard key={platform.platform} platform={platform} onCopy={copySize} t={t} />
          ))}
      </div>
    </div>
  );
}

interface PlatformCardProps {
  platform: PlatformSizes;
  onCopy: (size: ImageSize) => void;
  t: (key: string) => string;
}

function PlatformCard({ platform, onCopy, t }: PlatformCardProps) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden">
      <div 
        className="px-4 py-3 flex items-center gap-2"
        style={{ backgroundColor: platform.color }}
      >
        <span className="text-2xl">{platform.icon}</span>
        <h3 className="text-lg font-semibold text-white">{platform.platform}</h3>
      </div>
      <div className="p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-600">
                <th className="px-3 py-2 text-left font-medium text-gray-700 dark:text-gray-300">
                  {t('type')}
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-700 dark:text-gray-300">
                  {t('dimensions')}
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-700 dark:text-gray-300">
                  {t('aspectRatio')}
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-700 dark:text-gray-300">
                  {t('notes')}
                </th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {platform.sizes.map((size, idx) => (
                <tr key={idx} className="border-b border-gray-100 dark:border-gray-700">
                  <td className="px-3 py-2 text-gray-900 dark:text-white font-medium">
                    {size.name}
                  </td>
                  <td className="px-3 py-2 text-gray-900 dark:text-white">
                    <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                      {size.width} × {size.height}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-gray-600 dark:text-gray-400">
                    {size.aspectRatio}
                  </td>
                  <td className="px-3 py-2 text-gray-500 dark:text-gray-400 text-xs">
                    {size.description || '-'}
                  </td>
                  <td className="px-3 py-2">
                    <button
                      onClick={() => onCopy(size)}
                      className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800"
                    >
                      {t('copy')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
