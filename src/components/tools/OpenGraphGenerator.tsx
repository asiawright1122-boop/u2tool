'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function OpenGraphGenerator() {
  const t = useTranslations('tools');
  const [data, setData] = useState({
    title: '',
    description: '',
    url: '',
    image: '',
    siteName: '',
    type: 'website'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const generateMetaTags = () => {
    return `<!-- Open Graph / Facebook -->
<meta property="og:type" content="${data.type}" />
<meta property="og:url" content="${data.url}" />
<meta property="og:title" content="${data.title}" />
<meta property="og:description" content="${data.description}" />
<meta property="og:image" content="${data.image}" />
<meta property="og:site_name" content="${data.siteName}" />`;
  };

  const previewHostname = (() => {
    if (!data.url) return 'example.com';
    try {
      return new URL(data.url).hostname;
    } catch {
      return data.url;
    }
  })();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">{t('openGraphGenerator.siteTitle')}</label>
            <input
              type="text"
              name="title"
              value={data.title}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
              placeholder={t('openGraphGenerator.siteTitlePlaceholder')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">{t('openGraphGenerator.siteDescription')}</label>
            <textarea
              name="description"
              value={data.description}
              onChange={handleChange}
              rows={3}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
              placeholder={t('openGraphGenerator.siteDescriptionPlaceholder')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">{t('openGraphGenerator.url')}</label>
            <input
              type="url"
              name="url"
              value={data.url}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
              placeholder={t('openGraphGenerator.urlPlaceholder')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">{t('openGraphGenerator.imageUrl')}</label>
            <input
              type="url"
              name="image"
              value={data.image}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
              placeholder={t('openGraphGenerator.imageUrlPlaceholder')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">{t('openGraphGenerator.siteName')}</label>
              <input
                type="text"
                name="siteName"
                value={data.siteName}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
                placeholder={t('openGraphGenerator.siteNamePlaceholder')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">{t('openGraphGenerator.type')}</label>
              <select
                name="type"
                value={data.type}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="website">{t('openGraphGenerator.typeWebsite')}</option>
                <option value="article">{t('openGraphGenerator.typeArticle')}</option>
                <option value="profile">{t('openGraphGenerator.typeProfile')}</option>
                <option value="video.movie">{t('openGraphGenerator.typeVideo')}</option>
                <option value="music.song">{t('openGraphGenerator.typeMusic')}</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">{t('openGraphGenerator.preview')}</label>
            <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden max-w-sm mx-auto">
              <div className="aspect-[1.91/1] bg-gray-700 relative">
                {data.image ? (
                  <img src={data.image} alt={t('openGraphGenerator.ogPreviewAlt')} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-300">
                    {t('openGraphGenerator.noImage')}
                  </div>
                )}
              </div>
              <div className="p-4 bg-gray-900">
                <div className="text-xs text-gray-300 uppercase mb-1">{previewHostname}</div>
                <div className="font-bold text-white mb-1 line-clamp-1">{data.title || t('openGraphGenerator.previewTitleFallback')}</div>
                <div className="text-sm text-gray-300 line-clamp-2">{data.description || t('openGraphGenerator.previewDescriptionFallback')}</div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">{t('openGraphGenerator.generatedHtml')}</label>
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
