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

</script>

{#snippet DefaultSkeleton()}
  <div class="flex flex-col gap-6">
    <div class="h-10 w-48 tool-skeleton"></div>
    <div class="h-64 w-full tool-skeleton"></div>
    <div class="flex gap-4">
      <div class="h-12 w-32 tool-skeleton"></div>
      <div class="h-12 w-32 tool-skeleton"></div>
    </div>
  </div>
{/snippet}

{#snippet EditorSkeleton()}
  <div class="flex flex-col gap-6">
    <div class="h-8 w-32 tool-skeleton"></div>
    <div class="h-96 w-full tool-skeleton !rounded-3xl border border-slate-200 dark:border-white/5"></div>
    <div class="flex justify-between items-center">
      <div class="flex gap-2">
        <div class="h-10 w-24 tool-skeleton"></div>
        <div class="h-10 w-24 tool-skeleton"></div>
      </div>
      <div class="h-10 w-32 tool-skeleton"></div>
    </div>
  </div>
{/snippet}

{#snippet ConverterSkeleton()}
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 ring-1 ring-slate-200 dark:ring-white/5 p-6 rounded-3xl">
    <div class="flex flex-col gap-4">
      <div class="h-6 w-24 tool-skeleton"></div>
      <div class="h-64 w-full tool-skeleton"></div>
    </div>
    <div class="flex flex-col gap-4">
      <div class="h-6 w-24 tool-skeleton"></div>
      <div class="h-64 w-full tool-skeleton"></div>
    </div>
  </div>
{/snippet}

{#snippet GeneratorSkeleton()}
  <div class="flex flex-col gap-8">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="h-20 w-full tool-skeleton"></div>
      <div class="h-20 w-full tool-skeleton"></div>
      <div class="h-20 w-full tool-skeleton"></div>
    </div>
    <div class="h-14 w-full tool-skeleton !rounded-xl"></div>
    <div class="h-48 w-full tool-skeleton"></div>
  </div>
{/snippet}

{#snippet ChartSkeleton()}
  <div class="flex flex-col gap-6">
    <div class="h-10 w-1/3 tool-skeleton"></div>
    <div class="h-[400px] w-full tool-skeleton !rounded-3xl border border-amber-500/5 dark:border-amber-500/10"></div>
  </div>
{/snippet}

<div 
  class={`min-h-[300px] p-6 lg:p-8 ${className}`}
  role="status"
  aria-label="Loading tool..."
>
  {#if variant === 'editor'}
    {@render EditorSkeleton()}
  {:else if variant === 'converter'}
    {@render ConverterSkeleton()}
  {:else if variant === 'generator'}
    {@render GeneratorSkeleton()}
  {:else if variant === 'chart'}
    {@render ChartSkeleton()}
  {:else}
    {@render DefaultSkeleton()}
  {/if}
  <span class="sr-only">Loading...</span>
</div>
  
