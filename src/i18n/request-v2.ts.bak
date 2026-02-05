/**
 * next-intl 请求配置 v2 - 使用拆分后的翻译文件
 * 
 * 此文件在服务端渲染时加载翻译，供 getTranslations() 使用。
 * 
 * v2 版本使用拆分后的翻译文件：
 * - core.json: 核心翻译（每个页面都需要）
 * - tools-index.json: 工具列表元数据
 * - tools/{slug}.json: 工具详细内容（按需加载）
 * 
 * 注意：翻译文件不会被打包到 Edge Function（middleware），
 * 因为 middleware.ts 不依赖此文件。
 */

import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';
import { headers } from 'next/headers';

// 是否使用 v2 拆分文件
const USE_V2 = process.env.NEXT_PUBLIC_USE_SPLIT_TRANSLATIONS === 'true';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as typeof routing.locales[number])) {
    locale = routing.defaultLocale;
  }

  try {
    if (USE_V2) {
      // v2: 加载拆分后的翻译文件
      return await loadSplitMessages(locale);
    } else {
      // v1: 加载完整的翻译文件
      return await loadFullMessages(locale);
    }
  } catch {
    // 回退到英文
    if (locale !== 'en') {
      try {
        if (USE_V2) {
          return await loadSplitMessages('en');
        } else {
          return await loadFullMessages('en');
        }
      } catch {
        return { locale, messages: {} };
      }
    }
    return { locale, messages: {} };
  }
});

/**
 * 加载完整的翻译文件（v1 方式）
 */
async function loadFullMessages(locale: string) {
  const messages = (await import(`@/messages/${locale}.json`)).default;
  return { locale, messages };
}

/**
 * 加载拆分后的翻译文件（v2 方式）
 * 
 * 根据当前请求的路径，智能加载所需的翻译：
 * - 首页: core.json
 * - 工具列表: core.json + tools-index.json
 * - 工具详情: core.json + tools-index.json + tools/{slug}.json
 * - 静态页面: core.json + static/{page}.json
 */
async function loadSplitMessages(locale: string) {
  // 获取当前请求路径
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || headersList.get('x-invoke-path') || '';
  
  // 加载核心翻译（每个页面都需要）
  const core = (await import(`@/messages/${locale}/v2/core.json`)).default;
  
  // 根据路径加载额外的翻译
  let messages = { ...core };
  
  // 工具页面
  if (pathname.includes('/tools/')) {
    // 加载工具索引
    const toolsIndex = (await import(`@/messages/${locale}/v2/tools-index.json`)).default;
    messages.tools = { ...(messages.tools || {}), ...toolsIndex };
    
    // 如果是工具详情页，加载工具详细翻译
    const toolMatch = pathname.match(/\/tools\/([^/]+)$/);
    if (toolMatch) {
      const slug = toolMatch[1];
      try {
        const toolDetail = (await import(`@/messages/${locale}/v2/tools/${slug}.json`)).default;
        // 合并工具详情到 tools.{slug}
        const toolMeta = toolsIndex[slug] || {};
        messages.tools[slug] = { ...toolMeta, ...toolDetail };
      } catch {
        // 工具详情文件不存在，忽略
      }
    }
  }
  
  // 静态页面
  const staticPages = ['privacy', 'terms', 'about', 'blog'];
  for (const page of staticPages) {
    if (pathname.includes(`/${page}`)) {
      try {
        const pageContent = (await import(`@/messages/${locale}/v2/static/${page}.json`)).default;
        messages[page] = pageContent;
      } catch {
        // 静态页面文件不存在，忽略
      }
      break;
    }
  }
  
  // 分类页面需要 SEO 数据
  if (pathname.includes('/category/')) {
    try {
      const seo = (await import(`@/messages/${locale}/v2/seo.json`)).default;
      messages = { ...messages, ...seo };
    } catch {
      // SEO 文件不存在，忽略
    }
  }
  
  return { locale, messages };
}
