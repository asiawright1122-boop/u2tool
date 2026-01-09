const fs = require('fs');
const en = JSON.parse(fs.readFileSync('src/messages/en.json', 'utf8'));
const zh = JSON.parse(fs.readFileSync('src/messages/zh.json', 'utf8'));

// 获取所有工具 slug
const enTools = Object.keys(en.tools).filter(k => typeof en.tools[k] === 'object' && en.tools[k].name);
const zhTools = Object.keys(zh.tools).filter(k => typeof zh.tools[k] === 'object' && zh.tools[k].name);

// 找出在英文中有但中文中没有的工具
const missingInZh = enTools.filter(slug => !zhTools.includes(slug));

// 找出中文翻译不完整的工具（缺少 detailed_description, usage_steps, usage_examples）
const incompleteInZh = zhTools.filter(slug => {
  const tool = zh.tools[slug];
  return !tool.detailed_description || !tool.usage_steps || !tool.usage_examples;
});

console.log('=== 中文翻译缺失的工具 ===');
console.log(missingInZh.length > 0 ? missingInZh.join('\n') : '无');

console.log('\n=== 中文翻译不完整的工具（缺少详细描述/使用步骤/示例）===');
incompleteInZh.forEach(slug => {
  const tool = zh.tools[slug];
  const missing = [];
  if (!tool.detailed_description) missing.push('detailed_description');
  if (!tool.usage_steps) missing.push('usage_steps');
  if (!tool.usage_examples) missing.push('usage_examples');
  console.log(`${slug}: 缺少 ${missing.join(', ')}`);
});
console.log('\n总计不完整:', incompleteInZh.length);
