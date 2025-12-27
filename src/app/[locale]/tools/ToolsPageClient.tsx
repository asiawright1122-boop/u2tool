'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { categories, getToolsByCategory } from '@/config/tools';

/**
 * 工具列表页面客户端组件
 * 处理分类滚动和交互逻辑
 */
export default function ToolsPageClient() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');

  // 处理分类锚点滚动
  useEffect(() => {
    if (categoryParam) {
      const element = document.getElementById(`category-${categoryParam}`);
      if (element) {
        // 延迟一点确保页面渲染完成
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [categoryParam]);

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 分类导航区域 - 与下方工具卡片网格宽度一致 */}
        <div className="mb-12">
          {/* h1 标题：页面主标题，SEO 重要 */}
          <h1 className="text-4xl font-bold mb-6 text-center">{t('nav.tools')}</h1>

          {/* 分类快速导航 - 5列网格对称布局 */}
          <nav aria-label="Tool categories">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/tools/category/${cat.id}`}
                  className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 hover:border-gray-600 transition-colors flex items-center justify-center gap-2 text-sm whitespace-nowrap"
                >
                  <span>{cat.icon}</span>
                  {t(`categories.${cat.id}`)}
                </Link>
              ))}
            </div>
          </nav>
        </div>

        {categories.map((cat) => {
          const categoryTools = getToolsByCategory(cat.id);
          if (categoryTools.length === 0) return null;

          return (
            <section 
              key={cat.id} 
              id={`category-${cat.id}`}
              className="mb-12 scroll-mt-24"
            >
              {/* h2 标题：分类标题，带链接到分类页面 */}
              <Link 
                href={`/tools/category/${cat.id}`}
                className="text-2xl font-bold mb-6 flex items-center gap-2 hover:text-blue-400 transition-colors group"
              >
                <span>{cat.icon}</span>
                {t(`categories.${cat.id}`)}
                <span className="text-sm text-gray-500 group-hover:text-blue-400">
                  ({categoryTools.length})
                </span>
              </Link>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {categoryTools.map((tool) => (
                  <Link
                    key={tool.slug}
                    href={`/tools/${tool.slug}`}
                    className="tool-card p-4 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-750 hover:border-gray-600 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{tool.icon}</span>
                      <div>
                        {/* h3 标题：工具名称，正确的标题层级 */}
                        <h3 className="font-medium text-white">{t(`tools.${tool.slug}.name`)}</h3>
                        <p className="text-sm text-gray-300 line-clamp-2">
                          {t(`tools.${tool.slug}.description`)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
