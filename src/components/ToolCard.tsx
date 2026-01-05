'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { type Tool } from '@/config/tools';

/**
 * 工具卡片展示变体
 */
export type ToolCardVariant = 'grid' | 'list' | 'compact';

/**
 * 工具卡片组件属性
 */
export interface ToolCardProps {
  /** 工具数据 */
  tool: Tool;
  /** 展示变体 */
  variant?: ToolCardVariant;
  /** 是否显示热门标签 */
  showBadge?: boolean;
  /** 是否显示描述 */
  showDescription?: boolean;
  /** 自定义类名 */
  className?: string;
}

/**
 * 热门标签组件
 */
function PopularBadge() {
  const t = useTranslations('tools');
  return (
    <span className="absolute top-2 right-2 px-2 py-0.5 text-xs font-medium bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full shadow-sm">
      {t('popular')}
    </span>
  );
}

/**
 * 工具卡片组件
 * 支持多种展示变体，显示工具图标、名称、描述和热门标签
 * 
 * @see Requirements 3.1, 3.2, 3.3, 3.4, 3.5
 */
export default function ToolCard({
  tool,
  variant = 'grid',
  showBadge = true,
  showDescription = true,
  className = '',
}: ToolCardProps) {
  const t = useTranslations('tools');
  
  const name = t(`${tool.slug}.name`);
  const description = t(`${tool.slug}.description`);
  const href = `/tools/${tool.slug}`;
  const isPopular = tool.popular === true;

  // Grid 变体 - 卡片式布局
  if (variant === 'grid') {
    return (
      <Link
        href={href}
        className={`
          relative group block p-4 
          bg-white dark:bg-gray-800 
          border border-gray-200 dark:border-gray-700 
          rounded-xl
          hover:border-blue-300 dark:hover:border-blue-600
          hover:shadow-lg hover:shadow-blue-500/10
          hover:-translate-y-0.5
          transition-all duration-200
          ${className}
        `}
      >
        {showBadge && isPopular && <PopularBadge />}
        
        <div className="flex items-start gap-3">
          <span className="text-3xl group-hover:scale-110 transition-transform duration-200">
            {tool.icon}
          </span>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {name}
            </h3>
            {showDescription && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                {description}
              </p>
            )}
          </div>
        </div>
      </Link>
    );
  }

  // List 变体 - 列表式布局
  if (variant === 'list') {
    return (
      <Link
        href={href}
        className={`
          relative group flex items-center gap-4 p-3
          bg-white dark:bg-gray-800 
          border border-gray-200 dark:border-gray-700 
          rounded-lg
          hover:border-blue-300 dark:hover:border-blue-600
          hover:bg-gray-50 dark:hover:bg-gray-750
          transition-all duration-200
          ${className}
        `}
      >
        <span className="text-2xl flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
          {tool.icon}
        </span>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {name}
            </h3>
            {showBadge && isPopular && (
              <span className="px-1.5 py-0.5 text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded">
                {t('popular')}
              </span>
            )}
          </div>
          {showDescription && (
            <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400 truncate">
              {description}
            </p>
          )}
        </div>

        <svg 
          className="w-5 h-5 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-200" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    );
  }

  // Compact 变体 - 紧凑式布局
  return (
    <Link
      href={href}
      className={`
        relative group flex items-center gap-2 px-3 py-2
        bg-gray-50 dark:bg-gray-800/50 
        border border-gray-200 dark:border-gray-700 
        rounded-lg
        hover:border-blue-300 dark:hover:border-blue-600
        hover:bg-white dark:hover:bg-gray-800
        transition-all duration-200
        ${className}
      `}
    >
      <span className="text-lg group-hover:scale-110 transition-transform duration-200">
        {tool.icon}
      </span>
      
      <span className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-300 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {name}
      </span>

      {showBadge && isPopular && (
        <span className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0" title={t('popular')} />
      )}
    </Link>
  );
}

/**
 * 生成工具链接路径
 * 用于测试和其他需要获取链接的场景
 */
export function getToolHref(tool: Tool): string {
  return `/tools/${tool.slug}`;
}
