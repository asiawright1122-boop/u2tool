/**
 * next-intl 请求配置
 * 
 * 此文件在服务端渲染时加载翻译，供 getTranslations() 使用。
 * 
 * 注意：翻译文件不会被打包到 Edge Function（middleware），
 * 因为 middleware.ts 不依赖此文件。
 * 
 * @see .kiro/specs/middleware-size-optimization/design.md
 */

import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

// 支持的语言列表
const _supportedLocales = ['en', 'zh', 'es', 'pt', 'ja', 'ru', 'fr', 'ar', 'de', 'ko'] as const;
type _SupportedLocale = typeof _supportedLocales[number];

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as typeof routing.locales[number])) {
    locale = routing.defaultLocale;
  }

  // 在服务端渲染时加载翻译
  // 这不会影响 Edge Function 大小，因为 middleware.ts 不导入此文件
  try {
    // 优先加载拆分后的 base.json
    const messages = (await import(`@/messages/${locale}/base.json`)).default;
    return {
      locale,
      messages,
    };
  } catch {
    // 回退到完整的翻译文件
    try {
      const messages = (await import(`@/messages/${locale}.json`)).default;
      return {
        locale,
        messages,
      };
    } catch {
      // 最后回退到英文
      if (locale !== 'en') {
        const messages = (await import(`@/messages/en/base.json`)).default;
        return {
          locale,
          messages,
        };
      }
      // 如果英文也失败，返回空对象
      return {
        locale,
        messages: {},
      };
    }
  }
});
