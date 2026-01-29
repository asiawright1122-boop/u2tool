/**
 * 继续批量翻译 Batch 54 的工具（从指定位置开始）
 * 
 * 使用方法:
 *   npx tsx scripts/batch-translate-batch54-continue.ts [start_index]
 * 
 * 示例:
 *   npx tsx scripts/batch-translate-batch54-continue.ts 10  # 从第10个工具开始
 */

import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// Batch 54 的 57 个工具 slug
const BATCH54_TOOLS = [
  // API & Network (8)
  'curl-to-code-generator',
  'http-status-code-reference',
  'jwt-payload-decoder',
  'base64-image-converter',
  'url-query-string-parser',
  'request-header-builder',
  'webhook-tester',
  'api-response-formatter',
  
  // Code Conversion (8)
  'sql-to-mongodb-converter',
  'json-to-protobuf-converter',
  'regex-to-code-generator',
  'swagger-to-code-generator',
  'database-migration-generator',
  'environment-variables-generator',
  'docker-compose-generator-advanced',
  'kubernetes-manifest-generator',
  
  // Code Analysis (7)
  'code-complexity-analyzer',
  'dependency-vulnerability-checker',
  'performance-profiler',
  'memory-leak-detector',
  'code-duplication-finder',
  'unused-imports-finder',
  'dead-code-analyzer',
  
  // Database (6)
  'sql-query-optimizer',
  'database-schema-visualizer',
  'sql-injection-tester',
  'database-connection-tester',
  'query-execution-planner',
  'database-backup-scheduler',
  
  // Version Control (6)
  'git-commit-message-generator',
  'git-branch-naming-validator',
  'merge-conflict-resolver',
  'git-history-visualizer',
  'changelog-generator-advanced',
  'git-tag-manager',
  
  // Document Management (6)
  'markdown-to-html-converter',
  'document-outline-generator',
  'table-of-contents-generator',
  'document-word-counter',
  'document-formatter',
  'citation-formatter',
  
  // Project Management (6)
  'project-estimation-calculator',
  'sprint-velocity-calculator',
  'resource-allocation-planner',
  'project-risk-analyzer',
  'milestone-tracker',
  'team-capacity-planner',
  
  // Meetings & Schedule (5)
  'meeting-minutes-generator',
  'timezone-meeting-scheduler',
  'meeting-agenda-builder',
  'calendar-availability-finder',
  'meeting-room-finder',
  
  // Finance & Budget (5)
  'invoice-template-generator',
  'expense-report-generator',
  'budget-variance-analyzer',
  'cost-benefit-analyzer',
  'financial-forecast-calculator',
];

const CONFIG = {
  apiUrl: 'https://api.siliconflow.cn/v1/chat/completions',
  messagesDir: path.join(process.cwd(), 'src', 'messages'),
  model: 'THUDM/glm-4-9b-chat',
};

const TARGET_LOCALES = ['zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];

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

async function translateWithAI(
  content: ToolTranslation,
  targetLocale: string
): Promise<ToolTranslation | null> {
  const apiKey = process.env.SILICONFLOW_API_KEY;
  if (!apiKey) {
    console.error('❌ 错误: 请设置 SILICONFLOW_API_KEY 环境变量');
    process.exit(1);
  }

  const localeName = LOCALE_NAMES[targetLocale];
  const seoHints = LOCALE_SEO_HINTS[targetLocale] || '';
  
  const systemPrompt = `你是一位资深的多语言本土化专家和 SEO 文案大师，精通 ${localeName} 的语言文化和搜索引擎优化。

将英文工具介绍翻译为 ${localeName}，实现真正的本土化（非直译），并针对当地搜索引擎进行 SEO 优化。

翻译要求：
1. 母语级表达，避免翻译腔
2. SEO 标题包含核心关键词，突出"免费"、"在线"
3. 描述突出核心卖点：免费、在线、无需注册

${localeName} 特定优化：
${seoHints}

输出格式：只返回 JSON 对象，保持相同结构和键名，只翻译字符串值。`;

  const userPrompt = `翻译为 ${localeName}，只返回 JSON：

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
      return null;
    }

    const data = await response.json();
    const translatedText = data.choices?.[0]?.message?.content;

    if (!translatedText) return null;

    let jsonStr = translatedText.trim();
    if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }
    
    try {
      return JSON.parse(jsonStr) as ToolTranslation;
    } catch {
      const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        let extractedJson = jsonMatch[0].replace(/,(\s*[}\]])/g, '$1');
        try {
          return JSON.parse(extractedJson) as ToolTranslation;
        } catch {
          return null;
        }
      }
      return null;
    }
  } catch {
    return null;
  }
}

function readJsonFile(filePath: string): Record<string, unknown> {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function writeJsonFile(filePath: string, data: Record<string, unknown>): void {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
}

function getEnglishTranslation(toolSlug: string): ToolTranslation | null {
  const enPath = path.join(CONFIG.messagesDir, 'en.json');
  const enData = readJsonFile(enPath) as { tools?: Record<string, ToolTranslation> };
  return enData.tools?.[toolSlug] || null;
}

function updateLocaleFile(locale: string, toolSlug: string, translation: ToolTranslation): void {
  const filePath = path.join(CONFIG.messagesDir, `${locale}.json`);
  const data = readJsonFile(filePath) as { tools?: Record<string, unknown> };
  if (!data.tools) data.tools = {};
  const existing = (data.tools[toolSlug] || {}) as Record<string, unknown>;
  data.tools[toolSlug] = { ...existing, ...translation };
  writeJsonFile(filePath, data);
}

async function translateTool(toolSlug: string): Promise<{ success: number; failed: number }> {
  const enTranslation = getEnglishTranslation(toolSlug);
  if (!enTranslation) {
    console.error(`  ❌ 工具 "${toolSlug}" 在 en.json 中不存在`);
    return { success: 0, failed: TARGET_LOCALES.length };
  }

  let success = 0;
  let failed = 0;

  for (const locale of TARGET_LOCALES) {
    process.stdout.write(`    ${locale}... `);
    const translated = await translateWithAI(enTranslation, locale);
    if (translated) {
      updateLocaleFile(locale, toolSlug, translated);
      console.log('✅');
      success++;
    } else {
      console.log('❌');
      failed++;
    }
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  return { success, failed };
}

async function main(): Promise<void> {
  const startIndex = parseInt(process.argv[2] || '0', 10);
  
  console.log(`🚀 继续翻译 Batch 54 工具 (从第 ${startIndex + 1} 个开始)`);
  console.log(`📝 剩余工具数: ${BATCH54_TOOLS.length - startIndex}`);
  console.log('');

  if (!process.env.SILICONFLOW_API_KEY) {
    console.error('❌ 错误: 请设置 SILICONFLOW_API_KEY 环境变量');
    process.exit(1);
  }

  let totalSuccess = 0;
  let totalFailed = 0;

  for (let i = startIndex; i < BATCH54_TOOLS.length; i++) {
    const toolSlug = BATCH54_TOOLS[i];
    console.log(`[${i + 1}/${BATCH54_TOOLS.length}] 翻译: ${toolSlug}`);
    
    const result = await translateTool(toolSlug);
    totalSuccess += result.success;
    totalFailed += result.failed;
    console.log('');
  }

  console.log('📊 翻译完成:');
  console.log(`   成功: ${totalSuccess}`);
  console.log(`   失败: ${totalFailed}`);
  console.log('');
  console.log('📋 后续步骤:');
  console.log('   npx tsx scripts/split-translations.ts');
}

main().catch(console.error);
