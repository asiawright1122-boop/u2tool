/**
 * AI 批量翻译工具脚本
 * 自动检测缺少翻译的工具并批量翻译
 * 
 * 使用方法:
 *   npx tsx scripts/ai-translate-batch.ts [--dry-run] [--limit=N]
 * 
 * 参数:
 *   --dry-run  只检测，不实际翻译
 *   --limit=N  限制翻译数量
 * 
 * 环境变量:
 *   SILICONFLOW_API_KEY - SiliconFlow API 密钥
 */

import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// 加载环境变量
dotenv.config({ path: '.env.local' });

const CONFIG = {
  apiUrl: 'https://api.siliconflow.cn/v1/chat/completions',
  model: 'Qwen/Qwen2.5-7B-Instruct',
  messagesDir: path.join(process.cwd(), 'src', 'messages'),
};

const ALL_LOCALES = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];
const TARGET_LOCALES = ALL_LOCALES.filter(l => l !== 'en');

const LOCALE_NAMES: Record<string, string> = {
  zh: 'Simplified Chinese',
  ja: 'Japanese',
  ko: 'Korean',
  es: 'Spanish',
  pt: 'Portuguese',
  fr: 'French',
  de: 'German',
  ru: 'Russian',
  ar: 'Arabic',
};

// 各语言的本土化 SEO 关键词提示
const LOCALE_SEO_HINTS: Record<string, string> = {
  zh: '使用"在线"、"免费"、"工具"等中国用户常用搜索词',
  ja: '「無料」「オンライン」「ツール」などの日本語キーワードを使用',
  ko: '"무료", "온라인", "도구" 등 한국어 키워드 사용',
  es: 'Usar "gratis", "online", "herramienta" como palabras clave',
  pt: 'Usar "grátis", "online", "ferramenta" como palavras-chave',
  fr: 'Utiliser "gratuit", "en ligne", "outil" comme mots-clés',
  de: '"Kostenlos", "online", "Tool" als Schlüsselwörter verwenden',
  ru: 'Использовать "бесплатно", "онлайн", "инструмент" как ключевые слова',
  ar: 'استخدام "مجاني"، "أونلاين"، "أداة" ككلمات مفتاحية',
};

interface ToolTranslation {
  name?: string;
  description?: string;
  seo_title?: string;
  seo_description?: string;
  [key: string]: unknown;
}

interface MissingTranslation {
  toolSlug: string;
  missingLocales: string[];
  missingFields: Record<string, string[]>;
}

function readJsonFile(filePath: string): Record<string, unknown> {
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
}

function writeJsonFile(filePath: string, data: Record<string, unknown>): void {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
}

/**
 * 检测缺少翻译的工具
 */
function detectMissingTranslations(): MissingTranslation[] {
  const enPath = path.join(CONFIG.messagesDir, 'en.json');
  const enData = readJsonFile(enPath) as { tools?: Record<string, ToolTranslation> };
  
  if (!enData.tools) {
    console.error('❌ en.json 中没有 tools 对象');
    return [];
  }

  const requiredFields = ['name', 'description', 'seo_title', 'seo_description'];
  const missing: MissingTranslation[] = [];

  // 遍历所有英文工具
  for (const [toolSlug, enTool] of Object.entries(enData.tools)) {
    // 跳过非工具对象（如 UI 翻译键）
    if (!enTool.name || !enTool.description) continue;

    const missingLocales: string[] = [];
    const missingFields: Record<string, string[]> = {};

    for (const locale of TARGET_LOCALES) {
      const localePath = path.join(CONFIG.messagesDir, `${locale}.json`);
      const localeData = readJsonFile(localePath) as { tools?: Record<string, ToolTranslation> };
      const localeTool = localeData.tools?.[toolSlug];

      if (!localeTool) {
        missingLocales.push(locale);
        missingFields[locale] = requiredFields;
      } else {
        const missing = requiredFields.filter(f => !localeTool[f]);
        if (missing.length > 0) {
          missingFields[locale] = missing;
        }
      }
    }

    if (missingLocales.length > 0 || Object.keys(missingFields).length > 0) {
      missing.push({ toolSlug, missingLocales, missingFields });
    }
  }

  return missing;
}

/**
 * 调用 AI 翻译
 */
