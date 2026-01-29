/**
 * 深度审查 SEO 内容质量
 * 检查：
 * 1. 是否有通用模板内容（多个工具使用相同或相似的描述）
 * 2. 是否有未翻译的英文内容
 * 3. 是否有占位符残留
 * 4. SEO 内容是否与工具功能相关
 */
const fs = require('fs');

const LOCALES = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];

// 获取实际工具列表
const enData = JSON.parse(fs.readFileSync('src/messages/en.json', 'utf8'));
const realToolSlugs = [];
for (const [slug, tool] of Object.entries(enData.tools)) {
  if (typeof tool === 'object' && tool.name && tool.description && slug.includes('-')) {
    realToolSlugs.push(slug);
  }
}

console.log(`实际工具数量: ${realToolSlugs.length}\n`);

// 检查函数
function checkForTemplateContent(texts) {
  // 统计相似内容
  const similar = {};
  
  for (let i = 0; i < texts.length; i++) {
    for (let j = i + 1; j < texts.length; j++) {
      const t1 = texts[i].text.toLowerCase();
      const t2 = texts[j].text.toLowerCase();
      
      // 计算相似度（简单的词重叠）
      const words1 = new Set(t1.split(/\s+/).filter(w => w.length > 3));
      const words2 = new Set(t2.split(/\s+/).filter(w => w.length > 3));
      
      const intersection = [...words1].filter(w => words2.has(w));
      const similarity = intersection.length / Math.min(words1.size, words2.size);
      
      if (similarity > 0.8 && texts[i].slug !== texts[j].slug) {
        const key = `${texts[i].slug} <-> ${texts[j].slug}`;
        similar[key] = {
          similarity: (similarity * 100).toFixed(1) + '%',
          text1: texts[i].text.substring(0, 80),
          text2: texts[j].text.substring(0, 80)
        };
      }
    }
  }
  
  return similar;
}

