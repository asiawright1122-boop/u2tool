/**
 * AI 辅助工具 FAQ 生成脚本
 * 使用 SiliconFlow API 为工具生成特定的 FAQ 内容
 * 
 * 使用方法:
 *   npx tsx scripts/ai-generate-tool-faqs.ts <tool-slug>
 *   npx tsx scripts/ai-generate-tool-faqs.ts --batch  # 批量生成
 * 
 * 环境变量:
 *   SILICONFLOW_API_KEY - SiliconFlow API 密钥
 */

import * as fs from 'fs';
import * as path from 'path';

const SILICONFLOW_API_URL = 'https://api.siliconflow.cn/v1/chat/completions';
const MODEL = 'Qwen/Qwen2.5-7B-Instruct';

// 支持的语言
const LOCALES = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];

// 语言名称映射
const LOCALE_NAMES: Record<string, string> = {
  en: 'English',
  zh: 'Chinese (Simplified)',
  ja: 'Japanese',
  ko: 'Korean',
  es: 'Spanish',
  pt: 'Portuguese',
  fr: 'French',
  de: 'German',
  ru: 'Russian',
  ar: 'Arabic',
};

interface FAQ {
  question: string;
  answer: string;
}

interface ToolInfo {
  slug: string;
  name: string;
  description: string;
  category: string;
}

// 从翻译文件获取工具信息
function getToolInfo(slug: string): ToolInfo | null {
  try {
    const enMessages = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'src/messages/en.json'), 'utf-8')
    );
    const tool = enMessages.tools?.[slug];
    if (!tool) return null;
    
    return {
      slug,
      name: tool.name || slug,
      description: tool.description || '',
      category: tool.category || 'tools',
    };
  } catch {
    return null;
  }
}


// 生成 FAQ 的 prompt
function generateFAQPrompt(tool: ToolInfo, locale: string): string {
  const langName = LOCALE_NAMES[locale] || 'English';
  
  return `You are an SEO expert creating FAQ content for a free online developer tool.

Tool Information:
- Name: ${tool.name}
- Description: ${tool.description}
- Category: ${tool.category}

Generate exactly 5 FAQs in ${langName} for this tool. Each FAQ should:
1. Target long-tail keywords that users actually search for
2. Provide detailed, helpful answers (50-100 words each)
3. Include practical use cases and tips
4. Be unique and specific to this tool (not generic)
5. Help with both SEO and AI citation (GEO)

Format your response as valid JSON array:
[
  {"question": "...", "answer": "..."},
  {"question": "...", "answer": "..."},
  ...
]

Important:
- Questions should start with "How", "What", "Why", "Can", "Is"
- Include the tool name naturally in questions
- Answers should be informative and actionable
- For ${langName}, use natural, native expressions (not direct translations)
- Focus on user intent and common problems

Output ONLY the JSON array, no other text.`;
}

