/**
 * Semrush SEO 问题验证脚本
 * 
 * 验证以下 SEO 问题是否已修复：
 * 1. 排名页面 meta description 唯一性
 * 2. Title 长度不超过 60 字符
 * 3. Meta description 长度在 120-160 字符之间
 * 4. ranking_seo 翻译完整性
 * 5. robots.txt 配置正确
 * 6. llms.txt 文件存在
 * 
 * 用法: npx tsx scripts/validate-semrush-seo.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const LOCALES = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];
const TITLE_MAX_LENGTH = 60;

// 不同语言的 description 长度阈值
const DESCRIPTION_THRESHOLDS: Record<string, { min: number; max: number }> = {
  en: { min: 120, max: 160 },
  es: { min: 120, max: 160 },
  pt: { min: 120, max: 160 },
  fr: { min: 120, max: 160 },
  de: { min: 120, max: 160 },
  ru: { min: 120, max: 160 },
  zh: { min: 70, max: 140 },
  ja: { min: 70, max: 140 },
  ko: { min: 70, max: 140 },
  ar: { min: 100, max: 180 },
};

interface ValidationResult {
  passed: boolean;
  message: string;
  details?: string[];
}

interface TranslationFile {
  ranking_seo?: {
    newest?: { seo_title?: string; seo_description?: string };
    popular?: { seo_title?: string; seo_description?: string };
  };
  [key: string]: unknown;
}

/**
 * 验证 ranking_seo 翻译完整性
 */
function validateRankingSeoTranslations(): ValidationResult {
  const issues: string[] = [];
  
  for (const locale of LOCALES) {
    const filePath = path.join(process.cwd(), 'src', 'messages', `${locale}.json`);
    
    if (!fs.existsSync(filePath)) {
      issues.push(`${locale}: 翻译文件不存在`);
      continue;
    }
    
    const content = fs.readFileSync(filePath, 'utf-8');
    const translations: TranslationFile = JSON.parse(content);
    
    if (!translations.ranking_seo) {
      issues.push(`${locale}: 缺少 ranking_seo 命名空间`);
      continue;
    }
    
    const rankingSeo = translations.ranking_seo;
    
    // 检查 newest
    if (!rankingSeo.newest?.seo_title) {
      issues.push(`${locale}: 缺少 ranking_seo.newest.seo_title`);
    }
    if (!rankingSeo.newest?.seo_description) {
      issues.push(`${locale}: 缺少 ranking_seo.newest.seo_description`);
    }
    
    // 检查 popular
    if (!rankingSeo.popular?.seo_title) {
      issues.push(`${locale}: 缺少 ranking_seo.popular.seo_title`);
    }
    if (!rankingSeo.popular?.seo_description) {
      issues.push(`${locale}: 缺少 ranking_seo.popular.seo_description`);
    }
  }
  
  return {
    passed: issues.length === 0,
    message: issues.length === 0 
      ? '✅ ranking_seo 翻译完整性验证通过' 
      : `❌ ranking_seo 翻译不完整 (${issues.length} 个问题)`,
    details: issues,
  };
}

/**
 * 验证 meta description 唯一性
 */
function validateMetaDescriptionUniqueness(): ValidationResult {
  const descriptions = new Map<string, string[]>();
  const issues: string[] = [];
  
  for (const locale of LOCALES) {
    const filePath = path.join(process.cwd(), 'src', 'messages', `${locale}.json`);
    
    if (!fs.existsSync(filePath)) continue;
    
    const content = fs.readFileSync(filePath, 'utf-8');
    const translations: TranslationFile = JSON.parse(content);
    
    if (translations.ranking_seo) {
      const newestDesc = translations.ranking_seo.newest?.seo_description;
      const popularDesc = translations.ranking_seo.popular?.seo_description;
      
      if (newestDesc) {
        const key = `${locale}:newest`;
        if (!descriptions.has(newestDesc)) {
          descriptions.set(newestDesc, []);
        }
        descriptions.get(newestDesc)!.push(key);
      }
      
      if (popularDesc) {
        const key = `${locale}:popular`;
        if (!descriptions.has(popularDesc)) {
          descriptions.set(popularDesc, []);
        }
        descriptions.get(popularDesc)!.push(key);
      }
    }
  }
  
  // 检查重复
  for (const [desc, pages] of descriptions) {
    if (pages.length > 1) {
      issues.push(`重复描述: "${desc.substring(0, 50)}..." 出现在: ${pages.join(', ')}`);
    }
  }
  
  return {
    passed: issues.length === 0,
    message: issues.length === 0 
      ? '✅ Meta description 唯一性验证通过' 
      : `❌ 发现重复的 meta description (${issues.length} 个)`,
    details: issues,
  };
}

/**
 * 验证 title 长度
 */
function validateTitleLength(): ValidationResult {
  const issues: string[] = [];
  
  for (const locale of LOCALES) {
    const filePath = path.join(process.cwd(), 'src', 'messages', `${locale}.json`);
    
    if (!fs.existsSync(filePath)) continue;
    
    const content = fs.readFileSync(filePath, 'utf-8');
    const translations: TranslationFile = JSON.parse(content);
    
    if (translations.ranking_seo) {
      const newestTitle = translations.ranking_seo.newest?.seo_title;
      const popularTitle = translations.ranking_seo.popular?.seo_title;
      
      if (newestTitle && newestTitle.length > TITLE_MAX_LENGTH) {
        issues.push(`${locale}:newest title 过长 (${newestTitle.length}/${TITLE_MAX_LENGTH}): "${newestTitle}"`);
      }
      
      if (popularTitle && popularTitle.length > TITLE_MAX_LENGTH) {
        issues.push(`${locale}:popular title 过长 (${popularTitle.length}/${TITLE_MAX_LENGTH}): "${popularTitle}"`);
      }
    }
  }
  
  return {
    passed: issues.length === 0,
    message: issues.length === 0 
      ? '✅ Title 长度验证通过 (≤60 字符)' 
      : `⚠️ 部分 title 超过 60 字符 (${issues.length} 个)`,
    details: issues,
  };
}

