/**
 * AI 自动翻译工具脚本 - NVIDIA NIM API 版本
 * 使用 NVIDIA NIM API 将英文翻译自动翻译为其他 9 种语言
 * 
 * 使用方法:
 *   npx tsx scripts/ai-translate-nvidia.ts <tool-slug>
 * 
 * 环境变量:
 *   NVIDIA_API_KEY - NVIDIA NIM API 密钥
 * 
 * 示例:
 *   npx tsx scripts/ai-translate-nvidia.ts json-formatter
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

// 目标语言（除英文外）
const TARGET_LOCALES = ['zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];

// 语言名称映射
const LOCALE_NAMES: Record<string, string> = {
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

// 各语言的本土化 SEO 关键词提示
const LOCALE_SEO_HINTS: Record<string, string> = {
  zh: `- 使用中国用户常用的搜索词汇，如"在线"、"免费"、"工具"
- SEO标题控制在25-30个汉字，包含核心关键词
- 描述控制在70-80个汉字，突出"免费"、"在线"、"无需注册"等卖点`,
  ja: `- 日本語の自然な表現を使用
- SEOタイトルは30-35文字、説明は80-100文字程度
- 「無料」「オンライン」「登録不要」などのキーワードを含める`,
  ko: `- 한국어 사용자가 자주 검색하는 키워드 사용
- SEO 제목은 25-30자, 설명은 70-90자 정도
- "무료", "온라인", "가입 불필요" 등의 키워드 포함`,
  es: `- Usar términos de búsqueda populares en español
- Título SEO: 50-60 caracteres, descripción: 150-160 caracteres
- Incluir palabras clave como "gratis", "online", "sin registro"`,
  pt: `- Usar termos de busca populares em português
- Título SEO: 50-60 caracteres, descrição: 150-160 caracteres
- Incluir palavras-chave como "grátis", "online", "sem cadastro"`,
  fr: `- Utiliser des termes de recherche populaires en français
- Titre SEO: 50-60 caractères, description: 150-160 caractères
- Inclure des mots-clés comme "gratuit", "en ligne", "sans inscription"`,
  de: `- Deutsche Suchbegriffe verwenden
- SEO-Titel: 50-60 Zeichen, Beschreibung: 150-160 Zeichen
- Schlüsselwörter wie "kostenlos", "online", "ohne Anmeldung" einbeziehen`,
  ru: `- Использовать популярные поисковые запросы на русском
- SEO заголовок: 50-60 символов, описание: 150-160 символов
- Включить ключевые слова: "бесплатно", "онлайн", "без регистрации"`,
  ar: `- استخدام مصطلحات البحث الشائعة بالعربية
- عنوان SEO: 50-60 حرف، الوصف: 150-160 حرف
- تضمين كلمات مفتاحية مثل "مجاني"، "أونلاين"، "بدون تسجيل"`,
};

/**
 * 调用 NVIDIA NIM API 进行翻译
 */
