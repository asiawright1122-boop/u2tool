/**
 * 审查翻译完整性，找出缺失或不完整的翻译
 */

import * as fs from 'fs';
import * as path from 'path';

const MESSAGES_DIR = path.join(process.cwd(), 'src', 'messages');
const LOCALES = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];
const REQUIRED_FIELDS = ['name', 'description', 'seo_title', 'seo_description'];

interface ToolTranslation {
  name?: string;
  description?: string;
  seo_title?: string;
  seo_description?: string;
  [key: string]: unknown;
}

interface AuditResult {
  slug: string;
  missingLocales: string[];
  incompleteLocales: { locale: string; missingFields: string[] }[];
}

function readJsonFile(filePath: string): Record<string, unknown> {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function auditTranslations(): AuditResult[] {
  const results: AuditResult[] = [];
  
  // 获取英文翻译作为基准
  const enData = readJsonFile(path.join(MESSAGES_DIR, 'en.json')) as { tools: Record<string, ToolTranslation> };
  const toolSlugs = Object.keys(enData.tools).filter(key => {
    const val = enData.tools[key];
    return typeof val === 'object' && val.name;
  });

  console.log(`📊 审查 ${toolSlugs.length} 个工具的翻译完整性...\n`);

  // 加载所有语言文件
  const localeData: Record<string, { tools: Record<string, ToolTranslation> }> = {};
  for (const locale of LOCALES) {
    localeData[locale] = readJsonFile(path.join(MESSAGES_DIR, `${locale}.json`)) as { tools: Record<string, ToolTranslation> };
  }

  // 检查每个工具
  for (const slug of toolSlugs) {
    const missingLocales: string[] = [];
    const incompleteLocales: { locale: string; missingFields: string[] }[] = [];

    for (const locale of LOCALES) {
      if (locale === 'en') continue; // 跳过英文

      const tool = localeData[locale].tools?.[slug];
      
      if (!tool) {
        missingLocales.push(locale);
        continue;
      }

      // 检查必需字段
      const missingFields: string[] = [];
      for (const field of REQUIRED_FIELDS) {
        if (!tool[field] || (typeof tool[field] === 'string' && tool[field].trim() === '')) {
          missingFields.push(field);
        }
      }

      // 检查是否是英文（未翻译）
      const enTool = enData.tools[slug];
      if (tool.seo_title === enTool.seo_title || tool.seo_description === enTool.seo_description) {
        if (!missingFields.includes('seo_title') && tool.seo_title === enTool.seo_title) {
          missingFields.push('seo_title (未翻译)');
        }
        if (!missingFields.includes('seo_description') && tool.seo_description === enTool.seo_description) {
          missingFields.push('seo_description (未翻译)');
        }
      }

      if (missingFields.length > 0) {
        incompleteLocales.push({ locale, missingFields });
      }
    }

    if (missingLocales.length > 0 || incompleteLocales.length > 0) {
      results.push({ slug, missingLocales, incompleteLocales });
    }
  }

  return results;
}

function main(): void {
  const results = auditTranslations();

  if (results.length === 0) {
    console.log('✅ 所有工具的翻译都完整！');
    return;
  }

  console.log(`⚠️ 发现 ${results.length} 个工具有翻译问题:\n`);

  // 按问题严重程度排序
  results.sort((a, b) => {
    const aScore = a.missingLocales.length * 10 + a.incompleteLocales.length;
    const bScore = b.missingLocales.length * 10 + b.incompleteLocales.length;
    return bScore - aScore;
  });

  // 输出需要重新翻译的工具列表
  const toolsToRetranslate: string[] = [];

  for (const result of results) {
    console.log(`📦 ${result.slug}`);
    if (result.missingLocales.length > 0) {
      console.log(`   缺失语言: ${result.missingLocales.join(', ')}`);
    }
    if (result.incompleteLocales.length > 0) {
      for (const { locale, missingFields } of result.incompleteLocales) {
        console.log(`   ${locale}: 缺少 ${missingFields.join(', ')}`);
      }
    }
    console.log('');
    toolsToRetranslate.push(result.slug);
  }

  // 输出可用于重新翻译的命令
  console.log('\n📋 需要重新翻译的工具列表:');
  console.log(toolsToRetranslate.join('\n'));

  // 保存到文件
  fs.writeFileSync('logs/tools-to-retranslate.txt', toolsToRetranslate.join('\n'), 'utf-8');
  console.log('\n✅ 已保存到 logs/tools-to-retranslate.txt');
}

main();
