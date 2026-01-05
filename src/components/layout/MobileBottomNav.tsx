'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { categories, type ToolCategory } from '@/config/tools';

/**
 * 移动端底部导航组件属性
 */
export interface MobileBottomNavProps {
  /** 当前活动的分类 */
  activeCategory?: string;
  /** 分类选择回调 */
  onCategorySelect?: (categoryId: string) => void;
  /** 自定义类名 */
  className?: string;
}

/**
 * 主要分类（显示在底部导航栏）
 */
const mainCategories: ToolCategory[] = ['text', 'encoding', 'converters', 'development'];

/**
 * 移动端底部导航组件
 * 在移动端显示主要分类快捷入口，支持展开完整分类列表
 * 
 * @see Requirements 1.5, 4.3
 */
export default function MobileBottomNav({
  activeCategory,
  onCategorySelect,
  className = '',
}: MobileBottomNavProps) {
  const t = useTranslations();
  const [isExpanded, setIsExpanded] = useState(false);

  // 获取主要分类数据
  const mainCategoryData = categories.filter(cat => mainCategories.includes(cat.id));

  return (
    <>
      {/* 展开的分类面板 */}
      {isExpanded && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsExpanded(false)}
        >
          <div 
            className="absolute bottom-16 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-2xl p-4 max-h-[60vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid grid-cols-4 gap-3">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/tools/category/${category.id}`}
                  onClick={() => {
                    setIsExpanded(false);
                    onCategorySelect?.(category.id);
                  }}
                  className={`
                    flex flex-col items-center gap-1 p-3 rounded-xl transition-colors
                    ${activeCategory === category.id
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }
                  `}
                >
                  <span className="text-2xl">{category.icon}</span>
                  <span className="text-xs font-medium truncate w-full text-center">
                    {t(`categories.${category.id}`)}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 底部导航栏 */}
      <nav 
        className={`
          fixed bottom-0 left-0 right-0 z-50 md:hidden
          bg-white dark:bg-gray-900 
          border-t border-gray-200 dark:border-gray-800
          safe-area-inset-bottom
          ${className}
        `}
      >
        <div className="flex items-center justify-around h-16 px-2">
          {/* 首页 */}
          <Link
            href="/"
            className="flex flex-col items-center gap-1 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs">{t('nav.home')}</span>
          </Link>

          {/* 主要分类 */}
          {mainCategoryData.slice(0, 3).map((category) => (
            <Link
              key={category.id}
              href={`/tools/category/${category.id}`}
              onClick={() => onCategorySelect?.(category.id)}
              className={`
                flex flex-col items-center gap-1 px-3 py-2 transition-colors
                ${activeCategory === category.id
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                }
              `}
            >
              <span className="text-xl">{category.icon}</span>
              <span className="text-xs truncate max-w-[60px]">
                {t(`categories.${category.id}`)}
              </span>
            </Link>
          ))}

          {/* 更多分类按钮 */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`
              flex flex-col items-center gap-1 px-3 py-2 transition-colors
              ${isExpanded
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
              }
            `}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span className="text-xs">{t('nav.more')}</span>
          </button>
        </div>
      </nav>
    </>
  );
}
