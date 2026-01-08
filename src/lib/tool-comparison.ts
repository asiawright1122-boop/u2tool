/**
 * 工具对比模块
 * 生成工具对比数据和结构化数据
 * @see Requirements 6.1, 6.2, 6.3
 */

import { tools, type Tool, categories } from '@/config/tools';

// 工具对比接口
export interface ToolComparison {
  tools: string[];           // 对比的工具 slugs
  features: ComparisonFeature[];
  similarities: string[];
  differences: string[];
  recommendation: string;
}

// 对比特性接口
export interface ComparisonFeature {
  name: string;
  description: string;
  toolSupport: Record<string, boolean | string>;
}

// 对比页面数据接口
export interface ComparisonPageData {
  title: string;
  description: string;
  comparison: ToolComparison;
  jsonLd: Record<string, unknown>;
}

// 通用特性列表
const COMMON_FEATURES = [
  { name: 'browserBased', description: '浏览器端处理' },
  { name: 'noServerUpload', description: '无需上传到服务器' },
  { name: 'freeToUse', description: '免费使用' },
  { name: 'noRegistration', description: '无需注册' },
  { name: 'mobileSupport', description: '移动端支持' },
  { name: 'copyToClipboard', description: '一键复制' },
  { name: 'downloadResult', description: '下载结果' },
  { name: 'realTimePreview', description: '实时预览' },
];

// 分类特定特性
const CATEGORY_FEATURES: Record<string, { name: string; description: string }[]> = {
  formatters: [
    { name: 'syntaxHighlight', description: '语法高亮' },
    { name: 'autoIndent', description: '自动缩进' },
    { name: 'errorDetection', description: '错误检测' },
    { name: 'minifyOption', description: '压缩选项' },
  ],
  encoders: [
    { name: 'encodeMode', description: '编码模式' },
    { name: 'decodeMode', description: '解码模式' },
    { name: 'batchProcess', description: '批量处理' },
    { name: 'urlSafe', description: 'URL 安全' },
  ],
  generators: [
    { name: 'customLength', description: '自定义长度' },
    { name: 'customCharset', description: '自定义字符集' },
    { name: 'batchGenerate', description: '批量生成' },
    { name: 'uniqueGuarantee', description: '唯一性保证' },
  ],
  converters: [
    { name: 'bidirectional', description: '双向转换' },
    { name: 'preserveFormat', description: '保留格式' },
    { name: 'batchConvert', description: '批量转换' },
    { name: 'previewResult', description: '预览结果' },
  ],
  security: [
    { name: 'strongEncryption', description: '强加密' },
    { name: 'multipleAlgorithms', description: '多种算法' },
    { name: 'keyGeneration', description: '密钥生成' },
    { name: 'hashVerification', description: '哈希验证' },
  ],
};


/**
 * 获取工具配置
 * @param slug - 工具 slug
 * @returns 工具配置或 undefined
 */
export function getTool(slug: string): Tool | undefined {
  return tools.find(t => t.slug === slug);
}

/**
 * 获取同分类的工具
 * @param category - 分类
 * @param excludeSlug - 排除的工具 slug
 * @returns 工具配置数组
 */
export function getToolsInCategory(
  category: string,
  excludeSlug?: string
): Tool[] {
  return tools.filter(t => t.category === category && t.slug !== excludeSlug);
}

/**
 * 生成工具对比
 * @param toolSlugs - 要对比的工具 slugs
 * @returns 工具对比数据
 */
