'use client';

/**
 * 骨架屏组件
 * 用于页面加载时显示占位内容，减少 CLS
 */

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export function Skeleton({
  className = '',
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse',
}: SkeletonProps) {
  const baseClasses = 'bg-gray-700';
  
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };
  
  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: '',
  };
  
  const style: React.CSSProperties = {
    width: width,
    height: height,
  };
  
  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}

/**
 * 工具卡片骨架屏
 */
export function ToolCardSkeleton() {
  return (
    <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg">
      <div className="flex items-center gap-3">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="flex-1">
          <Skeleton variant="text" height={20} className="mb-2 w-3/4" />
          <Skeleton variant="text" height={16} className="w-full" />
        </div>
      </div>
    </div>
  );
}

/**
 * 工具列表骨架屏
 */
export function ToolsListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ToolCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * 页面标题骨架屏
 */
export function PageTitleSkeleton() {
  return (
    <div className="text-center mb-8">
      <Skeleton variant="text" height={48} className="mx-auto w-64 mb-4" />
      <Skeleton variant="text" height={24} className="mx-auto w-96" />
    </div>
  );
}

export default Skeleton;
