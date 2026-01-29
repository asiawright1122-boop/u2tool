const fs = require('fs');
const en = JSON.parse(fs.readFileSync('src/messages/en.json', 'utf8'));
const zh = JSON.parse(fs.readFileSync('src/messages/zh.json', 'utf8'));

// 递归查找占位符
function findPlaceholders(obj, path = '') {
  const results = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullPath = path ? path + '.' + key : key;
    if (typeof value === 'string' && value.startsWith('[') && value.endsWith(']')) {
      results.push({ path: fullPath, placeholder: value });
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      results.push(...findPlaceholders(value, fullPath));
    }
  }
  return results;
}

// 获取嵌套值
function getValue(obj, path) {
  const parts = path.split('.');
  let current = obj;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return null;
    }
  }
  return current;
}

const placeholders = findPlaceholders(zh);
console.log('占位符及其英文原文：');
for (const p of placeholders) {
  const enValue = getValue(en, p.path);
  console.log(p.path + ': ' + p.placeholder + ' -> ' + (enValue || 'NOT FOUND'));
}
console.log('总计: ' + placeholders.length + ' 个占位符');
