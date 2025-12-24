'use client';

/**
 * 预取管理器组件
 * 提供悬停预取和滚动预取功能
 * 优化页面导航性能
 */

import { useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

/**
 * 悬停预取 Hook
 * 当用户悬停在链接上时预取目标页面
 * @param url - 要预取的 URL
 * @returns 事件处理函数
 */
export function useHoverPrefetch(url: string) {
  const router = useRouter();
  const prefetched = useRef(false);

  const handleMouseEnter = useCallback(() => {
    if (!prefetched.current && url) {
      router.prefetch(url);
      prefetched.current = true;
    }
  }, [router, url]);

  return { onMouseEnter: handleMouseEnter };
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
}

export function PrefetchLink({
  href,
  children,
  className,
  prefetchOnHover = true,
  prefetchOnScroll = false,
}: PrefetchLinkProps) {
  const { onMouseEnter } = useHoverPrefetch(href);
  const { ref } = useScrollPrefetch(href);

  return (
    <a
      href={href}
      className={className}
      onMouseEnter={prefetchOnHover ? onMouseEnter : undefined}
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
