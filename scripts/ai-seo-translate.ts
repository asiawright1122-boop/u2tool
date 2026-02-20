/**
 * AI SEO Translation Script
 * 
 * Uses NVIDIA NIM API (Qwen3.5 / DeepSeek V3.2) to generate
 * high-quality, SEO-optimized translations for all 504 tools × 10 languages.
 * 
 * Features:
 * - 3 API keys with round-robin load balancing
 * - Concurrent processing (3 requests per key = 9 parallel)
 * - Auto-retry with fallback model
 * - Generates: seo_title, seo_description, detailed_description, usage_steps, usage_examples, faqs
 * - Per-language SEO keyword optimization (not template translation)
 * 
 * Usage:
 *   npx tsx scripts/ai-seo-translate.ts                    # Process all tools missing data
 *   npx tsx scripts/ai-seo-translate.ts --slug json-formatter  # Process single tool
 *   npx tsx scripts/ai-seo-translate.ts --fix-zh           # Fix Chinese translations with English residue
 *   npx tsx scripts/ai-seo-translate.ts --faq-only         # Only generate FAQs
 *   npx tsx scripts/ai-seo-translate.ts --dry-run          # Preview without writing
 */

import * as fs from 'fs';
import * as path from 'path';

// ============================================================
// Configuration
// ============================================================

const API_BASE = 'https://integrate.api.nvidia.com/v1/chat/completions';
const PRIMARY_MODEL = 'deepseek-ai/deepseek-v3.2';
const FALLBACK_MODEL = 'qwen/qwen3-235b-a22b';

const API_KEYS = [
  process.env.NVIDIA_API_KEY_1,
  process.env.NVIDIA_API_KEY_2,
  process.env.NVIDIA_API_KEY_3,
].filter(Boolean) as string[];

if (API_KEYS.length === 0) {
  // Try loading from .env.local
  try {
    const envContent = fs.readFileSync('.env.local', 'utf8');
    for (const line of envContent.split('\n')) {
      const match = line.match(/^NVIDIA_API_KEY_\d+=(.+)$/);
      if (match) API_KEYS.push(match[1].trim());
    }
  } catch {}
}

if (API_KEYS.length === 0) {
  console.error('No API keys found. Set NVIDIA_API_KEY_1/2/3 in .env.local');
  process.exit(1);
}

const LOCALES = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'] as const;
const CONCURRENCY_PER_KEY = 3;
const MAX_CONCURRENCY = API_KEYS.length * CONCURRENCY_PER_KEY;
const MAX_RETRIES = 2;
const MESSAGES_DIR = path.join(process.cwd(), 'src/messages');

// ============================================================
// API Client with load balancing
// ============================================================

let keyIndex = 0;
let activeRequests = new Map<string, number>(); // key -> active count

function getNextKey(): string {
  // Round-robin with least-connections
  let minActive = Infinity;
  let bestKey = API_KEYS[0];
  for (const key of API_KEYS) {
    const active = activeRequests.get(key) || 0;
    if (active < minActive) {
      minActive = active;
      bestKey = key;
    }
  }
  return bestKey;
}

async function callLLM(
  prompt: string,
  systemPrompt: string,
  model: string = PRIMARY_MODEL,
  retries: number = MAX_RETRIES
): Promise<string> {
  const key = getNextKey();
  activeRequests.set(key, (activeRequests.get(key) || 0) + 1);

  try {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
        max_tokens: 4096,
        temperature: 0.4,
        top_p: 0.9,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      if (retries > 0 && response.status === 429) {
        // Rate limited - wait and retry
        await sleep(2000 + Math.random() * 3000);
        return callLLM(prompt, systemPrompt, model, retries - 1);
      }
      if (retries > 0 && model === PRIMARY_MODEL) {
        // Try fallback model
        console.warn(`  Primary model failed (${response.status}), trying fallback...`);
        return callLLM(prompt, systemPrompt, FALLBACK_MODEL, retries - 1);
      }
      throw new Error(`API error ${response.status}: ${errText.substring(0, 200)}`);
    }

    const data = await response.json() as any;
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      if (retries > 0 && model === PRIMARY_MODEL) {
        return callLLM(prompt, systemPrompt, FALLBACK_MODEL, retries - 1);
      }
      throw new Error('Empty response from API');
    }
    return content;
  } finally {
    activeRequests.set(key, Math.max(0, (activeRequests.get(key) || 1) - 1));
  }
}

// ============================================================
// Prompt Templates
// ============================================================

const LOCALE_NAMES: Record<string, string> = {
  en: 'English', zh: '中文(简体)', ja: '日本語', ko: '한국어',
  es: 'Español', pt: 'Português', fr: 'Français', de: 'Deutsch',
  ru: 'Русский', ar: 'العربية',
};

