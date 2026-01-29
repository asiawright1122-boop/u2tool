/**
 * 使用 AI 批量优化 SEO 内容
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

const SILICONFLOW_API_KEY = 'sk-wunwjfhqseabkhfltebhzccyuhofazcugowzcvrjzhqblhog';
const LOCALES = ['zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];

const LANG_CONFIGS = {
  zh: { name: '简体中文', keywords: '免费、在线、工具' },
  ja: { name: '日语', keywords: '無料、オンライン、ツール' },
  ko: { name: '韩语', keywords: '무료、온라인、도구' },
  es: { name: '西班牙语', keywords: 'gratis、online、herramienta' },
  pt: { name: '葡萄牙语', keywords: 'grátis、online、ferramenta' },
  fr: { name: '法语', keywords: 'gratuit、en ligne、outil' },
  de: { name: '德语', keywords: 'kostenlos、online、Tool' },
  ru: { name: '俄语', keywords: 'бесплатно、онлайн、инструмент' },
  ar: { name: '阿拉伯语', keywords: 'مجاني، عبر الإنترنت، أداة' }
};

async function callAPI(prompt) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      model: 'Qwen/Qwen2.5-7B-Instruct',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5,
      max_tokens: 2048
    });

    const options = {
      hostname: 'api.siliconflow.cn',
      port: 443,
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SILICONFLOW_API_KEY}`
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          if (json.choices && json.choices[0]) {
            resolve(json.choices[0].message.content);
          } else {
            reject(new Error('Invalid response'));
          }
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function optimizeSEO(toolName, toolDesc, locale) {
  const config = LANG_CONFIGS[locale];
  
  const prompt = `你是一个 SEO 专家。请为以下工具生成优化的 SEO 标题和描述。

工具名称: ${toolName}
工具功能: ${toolDesc}
目标语言: ${config.name}

要求:
1. seo_title: 30-60个字符，包含关键词（${config.keywords}），吸引点击
2. seo_description: 120-160个字符，描述工具功能和优势，包含行动号召
3. 不要使用模板化的表达，要个性化、有吸引力
4. 保持专业术语不翻译（如 JSON、Base64、SVG 等）

返回 JSON 格式:
{
  "seo_title": "...",
  "seo_description": "..."
}

只返回 JSON，不要其他内容。`;

  try {
    const response = await callAPI(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.error('Error:', e.message);
  }
  return null;
}

async function main() {
  // 读取需要优化的工具列表
  const needsOptimization = fs.readFileSync('seo-needs-optimization.txt', 'utf8').trim().split('\n');
  console.log(`需要优化 ${needsOptimization.length} 个工具的 SEO\n`);
  
  const enData = JSON.parse(fs.readFileSync('src/messages/en.json', 'utf8'));
  
  // 限制每次处理的数量
  const batchSize = parseInt(process.argv[2]) || 50;
  const startIndex = parseInt(process.argv[3]) || 0;
  const toolsToProcess = needsOptimization.slice(startIndex, startIndex + batchSize);
  
  console.log(`处理工具 ${startIndex + 1} - ${startIndex + toolsToProcess.length}\n`);
  
  for (const locale of LOCALES) {
    console.log(`\n📂 处理 ${locale} (${LANG_CONFIGS[locale].name})...`);
    
    const filePath = path.join(__dirname, '..', 'src', 'messages', `${locale}.json`);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    let optimized = 0;
    
    for (const slug of toolsToProcess) {
      const enTool = enData.tools[slug];
      if (!enTool) continue;
      
      process.stdout.write(`   ${slug}...`);
      const result = await optimizeSEO(enTool.name, enTool.description, locale);
      
      if (result && result.seo_title && result.seo_description) {
        if (!data.tools[slug]) data.tools[slug] = {};
        data.tools[slug].seo_title = result.seo_title;
        data.tools[slug].seo_description = result.seo_description;
        optimized++;
        console.log(' ✓');
      } else {
        console.log(' ✗');
      }
      
      await new Promise(r => setTimeout(r, 300));
    }
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`   完成: ${optimized}/${toolsToProcess.length}`);
  }
  
  console.log('\n✅ 完成！');
  console.log(`下一批: node scripts/ai-optimize-seo.js ${batchSize} ${startIndex + batchSize}`);
}

main().catch(console.error);
