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
// 覆盖全球主要国家和地区，未列出的国家默认使用英语
export const countryToLocale: Record<string, Locale> = {
  // === 中文地区 ===
  CN: 'zh', // 中国大陆
  TW: 'zh', // 台湾
  HK: 'zh', // 香港
  MO: 'zh', // 澳门
  // 注意：新加坡是多语言国家，英语是官方语言之一，默认使用英语更合适
  
  // === 西班牙语地区（拉丁美洲 + 西班牙）===
  ES: 'es', // 西班牙
  MX: 'es', // 墨西哥
  AR: 'es', // 阿根廷
  CO: 'es', // 哥伦比亚
  CL: 'es', // 智利
  PE: 'es', // 秘鲁
  VE: 'es', // 委内瑞拉
  EC: 'es', // 厄瓜多尔
  GT: 'es', // 危地马拉
  CU: 'es', // 古巴
  BO: 'es', // 玻利维亚
  DO: 'es', // 多米尼加共和国
  HN: 'es', // 洪都拉斯
  PY: 'es', // 巴拉圭
  SV: 'es', // 萨尔瓦多
  NI: 'es', // 尼加拉瓜
  CR: 'es', // 哥斯达黎加
  PA: 'es', // 巴拿马
  UY: 'es', // 乌拉圭
  PR: 'es', // 波多黎各
  GQ: 'es', // 赤道几内亚
  
  // === 葡萄牙语地区 ===
  BR: 'pt', // 巴西
  PT: 'pt', // 葡萄牙
  AO: 'pt', // 安哥拉
  MZ: 'pt', // 莫桑比克
  CV: 'pt', // 佛得角
  GW: 'pt', // 几内亚比绍
  ST: 'pt', // 圣多美和普林西比
  TL: 'pt', // 东帝汶
  
  // === 日语地区 ===
  JP: 'ja', // 日本
  
  // === 英语地区（显式列出主要国家，其他默认英语）===
  // US, GB, AU, CA, NZ, IE, SG 等默认使用英语
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
