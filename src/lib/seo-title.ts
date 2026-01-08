/**
 * SEO 标题优化模块
 * 确保所有页面标题在 50-60 字符之间
 */

import { SEO_CONFIG } from './seo';

// 标题长度配置
export const TITLE_CONFIG = {
  minLength: 50,
  maxLength: 60,
  siteName: SEO_CONFIG.siteName,
};

// 按语言的标题后缀模板（按长度排序，较短的在前）
// 包含多种长度的后缀以适应不同长度的原始标题
export const TITLE_SUFFIXES: Record<string, string[]> = {
  en: [
    ' | U2Tool',                                    // ~10 chars
    ' - Free Online',                               // ~14 chars
    ' - Online Tool',                               // ~14 chars
    ' - Free Online Tool',                          // ~19 chars
    ' - Free Online Tool | U2Tool',                 // ~29 chars
    ' - Free Online Converter & Generator | U2Tool', // ~45 chars
  ],
  zh: [
    ' | U2Tool',
    ' - 在线工具',
    ' - 免费在线',
    ' - 免费在线工具',
    ' - 免费在线工具 | U2Tool',
    ' - 免费在线转换器和生成器 | U2Tool',
    ' - 免费在线转换、编码、生成工具 | U2Tool - 快速便捷',
  ],
  ja: [
    ' | U2Tool',
    ' - オンライン',
    ' - 無料ツール',
    ' - 無料オンラインツール',
    ' - 無料オンラインツール | U2Tool',
    ' - 無料オンラインコンバーター＆ジェネレーター | U2Tool',
    ' - 無料オンライン変換・エンコード・生成ツール | U2Tool',
  ],
  ko: [
    ' | U2Tool',
    ' - 온라인',
    ' - 무료 도구',
    ' - 무료 온라인 도구',
    ' - 무료 온라인 도구 | U2Tool',
    ' - 무료 온라인 변환기 및 생성기 | U2Tool',
    ' - 무료 온라인 변환, 인코딩, 생성 도구 | U2Tool - 빠르고 편리',
  ],
  es: [
    ' | U2Tool',
    ' - Online',
    ' - Gratis',
    ' - Herramienta Online',
    ' - Herramienta Online Gratis | U2Tool',
    ' - Convertidor y Generador Online Gratis | U2Tool',
  ],
  pt: [
    ' | U2Tool',
    ' - Online',
    ' - Grátis',
    ' - Ferramenta Online',
    ' - Ferramenta Online Grátis | U2Tool',
    ' - Conversor e Gerador Online Grátis | U2Tool',
  ],
  fr: [
    ' | U2Tool',
    ' - En Ligne',
    ' - Gratuit',
    ' - Outil en Ligne',
    ' - Outil en Ligne Gratuit | U2Tool',
    ' - Convertisseur et Générateur en Ligne Gratuit | U2Tool',
  ],
  de: [
    ' | U2Tool',
    ' - Online',
    ' - Kostenlos',
    ' - Online-Tool',
    ' - Kostenloses Online-Tool | U2Tool',
    ' - Kostenloser Online-Konverter & Generator | U2Tool',
  ],
  ru: [
    ' | U2Tool',
    ' - Онлайн',
    ' - Бесплатно',
    ' - Онлайн Инструмент',
    ' - Бесплатный Онлайн Инструмент | U2Tool',
    ' - Бесплатный Онлайн Конвертер и Генератор | U2Tool',
  ],
  ar: [
    ' | U2Tool',
    ' - أونلاين',
    ' - مجاني',
    ' - أداة مجانية',
    ' - أداة مجانية أونلاين | U2Tool',
    ' - محول ومولد مجاني أونلاين | U2Tool',
    ' - أداة تحويل وترميز وإنشاء مجانية أونلاين | U2Tool',
  ],
};

// 关键词列表（用于验证标题是否包含关键词）
export const TITLE_KEYWORDS: Record<string, string[]> = {
  en: ['Online', 'Free', 'Tool', 'U2Tool'],
  zh: ['在线', '免费', '工具', 'U2Tool'],
  ja: ['オンライン', '無料', 'ツール', 'U2Tool'],
  ko: ['온라인', '무료', '도구', 'U2Tool'],
  es: ['Online', 'Gratis', 'Herramienta', 'U2Tool'],
  pt: ['Online', 'Grátis', 'Ferramenta', 'U2Tool'],
  fr: ['Ligne', 'Gratuit', 'Outil', 'U2Tool'],
  de: ['Online', 'Kostenlos', 'Tool', 'U2Tool'],
  ru: ['Онлайн', 'Бесплатно', 'Инструмент', 'U2Tool'],
  ar: ['أونلاين', 'مجاني', 'أداة', 'U2Tool'],
};

export interface TitleExtensionResult {
  original: string;
  extended: string;
  wasExtended: boolean;
  finalLength: number;
}

/**
 * 获取语言特定的标题后缀
 * @param locale - 语言代码
 * @returns 标题后缀数组
 */
