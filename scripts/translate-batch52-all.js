/**
 * 批量翻译 Batch 52 工具到所有语言
 * 使用 NVIDIA NIM API
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const CONFIG = {
  apiUrl: 'https://integrate.api.nvidia.com/v1/chat/completions',
  model: process.env.NVIDIA_MODEL || 'meta/llama-3.1-70b-instruct',
  messagesDir: path.join(process.cwd(), 'src', 'messages'),
};

const TARGET_LOCALES = ['zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];

const LOCALE_NAMES = {
  zh: 'Simplified Chinese (简体中文)',
  ja: 'Japanese (日本語)',
  ko: 'Korean (한국어)',
  es: 'Spanish (Español)',
  pt: 'Portuguese (Português)',
  fr: 'French (Français)',
  de: 'German (Deutsch)',
  ru: 'Russian (Русский)',
  ar: 'Arabic (العربية)',
};

const BATCH52_TOOLS = [
  'glassmorphism-generator', 'neumorphism-generator', 'blob-generator',
  'wave-generator', 'mesh-gradient-generator', 'noise-texture-generator',
  'commit-message-generator',
  'bandwidth-calculator', 'data-transfer-calculator', 
  'pixel-density-calculator', 'dpi-calculator'
];

async function translateContent(enContent, targetLocale) {
  const apiKey = process.env.NVIDIA_API_KEY;
  
  if (!apiKey) {
    console.error('❌ 请设置 NVIDIA_API_KEY 环境变量');
    process.exit(1);
  }

  const localeName = LOCALE_NAMES[targetLocale];

  const systemPrompt = `You are an expert translator and SEO copywriter. Translate the following JSON content from English to ${localeName}.

Requirements:
1. Write naturally as a native speaker
2. Keep SEO keywords relevant to the target market
3. Maintain the same meaning and tone
4. Include local equivalents of "free", "online", "no registration"
5. Keep technical terms (like CSS, SVG, DPI, PPI, etc.) in English
6. Preserve all JSON keys exactly as they are

Return ONLY valid JSON with the same structure. No markdown, no explanations.`;

  const userPrompt = `Translate to ${localeName}:

${JSON.stringify(enContent, null, 2)}`;

  try {
    const response = await fetch(CONFIG.apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: CONFIG.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.3,
        max_tokens: 3000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      if (error.includes('429')) {
        return { error: 'rate_limit' };
      }
      return null;
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;

    if (!text) return null;

    let jsonStr = text.trim();
    if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }
    
    try {
      return JSON.parse(jsonStr);
    } catch {
      const match = jsonStr.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          return JSON.parse(match[0].replace(/,(\s*[}\]])/g, '$1'));
        } catch {
          return null;
        }
      }
      return null;
    }
  } catch (error) {
    console.error(`翻译失败:`, error.message);
    return null;
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log('🚀 批量翻译 Batch 52 工具到所有语言\n');
  
  // 读取英文内容
  const enPath = path.join(CONFIG.messagesDir, 'en.json');
  const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
  
  for (const locale of TARGET_LOCALES) {
    console.log(`\n📝 翻译到 ${locale} (${LOCALE_NAMES[locale]})`);
    
    const localePath = path.join(CONFIG.messagesDir, `${locale}.json`);
    const localeData = JSON.parse(fs.readFileSync(localePath, 'utf8'));
    
    let updated = 0;
    let rateLimited = false;
    
    for (const slug of BATCH52_TOOLS) {
      if (rateLimited) {
        console.log(`   ⏸️ ${slug}: 跳过 (限流)`);
        continue;
      }
      
      // 检查是否已有翻译
      if (localeData.tools[slug] && localeData.tools[slug].name && localeData.tools[slug].detailed_description) {
        console.log(`   ✓ ${slug}: 已存在`);
        continue;
      }
      
      const enTool = enData.tools[slug];
      if (!enTool) {
        console.log(`   ⚠️ ${slug}: 英文不存在`);
        continue;
      }
      
      process.stdout.write(`   🔄 ${slug}... `);
      
      const translated = await translateContent(enTool, locale);
      
      if (translated?.error === 'rate_limit') {
        console.log('⏸️ 限流');
        rateLimited = true;
        continue;
      }
      
      if (translated && translated.name) {
        localeData.tools[slug] = translated;
        console.log('✅');
        updated++;
      } else {
        console.log('❌');
      }
      
      // 延迟避免限流
      await sleep(2000);
    }
    
    // 保存更新
    fs.writeFileSync(localePath, JSON.stringify(localeData, null, 2) + '\n');
    console.log(`   📊 更新: ${updated} 个工具`);
    
    if (rateLimited) {
      console.log('\n⚠️ API 限流，等待 60 秒后继续...');
      await sleep(60000);
    }
  }
  
  console.log('\n✅ 翻译完成！');
  console.log('\n📋 后续步骤:');
  console.log('   运行 npx tsx scripts/split-translations.ts 更新拆分文件');
}

main().catch(console.error);
