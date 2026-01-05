'use client';

import { useTranslations } from 'next-intl';
import { tools, getPopularTools } from '@/config/tools';
import PopularToolsCarousel from '@/components/PopularToolsCarousel';
import RecentToolsList from '@/components/RecentToolsList';

/**
 * 首页客户端组件
 * 注意：侧边栏已移到全局布局中，此组件仅负责首页内容
 */
export default function HomePageClient() {
  const t = useTranslations();
  const popularTools = getPopularTools();

  return (
    <>
      {/* Hero Section - 两栏等高布局 */}
      <section className="py-6 px-4">
        <div className="max-w-5xl mx-auto">
          {/* 两栏等高布局 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
            {/* 左侧：Hero 卡片 - 深天青色渐变 */}
            <div className="lg:col-span-2 relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-700 via-cyan-800 to-slate-800 dark:from-cyan-900 dark:via-slate-900 dark:to-slate-950 p-10 flex flex-col justify-center min-h-[280px]">
              {/* 背景装饰 */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-500/20 via-cyan-600/10 to-transparent" />
              <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-500/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
              
              <div className="relative z-10 text-center">
                {/* 标题 */}
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
                  {t('home.hero.title')}
                </h1>
                
                {/* 副标题 */}
                <p className="text-lg text-cyan-100 dark:text-gray-300 mb-10 max-w-xl mx-auto leading-relaxed">
                  {t('home.hero.subtitle')}
                </p>

                {/* 统计数据 */}
                <div className="flex justify-center gap-12 md:gap-16">
                  <div className="text-center">
                    <div className="text-4xl md:text-5xl font-bold text-white mb-2">{tools.length}+</div>
                    <div className="text-sm text-cyan-200 dark:text-gray-400">{t('home.stats.tools')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl md:text-5xl font-bold text-white mb-2">{t('home.stats.usageValue')}</div>
                    <div className="text-sm text-cyan-200 dark:text-gray-400">{t('home.stats.usageCount')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl md:text-5xl font-bold text-white mb-2">100%</div>
                    <div className="text-sm text-cyan-200 dark:text-gray-400">{t('home.stats.free')}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 右侧：最新工具卡片 */}
            <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 flex flex-col">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="text-green-500 text-base">+</span>
                {t('home.recentTools')}
              </h3>
              <div className="flex-1">
                <RecentToolsList maxItems={4} compact />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Tools Section */}
      <section className="py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{t('home.popular')}</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{t('home.popularDesc')}</p>
            </div>
          </div>

          <PopularToolsCarousel
            tools={popularTools}
            displayCount={12}
            rotateInterval={10000}
          />
        </div>
      </section>
    </>
  );
}
