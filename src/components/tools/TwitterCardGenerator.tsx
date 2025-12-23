'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function TwitterCardGenerator() {
  const t = useTranslations('tools');
  const [data, setData] = useState({
    card: 'summary_large_image',
    site: '',
    creator: '',
    title: '',
    description: '',
    image: '',
    alt: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const generateMetaTags = () => {
    return `<!-- Twitter -->
<meta name="twitter:card" content="${data.card}" />
<meta name="twitter:site" content="${data.site}" />
<meta name="twitter:creator" content="${data.creator}" />
<meta name="twitter:title" content="${data.title}" />
<meta name="twitter:description" content="${data.description}" />
<meta name="twitter:image" content="${data.image}" />
<meta name="twitter:image:alt" content="${data.alt}" />`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">{t('twitterCardGenerator.cardType')}</label>
            <select
              name="card"
              value={data.card}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="summary">{t('twitterCardGenerator.cardSummary')}</option>
              <option value="summary_large_image">{t('twitterCardGenerator.cardSummaryLargeImage')}</option>
              <option value="app">{t('twitterCardGenerator.cardApp')}</option>
              <option value="player">{t('twitterCardGenerator.cardPlayer')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">{t('twitterCardGenerator.title')}</label>
            <input
              type="text"
              name="title"
              value={data.title}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
              placeholder={t('twitterCardGenerator.titlePlaceholder')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">{t('twitterCardGenerator.description')}</label>
            <textarea
              name="description"
              value={data.description}
              onChange={handleChange}
              rows={3}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
              placeholder={t('twitterCardGenerator.descriptionPlaceholder')}
              maxLength={200}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">{t('twitterCardGenerator.imageUrl')}</label>
            <input
              type="url"
              name="image"
              value={data.image}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
              placeholder={t('twitterCardGenerator.imageUrlPlaceholder')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">{t('twitterCardGenerator.imageAltText')}</label>
            <input
              type="text"
              name="alt"
              value={data.alt}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
              placeholder={t('twitterCardGenerator.imageAltTextPlaceholder')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">{t('twitterCardGenerator.siteUsername')}</label>
              <input
                type="text"
                name="site"
                value={data.site}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
                placeholder={t('twitterCardGenerator.siteUsernamePlaceholder')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">{t('twitterCardGenerator.creatorUsername')}</label>
              <input
                type="text"
                name="creator"
                value={data.creator}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
                placeholder={t('twitterCardGenerator.creatorUsernamePlaceholder')}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">{t('twitterCardGenerator.preview')}</label>
            <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden max-w-sm mx-auto">
              {data.card === 'summary_large_image' ? (
                <div className="aspect-[2/1] bg-gray-700 relative">
                  {data.image ? (
                    <img src={data.image} alt={data.alt} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-300">{t('twitterCardGenerator.previewImageFallback')}</div>
                  )}
                </div>
              ) : (
                <div className="flex border-b border-gray-700">
                  <div className="w-1/3 aspect-square bg-gray-700 relative">
                    {data.image ? (
                      <img src={data.image} alt={data.alt} className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-300 text-xs">{t('twitterCardGenerator.previewImageFallback')}</div>
                    )}
                  </div>
                  <div className="w-2/3 p-3 bg-gray-900 flex flex-col justify-center">
                     <div className="font-bold text-white mb-1 line-clamp-1 text-sm">{data.title || t('twitterCardGenerator.previewTitleFallback')}</div>
                     <div className="text-xs text-gray-300 line-clamp-2">{data.description || t('twitterCardGenerator.previewDescriptionFallback')}</div>
                  </div>
                </div>
              )}
              {data.card === 'summary_large_image' && (
                <div className="p-4 bg-gray-900 border-t border-gray-700">
                  <div className="font-bold text-white mb-1 line-clamp-1">{data.title || t('twitterCardGenerator.previewTitleFallback')}</div>
                  <div className="text-sm text-gray-300 line-clamp-2">{data.description || t('twitterCardGenerator.previewDescriptionFallback')}</div>
                  <div className="text-xs text-gray-300 mt-2">example.com</div>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">{t('twitterCardGenerator.generatedHtml')}</label>
            <div className="relative">
              <textarea
                readOnly
                value={generateMetaTags()}
                rows={8}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-300 font-mono text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
