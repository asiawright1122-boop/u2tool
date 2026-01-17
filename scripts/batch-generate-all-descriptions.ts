/**
 * 批量生成所有工具的独特描述
 * 自动生成并应用，无需人工干预
 * 
 * 使用方法:
 *   npx tsx scripts/batch-generate-all-descriptions.ts
 *   npx tsx scripts/batch-generate-all-descriptions.ts --start-from <slug>  # 从指定工具开始
 *   npx tsx scripts/batch-generate-all-descriptions.ts --dry-run            # 只生成不应用
 * 
 * 选择 AI 模型 (--provider):
 *   免费模型:
 *     --provider hunyuan-free     # 腾讯混元翻译 (完全免费，默认)
 * 
 *   NVIDIA NIM (免费额度，需要 NVIDIA_API_KEY):
 *     --provider nvidia-llama3-8b    # Llama 3 8B
 *     --provider nvidia-llama3-70b   # Llama 3 70B
 *     --provider nvidia-mistral-7b   # Mistral 7B
 *     --provider nvidia-mixtral-8x7b # Mixtral 8x7B
 *     --provider nvidia-gemma-7b     # Gemma 7B
 *     --provider nvidia-qwen2-7b     # Qwen2 7B
 *     --provider nvidia-deepseek-r1  # DeepSeek R1
 * 
 *   超低价模型 ($0.02/M tokens):
 *     --provider deepseek-r1-1.5b # DeepSeek-R1-Distill-Qwen-1.5B
 * 
 *   低价模型 ($0.05-$0.06/M tokens):
 *     --provider qwen2.5-7b       # Qwen2.5-7B-Instruct
 *     --provider deepseek-r1-7b   # DeepSeek-R1-Distill-Qwen-7B
 *     --provider llama-3.1-8b     # Meta-Llama-3.1-8B-Instruct
 *     --provider qwen3-8b         # Qwen3-8B
 *     --provider deepseek-r1-8b   # DeepSeek-R1-Distill-Llama-8B
 * 
 *   中等价格模型 ($0.09-$0.10/M tokens):
 *     --provider glm-z1-9b        # GLM-Z1-9B-0414
 *     --provider glm-4-9b         # GLM-4-9B-0414
 *     --provider qwen2.5-14b      # Qwen2.5-14B-Instruct
 *     --provider deepseek-r1-14b  # DeepSeek-R1-Distill-Qwen-14B
 * 
 *   高质量模型 ($0.59/M tokens):
 *     --provider siliconflow      # Qwen2.5-72B-Instruct
 * 
 *   其他提供商:
 *     --provider deepseek         # DeepSeek (需要 DEEPSEEK_API_KEY)
 *     --provider openai           # OpenAI (需要 OPENAI_API_KEY)
 * 
 * 示例:
 *   npx tsx scripts/batch-generate-all-descriptions.ts --provider nvidia-llama3-8b --start-from fake-name-generator
 */

import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// 加载环境变量
dotenv.config({ path: '.env.local' });

// AI 提供商配置
interface AIProvider {
  name: string;
  apiUrl: string;
  model: string;
  apiKeyEnv: string;
}

