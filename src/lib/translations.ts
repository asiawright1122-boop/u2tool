/**
 * 翻译加载器模块
 * 
 * 提供按需加载翻译的功能：
 * - loadBaseMessages: 加载基础翻译
 * - loadToolMessages: 加载工具特定翻译
 * - loadMessagesForTool: 合并基础和工具翻译
 * 
 * @see Requirements 1.2, 1.3, 3.2, 3.4
 */

// 翻译对象类型
export type Messages = Record<string, unknown>;

// 支持的语言列表（与 routing.ts 保持同步）
export const supportedLocales = ['en', 'zh', 'es', 'pt', 'ja', 'ru', 'fr', 'ar', 'de', 'ko'] as const;
export type SupportedLocale = typeof supportedLocales[number];

// 翻译缓存 - 避免重复加载
const translationCache = new Map<string, Messages>();

/**
 * 检查是否是有效的 locale
 */
function isValidLocale(locale: string): locale is SupportedLocale {
  return supportedLocales.includes(locale as SupportedLocale);
}

/**
 * 加载基础翻译
 * 
 * 基础翻译包含：site, categories, nav, home, common UI strings
 * 这些翻译在所有页面都需要
 * 
 * @param locale - 语言代码
 * @returns 基础翻译对象
 * @see Requirements 1.2, 3.1
 */
export async function loadBaseMessages(locale: SupportedLocale): Promise<Messages> {
  const cacheKey = `base-${locale}`;
  
  // 检查缓存
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }
  
  try {
    // 尝试加载新的拆分文件结构
    const messages = (await import(`@/messages/${locale}/base.json`)).default;
    translationCache.set(cacheKey, messages);
    return messages;
  } catch {
    // 如果新结构不存在，回退到旧的单一文件
    try {
      const messages = (await import(`@/messages/${locale}.json`)).default;
      translationCache.set(cacheKey, messages);
      return messages;
    } catch {
      // 如果当前语言失败，回退到英文
      if (locale !== 'en') {
        console.warn(`Failed to load base messages for ${locale}, falling back to English`);
        return loadBaseMessages('en');
      }
      throw new Error(`Failed to load base messages for ${locale}`);
    }
  }
}

/**
 * 加载工具特定翻译
 * 
 * 工具翻译包含：name, description, seo_title, seo_description, 
 * detailed_description, usage_steps, usage_examples
 * 
 * @param locale - 语言代码
 * @param toolSlug - 工具的 slug
 * @returns 工具翻译对象
 * @see Requirements 1.3, 2.4, 3.3
 */
export async function loadToolMessages(
  locale: SupportedLocale,
  toolSlug: string
): Promise<Messages> {
  const cacheKey = `tool-${locale}-${toolSlug}`;
  
  // 检查缓存
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }
  
  try {
    // 尝试加载工具特定翻译文件
    const messages = (await import(`@/messages/${locale}/tools/${toolSlug}.json`)).default;
    translationCache.set(cacheKey, messages);
    return messages;
  } catch {
    // 如果当前语言的工具翻译不存在，回退到英文
    if (locale !== 'en') {
      try {
        const messages = (await import(`@/messages/en/tools/${toolSlug}.json`)).default;
        translationCache.set(cacheKey, messages);
        return messages;
      } catch {
        // 英文也没有，返回空对象
        return {};
      }
    }
    // 英文也没有，返回空对象
    return {};
  }
}

/**
 * 加载工具页面所需的完整翻译
 * 
 * 合并基础翻译和工具特定翻译
 * 
 * @param locale - 语言代码
 * @param toolSlug - 工具的 slug
 * @returns 合并后的翻译对象
 * @see Requirements 3.2, 4.2
 */
export async function loadMessagesForTool(
  locale: SupportedLocale,
  toolSlug: string
): Promise<Messages> {
  // 并行加载基础翻译和工具翻译
  const [baseMessages, toolMessages] = await Promise.all([
    loadBaseMessages(locale),
    loadToolMessages(locale, toolSlug),
  ]);
  
  // 合并翻译，工具翻译放在 tools.{slug} 下
  const merged: Messages = {
    ...baseMessages,
    tools: {
      ...(baseMessages.tools as Messages || {}),
      [toolSlug]: toolMessages,
    },
  };
  
  return merged;
}

/**
 * 加载多个工具的翻译（用于分类页面、首页等）
 * 
 * @param locale - 语言代码
 * @param toolSlugs - 工具 slug 数组
 * @returns 合并后的翻译对象
 */
export async function loadMessagesForTools(
  locale: SupportedLocale,
  toolSlugs: string[]
): Promise<Messages> {
  // 加载基础翻译
  const baseMessages = await loadBaseMessages(locale);
  
  // 并行加载所有工具翻译
  const toolMessagesArray = await Promise.all(
    toolSlugs.map(slug => loadToolMessages(locale, slug))
  );
  
  // 合并所有工具翻译
  const toolsObj: Messages = { ...(baseMessages.tools as Messages || {}) };
  toolSlugs.forEach((slug, index) => {
    toolsObj[slug] = toolMessagesArray[index];
  });
  
  return {
    ...baseMessages,
    tools: toolsObj,
  };
}

/**
 * 清除翻译缓存（用于测试或热重载）
 */
export function clearTranslationCache(): void {
  translationCache.clear();
}

/**
 * 获取缓存统计信息（用于调试）
 */
export function getCacheStats(): { size: number; keys: string[] } {
  return {
    size: translationCache.size,
    keys: Array.from(translationCache.keys()),
  };
}

/**
 * 兼容性函数：加载完整翻译（旧结构）
 * 
 * 用于渐进式迁移，支持旧的单一文件结构
 * 
 * @param locale - 语言代码
 * @returns 完整翻译对象
 */
export async function loadLegacyMessages(locale: string): Promise<Messages> {
  if (!isValidLocale(locale)) {
    locale = 'en';
  }
  
  try {
    return (await import(`@/messages/${locale}.json`)).default;
  } catch {
    if (locale !== 'en') {
      return loadLegacyMessages('en');
    }
    throw new Error(`Failed to load messages for ${locale}`);
  }
}
