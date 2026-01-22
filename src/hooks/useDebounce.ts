/**
 * 防抖 Hook
 * 
 * 用于延迟更新值，避免频繁触发重渲染
 * 特别适用于图表数据变化时的渲染优化
 * 
 * @param value - 需要防抖的值
 * @param delay - 延迟时间（毫秒）
 * @returns 防抖后的值
 */

import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number = 300): T {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        // 设置定时器
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // 清理函数：在值变化或组件卸载时清除定时器
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

/**
 * 防抖回调 Hook
 * 
 * 用于创建防抖的回调函数
 * 
 * @param callback - 需要防抖的回调函数
 * @param delay - 延迟时间（毫秒）
 * @returns 防抖后的回调函数
 */
export function useDebouncedCallback<T extends (...args: unknown[]) => unknown>(
    callback: T,
    delay: number = 300
): (...args: Parameters<T>) => void {
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // 组件卸载时清理定时器
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [timeoutId]);

    return (...args: Parameters<T>) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        const id = setTimeout(() => {
            callback(...args);
        }, delay);
        setTimeoutId(id);
    };
}