const AI_PROVIDERS: Record<string, AIProvider> = {
  // ===== 免费模型 =====
  'hunyuan-free': {
    name: 'SiliconFlow FREE (Hunyuan-MT-7B 腾讯混元翻译)',
    apiUrl: 'https://api.siliconflow.cn/v1/chat/completions',
    model: 'tencent/Hunyuan-MT-7B',
    apiKeyEnv: 'SILICONFLOW_API_KEY',
  },
  
  // ===== NVIDIA NIM (免费额度) =====
  // 专业翻译模型（推荐用于翻译任务）
  'nvidia-riva-translate': {
    name: 'NVIDIA Riva Translate 4B (专业翻译模型)',
    apiUrl: 'https://integrate.api.nvidia.com/v1/chat/completions',
    model: 'nvidia/riva-translate-4b-instruct-v1.1',
    apiKeyEnv: 'NVIDIA_API_KEY',
  },
  // 通用大模型
  'nvidia-minimax-m2': {
    name: 'NVIDIA NIM (MiniMax M2)',
    apiUrl: 'https://integrate.api.nvidia.com/v1/chat/completions',
    model: 'minimaxai/minimax-m2',
    apiKeyEnv: 'NVIDIA_API_KEY',
  },
  'nvidia-minimax-m2.1': {
    name: 'NVIDIA NIM (MiniMax M2.1)',
    apiUrl: 'https://integrate.api.nvidia.com/v1/chat/completions',
    model: 'minimaxai/minimax-m2.1',
    apiKeyEnv: 'NVIDIA_API_KEY',
  },
  'nvidia-glm4.7': {
    name: 'NVIDIA NIM (智谱 GLM-4.7)',
    apiUrl: 'https://integrate.api.nvidia.com/v1/chat/completions',
    model: 'z-ai/glm4.7',
    apiKeyEnv: 'NVIDIA_API_KEY',
  },
  'nvidia-kimi-k2': {
    name: 'NVIDIA NIM (Kimi K2)',
    apiUrl: 'https://integrate.api.nvidia.com/v1/chat/completions',
    model: 'moonshotai/kimi-k2-instruct',
    apiKeyEnv: 'NVIDIA_API_KEY',
  },
  'nvidia-deepseek-v3.2': {
    name: 'NVIDIA NIM (DeepSeek V3.2)',
    apiUrl: 'https://integrate.api.nvidia.com/v1/chat/completions',
    model: 'deepseek-ai/deepseek-v3.2',
    apiKeyEnv: 'NVIDIA_API_KEY',
  },
  'nvidia-qwen3-235b': {
    name: 'NVIDIA NIM (Qwen3 235B)',
    apiUrl: 'https://integrate.api.nvidia.com/v1/chat/completions',
    model: 'qwen/qwen3-235b-a22b',
    apiKeyEnv: 'NVIDIA_API_KEY',
  },
  'nvidia-llama3-8b': {
    name: 'NVIDIA NIM (Llama 3 8B)',
    apiUrl: 'https://integrate.api.nvidia.com/v1/chat/completions',
    model: 'meta/llama3-8b-instruct',
    apiKeyEnv: 'NVIDIA_API_KEY',
  },
  'nvidia-llama3-70b': {
    name: 'NVIDIA NIM (Llama 3 70B)',
    apiUrl: 'https://integrate.api.nvidia.com/v1/chat/completions',
    model: 'meta/llama3-70b-instruct',
    apiKeyEnv: 'NVIDIA_API_KEY',
  },
  'nvidia-mistral-7b': {
    name: 'NVIDIA NIM (Mistral 7B)',
    apiUrl: 'https://integrate.api.nvidia.com/v1/chat/completions',
    model: 'mistralai/mistral-7b-instruct-v0.3',
    apiKeyEnv: 'NVIDIA_API_KEY',
  },
  'nvidia-mixtral-8x7b': {
    name: 'NVIDIA NIM (Mixtral 8x7B)',
    apiUrl: 'https://integrate.api.nvidia.com/v1/chat/completions',
    model: 'mistralai/mixtral-8x7b-instruct-v0.1',
    apiKeyEnv: 'NVIDIA_API_KEY',
  },
  'nvidia-gemma-7b': {
    name: 'NVIDIA NIM (Gemma 7B)',
    apiUrl: 'https://integrate.api.nvidia.com/v1/chat/completions',
    model: 'google/gemma-7b',
    apiKeyEnv: 'NVIDIA_API_KEY',
  },
  'nvidia-gemma2-9b': {
    name: 'NVIDIA NIM (Gemma 2 9B)',
    apiUrl: 'https://integrate.api.nvidia.com/v1/chat/completions',
    model: 'google/gemma-2-9b-it',
    apiKeyEnv: 'NVIDIA_API_KEY',
  },
  'nvidia-qwen2-7b': {
    name: 'NVIDIA NIM (Qwen2 7B)',
    apiUrl: 'https://integrate.api.nvidia.com/v1/chat/completions',
    model: 'qwen/qwen2-7b-instruct',
    apiKeyEnv: 'NVIDIA_API_KEY',
  },
  'nvidia-deepseek-r1': {
    name: 'NVIDIA NIM (DeepSeek R1)',
    apiUrl: 'https://integrate.api.nvidia.com/v1/chat/completions',
    model: 'deepseek-ai/deepseek-r1',
    apiKeyEnv: 'NVIDIA_API_KEY',
  },
  'nvidia-phi3-mini': {
    name: 'NVIDIA NIM (Phi-3 Mini 128K)',
    apiUrl: 'https://integrate.api.nvidia.com/v1/chat/completions',
    model: 'microsoft/phi-3-mini-128k-instruct',
    apiKeyEnv: 'NVIDIA_API_KEY',
  },
  
  // ===== 超低价模型 ($0.02/M tokens) =====
  'deepseek-r1-1.5b': {
    name: 'SiliconFlow (DeepSeek-R1-Distill-Qwen-1.5B) $0.02/M',
    apiUrl: 'https://api.siliconflow.cn/v1/chat/completions',
    model: 'deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B',
    apiKeyEnv: 'SILICONFLOW_API_KEY',
  },
  
  // ===== 低价模型 ($0.05-$0.06/M tokens) =====
  'qwen2.5-7b': {
    name: 'SiliconFlow (Qwen2.5-7B) $0.05/M',
    apiUrl: 'https://api.siliconflow.cn/v1/chat/completions',
    model: 'Qwen/Qwen2.5-7B-Instruct',
    apiKeyEnv: 'SILICONFLOW_API_KEY',
  },
  'deepseek-r1-7b': {
    name: 'SiliconFlow (DeepSeek-R1-Distill-Qwen-7B) $0.05/M',
    apiUrl: 'https://api.siliconflow.cn/v1/chat/completions',
    model: 'deepseek-ai/DeepSeek-R1-Distill-Qwen-7B',
    apiKeyEnv: 'SILICONFLOW_API_KEY',
  },
  'llama-3.1-8b': {
    name: 'SiliconFlow (Llama-3.1-8B) $0.06/M',
    apiUrl: 'https://api.siliconflow.cn/v1/chat/completions',
    model: 'meta-llama/Meta-Llama-3.1-8B-Instruct',
    apiKeyEnv: 'SILICONFLOW_API_KEY',
  },
  'qwen3-8b': {
    name: 'SiliconFlow (Qwen3-8B) $0.06/M',
    apiUrl: 'https://api.siliconflow.cn/v1/chat/completions',
    model: 'Qwen/Qwen3-8B',
    apiKeyEnv: 'SILICONFLOW_API_KEY',
  },
  'deepseek-r1-8b': {
    name: 'SiliconFlow (DeepSeek-R1-Distill-Llama-8B) $0.06/M',
    apiUrl: 'https://api.siliconflow.cn/v1/chat/completions',
    model: 'deepseek-ai/DeepSeek-R1-Distill-Llama-8B',
    apiKeyEnv: 'SILICONFLOW_API_KEY',
  },
  
  // ===== 中等价格模型 ($0.09-$0.10/M tokens) =====
  'glm-z1-9b': {
    name: 'SiliconFlow (GLM-Z1-9B) $0.09/M',
    apiUrl: 'https://api.siliconflow.cn/v1/chat/completions',
    model: 'THUDM/GLM-Z1-9B-0414',
    apiKeyEnv: 'SILICONFLOW_API_KEY',
  },
  'glm-4-9b': {
    name: 'SiliconFlow (GLM-4-9B) $0.09/M',
    apiUrl: 'https://api.siliconflow.cn/v1/chat/completions',
    model: 'THUDM/GLM-4-9B-0414',
    apiKeyEnv: 'SILICONFLOW_API_KEY',
  },
  'qwen2.5-14b': {
    name: 'SiliconFlow (Qwen2.5-14B) $0.10/M',
    apiUrl: 'https://api.siliconflow.cn/v1/chat/completions',
    model: 'Qwen/Qwen2.5-14B-Instruct',
    apiKeyEnv: 'SILICONFLOW_API_KEY',
  },
  'deepseek-r1-14b': {
    name: 'SiliconFlow (DeepSeek-R1-Distill-Qwen-14B) $0.10/M',
    apiUrl: 'https://api.siliconflow.cn/v1/chat/completions',
    model: 'deepseek-ai/DeepSeek-R1-Distill-Qwen-14B',
    apiKeyEnv: 'SILICONFLOW_API_KEY',
  },
  
  // ===== 高质量模型 =====
  siliconflow: {
    name: 'SiliconFlow (Qwen2.5-72B) $0.59/M',
    apiUrl: 'https://api.siliconflow.cn/v1/chat/completions',
    model: 'Qwen/Qwen2.5-72B-Instruct',
    apiKeyEnv: 'SILICONFLOW_API_KEY',
  },
  
  // ===== 其他提供商 =====
  deepseek: {
    name: 'DeepSeek',
    apiUrl: 'https://api.deepseek.com/v1/chat/completions',
    model: 'deepseek-chat',
    apiKeyEnv: 'DEEPSEEK_API_KEY',
  },
  openai: {
    name: 'OpenAI',
    apiUrl: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4o-mini',
    apiKeyEnv: 'OPENAI_API_KEY',
  },
  
  // ===== 兼容旧名称 =====
  'siliconflow-free': {
    name: 'SiliconFlow (Qwen2.5-7B) $0.05/M',
    apiUrl: 'https://api.siliconflow.cn/v1/chat/completions',
    model: 'Qwen/Qwen2.5-7B-Instruct',
    apiKeyEnv: 'SILICONFLOW_API_KEY',
  },
  'siliconflow-glm': {
    name: 'SiliconFlow (GLM-4-9B) $0.09/M',
    apiUrl: 'https://api.siliconflow.cn/v1/chat/completions',
    model: 'THUDM/GLM-4-9B-0414',
    apiKeyEnv: 'SILICONFLOW_API_KEY',
  },
};