async function translateWithNvidia(
  content: ToolTranslation,
  targetLocale: string
): Promise<ToolTranslation | null> {
  const apiKey = process.env.NVIDIA_API_KEY;
  
  if (!apiKey) {
    console.error('❌ 错误: 请设置 NVIDIA_API_KEY 环境变量');
    console.error('   获取地址: https://build.nvidia.com/');
    process.exit(1);
  }

  const localeName = LOCALE_NAMES[targetLocale];
  const seoHints = LOCALE_SEO_HINTS[targetLocale] || '';

  const systemPrompt = `You are an expert localization specialist and SEO copywriter. Your task is to translate JSON content from English to ${localeName} with SEO optimization.

## Requirements:
1. Write as a native speaker would naturally express it
2. Use idioms and terminology common in the target market
3. Optimize for search engines with relevant keywords
4. Highlight benefits: free, online, no registration

## Language-Specific Guidelines for ${localeName}:
${seoHints}

## Output Format:
- Return ONLY valid JSON
- Keep the exact same JSON structure and keys
- Only translate string values
- No markdown, no explanations`;

  const userPrompt = `Translate this online tool's content to ${localeName}. Return ONLY the JSON object:

${JSON.stringify(content, null, 2)}`;

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
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`❌ API 错误 (${targetLocale}):`, error);
      return null;
    }

    const data = await response.json();
    const translatedText = data.choices?.[0]?.message?.content;

    if (!translatedText) {
      console.error(`❌ 空响应 (${targetLocale})`);
      return null;
    }

    // 解析 JSON
    let jsonStr = translatedText.trim();
    if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }
    
    try {
      return JSON.parse(jsonStr) as ToolTranslation;
    } catch {
      const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        let extractedJson = jsonMatch[0];
        extractedJson = extractedJson.replace(/,(\s*[}\]])/g, '$1');
        try {
          return JSON.parse(extractedJson) as ToolTranslation;
        } catch {
          console.error(`❌ JSON 解析失败 (${targetLocale})`);
          return null;
        }
      }
      return null;
    }
  } catch (error) {
    console.error(`❌ 翻译失败 (${targetLocale}):`, error);
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

function getEnglishTranslation(toolSlug: string): ToolTranslation | null {
  const enPath = path.join(CONFIG.messagesDir, 'en.json');
  const enData = readJsonFile(enPath) as { tools?: Record<string, ToolTranslation> };
  
  if (!enData.tools?.[toolSlug]) {
    console.error(`❌ 工具 "${toolSlug}" 在 en.json 中不存在`);
    return null;
  }

  return enData.tools[toolSlug];
}

function updateLocaleFile(
  locale: string,
  toolSlug: string,
  translation: ToolTranslation
): void {
  const filePath = path.join(CONFIG.messagesDir, `${locale}.json`);
  const data = readJsonFile(filePath) as { tools?: Record<string, unknown> };
  
  if (!data.tools) {
    data.tools = {};
  }

  const existing = (data.tools[toolSlug] || {}) as Record<string, unknown>;
  data.tools[toolSlug] = { ...existing, ...translation };

  writeJsonFile(filePath, data);
}

async function main(): Promise<void> {
  const toolSlug = process.argv[2];

  if (!toolSlug) {
    console.log('使用方法: npx tsx scripts/ai-translate-nvidia.ts <tool-slug>');
    console.log('');
    console.log('环境变量:');
    console.log('  NVIDIA_API_KEY - NVIDIA NIM API 密钥');
    console.log('  NVIDIA_MODEL   - 模型名称 (默认: meta/llama-3.1-70b-instruct)');
    console.log('');
    console.log('获取 API Key: https://build.nvidia.com/');
    process.exit(1);
  }

  console.log(`🚀 开始翻译工具: ${toolSlug}`);
  console.log(`📦 使用模型: ${CONFIG.model}`);
  console.log('');

  const enTranslation = getEnglishTranslation(toolSlug);
  if (!enTranslation) {
    process.exit(1);
  }

  console.log('📝 英文原文:');
  console.log(`   名称: ${enTranslation.name}`);
  console.log(`   描述: ${enTranslation.description}`);
  console.log('');

  let successCount = 0;
  let failCount = 0;

  for (const locale of TARGET_LOCALES) {
    process.stdout.write(`🔄 翻译到 ${locale} (${LOCALE_NAMES[locale]})... `);
    
    const translated = await translateWithNvidia(enTranslation, locale);
    
    if (translated) {
      updateLocaleFile(locale, toolSlug, translated);
      console.log('✅');
      successCount++;
    } else {
      console.log('❌');
      failCount++;
    }

    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('');
  console.log('📊 翻译完成:');
  console.log(`   成功: ${successCount}/${TARGET_LOCALES.length}`);
  if (failCount > 0) {
    console.log(`   失败: ${failCount}/${TARGET_LOCALES.length}`);
  }

  if (successCount > 0) {
    console.log('');
    console.log('📋 后续步骤:');
    console.log('   1. 运行 npx tsx scripts/split-translations.ts 更新拆分文件');
    console.log('   2. 运行 npm run test -- --run src/messages/translations.test.ts 验证翻译');
  }
}

main().catch(console.error);
