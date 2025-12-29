import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const locales = ['en', 'zh', 'es', 'pt', 'ja', 'ru', 'fr', 'ar', 'de', 'ko'] as const;
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  en: 'English',
  zh: '中文',
  es: 'Español',
  pt: 'Português',
  ja: '日本語',
  ru: 'Русский',
  fr: 'Français',
  ar: 'العربية',
  de: 'Deutsch',
  ko: '한국어',
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

  // === 俄语地区 ===
  RU: 'ru', // 俄罗斯
  BY: 'ru', // 白俄罗斯
  KZ: 'ru', // 哈萨克斯坦
  KG: 'ru', // 吉尔吉斯斯坦
  TJ: 'ru', // 塔吉克斯坦
  UZ: 'ru', // 乌兹别克斯坦
  TM: 'ru', // 土库曼斯坦
  AM: 'ru', // 亚美尼亚
  AZ: 'ru', // 阿塞拜疆
  GE: 'ru', // 格鲁吉亚
  MD: 'ru', // 摩尔多瓦

  // === 法语地区 ===
  FR: 'fr', // 法国
  BE: 'fr', // 比利时
  LU: 'fr', // 卢森堡
  MC: 'fr', // 摩纳哥
  SN: 'fr', // 塞内加尔
  CI: 'fr', // 科特迪瓦
  ML: 'fr', // 马里
  BF: 'fr', // 布基纳法索
  NE: 'fr', // 尼日尔
  TD: 'fr', // 乍得
  GA: 'fr', // 加蓬
  CG: 'fr', // 刚果（布）
  CD: 'fr', // 刚果（金）
  CM: 'fr', // 喀麦隆
  BJ: 'fr', // 贝宁
  TG: 'fr', // 多哥
  RW: 'fr', // 卢旺达
  BI: 'fr', // 布隆迪
  DJ: 'fr', // 吉布提
  KM: 'fr', // 科摩罗
  MG: 'fr', // 马达加斯加
  SC: 'fr', // 塞舌尔
  MU: 'fr', // 毛里求斯
  VU: 'fr', // 瓦努阿图
  PF: 'fr', // 法属波利尼西亚
  NC: 'fr', // 新喀里多尼亚

  // === 阿拉伯语地区 ===
  SA: 'ar', // 沙特阿拉伯
  AE: 'ar', // 阿联酋
  EG: 'ar', // 埃及
  MA: 'ar', // 摩洛哥
  DZ: 'ar', // 阿尔及利亚
  IQ: 'ar', // 伊拉克
  SD: 'ar', // 苏丹
  SY: 'ar', // 叙利亚
  TN: 'ar', // 突尼斯
  JO: 'ar', // 约旦
  LY: 'ar', // 利比亚
  LB: 'ar', // 黎巴嫩
  PS: 'ar', // 巴勒斯坦
  OM: 'ar', // 阿曼
  KW: 'ar', // 科威特
  MR: 'ar', // 毛里塔尼亚
  QA: 'ar', // 卡塔尔
  BH: 'ar', // 巴林
  YE: 'ar', // 也门
  SO: 'ar', // 索马里

  // === 德语地区 ===
  DE: 'de', // 德国
  AT: 'de', // 奥地利
  CH: 'de', // 瑞士
  LI: 'de', // 列支敦士登

  // === 韩语地区 ===
  KR: 'ko', // 韩国
  KP: 'ko', // 朝鲜

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