// 从命令行参数获取提供商，默认使用 NVIDIA Qwen3 235B（快速且免费）
const args = process.argv.slice(2);
const providerIndex = args.indexOf('--provider');
const providerName = providerIndex !== -1 ? args[providerIndex + 1] : 'nvidia-qwen3-235b';
const PROVIDER = AI_PROVIDERS[providerName] || AI_PROVIDERS['nvidia-qwen3-235b'];

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

async function callAIAPI(prompt: string, retries = 5): Promise<string> {
  const apiKey = process.env[PROVIDER.apiKeyEnv];
  if (!apiKey) throw new Error(`${PROVIDER.apiKeyEnv} not set`);

  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(PROVIDER.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: PROVIDER.model,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 3000,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        // 处理速率限制
        if (response.status === 429) {
          const waitTime = Math.min(30000, 5000 * Math.pow(2, i));
          console.log(`    Rate limited, waiting ${waitTime/1000}s...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }
        // 处理服务器错误
        if (response.status >= 500) {
          console.log(`    Server error ${response.status}, retrying...`);
          await new Promise(resolve => setTimeout(resolve, 5000));
          continue;
        }
        throw new Error(`API failed: ${response.status} ${errorText.substring(0, 200)}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || '';
      
      // 检查是否返回了有效内容
      if (!content || content.length < 50) {
        throw new Error('Empty or too short response');
      }
      
      return content;
    } catch (error) {
      if (i === retries - 1) throw error;
      const waitTime = 3000 * (i + 1);
      console.log(`    Retry ${i + 1}/${retries} after ${waitTime/1000}s...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
  throw new Error('Max retries exceeded');
}

function parseDescription(content: string): ToolDescription | null {
  try {
    // 尝试多种方式提取 JSON
    let jsonStr = content;
    
    // 1. 尝试提取 markdown 代码块中的 JSON
    const codeBlockMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) {
      jsonStr = codeBlockMatch[1].trim();
    } else {
      // 2. 尝试提取最外层的 JSON 对象
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonStr = jsonMatch[0];
      }
    }
    
    // 3. 清理常见的 JSON 格式问题
    jsonStr = jsonStr
      .replace(/,\s*}/g, '}')  // 移除尾随逗号
      .replace(/,\s*]/g, ']')  // 移除数组尾随逗号
      .replace(/[\x00-\x1F\x7F]/g, ' ')  // 移除控制字符
      .replace(/\n\s*\n/g, '\n');  // 移除多余空行
    
    const parsed = JSON.parse(jsonStr);
    
    // 验证必需字段
    if (parsed.detailed_description && parsed.usage_steps && parsed.usage_examples) {
      // 确保数组格式正确
      if (!Array.isArray(parsed.usage_steps)) {
        parsed.usage_steps = [parsed.usage_steps];
      }
      if (!Array.isArray(parsed.usage_examples)) {
        parsed.usage_examples = [parsed.usage_examples];
      }
      return parsed;
    }
    return null;
  } catch (e) {
    // 调试：打印解析失败的内容
    // console.log('Parse error:', e, '\nContent:', content.substring(0, 500));
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
      const response = await callAIAPI(prompt);
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
  console.log(`\n📋 Found ${tools.length} tools needing improvement`);
  console.log(`🤖 Using AI Provider: ${PROVIDER.name} (${PROVIDER.model})\n`);
  
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
