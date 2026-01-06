/**
 * 分类 SEO 元数据验证脚本
 * 检查所有分类页面和工具列表页面的 SEO 元数据是否存在且唯一
 * 
 * 运行方式: npx tsx scripts/validate-category-seo.ts
 */

import fs from 'fs';
import path from 'path';

const SUPPORTED_LOCALES = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];
const CATEGORY_IDS = ['text', 'encoding', 'generators', 'converters', 'development', 'security', 'network', 'image', 'math', 'charts', 'office'];

interface ValidationResult {
  locale: string;
  categoryId: string;
  hasTitle: boolean;
  hasDescription: boolean;
  titleLength: number;
  descriptionLength: number;
}

interface DuplicateCheck {
  value: string;
  locations: string[];
}

function loadTranslations(locale: string): Record<string, unknown> {
  const filePath = path.join(process.cwd(), 'src', 'messages', `${locale}.json`);
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
}

function getNestedValue(obj: Record<string, unknown>, keyPath: string): string | undefined {
  const keys = keyPath.split('.');
  let current: unknown = obj;
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }
  return typeof current === 'string' ? current : undefined;
}

function validateCategorySEO(): void {
  console.log('🔍 分类 SEO 元数据验证\n');
  console.log('='.repeat(60));
  
  const results: ValidationResult[] = [];
  const allTitles: DuplicateCheck[] = [];
  const allDescriptions: DuplicateCheck[] = [];
  let hasErrors = false;

  // 检查每个语言的每个分类
  for (const locale of SUPPORTED_LOCALES) {
    const translations = loadTranslations(locale);
    
    // 检查分类 SEO
    for (const categoryId of CATEGORY_IDS) {
      const title = getNestedValue(translations, `categories_seo.${categoryId}.seo_title`);
      const desc = getNestedValue(translations, `categories_seo.${categoryId}.seo_description`);
      
      results.push({
        locale,
        categoryId,
        hasTitle: !!title,
        hasDescription: !!desc,
        titleLength: title?.length || 0,
        descriptionLength: desc?.length || 0,
      });

      if (title) {
        const existing = allTitles.find(t => t.value === title);
        if (existing) {
          existing.locations.push(`${locale}/${categoryId}`);
        } else {
          allTitles.push({ value: title, locations: [`${locale}/${categoryId}`] });
        }
      }

      if (desc) {
        const existing = allDescriptions.find(d => d.value === desc);
        if (existing) {
          existing.locations.push(`${locale}/${categoryId}`);
        } else {
          allDescriptions.push({ value: desc, locations: [`${locale}/${categoryId}`] });
        }
      }
    }

    // 检查工具列表页面 SEO
    const toolsTitle = getNestedValue(translations, 'pages.tools.seo_title');
    const toolsDesc = getNestedValue(translations, 'pages.tools.seo_description');
    
    results.push({
      locale,
      categoryId: 'tools-page',
      hasTitle: !!toolsTitle,
      hasDescription: !!toolsDesc,
      titleLength: toolsTitle?.length || 0,
      descriptionLength: toolsDesc?.length || 0,
    });

    if (toolsTitle) {
      const existing = allTitles.find(t => t.value === toolsTitle);
      if (existing) {
        existing.locations.push(`${locale}/tools-page`);
      } else {
        allTitles.push({ value: toolsTitle, locations: [`${locale}/tools-page`] });
      }
    }

    if (toolsDesc) {
      const existing = allDescriptions.find(d => d.value === toolsDesc);
      if (existing) {
        existing.locations.push(`${locale}/tools-page`);
      } else {
        allDescriptions.push({ value: toolsDesc, locations: [`${locale}/tools-page`] });
      }
    }
  }

  // 输出缺失检查结果
  console.log('\n📋 完整性检查\n');
  
  const missing = results.filter(r => !r.hasTitle || !r.hasDescription);
  if (missing.length > 0) {
    hasErrors = true;
    console.log('❌ 缺失的 SEO 元数据:');
    for (const m of missing) {
      if (!m.hasTitle) {
        console.log(`   - ${m.locale}/${m.categoryId}: 缺少 seo_title`);
      }
      if (!m.hasDescription) {
        console.log(`   - ${m.locale}/${m.categoryId}: 缺少 seo_description`);
      }
    }
  } else {
    console.log('✅ 所有语言的所有分类都有完整的 SEO 元数据');
  }

  // 输出重复检查结果
  console.log('\n📋 唯一性检查\n');
  
  const duplicateTitles = allTitles.filter(t => t.locations.length > 1);
  const duplicateDescs = allDescriptions.filter(d => d.locations.length > 1);

  if (duplicateTitles.length > 0) {
    hasErrors = true;
    console.log('❌ 重复的标题:');
    for (const dup of duplicateTitles) {
      console.log(`   - "${dup.value.substring(0, 50)}..." 出现在: ${dup.locations.join(', ')}`);
    }
  } else {
    console.log('✅ 所有标题都是唯一的');
  }

  if (duplicateDescs.length > 0) {
    hasErrors = true;
    console.log('\n❌ 重复的描述:');
    for (const dup of duplicateDescs) {
      console.log(`   - "${dup.value.substring(0, 50)}..." 出现在: ${dup.locations.join(', ')}`);
    }
  } else {
    console.log('✅ 所有描述都是唯一的');
  }

  // 输出统计信息
  console.log('\n📊 统计信息\n');
  console.log(`   语言数量: ${SUPPORTED_LOCALES.length}`);
  console.log(`   分类数量: ${CATEGORY_IDS.length}`);
  console.log(`   总页面数: ${SUPPORTED_LOCALES.length * (CATEGORY_IDS.length + 1)}`);
  console.log(`   唯一标题数: ${allTitles.length}`);
  console.log(`   唯一描述数: ${allDescriptions.length}`);

  // 输出长度统计
  console.log('\n📏 长度统计\n');
  const titleLengths = results.filter(r => r.titleLength > 0).map(r => r.titleLength);
  const descLengths = results.filter(r => r.descriptionLength > 0).map(r => r.descriptionLength);
  
  console.log(`   标题长度范围: ${Math.min(...titleLengths)} - ${Math.max(...titleLengths)} 字符`);
  console.log(`   描述长度范围: ${Math.min(...descLengths)} - ${Math.max(...descLengths)} 字符`);

  console.log('\n' + '='.repeat(60));
  
  if (hasErrors) {
    console.log('\n❌ 验证失败 - 请修复上述问题\n');
    process.exit(1);
  } else {
    console.log('\n✅ 验证通过 - 所有分类 SEO 元数据正确配置\n');
    process.exit(0);
  }
}

validateCategorySEO();
