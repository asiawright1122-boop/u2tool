/**
 * 批量生成所有工具的独特描述
 * 自动生成并应用，无需人工干预
 * 
 * 使用方法:
 *   npx tsx scripts/batch-generate-all-descriptions.ts
 *   npx tsx scripts/batch-generate-all-descriptions.ts --start-from <slug>  # 从指定工具开始
 *   npx tsx scripts/batch-generate-all-descriptions.ts --dry-run            # 只生成不应用
 */

import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// 加载环境变量
dotenv.config({ path: '.env.local' });

const SILICONFLOW_API_URL = 'https://api.siliconflow.cn/v1/chat/completions';
const MODEL = 'Qwen/Qwen2.5-72B-Instruct';

const LOCALES = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];

const LOCALE_NAMES: Record<string, string> = {
  en: 'English', zh: 'Chinese (Simplified)', ja: 'Japanese', ko: 'Korean',
  es: 'Spanish', pt: 'Portuguese', fr: 'French', de: 'German', ru: 'Russian', ar: 'Arabic',
};

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
}

// 获取需要改进的工具列表
function getToolsNeedingImprovement(): string[] {
  const enMessages = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'src/messages/en.json'), 'utf-8')
  );
  
  const toolsNeedingWork: Array<{ slug: string; score: number }> = [];
  
  for (const [slug, tool] of Object.entries(enMessages.tools || {})) {
    if (typeof tool !== 'object' || !tool) continue;
    const t = tool as Record<string, unknown>;
    if (!t.name || slug.includes('UI') || slug === 'inputPlaceholder') continue;
    
    let score = 0;
    const desc = t.detailed_description as string || '';
    if (desc.length < 150) score += 3;
    else if (desc.length < 200) score += 1;
    
    const steps = t.usage_steps as string[] || [];
    if (steps.length < 5) score += 2;
    
    const examples = t.usage_examples as string[] || [];
    if (examples.length < 3) score += 2;
    
    if (desc.includes('This tool') || desc.includes('helps you')) score += 1;
    
    if (score > 0) {
      toolsNeedingWork.push({ slug, score });
    }
  }
  
  return toolsNeedingWork.sort((a, b) => b.score - a.score).map(t => t.slug);
}

function getToolInfo(slug: string): ToolInfo | null {
  try {
    const enMessages = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'src/messages/en.json'), 'utf-8')
    );
    const tool = enMessages.tools?.[slug];
    if (!tool) return null;
    
    const toolsConfig = fs.readFileSync(
      path.join(process.cwd(), 'src/config/tools.ts'), 'utf-8'
    );
    const categoryMatch = toolsConfig.match(new RegExp(`slug:\\s*['"]${slug}['"][^}]*category:\\s*['"]([^'"]+)['"]`));
    
    return {
      slug,
      name: tool.name || slug,
      description: tool.description || '',
      category: categoryMatch?.[1] || 'tools',
    };
  } catch {
    return null;
  }
}

