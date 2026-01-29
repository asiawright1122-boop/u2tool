/**
 * 修复混合语言问题
 */
const fs = require('fs');
const https = require('https');

const SILICONFLOW_API_KEY = 'sk-wunwjfhqseabkhfltebhzccyuhofazcugowzcvrjzhqblhog';

const LOCALES = ['es', 'pt', 'fr', 'de', 'ru', 'ar', 'ja', 'ko'];

const LANG_CONFIGS = {
  es: { name: '西班牙语', keywords: 'gratis、online、herramienta' },
  pt: { name: '葡萄牙语', keywords: 'grátis、online、ferramenta' },
  fr: { name: '法语', keywords: 'gratuit、en ligne、outil' },
  de: { name: '德语', keywords: 'kostenlos、online、Tool' },
  ru: { name: '俄语', keywords: 'бесплатно、онлайн、инструмент' },
  ar: { name: '阿拉伯语', keywords: 'مجاني、عبر الإنترنت、أداة' },
  ja: { name: '日语', keywords: '無料、オンライン、ツール' },
  ko: { name: '韩语', keywords: '무료、온라인、도구' }
};

// 检查是否包含中文
function containsChinese(text) {
  return /[\u4e00-\u9fff]/.test(text);
}

// 检查是否包含乱码
function containsGarbage(text) {
  return /[\ufffd\u0000-\u001f]/.test(text) || /�/.test(text);
}

async function callAPI(prompt, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await new Promise((resolve, reject) => {
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
          },
          timeout: 30000
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
        req.on('timeout', () => {
          req.destroy();
          reject(new Error('Timeout'));
        });
        
        req.write(data);
        req.end();
      });
    } catch (e) {
      if (i === retries - 1) throw e;
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
}

async function generateSEO(toolName, toolDesc, locale) {
  const config = LANG_CONFIGS[locale];
  
  const prompt = `为以下工具生成${config.name}的 SEO 标题和描述。

工具名称: ${toolName}
工具描述: ${toolDesc}

要求:
1. 内容必须完全使用${config.name}，不能混合其他语言（如中文、英文等）
2. 包含关键词（${config.keywords}）
3. 保持专业术语不翻译（如 JSON、Base64、SVG、CSS、HTML、PDF、URL、API、GIF、D4、D6、D8、D10、D12、D20 等）
4. seo_title 30-60字符，seo_description 120-160字符
5. 不要使用任何占位符

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
    console.error(`API error: ${e.message}`);
  }
  return null;
}

async function main() {
  const enData = JSON.parse(fs.readFileSync('src/messages/en.json', 'utf8'));
  
  for (const locale of LOCALES) {
    console.log(`\n📂 检查 ${locale} (${LANG_CONFIGS[locale].name})`);
    
    const filePath = `src/messages/${locale}.json`;
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    const toFix = [];
    
    // 找出有问题的工具
    for (const [slug, tool] of Object.entries(data.tools)) {
      if (typeof tool !== 'object') continue;
      
      const title = tool.seo_title || '';
      const desc = tool.seo_description || '';
      
      if (containsChinese(title) || containsChinese(desc) || 
          containsGarbage(title) || containsGarbage(desc)) {
        toFix.push(slug);
      }
    }
    
    if (toFix.length === 0) {
      console.log('  ✅ 无混合语言问题');
      continue;
    }
    
    console.log(`  需要修复: ${toFix.length} 个`);
    
    let fixed = 0;
    for (const slug of toFix) {
      const enTool = enData.tools[slug];
      if (!enTool || !enTool.name) continue;
      
      process.stdout.write(`  ${slug}...`);
      
      const result = await generateSEO(enTool.name, enTool.description, locale);
      
      if (result && result.seo_title && result.seo_description) {
        data.tools[slug].seo_title = result.seo_title;
        data.tools[slug].seo_description = result.seo_description;
        fixed++;
        console.log(' ✓');
      } else {
        console.log(' ✗');
      }
      
      await new Promise(r => setTimeout(r, 200));
    }
    
    if (fixed > 0) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      console.log(`  修复: ${fixed} 个`);
    }
  }
  
  console.log('\n✅ 完成！');
}

main().catch(console.error);
