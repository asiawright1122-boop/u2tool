const fs = require('fs');

// 读取 tools.ts 获取所有工具
const toolsContent = fs.readFileSync('src/config/tools.ts', 'utf8');

// 提取所有工具 slug
const slugMatches = toolsContent.match(/slug:\s*['"]([^'"]+)['"]/g);
const allSlugs = slugMatches ? slugMatches.map(m => m.match(/['"]([^'"]+)['"]/)[1]) : [];

console.log('总工具数:', allSlugs.length);

// 支持的语言
const locales = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];

// 检查每种语言的翻译
const results = {};
const missingByLang = {};

for (const locale of locales) {
  const data = JSON.parse(fs.readFileSync(`src/messages/${locale}.json`, 'utf8'));
  const tools = data.tools || {};
  
  // 获取工具翻译键（排除通用键）
  const commonKeys = ['inputPlaceholder', 'outputPlaceholder', 'copy', 'copied', 'clear', 'input', 'output', 'convert', 'generate', 'format', 'download', 'error', 'categories', 'common'];
  const toolKeys = Object.keys(tools).filter(k => !k.includes('UI') && !commonKeys.includes(k) && typeof tools[k] === 'object');
  
  results[locale] = toolKeys.length;
  
  // 找出缺少的工具
  const missing = allSlugs.filter(slug => !toolKeys.includes(slug));
  missingByLang[locale] = missing;
}

console.log('\n各语言翻译数量:');
for (const locale of locales) {
  console.log(`  ${locale}: ${results[locale]} 个工具`);
}

// 找出所有语言都缺少的工具
const allMissing = allSlugs.filter(slug => locales.every(locale => missingByLang[locale].includes(slug)));
console.log('\n所有语言都缺少翻译的工具 (' + allMissing.length + '):');
if (allMissing.length > 0) {
  allMissing.forEach(slug => console.log('  - ' + slug));
}

// 找出部分语言缺少的工具
console.log('\n部分语言缺少翻译的工具:');
for (const slug of allSlugs) {
  const missingLocales = locales.filter(locale => missingByLang[locale].includes(slug));
  if (missingLocales.length > 0 && missingLocales.length < locales.length) {
    console.log(`  ${slug}: 缺少 ${missingLocales.join(', ')}`);
  }
}

// 检查 batch54 工具的翻译完整性
const batch54Tools = [
  'curl-to-code-generator',
  'http-status-code-reference',
  'jwt-payload-decoder',
  'base64-image-converter',
  'url-query-string-parser',
  'request-header-builder',
  'webhook-tester',
  'api-response-formatter',
  'sql-to-mongodb-converter',
  'json-to-protobuf-converter',
  'regex-to-code-generator',
  'swagger-to-code-generator',
  'database-migration-generator',
  'environment-variables-generator',
  'docker-compose-generator-advanced',
  'kubernetes-manifest-generator',
  'code-complexity-analyzer',
  'dependency-vulnerability-checker',
  'performance-profiler',
  'memory-leak-detector',
  'code-duplication-finder',
  'unused-imports-finder',
  'dead-code-analyzer',
  'sql-query-optimizer',
  'database-schema-visualizer',
  'sql-injection-tester',
  'database-connection-tester',
  'query-execution-planner',
  'database-backup-scheduler',
  'git-commit-message-generator',
  'git-branch-naming-validator',
  'merge-conflict-resolver',
  'git-history-visualizer',
  'changelog-generator-advanced',
  'git-tag-manager',
  'markdown-to-html-converter',
  'document-outline-generator',
  'table-of-contents-generator',
  'document-word-counter',
  'document-formatter',
  'citation-formatter',
  'project-estimation-calculator',
  'sprint-velocity-calculator',
  'resource-allocation-planner',
  'project-risk-analyzer',
  'milestone-tracker',
  'team-capacity-planner',
  'meeting-minutes-generator',
  'timezone-meeting-scheduler',
  'meeting-agenda-builder',
  'calendar-availability-finder',
  'meeting-room-finder',
  'invoice-template-generator',
  'expense-report-generator',
  'budget-variance-analyzer',
  'cost-benefit-analyzer',
  'financial-forecast-calculator'
];

console.log('\n\n=== Batch54 工具翻译检查 ===');
console.log('Batch54 工具总数:', batch54Tools.length);

let batch54Missing = [];
for (const slug of batch54Tools) {
  const missingLocales = locales.filter(locale => missingByLang[locale].includes(slug));
  if (missingLocales.length > 0) {
    batch54Missing.push({ slug, missingLocales });
  }
}

if (batch54Missing.length === 0) {
  console.log('✓ 所有 Batch54 工具在所有语言中都有翻译');
} else {
  console.log('✗ 以下 Batch54 工具缺少翻译:');
  for (const { slug, missingLocales } of batch54Missing) {
    console.log(`  ${slug}: 缺少 ${missingLocales.join(', ')}`);
  }
}

// 检查翻译键完整性
console.log('\n\n=== 翻译键完整性检查 ===');
const requiredKeys = ['name', 'description', 'seo_title', 'seo_description'];
const optionalKeys = ['detailed_description', 'usage_steps', 'usage_examples', 'inputPlaceholder'];

for (const slug of batch54Tools.slice(0, 5)) {  // 只检查前5个作为示例
  console.log(`\n${slug}:`);
  for (const locale of locales) {
    const data = JSON.parse(fs.readFileSync(`src/messages/${locale}.json`, 'utf8'));
    const tool = data.tools?.[slug];
    if (!tool) {
      console.log(`  ${locale}: ✗ 工具不存在`);
      continue;
    }
    const missingRequired = requiredKeys.filter(k => !tool[k]);
    const missingOptional = optionalKeys.filter(k => !tool[k]);
    if (missingRequired.length === 0) {
      console.log(`  ${locale}: ✓ 必需键完整` + (missingOptional.length > 0 ? ` (缺少可选键: ${missingOptional.join(', ')})` : ''));
    } else {
      console.log(`  ${locale}: ✗ 缺少必需键: ${missingRequired.join(', ')}`);
    }
  }
}
