/**
 * E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) 模块
 * 管理专家信息、作者信息、信任信号
 * 用于增强网站在搜索引擎中的可信度
 */

import { SEO_CONFIG, getCanonicalUrl } from './seo';

/**
 * 专家/作者信息接口
 */
export interface ExpertInfo {
  /** 专家姓名 */
  name: string;
  /** 职位/角色 */
  role: string;
  /** 资质证书列表 */
  credentials: string[];
  /** 头像 URL */
  avatar?: string;
  /** 社交媒体链接 */
  socialProfiles?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
  /** 专业领域 */
  expertise?: string[];
  /** 工作经验年限 */
  yearsOfExperience?: number;
}

/**
 * 组织信息接口
 */
export interface OrganizationInfo {
  /** 组织名称 */
  name: string;
  /** 组织描述 */
  description: string;
  /** 成立年份 */
  foundedYear: number;
  /** Logo URL */
  logo: string;
  /** 联系邮箱 */
  contactEmail: string;
  /** 社交媒体链接 */
  socialProfiles: Record<string, string>;
  /** 联系电话 */
  contactPhone?: string;
  /** 地址 */
  address?: {
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry?: string;
  };
}

/**
 * 默认组织信息
 */
export const DEFAULT_ORGANIZATION: OrganizationInfo = {
  name: 'U2Tool',
  description: 'Free online developer tools and utilities. 200+ tools for encoding, formatting, generating, and converting data.',
  foundedYear: 2024,
  logo: `${SEO_CONFIG.siteUrl}/icons/u2tool-logo-light.svg`,
  contactEmail: 'support@u2tool.com',
  socialProfiles: {
    // 可以添加实际的社交媒体链接
    // twitter: 'https://twitter.com/u2tool',
    // github: 'https://github.com/u2tool',
  },
};

/**
 * 默认专家信息（用于工具页面）
 */
export const DEFAULT_EXPERT: ExpertInfo = {
  name: 'U2Tool Team',
  role: 'Development Team',
  credentials: [
    'Software Development',
    'Web Technologies',
    'Developer Tools',
  ],
  expertise: [
    'Web Development',
    'Data Processing',
    'Security Tools',
    'Code Formatting',
  ],
};


/**
 * Person JSON-LD 接口
 */
export interface PersonJsonLd {
  '@context': 'https://schema.org';
  '@type': 'Person';
  name: string;
  jobTitle?: string;
  description?: string;
  image?: string;
  sameAs?: string[];
  knowsAbout?: string[];
}

/**
 * Organization JSON-LD 接口（增强版）
 */
interface EnhancedOrganizationJsonLd {
  '@context': 'https://schema.org';
  '@type': 'Organization';
  name: string;
  description: string;
  url: string;
  logo: string;
  foundingDate: string;
  email?: string;
  telephone?: string;
  address?: {
    '@type': 'PostalAddress';
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry?: string;
  };
  contactPoint?: {
    '@type': 'ContactPoint';
    contactType: string;
    email?: string;
    telephone?: string;
    availableLanguage?: string[];
  };
  sameAs?: string[];
}

/**
 * 生成专家 Person JSON-LD 结构化数据
 * @param expert - 专家信息
 * @returns Person JSON-LD 对象
 */
export function generateExpertJsonLd(expert: ExpertInfo): PersonJsonLd {
  const sameAs: string[] = [];
  
  if (expert.socialProfiles?.twitter) {
    sameAs.push(expert.socialProfiles.twitter);
  }
  if (expert.socialProfiles?.linkedin) {
    sameAs.push(expert.socialProfiles.linkedin);
  }
  if (expert.socialProfiles?.github) {
    sameAs.push(expert.socialProfiles.github);
  }
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: expert.name,
    ...(expert.role && { jobTitle: expert.role }),
    ...(expert.credentials.length > 0 && {
      description: expert.credentials.join(', '),
    }),
    ...(expert.avatar && { image: expert.avatar }),
    ...(sameAs.length > 0 && { sameAs }),
    ...(expert.expertise && expert.expertise.length > 0 && {
      knowsAbout: expert.expertise,
    }),
  };
}

/**
 * 生成增强的 Organization JSON-LD 结构化数据
 * @param org - 组织信息
 * @param locale - 语言代码
 * @returns Organization JSON-LD 对象
 */
export function generateEnhancedOrganizationJsonLd(
  org: OrganizationInfo,
  locale: string = 'en'
): EnhancedOrganizationJsonLd {
  const sameAs = Object.values(org.socialProfiles).filter(Boolean);
  
  const availableLanguages = ['en', 'zh', 'es', 'pt', 'ja', 'ru', 'fr', 'ar', 'de', 'ko'];
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: org.name,
    description: org.description,
    url: getCanonicalUrl(locale, ''),
    logo: org.logo,
    foundingDate: `${org.foundedYear}-01-01`,
    ...(org.contactEmail && { email: org.contactEmail }),
    ...(org.contactPhone && { telephone: org.contactPhone }),
    ...(org.address && {
      address: {
        '@type': 'PostalAddress',
        ...org.address,
      },
    }),
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      ...(org.contactEmail && { email: org.contactEmail }),
      ...(org.contactPhone && { telephone: org.contactPhone }),
      availableLanguage: availableLanguages,
    },
    ...(sameAs.length > 0 && { sameAs }),
  };
}

