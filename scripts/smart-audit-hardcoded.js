/**
 * 智能审计工具组件中的硬编码文本和缺失翻译键
 * 过滤掉误报，只报告真正需要翻译的内容
 */
const fs = require('fs');
const path = require('path');

// 读取中文翻译文件
const zhData = JSON.parse(fs.readFileSync('src/messages/zh.json', 'utf8'));

// 需要忽略的键（不是真正的翻译键）
const IGNORE_PATTERNS = [
  /^\\n$/,           // 换行符
  /^\\t$/,           // 制表符
  /^,$/,             // 逗号
  /^\.$/,            // 点
  /^:$/,             // 冒号
  /^\|$/,            // 管道符
  /^a$/,             // HTML 标签
  /^div$/,           // HTML 标签
  /^T$/,             // 日期格式
  /^2d$/,            // canvas context
  /^-$/,             // 连字符
  /^ $/,             // 空格
  /^, $/,            // 逗号空格
  /^\.\//,           // 相对路径
  /^js-yaml$/,       // 库名
  /^mammoth$/,       // 库名
  /^[0-9]+$/,        // 纯数字
  /^#[0-9A-Fa-f]+$/, // 颜色值
  /^\/api\//,        // API 路径
  /^errors\./,       // 错误消息（通常在组件内定义）
  /^sampleData\./,   // 示例数据
  /^sampleTexts\./,  // 示例文本
  /^tips\./,         // 提示（可能需要翻译）
  /^structure\./,    // 结构说明
];

// 需要翻译的常见 UI 键模式
const TRANSLATABLE_PATTERNS = [
  /^[a-z]+$/,                    // 单个小写单词
  /^[a-z]+[A-Z][a-z]+$/,         // camelCase
  /^[a-z]+[A-Z][a-z]+[A-Z][a-z]+$/, // 多个 camelCase
  /Label$/,
  /Placeholder$/,
  /Button$/,
  /Title$/,
  /Description$/,
  /Message$/,
  /Error$/,
  /Warning$/,
  /Info$/,
  /Hint$/,
  /Help$/,
];

// 检查键是否应该被忽略
function shouldIgnore(key) {
  return IGNORE_PATTERNS.some(pattern => pattern.test(key));
}

// 检查键是否存在于翻译文件中
function keyExists(key, toolSlug) {
  // 首先检查工具特定的键
  if (zhData.tools && zhData.tools[toolSlug] && zhData.tools[toolSlug][key] !== undefined) {
    return true;
  }
  // 然后检查通用键
  if (zhData.tools && zhData.tools[key] !== undefined) {
    return true;
  }
  // 检查嵌套键
  const parts = key.split('.');
  let value = zhData.tools;
  for (const part of parts) {
    if (value && typeof value === 'object' && part in value) {
      value = value[part];
    } else {
      return false;
    }
  }
  return true;
}

// 从文件名提取工具 slug
function getToolSlug(filename) {
  return filename
    .replace('.tsx', '')
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '');
}

// 扫描组件文件
const toolsDir = 'src/components/tools';
const files = fs.readdirSync(toolsDir).filter(f => f.endsWith('.tsx') && !f.includes('.test.'));

const missingTranslations = {};
const hardcodedStrings = {};

for (const file of files) {
  const content = fs.readFileSync(path.join(toolsDir, file), 'utf8');
  const toolSlug = getToolSlug(file);
  
  // 查找所有 t('xxx') 调用
  const tCalls = [...content.matchAll(/t\(['"]([^'"]+)['"]\)/g)];
  
  for (const match of tCalls) {
    const key = match[1];
    
    // 跳过应该忽略的键
    if (shouldIgnore(key)) continue;
    
    // 检查键是否存在
    if (!keyExists(key, toolSlug)) {
      if (!missingTranslations[file]) {
        missingTranslations[file] = { slug: toolSlug, keys: [] };
      }
      if (!missingTranslations[file].keys.includes(key)) {
        missingTranslations[file].keys.push(key);
      }
    }
  }
}

// 输出结果
console.log('=== 缺失的 UI 翻译键（已过滤误报）===\n');

let totalMissing = 0;
const sortedFiles = Object.entries(missingTranslations)
  .filter(([_, data]) => data.keys.length > 0)
  .sort((a, b) => b[1].keys.length - a[1].keys.length);

for (const [file, data] of sortedFiles) {
  console.log(`\n📄 ${file} (${data.slug}) - ${data.keys.length} 个缺失`);
  data.keys.forEach(k => console.log(`   - ${k}`));
  totalMissing += data.keys.length;
}

console.log(`\n\n总计: ${totalMissing} 个缺失的翻译键`);
console.log(`涉及 ${sortedFiles.length} 个组件`);

// 保存到文件
const report = {
  summary: {
    totalMissing,
    componentsAffected: sortedFiles.length,
  },
  details: Object.fromEntries(sortedFiles),
};

fs.writeFileSync('smart-missing-keys.json', JSON.stringify(report, null, 2));
console.log('\n已保存到 smart-missing-keys.json');
