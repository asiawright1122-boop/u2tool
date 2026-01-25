/**
 * AI 生成优化 SEO 内容脚本 - NVIDIA NIM API 版本
 * 为工具生成更丰富的 SEO 内容（seo_description 和 detailed_description）
 * 
 * 使用方法:
 *   npx tsx scripts/ai-generate-seo-content.ts <tool-slug>
 *   npx tsx scripts/ai-generate-seo-content.ts --batch53  # 批量处理 batch53 所有工具
 * 
 * 环境变量:
 *   NVIDIA_API_KEY - NVIDIA NIM API 密钥
 */

import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// 加载环境变量
dotenv.config({ path: '.env.local' });

// NVIDIA NIM API 配置
const CONFIG = {
  apiUrl: 'https://integrate.api.nvidia.com/v1/chat/completions',
  model: process.env.NVIDIA_MODEL || 'meta/llama-3.1-70b-instruct',
  messagesDir: path.join(process.cwd(), 'src', 'messages'),
};

// Batch 53 工具列表
const BATCH53_TOOLS = [
  'ai-text-humanizer', 'text-spinner', 'readability-checker', 'grammar-checker',
  'typescript-playground', 'python-formatter', 'go-formatter', 'rust-formatter', 'yaml-formatter',
  'text-shadow-generator', 'svg-pattern-generator', 'css-triangle-generator', 'aspect-ratio-box-generator',
  'screen-time-calculator', 'typing-time-calculator', 'download-time-calculator',
  'ical-parser', 'vcard-parser'
];

// 所有语言
const ALL_LOCALES = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];

// 语言名称映射
const LOCALE_NAMES: Record<string, string> = {
  en: 'English',
  zh: 'Simplified Chinese (简体中文)',
  ja: 'Japanese (日本語)',
  ko: 'Korean (한국어)',
  es: 'Spanish (Español)',
  pt: 'Portuguese (Português)',
  fr: 'French (Français)',
  de: 'German (Deutsch)',
  ru: 'Russian (Русский)',
  ar: 'Arabic (العربية)',
};

interface ToolTranslation {
  name: string;
  description: string;
  seo_title: string;
  seo_description: string;
  detailed_description?: string;
  usage_steps?: string[];
  usage_examples?: string[];
  [key: string]: unknown;
}

interface SEOContent {
  seo_description: string;
  detailed_description: string;
}

/**
 * 调用 NVIDIA NIM API 生成 SEO 内容
 */
async function generateSEOContent(
  toolName: string,
  toolDescription: string,
  toolSlug: string,
  locale: string
): Promise<SEOContent | null> {
  const apiKey = process.env.NVIDIA_API_KEY;
  
  if (!apiKey) {
    console.error('❌ 错误: 请设置 NVIDIA_API_KEY 环境变量');
    console.error('   获取地址: https://build.nvidia.com/');
    process.exit(1);
  }

  const localeName = LOCALE_NAMES[locale];
  
  // 根据语言设置不同的长度要求
  const lengthRequirements = locale === 'en' 
    ? {
        seoDescMin: 120,
        seoDescMax: 160,
        detailedMin: 150,
        detailedMax: 300,
      }
    : locale === 'zh' || locale === 'ja' || locale === 'ko'
    ? {
        seoDescMin: 60,
        seoDescMax: 100,
        detailedMin: 80,
        detailedMax: 200,
      }
    : {
        seoDescMin: 100,
        seoDescMax: 160,
        detailedMin: 120,
        detailedMax: 280,
      };

  const systemPrompt = `You are an expert SEO copywriter specializing in online developer tools. Your task is to write compelling, SEO-optimized content in ${localeName}.

## Requirements:
1. Write naturally as a native ${localeName} speaker
2. Focus on user benefits and practical value
3. Include relevant keywords naturally
4. Highlight: free, online, no registration required, instant results
5. Be specific about what the tool does and who it's for

## Content Guidelines:
- seo_description: ${lengthRequirements.seoDescMin}-${lengthRequirements.seoDescMax} characters
  - Must be compelling and include primary keywords
  - Should encourage clicks from search results
  - Mention key benefits (free, online, easy to use)

- detailed_description: ${lengthRequirements.detailedMin}-${lengthRequirements.detailedMax} characters
  - Explain what the tool does in detail
  - Mention target users (developers, designers, content creators, etc.)
  - Highlight unique features and benefits
  - Include use cases

## Output Format:
Return ONLY a valid JSON object with exactly these two keys:
{
  "seo_description": "...",
  "detailed_description": "..."
}

No markdown, no explanations, just the JSON.`;

  const userPrompt = `Generate SEO content in ${localeName} for this online tool:

Tool Name: ${toolName}
Tool Slug: ${toolSlug}
Brief Description: ${toolDescription}

Remember:
- seo_description: ${lengthRequirements.seoDescMin}-${lengthRequirements.seoDescMax} characters
- detailed_description: ${lengthRequirements.detailedMin}-${lengthRequirements.detailedMax} characters

Return ONLY the JSON object.`;

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
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`❌ API 错误 (${locale}):`, error);
      return null;
    }

    const data = await response.json();
    const generatedText = data.choices?.[0]?.message?.content;

    if (!generatedText) {
      console.error(`❌ 空响应 (${locale})`);
      return null;
    }

    // 解析 JSON
    let jsonStr = generatedText.trim();
    if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }
    
    try {
      const parsed = JSON.parse(jsonStr) as SEOContent;
      
      // 验证内容长度
      if (!parsed.seo_description || !parsed.detailed_description) {
        console.error(`❌ 缺少必要字段 (${locale})`);
        return null;
      }
      
      return parsed;
    } catch {
      const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        let extractedJson = jsonMatch[0];
        extractedJson = extractedJson.replace(/,(\s*[}\]])/g, '$1');
        try {
          return JSON.parse(extractedJson) as SEOContent;
        } catch {
          console.error(`❌ JSON 解析失败 (${locale})`);
          return null;
        }
      }
      return null;
    }
  } catch (error) {
    console.error(`❌ 生成失败 (${locale}):`, error);
    return null;
  }
}

