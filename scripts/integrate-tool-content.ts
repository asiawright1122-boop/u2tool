#!/usr/bin/env npx ts-node

/**
 * 工具内容集成脚本
 * 将生成的内容集成到翻译文件中
 * 
 * 使用方法:
 *   npx ts-node scripts/integrate-tool-content.ts --locale=zh
 *   npx ts-node scripts/integrate-tool-content.ts --locale=en
 *   npx ts-node scripts/integrate-tool-content.ts --all
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

// 支持的语言
const LOCALES = ['zh', 'en', 'es', 'pt', 'ja', 'ru', 'fr', 'ar', 'de', 'ko'];

// 工具名称翻译映射（中文）
const toolNameTranslations: Record<string, string> = {
  'json-formatter': 'JSON 格式化器',
  'base64': 'Base64 编码解码',
  'url-encoder': 'URL 编码器',
  'uuid-generator': 'UUID 生成器',
  'password-generator': '密码生成器',
  'hash-generator': '哈希生成器',
  'qr-generator': '二维码生成器',
  'color-converter': '颜色转换器',
  'timestamp-converter': '时间戳转换器',
  'word-counter': '字数统计',
  // ... 更多翻译
};

// 读取生成的内容
function readToolContent(slug: string): any {
  const contentPath = path.join(__dirname, '../content/tools', `${slug}.json`);
  if (!fs.existsSync(contentPath)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(contentPath, 'utf-8'));
}

// 更新翻译文件
function updateTranslationFile(locale: string, dryRun: boolean = false): void {
  const messagesPath = path.join(__dirname, '../src/messages', `${locale}.json`);
  
  if (!fs.existsSync(messagesPath)) {
    console.error(`❌ 翻译文件不存在: ${messagesPath}`);
    return;
  }

  const messages = JSON.parse(fs.readFileSync(messagesPath, 'utf-8'));
  
  if (!messages.tools) {
    messages.tools = {};
  }

  // 读取所有生成的内容文件
  const contentDir = path.join(__dirname, '../content/tools');
  if (!fs.existsSync(contentDir)) {
    console.error(`❌ 内容目录不存在: ${contentDir}`);
    return;
  }

  const contentFiles = fs.readdirSync(contentDir).filter(f => f.endsWith('.json'));
  let updatedCount = 0;
  let skippedCount = 0;

  for (const file of contentFiles) {
    const slug = file.replace('.json', '');
    const content = readToolContent(slug);
    
    if (!content) {
      skippedCount++;
      continue;
    }

    // 初始化工具翻译对象
    if (!messages.tools[slug]) {
      messages.tools[slug] = {};
    }

    // 更新内容（仅中文，其他语言需要翻译）
    if (locale === 'zh') {
      // 保留现有的 name 和 description（如果存在），只添加新字段
      if (!messages.tools[slug].name) {
        messages.tools[slug].name = toolNameTranslations[slug] || content.name;
      }
      if (!messages.tools[slug].description) {
        messages.tools[slug].description = content.description;
      }
      
      // 添加详细描述（新字段）
      messages.tools[slug].detailed_description = content.detailedDescription;
      
      // 更新 SEO 内容（如果不存在或需要更新）
      if (!messages.tools[slug].seo_title || messages.tools[slug].seo_title.includes('Free')) {
        messages.tools[slug].seo_title = content.seoTitle;
      }
      if (!messages.tools[slug].seo_description || messages.tools[slug].seo_description.length < 120) {
        messages.tools[slug].seo_description = content.seoDescription;
      }
      
      // 添加使用说明（新字段）
      messages.tools[slug].usage_steps = content.usage.steps;
      messages.tools[slug].usage_examples = content.usage.examples;
      
      // FAQ 已经通过 getToolFAQs 函数处理，这里可以添加额外的 FAQ
      if (content.faqs && content.faqs.length > 0) {
        messages.tools[slug].faqs = content.faqs;
      }
      
      updatedCount++;
    } else {
      // 其他语言暂时使用英文占位符，后续可以翻译
      if (!messages.tools[slug].name) {
        messages.tools[slug].name = content.name;
        messages.tools[slug].description = content.description;
        updatedCount++;
      } else {
        skippedCount++;
      }
    }
  }

  if (!dryRun) {
    // 保存更新后的翻译文件
    fs.writeFileSync(
      messagesPath,
      JSON.stringify(messages, null, 2),
      'utf-8'
    );
    console.log(`✅ 已更新: ${messagesPath}`);
  }

  console.log(`   - 更新: ${updatedCount} 个工具`);
  console.log(`   - 跳过: ${skippedCount} 个工具`);
}

// 主函数
function main() {
  const args = process.argv.slice(2);
  const localeArg = args.find(arg => arg.startsWith('--locale='));
  const allArg = args.includes('--all');
  const dryRun = args.includes('--dry-run');

  console.log('🚀 工具内容集成工具');
  console.log('═'.repeat(50));
  console.log(`模式: ${dryRun ? 'DRY RUN (测试)' : '实际更新'}`);
  console.log('');

  if (localeArg) {
    const locale = localeArg.split('=')[1];
    if (!LOCALES.includes(locale)) {
      console.error(`❌ 不支持的语言: ${locale}`);
      console.log(`支持的语言: ${LOCALES.join(', ')}`);
      process.exit(1);
    }
    console.log(`📝 更新语言: ${locale}`);
    updateTranslationFile(locale, dryRun);
  } else if (allArg) {
    console.log(`📝 更新所有语言: ${LOCALES.join(', ')}`);
    for (const locale of LOCALES) {
      console.log(`\n处理语言: ${locale}`);
      updateTranslationFile(locale, dryRun);
    }
  } else {
    console.log('使用方法:');
    console.log('  npx ts-node scripts/integrate-tool-content.ts --locale=zh');
    console.log('  npx ts-node scripts/integrate-tool-content.ts --locale=en');
    console.log('  npx ts-node scripts/integrate-tool-content.ts --all');
    console.log('  npx ts-node scripts/integrate-tool-content.ts --locale=zh --dry-run');
    process.exit(1);
  }

  console.log('');
  console.log('✨ 完成！');
  if (dryRun) {
    console.log('💡 这是测试模式，未实际更新文件。移除 --dry-run 参数以实际更新。');
  }
}

main();

