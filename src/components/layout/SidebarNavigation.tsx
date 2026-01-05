'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { categories, type ToolCategory } from '@/config/tools';
import Logo from '@/components/Logo';

/**
 * 侧边栏导航组件属性
 */
export interface SidebarNavigationProps {
  /** 当前活动的分类 ID */
  activeCategory?: string;
  /** 是否折叠（仅显示图标） */
  collapsed?: boolean;
  /** 分类点击回调 */
  onCategoryClick?: (categoryId: string) => void;
  /** 首页点击回调（用于清除分类筛选） */
  onHomeClick?: () => void;
  /** 是否阻止导航（点击分类时不跳转页面） */
  preventNavigation?: boolean;
  /** 自定义类名 */
  className?: string;
}

/**
 * 分类项组件属性
 */
interface CategoryItemProps {
  id: ToolCategory;
  icon: string;
  isActive: boolean;
  collapsed: boolean;
  preventNavigation?: boolean;
  onClick?: () => void;
}

/**
 * 分类项组件
 */
function CategoryItem({ id, icon, isActive, collapsed, preventNavigation, onClick }: CategoryItemProps) {
  const t = useTranslations('categories');
  const name = t(id);

  const handleClick = (e: React.MouseEvent) => {
    if (preventNavigation) {
      e.preventDefault();
    }
    onClick?.();
  };

  const className = `
    flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 w-full text-left
    ${collapsed ? 'justify-center' : 'pl-8'}
    ${isActive
      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
    }
  `;

  // 如果阻止导航，使用 button 元素
  if (preventNavigation) {
    return (
      <button
        onClick={handleClick}
        className={className}
        title={collapsed ? name : undefined}
        type="button"
      >
        <span className={`text-base ${isActive ? 'scale-110' : ''} transition-transform`}>
          {icon}
        </span>
        {!collapsed && (
          <span className="flex-1 text-sm truncate">{name}</span>
        )}
      </button>
    );
  }

  // 否则使用 Link 元素
  return (
    <Link
      href={`/tools/category/${id}`}
      onClick={handleClick}
      className={className}
      title={collapsed ? name : undefined}
    >
      <span className={`text-base ${isActive ? 'scale-110' : ''} transition-transform`}>
        {icon}
      </span>
      {!collapsed && (
        <span className="flex-1 text-sm truncate">{name}</span>
      )}
    </Link>
  );
}

/**
 * 侧边栏导航组件
 * 显示 Logo、导航链接和工具分类
 */
