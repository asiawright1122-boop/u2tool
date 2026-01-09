/**
 * 重试失败的翻译
 * 从 logs/tools-to-retranslate.txt 读取需要重新翻译的工具列表
 */

import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MODELS = {
  qwen: 'Qwen/Qwen2.5-7B-Instruct',
  glm: 'THUDM/glm-4-9b-chat',
  hunyuan: 'tencent/Hunyuan-MT-7B',
};

function getSelectedModel(): string {
  if (process.env.USE_QWEN === 'true') return MODELS.qwen;
  if (process.env.USE_HUNYUAN === 'true') return MODELS.hunyuan;
  return MODELS.glm;
}

function isGLMModel(model: string): boolean {
  return model === MODELS.glm;
}

const CONFIG = {
  apiUrl: 'https://api.siliconflow.cn/v1/chat/completions',
  messagesDir: path.join(process.cwd(), 'src', 'messages'),
  delayMs: 1500, // 更长延迟避免限流
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
  zh: `- 使用"在线"、"免费"、"工具"等关键词
- SEO标题25-30汉字，描述70-80汉字`,
  ja: `- 「無料」「オンライン」を含める
- タイトル30-35文字`,
  ko: `- "무료", "온라인" 포함
- 제목 25-30자`,
  es: `- Incluir "gratis", "online"
- Título 50-60 caracteres`,
  pt: `- Incluir "grátis", "online"
- Título 50-60 caracteres`,
  fr: `- Inclure "gratuit", "en ligne"
- Titre 50-60 caractères`,
  de: `- "kostenlos", "online" einbeziehen
- Titel 50-60 Zeichen`,
  ru: `- Включить "бесплатно", "онлайн"
- Заголовок 50-60 символов`,
  ar: `- تضمين "مجاني"، "أونلاين"
- العنوان 50-60 حرف`,
};

interface ToolTranslation {
  name: string;
  description: string;
  seo_title: string;
  seo_description: string;
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
  const isGLM = isGLMModel(model);
  const isHunyuan = model === MODELS.hunyuan;

  let systemPrompt: string;
  let userPrompt: string;

  if (isGLM) {
    systemPrompt = `你是一位资深的多语言本土化专家，精通 ${localeName}。

## 任务
将英文工具介绍翻译为 ${localeName}，实现本土化翻译和 SEO 优化。

## 要求
1. 母语级表达，避免翻译腔
2. SEO 优化：seo_title 和 seo_description 包含当地搜索关键词
3. ${localeName} 特定优化：${seoHints}

## 输出
只返回 JSON，保持相同结构`;

    userPrompt = `翻译为 ${localeName}，只返回 JSON：
${JSON.stringify(content, null, 2)}`;
  } else if (isHunyuan) {
    systemPrompt = `Translate JSON to ${localeName}. Keep structure, return only JSON.`;
    userPrompt = `Translate to ${localeName}:
${JSON.stringify(content, null, 2)}`;
  } else {
    systemPrompt = `Expert localization for ${localeName}. SEO optimize titles/descriptions.
Guidelines: ${seoHints}
Return only valid JSON.`;
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
        model,
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
  const listFile = 'logs/tools-to-retranslate.txt';
  
  if (!fs.existsSync(listFile)) {
    console.error('❌ 请先运行 npx tsx scripts/audit-translations.ts 生成待翻译列表');
    process.exit(1);
  }

  const toolSlugs = fs.readFileSync(listFile, 'utf-8')
    .split('\n')
    .filter(s => s.trim());

  if (toolSlugs.length === 0) {
    console.log('✅ 没有需要重新翻译的工具');
    return;
  }

  const model = getSelectedModel();
  console.log(`🔄 重试翻译 ${toolSlugs.length} 个工具`);
  console.log(`📦 使用模型: ${model}\n`);

  const enData = readJsonFile(path.join(CONFIG.messagesDir, 'en.json')) as { tools: Record<string, ToolTranslation> };

  let totalSuccess = 0;
  let totalFail = 0;

  for (let i = 0; i < toolSlugs.length; i++) {
    const slug = toolSlugs[i];
    const enTool = enData.tools[slug];
    
    if (!enTool) {
      console.log(`⚠️ [${i + 1}/${toolSlugs.length}] ${slug} - 英文翻译不存在，跳过`);
      continue;
    }

    console.log(`[${i + 1}/${toolSlugs.length}] ${slug}`);

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
        totalSuccess++;
      } else {
        process.stdout.write(' ✗');
        totalFail++;
      }

      await new Promise(r => setTimeout(r, CONFIG.delayMs));
    }
    console.log('');
  }

  console.log(`\n📊 完成: 成功 ${totalSuccess}, 失败 ${totalFail}`);
  console.log('\n📋 后续步骤:');
  console.log('   1. npx tsx scripts/split-translations.ts');
  console.log('   2. npx tsx scripts/audit-translations.ts (再次检查)');
}

main().catch(console.error);
