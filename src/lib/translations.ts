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
 * 基础翻译包含：site, categories, nav, home, common UI strings, launches 等
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
    // 加载完整的翻译文件（包含所有命名空间如 launches）
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

/**
 * 加载工具特定翻译
 * 
 * 工具翻译合并多个来源：
 * 1. base.json 中的 tool.{slug} 对象（包含本地化的 name, description, seo_title, seo_description）
 * 2. base.json 中的 tools.{slug} 对象（备用来源）
 * 3. tools/{slug}.json 文件（包含 detailed_description, usage_steps, usage_examples）
 * 
 * 优先级：tool.{slug} > tools.{slug} > tools/{slug}.json
 * 
 * @param locale - 语言代码
 * @param toolSlug - 工具的 slug
 * @returns 合并后的工具翻译对象
 * @see Requirements 1.3, 2.4, 3.3
 * @see fix-seo-duplicate-titles spec
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
  
  // 1. 从 base.json 加载工具基础信息
  let baseToolData: Messages = {};
  try {
    const baseMessages = await loadBaseMessages(locale);
    
    // 优先从 tool.{slug} 加载（包含本地化的 SEO 翻译）
    const toolObj = baseMessages.tool as Record<string, Messages> | undefined;
    if (toolObj && toolObj[toolSlug]) {
      baseToolData = { ...toolObj[toolSlug] };
    }
    
    // 如果 tool.{slug} 没有数据，尝试从 tools.{slug} 加载
    const toolsObj = baseMessages.tools as Record<string, Messages> | undefined;
    if (toolsObj && toolsObj[toolSlug]) {
      // 合并，但 tool.{slug} 的数据优先
      baseToolData = { ...toolsObj[toolSlug], ...baseToolData };
    }
  } catch {
    // 如果加载失败，baseToolData 保持为空对象
  }
  
  // 2. 加载工具详细翻译（detailed_description, usage_steps, usage_examples）
  let detailedMessages: Messages = {};
  try {
    detailedMessages = (await import(`@/messages/${locale}/tools/${toolSlug}.json`)).default;
  } catch {
    // 如果当前语言的详细翻译不存在，尝试回退到英文
    if (locale !== 'en') {
      try {
        detailedMessages = (await import(`@/messages/en/tools/${toolSlug}.json`)).default;
      } catch {
        // 英文也没有，detailedMessages 保持为空对象
      }
    }
  }
  
  // 3. 合并所有来源，baseToolData 优先（包含本地化的 SEO 翻译）
  const mergedMessages: Messages = {
    ...detailedMessages,
    ...baseToolData,
  };
  
  // 缓存合并后的结果
  translationCache.set(cacheKey, mergedMessages);
  return mergedMessages;
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
