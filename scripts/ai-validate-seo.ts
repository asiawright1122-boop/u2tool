import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// 加载 .env.local
dotenv.config({ path: '.env.local' });

const SILICONFLOW_API_KEY = process.env.SILICONFLOW_API_KEY;
const API_URL = 'https://api.siliconflow.cn/v1/chat/completions';

const locales = ['zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];
const localeNames: Record<string, string> = {
  zh: '简体中文',
  ja: '日本語',
  ko: '한국어',
  es: 'Español',
  pt: 'Português',
  fr: 'Français',
  de: 'Deutsch',
  ru: 'Русский',
  ar: 'العربية'
};

interface SEOData {
  name: string;
  seo_title: string;
  seo_description: string;
}

interface ValidationResult {
  slug: string;
  locale: string;
  issues: string[];
  score: number;
}

async function callAI(prompt: string): Promise<string> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SILICONFLOW_API_KEY}`
    },
    body: JSON.stringify({
      model: 'THUDM/glm-4-9b-chat',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 1000
    })
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

async function validateSEO(
  slug: string,
  locale: string,
  enData: SEOData,
  localeData: SEOData
): Promise<ValidationResult> {
  const prompt = `你是一个多语言SEO专家。请检验以下工具的${localeNames[locale]}翻译质量。

工具: ${slug}

英文原文:
- 名称: ${enData.name}
- SEO标题: ${enData.seo_title}
- SEO描述: ${enData.seo_description}

${localeNames[locale]}翻译:
- 名称: ${localeData.name}
- SEO标题: ${localeData.seo_title}
- SEO描述: ${localeData.seo_description}

请检查以下问题并给出评分(0-100):
1. 翻译是否准确传达了原意？
2. SEO标题是否包含关键词且长度合适(≤60字符)？
3. SEO描述是否包含关键词且长度合适(100-200字符)？
4. 翻译是否自然流畅，符合目标语言习惯？
5. 是否有语法错误或拼写错误？
6. 是否仍然是英文（未翻译）？

请用JSON格式回复:
{
  "score": 数字(0-100),
  "issues": ["问题1", "问题2"] // 如果没有问题则为空数组
}

只返回JSON，不要其他内容。`;

  try {
    const response = await callAI(prompt);
    // 提取JSON
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]);
      return {
        slug,
        locale,
        issues: result.issues || [],
        score: result.score || 0
      };
    }
  } catch (error) {
    console.error(`Error validating ${slug} for ${locale}:`, error);
  }

  return {
    slug,
    locale,
    issues: ['AI验证失败'],
    score: 0
  };
}

async function main() {
  if (!SILICONFLOW_API_KEY) {
    console.error('❌ 请设置 SILICONFLOW_API_KEY 环境变量');
    process.exit(1);
  }

  const messagesDir = path.join(process.cwd(), 'src/messages');
  const en = JSON.parse(fs.readFileSync(path.join(messagesDir, 'en.json'), 'utf8'));

  // UI 命名空间（不是工具）
  const uiNamespaces = ['packageJson', 'clipPath', 'uuidValidator', 'hashCompare', 'jsonPathFinder', 'canvas', 'jsonEscape', 'stopwatchUI', 'countdownTimer'];

  // 获取所有工具
  const tools = Object.keys(en.tools).filter(k => {
    const tool = en.tools[k];
    return typeof tool === 'object' && tool.name && tool.seo_title && !uiNamespaces.includes(k);
  });

  // 命令行参数
  const args = process.argv.slice(2);
  const sampleSize = args.includes('--all') ? tools.length : parseInt(args[0]) || 10;
  const targetLocale = args.find(a => locales.includes(a));

  // 随机抽样或指定工具
  const selectedTools = args.includes('--all') 
    ? tools 
    : tools.sort(() => Math.random() - 0.5).slice(0, sampleSize);

  const targetLocales = targetLocale ? [targetLocale] : locales;

  console.log(`🔍 AI SEO翻译质量检验`);
  console.log(`📊 检验工具数: ${selectedTools.length}`);
  console.log(`🌐 检验语言: ${targetLocales.join(', ')}\n`);

  const results: ValidationResult[] = [];
  const localeScores: Record<string, number[]> = {};

  for (const locale of targetLocales) {
    localeScores[locale] = [];
    const localeData = JSON.parse(fs.readFileSync(path.join(messagesDir, `${locale}.json`), 'utf8'));

    console.log(`\n📝 检验 ${localeNames[locale]} (${locale})...`);

    for (const slug of selectedTools) {
      const enTool = en.tools[slug];
      const localeTool = localeData.tools[slug];

      if (!localeTool) {
        console.log(`  ⚠️ ${slug}: 工具不存在`);
        continue;
      }

      process.stdout.write(`  🔄 ${slug}... `);

      const result = await validateSEO(slug, locale, enTool, localeTool);
      results.push(result);
      localeScores[locale].push(result.score);

      if (result.issues.length > 0) {
        console.log(`⚠️ 评分: ${result.score}/100`);
        result.issues.forEach(issue => console.log(`     - ${issue}`));
      } else {
        console.log(`✅ 评分: ${result.score}/100`);
      }

      // 避免API限流
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  // 输出汇总
  console.log('\n' + '='.repeat(60));
  console.log('📊 检验结果汇总');
  console.log('='.repeat(60));

  for (const locale of targetLocales) {
    const scores = localeScores[locale];
    if (scores.length > 0) {
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      const min = Math.min(...scores);
      const max = Math.max(...scores);
      console.log(`\n${localeNames[locale]} (${locale}):`);
      console.log(`  平均分: ${avg.toFixed(1)}/100`);
      console.log(`  最低分: ${min}/100`);
      console.log(`  最高分: ${max}/100`);
    }
  }

  // 找出问题最多的工具
  const problemTools = results.filter(r => r.issues.length > 0 || r.score < 70);
  if (problemTools.length > 0) {
    console.log('\n⚠️ 需要关注的工具:');
    problemTools.forEach(r => {
      console.log(`  - ${r.slug} (${r.locale}): ${r.score}/100`);
      r.issues.forEach(issue => console.log(`    • ${issue}`));
    });
  } else {
    console.log('\n✅ 所有检验的工具SEO翻译质量良好！');
  }

  // 保存详细报告
  const reportPath = path.join(process.cwd(), 'reports', 'seo-validation-report.json');
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    summary: {
      toolsChecked: selectedTools.length,
      localesChecked: targetLocales,
      averageScores: Object.fromEntries(
        Object.entries(localeScores).map(([locale, scores]) => [
          locale,
          scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : 0
        ])
      )
    },
    results
  }, null, 2));
  console.log(`\n📄 详细报告已保存到: ${reportPath}`);
}

main().catch(console.error);
