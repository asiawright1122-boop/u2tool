const fs = require('fs');
const zh = JSON.parse(fs.readFileSync('src/messages/zh.json', 'utf8'));

// 检查所有字段
const fields = ['name', 'description', 'seo_title', 'seo_description', 'detailed_description'];
const untranslated = {};

for (const [slug, tool] of Object.entries(zh.tools)) {
  if (typeof tool !== 'object') continue;
  
  for (const field of fields) {
    if (tool[field] && typeof tool[field] === 'string') {
      // 检查是否主要是英文（没有中文字符且长度>20）
      if (!/[\u4e00-\u9fa5]/.test(tool[field]) && tool[field].length > 20) {
        if (!untranslated[field]) untranslated[field] = [];
        untranslated[field].push(slug);
      }
    }
  }
  
  // 检查 usage_steps
  if (tool.usage_steps && Array.isArray(tool.usage_steps)) {
    const hasEnglish = tool.usage_steps.some(step => 
      typeof step === 'string' && !/[\u4e00-\u9fa5]/.test(step) && step.length > 10
    );
    if (hasEnglish) {
      if (!untranslated['usage_steps']) untranslated['usage_steps'] = [];
      untranslated['usage_steps'].push(slug);
    }
  }
  
  // 检查 usage_examples
  if (tool.usage_examples && Array.isArray(tool.usage_examples)) {
    const hasEnglish = tool.usage_examples.some(ex => 
      typeof ex === 'string' && !/[\u4e00-\u9fa5]/.test(ex) && ex.length > 10
    );
    if (hasEnglish) {
      if (!untranslated['usage_examples']) untranslated['usage_examples'] = [];
      untranslated['usage_examples'].push(slug);
    }
  }
}

console.log('未翻译内容统计：');
for (const [field, slugs] of Object.entries(untranslated)) {
  console.log(`\n${field}: ${slugs.length} 个工具`);
  slugs.slice(0, 5).forEach(s => console.log('  - ' + s));
  if (slugs.length > 5) console.log('  ... 还有 ' + (slugs.length - 5) + ' 个');
}
