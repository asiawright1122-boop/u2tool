/**
 * 使用 SiliconFlow API 翻译所有未翻译的字段
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

const SILICONFLOW_API_KEY = 'sk-wunwjfhqseabkhfltebhzccyuhofazcugowzcvrjzhqblhog';
const LOCALES = ['zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];

const LANG_NAMES = {
  zh: '简体中文', ja: '日语', ko: '韩语', es: '西班牙语',
  pt: '葡萄牙语', fr: '法语', de: '德语', ru: '俄语', ar: '阿拉伯语'
};

// 需要翻译的工具
const TOOLS = [
  'png-to-svg', 'break-even-calculator', 'glassmorphism-generator',
  'neumorphism-generator', 'blob-generator', 'wave-generator',
  'mesh-gradient-generator', 'noise-texture-generator', 'commit-message-generator',
  'bandwidth-calculator', 'data-transfer-calculator', 'pixel-density-calculator', 'dpi-calculator'
];

async function callAPI(prompt) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      model: 'Qwen/Qwen2.5-7B-Instruct',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 4096
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

async function translateTool(enTool, targetLang) {
  const langName = LANG_NAMES[targetLang];
  
  const prompt = `将以下工具信息翻译成${langName}。要求：
1. 翻译要自然流畅
2. 保持专业术语（如 Glassmorphism、SVG、CSS、PNG 等）不翻译
3. seo_title 和 seo_description 要包含关键词，适合搜索引擎优化
4. 返回 JSON 格式

需要翻译的内容：
${JSON.stringify({
  seo_title: enTool.seo_title,
  seo_description: enTool.seo_description,
  usage_steps: enTool.usage_steps,
  usage_examples: enTool.usage_examples
}, null, 2)}

只返回 JSON 对象，不要有其他内容。`;

  try {
    const response = await callAPI(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.error('Translation error:', e.message);
  }
  return null;
}

async function main() {
  console.log('🔧 翻译所有未翻译的字段...\n');
  
  const enPath = path.join(__dirname, '..', 'src', 'messages', 'en.json');
  const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
  
  for (const locale of LOCALES) {
    console.log(`\n📂 处理 ${locale} (${LANG_NAMES[locale]})...`);
    
    const filePath = path.join(__dirname, '..', 'src', 'messages', `${locale}.json`);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    let translated = 0;
    
    for (const slug of TOOLS) {
      const enTool = enData.tools[slug];
      if (!enTool) continue;
      
      console.log(`   翻译 ${slug}...`);
      const result = await translateTool(enTool, locale);
      
      if (result) {
        if (!data.tools[slug]) data.tools[slug] = {};
        if (result.seo_title) data.tools[slug].seo_title = result.seo_title;
        if (result.seo_description) data.tools[slug].seo_description = result.seo_description;
        if (result.usage_steps) data.tools[slug].usage_steps = result.usage_steps;
        if (result.usage_examples) data.tools[slug].usage_examples = result.usage_examples;
        translated++;
      }
      
      await new Promise(r => setTimeout(r, 500));
    }
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`   ✓ 翻译了 ${translated} 个工具`);
  }
  
  console.log('\n✅ 完成！');
}

main().catch(console.error);
