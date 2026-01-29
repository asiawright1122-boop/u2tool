/**
 * 扫描所有工具组件，找出所有缺失的翻译键
 * 包括使用 useTranslations('tools') 的组件
 */

const fs = require('fs');
const path = require('path');

const LOCALES = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];
const toolsDir = path.join(__dirname, '..', 'src', 'components', 'tools');

// 从文件名提取工具 slug
function getToolSlug(filename) {
  return filename.replace('.tsx', '')
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '')
    .replace(/--/g, '-');
}

// 从组件中提取使用的翻译键
function extractTranslationKeys(content) {
  const keys = new Set();
  // 只匹配 {t('key')} 格式，排除其他用途
  const regex = /\{t\('([a-zA-Z][a-zA-Z0-9_]{2,})'\)\}/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    // 排除明显不是翻译键的
    const key = match[1];
    if (key.length > 2 && !['div', 'svg', 'png', 'css', 'html', 'canvas', 'xlsx', 'jspdf', 'mammoth'].includes(key)) {
      keys.add(key);
    }
  }
  return Array.from(keys);
}

// 检查翻译模式
function getTranslationMode(content, toolSlug) {
  if (content.includes(`useTranslations('tools.${toolSlug}')`)) {
    return 'tool-specific';
  } else if (content.includes(`useTranslations('tools')`)) {
    return 'generic';
  }
  return 'none';
}

// 加载翻译文件
const enPath = path.join(__dirname, '..', 'src', 'messages', 'en.json');
const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));

// 获取所有通用翻译键（tools 根级别的字符串值）
const genericKeys = Object.entries(enData.tools)
  .filter(([k, v]) => typeof v === 'string')
  .map(([k]) => k);

console.log(`通用翻译键数量: ${genericKeys.length}`);


// 扫描所有组件
const files = fs.readdirSync(toolsDir).filter(f => 
  f.endsWith('.tsx') && 
  !f.includes('Wrapper') && 
  !f.includes('index') &&
  !f.includes('ECharts')
);

const missingGeneric = new Set(); // 缺失的通用键
const missingByTool = {}; // 缺失的工具特定键

files.forEach(file => {
  const filePath = path.join(toolsDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const toolSlug = getToolSlug(file);
  const mode = getTranslationMode(content, toolSlug);
  
  if (mode === 'none') return;
  
  const usedKeys = extractTranslationKeys(content);
  
  if (mode === 'generic') {
    // 检查通用键
    usedKeys.forEach(key => {
      if (!genericKeys.includes(key)) {
        missingGeneric.add(key);
      }
    });
  } else if (mode === 'tool-specific') {
    // 检查工具特定键
    const toolKeys = enData.tools[toolSlug] ? Object.keys(enData.tools[toolSlug]) : [];
    const missing = usedKeys.filter(key => !toolKeys.includes(key));
    if (missing.length > 0) {
      missingByTool[toolSlug] = { file, missing };
    }
  }
});

console.log('\n=== 缺失的通用翻译键 ===');
console.log(`数量: ${missingGeneric.size}`);
if (missingGeneric.size > 0) {
  console.log('键:', Array.from(missingGeneric).sort().join(', '));
}

console.log('\n=== 缺失的工具特定翻译键 ===');
console.log(`工具数: ${Object.keys(missingByTool).length}`);
Object.entries(missingByTool).forEach(([tool, info]) => {
  console.log(`\n${tool}: ${info.missing.join(', ')}`);
});