export function getTitleSuffixes(locale: string): string[] {
  return TITLE_SUFFIXES[locale] || TITLE_SUFFIXES.en;
}

/**
 * 获取语言特定的关键词
 * @param locale - 语言代码
 * @returns 关键词数组
 */
export function getTitleKeywords(locale: string): string[] {
  return TITLE_KEYWORDS[locale] || TITLE_KEYWORDS.en;
}

/**
 * 检查标题是否包含关键词
 * @param title - 标题
 * @param locale - 语言代码
 * @returns 是否包含关键词
 */
export function titleContainsKeyword(title: string, locale: string): boolean {
  const keywords = getTitleKeywords(locale);
  return keywords.some(keyword => title.includes(keyword));
}

/**
 * 扩展过短的标题
 * @param title - 原始标题
 * @param locale - 语言代码
 * @param config - 配置选项（可选）
 * @returns 扩展后的标题结果
 */
export function extendTitle(
  title: string,
  locale: string,
  config: Partial<typeof TITLE_CONFIG> = {}
): TitleExtensionResult {
  const { minLength, maxLength } = { ...TITLE_CONFIG, ...config };
  
  // 如果标题为空，返回默认值
  if (!title || title.trim() === '') {
    const defaultTitle = `${TITLE_CONFIG.siteName} - Free Online Tools`;
    return {
      original: title,
      extended: defaultTitle,
      wasExtended: true,
      finalLength: defaultTitle.length,
    };
  }

  const trimmedTitle = title.trim();
  
  // 如果标题已经在目标范围内，直接返回
  if (trimmedTitle.length >= minLength && trimmedTitle.length <= maxLength) {
    return {
      original: title,
      extended: trimmedTitle,
      wasExtended: false,
      finalLength: trimmedTitle.length,
    };
  }

  // 如果标题过长，截断
  if (trimmedTitle.length > maxLength) {
    const truncated = trimmedTitle.slice(0, maxLength - 3) + '...';
    return {
      original: title,
      extended: truncated,
      wasExtended: true,
      finalLength: truncated.length,
    };
  }

  // 标题过短，需要扩展
  const suffixes = getTitleSuffixes(locale);
  let bestCandidate = trimmedTitle;
  let bestScore = -Infinity;

  // 遍历所有后缀，找到最佳匹配
  for (const suffix of suffixes) {
    const candidate = trimmedTitle + suffix;
    const candidateLength = candidate.length;
    
    // 计算分数：在目标范围内得高分，越接近中间值越好
    let score: number;
    
    if (candidateLength >= minLength && candidateLength <= maxLength) {
      // 在目标范围内，计算与中间值的距离（越近越好）
      const midPoint = (minLength + maxLength) / 2;
      score = 1000 - Math.abs(candidateLength - midPoint);
    } else if (candidateLength < minLength) {
      // 太短，负分但越长越好
      score = candidateLength - minLength;
    } else {
      // 太长，负分但越短越好（截断后可能在范围内）
      score = maxLength - candidateLength - 100;
    }
    
    if (score > bestScore) {
      bestScore = score;
      bestCandidate = candidate;
    }
  }

  // 如果最佳候选仍然太长，截断
  if (bestCandidate.length > maxLength) {
    bestCandidate = bestCandidate.slice(0, maxLength);
  }

  // 如果最佳候选仍然太短，使用最长的后缀并截断到最大长度
  if (bestCandidate.length < minLength) {
    const longestSuffix = suffixes[suffixes.length - 1];
    bestCandidate = trimmedTitle + longestSuffix;
    
    // 如果超过最大长度，截断
    if (bestCandidate.length > maxLength) {
      bestCandidate = bestCandidate.slice(0, maxLength);
    }
  }

  return {
    original: title,
    extended: bestCandidate,
    wasExtended: true,
    finalLength: bestCandidate.length,
  };
}

/**
 * 批量扩展标题
 * @param titles - 标题数组，每个元素包含 title 和 locale
 * @returns 扩展结果数组
 */
export function extendTitles(
  titles: Array<{ title: string; locale: string }>
): TitleExtensionResult[] {
  return titles.map(({ title, locale }) => extendTitle(title, locale));
}

/**
 * 验证标题长度是否在目标范围内
 * @param title - 标题
 * @param config - 配置选项（可选）
 * @returns 验证结果
 */
export function validateTitleLength(
  title: string,
  config: Partial<typeof TITLE_CONFIG> = {}
): { valid: boolean; length: number; message: string } {
  const { minLength, maxLength } = { ...TITLE_CONFIG, ...config };
  const length = title.length;

  if (length < minLength) {
    return {
      valid: false,
      length,
      message: `Title too short: ${length} chars (min: ${minLength})`,
    };
  }

  if (length > maxLength) {
    return {
      valid: false,
      length,
      message: `Title too long: ${length} chars (max: ${maxLength})`,
    };
  }

  return {
    valid: true,
    length,
    message: `Title length OK: ${length} chars`,
  };
}
