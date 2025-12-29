/**
 * 元数据验证模块
 * 验证SEO元数据的完整性和正确性
 * 支持多语言页面的元数据验证
 */

import { SEO_CONFIG, SEO_LOCALES } from './seo';

// 元数据验证结果接口
export interface MetadataValidationResult {
  isValid: boolean;
  errors: MetadataError[];
  warnings: MetadataWarning[];
}

// 元数据错误接口
export interface MetadataError {
  field: string;
  message: string;
  expected?: string;
  actual?: string;
}

// 元数据警告接口
export interface MetadataWarning {
  field: string;
  message: string;
  suggestion?: string;
}

// 页面元数据接口
export interface PageMetadata {
  title?: string;
  description?: string;
  canonical?: string;
  alternates?: {
    canonical?: string;
    languages?: Record<string, string>;
  };
  openGraph?: {
    title?: string;
    description?: string;
    url?: string;
    type?: string;
    images?: Array<{ url: string; width?: number; height?: number }>;
  };
  twitter?: {
    card?: string;
    title?: string;
    description?: string;
  };
}

/**
 * 验证页面元数据
 * @param locale - 语言代码
 * @param path - 页面路径
 * @param metadata - 元数据对象
 * @returns 验证结果
 */
export function validatePageMetadata(
  locale: string,
  path: string,
  metadata: PageMetadata
): MetadataValidationResult {
  const errors: MetadataError[] = [];
  const warnings: MetadataWarning[] = [];

  // 验证标题
  if (!metadata.title) {
    errors.push({
      field: 'title',
      message: 'Title is required',
    });
  } else {
    if (metadata.title.length > SEO_CONFIG.titleMaxLength) {
      warnings.push({
        field: 'title',
        message: `Title exceeds ${SEO_CONFIG.titleMaxLength} characters`,
        suggestion: `Current length: ${metadata.title.length}. Consider shortening.`,
      });
    }
    if (metadata.title.length < 10) {
      warnings.push({
        field: 'title',
        message: 'Title is too short',
        suggestion: 'Titles should be at least 10 characters for better SEO.',
      });
    }
  }

  // 验证描述
  if (!metadata.description) {
    errors.push({
      field: 'description',
      message: 'Description is required',
    });
  } else {
    if (metadata.description.length < SEO_CONFIG.descriptionMinLength) {
      warnings.push({
        field: 'description',
        message: `Description is shorter than ${SEO_CONFIG.descriptionMinLength} characters`,
        suggestion: `Current length: ${metadata.description.length}. Consider expanding.`,
      });
    }
    if (metadata.description.length > SEO_CONFIG.descriptionMaxLength) {
      warnings.push({
        field: 'description',
        message: `Description exceeds ${SEO_CONFIG.descriptionMaxLength} characters`,
        suggestion: `Current length: ${metadata.description.length}. May be truncated in search results.`,
      });
    }
  }

  // 验证 canonical URL
  if (metadata.alternates?.canonical) {
    const canonicalResult = validateCanonicalUrl(locale, path, metadata.alternates.canonical);
    errors.push(...canonicalResult.errors);
    warnings.push(...canonicalResult.warnings);
  } else if (metadata.canonical) {
    const canonicalResult = validateCanonicalUrl(locale, path, metadata.canonical);
    errors.push(...canonicalResult.errors);
    warnings.push(...canonicalResult.warnings);
  } else {
    errors.push({
      field: 'canonical',
      message: 'Canonical URL is required',
    });
  }

  // 验证 Open Graph
  if (metadata.openGraph) {
    if (!metadata.openGraph.title) {
      warnings.push({
        field: 'openGraph.title',
        message: 'Open Graph title is missing',
        suggestion: 'Add og:title for better social sharing.',
      });
    }
    if (!metadata.openGraph.description) {
      warnings.push({
        field: 'openGraph.description',
        message: 'Open Graph description is missing',
        suggestion: 'Add og:description for better social sharing.',
      });
    }
    if (!metadata.openGraph.images || metadata.openGraph.images.length === 0) {
      warnings.push({
        field: 'openGraph.images',
        message: 'Open Graph image is missing',
        suggestion: 'Add og:image for better social sharing appearance.',
      });
    }
  } else {
    warnings.push({
      field: 'openGraph',
      message: 'Open Graph metadata is missing',
      suggestion: 'Add Open Graph tags for better social media sharing.',
    });
  }

  // 验证 Twitter Card
  if (metadata.twitter) {
    if (!metadata.twitter.card) {
      warnings.push({
        field: 'twitter.card',
        message: 'Twitter card type is missing',
        suggestion: 'Add twitter:card for better Twitter sharing.',
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * 验证 hreflang 标签完整性
 * @param locale - 当前语言
 * @param path - 页面路径
 * @param alternates - 语言替代链接映射
 * @returns 验证结果
 */
export function validateHreflangTags(
  locale: string,
  path: string,
  alternates: Record<string, string>
): MetadataValidationResult {
  const errors: MetadataError[] = [];
  const warnings: MetadataWarning[] = [];

  // 检查是否包含所有支持的语言
  for (const supportedLocale of SEO_LOCALES) {
    if (!alternates[supportedLocale]) {
      errors.push({
        field: `hreflang.${supportedLocale}`,
        message: `Missing hreflang for locale: ${supportedLocale}`,
        expected: `/${supportedLocale}${path}`,
      });
    }
  }

  // 检查是否包含 x-default
  if (!alternates['x-default']) {
    errors.push({
      field: 'hreflang.x-default',
      message: 'Missing x-default hreflang tag',
      expected: `/${SEO_CONFIG.defaultLocale}${path}`,
    });
  }

  // 验证当前语言的 hreflang 指向自身
  const expectedSelfRef = `/${locale}${path}`;
  if (alternates[locale] && !alternates[locale].endsWith(expectedSelfRef)) {
    warnings.push({
      field: `hreflang.${locale}`,
      message: 'Self-referencing hreflang may not match current page',
      suggestion: `Expected to end with: ${expectedSelfRef}`,
    });
  }

  // 验证 URL 格式
  for (const [lang, url] of Object.entries(alternates)) {
    if (url && !isValidUrl(url) && !url.startsWith('/')) {
      errors.push({
        field: `hreflang.${lang}`,
        message: 'Invalid URL format',
        actual: url,
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * 验证 canonical URL
 * @param locale - 语言代码
 * @param path - 页面路径
 * @param canonical - canonical URL
 * @returns 验证结果
 */
export function validateCanonicalUrl(
  locale: string,
  path: string,
  canonical: string
): MetadataValidationResult {
  const errors: MetadataError[] = [];
  const warnings: MetadataWarning[] = [];

  if (!canonical) {
    errors.push({
      field: 'canonical',
      message: 'Canonical URL is empty',
    });
    return { isValid: false, errors, warnings };
  }

  // 检查是否是有效的 URL 或相对路径
  const isAbsoluteUrl = canonical.startsWith('http://') || canonical.startsWith('https://');
  const isRelativePath = canonical.startsWith('/');

  if (!isAbsoluteUrl && !isRelativePath) {
    errors.push({
      field: 'canonical',
      message: 'Canonical URL must be absolute URL or start with /',
      actual: canonical,
    });
  }

  // 检查是否包含当前语言
  const expectedPath = `/${locale}${path}`;
  if (!canonical.includes(expectedPath) && !canonical.endsWith(expectedPath)) {
    warnings.push({
      field: 'canonical',
      message: 'Canonical URL may not match current page',
      suggestion: `Expected to contain: ${expectedPath}`,
    });
  }

  // 检查是否有尾部斜杠（通常不推荐）
  if (canonical.endsWith('/') && canonical !== '/') {
    warnings.push({
      field: 'canonical',
      message: 'Canonical URL has trailing slash',
      suggestion: 'Consider removing trailing slash for consistency.',
    });
  }

  // 检查是否使用 HTTPS
  if (isAbsoluteUrl && canonical.startsWith('http://')) {
    warnings.push({
      field: 'canonical',
      message: 'Canonical URL uses HTTP instead of HTTPS',
      suggestion: 'Use HTTPS for better security and SEO.',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * 验证 URL 格式
 * @param url - URL 字符串
 * @returns 是否有效
 */
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * 批量验证多个页面的元数据
 * @param pages - 页面数组
 * @returns 验证结果数组
 */
export function validateMultiplePages(
  pages: Array<{
    locale: string;
    path: string;
    metadata: PageMetadata;
  }>
): Array<{
  locale: string;
  path: string;
  result: MetadataValidationResult;
}> {
  return pages.map(({ locale, path, metadata }) => ({
    locale,
    path,
    result: validatePageMetadata(locale, path, metadata),
  }));
}

/**
 * 生成元数据验证摘要
 * @param results - 验证结果数组
 * @returns 摘要对象
 */
export function generateValidationSummary(
  results: Array<{ result: MetadataValidationResult }>
): {
  totalPages: number;
  validPages: number;
  invalidPages: number;
  totalErrors: number;
  totalWarnings: number;
  commonErrors: Array<{ field: string; count: number }>;
} {
  const totalPages = results.length;
  const validPages = results.filter(r => r.result.isValid).length;
  const invalidPages = totalPages - validPages;
  
  const totalErrors = results.reduce((sum, r) => sum + r.result.errors.length, 0);
  const totalWarnings = results.reduce((sum, r) => sum + r.result.warnings.length, 0);

  // 统计常见错误
  const errorCounts = new Map<string, number>();
  for (const { result } of results) {
    for (const error of result.errors) {
      const count = errorCounts.get(error.field) || 0;
      errorCounts.set(error.field, count + 1);
    }
  }

  const commonErrors = Array.from(errorCounts.entries())
    .map(([field, count]) => ({ field, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    totalPages,
    validPages,
    invalidPages,
    totalErrors,
    totalWarnings,
    commonErrors,
  };
}
