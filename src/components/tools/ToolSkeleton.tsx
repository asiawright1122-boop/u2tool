'use client';

/**
 * ToolSkeleton - 工具加载骨架屏组件
 * 
 * 用于在工具组件加载时显示占位符，防止布局偏移 (CLS)
 * 支持多种变体以适应不同类型的工具
 * 
 * @see Requirements 1.1, 1.2
 */

export type SkeletonVariant = 'default' | 'editor' | 'converter' | 'generator' | 'chart';

interface ToolSkeletonProps {
  /** 骨架屏变体类型 */
  variant?: SkeletonVariant;
  /** 自定义类名 */
  className?: string;
}

/**
 * 骨架屏基础块组件
 */
function SkeletonBlock({ 
  className = '', 
  height = 'h-32' 
}: { 
  className?: string; 
  height?: string;
}) {
  return (
    <div 
      className={`bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse ${height} ${className}`}
      aria-hidden="true"
    />
  );
}

/**
 * 骨架屏按钮组件
 */
function SkeletonButton({ width = 'w-24' }: { width?: string }) {
  return (
    <div 
      className={`h-10 ${width} bg-gray-200 dark:bg-gray-700 rounded animate-pulse`}
      aria-hidden="true"
    />
  );
}

/**
 * 骨架屏文本行组件
 */
function SkeletonLine({ width = 'w-full' }: { width?: string }) {
  return (
    <div 
      className={`h-4 ${width} bg-gray-200 dark:bg-gray-700 rounded animate-pulse`}
      aria-hidden="true"
    />
  );
}

/**
 * 默认骨架屏 - 适用于大多数工具
 */
function DefaultSkeleton() {
  return (
    <div className="space-y-4">
      {/* 输入区域 */}
      <div>
        <SkeletonLine width="w-16" />
        <div className="mt-2">
          <SkeletonBlock height="h-32" />
        </div>
      </div>
      
      {/* 按钮区域 */}
      <div className="flex gap-2">
        <SkeletonButton width="w-24" />
        <SkeletonButton width="w-20" />
      </div>
      
      {/* 输出区域 */}
      <div>
        <SkeletonLine width="w-16" />
        <div className="mt-2">
          <SkeletonBlock height="h-32" />
        </div>
      </div>
    </div>
  );
}

/**
 * 编辑器骨架屏 - 适用于代码编辑器类工具
 */
function EditorSkeleton() {
  return (
    <div className="space-y-4">
      {/* 工具栏 */}
      <div className="flex gap-2 items-center">
        <SkeletonButton width="w-20" />
        <SkeletonButton width="w-20" />
        <SkeletonButton width="w-16" />
        <div className="flex-1" />
        <SkeletonButton width="w-24" />
      </div>
      
      {/* 编辑器区域 */}
      <SkeletonBlock height="h-64" />
      
      {/* 状态栏 */}
      <div className="flex justify-between">
        <SkeletonLine width="w-32" />
        <SkeletonLine width="w-24" />
      </div>
    </div>
  );
}

/**
 * 转换器骨架屏 - 适用于输入-输出转换类工具
 */
function ConverterSkeleton() {
  return (
    <div className="space-y-4">
      {/* 输入区域 */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <SkeletonLine width="w-16" />
          <SkeletonButton width="w-16" />
        </div>
        <SkeletonBlock height="h-40" />
      </div>
      
      {/* 转换按钮 */}
      <div className="flex justify-center">
        <SkeletonButton width="w-32" />
      </div>
      
      {/* 输出区域 */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <SkeletonLine width="w-16" />
          <SkeletonButton width="w-16" />
        </div>
        <SkeletonBlock height="h-40" />
      </div>
    </div>
  );
}

/**
 * 生成器骨架屏 - 适用于生成类工具
 */
function GeneratorSkeleton() {
  return (
    <div className="space-y-4">
      {/* 配置选项 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <SkeletonLine width="w-20" />
          <div className="mt-2">
            <SkeletonBlock height="h-10" />
          </div>
        </div>
        <div>
          <SkeletonLine width="w-24" />
          <div className="mt-2">
            <SkeletonBlock height="h-10" />
          </div>
        </div>
      </div>
      
      {/* 更多选项 */}
      <div className="grid grid-cols-3 gap-4">
        <SkeletonBlock height="h-10" />
        <SkeletonBlock height="h-10" />
        <SkeletonBlock height="h-10" />
      </div>
      
      {/* 生成按钮 */}
      <div className="flex justify-center">
        <SkeletonButton width="w-32" />
      </div>
      
      {/* 结果区域 */}
      <SkeletonBlock height="h-48" />
    </div>
  );
}

/**
 * 图表骨架屏 - 适用于图表生成类工具
 */
function ChartSkeleton() {
  return (
    <div className="space-y-4">
      {/* 数据输入区域 */}
      <div>
        <SkeletonLine width="w-24" />
        <div className="mt-2">
          <SkeletonBlock height="h-32" />
        </div>
      </div>
      
      {/* 图表配置 */}
      <div className="flex gap-4 flex-wrap">
        <SkeletonButton width="w-28" />
        <SkeletonButton width="w-28" />
        <SkeletonButton width="w-28" />
      </div>
      
      {/* 图表预览区域 */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <SkeletonBlock height="h-80" />
      </div>
      
      {/* 导出按钮 */}
      <div className="flex justify-end gap-2">
        <SkeletonButton width="w-24" />
        <SkeletonButton width="w-24" />
      </div>
    </div>
  );
}

/**
 * 工具骨架屏主组件
 */
export default function ToolSkeleton({ 
  variant = 'default',
  className = ''
}: ToolSkeletonProps) {
  const skeletonMap: Record<SkeletonVariant, React.ReactNode> = {
    default: <DefaultSkeleton />,
    editor: <EditorSkeleton />,
    converter: <ConverterSkeleton />,
    generator: <GeneratorSkeleton />,
    chart: <ChartSkeleton />,
  };

  return (
    <div 
      className={`tool-skeleton min-h-[300px] ${className}`}
      role="status"
      aria-label="Loading tool..."
    >
      {skeletonMap[variant]}
      <span className="sr-only">Loading...</span>
    </div>
  );
}

/**
 * 根据工具分类获取骨架屏变体
 */
export function getSkeletonVariant(category: string): SkeletonVariant {
  const categoryVariantMap: Record<string, SkeletonVariant> = {
    'charts': 'chart',
    'converters': 'converter',
    'encoders': 'converter',
    'formatters': 'editor',
    'generators': 'generator',
    'calculators': 'generator',
    'validators': 'default',
    'text': 'editor',
    'image': 'default',
    'security': 'converter',
    'network': 'default',
    'development': 'editor',
  };
  
  return categoryVariantMap[category] || 'default';
}
