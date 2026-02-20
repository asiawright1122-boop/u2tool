<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Types
  export type SkeletonVariant = 'default' | 'editor' | 'converter' | 'generator' | 'chart';
  interface ToolSkeletonProps {
  /** 骨架屏变体类型 */
  variant?: SkeletonVariant;
  /** 自定义类名 */
  className?: string;
}

  // Functions
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
  function getSkeletonComponent(v: SkeletonVariant) { return v; }

</script>


    <div 
      class={`tool-skeleton min-h-[300px] ${className}`}
      role="status"
      aria-label="Loading tool..."
    >
      {#if variant === 'editor'}<EditorSkeleton />{:else if variant === 'converter'}<ConverterSkeleton />{:else if variant === 'generator'}<GeneratorSkeleton />{:else if variant === 'chart'}<ChartSkeleton />{:else}<DefaultSkeleton />{/if}
      <span class="sr-only">Loading...</span>
    </div>
  
