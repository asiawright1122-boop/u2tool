'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { categories, getToolsByCategory } from '@/config/tools';
import ToolCard from '@/components/ToolCard';

/**
 * 工具列表页面客户端组件
 * 注意：侧边栏已移到全局布局中
 */
export default function ToolsPageClient() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const [_activeCategory, setActiveCategory] = useState<string | undefined>(categoryParam || undefined);

  // 处理分类锚点滚动
  useEffect(() => {
    if (categoryParam) {
      setActiveCategory(categoryParam);
      const element = document.getElementById(`category-${categoryParam}`);
      if (element) {
        const timer = setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
        
        return () => clearTimeout(timer);
      }
    }
  }, [categoryParam]);

  // 监听滚动，更新活动分类
  useEffect(() => {
    const handleScroll = () => {
      const sections = categories.map(cat => ({
        id: cat.id,
        element: document.getElementById(`category-${cat.id}`),
      })).filter(s => s.element);

      for (const section of sections) {
        if (section.element) {
          const rect = section.element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom > 150) {
            setActiveCategory(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="py-8 px-4 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">{t('nav.tools')}</h1>
        </div>

        {/* 分类工具列表 */}
        {categories.map((cat) => {
          const categoryTools = getToolsByCategory(cat.id);
          if (categoryTools.length === 0) return null;

          return (
            <section 
              key={cat.id} 
              id={`category-${cat.id}`}
              className="mb-10 scroll-mt-24"
            >
              {/* 分类标题 */}
              <Link 
                href={`/tools/category/${cat.id}`}
                className="text-xl lg:text-2xl font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
              >
                <span className="text-2xl">{cat.icon}</span>
                {t(`categories.${cat.id}`)}
                <span className="text-sm font-normal text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  ({categoryTools.length})
                </span>
              </Link>
              
              {/* 工具网格 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
                {categoryTools.map((tool) => (
                  <ToolCard
                    key={tool.slug}
                    tool={tool}
                    variant="grid"
                    showBadge={true}
                    showDescription={true}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