const SEO_KEYWORDS_HINT: Record<string, string> = {
  en: 'Include keywords: free, online, tool, generator, converter',
  zh: '包含关键词：免费、在线、工具、生成器、转换器',
  ja: 'キーワード：無料、オンライン、ツール、変換、生成',
  ko: '키워드: 무료, 온라인, 도구, 변환기, 생성기',
  es: 'Palabras clave: gratis, online, herramienta, generador, convertidor',
  pt: 'Palavras-chave: grátis, online, ferramenta, gerador, conversor',
  fr: 'Mots-clés: gratuit, en ligne, outil, générateur, convertisseur',
  de: 'Schlüsselwörter: kostenlos, online, Tool, Generator, Konverter',
  ru: 'Ключевые слова: бесплатно, онлайн, инструмент, генератор, конвертер',
  ar: 'الكلمات المفتاحية: مجاني، أونلاين، أداة، مولد، محول',
};

function buildTranslationPrompt(
  toolSlug: string,
  toolName: string,
  toolDescription: string,
  category: string,
  locale: string,
  existingData: Record<string, unknown>
): string {
  const langName = LOCALE_NAMES[locale] || locale;
  const seoHint = SEO_KEYWORDS_HINT[locale] || '';

  return `Generate SEO-optimized content for a free online tool in ${langName}.

Tool info:
- Slug: ${toolSlug}
- English name: ${toolName}
- English description: ${toolDescription}
- Category: ${category}

${seoHint}

Generate a JSON object with these fields (all in ${langName}, NOT English):

{
  "name": "Tool name in ${langName} (concise, 2-6 words)",
  "description": "Brief description in ${langName} (50-80 chars, include main keyword)",
  "seo_title": "SEO title in ${langName} (50-60 chars, include 'free/online' equivalent, primary keyword first)",
  "seo_description": "SEO meta description in ${langName} (120-160 chars, compelling, include call-to-action and keywords)",
  "detailed_description": "Detailed tool introduction in ${langName} (200-400 chars, explain what it does, who it's for, key features)",
  "usage_steps": ["Step 1", "Step 2", "Step 3", "Step 4", "Step 5"],
  "usage_examples": ["Real-world use case 1", "Real-world use case 2", "Real-world use case 3"],
  "faqs": [
    {"question": "Specific question about this tool in ${langName}", "answer": "Detailed answer in ${langName} (50-100 chars)"},
    {"question": "Another specific question", "answer": "Another detailed answer"},
    {"question": "Third question about features/usage", "answer": "Third answer"},
    {"question": "Fourth question about compatibility/limits", "answer": "Fourth answer"},
    {"question": "Fifth question about privacy/security", "answer": "Fifth answer"}
  ]
}

CRITICAL RULES:
1. ALL content must be in native ${langName} - NO English words mixed in (except technical terms like JSON, HTML, CSS, API)
2. seo_title MUST start with the primary keyword, not the brand name
3. FAQs must be SPECIFIC to this tool, not generic "is it free?" questions
4. usage_steps must be actionable and specific to this tool's functionality
5. Do NOT use template phrases - each tool's content must be unique and specific
6. Return ONLY valid JSON, no markdown code blocks, no explanation`;
}

// ============================================================
// Processing Logic
// ============================================================

interface ToolConfig {
  slug: string;
  category: string;
  icon: string;
  component: string;
  popular?: boolean;
}

function loadToolsConfig(): ToolConfig[] {
  const content = fs.readFileSync('src/config/tools.ts', 'utf8');
  const toolsMatch = content.match(/export const tools[^=]*=\s*\[([\s\S]*?)\]\s*(?:as\s+const)?;/);
  if (!toolsMatch) throw new Error('Cannot parse tools.ts');

  const tools: ToolConfig[] = [];
  const regex = /\{\s*slug:\s*'([^']+)',\s*category:\s*'([^']+)',\s*icon:\s*'([^']*)',\s*component:\s*'([^']+)'(?:,\s*popular:\s*(true|false))?\s*\}/g;
  let match;
  while ((match = regex.exec(toolsMatch[1])) !== null) {
    tools.push({
      slug: match[1],
      category: match[2],
      icon: match[3],
      component: match[4],
      popular: match[5] === 'true',
    });
  }
  return tools;
}

function loadMessages(locale: string): Record<string, unknown> {
  try {
    const content = fs.readFileSync(path.join(MESSAGES_DIR, `${locale}.json`), 'utf8');
    return JSON.parse(content);
  } catch {
    return {};
  }
}

