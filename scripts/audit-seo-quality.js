/**
 * 审查 SEO 内容质量
 */
const fs = require('fs');

const zh = JSON.parse(fs.readFileSync('src/messages/zh.json', 'utf8'));
const en = JSON.parse(fs.readFileSync('src/messages/en.json', 'utf8'));

const issues = {
  duplicateTitles: [],
  duplicateDescriptions: [],
  shortTitles: [],
  shortDescriptions: [],
  missingKeywords: [],
  templateTitles: [],
  noLocalKeywords: []
};

const seenTitles = {};
const seenDescriptions = {};

// 检查中文 SEO
for (const [slug, tool] of Object.entries(zh.tools)) {
  if (typeof tool !== 'object') continue;
  
  const seoTitle = tool.seo_title || '';
  const seoDesc = tool.seo_description || '';
  
  // 检查重复标题
  if (seoTitle) {
    if (seenTitles[seoTitle]) {
      issues.duplicateTitles.push({ slug, title: seoTitle, duplicate: seenTitles[seoTitle] });
    } else {
      seenTitles[seoTitle] = slug;
    }
  }
  
  // 检查重复描述
  if (seoDesc) {
    if (seenDescriptions[seoDesc]) {
      issues.duplicateDescriptions.push({ slug, desc: seoDesc.substring(0, 50), duplicate: seenDescriptions[seoDesc] });
    } else {
      seenDescriptions[seoDesc] = slug;
    }
  }
  
  // 检查标题长度 (应该 30-60 字符)
  if (seoTitle && seoTitle.length < 20) {
    issues.shortTitles.push({ slug, title: seoTitle, length: seoTitle.length });
  }
  
  // 检查描述长度 (应该 120-160 字符)
  if (seoDesc && seoDesc.length < 50) {
    issues.shortDescriptions.push({ slug, desc: seoDesc, length: seoDesc.length });
  }
  
  // 检查是否包含中文关键词（免费、在线、工具）
  if (seoTitle && !/免费|在线|工具|生成器|转换器|计算器/.test(seoTitle)) {
    issues.noLocalKeywords.push({ slug, title: seoTitle });
  }
  
  // 检查是否是模板化标题
  if (seoTitle && /^Free .* Online/.test(seoTitle)) {
    issues.templateTitles.push({ slug, title: seoTitle });
  }
}

console.log('=== SEO 质量审查报告 ===\n');

console.log(`重复标题: ${issues.duplicateTitles.length} 个`);
issues.duplicateTitles.slice(0, 5).forEach(i => console.log(`  - ${i.slug}: "${i.title.substring(0, 40)}..."`));

console.log(`\n重复描述: ${issues.duplicateDescriptions.length} 个`);
issues.duplicateDescriptions.slice(0, 5).forEach(i => console.log(`  - ${i.slug}`));

console.log(`\n标题过短 (<20字符): ${issues.shortTitles.length} 个`);
issues.shortTitles.slice(0, 5).forEach(i => console.log(`  - ${i.slug}: "${i.title}" (${i.length}字符)`));

console.log(`\n描述过短 (<50字符): ${issues.shortDescriptions.length} 个`);
issues.shortDescriptions.slice(0, 5).forEach(i => console.log(`  - ${i.slug}: "${i.desc}" (${i.length}字符)`));

console.log(`\n缺少中文关键词: ${issues.noLocalKeywords.length} 个`);
issues.noLocalKeywords.slice(0, 10).forEach(i => console.log(`  - ${i.slug}: "${i.title}"`));

console.log(`\n模板化英文标题: ${issues.templateTitles.length} 个`);
issues.templateTitles.slice(0, 5).forEach(i => console.log(`  - ${i.slug}: "${i.title}"`));

// 输出需要优化的工具列表
const needsOptimization = new Set([
  ...issues.templateTitles.map(i => i.slug),
  ...issues.noLocalKeywords.map(i => i.slug),
  ...issues.shortDescriptions.map(i => i.slug)
]);

console.log(`\n=== 需要 SEO 优化的工具: ${needsOptimization.size} 个 ===`);
fs.writeFileSync('seo-needs-optimization.txt', [...needsOptimization].join('\n'));
console.log('已保存到 seo-needs-optimization.txt');
