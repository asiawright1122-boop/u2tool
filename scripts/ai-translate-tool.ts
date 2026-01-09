/**
 * AI 自动翻译工具脚本
 * 使用 SiliconFlow 免费 API 将英文翻译自动翻译为其他 9 种语言
 * 
 * 使用方法:
 *   npx tsx scripts/ai-translate-tool.ts <tool-slug>
 * 
 * 环境变量:
 *   SILICONFLOW_API_KEY - SiliconFlow API 密钥
 * 
 * 示例:
 *   npx tsx scripts/ai-translate-tool.ts json-formatter
 */

import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// 加载环境变量
dotenv.config({ path: '.env.local' });

// 模型配置
const MODELS = {
  // 通用大模型（用于生成翻译内容）
  qwen: 'Qwen/Qwen2.5-7B-Instruct',
  glm: 'THUDM/glm-4-9b-chat',
  internlm: 'internlm/internlm2_5-7b-chat',
  // 专业翻译模型（腾讯混元翻译模型，专为翻译优化）
  hunyuan: 'tencent/Hunyuan-MT-7B',
};

// 根据环境变量选择模型（默认使用智谱 GLM）
function getSelectedModel(): string {
  if (process.env.USE_QWEN === 'true') return MODELS.qwen;
  if (process.env.USE_HUNYUAN === 'true') return MODELS.hunyuan;
  if (process.env.USE_INTERNLM === 'true') return MODELS.internlm;
  if (process.env.MODEL) return process.env.MODEL;
  return MODELS.glm; // 默认使用智谱 GLM（本土化翻译质量更好）
}

// 判断是否使用智谱 GLM 模型
function isGLMModel(model: string): boolean {
  return model === MODELS.glm;
}

// 配置
const CONFIG = {
  apiUrl: 'https://api.siliconflow.cn/v1/chat/completions',
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
    console.error('   获取地址: https://cloud.siliconflow.cn/');
    process.exit(1);
  }

  const localeName = LOCALE_NAMES[targetLocale];
  const seoHints = LOCALE_SEO_HINTS[targetLocale] || '';
  
  // 选择模型
  const model = getSelectedModel();
  const isHunyuan = model === MODELS.hunyuan;
  
  // 根据模型类型选择不同的 prompt 策略
  let systemPrompt: string;
  let userPrompt: string;
  
  const isGLM = isGLMModel(model);
  
  if (isGLM) {
    // 智谱 GLM 模型：专注于本土化翻译、SEO 和 GEO 优化
    systemPrompt = `你是一位资深的多语言本土化专家和 SEO 文案大师，精通 ${localeName} 的语言文化和搜索引擎优化。

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
- 数组保持相同数量的元素

## 示例输出格式
{
  "name": "翻译后的名称",
  "description": "翻译后的描述",
  "seo_title": "SEO优化后的标题",
  "seo_description": "SEO优化后的描述",
  "detailed_description": "详细描述...",
  "usage_steps": ["步骤1", "步骤2", "步骤3"],
  "usage_examples": ["示例1", "示例2"]
}`;

    userPrompt = `请将以下在线工具的内容翻译为 ${localeName}。

这是一个免费在线工具网站的内容，请确保：
1. 翻译自然流畅，像母语者写的一样
2. SEO 标题和描述针对当地搜索引擎优化
3. 突出"免费"、"在线"、"无需注册"等卖点

只返回 JSON 对象：

${JSON.stringify(content, null, 2)}`;
  } else if (isHunyuan) {
    // 腾讯混元翻译模型：专为翻译优化，强调 JSON 格式
    systemPrompt = `You are a professional translator. Translate the following JSON content from English to ${localeName}.

CRITICAL RULES:
1. Keep the EXACT same JSON structure
2. Only translate string values, keep keys unchanged
3. For arrays, keep the same number of elements
4. Return ONLY valid JSON - no markdown, no explanations
5. Ensure proper JSON syntax: commas between array elements, no trailing commas

Example output format:
{
  "name": "翻译后的名称",
  "description": "翻译后的描述",
  "usage_steps": ["步骤1", "步骤2", "步骤3"]
}`;
    
    userPrompt = `Translate this JSON to ${localeName}. Return ONLY the JSON object:

${JSON.stringify(content, null, 2)}`;
  } else {
    // 通用大模型：使用详细的 SEO 优化指令
    systemPrompt = `You are an expert localization specialist and SEO copywriter with deep knowledge of ${localeName} culture and search behavior.

Your task: Translate the JSON content from English to ${localeName} with SEO optimization and cultural localization.

## Translation Quality Requirements:

### 1. Native-Level Localization
- Write as a native speaker would naturally express it
- Use idioms, expressions, and terminology common in the target market
- Avoid literal translations that sound unnatural
- Adapt cultural references appropriately

### 2. SEO Optimization
- "name": Short, memorable tool name (use local terminology)
- "description": Concise benefit-focused description
- "seo_title": Optimized for search engines, include primary keyword
- "seo_description": Compelling meta description with call-to-action, include secondary keywords

### 3. Language-Specific SEO Guidelines for ${localeName}:
${seoHints}

### 4. Content Guidelines
- Highlight key benefits: free, online, no registration, instant results
- Use action-oriented language
- Make it sound professional yet approachable
- Ensure technical accuracy while being accessible

### 5. Output Format
- Return ONLY valid JSON
- Keep the exact same JSON structure and keys
- Only translate string values
- No markdown, no explanations, no code blocks`;

    userPrompt = `Translate this online tool's content to ${localeName}. 
This is for a free online tools website. Make it SEO-friendly and culturally appropriate:

${JSON.stringify(content, null, 2)}`;
  }

  try {
    const response = await fetch(CONFIG.apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: isHunyuan ? 0.1 : 0.3, // 翻译模型使用更低温度
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

    // 尝试解析 JSON（处理可能的 markdown 代码块）
    let jsonStr = translatedText.trim();
    if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }
    
    // 尝试修复常见的 JSON 格式问题
    try {
      const translated = JSON.parse(jsonStr) as ToolTranslation;
      return translated;
    } catch (parseError) {
      // 尝试提取 JSON 对象
      const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        let extractedJson = jsonMatch[0];
        
        // 尝试修复常见的 JSON 格式问题
        // 1. 移除尾部多余的逗号
        extractedJson = extractedJson.replace(/,(\s*[}\]])/g, '$1');
        // 2. 修复数组中的尾部逗号
        extractedJson = extractedJson.replace(/,(\s*\])/g, '$1');
        // 3. 尝试截断到最后一个有效的 }
        
        try {
          const translated = JSON.parse(extractedJson) as ToolTranslation;
          return translated;
        } catch {
          // 尝试更激进的修复：找到最后一个完整的 JSON 对象
          const lines = extractedJson.split('\n');
          for (let i = lines.length - 1; i >= 0; i--) {
            const partialJson = lines.slice(0, i + 1).join('\n');
            // 确保以 } 结尾
            const trimmed = partialJson.trim();
            if (trimmed.endsWith('}') || trimmed.endsWith('}]')) {
              try {
                const translated = JSON.parse(trimmed) as ToolTranslation;
                return translated;
              } catch {
                continue;
              }
            }
          }
        }
      }
      console.error(`❌ 翻译失败 (${targetLocale}):`, parseError);
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
    console.error(`❌ 工具 "${toolSlug}" 在 en.json 中不存在`);
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

  // 合并翻译（保留现有的其他字段）
  const existing = (data.tools[toolSlug] || {}) as Record<string, unknown>;
  data.tools[toolSlug] = { ...existing, ...translation };

  writeJsonFile(filePath, data);
}

