'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { categories, getToolsByCategory, type Tool, type ToolCategory } from '@/config/tools';
import ToolCard from './ToolCard';

/**
 * 精选工具网格组件属性
 */
export interface FeaturedToolsGridProps {
  /** 每个分类显示的最大工具数量 */
  maxToolsPerCategory?: number;
  /** 要显示的分类列表（可选，默认显示所有） */
  categoryIds?: ToolCategory[];
  /** 是否显示"查看更多"链接 */
  showViewMore?: boolean;
  /** 自定义类名 */
  className?: string;
}

/**
 * 分类工具区块组件
 */
interface CategorySectionProps {
  categoryId: ToolCategory;
  categoryIcon: string;
  tools: Tool[];
  maxTools: number;
  showViewMore: boolean;
}

function CategorySection({ categoryId, categoryIcon, tools, maxTools, showViewMore }: CategorySectionProps) {
  const t = useTranslations();
  const categoryName = t(`categories.${categoryId}`);
  const displayTools = tools.slice(0, maxTools);
  const hasMore = tools.length > maxTools;

  return (
    <section className="mb-8">
      {/* 分类标题 */}
      <div className="flex items-center justify-between mb-4">
        <Link
          href={`/tools/category/${categoryId}`}
          className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
        >
          <span className="text-xl group-hover:scale-110 transition-transform">{categoryIcon}</span>
          <span>{categoryName}</span>
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
            ({tools.length})
          </span>
        </Link>
        
        {showViewMore && hasMore && (
          <Link
            href={`/tools/category/${categoryId}`}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors flex items-center gap-1"
          >
            {t('home.viewMore')}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>

      {/* 工具网格 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {displayTools.map((tool) => (
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
}

/**
 * 精选工具网格组件
 * 按分类显示工具，支持限制每个分类的工具数量
 * 
 * @see Requirements 2.4, 7.1, 7.2, 7.3, 7.4
 */
export default function FeaturedToolsGrid({
  maxToolsPerCategory = 6,
  categoryIds,
  showViewMore = true,
  className = '',
}: FeaturedToolsGridProps) {
  // 获取要显示的分类
  const displayCategories = categoryIds
    ? categories.filter(cat => categoryIds.includes(cat.id))
    : categories;

  // 获取每个分类的工具
  const categoriesWithTools = displayCategories
    .map(cat => ({
      ...cat,
      tools: getToolsByCategory(cat.id),
    }))
    .filter(cat => cat.tools.length > 0);

  return (
    <div className={className}>
      {categoriesWithTools.map((category) => (
        <CategorySection
          key={category.id}
          categoryId={category.id}
          categoryIcon={category.icon}
          tools={category.tools}
          maxTools={maxToolsPerCategory}
          showViewMore={showViewMore}
        />
      ))}
    </div>
  );
}

/**
 * 获取分类工具数量
 * 用于测试
 */
export function getCategoryToolCount(categoryId: ToolCategory): number {
  return getToolsByCategory(categoryId).length;
}

/**
 * 判断是否应该显示"查看更多"链接
 * 用于测试
 */
export function shouldShowViewMore(toolCount: number, maxTools: number): boolean {
  return toolCount > maxTools;
}