// 调用 SiliconFlow API
async function callSiliconFlowAPI(prompt: string): Promise<string> {
  const apiKey = process.env.SILICONFLOW_API_KEY;
  if (!apiKey) {
    throw new Error('SILICONFLOW_API_KEY environment variable is not set');
  }

  const response = await fetch(SILICONFLOW_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

// 解析 FAQ JSON
function parseFAQs(content: string): FAQ[] {
  try {
    // 尝试提取 JSON 数组
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(content);
  } catch (error) {
    console.error('Failed to parse FAQ JSON:', error);
    console.error('Content:', content);
    return [];
  }
}

// 为单个工具生成所有语言的 FAQ
async function generateToolFAQs(slug: string): Promise<Record<string, FAQ[]>> {
  const tool = getToolInfo(slug);
  if (!tool) {
    throw new Error(`Tool not found: ${slug}`);
  }

  console.log(`\nGenerating FAQs for: ${tool.name} (${slug})`);
  const faqs: Record<string, FAQ[]> = {};

  for (const locale of LOCALES) {
    console.log(`  - Generating ${LOCALE_NAMES[locale]}...`);
    try {
      const prompt = generateFAQPrompt(tool, locale);
      const response = await callSiliconFlowAPI(prompt);
      const parsedFAQs = parseFAQs(response);
      
      if (parsedFAQs.length > 0) {
        faqs[locale] = parsedFAQs;
        console.log(`    ✓ Generated ${parsedFAQs.length} FAQs`);
      } else {
        console.log(`    ✗ Failed to generate FAQs`);
      }
      
      // 添加延迟避免 API 限流
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`    ✗ Error: ${error}`);
    }
  }

  return faqs;
}


// 生成 TypeScript 代码
function generateTypeScriptCode(slug: string, faqs: Record<string, FAQ[]>): string {
  const faqsJson = JSON.stringify(faqs, null, 2)
    .replace(/"([^"]+)":/g, '$1:')  // 移除属性名的引号
    .replace(/"/g, "'");  // 使用单引号

  return `  // ${slug}
  {
    slug: '${slug}',
    faqs: ${faqsJson},
  },`;
}

// 获取需要生成 FAQ 的工具列表
function getToolsNeedingFAQs(): string[] {
  // 读取现有的 FAQ 配置
  const existingSlugs = new Set<string>();
  
  const faqFiles = [
    'src/lib/tool-specific-faqs.ts',
    'src/lib/tool-specific-faqs-extra.ts',
    'src/lib/tool-specific-faqs-extra-2.ts',
  ];

  for (const file of faqFiles) {
    try {
      const content = fs.readFileSync(path.join(process.cwd(), file), 'utf-8');
      const slugMatches = content.matchAll(/slug:\s*['"]([^'"]+)['"]/g);
      for (const match of slugMatches) {
        existingSlugs.add(match[1]);
      }
    } catch {
      // 文件不存在，忽略
    }
  }

  // 读取工具配置
  const toolsConfig = fs.readFileSync(
    path.join(process.cwd(), 'src/config/tools.ts'),
    'utf-8'
  );

  // 提取热门工具
  const popularTools: string[] = [];
  const toolMatches = toolsConfig.matchAll(/slug:\s*['"]([^'"]+)['"].*?popular:\s*true/gs);
  for (const match of toolMatches) {
    const slug = match[1];
    if (!existingSlugs.has(slug)) {
      popularTools.push(slug);
    }
  }

  return popularTools;
}

// 主函数
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
AI Tool FAQ Generator

Usage:
  npx tsx scripts/ai-generate-tool-faqs.ts <tool-slug>     Generate FAQs for a specific tool
  npx tsx scripts/ai-generate-tool-faqs.ts --batch         Generate FAQs for all tools without FAQs
  npx tsx scripts/ai-generate-tool-faqs.ts --list          List tools that need FAQs

Environment:
  SILICONFLOW_API_KEY    Required. Your SiliconFlow API key.
`);
    return;
  }

  if (args.includes('--list')) {
    const tools = getToolsNeedingFAQs();
    console.log(`\nTools needing FAQs (${tools.length}):\n`);
    tools.forEach((slug, i) => console.log(`  ${i + 1}. ${slug}`));
    return;
  }

  if (args.includes('--batch')) {
    const tools = getToolsNeedingFAQs().slice(0, 10); // 每次处理 10 个
    console.log(`\nGenerating FAQs for ${tools.length} tools...\n`);
    
    const results: string[] = [];
    for (const slug of tools) {
      try {
        const faqs = await generateToolFAQs(slug);
        if (Object.keys(faqs).length > 0) {
          results.push(generateTypeScriptCode(slug, faqs));
        }
      } catch (error) {
        console.error(`Failed to generate FAQs for ${slug}:`, error);
      }
    }

    if (results.length > 0) {
      const outputFile = `src/lib/tool-specific-faqs-batch${Date.now()}.ts`;
      const output = `/**
 * AI 生成的工具 FAQ - ${new Date().toISOString().split('T')[0]}
 * 由 scripts/ai-generate-tool-faqs.ts 生成
 */

import type { FAQItem } from './faq';

export interface ToolSpecificFAQ {
  slug: string;
  faqs: Record<string, FAQItem[]>;
}

export const GENERATED_TOOL_FAQS: ToolSpecificFAQ[] = [
${results.join('\n\n')}
];
`;
      fs.writeFileSync(path.join(process.cwd(), outputFile), output);
      console.log(`\n✓ Generated FAQs saved to: ${outputFile}`);
      console.log('\nNext steps:');
      console.log('1. Review the generated FAQs');
      console.log('2. Import and merge into tool-specific-faqs.ts');
    }
    return;
  }

  // 单个工具
  const slug = args[0];
  if (!slug) {
    console.error('Please provide a tool slug or use --batch');
    process.exit(1);
  }

  try {
    const faqs = await generateToolFAQs(slug);
    console.log('\n--- Generated TypeScript Code ---\n');
    console.log(generateTypeScriptCode(slug, faqs));
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main().catch(console.error);
