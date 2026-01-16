/**
 * AI 辅助工具独特描述生成脚本
 * 使用 SiliconFlow API 为工具生成独特的 detailed_description、usage_steps 和 usage_examples
 * 
 * 使用方法:
 *   npx tsx scripts/ai-generate-unique-descriptions.ts <tool-slug>
 *   npx tsx scripts/ai-generate-unique-descriptions.ts --batch [count]  # 批量生成
 *   npx tsx scripts/ai-generate-unique-descriptions.ts --list           # 列出需要改进的工具
 *   npx tsx scripts/ai-generate-unique-descriptions.ts --apply <file>   # 应用生成的内容
 * 
 * 环境变量:
 *   SILICONFLOW_API_KEY - SiliconFlow API 密钥
 */

import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// 加载环境变量
dotenv.config({ path: '.env.local' });

const SILICONFLOW_API_URL = 'https://api.siliconflow.cn/v1/chat/completions';
const MODEL = 'Qwen/Qwen2.5-72B-Instruct'; // 使用更大的模型以获得更好的质量

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

// 语言特定的写作风格指导
const LOCALE_STYLE_GUIDES: Record<string, string> = {
  en: 'Use clear, professional American English. Include technical terms where appropriate.',
  zh: '使用简洁专业的中文表达，适当使用技术术语，符合中国用户的阅读习惯。',
  ja: '丁寧で専門的な日本語を使用してください。技術用語は適切に使用してください。',
  ko: '전문적이고 명확한 한국어를 사용하세요. 기술 용어를 적절히 포함하세요.',
  es: 'Usa español claro y profesional. Incluye términos técnicos cuando sea apropiado.',
  pt: 'Use português brasileiro claro e profissional. Inclua termos técnicos quando apropriado.',
  fr: 'Utilisez un français clair et professionnel. Incluez des termes techniques si nécessaire.',
  de: 'Verwenden Sie klares, professionelles Deutsch. Fügen Sie technische Begriffe ein, wo es angemessen ist.',
  ru: 'Используйте ясный, профессиональный русский язык. Включайте технические термины где уместно.',
  ar: 'استخدم اللغة العربية الفصحى الواضحة والمهنية. قم بتضمين المصطلحات التقنية عند الاقتضاء.',
};

interface ToolDescription {
  detailed_description: string;
  usage_steps: string[];
  usage_examples: string[];
}

interface ToolInfo {
  slug: string;
  name: string;
  description: string;
  category: string;
  component?: string;
}

// 工具类别的技术背景知识
const CATEGORY_CONTEXT: Record<string, string> = {
  'text': 'Text processing tools help users manipulate, transform, and analyze text content.',
  'encoding': 'Encoding tools convert data between different formats like Base64, URL encoding, HTML entities.',
  'formatting': 'Formatting tools help structure and beautify code or data for better readability.',
  'conversion': 'Conversion tools transform data from one format to another.',
  'generators': 'Generator tools create various types of content, codes, or data.',
  'calculators': 'Calculator tools perform mathematical or specialized calculations.',
  'validators': 'Validator tools check if data conforms to specific formats or standards.',
  'security': 'Security tools help with encryption, hashing, and secure data handling.',
  'image': 'Image tools process, convert, or manipulate image files.',
  'development': 'Development tools assist programmers with coding tasks.',
  'time': 'Time tools help with date/time conversions and calculations.',
  'color': 'Color tools help with color format conversions and palette generation.',
};

// 从翻译文件获取工具信息
function getToolInfo(slug: string): ToolInfo | null {
  try {
    const enMessages = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'src/messages/en.json'), 'utf-8')
    );
    const tool = enMessages.tools?.[slug];
    if (!tool) return null;
    
    // 尝试从 tools.ts 获取更多信息
    const toolsConfig = fs.readFileSync(
      path.join(process.cwd(), 'src/config/tools.ts'),
      'utf-8'
    );
    
    const categoryMatch = toolsConfig.match(new RegExp(`slug:\\s*['"]${slug}['"][^}]*category:\\s*['"]([^'"]+)['"]`));
    const componentMatch = toolsConfig.match(new RegExp(`slug:\\s*['"]${slug}['"][^}]*component:\\s*['"]([^'"]+)['"]`));
    
    return {
      slug,
      name: tool.name || slug,
      description: tool.description || '',
      category: categoryMatch?.[1] || 'tools',
      component: componentMatch?.[1],
    };
  } catch {
    return null;
  }
}

