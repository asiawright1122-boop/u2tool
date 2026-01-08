const fs = require('fs');
const path = require('path');

const messagesDir = path.join(__dirname, '..', 'src', 'messages');
const toolsDir = path.join(__dirname, '..', 'src', 'components', 'tools');

// 读取中文和英文翻译文件
const zhData = JSON.parse(fs.readFileSync(path.join(messagesDir, 'zh.json'), 'utf8'));
const enData = JSON.parse(fs.readFileSync(path.join(messagesDir, 'en.json'), 'utf8'));

console.log('=== 深度翻译审查 ===\n');

// 1. 检查中文翻译中与英文完全相同的值（可能未翻译）
function findIdenticalValues(enObj, zhObj, prefix = '') {
  const issues = [];
  
  for (const key in zhObj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    const zhValue = zhObj[key];
    const enValue = enObj?.[key];
    
    if (typeof zhValue === 'object' && zhValue !== null && !Array.isArray(zhValue)) {
      issues.push(...findIdenticalValues(enValue, zhValue, fullKey));
    } else if (typeof zhValue === 'string' && enValue === zhValue) {
      // 排除合理的相同值
      const skipPatterns = [
        /^https?:\/\//, // URLs
        /^[A-Z]{1,6}$/, // 短缩写 (BMR, TDEE, RGB, etc.)
        /^\d+(\.\d+)?$/, // 纯数字
        /^(kg|lbs|cm|ft|in|cal|L|ml|oz|px|em|rem|%)$/i, // 单位
        /^[A-Z][a-z]+ [A-Z][a-z]+$/, // 人名格式
        /^#[0-9A-Fa-f]{3,8}$/, // 颜色代码
        /^[a-z\-]+$/, // slug 格式
        /^(Facebook|Twitter|LinkedIn|Instagram|YouTube|GitHub|WordPress)$/i, // 品牌名
        /^(JSON|XML|HTML|CSS|SQL|API|URL|URI|UUID|JWT|TOTP|HMAC|SHA|MD5|AES|RSA|IPv4|IPv6|DNS|HTTP|HTTPS|SMTP|FTP|SSH|SSL|TLS)$/i, // 技术术语
      ];
      
      const shouldSkip = skipPatterns.some(p => p.test(zhValue));
      
      // 检查是否是英文句子或短语（包含多个英文单词）
      const isEnglishPhrase = /^[A-Za-z][A-Za-z\s\-\(\)\/\.\,\:\!\?\'\"]+[A-Za-z\.\!\?]$/.test(zhValue) && zhValue.length > 3;
      
      if (!shouldSkip && isEnglishPhrase) {
        issues.push({
          key: fullKey,
          value: zhValue
        });
      }
    }
  }
  
  return issues;
}

// 只检查 tools 命名空间
const toolsIssues = findIdenticalValues(enData.tools, zhData.tools, 'tools');

// 按工具分组
const byTool = {};
toolsIssues.forEach(issue => {
  const parts = issue.key.split('.');
  if (parts.length >= 2) {
    const toolSlug = parts[1];
    if (!byTool[toolSlug]) {
      byTool[toolSlug] = [];
    }
    byTool[toolSlug].push({
      key: parts.slice(2).join('.') || parts[1],
      fullKey: issue.key,
      value: issue.value
    });
  }
});

console.log(`发现 ${toolsIssues.length} 个可能未翻译的文本:\n`);

// 输出详细信息
const sortedTools = Object.keys(byTool).sort();
sortedTools.forEach(tool => {
  console.log(`\n📦 ${tool}:`);
  byTool[tool].forEach(item => {
    // 截断过长的值
    const displayValue = item.value.length > 60 ? item.value.substring(0, 60) + '...' : item.value;
    console.log(`   - ${item.key}: "${displayValue}"`);
  });
});

// 保存完整结果
fs.writeFileSync(
  path.join(__dirname, 'untranslated-audit.json'),
  JSON.stringify(byTool, null, 2)
);

console.log('\n\n完整结果已保存到 scripts/untranslated-audit.json');
console.log(`\n总计: ${sortedTools.length} 个工具, ${toolsIssues.length} 个未翻译项`);
