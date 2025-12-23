'use client';

import { Skeleton, ToolsListSkeleton } from '@/components/ui/Skeleton';

/**
 * 首页加载状态
 * 使用骨架屏减少 CLS，提升用户体验
 */
export default function HomePageLoading() {
  return (
    <div className="min-h-screen">
      {/* Hero 区域骨架 */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Skeleton 
            width={300} 
            height={48} 
            className="mx-auto mb-4" 
          />
          <Skeleton 
            width={500} 
            height={24} 
            className="mx-auto mb-8" 
          />
          <Skeleton 
            width={200} 
            height={48} 
            className="mx-auto rounded-lg" 
          />
        </div>
      </section>

      {/* 分类区域骨架 */}
      <section className="py-12 px-4 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <Skeleton 
            width={200} 
            height={32} 
            className="mx-auto mb-8" 
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} height={100} className="rounded-lg" />
            ))}
          </div>
        </div>
      </section>

      {/* 热门工具骨架 */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <Skeleton 
            width={200} 
            height={32} 
            className="mx-auto mb-8" 
          />
          <ToolsListSkeleton count={6} />
        </div>
      </section>
    </div>
  );
}
