const fs = require('fs');

const locales = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];
const enData = JSON.parse(fs.readFileSync('src/messages/en.json', 'utf8'));

// 获取所有英文工具的键
const enToolKeys = Object.keys(enData.tools || {});

const report = {
  summary: {},
  details: {}
};

for (const locale of locales) {
  if (locale === 'en') continue;
  
  const data = JSON.parse(fs.readFileSync('src/messages/' + locale + '.json', 'utf8'));
  report.details[locale] = [];
  
  for (const toolKey of enToolKeys) {
    const enTool = enData.tools[toolKey];
    const localeTool = data.tools && data.tools[toolKey];
    
    if (!localeTool || typeof enTool !== 'object') continue;
    
    // 检查各字段
    const fieldsToCheck = ['name', 'description', 'seo_title', 'seo_description'];
    
    for (const field of fieldsToCheck) {
      if (enTool[field] && localeTool[field] === enTool[field]) {
        // 只检查较长的文本（排除短的技术术语）
        const value = enTool[field];
        if (value.length > 15) {
          report.details[locale].push({
            tool: toolKey,
            field: field,
            englishValue: value
          });
        }
      }
    }
  }
  
  report.summary[locale] = report.details[locale].length;
}

// 输出 JSON 报告
fs.writeFileSync('reports/untranslated-values-report.json', JSON.stringify(report, null, 2));

// 输出 Markdown 报告
let md = '# 未翻译值报告\n\n';
md += '生成时间: ' + new Date().toISOString() + '\n\n';

md += '## 统计摘要\n\n';
md += '| 语言 | 未翻译数量 |\n';
md += '|------|------------|\n';
let total = 0;
for (const locale of Object.keys(report.summary)) {
  md += '| ' + locale + ' | ' + report.summary[locale] + ' |\n';
  total += report.summary[locale];
}
md += '| **总计** | **' + total + '** |\n\n';

md += '## 详细列表\n\n';

for (const locale of Object.keys(report.details)) {
  if (report.details[locale].length === 0) continue;
  
  md += '### ' + locale.toUpperCase() + ' (' + report.details[locale].length + ' 个)\n\n';
  
  // 按工具分组
  const byTool = {};
  for (const item of report.details[locale]) {
    if (!byTool[item.tool]) byTool[item.tool] = [];
    byTool[item.tool].push(item);
  }
  
  for (const tool of Object.keys(byTool)) {
    md += '#### ' + tool + '\n\n';
    for (const item of byTool[tool]) {
      md += '- **' + item.field + '**: `' + item.englishValue.substring(0, 80) + (item.englishValue.length > 80 ? '...' : '') + '`\n';
    }
    md += '\n';
  }
}

fs.writeFileSync('reports/untranslated-values-report.md', md);

console.log('报告已生成:');
console.log('  - reports/untranslated-values-report.json');
console.log('  - reports/untranslated-values-report.md');
console.log('\n统计:');
for (const locale of Object.keys(report.summary)) {
  console.log('  ' + locale + ': ' + report.summary[locale] + ' 个未翻译');
}
console.log('  总计: ' + total + ' 个');
