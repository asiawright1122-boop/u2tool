'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function OpenGraphPreview() {
  const t = useTranslations('tools');
  const [title, setTitle] = useState(() => t('openGraphPreview.defaultTitle'));
  const [description, setDescription] = useState(() => t('openGraphPreview.defaultDescription'));
  const [image, setImage] = useState('https://via.placeholder.com/1200x630');
  const [url, setUrl] = useState('https://example.com/page');
  const [siteName, setSiteName] = useState(() => t('openGraphPreview.defaultSiteName'));
  const [previewType, setPreviewType] = useState<'facebook' | 'twitter' | 'linkedin'>('facebook');

  const truncate = (str: string, len: number) => {
    return str.length > len ? str.substring(0, len) + '...' : str;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">{t('openGraphPreview.title')}</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="tool-input"
            placeholder={t('openGraphPreview.titlePlaceholder')}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">{t('openGraphPreview.siteName')}</label>
          <input
            type="text"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            className="tool-input"
            placeholder={t('openGraphPreview.siteNamePlaceholder')}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">{t('openGraphPreview.description')}</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="tool-input"
          rows={2}
          placeholder={t('openGraphPreview.descriptionPlaceholder')}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">{t('openGraphPreview.imageUrl')}</label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="tool-input"
            placeholder={t('openGraphPreview.imageUrlPlaceholder')}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">{t('openGraphPreview.pageUrl')}</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="tool-input"
            placeholder={t('openGraphPreview.pageUrlPlaceholder')}
          />
        </div>
      </div>

      {/* Preview Type Selector */}
      <div className="flex gap-2">
        <button
          onClick={() => setPreviewType('facebook')}
          className={`px-4 py-2 rounded ${previewType === 'facebook' ? 'bg-blue-600' : 'bg-gray-700'}`}
        >
          {t('openGraphPreview.platform.facebook')}
        </button>
        <button
          onClick={() => setPreviewType('twitter')}
          className={`px-4 py-2 rounded ${previewType === 'twitter' ? 'bg-blue-400' : 'bg-gray-700'}`}
        >
          {t('openGraphPreview.platform.twitter')}
        </button>
        <button
          onClick={() => setPreviewType('linkedin')}
          className={`px-4 py-2 rounded ${previewType === 'linkedin' ? 'bg-blue-700' : 'bg-gray-700'}`}
        >
          {t('openGraphPreview.platform.linkedin')}
        </button>
      </div>

      {/* Preview */}
      <div>
        <label className="block text-sm font-medium mb-2">{t('openGraphPreview.preview')}</label>
        
        {previewType === 'facebook' && (
          <div className="max-w-[500px] bg-gray-800 rounded-lg overflow-hidden shadow-lg">
            {image && (
              <div className="aspect-[1.91/1] bg-gray-200">
                <img src={image} alt="" className="w-full h-full object-cover" onError={(e) => e.currentTarget.style.display = 'none'} />
              </div>
            )}
            <div className="p-3 border-t border-gray-700">
              <div className="text-xs text-gray-300 uppercase">{new URL(url || 'https://example.com').hostname}</div>
              <div className="text-gray-100 font-semibold mt-1">{truncate(title, 60)}</div>
              <div className="text-gray-300 text-sm mt-1">{truncate(description, 150)}</div>
            </div>
          </div>
        )}

        {previewType === 'twitter' && (
          <div className="max-w-[500px] bg-gray-800 rounded-2xl overflow-hidden border border-gray-700">
            {image && (
              <div className="aspect-[2/1] bg-gray-200">
                <img src={image} alt="" className="w-full h-full object-cover" onError={(e) => e.currentTarget.style.display = 'none'} />
              </div>
            )}
            <div className="p-3">
              <div className="text-gray-100 font-bold">{truncate(title, 70)}</div>
              <div className="text-gray-300 text-sm mt-1">{truncate(description, 125)}</div>
              <div className="text-gray-300 text-sm mt-2 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                {new URL(url || 'https://example.com').hostname}
              </div>
            </div>
          </div>
        )}

        {previewType === 'linkedin' && (
          <div className="max-w-[500px] bg-gray-800 rounded-lg overflow-hidden border border-gray-600">
            {image && (
              <div className="aspect-[1.91/1] bg-gray-200">
                <img src={image} alt="" className="w-full h-full object-cover" onError={(e) => e.currentTarget.style.display = 'none'} />
              </div>
            )}
            <div className="p-3">
              <div className="text-gray-100 font-semibold">{truncate(title, 100)}</div>
              <div className="text-gray-300 text-xs mt-1">{new URL(url || 'https://example.com').hostname}</div>
            </div>
          </div>
        )}
      </div>

      {/* Recommendations */}
      <div className="p-4 bg-gray-800/50 rounded-lg text-sm">
        <h3 className="font-medium mb-2">{t('openGraphPreview.recommendations.title')}</h3>
        <ul className="space-y-1 text-gray-300">
          <li>• {t('openGraphPreview.recommendations.imageSize')}</li>
          <li>• {t('openGraphPreview.recommendations.titleLength')}</li>
          <li>• {t('openGraphPreview.recommendations.descriptionLength')}</li>
          <li>• {t('openGraphPreview.recommendations.highQuality')}</li>
          <li>• {t('openGraphPreview.recommendations.testDebugger')}</li>
        </ul>
      </div>
    </div>
  );
}
