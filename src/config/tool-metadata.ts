/**
 * 工具元数据配置
 * 包含工具的发布日期、版本、功能列表等 SEO 增强字段
 */

export interface ToolMetadata {
  /** 发布日期 (ISO 8601 格式) */
  datePublished: string;
  /** 最后修改日期 (ISO 8601 格式) */
  dateModified: string;
  /** 软件版本 */
  softwareVersion: string;
  /** 功能列表 */
  featureList: string[];
}

/**
 * 默认工具元数据
 * 用于没有特定配置的工具
 */
export const DEFAULT_TOOL_METADATA: ToolMetadata = {
  datePublished: '2024-01-01',
  dateModified: '2025-01-07',
  softwareVersion: '1.0.0',
  featureList: [
    'Free to use',
    'No registration required',
    'Browser-based processing',
    'Privacy-focused',
    'Instant results',
  ],
};

/**
 * 工具特定元数据配置
 * 为热门工具提供详细的功能列表
 */
export const TOOL_METADATA: Record<string, Partial<ToolMetadata>> = {
  'json-formatter': {
    datePublished: '2024-01-01',
    dateModified: '2025-01-07',
    softwareVersion: '2.0.0',
    featureList: [
      'Format and beautify JSON',
      'Validate JSON syntax',
      'Minify JSON',
      'Tree view visualization',
      'Copy formatted output',
      'Download as file',
    ],
  },
  'base64': {
    datePublished: '2024-01-01',
    dateModified: '2025-01-07',
    softwareVersion: '1.5.0',
    featureList: [
      'Encode text to Base64',
      'Decode Base64 to text',
      'Support for UTF-8 encoding',
      'File to Base64 conversion',
      'URL-safe Base64 option',
    ],
  },
  'uuid-generator': {
    datePublished: '2024-01-01',
    dateModified: '2025-01-07',
    softwareVersion: '1.2.0',
    featureList: [
      'Generate UUID v1, v4, v5',
      'Bulk UUID generation',
      'Copy to clipboard',
      'Validate UUID format',
      'Customizable output format',
    ],
  },
  'qr-generator': {
    datePublished: '2024-01-01',
    dateModified: '2025-01-07',
    softwareVersion: '1.3.0',
    featureList: [
      'Generate QR codes from text',
      'Support for URLs, WiFi, vCard',
      'Customizable size and colors',
      'Download as PNG/SVG',
      'Error correction levels',
    ],
  },
  'password-generator': {
    datePublished: '2024-01-01',
    dateModified: '2025-01-07',
    softwareVersion: '1.4.0',
    featureList: [
      'Generate secure passwords',
      'Customizable length',
      'Include/exclude character types',
      'Password strength indicator',
      'Bulk password generation',
    ],
  },
  'hash-generator': {
    datePublished: '2024-01-01',
    dateModified: '2025-01-07',
    softwareVersion: '1.2.0',
    featureList: [
      'MD5, SHA-1, SHA-256, SHA-512',
      'File hash calculation',
      'Text hash generation',
      'Compare hash values',
      'Copy hash to clipboard',
    ],
  },
  'color-converter': {
    datePublished: '2024-01-01',
    dateModified: '2025-01-07',
    softwareVersion: '1.3.0',
    featureList: [
      'Convert between HEX, RGB, HSL',
      'Color picker interface',
      'Color preview',
      'Copy color values',
      'Support for alpha channel',
    ],
  },
  'word-counter': {
    datePublished: '2024-01-01',
    dateModified: '2025-01-07',
    softwareVersion: '1.1.0',
    featureList: [
      'Count words and characters',
      'Count sentences and paragraphs',
      'Reading time estimation',
      'Keyword density analysis',
      'Support for multiple languages',
    ],
  },
  'diff-checker': {
    datePublished: '2024-01-01',
    dateModified: '2025-01-07',
    softwareVersion: '1.2.0',
    featureList: [
      'Compare two texts',
      'Highlight differences',
      'Side-by-side view',
      'Inline diff view',
      'Ignore whitespace option',
    ],
  },
  'regex-tester': {
    datePublished: '2024-01-01',
    dateModified: '2025-01-07',
    softwareVersion: '1.3.0',
    featureList: [
      'Test regular expressions',
      'Real-time matching',
      'Match highlighting',
      'Capture groups display',
      'Common regex patterns library',
    ],
  },
  'code-minifier': {
    datePublished: '2024-01-01',
    dateModified: '2025-01-07',
    softwareVersion: '1.2.0',
    featureList: [
      'Minify JavaScript',
      'Minify CSS',
      'Minify HTML',
      'Size reduction statistics',
      'Download minified file',
    ],
  },
  'jwt-decoder': {
    datePublished: '2024-01-01',
    dateModified: '2025-01-07',
    softwareVersion: '1.1.0',
    featureList: [
      'Decode JWT tokens',
      'View header and payload',
      'Validate token signature',
      'Check expiration time',
      'Copy decoded data',
    ],
  },
  'timestamp-converter': {
    datePublished: '2024-01-01',
    dateModified: '2025-01-07',
    softwareVersion: '1.2.0',
    featureList: [
      'Convert Unix timestamp',
      'Multiple date formats',
      'Timezone support',
      'Current timestamp display',
      'Date to timestamp conversion',
    ],
  },
  'json-to-csv': {
    datePublished: '2024-01-01',
    dateModified: '2025-01-07',
    softwareVersion: '1.1.0',
    featureList: [
      'Convert JSON to CSV',
      'Handle nested objects',
      'Custom delimiter option',
      'Download as CSV file',
      'Preview conversion result',
    ],
  },
  'unit-converter': {
    datePublished: '2024-01-01',
    dateModified: '2025-01-07',
    softwareVersion: '1.3.0',
    featureList: [
      'Length, weight, temperature',
      'Area and volume',
      'Speed and time',
      'Data storage units',
      'Instant conversion',
    ],
  },
};

/**
 * 获取工具元数据
 * @param slug - 工具 slug
 * @returns 工具元数据（合并默认值和特定配置）
 */
export function getToolMetadata(slug: string): ToolMetadata {
  const specificMetadata = TOOL_METADATA[slug] || {};
  return {
    ...DEFAULT_TOOL_METADATA,
    ...specificMetadata,
  };
}

/**
 * 获取工具功能列表（多语言）
 * @param slug - 工具 slug
 * @param locale - 语言代码
 * @returns 功能列表
 */
export function getToolFeatureList(slug: string, locale: string): string[] {
  const metadata = getToolMetadata(slug);
  // 目前只返回英文功能列表
  // 未来可以扩展为多语言支持
  return metadata.featureList;
}
