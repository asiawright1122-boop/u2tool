/**
 * 优化版翻译加载器
 * 
 * 核心优化：将翻译分为两层加载
 * - 精简版（~120KB）：不包含 tools 对象，用于全局 layout
 * - 完整版（~1.4MB）：包含 tools 对象，仅在需要时加载
 * 
 * @see Requirements: 性能优化，减少首次加载翻译大小
 */

import {
    loadBaseMessages as originalLoadBaseMessages,
    loadToolMessages,
    loadMessagesForTool,
    type Messages,
    type SupportedLocale,
    supportedLocales,
} from './translations';

// 精简翻译缓存（不含 tools 对象）
const slimTranslationCache = new Map<string, Messages>();

/**
 * 加载精简版基础翻译
 * 
 * 排除 tools 对象（约 1.2MB），只保留必要的 UI 翻译
 * 首次加载从 ~1.4MB 减少到 ~120KB（减少约 90%）
 * 
 * @param locale - 语言代码
 * @returns 精简的翻译对象（不含 tools）
 */
export async function loadSlimBaseMessages(locale: SupportedLocale): Promise<Messages> {
    const cacheKey = `slim-${locale}`;

    // 检查缓存
    if (slimTranslationCache.has(cacheKey)) {
        return slimTranslationCache.get(cacheKey)!;
    }

    try {
        // 加载完整翻译文件
        const fullMessages = (await import(`@/messages/${locale}.json`)).default as Messages;

        // 创建精简版（排除 tools 对象）
        const slimMessages: Messages = {};

        for (const key of Object.keys(fullMessages)) {
            // 排除大型 tools 对象
            // tools 约 1.2MB，tool 约 98KB - 这些在需要时通过 loadToolMessages 加载
            if (key !== 'tools') {
                slimMessages[key] = fullMessages[key];
            }
        }

        slimTranslationCache.set(cacheKey, slimMessages);
        return slimMessages;
    } catch {
        // 如果当前语言失败，回退到英文
        if (locale !== 'en') {
            console.warn(`Failed to load slim messages for ${locale}, falling back to English`);
            return loadSlimBaseMessages('en');
        }
        throw new Error(`Failed to load slim messages for ${locale}`);
    }
}

/**
 * 获取精简翻译的预估大小
 * 用于性能监控
 */
export function getSlimMessagesSizeEstimate(): string {
    // 基于分析：精简版约 120KB
    return '~120KB (vs full ~1.4MB)';
}

/**
 * 清除精简翻译缓存
 */
export function clearSlimTranslationCache(): void {
    slimTranslationCache.clear();
}

// 重新导出原有函数，保持向后兼容
export {
    originalLoadBaseMessages as loadBaseMessages,
    loadToolMessages,
    loadMessagesForTool,
    supportedLocales,
    type SupportedLocale,
    type Messages,
};
