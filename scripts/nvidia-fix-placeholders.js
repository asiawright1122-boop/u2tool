/**
 * 使用 NVIDIA AI 修复所有占位符翻译
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY || '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';
const LOCALES = ['zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];

// 语言名称映射
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

// 调用 NVIDIA API
async function callNvidiaAPI(prompt) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      model: 'nvidia/llama-3.1-nemotron-70b-instruct',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
      max_tokens: 4096
    });

    const options = {
      hostname: 'integrate.api.nvidia.com',
      port: 443,
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${NVIDIA_API_KEY}`
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
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

// 扫描占位符翻译
function findPlaceholders(data, prefix = '') {
  const placeholders = [];
  
  for (const [key, value] of Object.entries(data)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof value === 'string') {
      // 检查是否是占位符格式 [xxx] 或 tools.xxx.xxx
      if (value.startsWith('[') && value.endsWith(']')) {
        placeholders.push({ key: fullKey, value, type: 'bracket' });
      } else if (value.startsWith('tools.') && value.includes('.')) {
        placeholders.push({ key: fullKey, value, type: 'key-path' });
      }
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      placeholders.push(...findPlaceholders(value, fullKey));
    }
  }
  
  return placeholders;
}


// 从英文翻译文件获取原始值
function getEnglishValue(enData, keyPath) {
  const parts = keyPath.split('.');
  let current = enData;
  
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return null;
    }
  }
  
  return typeof current === 'string' ? current : null;
}

// 设置翻译值
function setTranslation(data, keyPath, value) {
  const parts = keyPath.split('.');
  let current = data;
  
  for (let i = 0; i < parts.length - 1; i++) {
    if (!(parts[i] in current)) {
      current[parts[i]] = {};
    }
    current = current[parts[i]];
  }
  
  current[parts[parts.length - 1]] = value;
}

// 批量翻译
async function translateBatch(texts, targetLang) {
  const langName = LANG_NAMES[targetLang];
  
  const prompt = `你是一个专业的翻译工具。请将以下英文 UI 文本翻译成${langName}。

要求：
1. 翻译要简洁、自然、符合目标语言习惯
2. 保持技术术语的准确性
3. UI 文本要简短
4. 返回 JSON 格式，键为原文，值为翻译

需要翻译的文本：
${JSON.stringify(texts, null, 2)}

请只返回 JSON 对象，不要有其他内容。`;

  try {
    const response = await callNvidiaAPI(prompt);
    // 提取 JSON
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.error('Translation error:', e.message);
  }
  
  return null;
}

// 主函数
async function main() {
  console.log('🔍 扫描占位符翻译...\n');
  
  // 加载英文翻译
  const enPath = path.join(__dirname, '..', 'src', 'messages', 'en.json');
  const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
  
  for (const locale of LOCALES) {
    console.log(`\n📂 处理 ${locale} (${LANG_NAMES[locale]})...`);
    
    const filePath = path.join(__dirname, '..', 'src', 'messages', `${locale}.json`);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // 找出所有占位符
    const placeholders = findPlaceholders(data);
    
    if (placeholders.length === 0) {
      console.log('   ✓ 没有占位符翻译');
      continue;
    }
    
    console.log(`   发现 ${placeholders.length} 个占位符翻译`);
    
    // 收集需要翻译的英文文本
    const toTranslate = {};
    for (const p of placeholders) {
      const enValue = getEnglishValue(enData, p.key);
      if (enValue && !enValue.startsWith('[')) {
        toTranslate[p.key] = enValue;
      }
    }
    
    if (Object.keys(toTranslate).length === 0) {
      console.log('   ⚠️ 没有找到对应的英文翻译');
      continue;
    }
    
    console.log(`   需要翻译 ${Object.keys(toTranslate).length} 个文本`);
    
    // 分批翻译（每批 30 个）
    const entries = Object.entries(toTranslate);
    const batchSize = 30;
    let translated = 0;
    
    for (let i = 0; i < entries.length; i += batchSize) {
      const batch = entries.slice(i, i + batchSize);
      const textsToTranslate = {};
      batch.forEach(([key, value]) => {
        textsToTranslate[value] = value;
      });
      
      console.log(`   翻译批次 ${Math.floor(i / batchSize) + 1}/${Math.ceil(entries.length / batchSize)}...`);
      
      const translations = await translateBatch(Object.keys(textsToTranslate), locale);
      
      if (translations) {
        for (const [key, enValue] of batch) {
          if (translations[enValue]) {
            setTranslation(data, key, translations[enValue]);
            translated++;
          }
        }
      }
      
      // 避免 API 限流
      await new Promise(r => setTimeout(r, 1000));
    }
    
    // 保存文件
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`   ✓ 翻译了 ${translated} 个文本`);
  }
  
  console.log('\n✅ 完成！');
}

main().catch(console.error);
