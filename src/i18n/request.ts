import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';
import { loadBaseMessages, type SupportedLocale } from '@/lib/translations';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as typeof routing.locales[number])) {
    locale = routing.defaultLocale;
  }

  // 使用新的按需加载器加载基础翻译
  // 工具特定翻译将在工具页面按需加载
  const messages = await loadBaseMessages(locale as SupportedLocale);

  return {
    locale,
    messages,
  };
});
