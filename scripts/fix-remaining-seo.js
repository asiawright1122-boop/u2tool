/**
 * 修复剩余的 SEO 本地化问题
 * 只处理实际工具，跳过 UI 命名空间
 */
const fs = require('fs');
const https = require('https');

const SILICONFLOW_API_KEY = 'sk-wunwjfhqseabkhfltebhzccyuhofazcugowzcvrjzhqblhog';

const LANG_CONFIGS = {
  es: { name: '西班牙语', keywords: 'gratis、online、herramienta' },
  pt: { name: '葡萄牙语', keywords: 'grátis、online、ferramenta' },
  fr: { name: '法语', keywords: 'gratuit、en ligne、outil' },
  de: { name: '德语', keywords: 'kostenlos、online、Tool' }
};

const LOCALE_MARKERS = {
  es: ['gratis', 'gratuito', 'herramienta', 'convertidor', 'generador', 'calculadora', 'línea', 'convierte', 'genera'],
  pt: ['grátis', 'gratuito', 'ferramenta', 'conversor', 'gerador', 'calculadora', 'linha', 'converte', 'gera'],
  fr: ['gratuit', 'outil', 'convertisseur', 'générateur', 'calculateur', 'ligne', 'convertit', 'génère'],
  de: ['kostenlos', 'werkzeug', 'konverter', 'generator', 'rechner', 'umwandeln', 'erstellen']
};

function isEnglishOnly(text, locale) {
  if (!text) return false;
  const markers = LOCALE_MARKERS[locale] || [];
  const lowerText = text.toLowerCase();
  if (markers.some(marker => lowerText.includes(marker.toLowerCase()))) {
    return false;
  }
  const englishOnlyWords = ['free', 'online', 'tool', 'generator', 'converter', 'calculator', 'create', 'convert', 'generate'];
  return englishOnlyWords.some(word => lowerText.includes(word));
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

async function translateSEO(enTitle, enDesc, locale) {
  const config = LANG_CONFIGS[locale];
  
  const prompt = `将以下英文 SEO 内容翻译成${config.name}。

英文标题: ${enTitle}
英文描述: ${enDesc}

要求:
1. 翻译要自然流畅，符合${config.name}习惯
2. 包含关键词（${config.keywords}）
3. 保持专业术语不翻译（如 JSON、Base64、SVG、CSS、HTML、PDF、URL、API、JWT、SQL 等）
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
  
  // 获取实际工具列表
  const realToolSlugs = new Set();
  for (const [slug, tool] of Object.entries(enData.tools)) {
    if (typeof tool === 'object' && tool.name) {
      realToolSlugs.add(slug);
    }
  }
  
  const localesToFix = ['es', 'pt', 'fr', 'de'];
  
  for (const locale of localesToFix) {
    console.log(`\n${'='.repeat(50)}`);
    console.log(`📂 处理 ${locale} (${LANG_CONFIGS[locale].name})`);
    console.log('='.repeat(50));
    
    const filePath = `src/messages/${locale}.json`;
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // 找出需要翻译的工具
    const needsWork = [];
    
    for (const [slug, tool] of Object.entries(data.tools)) {
      if (typeof tool !== 'object') continue;
      if (!realToolSlugs.has(slug)) continue;
      
      const title = tool.seo_title;
      const desc = tool.seo_description;
      
      const englishTitle = title && isEnglishOnly(title, locale);
      const englishDesc = desc && isEnglishOnly(desc, locale);
      
      if (englishTitle || englishDesc) {
        needsWork.push({ slug, englishTitle, englishDesc });
      }
    }
    
    console.log(`需要翻译: ${needsWork.length} 个工具`);
    
    if (needsWork.length === 0) {
      console.log('✅ 无需处理');
      continue;
    }
    
    let fixed = 0;
    let failed = 0;
    
    for (let i = 0; i < needsWork.length; i++) {
      const { slug, englishTitle, englishDesc } = needsWork[i];
      
      const enTool = enData.tools[slug];
      if (!enTool || !enTool.seo_title) {
        console.log(`  ⚠️  ${slug}: 英文 SEO 不存在`);
        failed++;
        continue;
      }
      
      process.stdout.write(`  [${i + 1}/${needsWork.length}] ${slug}...`);
      
      const result = await translateSEO(enTool.seo_title, enTool.seo_description, locale);
      
      if (result && result.seo_title && result.seo_description) {
        if (englishTitle) {
          data.tools[slug].seo_title = result.seo_title;
        }
        if (englishDesc) {
          data.tools[slug].seo_description = result.seo_description;
        }
        fixed++;
        console.log(' ✓');
      } else {
        failed++;
        console.log(' ✗');
      }
      
      // 每处理 10 个保存一次
      if ((i + 1) % 10 === 0) {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      }
      
      await new Promise(r => setTimeout(r, 200));
    }
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`\n完成: ${fixed}/${needsWork.length} (失败: ${failed})`);
  }
  
  console.log('\n✅ 全部完成！');
}

main().catch(console.error);
