#!/usr/bin/env npx ts-node

/**
 * 工具内容生成脚本
 * 为每个工具生成独特、详细的内容，包括：
 * - 详细描述（300-500字）
 * - 使用说明
 * - 使用示例
 * - 常见问题（FAQ）
 * 
 * 使用方法:
 *   npx ts-node scripts/generate-tool-content.ts --tool=json-formatter
 *   npx ts-node scripts/generate-tool-content.ts --all
 *   npx ts-node scripts/generate-tool-content.ts --category=encoding
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const _require = createRequire(import.meta.url);

// 使用 require 导入 CommonJS 模块
const toolsConfig = _require(path.join(__dirname, '../src/config/tools.ts'));
const tools = toolsConfig.tools;
const _categories = toolsConfig.categories;
const getToolBySlug = toolsConfig.getToolBySlug;

// 工具内容模板
interface ToolContent {
  name: string;
  description: string; // 简短描述（50-100字）
  detailedDescription: string; // 详细描述（300-500字）
  seoTitle: string;
  seoDescription: string; // 120-160字符
  usage: {
    steps: string[];
    examples: string[];
  };
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  relatedTools: string[];
}

// 工具分类描述模板
const categoryDescriptions: Record<string, string> = {
  encoding: '编码解码工具可以帮助您在不同编码格式之间转换数据，包括 Base64、URL 编码、HTML 实体等。',
  generators: '生成器工具可以快速创建各种类型的数据，如 UUID、密码、二维码、Lorem Ipsum 文本等。',
  converters: '转换器工具可以在不同格式之间转换数据，如 JSON 到 CSV、颜色格式转换、时间戳转换等。',
  text: '文本工具提供各种文本处理功能，如字数统计、大小写转换、文本比较、去重等。',
  development: '开发工具为开发者提供代码格式化、验证、测试等功能，提高开发效率。',
  security: '安全工具提供加密、哈希、密码生成等安全相关功能，保护您的数据安全。',
  network: '网络工具提供 IP 查询、DNS 查询、URL 解析等网络相关功能。',
  image: '图像工具提供图片处理、转换、优化等功能，支持多种图片格式。',
  math: '数学计算工具提供各种数学运算、单位转换、计算器等功能。',
  charts: '图表可视化工具可以快速生成各种类型的图表，用于数据可视化。',
  office: '办公工具提供文档处理、PDF 操作、表格处理等办公相关功能。',
};

// 生成工具详细描述
function generateDetailedDescription(
  toolName: string,
  _category: string,
  _slug: string
): string {
  const categoryDesc = categoryDescriptions[category] || '实用工具';
  
  // 根据工具类型生成不同的描述
  const templates: Record<string, string[]> = {
    formatter: [
      `${toolName} 是一个强大的在线格式化工具，可以帮助您快速格式化和美化代码或数据。`,
      `使用 ${toolName}，您可以轻松地将压缩或混乱的代码转换为格式良好的、易于阅读的格式。`,
      `这个工具支持实时预览，让您立即看到格式化结果，无需等待。`,
      `无论您是开发者、设计师还是数据分析师，${toolName} 都能帮助您提高工作效率。`,
      `所有处理都在浏览器本地完成，确保您的数据安全，不会上传到任何服务器。`,
    ],
    generator: [
      `${toolName} 是一个便捷的在线生成器，可以快速生成各种类型的数据。`,
      `使用 ${toolName}，您可以轻松创建符合特定格式要求的数据，无需手动编写。`,
      `这个工具支持多种配置选项，让您可以根据需要定制生成的内容。`,
      `无论您需要生成测试数据、示例内容还是随机值，${toolName} 都能满足您的需求。`,
      `所有生成都在浏览器本地完成，确保您的隐私安全，不会上传任何数据。`,
    ],
    converter: [
      `${toolName} 是一个高效的在线转换工具，可以在不同格式之间快速转换数据。`,
      `使用 ${toolName}，您可以轻松地将数据从一种格式转换为另一种格式，无需安装任何软件。`,
      `这个工具支持多种输入和输出格式，让您可以根据需要选择最适合的格式。`,
      `无论您需要转换文件格式、数据格式还是代码格式，${toolName} 都能帮助您快速完成。`,
      `所有转换都在浏览器本地完成，确保您的数据安全，不会上传到任何服务器。`,
    ],
    default: [
      `${toolName} 是一个实用的在线工具，可以帮助您快速完成各种任务。`,
      `使用 ${toolName}，您可以轻松处理各种数据，无需安装任何软件或插件。`,
      `这个工具界面简洁，操作方便，让您能够快速上手并高效使用。`,
      `无论您是开发者、设计师还是普通用户，${toolName} 都能帮助您提高工作效率。`,
      `所有处理都在浏览器本地完成，确保您的数据安全，不会上传到任何服务器。`,
    ],
  };

  // 根据 slug 判断工具类型
  let template = templates.default;
  if (slug.includes('formatter') || slug.includes('format')) {
    template = templates.formatter;
  } else if (slug.includes('generator') || slug.includes('generate')) {
    template = templates.generator;
  } else if (slug.includes('converter') || slug.includes('convert') || slug.includes('to-')) {
    template = templates.converter;
  }

  // 组合描述
  const description = [
    categoryDesc,
    ...template,
    `立即使用 ${toolName}，体验快速、安全、免费的在线工具服务。`,
  ].join(' ');

  return description;
}

// 生成使用步骤
function generateUsageSteps(toolName: string, slug: string): string[] {
  const baseSteps = [
    `打开 ${toolName} 工具页面`,
    `在输入框中输入或粘贴您要处理的内容`,
    `根据需要调整工具选项和设置`,
    `点击处理按钮，查看结果`,
    `复制或下载处理后的结果`,
  ];

  // 根据工具类型调整步骤
  if (slug.includes('generator') || slug.includes('generate')) {
    return [
      `打开 ${toolName} 工具页面`,
      `根据需要配置生成选项（如长度、格式等）`,
      `点击生成按钮，查看生成结果`,
      `复制或下载生成的内容`,
    ];
  }

  if (slug.includes('converter') || slug.includes('convert') || slug.includes('to-')) {
    return [
      `打开 ${toolName} 工具页面`,
      `在输入框中输入或粘贴要转换的内容`,
      `选择源格式和目标格式（如需要）`,
      `点击转换按钮，查看转换结果`,
      `复制或下载转换后的内容`,
    ];
  }

  return baseSteps;
}

// 生成使用示例
function generateExamples(toolName: string, slug: string): string[] {
  const examples: string[] = [];

  // 根据工具类型生成示例
  if (slug === 'json-formatter') {
    examples.push(
      '输入压缩的 JSON: {"name":"John","age":30,"city":"New York"}',
      '输出格式化的 JSON: {\n  "name": "John",\n  "age": 30,\n  "city": "New York"\n}'
    );
  } else if (slug === 'base64') {
    examples.push(
      '编码文本 "Hello" 为 Base64: SGVsbG8=',
      '解码 Base64 "SGVsbG8=" 为文本: Hello'
    );
  } else if (slug === 'uuid-generator') {
    examples.push(
      '生成 UUID v4: 550e8400-e29b-41d4-a716-446655440000',
      '可以批量生成多个 UUID，每个都是唯一的'
    );
  } else if (slug.includes('generator')) {
    examples.push(
      `使用 ${toolName} 生成符合要求的数据`,
      `可以配置各种参数来定制生成结果`
    );
  } else if (slug.includes('converter') || slug.includes('to-')) {
    examples.push(
      `将数据从一种格式转换为另一种格式`,
      `支持多种输入和输出格式`
    );
  } else {
    examples.push(
      `使用 ${toolName} 处理您的数据`,
      `快速获得处理结果，无需等待`
    );
  }

  return examples;
}

// 生成常见问题
function generateFAQs(toolName: string, slug: string, _category: string): Array<{ question: string; answer: string }> {
  const faqs: Array<{ question: string; answer: string }> = [];

  // 通用 FAQ
  faqs.push({
    question: `${toolName} 是免费的吗？`,
    answer: `是的，${toolName} 完全免费使用，无需注册或登录。所有功能都可以免费使用，没有任何限制。`,
  });

  faqs.push({
    question: `使用 ${toolName} 安全吗？`,
    answer: `绝对安全。所有数据处理都在您的浏览器本地完成，数据不会上传到任何服务器。您的隐私和数据安全得到完全保障。`,
  });

  // 根据工具类型添加特定 FAQ
  if (slug.includes('formatter') || slug.includes('format')) {
    faqs.push({
      question: `${toolName} 支持哪些格式？`,
      answer: `${toolName} 支持多种常见格式，包括 JSON、XML、HTML 等。您可以在工具页面查看支持的完整格式列表。`,
    });
  }

  if (slug.includes('generator') || slug.includes('generate')) {
    faqs.push({
      question: `可以批量生成吗？`,
      answer: `是的，${toolName} 支持批量生成。您可以配置生成数量，一次性生成多个结果。`,
    });
  }

  if (slug.includes('converter') || slug.includes('convert') || slug.includes('to-')) {
    faqs.push({
      question: `支持哪些格式转换？`,
      answer: `${toolName} 支持多种格式之间的转换。您可以在工具页面查看支持的输入和输出格式。`,
    });
  }

  faqs.push({
    question: `需要安装软件吗？`,
    answer: `不需要。${toolName} 是完全基于浏览器的在线工具，无需安装任何软件或插件。只需打开网页即可使用。`,
  });

  faqs.push({
    question: `处理速度如何？`,
    answer: `由于所有处理都在浏览器本地完成，${toolName} 的处理速度非常快，通常可以在几毫秒内完成。`,
  });

  return faqs;
}

// 分类名称映射
const categoryNames: Record<string, string> = {
  text: '文本',
  encoding: '编码解码',
  generators: '生成器',
  converters: '转换器',
  development: '开发',
  security: '安全',
  network: '网络',
  image: '图像',
  math: '数学',
  charts: '图表',
  office: '办公',
};

// 生成 SEO 标题
function generateSEOTitle(toolName: string, category: string): string {
  const categoryName = categoryNames[category] || '工具';
  return `${toolName} - 免费在线${categoryName}工具 | U2Tool`;
}

// 生成 SEO 描述
function generateSEODescription(toolName: string, category: string, _slug: string): string {
  const categoryName = categoryNames[category] || '工具';
  const baseDesc = `免费在线${toolName}工具，快速、安全、无需注册。支持多种格式，处理速度快，数据安全有保障。立即使用，提升您的工作效率。`;
  
  // 确保长度在 120-160 字符之间
  if (baseDesc.length > 160) {
    return baseDesc.substring(0, 157) + '...';
  }
  if (baseDesc.length < 120) {
    return baseDesc + ` 适用于开发者、设计师和所有需要${categoryName}工具的用户。`;
  }
  return baseDesc;
}

// 生成工具内容
function generateToolContent(tool: { slug: string; category: string; icon: string }): ToolContent {
  const toolName = tool.slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const detailedDescription = generateDetailedDescription(toolName, tool.category, tool.slug);
  const usageSteps = generateUsageSteps(toolName, tool.slug);
  const examples = generateExamples(toolName, tool.slug);
  const faqs = generateFAQs(toolName, tool.slug, tool.category);
  const seoTitle = generateSEOTitle(toolName, tool.category);
  const seoDescription = generateSEODescription(toolName, tool.category, tool.slug);

  // 简短描述（50-100字）
  const description = `${toolName} 是一个实用的在线工具，可以帮助您快速完成各种任务。所有处理都在浏览器本地完成，确保数据安全。`;

  return {
    name: toolName,
    description,
    detailedDescription,
    seoTitle,
    seoDescription,
    usage: {
      steps: usageSteps,
      examples,
    },
    faqs,
    relatedTools: [], // 可以后续添加相关工具
  };
}

// 主函数
function main() {
  const args = process.argv.slice(2);
  const toolArg = args.find(arg => arg.startsWith('--tool='));
  const allArg = args.includes('--all');
  const categoryArg = args.find(arg => arg.startsWith('--category='));

  let toolsToProcess: typeof tools = [];

  if (toolArg) {
    const slug = toolArg.split('=')[1];
    const tool = getToolBySlug(slug);
    if (tool) {
      toolsToProcess = [tool];
    } else {
      console.error(`❌ 未找到工具: ${slug}`);
      process.exit(1);
    }
  } else if (categoryArg) {
    const category = categoryArg.split('=')[1];
    toolsToProcess = tools.filter((t: { category: string }) => t.category === category);
  } else if (allArg) {
    toolsToProcess = tools;
  } else {
    console.log('使用方法:');
    console.log('  npx ts-node scripts/generate-tool-content.ts --tool=json-formatter');
    console.log('  npx ts-node scripts/generate-tool-content.ts --category=encoding');
    console.log('  npx ts-node scripts/generate-tool-content.ts --all');
    process.exit(1);
  }

  console.log(`🚀 开始为 ${toolsToProcess.length} 个工具生成内容...\n`);

  const outputDir = path.join(process.cwd(), 'content', 'tools');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  for (const tool of toolsToProcess) {
    const content = generateToolContent(tool);
    const outputPath = path.join(outputDir, `${tool.slug}.json`);

    fs.writeFileSync(
      outputPath,
      JSON.stringify(content, null, 2),
      'utf-8'
    );

    console.log(`✅ ${tool.slug}: ${content.name}`);
    console.log(`   描述长度: ${content.detailedDescription.length} 字符`);
    console.log(`   FAQ 数量: ${content.faqs.length}`);
    console.log(`   输出: ${outputPath}\n`);
  }

  console.log(`✨ 完成！已为 ${toolsToProcess.length} 个工具生成内容。`);
  console.log(`📁 输出目录: ${outputDir}`);
}

main();

