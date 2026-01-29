const fs = require('fs');
const zh = JSON.parse(fs.readFileSync('src/messages/zh.json', 'utf8'));

// 找出 detailed_description 仍为英文的工具
let count = 0;
const untranslated = [];
for (const [slug, tool] of Object.entries(zh.tools)) {
  if (typeof tool === 'object' && tool.detailed_description) {
    // 检查是否主要是英文（没有中文字符）
    if (!/[\u4e00-\u9fa5]/.test(tool.detailed_description)) {
      count++;
      untranslated.push(slug);
    }
  }
}
console.log('detailed_description 未翻译的工具数量:', count);
untranslated.forEach(s => console.log(s));
