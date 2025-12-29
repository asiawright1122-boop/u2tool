'use client';

import { useTranslations } from 'next-intl';

export default function TermsPageClient() {
  const t = useTranslations('terms');

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">{t('title')}</h1>
      <p className="text-sm text-gray-400 mb-8">{t('lastUpdated')}</p>
      
      <div className="space-y-8 text-gray-300">
        <p className="text-lg">{t('intro')}</p>

        <section className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
          <h2 className="text-xl font-semibold text-white mb-4">{t('useOfService.title')}</h2>
          <p>{t('useOfService.content')}</p>
        </section>

        <section className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
          <h2 className="text-xl font-semibold text-white mb-4">{t('disclaimer.title')}</h2>
          <p>{t('disclaimer.content')}</p>
        </section>

        <section className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
          <h2 className="text-xl font-semibold text-white mb-4">{t('limitations.title')}</h2>
          <p>{t('limitations.content')}</p>
        </section>

        <section className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
          <h2 className="text-xl font-semibold text-white mb-4">{t('intellectualProperty.title')}</h2>
          <p>{t('intellectualProperty.content')}</p>
        </section>

        <section className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
          <h2 className="text-xl font-semibold text-white mb-4">{t('prohibited.title')}</h2>
          <p>{t('prohibited.content')}</p>
        </section>

        <section className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
          <h2 className="text-xl font-semibold text-white mb-4">{t('changes.title')}</h2>
          <p>{t('changes.content')}</p>
        </section>

        <section className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
          <h2 className="text-xl font-semibold text-white mb-4">{t('contact.title')}</h2>
          <p>{t('contact.content')}</p>
        </section>
      </div>
    </div>
  );
}