/**
 * 验证 description 长度
 */
function validateDescriptionLength(): ValidationResult {
  const issues: string[] = [];
  
  for (const locale of LOCALES) {
    const filePath = path.join(process.cwd(), 'src', 'messages', `${locale}.json`);
    
    if (!fs.existsSync(filePath)) continue;
    
    const content = fs.readFileSync(filePath, 'utf-8');
    const translations: TranslationFile = JSON.parse(content);
    
    // 获取该语言的阈值
    const threshold = DESCRIPTION_THRESHOLDS[locale] || { min: 120, max: 160 };
    
    if (translations.ranking_seo) {
      const newestDesc = translations.ranking_seo.newest?.seo_description;
      const popularDesc = translations.ranking_seo.popular?.seo_description;
      
      if (newestDesc) {
        if (newestDesc.length < threshold.min) {
          issues.push(`${locale}:newest description 过短 (${newestDesc.length}/${threshold.min})`);
        } else if (newestDesc.length > threshold.max) {
          issues.push(`${locale}:newest description 过长 (${newestDesc.length}/${threshold.max})`);
        }
      }
      
      if (popularDesc) {
        if (popularDesc.length < threshold.min) {
          issues.push(`${locale}:popular description 过短 (${popularDesc.length}/${threshold.min})`);
        } else if (popularDesc.length > threshold.max) {
          issues.push(`${locale}:popular description 过长 (${popularDesc.length}/${threshold.max})`);
        }
      }
    }
  }
  
  return {
    passed: issues.length === 0,
    message: issues.length === 0 
      ? '✅ Description 长度验证通过 (按语言阈值)' 
      : `⚠️ 部分 description 长度不符合要求 (${issues.length} 个)`,
    details: issues,
  };
}

/**
 * 验证 llms.txt 文件存在
 */
function validateLlmsTxt(): ValidationResult {
  const llmsPath = path.join(process.cwd(), 'public', 'llms.txt');
  
  if (!fs.existsSync(llmsPath)) {
    return {
      passed: false,
      message: '❌ llms.txt 文件不存在',
      details: ['请创建 public/llms.txt 文件'],
    };
  }
  
  const content = fs.readFileSync(llmsPath, 'utf-8');
  const issues: string[] = [];
  
  // 检查基本内容
  if (!content.includes('U2Tool')) {
    issues.push('缺少网站名称 (U2Tool)');
  }
  if (!content.includes('https://www.u2tool.com')) {
    issues.push('缺少网站 URL');
  }
  if (!content.includes('## About') && !content.includes('# About')) {
    issues.push('缺少 About 部分');
  }
  
  return {
    passed: issues.length === 0,
    message: issues.length === 0 
      ? '✅ llms.txt 文件验证通过' 
      : `⚠️ llms.txt 内容不完整 (${issues.length} 个问题)`,
    details: issues,
  };
}

/**
 * 验证 robots.ts 配置
 */
function validateRobotsTxt(): ValidationResult {
  const robotsPath = path.join(process.cwd(), 'src', 'app', 'robots.ts');
  
  if (!fs.existsSync(robotsPath)) {
    return {
      passed: false,
      message: '❌ robots.ts 文件不存在',
    };
  }
  
  const content = fs.readFileSync(robotsPath, 'utf-8');
  const issues: string[] = [];
  
  // 检查是否禁止 /_next/ 路径
  if (!content.includes("'/_next/'") && !content.includes('"/_next/"')) {
    issues.push('未禁止 /_next/ 路径');
  }
  
  // 检查是否有特定的 chunk 文件引用
  if (content.includes('.js') && content.includes('chunk')) {
    issues.push('包含特定的 chunk 文件引用（应使用通配符）');
  }
  
  // 检查 sitemap 配置
  if (!content.includes('sitemap')) {
    issues.push('缺少 sitemap 配置');
  }
  
  return {
    passed: issues.length === 0,
    message: issues.length === 0 
      ? '✅ robots.ts 配置验证通过' 
      : `⚠️ robots.ts 配置有问题 (${issues.length} 个)`,
    details: issues,
  };
}

/**
 * 主函数
 */
function main(): void {
  console.log('🔍 Semrush SEO 问题验证\n');
  console.log('='.repeat(60));
  
  const results: ValidationResult[] = [
    validateRankingSeoTranslations(),
    validateMetaDescriptionUniqueness(),
    validateTitleLength(),
    validateDescriptionLength(),
    validateLlmsTxt(),
    validateRobotsTxt(),
  ];
  
  let passedCount = 0;
  
  for (const result of results) {
    console.log(`\n${result.message}`);
    if (result.details && result.details.length > 0) {
      for (const detail of result.details.slice(0, 10)) {
        console.log(`   - ${detail}`);
      }
      if (result.details.length > 10) {
        console.log(`   ... 还有 ${result.details.length - 10} 个问题`);
      }
    }
    if (result.passed) passedCount++;
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(`\n📊 验证结果: ${passedCount}/${results.length} 通过`);
  
  if (passedCount === results.length) {
    console.log('\n✨ 所有 Semrush SEO 问题已修复！');
  } else {
    console.log('\n⚠️ 仍有部分问题需要修复');
    process.exit(1);
  }
}

main();
