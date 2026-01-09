/**
 * 翻译质量审查脚本
 * 检查所有工具的翻译是否符合 SEO 和本土化要求
 */

const fs = require('fs');

const locales = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];

// 各语言的 SEO 关键词
const seoKeywords = {
  zh: ['免费', '在线', '工具'],
  ja: ['無料', 'オンライン'],
  ko: ['무료', '온라인'],
  es: ['gratis', 'online', 'gratuito'],
  pt: ['grátis', 'online', 'gratuito'],
  fr: ['gratuit', 'ligne'],
  de: ['kostenlos', 'online', 'gratis'],
  ru: ['бесплатн', 'онлайн'],
  ar: ['مجان', 'أونلاين'],
};

// 模板化描述的特征（需要重新翻译）
const templatePatterns = {
  zh: '是一个实用的在线工具',
  ja: '実用的なオンラインツール',
  ko: '실용적인 온라인 도구',
  es: 'herramienta en línea práctica',
  pt: 'ferramenta online prática',
  fr: 'outil en ligne pratique',
  de: 'praktisches Online-Tool',
  ru: 'практичный онлайн-инструмент',
  ar: 'أداة عبر الإنترنت عملية',
};

function main() {
  const enData = JSON.parse(fs.readFileSync('src/messages/en.json', 'utf8'));

  // 获取所有工具 slug
  const toolSlugs = Object.keys(enData.tools).filter(key => {
    const val = enData.tools[key];
    return typeof val === 'object' && val.name && val.description;
  });

  console.log('=== 翻译质量审查报告 ===\n');
  console.log('工具总数:', toolSlugs.length);
  console.log('');

  const needsRetranslation = new Set();
  const report = {};

  for (const locale of locales.filter(l => l !== 'en')) {
    const data = JSON.parse(fs.readFileSync(`src/messages/${locale}.json`, 'utf8'));
    
    const issues = {
      missing: [],
      templateLike: [],
      noSeoKeywords: [],
    };

    for (const slug of toolSlugs) {
      const tool = data.tools?.[slug];
      
      if (!tool || !tool.name) {
        issues.missing.push(slug);
        needsRetranslation.add(slug);
        continue;
      }
      
      // 检查是否是模板化翻译
      const desc = tool.detailed_description || '';
      if (templatePatterns[locale] && desc.includes(templatePatterns[locale])) {
        issues.templateLike.push(slug);
        needsRetranslation.add(slug);
      }
      
      // 检查 SEO 标题是否包含关键词
      const seoTitle = (tool.seo_title || '').toLowerCase();
      const keywords = seoKeywords[locale] || [];
      const hasKeyword = keywords.some(kw => seoTitle.includes(kw.toLowerCase()));
      if (!hasKeyword && tool.seo_title) {
        issues.noSeoKeywords.push(slug);
      }
    }

    report[locale] = issues;
    
    console.log(`${locale.toUpperCase()}:`);
    console.log(`  缺失翻译: ${issues.missing.length}`);
    console.log(`  模板化翻译: ${issues.templateLike.length}`);
    console.log(`  SEO缺关键词: ${issues.noSeoKeywords.length}`);
  }

  console.log('\n=== 需要重新翻译的工具 ===\n');
  console.log('总数:', needsRetranslation.size);
  
  if (needsRetranslation.size > 0 && needsRetranslation.size <= 20) {
    console.log('工具列表:', Array.from(needsRetranslation).join(', '));
  } else if (needsRetranslation.size > 20) {
    console.log('前20个:', Array.from(needsRetranslation).slice(0, 20).join(', '));
  }

  // 输出详细报告
  console.log('\n=== 各语言详细问题 ===\n');
  for (const [locale, issues] of Object.entries(report)) {
    if (issues.templateLike.length > 0) {
      console.log(`${locale} 模板化翻译 (${issues.templateLike.length}):`, 
        issues.templateLike.slice(0, 5).join(', ') + (issues.templateLike.length > 5 ? '...' : ''));
    }
  }
}

main();
