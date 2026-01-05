/**
 * next-intl 请求配置
 * 
 * 此文件返回空 messages，避免翻译文件被打包到 Edge Function。
 * 翻译在布局层 ([locale]/layout.tsx) 通过 loadBaseMessages() 加载。
 * 
 * @see .kiro/specs/middleware-size-optimization/design.md
 * @see Requirements 1.1, 1.2, 2.2
 */

import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as typeof routing.locales[number])) {
    locale = routing.defaultLocale;
  }

  // 不在这里加载翻译！
  // 翻译将在布局层按需加载，避免打包到 Edge Function
  return {
    locale,
    messages: {},
  };
});
