/**
 * 完整修复所有语言的 SEO 本地化
 * 1. 为缺少 seo_title/seo_description 的工具生成
 * 2. 翻译仍为英文的 SEO 内容
 */
const fs = require('fs');
const https = require('https');

const SILICONFLOW_API_KEY = 'sk-wunwjfhqseabkhfltebhzccyuhofazcugowzcvrjzhqblhog';

const LOCALES = ['zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];

const LANG_CONFIGS = {
  zh: { name: '中文', keywords: '免费、在线、工具' },
  ja: { name: '日语', keywords: '無料、オンライン、ツール' },
  ko: { name: '韩语', keywords: '무료、온라인、도구' },
  es: { name: '西班牙语', keywords: 'gratis、online、herramienta' },
  pt: { name: '葡萄牙语', keywords: 'grátis、online、ferramenta' },
  fr: { name: '法语', keywords: 'gratuit、en ligne、outil' },
  de: { name: '德语', keywords: 'kostenlos、online、Tool' },
  ru: { name: '俄语', keywords: 'бесплатно、онлайн、инструмент' },
  ar: { name: '阿拉伯语', keywords: 'مجاني、عبر الإنترنت、أداة' }
};

// 各语言的特征词
const LOCALE_MARKERS = {
  es: ['gratis', 'gratuito', 'herramienta', 'convertidor', 'generador', 'calculadora', 'línea', 'convierte', 'genera'],
  pt: ['grátis', 'gratuito', 'ferramenta', 'conversor', 'gerador', 'calculadora', 'linha', 'converte', 'gera'],
  fr: ['gratuit', 'outil', 'convertisseur', 'générateur', 'calculateur', 'ligne', 'convertit', 'génère'],
  de: ['kostenlos', 'werkzeug', 'konverter', 'generator', 'rechner', 'umwandeln', 'erstellen'],
  ko: ['무료', '온라인', '도구', '생성기', '변환기', '계산기'],
  ja: ['無料', 'オンライン', 'ツール', 'ジェネレーター', 'コンバーター'],
  ru: ['бесплатн', 'онлайн', 'инструмент', 'генератор', 'конвертер'],
  ar: ['مجان', 'أداة', 'مولد', 'محول', 'حاسبة'],
  zh: ['免费', '在线', '工具', '生成器', '转换器', '计算器']
};

function isEnglishOnly(text, locale) {
  if (!text) return false;
  
  if (['zh', 'ja', 'ko', 'ru', 'ar'].includes(locale)) {
    if (/^[\x00-\x7F]+$/.test(text) && /[a-zA-Z]{4,}/.test(text)) {
      return true;
    }
    return false;
  }
  
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
                reject(new Error('Invalid response: ' + body));
              }
            } catch (e) {
              reject(e);
            }
          });
        });
        
        req.on('error', reject);
        req.on('timeout', () => {
          req.destroy();
          reject(new Error('Request timeout'));
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
3. 保持专业术语不翻译（如 JSON、Base64、SVG、CSS、HTML、PDF、URL 等）
4. seo_title 30-60字符，seo_description 120-160字符

返回 JSON:
{"seo_title": "...", "seo_description": "..."}

只返回 JSON，不要其他内容。`;

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

async function generateSEO(toolName, toolDesc, locale) {
  const config = LANG_CONFIGS[locale];
  
  const prompt = `为以下工具生成${config.name}的 SEO 标题和描述。

工具名称: ${toolName}
工具描述: ${toolDesc}

要求:
1. 内容要自然流畅，符合${config.name}习惯
2. 包含关键词（${config.keywords}）
3. 保持专业术语不翻译（如 JSON、Base64、SVG、CSS、HTML、PDF、URL 等）
4. seo_title 30-60字符，seo_description 120-160字符
5. 突出工具的核心功能和优势

返回 JSON:
{"seo_title": "...", "seo_description": "..."}

只返回 JSON，不要其他内容。`;

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
  
  // 统计
  const stats = {
    total: 0,
    fixed: 0,
    failed: 0
  };
  
  for (const locale of LOCALES) {
    console.log(`\n${'='.repeat(50)}`);
    console.log(`📂 处理 ${locale} (${LANG_CONFIGS[locale].name})`);
    console.log('='.repeat(50));
    
    const filePath = `src/messages/${locale}.json`;
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // 找出需要处理的工具
    const needsWork = [];
    
    for (const [slug, tool] of Object.entries(data.tools)) {
      if (typeof tool !== 'object') continue;
      
      const title = tool.seo_title;
      const desc = tool.seo_description;
      
      // 检查是否缺失或仍为英文
      const missingTitle = !title;
      const missingDesc = !desc;
      const englishTitle = title && isEnglishOnly(title, locale);
      const englishDesc = desc && isEnglishOnly(desc, locale);
      
      if (missingTitle || missingDesc || englishTitle || englishDesc) {
        needsWork.push({
          slug,
          missingTitle,
          missingDesc,
          englishTitle,
          englishDesc
        });
      }
    }
    
    console.log(`需要处理: ${needsWork.length} 个工具`);
    
    if (needsWork.length === 0) {
      console.log('✅ 无需处理');
      continue;
    }
    
    let fixed = 0;
    let failed = 0;
    
    for (let i = 0; i < needsWork.length; i++) {
      const item = needsWork[i];
      const { slug, missingTitle, missingDesc, englishTitle, englishDesc } = item;
      
      const enTool = enData.tools[slug];
      if (!enTool) {
        console.log(`  ⚠️  ${slug}: 英文版本不存在`);
        failed++;
        continue;
      }
      
      process.stdout.write(`  [${i + 1}/${needsWork.length}] ${slug}...`);
      
      let result = null;
      
      // 如果有英文 SEO，翻译它
      if (enTool.seo_title && enTool.seo_description) {
        result = await translateSEO(enTool.seo_title, enTool.seo_description, locale);
      } 
      // 否则根据工具名称和描述生成
      else if (enTool.name && enTool.description) {
        result = await generateSEO(enTool.name, enTool.description, locale);
      }
      
      if (result && result.seo_title && result.seo_description) {
        // 只更新需要更新的字段
        if (missingTitle || englishTitle) {
          data.tools[slug].seo_title = result.seo_title;
        }
        if (missingDesc || englishDesc) {
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
      
      // 避免 API 限流
      await new Promise(r => setTimeout(r, 200));
    }
    
    // 最终保存
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    
    console.log(`\n完成: ${fixed}/${needsWork.length} (失败: ${failed})`);
    
    stats.total += needsWork.length;
    stats.fixed += fixed;
    stats.failed += failed;
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 总计');
  console.log('='.repeat(50));
  console.log(`处理: ${stats.total} 个`);
  console.log(`成功: ${stats.fixed} 个`);
  console.log(`失败: ${stats.failed} 个`);
}

main().catch(console.error);
