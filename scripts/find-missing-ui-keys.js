/**
 * 扫描所有工具组件，找出缺失的 UI 翻译键
 */
const fs = require('fs');
const path = require('path');

// 读取中文翻译文件
const zhData = JSON.parse(fs.readFileSync('src/messages/zh.json', 'utf8'));

// 扫描组件文件
const toolsDir = 'src/components/tools';
const files = fs.readdirSync(toolsDir).filter(f => f.endsWith('.tsx'));

const missingKeys = {};

for (const file of files) {
  const content = fs.readFileSync(path.join(toolsDir, file), 'utf8');
  
  // 查找所有 t('xxx') 调用
  const tCalls = content.matchAll(/t\(['"]([^'"]+)['"]\)/g);
  
  for (const match of tCalls) {
    const key = match[1];
    
    // 检查这个键是否存在于翻译文件中
    const parts = key.split('.');
    let value = zhData.tools;
    let found = true;
    
    for (const part of parts) {
      if (value && typeof value === 'object' && part in value) {
        value = value[part];
      } else {
        found = false;
        break;
      }
    }
    
    if (!found) {
      const toolSlug = file.replace('.tsx', '').replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '');
      if (!missingKeys[file]) {
        missingKeys[file] = [];
      }
      if (!missingKeys[file].includes(key)) {
        missingKeys[file].push(key);
      }
    }
  }
}

// 输出结果
console.log('=== 缺失的 UI 翻译键 ===\n');

let totalMissing = 0;
for (const [file, keys] of Object.entries(missingKeys)) {
  if (keys.length > 0) {
    console.log(`\n📄 ${file} (${keys.length} 个缺失)`);
    keys.forEach(k => console.log(`   - ${k}`));
    totalMissing += keys.length;
  }
}

console.log(`\n总计: ${totalMissing} 个缺失的翻译键`);

// 保存到文件
fs.writeFileSync('missing-ui-keys.json', JSON.stringify(missingKeys, null, 2));
console.log('\n已保存到 missing-ui-keys.json');
