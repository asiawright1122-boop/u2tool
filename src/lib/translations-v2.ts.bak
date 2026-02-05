/**
 * 翻译加载器 v2 - 使用拆分后的翻译文件
 * 
 * 文件结构：
 * - {locale}/v2/core.json: 核心翻译（每个页面都需要）
 * - {locale}/v2/tools-index.json: 工具列表元数据
 * - {locale}/v2/tools/{slug}.json: 工具详细内容
 * - {locale}/v2/static/{page}.json: 静态页面内容
 * - {locale}/v2/seo.json: SEO 元数据
 * 
 * 优势：
 * - 首页只加载 ~13KB（原来 1.5MB）
 * - 工具页面按需加载
 * - 支持 Cloudflare Workers 部署
 */

// 翻译对象类型
export type Messages = Record<string, unknown>;

// 支持的语言列表
export const supportedLocales = ['en', 'zh', 'es', 'pt', 'ja', 'ru', 'fr', 'ar', 'de', 'ko'] as const;
export type SupportedLocale = typeof supportedLocales[number];

// 是否使用 v2 拆分文件（可通过环境变量控制）
const USE_V2 = process.env.NEXT_PUBLIC_USE_SPLIT_TRANSLATIONS !== 'false';

// 翻译缓存
const cache = new Map<string, Messages>();

/**
 * 检查是否是有效的 locale
 */
export function isValidLocale(locale: string): locale is SupportedLocale {
  return supportedLocales.includes(locale as SupportedLocale);
}

/**
 * 加载核心翻译
 * 
 * 包含：site, nav, footer, theme, errors, common, home, categories
 * 每个页面都需要加载
 * 
 * @param locale - 语言代码
 * @returns 核心翻译对象
 */
export async function loadCoreMessages(locale: SupportedLocale): Promise<Messages> {
  const cacheKey = `v2-core-${locale}`;
  
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }
  
  try {
    if (USE_V2) {
      const messages = (await import(`@/messages/${locale}/v2/core.json`)).default;
      cache.set(cacheKey, messages);
      return messages;
    } else {
      // 回退到旧文件
      const messages = (await import(`@/messages/${locale}.json`)).default;
      cache.set(cacheKey, messages);
      return messages;
    }
  } catch {
    if (locale !== 'en') {
      console.warn(`Failed to load core messages for ${locale}, falling back to English`);
      return loadCoreMessages('en');
    }
    throw new Error(`Failed to load core messages for ${locale}`);
  }
}

/**
 * 加载工具索引
 * 
 * 包含所有工具的 name, description, seo_title, seo_description
 * 用于工具列表页、搜索等
 * 
 * @param locale - 语言代码
 * @returns 工具索引对象
 */
export async function loadToolsIndex(locale: SupportedLocale): Promise<Messages> {
  const cacheKey = `v2-tools-index-${locale}`;
  
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }
  
  try {
    if (USE_V2) {
      const messages = (await import(`@/messages/${locale}/v2/tools-index.json`)).default;
      cache.set(cacheKey, messages);
      return messages;
    } else {
      // 回退：从旧文件提取
      const full = (await import(`@/messages/${locale}.json`)).default;
      const toolsIndex: Messages = {};
      
      if (full.tools) {
        Object.entries(full.tools as Record<string, unknown>).forEach(([key, value]) => {
          if (typeof value === 'object' && value !== null) {
            const tool = value as Record<string, unknown>;
            toolsIndex[key] = {
              name: tool.name,
              description: tool.description,
              seo_title: tool.seo_title,
              seo_description: tool.seo_description,
            };
          }
        });
      }
      
      cache.set(cacheKey, toolsIndex);
      return toolsIndex;
    }
  } catch {
    if (locale !== 'en') {
      return loadToolsIndex('en');
    }
    return {};
  }
}

/**
 * 加载单个工具的详细翻译
 * 
 * 包含：detailed_description, usage_steps, usage_examples, 以及工具特定的 UI 文本
 * 
 * @param locale - 语言代码
 * @param slug - 工具 slug
 * @returns 工具详细翻译对象
 */
export async function loadToolDetail(locale: SupportedLocale, slug: string): Promise<Messages> {
  const cacheKey = `v2-tool-${locale}-${slug}`;
  
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }
  
  try {
    if (USE_V2) {
      const messages = (await import(`@/messages/${locale}/v2/tools/${slug}.json`)).default;
      cache.set(cacheKey, messages);
      return messages;
    } else {
      // 回退：从旧文件提取
      const full = (await import(`@/messages/${locale}.json`)).default;
      const tools = full.tools as Record<string, unknown> | undefined;
      
      if (tools && tools[slug] && typeof tools[slug] === 'object') {
        const tool = tools[slug] as Record<string, unknown>;
        const detail: Messages = {};
        
        Object.entries(tool).forEach(([k, v]) => {
          if (!['name', 'description', 'seo_title', 'seo_description'].includes(k)) {
            detail[k] = v;
          }
        });
        
        cache.set(cacheKey, detail);
        return detail;
      }
      
      return {};
    }
  } catch {
    if (locale !== 'en') {
      return loadToolDetail('en', slug);
    }
    return {};
  }
}

