/**
 * Batch 54 工具批量翻译脚本 - 使用 SiliconFlow API
 */

import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const CONFIG = {
  apiUrl: 'https://api.siliconflow.cn/v1/chat/completions',
  model: 'THUDM/glm-4-9b-chat',
  messagesDir: path.join(process.cwd(), 'src', 'messages'),
  requestDelay: 1000,
  maxRetries: 3,
};

const TARGET_LOCALES = ['zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];

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

const LOCALE_SEO_HINTS: Record<string, string> = {
  zh: '使用"免费"、"在线"、"工具"等中国用户常用搜索词',
  ja: '「無料」「オンライン」「登録不要」などのキーワードを含める',
  ko: '"무료", "온라인", "가입 불필요" 등의 키워드 포함',
  es: 'Incluir "gratis", "online", "sin registro"',
  pt: 'Incluir "grátis", "online", "sem cadastro"',
  fr: 'Inclure "gratuit", "en ligne", "sans inscription"',
  de: 'Schlüsselwörter "kostenlos", "online", "ohne Anmeldung"',
  ru: 'Включить "бесплатно", "онлайн", "без регистрации"',
  ar: 'تضمين "مجاني"، "أونلاين"، "بدون تسجيل"',
};

const BATCH54_TOOLS = [
  'curl-to-code-generator', 'http-status-code-reference', 'jwt-payload-decoder',
  'base64-image-converter', 'url-query-string-parser', 'request-header-builder',
  'webhook-tester', 'api-response-formatter', 'sql-to-mongodb-converter',
  'json-to-protobuf-converter', 'regex-to-code-generator', 'swagger-to-code-generator',
  'database-migration-generator', 'environment-variables-generator', 'docker-compose-generator-advanced',
  'kubernetes-manifest-generator', 'code-complexity-analyzer', 'dependency-vulnerability-checker',
  'performance-profiler', 'memory-leak-detector', 'code-duplication-finder',
  'unused-imports-finder', 'dead-code-analyzer', 'sql-query-optimizer',
  'database-schema-visualizer', 'sql-injection-tester', 'database-connection-tester',
  'query-execution-planner', 'database-backup-scheduler', 'git-commit-message-generator',
  'git-branch-naming-validator', 'merge-conflict-resolver', 'git-history-visualizer',
  'changelog-generator-advanced', 'git-tag-manager', 'markdown-to-html-converter',
  'document-outline-generator', 'table-of-contents-generator', 'document-word-counter',
  'document-formatter', 'citation-formatter', 'project-estimation-calculator',
  'sprint-velocity-calculator', 'resource-allocation-planner', 'project-risk-analyzer',
  'milestone-tracker', 'team-capacity-planner', 'meeting-minutes-generator',
  'timezone-meeting-scheduler', 'meeting-agenda-builder', 'calendar-availability-finder',
  'meeting-room-finder', 'invoice-template-generator', 'expense-report-generator',
  'budget-variance-analyzer', 'cost-benefit-analyzer', 'financial-forecast-calculator'
];

interface ToolTranslation {
  name: string;
  description: string;
  seo_title: string;
  seo_description: string;
  detailed_description: string;
  usage_steps: string[];
  usage_examples: string[];
  [key: string]: unknown;
}

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function translateWithSiliconFlow(
  content: ToolTranslation,
  targetLocale: string,
  retryCount = 0
): Promise<ToolTranslation | null> {
  const apiKey = process.env.SILICONFLOW_API_KEY;
  if (!apiKey) {
    console.error('请设置 SILICONFLOW_API_KEY 环境变量');
    process.exit(1);
  }

  const localeName = LOCALE_NAMES[targetLocale];
  const seoHints = LOCALE_SEO_HINTS[targetLocale] || '';

  const systemPrompt = `你是一位资深的多语言本土化专家。将英文工具介绍翻译为 ${localeName}，实现本土化翻译。
SEO 优化：${seoHints}
只返回 JSON 对象，保持相同结构和键名。`;

  const userPrompt = `翻译为 ${localeName}，只返回 JSON：
${JSON.stringify(content, null, 2)}`;

  try {
    const response = await fetch(CONFIG.apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + apiKey,
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
      if (retryCount < CONFIG.maxRetries) {
        await sleep(CONFIG.requestDelay * 2);
        return translateWithSiliconFlow(content, targetLocale, retryCount + 1);
      }
      return null;
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content?.trim();
    if (!text) return null;

    let jsonStr = text;
    if (jsonStr.startsWith('\`\`\`')) {
      jsonStr = jsonStr.replace(/^\`\`\`(?:json)?\n?/, '').replace(/\n?\`\`\`$/, '');
    }

    const match = jsonStr.match(/\{[\s\S]*\}/);
    if (match) {
      let fixedJson = match[0];
      fixedJson = fixedJson.replace(/,(\s*[}\]])/g, '$1');
      return JSON.parse(fixedJson) as ToolTranslation;
    }
    return null;
  } catch {
    if (retryCount < CONFIG.maxRetries) {
      await sleep(CONFIG.requestDelay * 2);
      return translateWithSiliconFlow(content, targetLocale, retryCount + 1);
    }
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
  console.log('开始使用 SiliconFlow API 更新 Batch 54 工具翻译...\n');
  console.log('使用模型:', CONFIG.model);

  const enPath = path.join(CONFIG.messagesDir, 'en.json');
  const enData = readJsonFile(enPath) as { tools: Record<string, ToolTranslation> };
  
  const toolSlugs = BATCH54_TOOLS.filter(slug => enData.tools[slug]);
  console.log('找到', toolSlugs.length, '个 Batch 54 工具\n');

  for (const locale of TARGET_LOCALES) {
    console.log('\n翻译到', locale, '(' + LOCALE_NAMES[locale] + ')...');
    
    const localePath = path.join(CONFIG.messagesDir, locale + '.json');
    const localeData = readJsonFile(localePath) as { tools: Record<string, ToolTranslation> };
    
    let success = 0, fail = 0, skipped = 0;
    
    for (let i = 0; i < toolSlugs.length; i++) {
      const slug = toolSlugs[i];
      const enContent = enData.tools[slug];
      
      const existing = localeData.tools[slug];
      if (existing?.detailed_description && existing?.usage_steps?.length > 0) {
        process.stdout.write('  [' + (i + 1) + '/' + toolSlugs.length + '] ' + slug + '... skip\n');
        skipped++;
        continue;
      }
      
      process.stdout.write('  [' + (i + 1) + '/' + toolSlugs.length + '] ' + slug + '... ');
      
      const translated = await translateWithSiliconFlow(enContent, locale);
      
      if (translated) {
        localeData.tools[slug] = { ...existing, ...translated };
        console.log('ok');
        success++;
      } else {
        console.log('fail');
        fail++;
      }
      
      if ((i + 1) % 10 === 0) {
        writeJsonFile(localePath, localeData);
      }
      
      await sleep(CONFIG.requestDelay);
    }
    
    writeJsonFile(localePath, localeData);
    console.log('  统计:', success, '成功,', fail, '失败,', skipped, '跳过');
  }

  console.log('\n翻译完成！');
  console.log('后续: npx tsx scripts/split-translations.ts');
}

main().catch(console.error);
