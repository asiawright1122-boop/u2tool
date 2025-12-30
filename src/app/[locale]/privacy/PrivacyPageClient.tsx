'use client';

import { useTranslations } from 'next-intl';

export default function PrivacyPageClient() {
  const t = useTranslations('privacy');

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">{t('title')}</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">{t('lastUpdated')}</p>
      
      <div className="space-y-8 text-gray-700 dark:text-gray-300">
        <p className="text-lg">{t('intro')}</p>

        <section className="bg-gray-100 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t('dataCollection.title')}</h2>
          <p>{t('dataCollection.content')}</p>
        </section>

        <section className="bg-gray-100 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t('localProcessing.title')}</h2>
          <p>{t('localProcessing.content')}</p>
        </section>

        <section className="bg-gray-100 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t('cookies.title')}</h2>
          <p>{t('cookies.content')}</p>
        </section>

        <section className="bg-gray-100 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t('thirdParty.title')}</h2>
          <p>{t('thirdParty.content')}</p>
        </section>

        <section className="bg-gray-100 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t('changes.title')}</h2>
          <p>{t('changes.content')}</p>
        </section>

        <section className="bg-gray-100 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t('contact.title')}</h2>
          <p>{t('contact.content')}</p>
        </section>
      </div>
    </div>
  );
}
