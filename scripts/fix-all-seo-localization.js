/**
 * 修复所有语言的 SEO 本地化
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

const SILICONFLOW_API_KEY = 'sk-wunwjfhqseabkhfltebhzccyuhofazcugowzcvrjzhqblhog';

// 需要修复的语言（排除 en, zh, ja, ko, ru, ar - 这些已经完成）
const LOCALES_TO_FIX = ['es', 'pt', 'fr', 'de'];

const LANG_CONFIGS = {
  es: { name: '西班牙语', keywords: 'gratis、online、herramienta' },
  pt: { name: '葡萄牙语', keywords: 'grátis、online、ferramenta' },
  fr: { name: '法语', keywords: 'gratuit、en ligne、outil' },
  de: { name: '德语', keywords: 'kostenlos、online、Tool' }
};

async function callAPI(prompt) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      model: 'Qwen/Qwen2.5-7B-Instruct',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5,
      max_tokens: 1024
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

function isEnglishOnly(text) {
  if (!text) return false;
  return /^[\x00-\x7F]+$/.test(text) && /[a-zA-Z]{3,}/.test(text);
}

async function translateSEO(enTitle, enDesc, locale) {
  const config = LANG_CONFIGS[locale];
  
  const prompt = `将以下英文 SEO 内容翻译成${config.name}。

英文标题: ${enTitle}
英文描述: ${enDesc}

要求:
1. 翻译要自然流畅，符合${config.name}习惯
2. 包含关键词（${config.keywords}）
3. 保持专业术语不翻译（如 JSON、Base64、SVG 等）
4. seo_title 30-60字符，seo_description 120-160字符

返回 JSON:
{"seo_title": "...", "seo_description": "..."}

只返回 JSON。`;

  try {
    const response = await callAPI(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    // ignore
  }
  return null;
}

async function main() {
  const enData = JSON.parse(fs.readFileSync('src/messages/en.json', 'utf8'));
  
  for (const locale of LOCALES_TO_FIX) {
    console.log(`\n📂 处理 ${locale} (${LANG_CONFIGS[locale].name})...`);
    
    const filePath = `src/messages/${locale}.json`;
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // 找出需要翻译的工具
    const needsTranslation = [];
    for (const [slug, tool] of Object.entries(data.tools)) {
      if (typeof tool !== 'object') continue;
      
      const title = tool.seo_title;
      const desc = tool.seo_description;
      
      if ((title && isEnglishOnly(title)) || (desc && isEnglishOnly(desc))) {
        needsTranslation.push(slug);
      }
    }
    
    console.log(`   需要翻译: ${needsTranslation.length} 个工具`);
    
    let fixed = 0;
    for (const slug of needsTranslation) {
      const enTool = enData.tools[slug];
      if (!enTool || !enTool.seo_title) continue;
      
      process.stdout.write(`   ${slug}...`);
      
      const result = await translateSEO(
        enTool.seo_title,
        enTool.seo_description || enTool.description,
        locale
      );
      
      if (result && result.seo_title) {
        data.tools[slug].seo_title = result.seo_title;
        if (result.seo_description) {
          data.tools[slug].seo_description = result.seo_description;
        }
        fixed++;
        console.log(' ✓');
      } else {
        console.log(' ✗');
      }
      
      await new Promise(r => setTimeout(r, 200));
    }
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`   完成: ${fixed}/${needsTranslation.length}`);
  }
  
  console.log('\n✅ 完成！');
}

main().catch(console.error);
