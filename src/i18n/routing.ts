import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const locales = ['en', 'zh', 'es', 'pt', 'ja'] as const;
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  en: 'English',
  zh: '中文',
  es: 'Español',
  pt: 'Português',
  ja: '日本語',
};

// IP地址到语言的映射（基于国家/地区）
export const countryToLocale: Record<string, Locale> = {
  // 中文地区
  CN: 'zh', // 中国
  TW: 'zh', // 台湾
  HK: 'zh', // 香港
  MO: 'zh', // 澳门
  SG: 'zh', // 新加坡（部分）
  // 西班牙语地区
  ES: 'es', // 西班牙
  MX: 'es', // 墨西哥
  AR: 'es', // 阿根廷
  CO: 'es', // 哥伦比亚
  CL: 'es', // 智利
  PE: 'es', // 秘鲁
  VE: 'es', // 委内瑞拉
  // 葡萄牙语地区
  BR: 'pt', // 巴西
  PT: 'pt', // 葡萄牙
  // 日语地区
  JP: 'ja', // 日本
  // 其他默认英语
};

export const routing = defineRouting({
  locales,
  defaultLocale: 'en',
  // 使用 'always' 确保URL始终包含语言前缀，避免混淆
  localePrefix: 'always',
  // 启用语言检测
  localeDetection: true,
});

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