function checkForEnglishContent(text, locale) {
  if (!text || locale === 'en') return false;
  
  // 非拉丁语系：检查是否只有 ASCII
  if (['zh', 'ja', 'ko', 'ru', 'ar'].includes(locale)) {
    if (/^[\x00-\x7F]+$/.test(text)) {
      // 排除纯技术术语
      const techTerms = /^[A-Z0-9\s\-\.\,\|\&\(\)\/\:\;\!\?\@\#\$\%\^\*\+\=\[\]\{\}\<\>\~\`\'\"\\]+$/i;
      if (!techTerms.test(text)) {
        return true;
      }
    }
  }
  
  return false;
}

function checkForPlaceholders(text) {
  if (!text) return false;
  // 检查占位符模式
  const placeholderPatterns = [
    /\[[\w\s]+\]/,  // [placeholder]
    /\{\{[\w\s]+\}\}/,  // {{placeholder}}
    /\$\{[\w\s]+\}/,  // ${placeholder}
    /__[\w]+__/,  // __placeholder__
  ];
  
  return placeholderPatterns.some(p => p.test(text));
}

function checkContentRelevance(slug, title, desc) {
  // 检查标题和描述是否与工具 slug 相关
  const slugWords = slug.split('-').filter(w => w.length > 2);
  const contentWords = (title + ' ' + desc).toLowerCase();
  
  // 至少有一个 slug 词出现在内容中
  const hasRelevantWord = slugWords.some(word => contentWords.includes(word));
  
  return hasRelevantWord;
}

// 主审查
const issues = {};

for (const locale of LOCALES) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📂 审查 ${locale.toUpperCase()}`);
  console.log('='.repeat(60));
  
  const filePath = `src/messages/${locale}.json`;
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  const localeIssues = {
    englishContent: [],
    placeholders: [],
    irrelevantContent: [],
    missingContent: [],
    duplicateTitles: [],
    duplicateDescs: [],
    shortTitles: [],
    shortDescs: []
  };
  
  const titles = [];
  const descs = [];
  const seenTitles = {};
  const seenDescs = {};
  
  for (const slug of realToolSlugs) {
    const tool = data.tools[slug];
    if (!tool) {
      localeIssues.missingContent.push(slug);
      continue;
    }
    
    const title = tool.seo_title;
    const desc = tool.seo_description;
    
    // 检查缺失
    if (!title || !desc) {
      localeIssues.missingContent.push({ slug, hasTitle: !!title, hasDesc: !!desc });
      continue;
    }
    
    // 检查英文内容
    if (checkForEnglishContent(title, locale)) {
      localeIssues.englishContent.push({ slug, field: 'seo_title', text: title.substring(0, 50) });
    }
    if (checkForEnglishContent(desc, locale)) {
      localeIssues.englishContent.push({ slug, field: 'seo_description', text: desc.substring(0, 50) });
    }
    
    // 检查占位符
    if (checkForPlaceholders(title)) {
      localeIssues.placeholders.push({ slug, field: 'seo_title', text: title });
    }
    if (checkForPlaceholders(desc)) {
      localeIssues.placeholders.push({ slug, field: 'seo_description', text: desc });
    }
    
    // 检查内容相关性
    if (!checkContentRelevance(slug, title, desc)) {
      localeIssues.irrelevantContent.push({ slug, title: title.substring(0, 40), desc: desc.substring(0, 40) });
    }
    
    // 检查重复
    if (seenTitles[title]) {
      localeIssues.duplicateTitles.push({ title: title.substring(0, 50), slugs: [seenTitles[title], slug] });
    } else {
      seenTitles[title] = slug;
    }
    
    if (seenDescs[desc]) {
      localeIssues.duplicateDescs.push({ desc: desc.substring(0, 50), slugs: [seenDescs[desc], slug] });
    } else {
      seenDescs[desc] = slug;
    }
    
    // 检查长度
    if (title.length < 20) {
      localeIssues.shortTitles.push({ slug, title, length: title.length });
    }
    if (desc.length < 80) {
      localeIssues.shortDescs.push({ slug, desc, length: desc.length });
    }
    
    titles.push({ slug, text: title });
    descs.push({ slug, text: desc });
  }
  
  // 输出问题
  let hasIssues = false;
  
  if (localeIssues.missingContent.length > 0) {
    hasIssues = true;
    console.log(`\n❌ 缺少 SEO 内容: ${localeIssues.missingContent.length} 个`);
    localeIssues.missingContent.slice(0, 5).forEach(item => {
      if (typeof item === 'string') {
        console.log(`   - ${item}`);
      } else {
        console.log(`   - ${item.slug} (title: ${item.hasTitle}, desc: ${item.hasDesc})`);
      }
    });
    if (localeIssues.missingContent.length > 5) {
      console.log(`   ... 还有 ${localeIssues.missingContent.length - 5} 个`);
    }
  }
  
  if (localeIssues.englishContent.length > 0) {
    hasIssues = true;
    console.log(`\n⚠️  仍为英文: ${localeIssues.englishContent.length} 个`);
    localeIssues.englishContent.slice(0, 5).forEach(item => {
      console.log(`   - ${item.slug} (${item.field}): "${item.text}..."`);
    });
    if (localeIssues.englishContent.length > 5) {
      console.log(`   ... 还有 ${localeIssues.englishContent.length - 5} 个`);
    }
  }
  
  if (localeIssues.placeholders.length > 0) {
    hasIssues = true;
    console.log(`\n🔲 占位符残留: ${localeIssues.placeholders.length} 个`);
    localeIssues.placeholders.forEach(item => {
      console.log(`   - ${item.slug} (${item.field}): "${item.text}"`);
    });
  }
  
  if (localeIssues.duplicateTitles.length > 0) {
    hasIssues = true;
    console.log(`\n🔄 重复标题: ${localeIssues.duplicateTitles.length} 组`);
    localeIssues.duplicateTitles.slice(0, 5).forEach(item => {
      console.log(`   - "${item.title}..."`);
      console.log(`     工具: ${item.slugs.join(', ')}`);
    });
    if (localeIssues.duplicateTitles.length > 5) {
      console.log(`   ... 还有 ${localeIssues.duplicateTitles.length - 5} 组`);
    }
  }
  
  if (localeIssues.duplicateDescs.length > 0) {
    hasIssues = true;
    console.log(`\n🔄 重复描述: ${localeIssues.duplicateDescs.length} 组`);
    localeIssues.duplicateDescs.slice(0, 5).forEach(item => {
      console.log(`   - "${item.desc}..."`);
      console.log(`     工具: ${item.slugs.join(', ')}`);
    });
    if (localeIssues.duplicateDescs.length > 5) {
      console.log(`   ... 还有 ${localeIssues.duplicateDescs.length - 5} 组`);
    }
  }
  
  if (localeIssues.shortTitles.length > 0) {
    hasIssues = true;
    console.log(`\n📏 标题过短 (<20字符): ${localeIssues.shortTitles.length} 个`);
    localeIssues.shortTitles.slice(0, 5).forEach(item => {
      console.log(`   - ${item.slug}: "${item.title}" (${item.length}字符)`);
    });
    if (localeIssues.shortTitles.length > 5) {
      console.log(`   ... 还有 ${localeIssues.shortTitles.length - 5} 个`);
    }
  }
  
  if (localeIssues.shortDescs.length > 0) {
    hasIssues = true;
    console.log(`\n📏 描述过短 (<80字符): ${localeIssues.shortDescs.length} 个`);
    localeIssues.shortDescs.slice(0, 5).forEach(item => {
      console.log(`   - ${item.slug}: "${item.desc}" (${item.length}字符)`);
    });
    if (localeIssues.shortDescs.length > 5) {
      console.log(`   ... 还有 ${localeIssues.shortDescs.length - 5} 个`);
    }
  }
  
  // 检查相似内容（模板化）
  const similarTitles = checkForTemplateContent(titles);
  const similarDescs = checkForTemplateContent(descs);
  
  if (Object.keys(similarTitles).length > 0) {
    hasIssues = true;
    console.log(`\n📋 相似标题（可能是模板）: ${Object.keys(similarTitles).length} 组`);
    Object.entries(similarTitles).slice(0, 5).forEach(([key, value]) => {
      console.log(`   - ${key} (${value.similarity})`);
      console.log(`     "${value.text1}..."`);
      console.log(`     "${value.text2}..."`);
    });
    if (Object.keys(similarTitles).length > 5) {
      console.log(`   ... 还有 ${Object.keys(similarTitles).length - 5} 组`);
    }
  }
  
  if (Object.keys(similarDescs).length > 0) {
    hasIssues = true;
    console.log(`\n📋 相似描述（可能是模板）: ${Object.keys(similarDescs).length} 组`);
    Object.entries(similarDescs).slice(0, 5).forEach(([key, value]) => {
      console.log(`   - ${key} (${value.similarity})`);
      console.log(`     "${value.text1}..."`);
      console.log(`     "${value.text2}..."`);
    });
    if (Object.keys(similarDescs).length > 5) {
      console.log(`   ... 还有 ${Object.keys(similarDescs).length - 5} 组`);
    }
  }
  
  if (!hasIssues) {
    console.log(`\n✅ 未发现明显问题`);
  }
  
  issues[locale] = localeIssues;
}

// 汇总
console.log(`\n\n${'='.repeat(60)}`);
console.log('📊 汇总');
console.log('='.repeat(60));

let totalIssues = 0;
for (const [locale, localeIssues] of Object.entries(issues)) {
  const count = 
    localeIssues.missingContent.length +
    localeIssues.englishContent.length +
    localeIssues.placeholders.length +
    localeIssues.duplicateTitles.length +
    localeIssues.duplicateDescs.length;
  
  if (count > 0) {
    console.log(`${locale}: ${count} 个问题`);
    totalIssues += count;
  }
}

if (totalIssues === 0) {
  console.log('✅ 所有语言的 SEO 内容都通过了深度审查！');
} else {
  console.log(`\n总计: ${totalIssues} 个问题需要修复`);
}
