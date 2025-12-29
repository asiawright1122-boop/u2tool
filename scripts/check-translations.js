/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

// 1. 获取所有工具 slug
const toolsConfigPath = path.join(__dirname, '../src/config/tools.ts');
const toolsConfigContent = fs.readFileSync(toolsConfigPath, 'utf8');
const slugRegex = /slug:\s*'([^']+)'/g;
let match;
const allSlugs = [];
while ((match = slugRegex.exec(toolsConfigContent)) !== null) {
  allSlugs.push(match[1]);
}

console.log(`Found ${allSlugs.length} tools in config.`);

// 2. 检查翻译文件
const locales = ['en', 'zh', 'ja', 'es', 'pt'];
const messagesDir = path.join(__dirname, '../src/messages');

locales.forEach(locale => {
  const filePath = path.join(messagesDir, `${locale}.json`);
  if (!fs.existsSync(filePath)) {
    console.error(`Missing translation file: ${locale}.json`);
    return;
  }

  try {
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const missing = [];
    
    allSlugs.forEach(slug => {
      // 检查 tool.<slug> 是否存在
      if (!content.tool || !content.tool[slug]) {
        missing.push(slug);
      }
    });

    if (missing.length > 0) {
      console.log(`\n[${locale}] Missing ${missing.length} translations:`);
      missing.forEach(slug => console.log(`  - ${slug}`));
    } else {
      console.log(`\n[${locale}] All clear!`);
    }

  } catch (e) {
    console.error(`Error parsing ${locale}.json:`, e.message);
  }
});
