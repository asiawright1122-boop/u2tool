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
 * 
 * 通用布局，适用于各种类型的工具：
 * - 输入区域
 * - 操作按钮
 * - 输出区域
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
      <div className="flex flex-wrap gap-2">
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
 * 
 * 布局匹配实际编辑器工具（如 JSON Formatter, SQL Formatter 等）：
 * - 输入区域（textarea）
 * - 操作按钮组
 * - 错误提示区域（可选）
 * - 输出区域（textarea）
 */
function EditorSkeleton() {
  return (
    <div className="space-y-4">
      {/* 输入区域 */}
      <div>
        <SkeletonLine width="w-16" />
        <div className="mt-2">
          <SkeletonBlock height="h-32" className="tool-textarea-skeleton" />
        </div>
      </div>
      
      {/* 操作按钮组 */}
      <div className="flex flex-wrap gap-2">
        <SkeletonButton width="w-32" />
        <SkeletonButton width="w-24" />
        <SkeletonButton width="w-20" />
      </div>
      
      {/* 输出区域 */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <SkeletonLine width="w-16" />
          <SkeletonButton width="w-16" />
        </div>
        <SkeletonBlock height="h-32" className="tool-textarea-skeleton" />
      </div>
    </div>
  );
}

/**
 * 转换器骨架屏 - 适用于输入-输出转换类工具
 * 
 * 布局匹配实际转换工具（如 Base64, URL Encoder 等）：
 * - 输入区域（textarea）
 * - 操作按钮组
 * - 输出区域（textarea）
 */
function ConverterSkeleton() {
  return (
    <div className="space-y-4">
      {/* 输入区域 */}
      <div>
        <SkeletonLine width="w-16" />
        <div className="mt-2">
          <SkeletonBlock height="h-32" className="tool-textarea-skeleton" />
        </div>
      </div>
      
      {/* 操作按钮组 */}
      <div className="flex flex-wrap gap-2">
        <SkeletonButton width="w-28" />
        <SkeletonButton width="w-28" />
        <SkeletonButton width="w-20" />
      </div>
      
      {/* 输出区域 */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <SkeletonLine width="w-16" />
          <SkeletonButton width="w-16" />
        </div>
        <SkeletonBlock height="h-32" className="tool-textarea-skeleton" />
      </div>
    </div>
  );
}

/**
 * 生成器骨架屏 - 适用于生成类工具
 * 
 * 布局匹配实际生成器工具（如 Password Generator, UUID Generator 等）：
 * - 结果显示区域
 * - 配置选项（滑块、复选框等）
 * - 生成按钮
 */
function GeneratorSkeleton() {
  return (
    <div className="space-y-6">
      {/* 结果显示区域 */}
      <div className="p-4 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div className="flex items-center justify-between">
          <SkeletonBlock height="h-8" className="flex-1 mr-4" />
          <SkeletonButton width="w-20" />
        </div>
      </div>
      
      {/* 配置选项 - 滑块 */}
      <div>
        <SkeletonLine width="w-24" />
        <div className="mt-2">
          <SkeletonBlock height="h-2" className="rounded-full" />
        </div>
      </div>
      
      {/* 配置选项 - 复选框组 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <SkeletonLine width="w-24" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <SkeletonLine width="w-24" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <SkeletonLine width="w-20" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <SkeletonLine width="w-20" />
        </div>
      </div>
      
      {/* 生成按钮 */}
      <SkeletonButton width="w-full" />
    </div>
  );
}

/**
 * 图表骨架屏 - 适用于图表生成类工具
 * 
 * 布局匹配实际图表工具：
 * - 工具栏（按钮组）
 * - 左侧：数据编辑器 + 图表设置
 * - 右侧：图表预览区域（400px 高度）
 */
function ChartSkeleton() {
  return (
    <div className="space-y-4">
      {/* 工具栏 */}
      <div className="flex flex-wrap gap-2">
        <SkeletonButton width="w-24" />
        <SkeletonButton width="w-24" />
        <SkeletonButton width="w-24" />
        <SkeletonButton width="w-24" />
        <SkeletonButton width="w-20" />
      </div>
      
      {/* 主内容区域 - 两栏布局 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左侧：数据编辑器 */}
        <div className="space-y-4">
          {/* 图表设置 */}
          <div>
            <SkeletonLine width="w-24" />
            <div className="mt-2 p-4 bg-gray-100 dark:bg-gray-900 rounded-lg space-y-3">
              <SkeletonBlock height="h-10" />
              <SkeletonBlock height="h-10" />
              <div className="flex gap-4">
                <SkeletonLine width="w-20" />
                <SkeletonLine width="w-20" />
                <SkeletonLine width="w-20" />
              </div>
            </div>
          </div>
          
          {/* 数据表格 */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <SkeletonLine width="w-24" />
              <SkeletonButton width="w-20" />
            </div>
            <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-3">
              <SkeletonBlock height="h-32" />
            </div>
          </div>
        </div>
        
        {/* 右侧：图表预览区域 - 匹配实际 400px 高度 */}
        <div>
          <SkeletonLine width="w-24" />
          <div className="mt-2 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <SkeletonBlock height="h-[400px]" className="rounded-none" />
          </div>
        </div>
      </div>
      
      {/* 提示区域 */}
      <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
        <SkeletonLine width="w-32" />
        <div className="mt-2 space-y-1">
          <SkeletonLine width="w-full" />
          <SkeletonLine width="w-5/6" />
          <SkeletonLine width="w-4/6" />
        </div>
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
 * 
 * 映射所有 14 种工具分类到 5 种骨架屏变体：
 * - chart: 图表工具
 * - converter: 转换类工具（输入-输出模式）
 * - editor: 编辑器类工具（代码、文本编辑）
 * - generator: 生成器类工具（配置选项 + 生成结果）
 * - default: 通用工具
 */
export function getSkeletonVariant(category: string): SkeletonVariant {
  const categoryVariantMap: Record<string, SkeletonVariant> = {
    // 图表类
    'charts': 'chart',
    
    // 转换类（输入-输出模式）
    'converters': 'converter',
    'encoders': 'converter',
    'encoding': 'converter',
    'security': 'converter',
    
    // 编辑器类（代码、文本编辑）
    'formatters': 'editor',
    'text': 'editor',
    'development': 'editor',
    
    // 生成器类（配置选项 + 生成结果）
    'generators': 'generator',
    'calculators': 'generator',
    'math': 'generator',
    'finance': 'generator',
    
    // 通用类
    'validators': 'default',
    'image': 'default',
    'network': 'default',
    'office': 'default',
    'lifestyle': 'default',
    'fun': 'default',
  };
  
  return categoryVariantMap[category] || 'default';
}
