const fs = require('fs');

// 获取所有工具
const toolsContent = fs.readFileSync('src/config/tools.ts', 'utf-8');
const toolMatches = toolsContent.matchAll(/slug:\s*['"]([^'"]+)['"]/g);
const allTools = [...toolMatches].map(m => m[1]);

// 获取有 FAQ 的工具
const faqFiles = [
  'src/lib/tool-specific-faqs.ts',
  'src/lib/tool-specific-faqs-extra.ts',
  'src/lib/tool-specific-faqs-extra-2.ts',
];

// 添加所有 geo 文件
for (let i = 1; i <= 59; i++) {
  const suffix = i === 1 ? '' : '-' + i;
  faqFiles.push('src/lib/tool-specific-faqs-geo' + suffix + '.ts');
}

const toolsWithFAQ = new Set();
for (const file of faqFiles) {
  try {
    const content = fs.readFileSync(file, 'utf-8');
    const slugMatches = content.matchAll(/slug:\s*['"]([^'"]+)['"]/g);
    for (const match of slugMatches) {
      toolsWithFAQ.add(match[1]);
    }
  } catch (e) {}
}

// 找出没有 FAQ 的工具
const toolsWithoutFAQ = allTools.filter(t => !toolsWithFAQ.has(t));

console.log('Total:', allTools.length, 'With FAQ:', toolsWithFAQ.size, 'Without FAQ:', toolsWithoutFAQ.length);
console.log('\nTools without FAQ:');
toolsWithoutFAQ.forEach((t, i) => console.log((i+1) + '. ' + t));
