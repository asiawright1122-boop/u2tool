const fs = require('fs');
const path = require('path');

const tools = [
  { slug: 'curl-to-code-generator', name: 'cURL to Code Generator' },
  { slug: 'http-status-code-reference', name: 'HTTP Status Code Reference' },
  { slug: 'jwt-payload-decoder', name: 'JWT Payload Decoder' },
  { slug: 'base64-image-converter', name: 'Base64 Image Converter' },
  { slug: 'url-query-string-parser', name: 'URL Query String Parser' },
  { slug: 'request-header-builder', name: 'Request Header Builder' },
  { slug: 'webhook-tester', name: 'Webhook Tester' },
  { slug: 'api-response-formatter', name: 'API Response Formatter' },
  { slug: 'sql-to-mongodb-converter', name: 'SQL to MongoDB Converter' },
  { slug: 'json-to-protobuf-converter', name: 'JSON to Protobuf Converter' },
  { slug: 'regex-to-code-generator', name: 'Regex to Code Generator' },
  { slug: 'swagger-to-code-generator', name: 'Swagger to Code Generator' },
  { slug: 'database-migration-generator', name: 'Database Migration Generator' },
  { slug: 'environment-variables-generator', name: 'Environment Variables Generator' },
  { slug: 'docker-compose-generator-advanced', name: 'Docker Compose Generator' },
  { slug: 'kubernetes-manifest-generator', name: 'Kubernetes Manifest Generator' },
  { slug: 'code-complexity-analyzer', name: 'Code Complexity Analyzer' },
  { slug: 'dependency-vulnerability-checker', name: 'Dependency Vulnerability Checker' },
  { slug: 'performance-profiler', name: 'Performance Profiler' },
  { slug: 'memory-leak-detector', name: 'Memory Leak Detector' },
  { slug: 'code-duplication-finder', name: 'Code Duplication Finder' },
  { slug: 'unused-imports-finder', name: 'Unused Imports Finder' },
  { slug: 'dead-code-analyzer', name: 'Dead Code Analyzer' },
  { slug: 'sql-query-optimizer', name: 'SQL Query Optimizer' },
  { slug: 'database-schema-visualizer', name: 'Database Schema Visualizer' },
  { slug: 'sql-injection-tester', name: 'SQL Injection Tester' },
  { slug: 'database-connection-tester', name: 'Database Connection Tester' },
  { slug: 'query-execution-planner', name: 'Query Execution Planner' },
  { slug: 'database-backup-scheduler', name: 'Database Backup Scheduler' },
  { slug: 'git-commit-message-generator', name: 'Git Commit Message Generator' },
  { slug: 'git-branch-naming-validator', name: 'Git Branch Naming Validator' },
  { slug: 'merge-conflict-resolver', name: 'Merge Conflict Resolver' },
  { slug: 'git-history-visualizer', name: 'Git History Visualizer' },
  { slug: 'changelog-generator-advanced', name: 'Changelog Generator' },
  { slug: 'git-tag-manager', name: 'Git Tag Manager' },
  { slug: 'markdown-to-html-converter', name: 'Markdown to HTML Converter' },
  { slug: 'document-outline-generator', name: 'Document Outline Generator' },
  { slug: 'table-of-contents-generator', name: 'Table of Contents Generator' },
  { slug: 'document-word-counter', name: 'Document Word Counter' },
  { slug: 'document-formatter', name: 'Document Formatter' },
  { slug: 'citation-formatter', name: 'Citation Formatter' },
  { slug: 'project-estimation-calculator', name: 'Project Estimation Calculator' },
  { slug: 'sprint-velocity-calculator', name: 'Sprint Velocity Calculator' },
  { slug: 'resource-allocation-planner', name: 'Resource Allocation Planner' },
  { slug: 'project-risk-analyzer', name: 'Project Risk Analyzer' },
  { slug: 'milestone-tracker', name: 'Milestone Tracker' },
  { slug: 'team-capacity-planner', name: 'Team Capacity Planner' },
  { slug: 'meeting-minutes-generator', name: 'Meeting Minutes Generator' },
  { slug: 'timezone-meeting-scheduler', name: 'Timezone Meeting Scheduler' },
  { slug: 'meeting-agenda-builder', name: 'Meeting Agenda Builder' },
  { slug: 'calendar-availability-finder', name: 'Calendar Availability Finder' },
  { slug: 'meeting-room-finder', name: 'Meeting Room Finder' },
  { slug: 'invoice-template-generator', name: 'Invoice Template Generator' },
  { slug: 'expense-report-generator', name: 'Expense Report Generator' },
  { slug: 'budget-variance-analyzer', name: 'Budget Variance Analyzer' },
  { slug: 'cost-benefit-analyzer', name: 'Cost Benefit Analyzer' },
  { slug: 'financial-forecast-calculator', name: 'Financial Forecast Calculator' },
];

const languages = ['zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];

const generateTranslation = (slug, name) => ({
  name,
  description: `Free online ${name.toLowerCase()} tool`,
  seo_title: `Free ${name} Online - U2Tool`,
  seo_description: `Use our free online ${name.toLowerCase()} tool. Fast, secure, and no registration required.`,
  detailed_description: `${name} is a powerful online tool that helps you process and convert data efficiently. With an intuitive interface and instant results, it's perfect for developers, designers, and content creators.`,
  usage_steps: [
    'Enter or paste your input data',
    'Configure any necessary options',
    'Click the process button',
    'View the results instantly',
    'Copy or download the output'
  ],
  usage_examples: [
    `Use ${name} for quick data processing`,
    `Integrate with your workflow for efficiency`
  ],
  input: 'Input',
  output: 'Output',
  process: 'Process',
  copy: 'Copy',
  clear: 'Clear',
  inputPlaceholder: 'Enter your input here...',
  outputPlaceholder: 'Results will appear here...',
  errors: {
    emptyInput: 'Please enter some input'
  }
});

// 为每种语言添加翻译
languages.forEach(lang => {
  const filePath = path.join(__dirname, `../src/messages/${lang}.json`);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  ${lang}.json 不存在，跳过`);
    return;
  }
  
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  let addedCount = 0;
  tools.forEach(tool => {
    if (!data.tools[tool.slug]) {
      data.tools[tool.slug] = generateTranslation(tool.slug, tool.name);
      addedCount++;
    }
  });
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
  console.log(`✓ ${lang}.json: 添加 ${addedCount} 个工具翻译`);
});

console.log(`\n✓ 成功为 ${languages.length} 种语言添加翻译`);
