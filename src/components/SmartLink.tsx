'use client';

/**
 * SmartLink 组件 - 智能预取链接
 * 
 * 功能：
 * - 悬停预取：鼠标悬停 100ms 后预取目标页面
 * - 网络感知：在慢速网络（2G）或省流量模式下跳过预取
 * - 避免重复预取：已预取的链接不会再次预取
 * 
 * @see Requirements 7.1, 7.4, 7.5, 7.6
 */

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useRef, useState, type ReactNode, type MouseEvent } from 'react';

interface SmartLinkProps {
  href: string;
  children: ReactNode;
  prefetch?: boolean;
  className?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
  'aria-label'?: string;
  title?: string;
}

// 网络连接信息类型
interface NetworkInformation {
  effectiveType?: '2g' | '3g' | '4g' | 'slow-2g';
  saveData?: boolean;
  downlink?: number;
}

// 扩展 Navigator 类型
interface NavigatorWithConnection extends Navigator {
  connection?: NetworkInformation;
  mozConnection?: NetworkInformation;
  webkitConnection?: NetworkInformation;
}

/**
 * 检查是否应该预取
 * 在以下情况下跳过预取：
 * - 省流量模式开启
 * - 网络类型为 2G 或 slow-2g
 * - 下行带宽低于 0.5 Mbps
 */
function shouldPrefetch(): boolean {
  if (typeof navigator === 'undefined') {
    return true; // SSR 环境默认允许
  }
  
  const nav = navigator as NavigatorWithConnection;
  const connection = nav.connection || nav.mozConnection || nav.webkitConnection;
  
  if (!connection) {
    return true; // 无法获取网络信息，默认允许
  }
  
  // 省流量模式
  if (connection.saveData) {
    return false;
  }
  
  // 慢速网络
  if (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g') {
    return false;
  }
  
  // 低带宽（小于 0.5 Mbps）
  if (connection.downlink !== undefined && connection.downlink < 0.5) {
    return false;
  }
  
  return true;
}

// 全局预取缓存，避免重复预取
const prefetchedUrls = new Set<string>();

export function SmartLink({
  href,
  children,
  prefetch = false,
  className,
  onClick,
  'aria-label': ariaLabel,
  title,
}: SmartLinkProps) {
  const router = useRouter();
  const [isPrefetched, setIsPrefetched] = useState(() => prefetchedUrls.has(href));
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // 悬停预取处理
  const handleMouseEnter = useCallback(() => {
    // 已预取或不应该预取
    if (isPrefetched || prefetchedUrls.has(href) || !shouldPrefetch()) {
      return;
    }
    
    // 延迟 100ms 后预取，避免快速划过时触发
    hoverTimeoutRef.current = setTimeout(() => {
      router.prefetch(href);
      prefetchedUrls.add(href);
      setIsPrefetched(true);
    }, 100);
  }, [href, isPrefetched, router]);
  
  // 鼠标离开时取消预取
  const handleMouseLeave = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  }, []);
  
  // 触摸开始时预取（移动端）
  const handleTouchStart = useCallback(() => {
    if (isPrefetched || prefetchedUrls.has(href) || !shouldPrefetch()) {
      return;
    }
    
    router.prefetch(href);
    prefetchedUrls.add(href);
    setIsPrefetched(true);
  }, [href, isPrefetched, router]);
  
  return (
    <Link
      href={href}
      prefetch={prefetch}
      className={className}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      aria-label={ariaLabel}
      title={title}
    >
      {children}
    </Link>
  );
}

/**
 * 清除预取缓存（用于测试或特殊场景）
 */
export function clearPrefetchCache(): void {
  prefetchedUrls.clear();
}

/**
 * 检查 URL 是否已预取
 */
export function isPrefetched(url: string): boolean {
  return prefetchedUrls.has(url);
}

/**
 * 获取网络状态（用于调试）
 */
export function getNetworkStatus(): {
  shouldPrefetch: boolean;
  effectiveType?: string;
  saveData?: boolean;
  downlink?: number;
} {
  if (typeof navigator === 'undefined') {
    return { shouldPrefetch: true };
  }
  
  const nav = navigator as NavigatorWithConnection;
  const connection = nav.connection || nav.mozConnection || nav.webkitConnection;
  
  return {
    shouldPrefetch: shouldPrefetch(),
    effectiveType: connection?.effectiveType,
    saveData: connection?.saveData,
    downlink: connection?.downlink,
  };
}

export default SmartLink;
