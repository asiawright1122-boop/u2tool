'use client';

import { Skeleton } from '@/components/ui/Skeleton';

/**
 * 工具详情页加载状态
 * 使用骨架屏减少 CLS，提升用户体验
 */
export default function ToolPageLoading() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 面包屑骨架 */}
        <div className="flex items-center gap-2 mb-6">
          <Skeleton width={60} height={20} />
          <span className="text-gray-500">/</span>
          <Skeleton width={80} height={20} />
          <span className="text-gray-500">/</span>
          <Skeleton width={120} height={20} />
        </div>

        {/* 工具标题骨架 */}
        <div className="text-center mb-8">
          <Skeleton 
            variant="circular" 
            width={80} 
            height={80} 
            className="mx-auto mb-4" 
          />
          <Skeleton 
            width={200} 
            height={36} 
            className="mx-auto mb-2" 
          />
          <Skeleton 
            width={300} 
            height={20} 
            className="mx-auto" 
          />
        </div>

        {/* 工具内容骨架 */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <Skeleton height={300} className="mb-4" />
          <div className="flex gap-4">
            <Skeleton width={100} height={40} />
            <Skeleton width={100} height={40} />
          </div>
        </div>

        {/* 相关工具骨架 */}
        <div className="mt-8">
          <Skeleton width={150} height={28} className="mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} height={80} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
