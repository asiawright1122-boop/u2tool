/**
 * 相关工具组件
 * 显示语义相关的工具，用于内部链接优化
 * 支持同分类和跨分类推荐
 */

'use client';

import { Link } from '@/i18n/routing';
import { Tool, getToolsByCategory, ToolCategory } from '@/config/tools';
import { useTranslations } from 'next-intl';
import { getSemanticRelatedTools, getMixedRecommendations } from '@/lib/internal-links';

interface RelatedToolsProps {
  /** 当前工具的 slug（用于排除） */
  currentSlug: string;
  /** 当前工具的类别 */
  category: ToolCategory;
  /** 最大显示数量，默认 6 */
  maxCount?: number;
  /** 自定义类名 */
  className?: string;
  /** 是否使用语义相关算法（默认 true） */
  useSemantic?: boolean;
}

// 最小相关工具数量（SEO 要求）
const MIN_RELATED_COUNT = 4;

/**
 * 相关工具组件
 * 显示语义相关的工具（优先同分类，补充跨分类）
 */
export default function RelatedTools({
  currentSlug,
  category,
  maxCount = 6,
  className = '',
  useSemantic = true,
}: RelatedToolsProps) {
  const t = useTranslations('tools');
  const tNav = useTranslations('nav');

  // 获取相关工具（使用语义算法或简单分类过滤）
  const relatedTools = useSemantic
    ? getSemanticRelatedTools(currentSlug, maxCount)
    : getToolsByCategory(category)
        .filter(tool => tool.slug !== currentSlug)
        .slice(0, maxCount);

  // 如果相关工具不足，使用混合推荐补充
  const finalTools = relatedTools.length >= MIN_RELATED_COUNT
    ? relatedTools
    : getMixedRecommendations(currentSlug, maxCount);

  // 如果没有相关工具，不渲染
  if (finalTools.length === 0) {
    return null;
  }

  return (
    <section className={`mt-12 ${className}`} aria-labelledby="related-tools-heading">
      <h2 id="related-tools-heading" className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
        {tNav('relatedTools')}
      </h2>
      
      <nav aria-label="Related tools">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {finalTools.map((tool) => {
            // 使用工具名称作为锚文本（SEO 最佳实践）
            const toolName = t(`${tool.slug}.name`);
            
            return (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="flex flex-col items-center p-3 bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-lg hover:border-blue-500/30 hover:bg-gray-200 dark:hover:bg-gray-800 transition-all group"
                title={toolName}
              >
                <span className="text-2xl mb-2 group-hover:scale-110 transition-transform" aria-hidden="true">
                  {tool.icon}
                </span>
                <span className="text-sm text-gray-700 dark:text-gray-300 text-center line-clamp-2 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                  {toolName}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
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
  // 优先使用语义相关算法
  const semanticTools = getSemanticRelatedTools(currentSlug, maxCount);
  
  if (semanticTools.length >= MIN_RELATED_COUNT) {
    return semanticTools;
  }
  
  // 回退到简单分类过滤
  return getToolsByCategory(category)
    .filter((tool: Tool) => tool.slug !== currentSlug)
    .slice(0, maxCount);
}
