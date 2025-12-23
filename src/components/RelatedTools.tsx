/**
 * 相关工具组件
 * 显示同类别的其他工具，用于内部链接优化
 */

'use client';

import { Link } from '@/i18n/routing';
import { Tool, getToolsByCategory, ToolCategory } from '@/config/tools';
import { useTranslations } from 'next-intl';

interface RelatedToolsProps {
  /** 当前工具的 slug（用于排除） */
  currentSlug: string;
  /** 当前工具的类别 */
  category: ToolCategory;
  /** 最大显示数量，默认 6 */
  maxCount?: number;
  /** 自定义类名 */
  className?: string;
}

/**
 * 相关工具组件
 * 显示同类别的其他工具（排除当前工具）
 */
export default function RelatedTools({
  currentSlug,
  category,
  maxCount = 6,
  className = '',
}: RelatedToolsProps) {
  const t = useTranslations('tools');
  const tNav = useTranslations('nav');

  // 获取同类别的工具，排除当前工具
  const relatedTools = getToolsByCategory(category)
    .filter(tool => tool.slug !== currentSlug)
    .slice(0, maxCount);

  // 如果没有相关工具，不渲染
  if (relatedTools.length === 0) {
    return null;
  }

  return (
    <section className={`mt-12 ${className}`}>
      <h2 className="text-xl font-semibold mb-4 text-gray-200">
        {tNav('relatedTools')}
      </h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {relatedTools.map((tool) => (
          <Link
            key={tool.slug}
            href={`/tools/${tool.slug}`}
            className="flex flex-col items-center p-3 bg-gray-800/50 border border-gray-700/50 rounded-lg hover:border-blue-500/30 hover:bg-gray-800 transition-all group"
          >
            <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">
              {tool.icon}
            </span>
            <span className="text-sm text-gray-300 text-center line-clamp-2 group-hover:text-white transition-colors">
              {t(`${tool.slug}.name`)}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

/**
 * 获取相关工具列表（纯函数，用于测试）
 * @param currentSlug - 当前工具 slug
 * @param category - 工具类别
 * @param maxCount - 最大数量
 * @returns 相关工具数组
 */
export function getRelatedTools(
  currentSlug: string,
  category: ToolCategory,
  maxCount: number = 6
): Tool[] {
  return getToolsByCategory(category)
    .filter(tool => tool.slug !== currentSlug)
    .slice(0, maxCount);
}
