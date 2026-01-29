/**
 * 强制重新翻译 Batch 54 工具 - 使用 SiliconFlow API
 */
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const CONFIG = {
  apiUrl: 'https://api.siliconflow.cn/v1/chat/completions',
  model: 'THUDM/glm-4-9b-chat',
  messagesDir: path.join(process.cwd(), 'src', 'messages'),
};

const TARGET_LOCALES = ['zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];
const LOCALE_NAMES: Record<string, string> = {
  zh: 'Simplified Chinese', ja: 'Japanese', ko: 'Korean',
  es: 'Spanish', pt: 'Portuguese', fr: 'French',
  de: 'German', ru: 'Russian', ar: 'Arabic',
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

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function translate(content: ToolTranslation, locale: string): Promise<ToolTranslation | null> {
  const apiKey = process.env.SILICONFLOW_API_KEY;
  if (!apiKey) { console.error('需要 SILICONFLOW_API_KEY'); process.exit(1); }

  const prompt = `你是专业翻译。将以下工具内容翻译为${LOCALE_NAMES[locale]}，要求：
1. 本土化翻译，不是直译
2. SEO优化：包含"免费"、"在线"等关键词
3. 只返回JSON，保持相同结构

${JSON.stringify(content, null, 2)}`;

  try {
    const res = await fetch(CONFIG.apiUrl, {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: CONFIG.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3, max_tokens: 2000,
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    let text = data.choices?.[0]?.message?.content?.trim() || '';
    if (text.startsWith('```')) text = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0].replace(/,(\s*[}\]])/g, '$1'));
    return null;
  } catch { return null; }
}

async function main() {
  console.log('强制重新翻译 Batch 54 工具...\n');
  
  const enData = JSON.parse(fs.readFileSync(path.join(CONFIG.messagesDir, 'en.json'), 'utf-8'));
  const tools = BATCH54_TOOLS.filter(s => enData.tools[s]);
  console.log(`共 ${tools.length} 个工具\n`);

  for (const locale of TARGET_LOCALES) {
    console.log(`\n翻译到 ${locale}...`);
    const filePath = path.join(CONFIG.messagesDir, `${locale}.json`);
    const localeData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    let ok = 0, fail = 0;

    for (let i = 0; i < tools.length; i++) {
      const slug = tools[i];
      process.stdout.write(`  [${i+1}/${tools.length}] ${slug}... `);
      const translated = await translate(enData.tools[slug], locale);
      if (translated) {
        localeData.tools[slug] = { ...localeData.tools[slug], ...translated };
        console.log('✓');
        ok++;
      } else {
        console.log('✗');
        fail++;
      }
      if ((i+1) % 10 === 0) fs.writeFileSync(filePath, JSON.stringify(localeData, null, 2) + '\n');
      await sleep(800);
    }
    fs.writeFileSync(filePath, JSON.stringify(localeData, null, 2) + '\n');
    console.log(`  完成: ${ok}/${tools.length}`);
  }
  console.log('\n完成！运行: npx tsx scripts/split-translations.ts');
}

main().catch(console.error);