// 尝试读取组件源码以获取更多上下文
function getComponentContext(componentName: string): string {
  try {
    const componentPath = path.join(process.cwd(), `src/components/tools/${componentName}.tsx`);
    if (fs.existsSync(componentPath)) {
      const content = fs.readFileSync(componentPath, 'utf-8');
      // 提取关键功能信息（前 100 行或注释）
      const lines = content.split('\n').slice(0, 100);
      const relevantLines = lines.filter(line => 
        line.includes('//') || 
        line.includes('useState') || 
        line.includes('function') ||
        line.includes('const ')
      ).slice(0, 20);
      return relevantLines.join('\n');
    }
  } catch {
    // 忽略错误
  }
  return '';
}

// 生成描述的 prompt
function generateDescriptionPrompt(tool: ToolInfo, locale: string, componentContext: string): string {
  const langName = LOCALE_NAMES[locale] || 'English';
  const styleGuide = LOCALE_STYLE_GUIDES[locale] || LOCALE_STYLE_GUIDES.en;
  const categoryContext = CATEGORY_CONTEXT[tool.category] || '';
  
  return `You are an expert technical writer creating UNIQUE content for a free online developer tool website.

CRITICAL: Generate completely UNIQUE content. Do NOT use generic templates or phrases like:
- "This tool helps you..."
- "Easy to use..."
- "Free online tool..."
- "Simply enter your data..."

Tool Information:
- Name: ${tool.name}
- Slug: ${tool.slug}
- Category: ${tool.category}
- Brief Description: ${tool.description}
${categoryContext ? `- Category Context: ${categoryContext}` : ''}
${componentContext ? `\nComponent Code Hints:\n${componentContext}` : ''}

Generate content in ${langName} following these requirements:

1. **detailed_description** (200-300 words):
   - Explain WHAT the tool does technically
   - Explain WHY users need this tool (specific use cases)
   - Explain HOW it works (technical details)
   - Include specific technical terms and concepts
   - Mention compatibility, limitations, or best practices
   - Make it UNIQUE - different from any other tool description

2. **usage_steps** (exactly 6 steps):
   - Each step should be specific to THIS tool
   - Include actual UI elements or options
   - Be actionable and clear
   - NOT generic steps like "Open the tool" or "Click submit"

3. **usage_examples** (exactly 4 examples):
   - Real-world scenarios where this tool is useful
   - Specific and practical
   - Different from each other
   - Include the type of user who would use it

Language Style: ${styleGuide}

Output ONLY valid JSON in this exact format:
{
  "detailed_description": "...",
  "usage_steps": ["Step 1...", "Step 2...", "Step 3...", "Step 4...", "Step 5...", "Step 6..."],
  "usage_examples": ["Example 1...", "Example 2...", "Example 3...", "Example 4..."]
}`;
}

