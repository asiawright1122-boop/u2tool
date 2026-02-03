'use client';

/**
 * 第三方脚本优化加载组件
 * 
 * 功能：
 * 1. 延迟加载非关键第三方脚本
 * 2. 使用 requestIdleCallback 在浏览器空闲时加载
 * 3. 脚本加载失败不阻塞页面渲染
 * 4. 支持百度统计等中国市场分析工具
 * 
 * @see Requirements 2.2, 5.1, 5.2, 5.3, 5.5
 */

import { useEffect, useRef, useCallback } from 'react';

interface ThirdPartyScriptsProps {
  /** 百度统计 ID */
  baiduAnalyticsId?: string;
  /** 是否启用调试模式 */
  debug?: boolean;
}

/**
 * 安全地加载外部脚本
 * 使用 requestIdleCallback 延迟加载，避免阻塞主线程
 */
function loadScriptSafely(
  src: string,
  options: {
    id?: string;
    async?: boolean;
    defer?: boolean;
    onLoad?: () => void;
    onError?: (error: Error) => void;
  } = {}
): Promise<void> {
  return new Promise((resolve, reject) => {
    // 检查脚本是否已存在
    if (options.id && document.getElementById(options.id)) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = options.async ?? true;
    if (options.defer) script.defer = true;
    if (options.id) script.id = options.id;

    script.onload = () => {
      options.onLoad?.();
      resolve();
    };

    script.onerror = () => {
      const error = new Error(`Failed to load script: ${src}`);
      options.onError?.(error);
      // 不 reject，让页面继续运行
      resolve();
    };

    document.head.appendChild(script);
  });
}

/**
 * 使用 requestIdleCallback 延迟执行
 * 在浏览器空闲时执行，避免阻塞用户交互
 */
function scheduleIdleTask(callback: () => void, timeout = 2000): void {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(callback, { timeout });
  } else {
    // 降级方案：使用 setTimeout
    setTimeout(callback, 100);
  }
}

/**
 * 第三方脚本优化加载组件
 * 
 * 特点：
 * - 页面交互后才加载（afterInteractive）
 * - 使用 requestIdleCallback 避免阻塞主线程
 * - 脚本加载失败不影响页面功能
 * - 支持百度统计等中国市场工具
 */
export default function ThirdPartyScripts({
  baiduAnalyticsId,
  debug = false,
}: ThirdPartyScriptsProps) {
  const loadedRef = useRef(false);

  const log = useCallback((message: string, ...args: unknown[]) => {
    if (debug && typeof console !== 'undefined') {
      console.log(`[ThirdPartyScripts] ${message}`, ...args);
    }
  }, [debug]);

  useEffect(() => {
    // 防止重复加载
    if (loadedRef.current) return;
    loadedRef.current = true;

    // 等待页面完全加载后再加载第三方脚本
    const loadThirdPartyScripts = () => {
      // 使用 requestIdleCallback 延迟加载，避免阻塞主线程
      scheduleIdleTask(async () => {
        log('Starting to load third-party scripts...');

        // 加载百度统计（如果配置了）
        if (baiduAnalyticsId) {
          try {
            // 初始化百度统计全局变量
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (window as any)._hmt = (window as any)._hmt || [];
            
            await loadScriptSafely(
              `https://hm.baidu.com/hm.js?${baiduAnalyticsId}`,
              {
                id: 'baidu-analytics',
                async: true,
                onLoad: () => log('Baidu Analytics loaded successfully'),
                onError: (error) => log('Baidu Analytics failed to load:', error.message),
              }
            );
          } catch (error) {
            // 静默失败，不影响页面功能
            log('Baidu Analytics error:', error);
          }
        }

        log('Third-party scripts loading complete');
      }, 3000); // 3秒超时，确保在空闲时加载
    };

    // 检查页面是否已完全加载
    if (document.readyState === 'complete') {
      loadThirdPartyScripts();
    } else {
      window.addEventListener('load', loadThirdPartyScripts, { once: true });
    }

    // 清理函数
    return () => {
      window.removeEventListener('load', loadThirdPartyScripts);
    };
  }, [baiduAnalyticsId, log]);

  // 此组件不渲染任何 UI
  return null;
}

/**
 * 类型声明：百度统计全局变量
 */
declare global {
  interface Window {
    _hmt?: Array<[string, ...unknown[]]>;
  }
}
