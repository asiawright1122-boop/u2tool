/**
 * next-intl 请求配置
 * 
 * 注意：此文件不再加载翻译！
 * 翻译加载已移到布局层的 Server Component 中，
 * 以避免翻译文件被打包到 Edge Function 中。
 * 
 * @see Requirements 2.2
 */

import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as typeof routing.locales[number])) {
    locale = routing.defaultLocale;
  }

  // 不在这里加载翻译！
  // 翻译将在布局层的 Server Component 中按需加载
  // 这样可以避免翻译文件被打包到 Edge Function 中
  return {
    locale,
    messages: {}, // 空对象，翻译在布局层加载
  };
});