export function generateComparison(toolSlugs: string[]): ToolComparison {
  const toolConfigs = toolSlugs
    .map(slug => getTool(slug))
    .filter((t): t is Tool => t !== undefined);

  if (toolConfigs.length < 2) {
    return {
      tools: toolSlugs,
      features: [],
      similarities: [],
      differences: [],
      recommendation: '',
    };
  }

  // 获取所有工具的分类
  const toolCategories = new Set(toolConfigs.map(t => t.category));
  
  // 生成特性对比
  const features: ComparisonFeature[] = [];
  
  // 添加通用特性（所有工具都支持）
  for (const feature of COMMON_FEATURES) {
    const toolSupport: Record<string, boolean | string> = {};
    for (const tool of toolConfigs) {
      toolSupport[tool.slug] = true; // 所有工具都支持这些基本特性
    }
    features.push({
      name: feature.name,
      description: feature.description,
      toolSupport,
    });
  }

  // 添加分类特定特性
  for (const category of toolCategories) {
    const categoryFeatures = CATEGORY_FEATURES[category] || [];
    for (const feature of categoryFeatures) {
      const toolSupport: Record<string, boolean | string> = {};
      for (const tool of toolConfigs) {
        // 只有同分类的工具才支持分类特定特性
        toolSupport[tool.slug] = tool.category === category;
      }
      features.push({
        name: feature.name,
        description: feature.description,
        toolSupport,
      });
    }
  }

  // 生成相似点
  const similarities: string[] = [
    '所有工具都在浏览器端处理数据，无需上传到服务器',
    '完全免费使用，无需注册账号',
    '支持移动端访问',
    '处理结果可一键复制或下载',
  ];

  // 生成差异点
  const differences: string[] = [];
  if (toolCategories.size > 1) {
    differences.push(`工具属于不同分类: ${Array.from(toolCategories).join(', ')}`);
  }
  
  // 检查热门状态差异
  const popularTools = toolConfigs.filter(t => t.popular);
  const nonPopularTools = toolConfigs.filter(t => !t.popular);
  if (popularTools.length > 0 && nonPopularTools.length > 0) {
    differences.push(
      `${popularTools.map(t => t.slug).join(', ')} 是热门工具`
    );
  }

  // 生成推荐
  let recommendation = '';
  if (toolConfigs.length === 2) {
    const [tool1, tool2] = toolConfigs;
    if (tool1.category === tool2.category) {
      recommendation = `两个工具功能相似，可根据具体需求选择。${tool1.popular ? tool1.slug : tool2.slug} 更受欢迎。`;
    } else {
      recommendation = `两个工具用途不同，${tool1.slug} 适合 ${tool1.category} 场景，${tool2.slug} 适合 ${tool2.category} 场景。`;
    }
  }

  return {
    tools: toolSlugs,
    features,
    similarities,
    differences,
    recommendation,
  };
}

/**
 * 获取对比页面数据
 * @param toolSlugs - 工具 slugs
 * @param locale - 语言
 * @returns 对比页面数据
 */
export function getComparisonPageData(
  toolSlugs: string[],
  locale: string
): ComparisonPageData {
  const comparison = generateComparison(toolSlugs);
  const toolNames = toolSlugs.join(' vs ');
  
  const title = `${toolNames} - 工具对比`;
  const description = `详细对比 ${toolNames}，了解它们的功能差异和适用场景。`;

  const jsonLd = generateComparisonJsonLd(comparison, title, description);

  return {
    title,
    description,
    comparison,
    jsonLd,
  };
}

/**
 * 生成对比页面的 JSON-LD 结构化数据
 * @param comparison - 对比数据
 * @param title - 页面标题
 * @param description - 页面描述
 * @returns JSON-LD 对象
 */
export function generateComparisonJsonLd(
  comparison: ToolComparison,
  title: string,
  description: string
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description: description,
    mainEntity: {
      '@type': 'ItemList',
      name: 'Tool Comparison',
      description: `Comparison of ${comparison.tools.join(', ')}`,
      numberOfItems: comparison.tools.length,
      itemListElement: comparison.tools.map((slug, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'SoftwareApplication',
          name: slug,
          applicationCategory: 'WebApplication',
          operatingSystem: 'Any',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
        },
      })),
    },
  };
}

/**
 * 获取热门分类的对比组合
 * @param limit - 返回数量限制
 * @returns 对比组合数组
 */
export function getPopularComparisons(limit: number = 10): string[][] {
  const comparisons: string[][] = [];
  
  // 获取每个分类的热门工具
  for (const category of categories) {
    const categoryTools = tools
      .filter(t => t.category === category.id && t.popular)
      .slice(0, 3);
    
    // 生成两两对比
    for (let i = 0; i < categoryTools.length; i++) {
      for (let j = i + 1; j < categoryTools.length; j++) {
        comparisons.push([categoryTools[i].slug, categoryTools[j].slug]);
        if (comparisons.length >= limit) {
          return comparisons;
        }
      }
    }
  }

  return comparisons;
}

/**
 * 验证对比数据
 * @param comparison - 对比数据
 * @returns 验证结果
 */
export function validateComparison(comparison: ToolComparison): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (comparison.tools.length < 2) {
    errors.push('对比至少需要 2 个工具');
  }

  if (comparison.features.length === 0) {
    errors.push('对比特性列表为空');
  }

  for (const feature of comparison.features) {
    const supportedTools = Object.keys(feature.toolSupport);
    if (supportedTools.length !== comparison.tools.length) {
      errors.push(`特性 "${feature.name}" 的工具支持数据不完整`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
