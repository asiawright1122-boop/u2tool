/**
 * 批量翻译 Batch 54 的 57 个工具到所有语言
 * 
 * 使用方法:
 *   npx tsx scripts/batch-translate-batch54.ts
 * 
 * 环境变量:
 *   SILICONFLOW_API_KEY - SiliconFlow API 密钥
 */

import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// 加载环境变量
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

// 配置
const CONFIG = {
  apiUrl: 'https://api.siliconflow.cn/v1/chat/completions',
  messagesDir: path.join(process.cwd(), 'src', 'messages'),
  model: 'THUDM/glm-4-9b-chat', // 使用智谱 GLM 模型
};

// 目标语言
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

// 各语言的本土化 SEO 关键词提示
const LOCALE_SEO_HINTS: Record<string, string> = {
  zh: `- 使用中国用户常用的搜索词汇，如"在线"、"免费"、"工具"
- SEO标题控制在25-30个汉字，包含核心关键词
- 描述控制在70-80个汉字，突出"免费"、"在线"、"无需注册"等卖点
- 使用简体中文，避免繁体字`,
  ja: `- 日本語の自然な表現を使用（カタカナ語は適切に使用）
- SEOタイトルは30-35文字、説明は80-100文字程度
- 「無料」「オンライン」「登録不要」などのキーワードを含める
- 敬語は使わず、シンプルな表現を使用`,
  ko: `- 한국어 사용자가 자주 검색하는 키워드 사용
- SEO 제목은 25-30자, 설명은 70-90자 정도
- "무료", "온라인", "가입 불필요" 등의 키워드 포함
- 자연스러운 한국어 표현 사용`,
  es: `- Usar términos de búsqueda populares en español
- Título SEO: 50-60 caracteres, descripción: 150-160 caracteres
- Incluir palabras clave como "gratis", "online", "sin registro"
- Usar español neutro (no específico de un país)`,
  pt: `- Usar termos de busca populares em português
- Título SEO: 50-60 caracteres, descrição: 150-160 caracteres
- Incluir palavras-chave como "grátis", "online", "sem cadastro"
- Usar português brasileiro (mais comum globalmente)`,
  fr: `- Utiliser des termes de recherche populaires en français
- Titre SEO: 50-60 caractères, description: 150-160 caractères
- Inclure des mots-clés comme "gratuit", "en ligne", "sans inscription"
- Utiliser un français standard international`,
  de: `- Deutsche Suchbegriffe verwenden
- SEO-Titel: 50-60 Zeichen, Beschreibung: 150-160 Zeichen
- Schlüsselwörter wie "kostenlos", "online", "ohne Anmeldung" einbeziehen
- Formelle aber zugängliche Sprache verwenden`,
  ru: `- Использовать популярные поисковые запросы на русском
- SEO заголовок: 50-60 символов, описание: 150-160 символов
- Включить ключевые слова: "бесплатно", "онлайн", "без регистрации"
- Использовать современный русский язык`,
  ar: `- استخدام مصطلحات البحث الشائعة بالعربية
- عنوان SEO: 50-60 حرف، الوصف: 150-160 حرف
- تضمين كلمات مفتاحية مثل "مجاني"، "أونلاين"، "بدون تسجيل"
- استخدام العربية الفصحى المعاصرة`,
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

/**
 * 调用 SiliconFlow API 进行翻译
 */
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

## 核心任务
将英文工具介绍翻译为 ${localeName}，实现真正的本土化（非直译），并针对当地搜索引擎进行 SEO/GEO 优化。

## 翻译质量要求

### 1. 本土化翻译原则（最重要）
- **母语级表达**：翻译后的内容必须像母语者撰写的一样自然流畅
- **避免翻译腔**：不要逐字翻译，要理解原意后用目标语言重新表达
- **文化适配**：使用当地用户熟悉的表达方式、习语和术语
- **语境优化**：根据工具的实际用途调整措辞，让用户一看就懂

### 2. SEO 优化要求
- **seo_title（SEO标题）**：
  - 包含核心关键词，放在标题前部
  - 突出"免费"、"在线"等高搜索量词汇
  - 长度适中，避免截断
  
- **seo_description（SEO描述）**：
  - 包含主要和次要关键词
  - 使用行动号召语言（如"立即使用"、"快速转换"）
  - 突出核心卖点：免费、在线、无需注册、即时结果
  - 长度控制在搜索引擎显示范围内

### 3. ${localeName} 特定优化
${seoHints}

### 4. 字段翻译指南
- **name**：简洁的工具名称，使用当地常用术语
- **description**：一句话描述工具核心功能和价值
- **detailed_description**：详细介绍工具功能、特点和使用场景
- **usage_steps**：清晰的使用步骤，每步一个动作
- **usage_examples**：实际应用场景，贴近用户需求

### 5. 输出格式要求
- 只返回 JSON 对象，不要任何解释或 markdown
- 保持完全相同的 JSON 结构和键名
- 只翻译字符串值，不改变键名
- 数组保持相同数量的元素`;

  const userPrompt = `请将以下在线工具的内容翻译为 ${localeName}。

这是一个免费在线工具网站的内容，请确保：
1. 翻译自然流畅，像母语者写的一样
2. SEO 标题和描述针对当地搜索引擎优化
3. 突出"免费"、"在线"、"无需注册"等卖点

只返回 JSON 对象：

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
      // 尝试提取 JSON
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

/**
 * 读取 JSON 文件
 */
function readJsonFile(filePath: string): Record<string, unknown> {
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
}

/**
 * 写入 JSON 文件
 */
function writeJsonFile(filePath: string, data: Record<string, unknown>): void {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
}

/**
 * 获取工具的英文翻译
 */
function getEnglishTranslation(toolSlug: string): ToolTranslation | null {
  const enPath = path.join(CONFIG.messagesDir, 'en.json');
  const enData = readJsonFile(enPath) as { tools?: Record<string, ToolTranslation> };
  
  if (!enData.tools?.[toolSlug]) {
    return null;
  }

  return enData.tools[toolSlug];
}

/**
 * 更新指定语言的翻译文件
 */
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

/**
 * 翻译单个工具到所有语言
 */
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

    // 延迟避免 API 限流
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  return { success, failed };
}