export default function SidebarNavigation({
  activeCategory,
  collapsed = false,
  onCategoryClick,
  onHomeClick,
  preventNavigation = false,
  className = '',
}: SidebarNavigationProps) {
  const t = useTranslations();
  const [toolsExpanded, setToolsExpanded] = useState(true);
  const [rankingExpanded, setRankingExpanded] = useState(true);

  return (
    <nav
      className={`
        h-full w-full
        bg-white dark:bg-gray-900 
        border-r border-gray-200 dark:border-gray-800
        overflow-y-auto overflow-x-hidden
        ${className}
      `}
      role="navigation"
      aria-label={t('nav.categories')}
    >
      {/* Logo 区域 */}
      <div className="h-16 flex items-center px-4 border-b border-gray-200 dark:border-gray-800">
        <Link href="/" className="flex items-center gap-2">
          <Logo width={28} height={28} />
          {!collapsed && (
            <span className="text-lg font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              {t('site.name')}
            </span>
          )}
        </Link>
      </div>

      <div className="py-3 px-2">
        {/* 首页链接 */}
        {preventNavigation ? (
          <button
            onClick={onHomeClick}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
              ${collapsed ? 'justify-center' : ''}
              text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white
            `}
            title={collapsed ? t('nav.home') : undefined}
            type="button"
          >
            <span className="text-lg">🏠</span>
            {!collapsed && <span className="text-sm font-medium">{t('nav.home')}</span>}
          </button>
        ) : (
          <Link
            href="/"
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
              ${collapsed ? 'justify-center' : ''}
              text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white
            `}
            title={collapsed ? t('nav.home') : undefined}
          >
            <span className="text-lg">🏠</span>
            {!collapsed && <span className="text-sm font-medium">{t('nav.home')}</span>}
          </Link>
        )}

        {/* 排行榜 - 可折叠 */}
        <div>
          <button
            onClick={() => !collapsed && setRankingExpanded(!rankingExpanded)}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
              ${collapsed ? 'justify-center' : ''}
              text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800
            `}
            title={collapsed ? t('nav.ranking') : undefined}
          >
            <span className="text-lg">🏆</span>
            {!collapsed && (
              <>
                <span className="flex-1 text-sm font-medium text-left">{t('nav.ranking')}</span>
                <svg 
                  className={`w-4 h-4 transition-transform ${rankingExpanded ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </>
            )}
          </button>

          {/* 排行榜子分类 */}
          {!collapsed && rankingExpanded && (
            <nav className="mt-1 space-y-0.5">
              <Link
                href="/tools/ranking/newest"
                className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 pl-8 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
              >
                <span className="text-base">🆕</span>
                <span className="flex-1 text-sm truncate">{t('nav.newest')}</span>
              </Link>
              <Link
                href="/tools/ranking/popular"
                className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 pl-8 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
              >
                <span className="text-base">🔥</span>
                <span className="flex-1 text-sm truncate">{t('nav.hottest')}</span>
              </Link>
            </nav>
          )}
        </div>

        {/* 分隔线 */}
        <div className="h-px bg-gray-200 dark:bg-gray-700 my-2 mx-2" />

        {/* 工具分类 - 可折叠 */}
        <div>
          <button
            onClick={() => !collapsed && setToolsExpanded(!toolsExpanded)}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
              ${collapsed ? 'justify-center' : ''}
              text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800
            `}
            title={collapsed ? t('nav.toolCategories') : undefined}
          >
            <span className="text-lg">🛠️</span>
            {!collapsed && (
              <>
                <span className="flex-1 text-sm font-medium text-left">{t('nav.toolCategories')}</span>
                <svg 
                  className={`w-4 h-4 transition-transform ${toolsExpanded ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </>
            )}
          </button>

          {/* 分类列表 - 折叠内容 */}
          {!collapsed && toolsExpanded && (
            <nav className="mt-1 space-y-0.5">
              {categories.map((category) => (
                <CategoryItem
                  key={category.id}
                  id={category.id}
                  icon={category.icon}
                  isActive={activeCategory === category.id}
                  collapsed={collapsed}
                  preventNavigation={preventNavigation}
                  onClick={() => onCategoryClick?.(category.id)}
                />
              ))}
            </nav>
          )}

          {/* 折叠状态下显示分类图标 */}
          {collapsed && (
            <nav className="mt-1 space-y-0.5">
              {categories.slice(0, 5).map((category) => (
                <CategoryItem
                  key={category.id}
                  id={category.id}
                  icon={category.icon}
                  isActive={activeCategory === category.id}
                  collapsed={collapsed}
                  preventNavigation={preventNavigation}
                  onClick={() => onCategoryClick?.(category.id)}
                />
              ))}
            </nav>
          )}
        </div>

        {/* 分隔线 */}
        <div className="h-px bg-gray-200 dark:bg-gray-700 my-2 mx-2" />

        {/* 博客链接 */}
        <Link
          href="/blog"
          className={`
            flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
            ${collapsed ? 'justify-center' : ''}
            text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white
          `}
          title={collapsed ? t('nav.blog') : undefined}
        >
          <span className="text-lg">📝</span>
          {!collapsed && <span className="text-sm font-medium">{t('nav.blog')}</span>}
        </Link>
      </div>
    </nav>
  );
}

/**
 * 导出分类数据供测试使用
 */
export { categories };