function generateDescriptionPrompt(tool: ToolInfo, locale: string): string {
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

Generate content in ${langName} following these requirements:

1. **detailed_description** (200-300 words):
   - Explain WHAT the tool does technically
   - Explain WHY users need this tool (specific use cases)
   - Explain HOW it works (technical details)
   - Include specific technical terms and concepts
   - Make it UNIQUE - different from any other tool description

2. **usage_steps** (exactly 6 steps):
   - Each step should be specific to THIS tool
   - Include actual UI elements or options
   - Be actionable and clear

3. **usage_examples** (exactly 4 examples):
   - Real-world scenarios where this tool is useful
   - Specific and practical
   - Different from each other

Language Style: ${styleGuide}

Output ONLY valid JSON in this exact format:
{
  "detailed_description": "...",
  "usage_steps": ["Step 1...", "Step 2...", "Step 3...", "Step 4...", "Step 5...", "Step 6..."],
  "usage_examples": ["Example 1...", "Example 2...", "Example 3...", "Example 4..."]
}`;
}

async function callSiliconFlowAPI(prompt: string, retries = 3): Promise<string> {
  const apiKey = process.env.SILICONFLOW_API_KEY;
  if (!apiKey) throw new Error('SILICONFLOW_API_KEY not set');

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
          temperature: 0.8,
          max_tokens: 3000,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API failed: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content || '';
    } catch (error) {
      if (i === retries - 1) throw error;
      console.log(`    Retry ${i + 1}/${retries}...`);
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
  throw new Error('Max retries exceeded');
}

function parseDescription(content: string): ToolDescription | null {
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.detailed_description && parsed.usage_steps && parsed.usage_examples) {
        return parsed;
      }
    }
    return null;
  } catch {
    return null;
  }
}

async function generateToolDescriptions(slug: string): Promise<Record<string, ToolDescription>> {
  const tool = getToolInfo(slug);
  if (!tool) throw new Error(`Tool not found: ${slug}`);

  const descriptions: Record<string, ToolDescription> = {};

  for (const locale of LOCALES) {
    process.stdout.write(`  ${locale}...`);
    try {
      const prompt = generateDescriptionPrompt(tool, locale);
      const response = await callSiliconFlowAPI(prompt);
      const parsed = parseDescription(response);
      
      if (parsed) {
        descriptions[locale] = parsed;
        process.stdout.write(' ✓\n');
      } else {
        process.stdout.write(' ✗ (parse failed)\n');
      }
      
      await new Promise(resolve => setTimeout(resolve, 1500));
    } catch (error) {
      process.stdout.write(` ✗ (${error})\n`);
    }
  }

  return descriptions;
}

function applyDescriptions(slug: string, descriptions: Record<string, ToolDescription>): void {
  for (const locale of LOCALES) {
    if (!descriptions[locale]) continue;
    
    const messagesPath = path.join(process.cwd(), `src/messages/${locale}.json`);
    const messages = JSON.parse(fs.readFileSync(messagesPath, 'utf-8'));
    
    if (!messages.tools[slug]) continue;
    
    messages.tools[slug].detailed_description = descriptions[locale].detailed_description;
    messages.tools[slug].usage_steps = descriptions[locale].usage_steps;
    messages.tools[slug].usage_examples = descriptions[locale].usage_examples;
    
    fs.writeFileSync(messagesPath, JSON.stringify(messages, null, 2));
  }
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const startFromIndex = args.indexOf('--start-from');
  const startFrom = startFromIndex !== -1 ? args[startFromIndex + 1] : null;
  
  let tools = getToolsNeedingImprovement();
  console.log(`\n📋 Found ${tools.length} tools needing improvement\n`);
  
  if (startFrom) {
    const idx = tools.indexOf(startFrom);
    if (idx !== -1) {
      tools = tools.slice(idx);
      console.log(`Starting from: ${startFrom} (${tools.length} remaining)\n`);
    }
  }
  
  const outputDir = path.join(process.cwd(), 'generated-descriptions');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  let successCount = 0;
  let failCount = 0;
  const startTime = Date.now();
  
  for (let i = 0; i < tools.length; i++) {
    const slug = tools[i];
    const tool = getToolInfo(slug);
    
    console.log(`\n[${i + 1}/${tools.length}] 📝 ${tool?.name || slug} (${slug})`);
    
    try {
      const descriptions = await generateToolDescriptions(slug);
      const localesGenerated = Object.keys(descriptions).length;
      
      if (localesGenerated > 0) {
        // 保存到文件
        const timestamp = new Date().toISOString().split('T')[0];
        const outputFile = path.join(outputDir, `${slug}-${timestamp}.json`);
        fs.writeFileSync(outputFile, JSON.stringify({ slug, descriptions }, null, 2));
        
        if (!dryRun) {
          applyDescriptions(slug, descriptions);
          console.log(`  ✅ Applied ${localesGenerated}/10 languages`);
        } else {
          console.log(`  📄 Saved (dry-run, ${localesGenerated}/10 languages)`);
        }
        successCount++;
      } else {
        console.log(`  ❌ Failed to generate any content`);
        failCount++;
      }
    } catch (error) {
      console.log(`  ❌ Error: ${error}`);
      failCount++;
    }
    
    // 每 10 个工具暂停一下，避免 API 限流
    if ((i + 1) % 10 === 0) {
      console.log(`\n⏸️  Pausing for 10 seconds...`);
      await new Promise(resolve => setTimeout(resolve, 10000));
    }
  }
  
  const elapsed = Math.round((Date.now() - startTime) / 1000 / 60);
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`📊 BATCH COMPLETE`);
  console.log(`${'='.repeat(50)}`);
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log(`⏱️  Time: ${elapsed} minutes`);
  
  if (!dryRun && successCount > 0) {
    console.log(`\n🔄 Run 'npx tsx scripts/split-translations.ts' to update split files`);
  }
}

main().catch(console.error);
