/**
 * 为 Batch 54 工具生成个性化翻译内容
 * 
 * 使用方法:
 *   npx tsx scripts/generate-batch54-personalized-translations.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const CONFIG = {
  apiUrl: 'https://api.siliconflow.cn/v1/chat/completions',
  messagesDir: path.join(process.cwd(), 'src', 'messages'),
  model: 'Qwen/Qwen2.5-7B-Instruct',
};

// Batch 54 工具列表及其描述
const BATCH54_TOOLS: Record<string, { category: string; purpose: string }> = {
  // API & Network Tools
  'curl-to-code-generator': {
    category: 'API & Network',
    purpose: 'Convert cURL commands to code in various programming languages (Python, JavaScript, Go, PHP, etc.)'
  },
  'http-status-code-reference': {
    category: 'API & Network',
    purpose: 'Quick reference for HTTP status codes with explanations and solutions'
  },
  'jwt-payload-decoder': {
    category: 'API & Network',
    purpose: 'Decode and inspect JWT token payloads without verification'
  },
  'base64-image-converter': {
    category: 'API & Network',
    purpose: 'Convert images to Base64 strings and vice versa'
  },
  'url-query-string-parser': {
    category: 'API & Network',
    purpose: 'Parse and analyze URL query strings into key-value pairs'
  },
  'request-header-builder': {
    category: 'API & Network',
    purpose: 'Build and format HTTP request headers for API testing'
  },
  'webhook-tester': {
    category: 'API & Network',
    purpose: 'Test and debug webhook endpoints with custom payloads'
  },
  'api-response-formatter': {
    category: 'API & Network',
    purpose: 'Format and beautify API responses (JSON, XML) for readability'
  },
  
  // Code Conversion Tools
  'sql-to-mongodb-converter': {
    category: 'Code Conversion',
    purpose: 'Convert SQL queries to MongoDB query syntax'
  },
  'json-to-protobuf-converter': {
    category: 'Code Conversion',
    purpose: 'Generate Protocol Buffer definitions from JSON data'
  },
  'regex-to-code-generator': {
    category: 'Code Conversion',
    purpose: 'Generate code snippets for regex patterns in multiple languages'
  },
  'swagger-to-code-generator': {
    category: 'Code Conversion',
    purpose: 'Generate API client code from Swagger/OpenAPI specifications'
  },
  'database-migration-generator': {
    category: 'Code Conversion',
    purpose: 'Generate database migration scripts for schema changes'
  },
  'environment-variables-generator': {
    category: 'Code Conversion',
    purpose: 'Generate .env files and environment variable configurations'
  },
  'docker-compose-generator-advanced': {
    category: 'Code Conversion',
    purpose: 'Generate Docker Compose configurations for multi-container applications'
  },
  'kubernetes-manifest-generator': {
    category: 'Code Conversion',
    purpose: 'Generate Kubernetes deployment manifests (YAML)'
  },
  
  // Code Analysis Tools
  'code-complexity-analyzer': {
    category: 'Code Analysis',
    purpose: 'Analyze code complexity metrics (cyclomatic complexity, lines of code)'
  },
  'dependency-vulnerability-checker': {
    category: 'Code Analysis',
    purpose: 'Check package dependencies for known security vulnerabilities'
  },
  'performance-profiler': {
    category: 'Code Analysis',
    purpose: 'Profile code performance and identify bottlenecks'
  },
  'memory-leak-detector': {
    category: 'Code Analysis',
    purpose: 'Detect potential memory leaks in code patterns'
  },
  'code-duplication-finder': {
    category: 'Code Analysis',
    purpose: 'Find duplicate code blocks and suggest refactoring'
  },
  'unused-imports-finder': {
    category: 'Code Analysis',
    purpose: 'Identify unused imports and dependencies in code'
  },
  'dead-code-analyzer': {
    category: 'Code Analysis',
    purpose: 'Find unreachable or dead code that can be removed'
  },
  
  // Database Tools
  'sql-query-optimizer': {
    category: 'Database',
    purpose: 'Analyze and optimize SQL queries for better performance'
  },
  'database-schema-visualizer': {
    category: 'Database',
    purpose: 'Visualize database schemas and table relationships'
  },
  'sql-injection-tester': {
    category: 'Database',
    purpose: 'Test SQL queries for injection vulnerabilities'
  },
  'database-connection-tester': {
    category: 'Database',
    purpose: 'Test database connection strings and configurations'
  },
  'query-execution-planner': {
    category: 'Database',
    purpose: 'Analyze query execution plans and suggest optimizations'
  },
  'database-backup-scheduler': {
    category: 'Database',
    purpose: 'Generate backup schedules and scripts for databases'
  },
  
  // Version Control Tools
  'git-commit-message-generator': {
    category: 'Version Control',
    purpose: 'Generate conventional commit messages following best practices'
  },
  'git-branch-naming-validator': {
    category: 'Version Control',
    purpose: 'Validate Git branch names against naming conventions'
  },
  'merge-conflict-resolver': {
    category: 'Version Control',
    purpose: 'Help resolve Git merge conflicts with visual diff'
  },
  'git-history-visualizer': {
    category: 'Version Control',
    purpose: 'Visualize Git commit history and branch structure'
  },
  'changelog-generator-advanced': {
    category: 'Version Control',
    purpose: 'Generate changelogs from Git commits in various formats'
  },
  'git-tag-manager': {
    category: 'Version Control',
    purpose: 'Manage and organize Git tags for releases'
  },
  
  // Document Management Tools
  'markdown-to-html-converter': {
    category: 'Document Management',
    purpose: 'Convert Markdown documents to HTML with styling options'
  },
  'document-outline-generator': {
    category: 'Document Management',
    purpose: 'Generate document outlines from headings and structure'
  },
  'table-of-contents-generator': {
    category: 'Document Management',
    purpose: 'Create table of contents from document headings'
  },
  'document-word-counter': {
    category: 'Document Management',
    purpose: 'Count words, characters, sentences, and paragraphs in documents'
  },
  'document-formatter': {
    category: 'Document Management',
    purpose: 'Format and clean up document text with various options'
  },
  'citation-formatter': {
    category: 'Document Management',
    purpose: 'Format citations in APA, MLA, Chicago, and other styles'
  },
  
  // Project Management Tools
  'project-estimation-calculator': {
    category: 'Project Management',
    purpose: 'Calculate project effort estimates using various methods (PERT, story points)'
  },
  'sprint-velocity-calculator': {
    category: 'Project Management',
    purpose: 'Calculate and track sprint velocity for agile teams'
  },
  'resource-allocation-planner': {
    category: 'Project Management',
    purpose: 'Plan and optimize resource allocation across projects'
  },
  'project-risk-analyzer': {
    category: 'Project Management',
    purpose: 'Identify and assess project risks with mitigation strategies'
  },
  'milestone-tracker': {
    category: 'Project Management',
    purpose: 'Track project milestones and deadlines'
  },
  'team-capacity-planner': {
    category: 'Project Management',
    purpose: 'Plan team capacity and workload distribution'
  },
  
  // Meeting & Schedule Tools
  'meeting-minutes-generator': {
    category: 'Meeting & Schedule',
    purpose: 'Generate structured meeting minutes from notes'
  },
  'timezone-meeting-scheduler': {
    category: 'Meeting & Schedule',
    purpose: 'Schedule meetings across multiple time zones'
  },
  'meeting-agenda-builder': {
    category: 'Meeting & Schedule',
    purpose: 'Create structured meeting agendas with time allocations'
  },
  'calendar-availability-finder': {
    category: 'Meeting & Schedule',
    purpose: 'Find common available time slots across calendars'
  },
  'meeting-room-finder': {
    category: 'Meeting & Schedule',
    purpose: 'Find and book available meeting rooms'
  },
  
  // Finance & Budget Tools
  'invoice-template-generator': {
    category: 'Finance & Budget',
    purpose: 'Generate professional invoice templates with customization'
  },
  'expense-report-generator': {
    category: 'Finance & Budget',
    purpose: 'Create expense reports with categorization and totals'
  },
  'budget-variance-analyzer': {
    category: 'Finance & Budget',
    purpose: 'Analyze budget vs actual spending variances'
  },
  'cost-benefit-analyzer': {
    category: 'Finance & Budget',
    purpose: 'Calculate ROI and analyze cost-benefit ratios'
  },
  'financial-forecast-calculator': {
    category: 'Finance & Budget',
    purpose: 'Create financial forecasts using various models'
  },
};

interface ToolTranslation {
  name: string;
  description: string;
  seo_title: string;
  seo_description: string;
  detailed_description: string;
  usage_steps: string[];
  usage_examples: string[];
  input?: string;
  output?: string;
  process?: string;
  copy?: string;
  clear?: string;
  inputPlaceholder?: string;
  outputPlaceholder?: string;
  errors?: {
    emptyInput?: string;
  };
}

async function generatePersonalizedContent(
  toolSlug: string,
  toolInfo: { category: string; purpose: string }
): Promise<ToolTranslation | null> {
  const apiKey = process.env.SILICONFLOW_API_KEY;
  
  if (!apiKey) {
    console.error('❌ 错误: 请设置 SILICONFLOW_API_KEY 环境变量');
    process.exit(1);
  }

  const toolName = toolSlug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const systemPrompt = `You are an expert technical writer creating content for a free online tools website.

Your task is to create personalized, SEO-optimized content for a developer/office tool.

## Requirements:

### 1. Content Quality
- Write clear, professional, and helpful content
- Be specific about what the tool does and how it helps users
- Use action-oriented language
- Highlight key benefits: free, online, no registration, instant results

### 2. SEO Optimization
- seo_title: Include primary keyword, "Free", "Online", max 60 characters
- seo_description: Include keywords, benefits, call-to-action, 150-160 characters

### 3. Content Structure
- name: Clear, concise tool name
- description: One sentence describing the tool's main function
- detailed_description: 2-3 sentences explaining features, benefits, and use cases
- usage_steps: 5 specific steps for using THIS tool (not generic steps)
- usage_examples: 3 real-world use cases specific to THIS tool

### 4. Output Format
Return ONLY valid JSON with this exact structure:
{
  "name": "Tool Name",
  "description": "Brief description",
  "seo_title": "Free Tool Name Online - Feature | U2Tool",
  "seo_description": "Use our free online tool to... Benefits and call-to-action.",
  "detailed_description": "Detailed explanation of the tool...",
  "usage_steps": ["Step 1", "Step 2", "Step 3", "Step 4", "Step 5"],
  "usage_examples": ["Example 1", "Example 2", "Example 3"]
}`;

  const userPrompt = `Create personalized content for this tool:

Tool Slug: ${toolSlug}
Tool Name: ${toolName}
Category: ${toolInfo.category}
Purpose: ${toolInfo.purpose}

Generate specific, helpful content that accurately describes what this tool does. The usage_steps and usage_examples must be specific to THIS tool's functionality, not generic.`;

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
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`❌ API 错误:`, error);
      return null;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.error(`❌ 空响应`);
      return null;
    }

    // 解析 JSON
    let jsonStr = content.trim();
    if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }

    const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]) as ToolTranslation;
      
      // 添加通用字段
      return {
        ...parsed,
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
      };
    }

    return null;
  } catch (error) {
    console.error(`❌ 生成失败:`, error);
    return null;
  }
}

function readJsonFile(filePath: string): Record<string, unknown> {
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
}

function writeJsonFile(filePath: string, data: Record<string, unknown>): void {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
}

async function main(): Promise<void> {
  console.log('🚀 开始为 Batch 54 工具生成个性化英文翻译...\n');

  const enPath = path.join(CONFIG.messagesDir, 'en.json');
  const enData = readJsonFile(enPath) as { tools: Record<string, ToolTranslation> };

  const toolSlugs = Object.keys(BATCH54_TOOLS);
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < toolSlugs.length; i++) {
    const toolSlug = toolSlugs[i];
    const toolInfo = BATCH54_TOOLS[toolSlug];

    process.stdout.write(`[${i + 1}/${toolSlugs.length}] 生成 ${toolSlug}... `);

    const content = await generatePersonalizedContent(toolSlug, toolInfo);

    if (content) {
      enData.tools[toolSlug] = content;
      console.log('✅');
      successCount++;
    } else {
      console.log('❌');
      failCount++;
    }

    // 每 10 个工具保存一次
    if ((i + 1) % 10 === 0) {
      writeJsonFile(enPath, enData);
      console.log(`   💾 已保存进度 (${i + 1}/${toolSlugs.length})`);
    }

    // 添加延迟避免 API 限流
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // 最终保存
  writeJsonFile(enPath, enData);

  console.log('\n📊 生成完成:');
  console.log(`   成功: ${successCount}/${toolSlugs.length}`);
  if (failCount > 0) {
    console.log(`   失败: ${failCount}/${toolSlugs.length}`);
  }

  console.log('\n📋 后续步骤:');
  console.log('   1. 运行翻译脚本将英文翻译到其他语言');
  console.log('   2. 运行 npx tsx scripts/split-translations.ts 更新拆分文件');
}

main().catch(console.error);
