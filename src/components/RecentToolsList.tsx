'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { tools, type Tool } from '@/config/tools';

/**
 * 最新工具列表组件属性
 */
export interface RecentToolsListProps {
  /** 显示的最大工具数量 */
  maxItems?: number;
  /** 自定义工具列表（可选，默认使用最后添加的工具） */
  recentTools?: Tool[];
  /** 自定义类名 */
  className?: string;
  /** 紧凑模式（无边框和标题） */
  compact?: boolean;
}

/**
 * 最新工具项组件
 */
interface RecentToolItemProps {
  tool: Tool;
}

function RecentToolItem({ tool }: RecentToolItemProps) {
  const t = useTranslations('tools');
  const name = t(`${tool.slug}.name`);
  const description = t(`${tool.slug}.description`);

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
    >
      <span className="text-xl flex-shrink-0 group-hover:scale-110 transition-transform">
        {tool.icon}
      </span>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {name}
        </h4>
        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-0.5">
          {description}
        </p>
      </div>
    </Link>
  );
}

/**
 * 最新工具列表组件
 * 显示最近添加的工具
 * 
 * @see Requirements 6.1, 6.2, 6.3, 6.4
 */
export default function RecentToolsList({
  maxItems = 5,
  recentTools,
  className = '',
  compact = false,
}: RecentToolsListProps) {
  const t = useTranslations('home');
  
  // 使用传入的工具列表或获取最后添加的工具
  const displayTools = recentTools ?? getRecentTools(maxItems);

  // 紧凑模式：无边框和标题
  if (compact) {
    return (
      <div className={`space-y-1 ${className}`}>
        {displayTools.map((tool) => (
          <RecentToolItem key={tool.slug} tool={tool} />
        ))}
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* 标题 */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          {t('recentTools')}
        </h3>
      </div>

      {/* 工具列表 */}
      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        {displayTools.map((tool) => (
          <RecentToolItem key={tool.slug} tool={tool} />
        ))}
      </div>
    </div>
  );
}

/**
 * 获取最近添加的工具
 * 由于工具列表是按添加顺序排列的，取最后几个即可
 */
export function getRecentTools(count: number = 5): Tool[] {
  return tools.slice(-count).reverse();
}

/**
 * 生成工具链接
 * 用于测试
 */
export function getToolLink(tool: Tool): string {
  return `/tools/${tool.slug}`;
}
