'use client';

/**
 * 预取管理器组件
 * 提供悬停预取和滚动预取功能
 * 优化页面导航性能
 * Requirements: 9.1, 9.4
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

// 预取配置
export const PREFETCH_CONFIG = {
  // 悬停延迟（毫秒）- 避免快速移动时的无效预取
  hoverDelay: 100,
  // 滚动预取的视口边距
  scrollMargin: '200px',
  // 最大并发预取数
  maxConcurrent: 3,
  // 预取队列大小
  queueSize: 10,
};

// 预取状态管理
const prefetchedUrls = new Set<string>();
const prefetchQueue: string[] = [];
let activePrefetches = 0;

/**
 * 检查 URL 是否已预取
 */
export function isPrefetched(url: string): boolean {
  return prefetchedUrls.has(url);
}

/**
 * 标记 URL 为已预取
 */
function markPrefetched(url: string): void {
  prefetchedUrls.add(url);
}

/**
 * 添加 URL 到预取队列
 * 使用队列管理避免同时发起过多请求
 */
export function addToPrefetchQueue(url: string): void {
  if (isPrefetched(url) || prefetchQueue.includes(url)) return;
  
  // 限制队列大小
  if (prefetchQueue.length >= PREFETCH_CONFIG.queueSize) {
    prefetchQueue.shift(); // 移除最旧的
  }
  
  prefetchQueue.push(url);
  processQueue();
}

/**
 * 处理预取队列
 */
function processQueue(): void {
  if (typeof window === 'undefined') return;
  
  while (activePrefetches < PREFETCH_CONFIG.maxConcurrent && prefetchQueue.length > 0) {
    const url = prefetchQueue.shift();
    if (url && !isPrefetched(url)) {
      activePrefetches++;
      
      // 使用 link prefetch
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url;
      link.onload = () => {
        markPrefetched(url);
        activePrefetches--;
        processQueue(); // 继续处理队列
      };
      link.onerror = () => {
        activePrefetches--;
        processQueue();
      };
      document.head.appendChild(link);
    }
  }
}

/**
 * 获取预取统计信息
 */
export function getPrefetchStats(): { prefetched: number; queued: number; active: number } {
  return {
    prefetched: prefetchedUrls.size,
    queued: prefetchQueue.length,
    active: activePrefetches,
  };
}

/**
 * 悬停预取 Hook
 * 当用户悬停在链接上时预取目标页面
 * 包含延迟机制避免快速移动时的无效预取
 * @param url - 要预取的 URL
 * @param delay - 悬停延迟（毫秒）
 * @returns 事件处理函数
 */
export function useHoverPrefetch(url: string, delay: number = PREFETCH_CONFIG.hoverDelay) {
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isPrefetchedState, setIsPrefetchedState] = useState(false);

  const handleMouseEnter = useCallback(() => {
    if (isPrefetched(url) || isPrefetchedState || !url) return;
    
    // 延迟预取，避免快速移动时的无效请求
    timeoutRef.current = setTimeout(() => {
      if (!isPrefetched(url)) {
        router.prefetch(url);
        markPrefetched(url);
        setIsPrefetchedState(true);
      }
    }, delay);
  }, [router, url, delay, isPrefetchedState]);

  const handleMouseLeave = useCallback(() => {
    // 取消未执行的预取
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // 清理
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { 
    onMouseEnter: handleMouseEnter, 
    onMouseLeave: handleMouseLeave,
    isPrefetched: isPrefetchedState,
  };
}

/**
 * 滚动预取 Hook
 * 使用 Intersection Observer 在元素进入视口时预取
 * @param url - 要预取的 URL
 * @param options - Intersection Observer 选项
 * @returns ref 和事件处理函数
 */
export function useScrollPrefetch(
  url: string,
  options: IntersectionObserverInit = { rootMargin: '200px' }
) {
  const router = useRouter();
  const ref = useRef<HTMLElement>(null);
  const prefetched = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || prefetched.current || !url) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !prefetched.current) {
            router.prefetch(url);
            prefetched.current = true;
            observer.disconnect();
          }
        });
      },
      options
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [router, url, options]);

  return { ref };
}

/**
 * 预取链接组件
 * 包装链接元素，添加悬停预取功能
 */
interface PrefetchLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  prefetchOnHover?: boolean;
  prefetchOnScroll?: boolean;
  title?: string;
}

export function PrefetchLink({
  href,
  children,
  className,
  prefetchOnHover = true,
  prefetchOnScroll = false,
  title,
}: PrefetchLinkProps) {
  const { onMouseEnter, onMouseLeave } = useHoverPrefetch(href);
  const { ref } = useScrollPrefetch(href);

  return (
    <a
      href={href}
      className={className}
      title={title}
      onMouseEnter={prefetchOnHover ? onMouseEnter : undefined}
      onMouseLeave={prefetchOnHover ? onMouseLeave : undefined}
      ref={prefetchOnScroll ? (ref as React.RefObject<HTMLAnchorElement>) : undefined}
    >
      {children}
    </a>
  );
}

/**
 * 批量预取工具
 * 预取多个 URL
 * @param urls - URL 数组
 */
export function prefetchUrls(urls: string[]): void {
  if (typeof window === 'undefined') return;

  // 使用 requestIdleCallback 在空闲时预取
  const prefetch = () => {
    urls.forEach((url) => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url;
      document.head.appendChild(link);
    });
  };

  if ('requestIdleCallback' in window) {
    // 使用类型断言处理 requestIdleCallback
    const win = window as Window & { requestIdleCallback: (cb: () => void) => number };
    win.requestIdleCallback(prefetch);
  } else {
    setTimeout(prefetch, 1);
  }
}

export default PrefetchLink;