/**
 * 加载静态页面翻译
 * 
 * @param locale - 语言代码
 * @param page - 页面名称 (privacy, terms, about, blog)
 * @returns 页面翻译对象
 */
export async function loadStaticPage(locale: SupportedLocale, page: string): Promise<Messages> {
  const cacheKey = `v2-static-${locale}-${page}`;
  
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }
  
  try {
    if (USE_V2) {
      const messages = (await import(`@/messages/${locale}/v2/static/${page}.json`)).default;
      cache.set(cacheKey, messages);
      return messages;
    } else {
      const full = (await import(`@/messages/${locale}.json`)).default;
      const pageData = full[page] as Messages | undefined;
      cache.set(cacheKey, pageData || {});
      return pageData || {};
    }
  } catch {
    if (locale !== 'en') {
      return loadStaticPage('en', page);
    }
    return {};
  }
}

/**
 * 加载 SEO 元数据
 * 
 * @param locale - 语言代码
 * @returns SEO 翻译对象
 */
export async function loadSeoMessages(locale: SupportedLocale): Promise<Messages> {
  const cacheKey = `v2-seo-${locale}`;
  
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }
  
  try {
    if (USE_V2) {
      const messages = (await import(`@/messages/${locale}/v2/seo.json`)).default;
      cache.set(cacheKey, messages);
      return messages;
    } else {
      const full = (await import(`@/messages/${locale}.json`)).default;
      const seo: Messages = {
        categories_seo: full.categories_seo,
        ranking_seo: full.ranking_seo,
        pages: full.pages,
      };
      cache.set(cacheKey, seo);
      return seo;
    }
  } catch {
    if (locale !== 'en') {
      return loadSeoMessages('en');
    }
    return {};
  }
}

// ============================================
// 高级 API - 组合加载函数
// ============================================

/**
 * 加载首页所需的翻译
 * 
 * @param locale - 语言代码
 * @returns 首页翻译对象
 */
export async function loadMessagesForHome(locale: SupportedLocale): Promise<Messages> {
  const core = await loadCoreMessages(locale);
  return core;
}

/**
 * 加载工具列表页所需的翻译
 * 
 * @param locale - 语言代码
 * @returns 工具列表页翻译对象
 */
export async function loadMessagesForToolsList(locale: SupportedLocale): Promise<Messages> {
  const [core, toolsIndex, seo] = await Promise.all([
    loadCoreMessages(locale),
    loadToolsIndex(locale),
    loadSeoMessages(locale),
  ]);
  
  return {
    ...core,
    ...seo,
    tools: {
      ...(core.tools as Messages || {}),
      ...toolsIndex,
    },
  };
}

/**
 * 加载工具详情页所需的翻译
 * 
 * @param locale - 语言代码
 * @param slug - 工具 slug
 * @returns 工具详情页翻译对象
 */
export async function loadMessagesForToolPage(
  locale: SupportedLocale,
  slug: string
): Promise<Messages> {
  const [core, toolsIndex, toolDetail] = await Promise.all([
    loadCoreMessages(locale),
    loadToolsIndex(locale),
    loadToolDetail(locale, slug),
  ]);
  
  // 合并工具索引和详情
  const toolMeta = (toolsIndex as Record<string, unknown>)[slug] || {};
  const toolFull = {
    ...(typeof toolMeta === 'object' ? toolMeta : {}),
    ...toolDetail,
  };
  
  return {
    ...core,
    tools: {
      ...(core.tools as Messages || {}),
      [slug]: toolFull,
    },
  };
}

/**
 * 加载静态页面所需的翻译
 * 
 * @param locale - 语言代码
 * @param page - 页面名称
 * @returns 静态页面翻译对象
 */
export async function loadMessagesForStaticPage(
  locale: SupportedLocale,
  page: string
): Promise<Messages> {
  const [core, pageContent] = await Promise.all([
    loadCoreMessages(locale),
    loadStaticPage(locale, page),
  ]);
  
  return {
    ...core,
    [page]: pageContent,
  };
}

/**
 * 加载分类页面所需的翻译
 * 
 * @param locale - 语言代码
 * @returns 分类页面翻译对象
 */
export async function loadMessagesForCategoryPage(locale: SupportedLocale): Promise<Messages> {
  const [core, toolsIndex, seo] = await Promise.all([
    loadCoreMessages(locale),
    loadToolsIndex(locale),
    loadSeoMessages(locale),
  ]);
  
  return {
    ...core,
    ...seo,
    tools: {
      ...(core.tools as Messages || {}),
      ...toolsIndex,
    },
  };
}

// ============================================
// 工具函数
// ============================================

/**
 * 清除翻译缓存
 */
export function clearCache(): void {
  cache.clear();
}

/**
 * 获取缓存统计
 */
export function getCacheStats(): { size: number; keys: string[] } {
  return {
    size: cache.size,
    keys: Array.from(cache.keys()),
  };
}

/**
 * 预加载指定语言的核心翻译
 * 
 * @param locale - 语言代码
 */
export async function prefetchLocale(locale: SupportedLocale): Promise<void> {
  await loadCoreMessages(locale);
}