/**
 * 获取工具页面的作者信息
 * @param toolSlug - 工具 slug
 * @returns 专家信息
 */
export function getToolAuthor(toolSlug: string): ExpertInfo {
  // 可以根据工具类型返回不同的专家信息
  // 目前返回默认专家
  return DEFAULT_EXPERT;
}

/**
 * 获取组织信息
 * @returns 组织信息
 */
export function getOrganizationInfo(): OrganizationInfo {
  return DEFAULT_ORGANIZATION;
}

/**
 * 生成信任信号数据
 * @param locale - 语言代码
 * @returns 信任信号对象
 */
export function getTrustSignals(locale: string): {
  totalTools: number;
  freeToUse: boolean;
  noRegistration: boolean;
  browserBased: boolean;
  dataPrivacy: boolean;
  supportedLanguages: number;
} {
  return {
    totalTools: 200, // 工具总数
    freeToUse: true,
    noRegistration: true,
    browserBased: true,
    dataPrivacy: true,
    supportedLanguages: 10,
  };
}

/**
 * 生成多语言的信任信号文本
 * @param locale - 语言代码
 * @returns 信任信号文本对象
 */
export function getTrustSignalTexts(locale: string): {
  freeToUse: string;
  noRegistration: string;
  browserBased: string;
  dataPrivacy: string;
} {
  const texts: Record<string, {
    freeToUse: string;
    noRegistration: string;
    browserBased: string;
    dataPrivacy: string;
  }> = {
    en: {
      freeToUse: '100% Free to Use',
      noRegistration: 'No Registration Required',
      browserBased: 'Browser-Based Processing',
      dataPrivacy: 'Your Data Stays Private',
    },
    zh: {
      freeToUse: '100% 免费使用',
      noRegistration: '无需注册',
      browserBased: '浏览器本地处理',
      dataPrivacy: '数据隐私保护',
    },
    es: {
      freeToUse: '100% Gratis',
      noRegistration: 'Sin Registro',
      browserBased: 'Procesamiento en el Navegador',
      dataPrivacy: 'Tus Datos Son Privados',
    },
    pt: {
      freeToUse: '100% Gratuito',
      noRegistration: 'Sem Registro',
      browserBased: 'Processamento no Navegador',
      dataPrivacy: 'Seus Dados São Privados',
    },
    ja: {
      freeToUse: '100% 無料',
      noRegistration: '登録不要',
      browserBased: 'ブラウザ内処理',
      dataPrivacy: 'データプライバシー保護',
    },
    ru: {
      freeToUse: '100% Бесплатно',
      noRegistration: 'Без Регистрации',
      browserBased: 'Обработка в Браузере',
      dataPrivacy: 'Ваши Данные Конфиденциальны',
    },
    fr: {
      freeToUse: '100% Gratuit',
      noRegistration: 'Sans Inscription',
      browserBased: 'Traitement dans le Navigateur',
      dataPrivacy: 'Vos Données Restent Privées',
    },
    ar: {
      freeToUse: 'مجاني 100%',
      noRegistration: 'بدون تسجيل',
      browserBased: 'معالجة في المتصفح',
      dataPrivacy: 'بياناتك خاصة',
    },
    de: {
      freeToUse: '100% Kostenlos',
      noRegistration: 'Keine Registrierung',
      browserBased: 'Browser-basierte Verarbeitung',
      dataPrivacy: 'Ihre Daten Bleiben Privat',
    },
    ko: {
      freeToUse: '100% 무료',
      noRegistration: '가입 불필요',
      browserBased: '브라우저 내 처리',
      dataPrivacy: '데이터 프라이버시 보호',
    },
  };
  
  return texts[locale] || texts.en;
}

/**
 * 验证专家信息完整性
 * @param expert - 专家信息
 * @returns 是否完整
 */
export function validateExpertInfo(expert: ExpertInfo): boolean {
  return (
    expert.name.length > 0 &&
    expert.role.length > 0 &&
    expert.credentials.length > 0
  );
}

/**
 * 验证组织信息完整性
 * @param org - 组织信息
 * @returns 是否完整
 */
export function validateOrganizationInfo(org: OrganizationInfo): boolean {
  return (
    org.name.length > 0 &&
    org.description.length > 0 &&
    org.foundedYear > 2000 &&
    org.logo.length > 0 &&
    org.contactEmail.length > 0
  );
}