function saveMessages(locale: string, data: Record<string, unknown>): void {
  const filePath = path.join(MESSAGES_DIR, `${locale}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

function parseJSON(text: string): Record<string, unknown> | null {
  // Try to extract JSON from response (may have markdown code blocks)
  let cleaned = text.trim();

  // Remove markdown code blocks
  const jsonMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) cleaned = jsonMatch[1].trim();

  // Remove leading/trailing non-JSON chars
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  try {
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

function needsUpdate(toolData: Record<string, unknown> | undefined, mode: string): boolean {
  if (!toolData) return true;
  if (mode === 'faq-only') return !toolData.faqs || (toolData.faqs as any[]).length === 0;
  if (mode === 'fix-zh') return true; // Always regenerate for zh fix
  // Check if missing key SEO fields
  return !toolData.seo_title ||
    !toolData.seo_description ||
    !toolData.detailed_description ||
    (toolData.detailed_description as string).length < 100 ||
    !toolData.faqs || (toolData.faqs as any[]).length === 0;
}

function hasEnglishResidue(text: string): boolean {
  if (!text) return false;
  // Count English word sequences (3+ consecutive English words)
  const englishWords = text.match(/[a-zA-Z]{4,}/g) || [];
  const technicalTerms = ['JSON', 'HTML', 'CSS', 'API', 'URL', 'HTTP', 'HTTPS', 'XML',
    'CSV', 'PDF', 'SVG', 'PNG', 'JPEG', 'GIF', 'WebP', 'Base64', 'UUID', 'QR',
    'RGB', 'HEX', 'HSL', 'YAML', 'TOML', 'SQL', 'JWT', 'SHA', 'MD5', 'AES',
    'RSA', 'HMAC', 'CORS', 'DNS', 'IP', 'TCP', 'UDP', 'SSH', 'FTP', 'SMTP',
    'MIME', 'UTF', 'ASCII', 'Unicode', 'Markdown', 'Lorem', 'Ipsum', 'SEO',
    'BMI', 'IBAN', 'BIC', 'SWIFT', 'ISBN', 'EAN', 'UPC', 'Cron', 'Regex',
    'TypeScript', 'JavaScript', 'Python', 'Rust', 'Zod', 'Proto', 'GraphQL',
    'Protobuf', 'Dockerfile', 'Nginx', 'Apache', 'Webpack', 'Vite', 'ESLint',
    'Prettier', 'TSConfig', 'EditorConfig', 'Changelog', 'README', 'License',
    'Tailwind', 'Bootstrap', 'Flexbox', 'Grid', 'ECharts', 'Chart'];
  const nonTechnical = englishWords.filter(w =>
    !technicalTerms.some(t => t.toLowerCase() === w.toLowerCase())
  );
  return nonTechnical.length > 3;
}

// ============================================================
// Concurrency Control
// ============================================================

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function processWithConcurrency<T, R>(
  items: T[],
  fn: (item: T) => Promise<R>,
  concurrency: number
): Promise<R[]> {
  const results: R[] = [];
  let index = 0;

  async function worker(): Promise<void> {
    while (index < items.length) {
      const i = index++;
      try {
        results[i] = await fn(items[i]);
      } catch (err) {
        console.error(`  Error processing item ${i}:`, (err as Error).message);
        results[i] = null as any;
      }
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, items.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

// ============================================================
// Main
// ============================================================

async function processToolLocale(
  tool: ToolConfig,
  locale: string,
  enData: Record<string, unknown>,
  messages: Record<string, unknown>,
  mode: string,
  dryRun: boolean
): Promise<boolean> {
  const toolsObj = (messages.tools as Record<string, unknown>) || {};
  const existingData = (toolsObj[tool.slug] as Record<string, unknown>) || {};

  // Get English reference data
  const enToolsObj = (enData.tools as Record<string, unknown>) || {};
  const enToolData = (enToolsObj[tool.slug] as Record<string, unknown>) || {};
  const enName = (enToolData.name as string) || tool.slug;
  const enDesc = (enToolData.description as string) || '';

  const systemPrompt = `You are an expert SEO content writer and translator. You create unique, high-quality, search-engine-optimized content for online tools. You NEVER use template phrases. Every piece of content you write is specific to the tool being described. You output ONLY valid JSON.`;

  const prompt = buildTranslationPrompt(tool.slug, enName, enDesc, tool.category, locale, existingData);

  const response = await callLLM(prompt, systemPrompt);
  const parsed = parseJSON(response);

  if (!parsed) {
    console.warn(`  ⚠ Failed to parse JSON for ${tool.slug}/${locale}`);
    return false;
  }

  if (dryRun) {
    console.log(`  [DRY RUN] ${tool.slug}/${locale}:`, JSON.stringify(parsed).substring(0, 200));
    return true;
  }

  // Merge: keep existing fields, add/update new ones
  const merged = { ...existingData };

  // Always update these fields from AI
  if (parsed.name) merged.name = parsed.name;
  if (parsed.description) merged.description = parsed.description;
  if (parsed.seo_title) merged.seo_title = parsed.seo_title;
  if (parsed.seo_description) merged.seo_description = parsed.seo_description;
  if (parsed.detailed_description) merged.detailed_description = parsed.detailed_description;
  if (parsed.usage_steps && Array.isArray(parsed.usage_steps)) merged.usage_steps = parsed.usage_steps;
  if (parsed.usage_examples && Array.isArray(parsed.usage_examples)) merged.usage_examples = parsed.usage_examples;
  if (parsed.faqs && Array.isArray(parsed.faqs)) merged.faqs = parsed.faqs;

  // Update in messages
  if (!messages.tools) messages.tools = {};
  (messages.tools as Record<string, unknown>)[tool.slug] = merged;

  return true;
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const faqOnly = args.includes('--faq-only');
  const fixZh = args.includes('--fix-zh');
  const slugArg = args.find(a => a.startsWith('--slug='))?.split('=')[1]
    || (args.indexOf('--slug') !== -1 ? args[args.indexOf('--slug') + 1] : null);
  const localeArg = args.find(a => a.startsWith('--locale='))?.split('=')[1]
    || (args.indexOf('--locale') !== -1 ? args[args.indexOf('--locale') + 1] : null);

  const mode = faqOnly ? 'faq-only' : fixZh ? 'fix-zh' : 'full';

  console.log('🚀 AI SEO Translation Script');
  console.log(`   Model: ${PRIMARY_MODEL} (fallback: ${FALLBACK_MODEL})`);
  console.log(`   API Keys: ${API_KEYS.length}`);
  console.log(`   Max Concurrency: ${MAX_CONCURRENCY}`);
  console.log(`   Mode: ${mode}${dryRun ? ' [DRY RUN]' : ''}`);
  console.log('');

  // Load tools config
  const allTools = loadToolsConfig();
  console.log(`   Tools loaded: ${allTools.length}`);

  const tools = slugArg ? allTools.filter(t => t.slug === slugArg) : allTools;
  const batchLimit = args.find(a => a.startsWith('--limit='))?.split('=')[1];
  const limitNum = batchLimit ? parseInt(batchLimit) : 0;
  if (tools.length === 0) {
    console.error(`Tool not found: ${slugArg}`);
    process.exit(1);
  }

  const targetLocales = localeArg ? [localeArg] : fixZh ? ['zh'] : [...LOCALES];

  // Load English data as reference
  const enData = loadMessages('en');

  // Load all locale messages
  const allMessages: Record<string, Record<string, unknown>> = {};
  for (const locale of targetLocales) {
    allMessages[locale] = loadMessages(locale);
  }

  // Build task list
  interface Task {
    tool: ToolConfig;
    locale: string;
  }

  const tasks: Task[] = [];
  for (const tool of tools) {
    for (const locale of targetLocales) {
      const toolsObj = (allMessages[locale].tools as Record<string, unknown>) || {};
      const toolData = toolsObj[tool.slug] as Record<string, unknown> | undefined;

      if (fixZh && locale === 'zh') {
        // Check for English residue in Chinese translations
        const seoDesc = (toolData?.seo_description as string) || '';
        const detailedDesc = (toolData?.detailed_description as string) || '';
        if (hasEnglishResidue(seoDesc) || hasEnglishResidue(detailedDesc) || !toolData?.faqs) {
          tasks.push({ tool, locale });
        }
      } else if (needsUpdate(toolData, mode)) {
        tasks.push({ tool, locale });
      }
    }
  }

  console.log(`   Tasks to process: ${tasks.length}`);
  if (limitNum > 0 && tasks.length > limitNum) {
    tasks.length = limitNum;
    console.log(`   Limited to: ${limitNum} tasks`);
  }
  if (tasks.length === 0) {
    console.log('✅ Nothing to do!');
    return;
  }

  console.log('');

  // Process tasks with concurrency
  let completed = 0;
  let succeeded = 0;
  let failed = 0;
  const startTime = Date.now();

  await processWithConcurrency(tasks, async (task) => {
    const result = await processToolLocale(
      task.tool, task.locale, enData, allMessages[task.locale], mode, dryRun
    );
    completed++;
    if (result) succeeded++;
    else failed++;

    if (completed % 10 === 0 || completed === tasks.length) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      const rate = (completed / parseFloat(elapsed) * 60).toFixed(1);
      console.log(`   Progress: ${completed}/${tasks.length} (${succeeded}✓ ${failed}✗) | ${elapsed}s | ${rate}/min`);
    }

    // Small delay to avoid rate limiting
    await sleep(100);
    return result;
  }, MAX_CONCURRENCY);

  // Save all modified messages
  if (!dryRun) {
    console.log('\n💾 Saving translation files...');
    for (const locale of targetLocales) {
      saveMessages(locale, allMessages[locale]);
      console.log(`   ✓ ${locale}.json saved`);
    }
  }

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n✅ Done! ${succeeded} succeeded, ${failed} failed in ${totalTime}s`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