function readJsonFile(filePath: string): Record<string, unknown> {
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
}

function writeJsonFile(filePath: string, data: Record<string, unknown>): void {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
}

function getToolTranslation(toolSlug: string, locale: string): ToolTranslation | null {
  const filePath = path.join(CONFIG.messagesDir, `${locale}.json`);
  const data = readJsonFile(filePath) as { tools?: Record<string, ToolTranslation> };
  
  if (!data.tools?.[toolSlug]) {
    return null;
  }

  return data.tools[toolSlug];
}

function updateLocaleFile(
  locale: string,
  toolSlug: string,
  seoContent: SEOContent
): void {
  const filePath = path.join(CONFIG.messagesDir, `${locale}.json`);
  const data = readJsonFile(filePath) as { tools?: Record<string, unknown> };
  
  if (!data.tools) {
    data.tools = {};
  }

  const existing = (data.tools[toolSlug] || {}) as Record<string, unknown>;
  data.tools[toolSlug] = { 
    ...existing, 
    seo_description: seoContent.seo_description,
    detailed_description: seoContent.detailed_description,
  };

  writeJsonFile(filePath, data);
}

/**
 * 检查工具是否需要 SEO 优化
 */
function needsSEOOptimization(tool: ToolTranslation, locale: string): boolean {
  const minSeoDesc = locale === 'en' ? 100 : (locale === 'zh' || locale === 'ja' || locale === 'ko') ? 50 : 80;
  const minDetailed = locale === 'en' ? 120 : (locale === 'zh' || locale === 'ja' || locale === 'ko') ? 60 : 100;
  
  const seoDescLen = tool.seo_description?.length || 0;
  const detailedLen = tool.detailed_description?.length || 0;
  
  return seoDescLen < minSeoDesc || detailedLen < minDetailed;
}

async function processToolForLocale(toolSlug: string, locale: string): Promise<boolean> {
  const tool = getToolTranslation(toolSlug, locale);
  
  if (!tool) {
    console.log(`   ⚠️ ${locale}: 工具不存在`);
    return false;
  }
  
  if (!needsSEOOptimization(tool, locale)) {
    console.log(`   ✅ ${locale}: SEO 内容已足够`);
    return true;
  }
  
  process.stdout.write(`   🔄 ${locale}: 生成中... `);
  
  const seoContent = await generateSEOContent(
    tool.name,
    tool.description,
    toolSlug,
    locale
  );
  
  if (seoContent) {
    updateLocaleFile(locale, toolSlug, seoContent);
    console.log(`✅ (seo: ${seoContent.seo_description.length}字, detailed: ${seoContent.detailed_description.length}字)`);
    return true;
  } else {
    console.log('❌');
    return false;
  }
}

async function processTool(toolSlug: string): Promise<void> {
  console.log(`\n📝 处理工具: ${toolSlug}`);
  
  let successCount = 0;
  let failCount = 0;
  
  for (const locale of ALL_LOCALES) {
    const success = await processToolForLocale(toolSlug, locale);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
    
    // 避免 API 限流 - 增加延迟到 2 秒
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log(`   📊 完成: ${successCount}/${ALL_LOCALES.length} 成功`);
}

async function main(): Promise<void> {
  const arg = process.argv[2];

  if (!arg) {
    console.log('使用方法:');
    console.log('  npx tsx scripts/ai-generate-seo-content.ts <tool-slug>');
    console.log('  npx tsx scripts/ai-generate-seo-content.ts --batch53');
    console.log('');
    console.log('环境变量:');
    console.log('  NVIDIA_API_KEY - NVIDIA NIM API 密钥');
    console.log('  NVIDIA_MODEL   - 模型名称 (默认: meta/llama-3.1-70b-instruct)');
    console.log('');
    console.log('获取 API Key: https://build.nvidia.com/');
    process.exit(1);
  }

  console.log(`🚀 AI SEO 内容生成器`);
  console.log(`📦 使用模型: ${CONFIG.model}`);

  if (arg === '--batch53') {
    console.log(`\n📋 批量处理 Batch 53 工具 (${BATCH53_TOOLS.length} 个)`);
    
    for (const toolSlug of BATCH53_TOOLS) {
      await processTool(toolSlug);
    }
    
    console.log('\n✅ 批量处理完成!');
  } else {
    await processTool(arg);
  }

  console.log('\n📋 后续步骤:');
  console.log('   1. 运行 npx tsx scripts/split-translations.ts 更新拆分文件');
  console.log('   2. 运行 npm run test -- --run src/messages/translations.test.ts 验证翻译');
}

main().catch(console.error);
