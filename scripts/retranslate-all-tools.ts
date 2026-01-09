/**
 * 批量重新翻译所有工具
 * 使用优化后的 AI 翻译，提升 SEO 和本土化质量
 * 
 * 用法: npx tsx scripts/retranslate-all-tools.ts [--start=N] [--limit=N]
 */

import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// 模型配置
const MODELS = {
  qwen: 'Qwen/Qwen2.5-7B-Instruct',
  glm: 'THUDM/glm-4-9b-chat',
  hunyuan: 'tencent/Hunyuan-MT-7B',
};

// 根据环境变量选择模型（默认使用智谱 GLM）
function getSelectedModel(): string {
  if (process.env.USE_QWEN === 'true') return MODELS.qwen;
  if (process.env.USE_HUNYUAN === 'true') return MODELS.hunyuan;
  if (process.env.MODEL) return process.env.MODEL;
  return MODELS.glm; // 默认使用智谱 GLM（本土化翻译质量更好）
}

// 判断是否使用智谱 GLM 模型
function isGLMModel(model: string): boolean {
  return model === MODELS.glm;
}

const CONFIG = {
  apiUrl: 'https://api.siliconflow.cn/v1/chat/completions',
  messagesDir: path.join(process.cwd(), 'src', 'messages'),
  delayMs: 1000, // 增加延迟到 1 秒，避免 API 限流
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
- SEOタイトルは30-35文字、「無料」「オンライン」を含める
- 敬語は使わず、シンプルな表現を使用`,
  ko: `- 한국어 사용자가 자주 검색하는 키워드 사용
- SEO 제목은 25-30자, "무료", "온라인" 포함
- 자연스러운 한국어 표현 사용`,
  es: `- Usar términos populares: "gratis", "online", "sin registro"
- Título SEO: 50-60 caracteres
- Usar español neutro internacional`,
  pt: `- Usar termos populares: "grátis", "online", "sem cadastro"
- Título SEO: 50-60 caracteres
- Usar português brasileiro`,
  fr: `- Utiliser: "gratuit", "en ligne", "sans inscription"
- Titre SEO: 50-60 caractères
- Français standard international`,
  de: `- Verwenden: "kostenlos", "online", "ohne Anmeldung"
- SEO-Titel: 50-60 Zeichen
- Formelle aber zugängliche Sprache`,
  ru: `- Использовать: "бесплатно", "онлайн", "без регистрации"
- SEO заголовок: 50-60 символов
- Современный русский язык`,
  ar: `- استخدام: "مجاني"، "أونلاين"، "بدون تسجيل"
- عنوان SEO: 50-60 حرف
- العربية الفصحى المعاصرة`,
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
  if (!apiKey) throw new Error('SILICONFLOW_API_KEY not set');

  const localeName = LOCALE_NAMES[targetLocale];
  const seoHints = LOCALE_SEO_HINTS[targetLocale] || '';
  
  const model = getSelectedModel();
  const isHunyuan = model === MODELS.hunyuan;
  const isGLM = isGLMModel(model);

  let systemPrompt: string;
  let userPrompt: string;

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

### 2. SEO 优化要求
- **seo_title**：包含核心关键词，突出"免费"、"在线"等高搜索量词汇
- **seo_description**：包含主要关键词，使用行动号召语言，突出核心卖点

### 3. ${localeName} 特定优化
${seoHints}

### 4. 输出格式
- 只返回 JSON 对象，不要任何解释或 markdown
- 保持完全相同的 JSON 结构和键名
- 只翻译字符串值`;

    userPrompt = `请将以下在线工具内容翻译为 ${localeName}，确保本土化和 SEO 优化。只返回 JSON：

${JSON.stringify(content, null, 2)}`;
  } else if (isHunyuan) {
    systemPrompt = `You are a professional translator. Translate the following JSON content from English to ${localeName}.
Keep the JSON structure intact. Only translate the string values.
Return ONLY valid JSON without any markdown or explanations.`;
    
    userPrompt = `Translate to ${localeName}:
${JSON.stringify(content, null, 2)}`;
  } else {
    systemPrompt = `You are an expert localization specialist for ${localeName}.
Translate the JSON for a free online tools website with SEO optimization.

## Requirements:
1. Native-level natural translation (NOT literal)
2. SEO-optimized titles and descriptions
3. Include local search keywords

## SEO Guidelines for ${localeName}:
${seoHints}

## Output:
- Return ONLY valid JSON
- Keep exact same structure
- Only translate string values`;

    userPrompt = `Translate to ${localeName}:
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
        temperature: isHunyuan ? 0.1 : 0.3,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    let text = data.choices?.[0]?.message?.content?.trim() || '';

    // Clean markdown
    if (text.startsWith('```')) {
      text = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }

    try {
      return JSON.parse(text);
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) return JSON.parse(match[0]);
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

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const startArg = args.find(a => a.startsWith('--start='));
  const limitArg = args.find(a => a.startsWith('--limit='));
  const start = startArg ? parseInt(startArg.split('=')[1]) : 0;
  const limit = limitArg ? parseInt(limitArg.split('=')[1]) : Infinity;

  if (!process.env.SILICONFLOW_API_KEY) {
    console.error('❌ SILICONFLOW_API_KEY not set');
    process.exit(1);
  }

  // Get all tool slugs
  const enData = readJsonFile(path.join(CONFIG.messagesDir, 'en.json')) as { tools: Record<string, ToolTranslation> };
  const toolSlugs = Object.keys(enData.tools).filter(key => {
    const val = enData.tools[key];
    return typeof val === 'object' && val.name && val.description;
  });

  console.log(`🚀 开始批量翻译`);
  console.log(`   工具总数: ${toolSlugs.length}`);
  console.log(`   起始位置: ${start}`);
  console.log(`   翻译数量: ${limit === Infinity ? '全部' : limit}`);
  console.log('');

  const toProcess = toolSlugs.slice(start, start + limit);
  let successCount = 0;
  let failCount = 0;
  
  const modelName = getSelectedModel();
  console.log(`📦 使用模型: ${modelName}`);
  console.log('');

  for (let i = 0; i < toProcess.length; i++) {
    const slug = toProcess[i];
    const enTool = enData.tools[slug];
    
    console.log(`[${start + i + 1}/${toolSlugs.length}] ${slug}`);

    for (const locale of TARGET_LOCALES) {
      process.stdout.write(`  ${locale}...`);
      
      const result = await translateWithAI(enTool, locale);
      
      if (result) {
        const localePath = path.join(CONFIG.messagesDir, `${locale}.json`);
        const localeData = readJsonFile(localePath) as { tools: Record<string, unknown> };
        
        if (!localeData.tools) localeData.tools = {};
        const existing = (localeData.tools[slug] || {}) as Record<string, unknown>;
        localeData.tools[slug] = { ...existing, ...result };
        
        writeJsonFile(localePath, localeData);
        process.stdout.write(' ✓');
        successCount++;
      } else {
        process.stdout.write(' ✗');
        failCount++;
      }

      await new Promise(r => setTimeout(r, CONFIG.delayMs));
    }
    console.log('');
  }

  console.log('\n📊 完成:');
  console.log(`   成功: ${successCount}`);
  console.log(`   失败: ${failCount}`);
  console.log('\n📋 后续步骤:');
  console.log('   npx tsx scripts/split-translations.ts');
}

main().catch(console.error);
