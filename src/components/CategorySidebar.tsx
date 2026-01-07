/**
 * 分类侧边栏组件
 * 显示同分类热门工具，提升内部链接和用户参与度
 * Requirements: 4.3
 */

'use client';

import { Link } from '@/i18n/routing';
import { Tool, ToolCategory, getToolsByCategory, categories } from '@/config/tools';
import { useTranslations } from 'next-intl';

interface CategorySidebarProps {
  /** 当前工具的 slug（用于排除和高亮） */
  currentSlug: string;
  /** 当前工具的类别 */
  category: ToolCategory;
  /** 最大显示数量，默认 8 */
  maxCount?: number;
  /** 自定义类名 */
  className?: string;
  /** 是否显示分类标题 */
  showCategoryTitle?: boolean;
}

/**
 * 获取分类热门工具
 * 优先显示热门工具，然后按字母顺序排列
 */
export function getCategoryPopularTools(
  category: ToolCategory,
  currentSlug: string,
  maxCount: number = 8
): Tool[] {
  const categoryTools = getToolsByCategory(category)
    .filter(tool => tool.slug !== currentSlug);
  
  // 按热门程度排序（popular 优先）
  const sortedTools = categoryTools.sort((a, b) => {
    if (a.popular && !b.popular) return -1;
    if (!a.popular && b.popular) return 1;
    return 0;
  });
  
  return sortedTools.slice(0, maxCount);
}

/**
 * 分类侧边栏组件
 * 显示同分类的热门工具列表
 */
export default function CategorySidebar({
  currentSlug,
  category,
  maxCount = 8,
  className = '',
  showCategoryTitle = true,
}: CategorySidebarProps) {
  const t = useTranslations('tools');
  const tNav = useTranslations('nav');
  
  // 获取分类信息
  const categoryInfo = categories.find(c => c.id === category);
  const categoryName = categoryInfo ? tNav(`categories.${category}`) : category;
  
  // 获取热门工具
  const popularTools = getCategoryPopularTools(category, currentSlug, maxCount);
  
  // 如果没有其他工具，不渲染
  if (popularTools.length === 0) {
    return null;
  }
  
  return (
    <aside 
      className={`bg-gray-50 dark:bg-gray-800/30 rounded-lg p-4 ${className}`}
      aria-labelledby="category-sidebar-heading"
    >
      {showCategoryTitle && (
        <h3 
          id="category-sidebar-heading"
          className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2"
        >
          {categoryInfo && (
            <span aria-hidden="true">{categoryInfo.icon}</span>
          )}
          <span>{categoryName}</span>
        </h3>
      )}
      
      <nav aria-label={`${categoryName} tools`}>
        <ul className="space-y-1">
          {popularTools.map((tool) => {
            const toolName = t(`${tool.slug}.name`);
            
            return (
              <li key={tool.slug}>
                <Link
                  href={`/tools/${tool.slug}`}
                  className="flex items-center gap-2 px-2 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded transition-colors"
                  title={toolName}
                >
                  <span className="text-base" aria-hidden="true">{tool.icon}</span>
                  <span className="truncate">{toolName}</span>
                  {tool.popular && (
                    <span className="ml-auto text-xs text-orange-500 dark:text-orange-400" aria-label="Popular">
                      🔥
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      {/* 查看全部链接 */}
      <Link
        href={`/tools/category/${category}`}
        className="mt-3 block text-center text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline"
      >
        {tNav('viewAll')} →
      </Link>
    </aside>
  );
}

/**
 * 紧凑版侧边栏（用于移动端或窄布局）
 */
export function CategorySidebarCompact({
  currentSlug,
  category,
  maxCount = 5,
  className = '',
}: Omit<CategorySidebarProps, 'showCategoryTitle'>) {
  const t = useTranslations('tools');
  
  const popularTools = getCategoryPopularTools(category, currentSlug, maxCount);
  
  if (popularTools.length === 0) {
    return null;
  }
  
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {popularTools.map((tool) => (
        <Link
          key={tool.slug}
          href={`/tools/${tool.slug}`}
          className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          title={t(`${tool.slug}.name`)}
        >
          <span aria-hidden="true">{tool.icon}</span>
          <span className="max-w-[100px] truncate">{t(`${tool.slug}.name`)}</span>
        </Link>
      ))}
    </div>
  );
}