/**
 * 主函数
 */
async function main(): Promise<void> {
  const toolSlug = process.argv[2];

  if (!toolSlug) {
    console.log('使用方法: npx tsx scripts/ai-translate-tool.ts <tool-slug>');
    console.log('');
    console.log('示例:');
    console.log('  npx tsx scripts/ai-translate-tool.ts json-formatter');
    console.log('  npx tsx scripts/ai-translate-tool.ts base64-encoder');
    console.log('');
    console.log('环境变量:');
    console.log('  SILICONFLOW_API_KEY - SiliconFlow API 密钥');
    console.log('');
    console.log('模型选择 (通过环境变量):');
    console.log('  默认        - Qwen/Qwen2.5-7B-Instruct (通用模型，含 SEO 优化)');
    console.log('  USE_GLM=true     - THUDM/glm-4-9b-chat (智谱 GLM-4)');
    console.log('  USE_HUNYUAN=true - tencent/Hunyuan-MT-7B (腾讯混元翻译模型)');
    console.log('  USE_INTERNLM=true - internlm/internlm2_5-7b-chat (书生浦语)');
    console.log('  MODEL=xxx        - 自定义模型名称');
    console.log('');
    console.log('示例:');
    console.log('  USE_GLM=true npx tsx scripts/ai-translate-tool.ts json-formatter');
    console.log('');
    console.log('获取 API Key: https://cloud.siliconflow.cn/');
    process.exit(1);
  }

  const modelName = getSelectedModel();
  console.log(`🚀 开始翻译工具: ${toolSlug}`);
  console.log(`📦 使用模型: ${modelName}`);
  console.log('');

  // 获取英文翻译
  const enTranslation = getEnglishTranslation(toolSlug);
  if (!enTranslation) {
    process.exit(1);
  }

  console.log('📝 英文原文:');
  console.log(`   名称: ${enTranslation.name}`);
  console.log(`   描述: ${enTranslation.description}`);
  console.log('');

  // 翻译到每种语言
  let successCount = 0;
  let failCount = 0;

  for (const locale of TARGET_LOCALES) {
    process.stdout.write(`🔄 翻译到 ${locale} (${LOCALE_NAMES[locale]})... `);
    
    const translated = await translateWithAI(enTranslation, locale);
    
    if (translated) {
      updateLocaleFile(locale, toolSlug, translated);
      console.log('✅');
      successCount++;
    } else {
      console.log('❌');
      failCount++;
    }

    // 添加延迟避免 API 限流
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