/**
 * 主函数
 */
async function main(): Promise<void> {
  console.log('🚀 开始批量翻译 Batch 54 工具');
  console.log(`📦 使用模型: ${CONFIG.model}`);
  console.log(`📝 工具数量: ${BATCH54_TOOLS.length}`);
  console.log(`🌐 目标语言: ${TARGET_LOCALES.join(', ')}`);
  console.log('');

  // 检查 API Key
  if (!process.env.SILICONFLOW_API_KEY) {
    console.error('❌ 错误: 请设置 SILICONFLOW_API_KEY 环境变量');
    console.error('   获取地址: https://cloud.siliconflow.cn/');
    process.exit(1);
  }

  let totalSuccess = 0;
  let totalFailed = 0;
  const failedTools: string[] = [];

  for (let i = 0; i < BATCH54_TOOLS.length; i++) {
    const toolSlug = BATCH54_TOOLS[i];
    console.log(`[${i + 1}/${BATCH54_TOOLS.length}] 翻译: ${toolSlug}`);
    
    const result = await translateTool(toolSlug);
    totalSuccess += result.success;
    totalFailed += result.failed;
    
    if (result.failed > 0) {
      failedTools.push(toolSlug);
    }
    
    console.log('');
  }

  console.log('📊 翻译完成统计:');
  console.log(`   总工具数: ${BATCH54_TOOLS.length}`);
  console.log(`   成功翻译: ${totalSuccess}/${BATCH54_TOOLS.length * TARGET_LOCALES.length}`);
  console.log(`   失败翻译: ${totalFailed}/${BATCH54_TOOLS.length * TARGET_LOCALES.length}`);
  
  if (failedTools.length > 0) {
    console.log('');
    console.log('⚠️ 部分失败的工具:');
    failedTools.forEach(tool => console.log(`   - ${tool}`));
  }

  console.log('');
  console.log('📋 后续步骤:');
  console.log('   1. 运行 npx tsx scripts/split-translations.ts 更新拆分文件');
  console.log('   2. 运行 npm run test -- --run src/messages/translations.test.ts 验证翻译');
}

main().catch(console.error);
