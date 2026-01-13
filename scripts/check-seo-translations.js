const fs = require('fs');
const locales = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];
const testTools = ['json-formatter', 'base64', 'uuid-generator', 'hash-generator', 'url-encoder'];

console.log('=== 检查 SEO 翻译数据 ===\n');

for (const tool of testTools) {
  console.log(`工具: ${tool}`);
  for (const locale of locales) {
    const data = JSON.parse(fs.readFileSync(`src/messages/${locale}.json`, 'utf8'));
    const toolData = data.tools && data.tools[tool] ? data.tools[tool] : {};
    const hasSeoTitle = !!toolData.seo_title;
    const hasSeoDesc = !!toolData.seo_description;
    const seoTitle = toolData.seo_title || '(无)';
    console.log(`  ${locale}: title=${hasSeoTitle ? 'Y' : 'N'} desc=${hasSeoDesc ? 'Y' : 'N'}`);
    if (locale === 'en' || locale === 'zh') {
      console.log(`       标题: ${seoTitle.substring(0, 60)}...`);
    }
  }
  console.log('');
}

// 统计所有工具的 SEO 覆盖率
console.log('=== SEO 覆盖率统计 ===\n');

const allSlugs = [];
const toolsConfig = fs.readFileSync('src/config/tools.ts', 'utf8');
const slugMatches = toolsConfig.matchAll(/slug:\s*['"]([^'"]+)['"]/g);
for (const match of slugMatches) {
  allSlugs.push(match[1]);
}

console.log(`总工具数: ${allSlugs.length}`);

for (const locale of locales) {
  const data = JSON.parse(fs.readFileSync(`src/messages/${locale}.json`, 'utf8'));
  let withTitle = 0;
  let withDesc = 0;
  
  for (const slug of allSlugs) {
    const toolData = data.tools && data.tools[slug] ? data.tools[slug] : {};
    if (toolData.seo_title) withTitle++;
    if (toolData.seo_description) withDesc++;
  }
  
  console.log(`${locale}: seo_title=${withTitle}/${allSlugs.length} (${(withTitle/allSlugs.length*100).toFixed(1)}%), seo_description=${withDesc}/${allSlugs.length} (${(withDesc/allSlugs.length*100).toFixed(1)}%)`);
}
