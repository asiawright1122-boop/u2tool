const fs = require('fs');
const path = require('path');

// 获取所有工具组件
const toolsDir = path.join(__dirname, '..', 'src', 'components', 'tools');
const files = fs.readdirSync(toolsDir).filter(f => f.endsWith('.tsx') && !f.includes('Wrapper') && !f.includes('index'));

// 常见的硬编码字符串模式
const hardcodedPatterns = [
  // 标签和标题
  />\s*([A-Z][a-z]+(?:\s+[A-Z]?[a-z]+)*)\s*</g,  // >Title Text<
  /label[^>]*>\s*([A-Z][a-z]+(?:\s+[A-Za-z]+)*)\s*</g,  // label>Text<
  /placeholder="([A-Za-z][^"]*[a-z])"/g,  // placeholder="Enter text"
  /title="([A-Za-z][^"]*[a-z])"/g,  // title="Some title"
];

// 排除的模式（技术术语、代码等）
const excludePatterns = [
  /^(JSON|XML|HTML|CSS|SQL|API|URL|URI|HTTP|HTTPS|SSL|TLS|UTF|ASCII|Base64|MD5|SHA|UUID|YAML|TOML|CSV|TSV|PDF|PNG|JPG|SVG|GIF|WebP|ICO)$/i,
  /^(PostgreSQL|MySQL|MongoDB|Redis|Elasticsearch|RabbitMQ|Docker|Kubernetes|Nginx|Apache)$/i,
  /^(Node|Python|Java|Go|Rust|Ruby|PHP|TypeScript|JavaScript|Swift|Kotlin|C#|Dart)$/i,
  /^(GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS)$/,
  /^(LF|CRLF|CR|Tab|Space)$/,
  /^[0-9]+$/,
  /^(true|false|null|undefined)$/,
  /^\w+:\/\//,  // URLs
  /^[a-z_-]+$/,  // lowercase identifiers
];

// 检查是否使用了翻译
function usesTranslation(content, toolSlug) {
  const hasToolSpecificT = content.includes(`useTranslations('tools.${toolSlug}')`);
  const hasGenericT = content.includes(`useTranslations('tools')`);
  return { hasToolSpecificT, hasGenericT };
}

// 提取硬编码字符串
function findHardcodedStrings(content, filename) {
  const issues = [];
  const lines = content.split('\n');
  
  lines.forEach((line, index) => {
    // 跳过注释和导入
    if (line.trim().startsWith('//') || line.trim().startsWith('*') || line.includes('import ')) return;
    
    // 检查 JSX 文本内容
    const jsxTextMatch = line.match(/>\s*([A-Z][a-zA-Z\s]+[a-z])\s*</g);
    if (jsxTextMatch) {
      jsxTextMatch.forEach(match => {
        const text = match.replace(/[><]/g, '').trim();
        if (text.length > 2 && !excludePatterns.some(p => p.test(text))) {
          // 检查是否在 t() 调用中
          if (!line.includes(`{t('`) && !line.includes(`{tCommon('`)) {
            issues.push({ line: index + 1, text, type: 'JSX text' });
          }
        }
      });
    }
    
    // 检查硬编码的标签
    const labelMatch = line.match(/(?:label|Label|title|Title|placeholder|Placeholder)[^>]*[>=]["']([A-Z][^"']+)["']/g);
    if (labelMatch) {
      labelMatch.forEach(match => {
        const textMatch = match.match(/["']([^"']+)["']/);
        if (textMatch) {
          const text = textMatch[1];
          if (text.length > 2 && !excludePatterns.some(p => p.test(text)) && !line.includes(`{t('`)) {
            issues.push({ line: index + 1, text, type: 'attribute' });
          }
        }
      });
    }
    
    // 检查直接的字符串文本（在 className 之外）
    if (!line.includes('className') && !line.includes('style=')) {
      const stringMatch = line.match(/"([A-Z][a-zA-Z\s,.:!?]+[a-z.!?])"/g);
      if (stringMatch) {
        stringMatch.forEach(match => {
          const text = match.replace(/"/g, '');
          if (text.length > 5 && !excludePatterns.some(p => p.test(text)) && !line.includes('placeholder=') && !line.includes('value=')) {
            // 排除代码模板
            if (!text.includes('const ') && !text.includes('function ') && !text.includes('import ')) {
              issues.push({ line: index + 1, text, type: 'string literal' });
            }
          }
        });
      }
    }
  });
  
  return issues;
}

// 从文件名提取工具 slug
function getToolSlug(filename) {
  return filename.replace('.tsx', '')
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '')
    .replace(/--/g, '-');
}

console.log('🔍 审查所有工具组件的硬编码字符串...\n');

const results = [];
let totalIssues = 0;

files.forEach(file => {
  const filePath = path.join(toolsDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const toolSlug = getToolSlug(file);
  
  const { hasToolSpecificT, hasGenericT } = usesTranslation(content, toolSlug);
  const issues = findHardcodedStrings(content, file);
  
  if (issues.length > 0 || (!hasToolSpecificT && hasGenericT)) {
    results.push({
      file,
      toolSlug,
      hasToolSpecificT,
      hasGenericT,
      issues
    });
    totalIssues += issues.length;
  }
});

// 输出结果
console.log('=' .repeat(80));
console.log('📊 审查结果摘要');
console.log('=' .repeat(80));
console.log(`总文件数: ${files.length}`);
console.log(`有问题的文件: ${results.length}`);
console.log(`总问题数: ${totalIssues}`);
console.log('');

// 按问题数量排序
results.sort((a, b) => b.issues.length - a.issues.length);

// 只显示有实际硬编码问题的文件
const filesWithHardcoded = results.filter(r => r.issues.length > 0);

if (filesWithHardcoded.length > 0) {
  console.log('\n⚠️  发现硬编码字符串的文件:\n');
  filesWithHardcoded.slice(0, 30).forEach(r => {
    console.log(`📁 ${r.file} (${r.issues.length} 个问题)`);
    console.log(`   工具 slug: ${r.toolSlug}`);
    console.log(`   使用工具特定翻译: ${r.hasToolSpecificT ? '✓' : '✗'}`);
    if (r.issues.length > 0) {
      console.log('   硬编码字符串:');
      r.issues.slice(0, 5).forEach(issue => {
        console.log(`     - 行 ${issue.line}: "${issue.text}" (${issue.type})`);
      });
      if (r.issues.length > 5) {
        console.log(`     ... 还有 ${r.issues.length - 5} 个问题`);
      }
    }
    console.log('');
  });
  
  if (filesWithHardcoded.length > 30) {
    console.log(`... 还有 ${filesWithHardcoded.length - 30} 个文件有问题\n`);
  }
}

// 检查使用通用翻译但可能需要工具特定翻译的文件
const needsToolSpecific = results.filter(r => !r.hasToolSpecificT && r.hasGenericT && r.issues.length > 0);
if (needsToolSpecific.length > 0) {
  console.log('\n🔧 建议使用工具特定翻译的文件:\n');
  needsToolSpecific.forEach(r => {
    console.log(`   - ${r.file} -> useTranslations('tools.${r.toolSlug}')`);
  });
}

console.log('\n✅ 审查完成！');
