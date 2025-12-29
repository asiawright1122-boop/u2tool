'use client';

import { useTranslations } from 'next-intl';

export default function AboutPageClient() {
  const t = useTranslations('about');

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">{t('title')}</h1>
      
      <div className="space-y-8 text-gray-300">
        <p className="text-lg leading-relaxed">{t('intro')}</p>

        <section className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
          <h2 className="text-xl font-semibold text-white mb-4">{t('mission.title')}</h2>
          <p>{t('mission.content')}</p>
        </section>

        <section className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
          <h2 className="text-xl font-semibold text-white mb-4">{t('features.title')}</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>{t('features.free')}</li>
            <li>{t('features.privacy')}</li>
            <li>{t('features.fast')}</li>
            <li>{t('features.multilingual')}</li>
          </ul>
        </section>

        <section className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
          <h2 className="text-xl font-semibold text-white mb-4">{t('technology.title')}</h2>
          <p>{t('technology.content')}</p>
        </section>

        <section className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
          <h2 className="text-xl font-semibold text-white mb-4">{t('contact.title')}</h2>
          <p>{t('contact.content')}</p>
        </section>
      </div>
    </div>
  );
}
