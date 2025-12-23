'use client';

import { Skeleton, ToolsListSkeleton, PageTitleSkeleton } from '@/components/ui/Skeleton';

/**
 * 工具列表页加载状态
 * 使用骨架屏减少 CLS，提升用户体验
 */
export default function ToolsPageLoading() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题骨架 */}
        <PageTitleSkeleton />

        {/* 搜索框骨架 */}
        <div className="max-w-xl mx-auto mb-8">
          <Skeleton height={48} className="rounded-lg" />
        </div>

        {/* 分类导航骨架 */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} width={100} height={36} className="rounded-full" />
          ))}
        </div>

        {/* 工具列表骨架 */}
        <ToolsListSkeleton count={12} />
      </div>
    </div>
  );
}
