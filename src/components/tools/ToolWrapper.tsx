'use client';

import { TOOL_COMPONENTS_MAP } from './ToolRegistry';
import ToolErrorBoundary from './ToolErrorBoundary';
import { useEffect, useState, useRef, useCallback, memo, startTransition } from 'react';
import { trackToolLoad } from '@/components/PerformanceMonitor';
import { getCachedComponent, cacheComponent } from '@/lib/component-cache';
import { cancelImport } from '@/lib/import-queue';
import type { ComponentType } from 'react';

// 加载状态
type LoadingState = 'idle' | 'loading' | 'loaded' | 'error' | 'timeout';

// 加载超时时间（毫秒）
const LOAD_TIMEOUT = 10000;

// 骨架屏组件
function ToolSkeleton() {
  return (
    <div className="animate-pulse space-y-4 p-4">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    </div>
  );
}

// 错误显示组件
function ToolError({ 
  slug, 
  error, 
  onRetry 
}: { 
  slug: string; 
  error: string; 
  onRetry: () => void;
}) {
  return (
    <div className="text-center p-8">
      <div className="text-red-500 dark:text-red-400 mb-4">
        <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p className="font-medium">{error}</p>
      </div>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        重试
      </button>
    </div>
  );
}

// 超时显示组件
function ToolTimeout({ slug, onRetry }: { slug: string; onRetry: () => void }) {
  return (
    <div className="text-center p-8">
      <div className="text-yellow-500 dark:text-yellow-400 mb-4">
        <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="font-medium">加载超时</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          工具 {slug} 加载时间过长
        </p>
      </div>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        重试
      </button>
    </div>
  );
}

// 主组件
function ToolWrapperInner({ slug }: { slug: string }) {
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [Component, setComponent] = useState<ComponentType | null>(null);
  const [error, setError] = useState<string>('');
  const startTimeRef = useRef<number>(Date.now());
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  // 加载组件
  const loadComponent = useCallback(async () => {
    startTimeRef.current = Date.now();
    setLoadingState('loading');
    setError('');

    // 清除之前的超时
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // 设置加载超时
    timeoutRef.current = setTimeout(() => {
      if (mountedRef.current && loadingState === 'loading') {
        setLoadingState('timeout');
        cancelImport(slug);
      }
    }, LOAD_TIMEOUT);

    try {
      // 1. 首先检查缓存
      const cached = getCachedComponent(slug);
      if (cached) {
        if (mountedRef.current) {
          startTransition(() => {
            setComponent(() => cached);
            setLoadingState('loaded');
          });
          
          const loadTime = Date.now() - startTimeRef.current;
          trackToolLoad(slug, loadTime);
        }
        return;
      }

      // 2. 检查是否有注册的组件
      const registeredComponent = TOOL_COMPONENTS_MAP[slug];
      if (!registeredComponent) {
        throw new Error(`Tool not found: ${slug}`);
      }

      // 3. 组件已经是动态导入的，直接使用
      // Next.js dynamic() 返回的组件会自动处理加载
      if (mountedRef.current) {
        startTransition(() => {
          setComponent(() => registeredComponent);
          setLoadingState('loaded');
        });

        // 缓存组件
        cacheComponent(slug, registeredComponent);

        const loadTime = Date.now() - startTimeRef.current;
        trackToolLoad(slug, loadTime);
      }
    } catch (err) {
      if (mountedRef.current) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        setLoadingState('error');
        console.error(`Failed to load tool ${slug}:`, err);
      }
    } finally {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }
  }, [slug]);

  // 重试加载
  const handleRetry = useCallback(() => {
    loadComponent();
  }, [loadComponent]);

  // 初始加载
  useEffect(() => {
    mountedRef.current = true;
    loadComponent();

    return () => {
      mountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      // 取消正在进行的导入
      cancelImport(slug);
    };
  }, [slug, loadComponent]);

  // 渲染
  if (loadingState === 'loading' || loadingState === 'idle') {
    return <ToolSkeleton />;
  }

  if (loadingState === 'timeout') {
    return <ToolTimeout slug={slug} onRetry={handleRetry} />;
  }

  if (loadingState === 'error') {
    return <ToolError slug={slug} error={error} onRetry={handleRetry} />;
  }

  if (!Component) {
    return <ToolError slug={slug} error="Component not found" onRetry={handleRetry} />;
  }

  return (
    <ToolErrorBoundary toolName={slug}>
      <Component />
    </ToolErrorBoundary>
  );
}

// 使用 memo 优化，避免不必要的重渲染
const ToolWrapper = memo(ToolWrapperInner, (prevProps, nextProps) => {
  return prevProps.slug === nextProps.slug;
});

ToolWrapper.displayName = 'ToolWrapper';

export default ToolWrapper;
