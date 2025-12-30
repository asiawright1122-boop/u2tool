/**
 * 面包屑导航组件
 * 支持响应式 UI 和 JSON-LD BreadcrumbList 结构化数据
 */

'use client';

import { Link } from '@/i18n/routing';
import { generateBreadcrumbJsonLd, jsonLdToString } from '@/lib/seo';

export interface BreadcrumbItem {
  /** 显示名称 */
  name: string;
  /** 路径（不含 locale 前缀），最后一项可省略 */
  path?: string;
}

interface BreadcrumbProps {
  /** 面包屑项目数组 */
  items: BreadcrumbItem[];
  /** 当前语言 */
  locale: string;
  /** 自定义类名 */
  className?: string;
}

/**
 * 面包屑导航组件
 * 包含可视化导航和 JSON-LD 结构化数据
 */
export default function Breadcrumb({ items, locale, className = '' }: BreadcrumbProps) {
  // 生成 JSON-LD 结构化数据
  const jsonLd = generateBreadcrumbJsonLd(items, locale);

  return (
    <>
      {/* JSON-LD 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdToString(jsonLd) }}
      />
      
      {/* 可视化面包屑导航 */}
      <nav 
        aria-label="Breadcrumb" 
        className={`text-sm ${className}`}
      >
        <ol className="flex flex-wrap items-center gap-1 text-gray-500 dark:text-gray-400">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            
            return (
              <li key={index} className="flex items-center">
                {/* 分隔符（第一项之后显示） */}
                {index > 0 && (
                  <svg 
                    className="w-4 h-4 mx-1 text-gray-400 dark:text-gray-600" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9 5l7 7-7 7" 
                    />
                  </svg>
                )}
                
                {/* 面包屑项目 */}
                {isLast || !item.path ? (
                  // 最后一项或无路径：显示为文本
                  <span 
                    className="text-gray-700 dark:text-gray-300 font-medium truncate max-w-[200px] sm:max-w-none"
                    aria-current={isLast ? 'page' : undefined}
                  >
                    {item.name}
                  </span>
                ) : (
                  // 有路径：显示为链接
                  <Link 
                    href={item.path}
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate max-w-[150px] sm:max-w-none"
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}

// 重新导出 generateToolBreadcrumbs 从 seo.ts
export { generateToolBreadcrumbs } from '@/lib/seo';
