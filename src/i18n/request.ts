/**
 * next-intl 请求配置
 * 
 * 加载翻译文件供 next-intl 使用
 */

import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as typeof routing.locales[number])) {
    locale = routing.defaultLocale;
  }

  // 加载完整翻译文件
  const messages = (await import(`@/messages/${locale}.json`)).default;
  
  return {
    locale,
    messages,
  };
});