async function translateWithAI(
  content: ToolTranslation,
  targetLocale: string
): Promise<ToolTranslation | null> {
  const apiKey = process.env.SILICONFLOW_API_KEY;
  
  if (!apiKey) {
    throw new Error('SILICONFLOW_API_KEY 未设置');
  }

  const seoHint = LOCALE_SEO_HINTS[targetLocale] || '';

  const systemPrompt = `You are an expert localization specialist for ${LOCALE_NAMES[targetLocale]}.
Translate the JSON for a free online tools website with SEO optimization.

Requirements:
1. Native-level natural translation (not literal)
2. SEO-optimized: ${seoHint}
3. Keep JSON structure, only translate values
4. Return ONLY valid JSON, no markdown`;

  try {
    const response = await fetch(CONFIG.apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: CONFIG.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: JSON.stringify(content, null, 2) },
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      console.error(`API 错误: ${response.status}`);
      return null;
    }

    const data = await response.json();
    let text = data.choices?.[0]?.message?.content?.trim() || '';
    
    // 清理 markdown 代码块
    if (text.startsWith('```')) {
      text = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }

    try {
      return JSON.parse(text);
    } catch {
      // 尝试提取 JSON 对象
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('Invalid JSON response');
    }
  } catch (error) {
    console.error(`翻译错误:`, error);
    return null;
  }
}

/**
 * 主函数
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const limitArg = args.find(a => a.startsWith('--limit='));
  const limit = limitArg ? parseInt(limitArg.split('=')[1]) : Infinity;

  console.log('🔍 检测缺少翻译的工具...\n');

  const missing = detectMissingTranslations();

  if (missing.length === 0) {
    console.log('✅ 所有工具翻译完整！');
    return;
  }

  console.log(`📋 发现 ${missing.length} 个工具需要翻译:\n`);

  for (const item of missing.slice(0, 10)) {
    console.log(`   - ${item.toolSlug}`);
    if (item.missingLocales.length > 0) {
      console.log(`     完全缺失: ${item.missingLocales.join(', ')}`);
    }
    const partialMissing = Object.entries(item.missingFields)
      .filter(([locale]) => !item.missingLocales.includes(locale));
    if (partialMissing.length > 0) {
      console.log(`     部分缺失: ${partialMissing.map(([l]) => l).join(', ')}`);
    }
  }

  if (missing.length > 10) {
    console.log(`   ... 还有 ${missing.length - 10} 个工具`);
  }

  if (dryRun) {
    console.log('\n🔍 Dry run 模式，不执行翻译');
    return;
  }

  if (!process.env.SILICONFLOW_API_KEY) {
    console.error('\n❌ 请设置 SILICONFLOW_API_KEY 环境变量');
    console.error('   获取地址: https://cloud.siliconflow.cn/');
    return;
  }

  console.log(`\n🚀 开始翻译 (限制: ${limit === Infinity ? '无' : limit})...\n`);

  const enPath = path.join(CONFIG.messagesDir, 'en.json');
  const enData = readJsonFile(enPath) as { tools: Record<string, ToolTranslation> };

  let translated = 0;
  let failed = 0;

  for (const item of missing.slice(0, limit)) {
    const enTool = enData.tools[item.toolSlug];
    console.log(`\n📝 翻译: ${item.toolSlug}`);

    for (const locale of TARGET_LOCALES) {
      if (!item.missingLocales.includes(locale) && !item.missingFields[locale]) {
        continue;
      }

      process.stdout.write(`   ${locale}... `);
      
      const result = await translateWithAI(enTool, locale);
      
      if (result) {
        const localePath = path.join(CONFIG.messagesDir, `${locale}.json`);
        const localeData = readJsonFile(localePath) as { tools: Record<string, unknown> };
        
        if (!localeData.tools) localeData.tools = {};
        const existing = (localeData.tools[item.toolSlug] || {}) as Record<string, unknown>;
        localeData.tools[item.toolSlug] = { ...existing, ...result };
        
        writeJsonFile(localePath, localeData);
        console.log('✅');
        translated++;
      } else {
        console.log('❌');
        failed++;
      }

      // 延迟避免限流
      await new Promise(r => setTimeout(r, 300));
    }
  }

  console.log('\n📊 完成:');
  console.log(`   成功: ${translated}`);
  console.log(`   失败: ${failed}`);

  if (translated > 0) {
    console.log('\n📋 后续步骤:');
    console.log('   npx tsx scripts/split-translations.ts');
    console.log('   npm run test -- --run src/messages/translations.test.ts');
  }
}

main().catch(console.error);
