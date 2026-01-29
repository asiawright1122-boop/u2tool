/**
 * 使用 SiliconFlow API 翻译 detailed_description
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

const SILICONFLOW_API_KEY = 'sk-wunwjfhqseabkhfltebhzccyuhofazcugowzcvrjzhqblhog';
const LOCALES = ['zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];

const LANG_NAMES = {
  zh: '简体中文',
  ja: '日语',
  ko: '韩语',
  es: '西班牙语',
  pt: '葡萄牙语',
  fr: '法语',
  de: '德语',
  ru: '俄语',
  ar: '阿拉伯语'
};

// 需要翻译的工具
const TOOLS_TO_TRANSLATE = [
  'png-to-svg',
  'break-even-calculator',
  'glassmorphism-generator',
  'neumorphism-generator',
  'blob-generator',
  'wave-generator',
  'mesh-gradient-generator',
  'noise-texture-generator',
  'commit-message-generator',
  'bandwidth-calculator',
  'data-transfer-calculator',
  'pixel-density-calculator',
  'dpi-calculator'
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
            reject(new Error('Invalid response: ' + body));
          }
        } catch (e) {
          reject(new Error('Parse error: ' + body));
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function translateText(text, targetLang) {
  const langName = LANG_NAMES[targetLang];
  
  const prompt = `将以下英文工具介绍翻译成${langName}。要求：
1. 翻译要自然流畅，符合目标语言习惯
2. 保持专业术语（如 Glassmorphism、SVG、CSS 等）不翻译
3. 只返回翻译结果，不要有其他内容

英文原文：
${text}`;

  try {
    const response = await callAPI(prompt);
    return response.trim();
  } catch (e) {
    console.error('Translation error:', e.message);
    return null;
  }
}

async function main() {
  console.log('🔧 翻译 detailed_description...\n');
  
  // 加载英文翻译
  const enPath = path.join(__dirname, '..', 'src', 'messages', 'en.json');
  const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
  
  for (const locale of LOCALES) {
    console.log(`\n📂 处理 ${locale} (${LANG_NAMES[locale]})...`);
    
    const filePath = path.join(__dirname, '..', 'src', 'messages', `${locale}.json`);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    let translated = 0;
    
    for (const slug of TOOLS_TO_TRANSLATE) {
      if (!enData.tools[slug] || !enData.tools[slug].detailed_description) {
        console.log(`   ⚠️ ${slug}: 英文 detailed_description 不存在`);
        continue;
      }
      
      const enText = enData.tools[slug].detailed_description;
      
      console.log(`   翻译 ${slug}...`);
      const translatedText = await translateText(enText, locale);
      
      if (translatedText) {
        if (!data.tools[slug]) {
          data.tools[slug] = {};
        }
        data.tools[slug].detailed_description = translatedText;
        translated++;
      }
      
      // 避免 API 限流
      await new Promise(r => setTimeout(r, 300));
    }
    
    // 保存文件
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`   ✓ 翻译了 ${translated} 个工具`);
  }
  
  console.log('\n✅ 完成！');
}

main().catch(console.error);
