'use client';

import { useTranslations } from 'next-intl';

interface TrustSignals {
  totalTools: number;
  freeToUse: boolean;
  noRegistration: boolean;
  browserBased: boolean;
  dataPrivacy: boolean;
  supportedLanguages: number;
}

interface AboutPageClientProps {
  trustSignals: TrustSignals;
}

export default function AboutPageClient({ trustSignals }: AboutPageClientProps) {
  const t = useTranslations('about');

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">{t('title')}</h1>
      
      <div className="space-y-8 text-gray-700 dark:text-gray-300">
        <p className="text-lg leading-relaxed">{t('intro')}</p>

        {/* 信任信号统计 */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800/50 text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{trustSignals.totalTools}+</div>
            <div className="text-sm text-blue-700 dark:text-blue-300">{t('stats.tools')}</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800/50 text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">100%</div>
            <div className="text-sm text-green-700 dark:text-green-300">{t('stats.free')}</div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-200 dark:border-purple-800/50 text-center">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{trustSignals.supportedLanguages}</div>
            <div className="text-sm text-purple-700 dark:text-purple-300">{t('stats.languages')}</div>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border border-orange-200 dark:border-orange-800/50 text-center">
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">0</div>
            <div className="text-sm text-orange-700 dark:text-orange-300">{t('stats.dataCollected')}</div>
          </div>
        </section>

        <section className="bg-gray-100 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t('mission.title')}</h2>
          <p>{t('mission.content')}</p>
        </section>

        <section className="bg-gray-100 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t('features.title')}</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>{t('features.free')}</li>
            <li>{t('features.privacy')}</li>
            <li>{t('features.fast')}</li>
            <li>{t('features.multilingual')}</li>
          </ul>
        </section>

        {/* 信任徽章 */}
        <section className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800/50">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t('trust.title')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔒</span>
              <span className="text-sm">{t('trust.secure')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌐</span>
              <span className="text-sm">{t('trust.browserBased')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🚫</span>
              <span className="text-sm">{t('trust.noTracking')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">✨</span>
              <span className="text-sm">{t('trust.noAds')}</span>
            </div>
          </div>
        </section>

        <section className="bg-gray-100 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t('technology.title')}</h2>
          <p>{t('technology.content')}</p>
        </section>

        <section className="bg-gray-100 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t('contact.title')}</h2>
          <p>{t('contact.content')}</p>
        </section>
      </div>
    </div>
  );
}
