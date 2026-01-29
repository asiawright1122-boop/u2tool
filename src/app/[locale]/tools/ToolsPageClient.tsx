'use client';

import { useState, useCallback, useRef, useEffect, memo } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import { categories, getToolsByCategory, type Tool } from '@/config/tools';
import ToolCard from '@/components/ToolCard';

// 每个分类初始显示的工具数量
const INITIAL_TOOLS_PER_CATEGORY = 8;
// 每次加载更多的数量
const LOAD_MORE_COUNT = 8;

/**
 * 分类区块组件 - 使用 memo 避免不必要的重渲染
 */
const CategorySection = memo(function CategorySection({
  category,
  tools,
  isExpanded,
  onToggleExpand,
}: {
  category: { id: string; icon: string };
  tools: Tool[];
  isExpanded: boolean;
  onToggleExpand: () => void;
}) {
  const t = useTranslations();
  const visibleTools = isExpanded ? tools : tools.slice(0, INITIAL_TOOLS_PER_CATEGORY);
  const hasMore = tools.length > INITIAL_TOOLS_PER_CATEGORY;

  return (
    <section 
      id={`category-${category.id}`}
      className="mb-10 scroll-mt-24"
    >
      {/* 分类标题 */}
      <Link 
        href={`/tools/category/${category.id}`}
        className="text-xl lg:text-2xl font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
      >
        <span className="text-2xl">{category.icon}</span>
        {t(`categories.${category.id}`)}
        <span className="text-sm font-normal text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400">
          ({tools.length})
        </span>
      </Link>
      
      {/* 工具网格 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
        {visibleTools.map((tool) => (
          <ToolCard
            key={tool.slug}
            tool={tool}
            variant="grid"
            showBadge={true}
            showDescription={true}
          />
        ))}
      </div>

      {/* 展开/收起按钮 */}
      {hasMore && (
        <div className="mt-4 text-center">
          <button
            onClick={onToggleExpand}
            className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
          >
            {isExpanded 
              ? t('common.showLess', { defaultValue: '收起' })
              : t('common.showMore', { defaultValue: `显示全部 ${tools.length} 个工具` })
            }
          </button>
        </div>
      )}
    </section>
  );
});

/**
 * 工具列表页面客户端组件
 * 性能优化：
 * - 初始只显示每个分类的前 8 个工具
 * - 点击"显示更多"展开完整列表
 * - 使用 memo 避免不必要的重渲染
 */
export default function ToolsPageClient() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [_activeCategory, setActiveCategory] = useState<string | undefined>(categoryParam || undefined);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  // 切换分类展开状态
  const toggleCategory = useCallback((categoryId: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  }, []);

  // 处理分类锚点滚动
  useEffect(() => {
    if (categoryParam) {
      setActiveCategory(categoryParam);
      // 如果通过 URL 参数跳转到某个分类，自动展开该分类
      setExpandedCategories(prev => new Set(prev).add(categoryParam));
      
      const element = document.getElementById(`category-${categoryParam}`);
      if (element) {
        scrollTimeoutRef.current = setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
    
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [categoryParam]);

  // 监听滚动，更新活动分类（使用 passive 和节流）
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
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
          ticking = false;
        });
        ticking = true;
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
            <CategorySection
              key={cat.id}
              category={cat}
              tools={categoryTools}
              isExpanded={expandedCategories.has(cat.id)}
              onToggleExpand={() => toggleCategory(cat.id)}
            />
          );
        })}
      </div>
    </div>
  );
}