// 调用 SiliconFlow API
async function callSiliconFlowAPI(prompt: string, retries = 3): Promise<string> {
  const apiKey = process.env.SILICONFLOW_API_KEY;
  if (!apiKey) {
    throw new Error('SILICONFLOW_API_KEY environment variable is not set');
  }

  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(SILICONFLOW_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.8, // 稍高的温度以增加多样性
          max_tokens: 3000,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content || '';
    } catch (error) {
      if (i === retries - 1) throw error;
      console.log(`  Retry ${i + 1}/${retries}...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  throw new Error('Max retries exceeded');
}

// 解析描述 JSON
function parseDescription(content: string): ToolDescription | null {
  try {
    // 尝试提取 JSON 对象
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.detailed_description && parsed.usage_steps && parsed.usage_examples) {
        return parsed;
      }
    }
    return JSON.parse(content);
  } catch (error) {
    console.error('Failed to parse description JSON:', error);
    console.error('Content:', content.substring(0, 500));
    return null;
  }
}

// 为单个工具生成所有语言的描述
async function generateToolDescriptions(slug: string): Promise<Record<string, ToolDescription>> {
  const tool = getToolInfo(slug);
  if (!tool) {
    throw new Error(`Tool not found: ${slug}`);
  }

  console.log(`\n📝 Generating descriptions for: ${tool.name} (${slug})`);
  const descriptions: Record<string, ToolDescription> = {};
  
  // 获取组件上下文
  const componentContext = tool.component ? getComponentContext(tool.component) : '';

  for (const locale of LOCALES) {
    console.log(`  - Generating ${LOCALE_NAMES[locale]}...`);
    try {
      const prompt = generateDescriptionPrompt(tool, locale, componentContext);
      const response = await callSiliconFlowAPI(prompt);
      const parsed = parseDescription(response);
      
      if (parsed) {
        descriptions[locale] = parsed;
        console.log(`    ✓ Generated (${parsed.detailed_description.length} chars)`);
      } else {
        console.log(`    ✗ Failed to parse response`);
      }
      
      // 添加延迟避免 API 限流
      await new Promise(resolve => setTimeout(resolve, 1500));
    } catch (error) {
      console.error(`    ✗ Error: ${error}`);
    }
  }

  return descriptions;
}

// 获取需要改进描述的工具列表
function getToolsNeedingImprovement(): string[] {
  const enMessages = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'src/messages/en.json'), 'utf-8')
  );
  
  const toolsNeedingWork: Array<{ slug: string; score: number }> = [];
  
  for (const [slug, tool] of Object.entries(enMessages.tools || {})) {
    if (typeof tool !== 'object' || !tool) continue;
    const t = tool as Record<string, unknown>;
    
    // 跳过非工具条目
    if (!t.name || slug.includes('UI') || slug === 'inputPlaceholder') continue;
    
    let score = 0;
    
    // 检查 detailed_description
    const desc = t.detailed_description as string || '';
    if (desc.length < 150) score += 3;
    else if (desc.length < 200) score += 1;
    
    // 检查 usage_steps
    const steps = t.usage_steps as string[] || [];
    if (steps.length < 5) score += 2;
    
    // 检查 usage_examples
    const examples = t.usage_examples as string[] || [];
    if (examples.length < 3) score += 2;
    
    // 检查是否使用模板化语言
    if (desc.includes('This tool') || desc.includes('helps you')) score += 1;
    
    if (score > 0) {
      toolsNeedingWork.push({ slug, score });
    }
  }
  
  // 按分数排序（分数越高越需要改进）
  return toolsNeedingWork
    .sort((a, b) => b.score - a.score)
    .map(t => t.slug);
}

// 保存生成的内容到文件
function saveGeneratedContent(slug: string, descriptions: Record<string, ToolDescription>): string {
  const timestamp = new Date().toISOString().split('T')[0];
  const outputDir = path.join(process.cwd(), 'generated-descriptions');
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const outputFile = path.join(outputDir, `${slug}-${timestamp}.json`);
  fs.writeFileSync(outputFile, JSON.stringify({ slug, descriptions }, null, 2));
  
  return outputFile;
}

// 应用生成的内容到翻译文件
function applyGeneratedContent(inputFile: string): void {
  const content = JSON.parse(fs.readFileSync(inputFile, 'utf-8'));
  const { slug, descriptions } = content;
  
  console.log(`\n📥 Applying descriptions for: ${slug}`);
  
  for (const locale of LOCALES) {
    if (!descriptions[locale]) {
      console.log(`  - ${locale}: No content, skipping`);
      continue;
    }
    
    const messagesPath = path.join(process.cwd(), `src/messages/${locale}.json`);
    const messages = JSON.parse(fs.readFileSync(messagesPath, 'utf-8'));
    
    if (!messages.tools[slug]) {
      console.log(`  - ${locale}: Tool not found in messages, skipping`);
      continue;
    }
    
    // 更新内容
    messages.tools[slug].detailed_description = descriptions[locale].detailed_description;
    messages.tools[slug].usage_steps = descriptions[locale].usage_steps;
    messages.tools[slug].usage_examples = descriptions[locale].usage_examples;
    
    fs.writeFileSync(messagesPath, JSON.stringify(messages, null, 2));
    console.log(`  ✓ ${locale}: Updated`);
  }
  
  console.log('\n✓ Content applied. Run `npx tsx scripts/split-translations.ts` to update split files.');
}

// 主函数
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
AI Tool Description Generator - Generate UNIQUE content for SEO

Usage:
  npx tsx scripts/ai-generate-unique-descriptions.ts <tool-slug>     Generate for a specific tool
  npx tsx scripts/ai-generate-unique-descriptions.ts --batch [N]     Generate for N tools (default: 5)
  npx tsx scripts/ai-generate-unique-descriptions.ts --list          List tools needing improvement
  npx tsx scripts/ai-generate-unique-descriptions.ts --apply <file>  Apply generated content

Environment:
  SILICONFLOW_API_KEY    Required. Your SiliconFlow API key.

Output:
  Generated content is saved to ./generated-descriptions/<slug>-<date>.json
  Review before applying with --apply
`);
    return;
  }

  if (args.includes('--list')) {
    const tools = getToolsNeedingImprovement();
    console.log(`\n📋 Tools needing improvement (${tools.length}):\n`);
    tools.slice(0, 50).forEach((slug, i) => {
      const info = getToolInfo(slug);
      console.log(`  ${i + 1}. ${slug} - ${info?.name || 'Unknown'}`);
    });
    if (tools.length > 50) {
      console.log(`  ... and ${tools.length - 50} more`);
    }
    return;
  }

  if (args.includes('--apply')) {
    const fileIndex = args.indexOf('--apply') + 1;
    const file = args[fileIndex];
    if (!file) {
      console.error('Please provide a file path');
      process.exit(1);
    }
    applyGeneratedContent(file);
    return;
  }

  if (args.includes('--batch')) {
    const countIndex = args.indexOf('--batch') + 1;
    const count = parseInt(args[countIndex]) || 5;
    const tools = getToolsNeedingImprovement().slice(0, count);
    
    console.log(`\n🚀 Generating descriptions for ${tools.length} tools...\n`);
    
    const generatedFiles: string[] = [];
    for (const slug of tools) {
      try {
        const descriptions = await generateToolDescriptions(slug);
        if (Object.keys(descriptions).length > 0) {
          const file = saveGeneratedContent(slug, descriptions);
          generatedFiles.push(file);
          console.log(`  ✓ Saved to: ${file}`);
        }
      } catch (error) {
        console.error(`  ✗ Failed for ${slug}:`, error);
      }
    }

    console.log(`\n✓ Generated ${generatedFiles.length} files`);
    console.log('\nNext steps:');
    console.log('1. Review generated files in ./generated-descriptions/');
    console.log('2. Apply with: npx tsx scripts/ai-generate-unique-descriptions.ts --apply <file>');
    return;
  }

  // 单个工具
  const slug = args[0];
  if (!slug) {
    console.error('Please provide a tool slug or use --batch');
    process.exit(1);
  }

  try {
    const descriptions = await generateToolDescriptions(slug);
    if (Object.keys(descriptions).length > 0) {
      const file = saveGeneratedContent(slug, descriptions);
      console.log(`\n✓ Saved to: ${file}`);
      console.log('\nTo apply: npx tsx scripts/ai-generate-unique-descriptions.ts --apply ' + file);
    }
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main().catch(console.error);
